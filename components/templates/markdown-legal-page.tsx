import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

function parseInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded bg-[#f1f3f6] px-1 py-0.5 text-[0.9em]">{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <Link key={index} href={link[2]} className="font-semibold text-[#0a0b10] underline underline-offset-4">{link[1]}</Link>;
    return part;
  });
}

function slugify(text: string) {
  return text
    .replace(/\*\*/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractToc(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const label = line.slice(3).trim();
      return { label, href: `#${slugify(label)}` };
    });
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";
  let paragraph: string[] = [];
  let code: string[] = [];
  let tableRows: string[][] = [];
  let inCode = false;

  function flushParagraph() {
    if (!paragraph.length) return;
    nodes.push(<p key={`p-${nodes.length}`}>{parseInline(paragraph.join(" "))}</p>);
    paragraph = [];
  }

  function flushList() {
    if (!listItems.length) return;
    const Tag = listType;
    nodes.push(<Tag key={`${listType}-${nodes.length}`} className={`ml-5 space-y-1 ${listType === "ol" ? "list-decimal" : "list-disc"}`}>{listItems.map((item) => <li key={item}>{parseInline(item)}</li>)}</Tag>);
    listItems = [];
    listType = "ul";
  }

  function flushCode() {
    if (!code.length) return;
    nodes.push(<pre key={`pre-${nodes.length}`} className="overflow-x-auto rounded-lg bg-[#101318] p-4 text-xs leading-6 text-white"><code>{code.join("\n")}</code></pre>);
    code = [];
  }

  function flushTable() {
    if (!tableRows.length) return;
    const [header, divider, ...body] = tableRows;
    const hasDivider = divider?.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
    const rows = hasDivider ? body : tableRows.slice(1);
    nodes.push(
      <div key={`table-${nodes.length}`} className="overflow-x-auto rounded-xl border border-[#e7e9ef]">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#f7f8fa] text-[#0a0b10]">
            <tr>{header.map((cell) => <th key={cell} className="border-b border-[#e7e9ef] px-4 py-3 font-semibold">{parseInline(cell.trim())}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`} className="border-t border-[#eef0f4]">
                {row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="px-4 py-3 align-top">{parseInline(cell.trim())}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    tableRows = [];
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    if (line.startsWith("```")) {
      if (inCode) {
        inCode = false;
        flushCode();
      } else {
        flushParagraph();
        flushList();
        inCode = true;
      }
      return;
    }
    if (inCode) {
      code.push(rawLine);
      return;
    }
    if (!line.trim() || line.trim() === "---") {
      flushParagraph();
      flushList();
      flushTable();
      return;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      flushTable();
      nodes.push(<h1 key={`h1-${nodes.length}`} className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{parseInline(line.slice(2))}</h1>);
      return;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      flushTable();
      const title = line.slice(3);
      nodes.push(<h2 id={slugify(title)} key={`h2-${nodes.length}`} className="mt-8 scroll-mt-28 text-2xl font-semibold tracking-[-0.03em]">{parseInline(title)}</h2>);
      return;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      flushTable();
      nodes.push(<h3 key={`h3-${nodes.length}`} className="mt-5 text-lg font-semibold">{parseInline(line.slice(4))}</h3>);
      return;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      flushTable();
      if (listType !== "ul") flushList();
      listType = "ul";
      listItems.push(line.slice(2));
      return;
    }
    if (/^\d+\.\s/.test(line)) {
      flushParagraph();
      flushTable();
      if (listType !== "ol") flushList();
      listType = "ol";
      listItems.push(line.replace(/^\d+\.\s/, ""));
      return;
    }
    if (line.startsWith("|")) {
      flushParagraph();
      flushList();
      tableRows.push(line.split("|").slice(1, -1));
      return;
    }
    flushTable();
    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushCode();
  flushTable();
  return nodes;
}

export function MarkdownLegalPage({ fileName }: { fileName: string }) {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content", "legal", fileName), "utf8");
  const toc = extractToc(markdown);
  const renderedContent = renderMarkdown(markdown);
  const tocNav = toc.length > 6 ? (
    <nav className="rounded-xl border border-[#e7e9ef] bg-[#fbfcff] p-4" aria-label="Table of contents">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#515763]">On this page</p>
      <ol className="mt-3 grid gap-2 sm:grid-cols-2">
        {toc.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-[#424657] hover:text-[#0a0b10]">{item.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
  ) : null;

  return (
    <main className="min-h-screen bg-[#fbfcff] px-5 py-8 text-[#0a0b10]">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <Link href="/" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#515763]">T3 Labs</Link>
        <article className="grid gap-4 rounded-xl border border-[#e7e9ef] bg-white p-6 text-sm leading-7 text-[#424657] shadow-[0_10px_32px_rgba(24,31,51,0.05)] sm:p-8">
          {renderedContent[0]}
          {tocNav}
          {renderedContent.slice(1)}
        </article>
        <footer className="grid gap-4 text-xs text-[#606575]">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal footer">
            <Link href="/privacy" className="hover:text-[#0a0b10]">Privacy</Link>
            <Link href="/cookies" className="hover:text-[#0a0b10]">Cookies</Link>
            <Link href="/terms" className="hover:text-[#0a0b10]">Terms</Link>
          </nav>
          <p>© 2026 T3 Labs · T3 Labs is a trading name of T3 Play Limited (NZ Company 9148617).</p>
        </footer>
      </div>
    </main>
  );
}
