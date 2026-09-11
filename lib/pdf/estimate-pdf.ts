import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import type { Estimate } from '../pricing/estimate-engine';
import { getAssistantConfig, getBusiness } from '../assistant/data';

/**
 * Indicative Roofing Estimate PDF (spec 14).
 * Rendered exclusively from the canonical estimate object. The model never
 * supplies document pricing content.
 */

function colourFromHex(hex: string) {
  const clean = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.slice(1) : '1769E0';
  return rgb(parseInt(clean.slice(0, 2), 16) / 255, parseInt(clean.slice(2, 4), 16) / 255, parseInt(clean.slice(4, 6), 16) / 255);
}
const DARK = rgb(0.11, 0.13, 0.17);
const GREY = rgb(0.45, 0.5, 0.58);
const LIGHT = rgb(0.96, 0.97, 0.99);
const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 48;

function fmtMoney(n: number, symbol: string): string {
  return `${symbol}${n.toLocaleString('en-GB')}`;
}

interface Ctx {
  page: PDFPage;
  y: number;
  doc: PDFDocument;
  regular: PDFFont;
  bold: PDFFont;
}

function ensureSpace(ctx: Ctx, needed: number) {
  if (ctx.y - needed < MARGIN + 60) {
    ctx.page = ctx.doc.addPage([PAGE_W, PAGE_H]);
    ctx.y = PAGE_H - MARGIN;
  }
}

function text(
  ctx: Ctx,
  str: string,
  opts: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; x?: number } = {}
) {
  const size = opts.size ?? 10;
  const font = opts.bold ? ctx.bold : ctx.regular;
  const width = font.widthOfTextAtSize(str, size);
  const x = opts.x ?? MARGIN;
  if (x + width > PAGE_W - MARGIN) {
    // crude wrap
    const words = str.split(' ');
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > PAGE_W - MARGIN - (x - MARGIN)) {
        ctx.page.drawText(line, { x, y: ctx.y, size, font, color: opts.color ?? DARK });
        ctx.y -= size + 3;
        line = w;
      } else {
        line = test;
      }
    }
    ctx.page.drawText(line, { x, y: ctx.y, size, font, color: opts.color ?? DARK });
  } else {
    ctx.page.drawText(str, { x, y: ctx.y, size, font, color: opts.color ?? DARK });
  }
}

export async function renderEstimatePdf(estimate: Estimate): Promise<Uint8Array> {
  const business = getBusiness();
  const config = getAssistantConfig();
  const BLUE = colourFromHex(config.accentColor ?? '#1769E0');
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.setTitle(`${business.business.name} - Indicative Estimate ${estimate.id}`);
  doc.setAuthor(business.business.name);
  doc.setSubject('Interactive demo - indicative estimate only');

  const page = doc.addPage([PAGE_W, PAGE_H]);
  const ctx: Ctx = { page, y: PAGE_H - MARGIN, doc, regular, bold };

  // Header band
  ctx.page.drawRectangle({ x: 0, y: PAGE_H - 92, width: PAGE_W, height: 92, color: BLUE });
  ctx.page.drawText(business.business.name, { x: MARGIN, y: PAGE_H - 46, size: 20, font: bold, color: rgb(1, 1, 1) });
  ctx.page.drawText('Indicative Roofing Estimate', { x: MARGIN, y: PAGE_H - 64, size: 11, font: regular, color: rgb(1, 1, 1) });
  ctx.page.drawText('Interactive Demo - fictional company', {
    x: MARGIN, y: PAGE_H - 80, size: 8, font: regular, color: rgb(0.85, 0.9, 1),
  });
  ctx.y = PAGE_H - 116;

  // Reference + date
  const created = new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });
  text(ctx, `Estimate reference: ${estimate.id}`, { size: 10, bold: true });
  ctx.y -= 14;
  text(ctx, `Date: ${created}`, { size: 9, color: GREY });
  text(ctx, `Pricing catalogue: ${estimate.catalogVersion}`, { size: 9, color: GREY, x: PAGE_W - MARGIN - 190 });
  ctx.y -= 24;

  // Project inputs
  text(ctx, 'Project details', { size: 12, bold: true });
  ctx.y -= 16;
  const p = estimate.project;
  const rows: [string, string][] = [
    ['Roof area', `${p.roofArea.toLocaleString('en-GB')} m2 (${p.areaType.replace(/_/g, ' ')})`],
    ['Roof shape', p.roofShape === 'unknown' ? 'Not specified' : p.roofShape.replace(/_/g, ' ')],
    ['Pitch', `${p.pitchDegrees} degrees`],
    ['Material', p.materialLabel],
    ['Scope', p.componentScope.replace(/_/g, ' ')],
    ['Status', 'Indicative estimate - not a formal quote'],
  ];
  for (const [k, v] of rows) {
    text(ctx, `${k}:`, { size: 10, color: GREY });
    text(ctx, v, { size: 10, bold: true, x: MARGIN + 120 });
    ctx.y -= 15;
  }
  ctx.y -= 14;

  // Line items table
  text(ctx, 'Pricing breakdown', { size: 12, bold: true });
  ctx.y -= 16;
  const colQ = 300;
  const colR = 400;
  const colS = PAGE_W - MARGIN;
  ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - 4, width: PAGE_W - MARGIN * 2, height: 18, color: LIGHT });
  text(ctx, 'Item', { size: 9, bold: true });
  text(ctx, 'Qty x Rate', { size: 9, bold: true, x: colQ });
  text(ctx, 'Subtotal', { size: 9, bold: true, x: colR });
  ctx.y -= 20;
  for (const li of estimate.lineItems) {
    ensureSpace(ctx, 20);
    text(ctx, li.label, { size: 9 });
    text(ctx, `${li.quantity.toLocaleString('en-GB')} ${li.unit} x ${fmtMoney(li.rate, estimate.symbol)}${li.quantitySource === 'heuristic' ? ' (allowance)' : ''}`, { size: 9, x: colQ });
    const s = fmtMoney(li.subtotal, estimate.symbol);
    text(ctx, s, { size: 9, x: colS - regular.widthOfTextAtSize(s, 9) });
    ctx.y -= 15;
  }
  ctx.y -= 6;
  ensureSpace(ctx, 40);
  ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - 6, width: PAGE_W - MARGIN * 2, height: 26, color: BLUE });
  const totalLabel = 'Indicative total';
  const totalStr = `${fmtMoney(estimate.total, estimate.symbol)} ${estimate.currency}`;
  text(ctx, totalLabel, { size: 12, bold: true, color: rgb(1, 1, 1) });
  text(ctx, totalStr, {
    size: 12, bold: true, color: rgb(1, 1, 1), x: colS - bold.widthOfTextAtSize(totalStr, 12),
  });
  ctx.y -= 34;

  // Assumptions
  ensureSpace(ctx, 60);
  text(ctx, 'Assumptions', { size: 12, bold: true });
  ctx.y -= 15;
  for (const a of estimate.assumptions) {
    ensureSpace(ctx, 16);
    text(ctx, `- ${a}`, { size: 9, color: GREY });
    ctx.y -= 13;
  }
  ctx.y -= 10;

  // Exclusions
  if (estimate.exclusions.length > 0) {
    ensureSpace(ctx, 60);
    text(ctx, 'Exclusions', { size: 12, bold: true });
    ctx.y -= 15;
    for (const e of estimate.exclusions) {
      ensureSpace(ctx, 16);
      text(ctx, `- ${e}`, { size: 9, color: GREY });
      ctx.y -= 13;
    }
    ctx.y -= 10;
  }

  // Disclaimer + CTA
  ensureSpace(ctx, 90);
  text(ctx, estimate.disclaimer, { size: 8, color: GREY });
  ctx.y -= 18;
  text(ctx, `Interactive demo by T3 Labs. ${business.business.demo ? business.business.name + ' is fictional; no real quote or contact will follow.' : ''}`, {
    size: 8, color: GREY,
  });
  ctx.y -= 26;
  text(ctx, 'Want a formal, site-accurate quote?', { size: 11, bold: true });
  ctx.y -= 15;
  text(ctx, `Reply in the assistant or use the enquiry form to continue with the ${business.business.name} team${business.business.demo ? ' (demo)' : ''}.`, {
    size: 9, color: GREY,
  });

  return doc.save();
}
