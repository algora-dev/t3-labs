import type { AssistantSession } from './session';
import { getBusiness } from './data';

export interface InquirySubmission {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  question?: unknown;
  project?: {
    projectType?: unknown;
    roofArea?: unknown;
    areaType?: unknown;
    roofShape?: unknown;
    pitchDegrees?: unknown;
    material?: unknown;
    location?: unknown;
    estimateScope?: unknown;
    components?: unknown;
    extras?: unknown;
  };
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, 1000) : null;
}
function num(v: unknown): number | null {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

export function validateInquirySubmission(sub: InquirySubmission): { ok: true } | { ok: false; error: string } {
  const name = str(sub.name);
  const email = str(sub.email);
  const phone = str(sub.phone);
  if (!name) return { ok: false, error: 'Please provide your name.' };
  if (!email && !phone) return { ok: false, error: 'Please provide an email address or phone number so the team can respond.' };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: 'That email address does not look right - please check it.' };
  if (phone && phone.replace(/[^\d]/g, '').length < 7) return { ok: false, error: 'That phone number does not look right - please check it.' };
  return { ok: true };
}

function buildProjectSummary(project: Record<string, unknown>, estimateTotal: string | null): string {
  const parts: string[] = [];
  if (project.projectType) parts.push(String(project.projectType));
  if (project.roofArea) parts.push(`${project.roofArea} m²`);
  if (project.roofShape) parts.push(String(project.roofShape).replace(/_/g, ' '));
  if (project.material) parts.push(String(project.material));
  if (estimateTotal) parts.push(`indicative estimate ${estimateTotal}`);
  return parts.length ? parts.join(' | ') : 'General roofing enquiry';
}

export function buildInquiryPayload(session: AssistantSession, sub: InquirySubmission) {
  const p = sub.project ?? {};
  const facts = session.facts;
  const estimateId = session.estimateFlow.latestEstimateId;
  const estimate = estimateId ? session.estimates[estimateId] ?? null : null;

  const name = str(sub.name);
  const email = str(sub.email);
  const phone = str(sub.phone);
  if (name) session.lead.name = name;
  if (email) session.lead.email = email;
  if (phone) session.lead.phone = phone;

  const extrasRaw = Array.isArray(p.extras)
    ? p.extras.filter((e): e is string => typeof e === 'string').slice(0, 20)
    : facts.extras;
  const componentsRaw = Array.isArray(p.components) ? p.components : facts.components;

  const project = {
    projectType: str(p.projectType) ?? facts.projectType,
    roofArea: num(p.roofArea) ?? facts.roofArea,
    areaType: str(p.areaType) ?? facts.areaType,
    roofShape: str(p.roofShape) ?? facts.roofShape,
    pitchDegrees: num(p.pitchDegrees) ?? facts.pitchDegrees,
    material: str(p.material) ?? facts.material,
    location: str(p.location) ?? facts.location,
    estimateScope: str(p.estimateScope) ?? facts.estimateScope,
    components: componentsRaw,
    extras: extrasRaw,
  };

  const estimatePayload = estimate
    ? {
        id: estimate.id,
        catalogVersion: estimate.catalogVersion,
        total: estimate.total,
        currency: estimate.currency,
        symbol: estimate.symbol,
        status: estimate.status,
        scope: estimate.project.componentScope,
        lineItems: estimate.lineItems,
        assumptions: estimate.assumptions,
        disclaimer: estimate.disclaimer,
      }
    : null;
  const estimateTotal = estimate ? `${estimate.symbol}${estimate.total.toLocaleString()} ${estimate.currency}` : null;

  return {
    business: getBusiness().business.name,
    channel: 'smart-assistant-demo',
    contact: { name, email: email ?? null, phone: phone ?? null },
    summary: buildProjectSummary(project, estimateTotal),
    project,
    estimate: estimatePayload,
    customerNote: str(sub.question),
    conversationContext: session.messages.slice(-12),
    submittedAt: new Date().toISOString(),
  };
}
