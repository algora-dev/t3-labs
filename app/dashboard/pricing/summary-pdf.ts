// Client-side PDF generation for internal ballpark summaries.
// Zero dependencies: minimal PDF 1.4 writer with Helvetica text on A4 pages.
// Everything stays in the browser - no server, no database, no storage.

export type PdfLineItem = { group: string; label: string; setup: number; monthly: number };

export type PdfEstimate = {
  name: string;
  generatedAt: string;
  features: string[];
  lines: PdfLineItem[];
  setup: number;
  monthly: number;
  notes: string[];
  version: string;
};

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 52;
const BOTTOM = 72;
const COL_SETUP = 420;
const COL_MONTHLY = 506;

const money = (value: number) => "$" + value.toLocaleString("en-US");

const esc = (text: string) =>
  text
    .replace(/[^\x20-\x7e]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

const wrap = (text: string, maxChars: number): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const rows: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars && current) {
      rows.push(current);
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) rows.push(current);
  return rows.length ? rows : [""];
};

class PdfBuilder {
  private pages: string[] = [];
  private ops: string[] = [];
  private y = PAGE_H - MARGIN;

  constructor() {
    this.pages.push("");
  }

  private flush(): void {
    this.pages[this.pages.length - 1] = this.ops.join("\n");
  }

  private footer(): void {
    this.ops.push(
      `BT 0.5 g /F1 8 Tf 1 0 0 1 ${MARGIN} 38 Tm (${esc("T3 Labs internal use only. Provisional ballpark, not a quote.")}) Tj ET`,
    );
  }

  private breakPage(): void {
    this.footer();
    this.flush();
    this.ops = [];
    this.pages.push("");
    this.y = PAGE_H - MARGIN;
  }

  ensure(height: number): void {
    if (this.y - height < BOTTOM) this.breakPage();
  }

  text(str: string, x: number, size: number, options: { bold?: boolean; gray?: number } = {}): void {
    const font = options.bold ? "F2" : "F1";
    const gray = options.gray ?? 0;
    this.ops.push(`BT ${gray} g /${font} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${this.y.toFixed(2)} Tm (${esc(str)}) Tj ET`);
  }

  rightText(str: string, size: number, options: { bold?: boolean; gray?: number } = {}): void {
    // Approximate Helvetica width (~0.5em average) for right alignment.
    const width = str.length * size * 0.5;
    this.text(str, PAGE_W - MARGIN - width, size, options);
  }

  columnText(str: string, x: number, size: number, options: { bold?: boolean; gray?: number } = {}): void {
    this.text(str, x, size, options);
  }

  rule(gray = 0.85, height = 0.8): void {
    this.ops.push(`${gray} g ${MARGIN} ${this.y.toFixed(2)} ${(PAGE_W - MARGIN * 2).toFixed(2)} ${height} re f`);
  }

  move(delta: number): void {
    this.y -= delta;
  }

  build(): string[] {
    this.footer();
    this.flush();
    return this.pages;
  }
}

function renderPages(input: PdfEstimate): string[] {
  const pdf = new PdfBuilder();

  // Header
  pdf.text("T3 Labs", MARGIN, 20, { bold: true });
  pdf.move(22);
  pdf.text("Internal ballpark estimate", MARGIN, 10.5, { gray: 0.45 });
  pdf.move(24);
  pdf.rule(0.8);
  pdf.move(18);

  // Meta block
  pdf.text(input.name, MARGIN, 14, { bold: true });
  pdf.move(16);
  pdf.text(`Generated: ${input.generatedAt} | Pricing model: ${input.version}`, MARGIN, 9, { gray: 0.5 });
  pdf.move(20);

  // Scope
  if (input.features.length) {
    pdf.ensure(18 + input.features.length * 15);
    pdf.text("Scope", MARGIN, 11, { bold: true });
    pdf.move(16);
    for (const feature of input.features) {
      pdf.ensure(15);
      pdf.text(`-  ${feature}`, MARGIN + 6, 10, { gray: 0.25 });
      pdf.move(15);
    }
    pdf.move(8);
  }

  // Line items
  pdf.ensure(34);
  pdf.text("Price breakdown", MARGIN, 11, { bold: true });
  pdf.move(15);
  pdf.columnText("Setup (USD)", COL_SETUP, 8.5, { bold: true, gray: 0.45 });
  pdf.columnText("Monthly (USD)", COL_MONTHLY, 8.5, { bold: true, gray: 0.45 });
  pdf.move(12);

  let lastGroup = "";
  for (const line of input.lines) {
    const groupChanged = line.group !== lastGroup;
    const height = (groupChanged ? 22 : 15) + 2;
    pdf.ensure(height);
    if (groupChanged) {
      pdf.text(line.group.toUpperCase(), MARGIN, 8, { bold: true, gray: 0.5 });
      pdf.move(13);
      lastGroup = line.group;
    }
    pdf.text(line.label, MARGIN + 6, 10);
    pdf.columnText(line.setup ? money(line.setup) : "-", COL_SETUP, 10);
    pdf.columnText(line.monthly ? money(line.monthly) : "-", COL_MONTHLY, 10);
    pdf.move(15);
  }

  // Totals
  pdf.move(6);
  pdf.ensure(58);
  pdf.rule(0.5, 1);
  pdf.move(18);
  pdf.text("Total setup", MARGIN, 11.5, { bold: true });
  pdf.columnText(money(input.setup), COL_SETUP, 11.5, { bold: true });
  pdf.move(17);
  pdf.text("Total monthly", MARGIN, 11.5, { bold: true });
  pdf.columnText(money(input.monthly), COL_MONTHLY, 11.5, { bold: true });
  pdf.move(26);

  // Notes
  if (input.notes.length) {
    pdf.ensure(20 + input.notes.length * 13);
    pdf.text("Notes", MARGIN, 9.5, { bold: true });
    pdf.move(14);
    for (const note of input.notes) {
      for (const row of wrap(note, 100)) {
        pdf.ensure(12);
        pdf.text(row, MARGIN, 9, { gray: 0.4 });
        pdf.move(12);
      }
    }
  }

  return pdf.build();
}

export function buildEstimatePdf(input: PdfEstimate): Uint8Array<ArrayBuffer> {
  const contents = renderPages(input);
  const encoder = new TextEncoder();

  // Object numbering: 1 catalog, 2 pages, 3 F1, 4 F2, then page/content pairs.
  const pageCount = contents.length;
  const kids: string[] = [];
  for (let i = 0; i < pageCount; i++) kids.push(`${5 + i * 2} 0 R`);

  const parts: string[] = [];
  const offsets: number[] = [];
  let body = "%PDF-1.4\n";

  const addObject = (content: string): number => {
    offsets.push(body.length);
    body += content;
    return offsets.length; // object number
  };

  const catalogNum = addObject(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  const pagesNum = addObject(
    `2 0 obj\n<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pageCount} >>\nendobj\n`,
  );
  const f1Num = addObject(`3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);
  const f2Num = addObject(`4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);

  for (let i = 0; i < pageCount; i++) {
    const stream = contents[i];
    const streamBytes = encoder.encode(stream).length;
    addObject(
      `${5 + i * 2} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${f1Num} 0 R /F2 ${f2Num} 0 R >> >> /Contents ${6 + i * 2} 0 R >>\nendobj\n`,
    );
    addObject(
      `${6 + i * 2} 0 obj\n<< /Length ${streamBytes} >>\nstream\n${stream}\nendstream\nendobj\n`,
    );
  }

  const objectCount = offsets.length;
  const xrefOffset = body.length;
  let xref = `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  body += xref;
  body += `trailer\n<< /Size ${objectCount + 1} /Root ${catalogNum} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  void pagesNum;
  const encoded = encoder.encode(body);
  const bytes = new Uint8Array(encoded.byteLength);
  bytes.set(encoded);
  return bytes;
}
