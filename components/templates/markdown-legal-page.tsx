import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { proposalLegalLinks } from "@/lib/website-package-terms";

function parseInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded bg-[#f1f3f6] px-1 py-0.5 text-[0.9em]">{part.slice(1, -1)}</code>;
    return part;
  });
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let paragraph: string[] = [];
  let code: string[] = [];
  let inCode = false;

  function flushParagraph() {
    if (!paragraph.length) return;
    nodes.push(<p key={`p-${nodes.length}`}>{parseInline(paragraph.join(" "))}</p>);
    paragraph = [];
  }

  function flushList() {
    if (!listItems.length) return;
    nodes.push(<ul key={`ul-${nodes.length}`} className="ml-5 list-disc space-y-1">{listItems.map((item) => <li key={item}>{parseInline(item)}</li>)}</ul>);
    listItems = [];
  }

  function flushCode() {
    if (!code.length) return;
    nodes.push(<pre key={`pre-${nodes.length}`} className="overflow-x-auto rounded-lg bg-[#101318] p-4 text-xs leading-6 text-white"><code>{code.join("\n")}</code></pre>);
    code = [];
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
      return;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      nodes.push(<h1 key={`h1-${nodes.length}`} className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">{parseInline(line.slice(2))}</h1>);
      return;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      nodes.push(<h2 key={`h2-${nodes.length}`} className="mt-7 text-2xl font-black tracking-[-0.03em]">{parseInline(line.slice(3))}</h2>);
      return;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      nodes.push(<h3 key={`h3-${nodes.length}`} className="mt-5 text-lg font-black">{parseInline(line.slice(4))}</h3>);
      return;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2));
      return;
    }
    if (/^\d+\.\s/.test(line)) {
      flushParagraph();
      listItems.push(line.replace(/^\d+\.\s/, ""));
      return;
    }
    if (line.startsWith("|")) {
      flushParagraph();
      flushList();
      nodes.push(<p key={`table-${nodes.length}`} className="rounded-lg bg-[#f7f8fa] p-3 font-mono text-xs">{line}</p>);
      return;
    }
    paragraph.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushCode();
  return nodes;
}

export function MarkdownLegalPage({ fileName }: { fileName: string }) {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content", "legal", fileName), "utf8");

  return (
    <main className="min-h-screen bg-[#fbfcff] px-5 py-8 text-[#0a0b10]">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <Link href="/" className="text-xs font-black uppercase tracking-[0.16em] text-[#758300]">T3 Labs</Link>
        <article className="grid gap-4 rounded-xl border border-[#e7e9ef] bg-white p-6 text-sm leading-7 text-[#424657] shadow-[0_10px_32px_rgba(24,31,51,0.05)] sm:p-8">
          {renderMarkdown(markdown)}
        </article>
        <footer className="grid gap-4 text-xs text-[#606575]">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal footer">
            {proposalLegalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#0a0b10]">{link.label}</Link>
            ))}
          </nav>
          <p>T3 Labs is a trading name of T3 Play Limited, registered in New Zealand.</p>
        </footer>
      </div>
    </main>
  );
}
