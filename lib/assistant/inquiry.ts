import type { AssistantSession } from './session';
import { getBusiness } from './data';

export interface InquirySubmission {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  question?: unknown;
  attachments?: unknown;
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
  const attachmentsError = validateAttachments(sub.attachments);
  if (attachmentsError) return { ok: false, error: attachmentsError };
  return { ok: true };
}

const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 2_500_000;
const ALLOWED_ATTACHMENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain'];

export interface InquiryAttachment {
  name: string;
  contentType: string;
  sizeBytes: number;
}

/** Attachments are optional. Demo mode keeps metadata only; live deployments should store files in object storage and retain references. */
function validateAttachments(value: unknown): string | null {
  if (value == null) return null;
  if (!Array.isArray(value)) return 'Invalid attachments.';
  if (value.length > MAX_ATTACHMENTS) return `Please attach no more than ${MAX_ATTACHMENTS} files.`;
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') return 'Invalid attachment.';
    const a = raw as Record<string, unknown>;
    const name = str(a.name);
    const contentType = str(a.contentType);
    const sizeBytes = typeof a.sizeBytes === 'number' ? a.sizeBytes : NaN;
    if (!name || name.length > 200) return 'One of the attachments has an invalid file name.';
    if (!contentType || !ALLOWED_ATTACHMENT_TYPES.includes(contentType)) return `"${name}" is not a supported file type (images, PDF or text).`;
    if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_ATTACHMENT_BYTES) return `"${name}" is too large - please keep files under 2.5 MB.`;
  }
  return null;
}

function normaliseAttachments(value: unknown): InquiryAttachment[] {
  if (!Array.isArray(value)) return [];
  const out: InquiryAttachment[] = [];
  for (const raw of value.slice(0, MAX_ATTACHMENTS)) {
    if (!raw || typeof raw !== 'object') continue;
    const a = raw as Record<string, unknown>;
    const name = str(a.name);
    const contentType = str(a.contentType);
    const sizeBytes = typeof a.sizeBytes === 'number' ? a.sizeBytes : 0;
    if (!name || !contentType || sizeBytes <= 0) continue;
    out.push({ name: name.slice(0, 200), contentType, sizeBytes });
  }
  return out;
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

  const attachments = normaliseAttachments(sub.attachments);

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

  const draftPayload = session.draft
    ? {
        projectType: session.draft.projectType,
        mode: session.draft.mode,
        area: session.draft.area,
        pitch: session.draft.pitch,
        roofShape: session.draft.roofShape,
        materialId: session.draft.materialId,
        components: session.draft.components.filter((c) => c.selected),
      }
    : null;

  return {
    business: getBusiness().business.name,
    channel: 'smart-assistant-demo',
    contact: { name, email: email ?? null, phone: phone ?? null },
    summary: buildProjectSummary(project, estimateTotal),
    project,
    draft: draftPayload,
    estimate: estimatePayload,
    attachments,
    pricingAssumptions: estimate ? estimate.assumptions.slice(0, 8) : [],
    customerNote: str(sub.question),
    conversationContext: session.messages.slice(-12),
    submittedAt: new Date().toISOString(),
  };
}
