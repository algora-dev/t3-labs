import type { AssistantSession } from './session';
import { getBusiness } from './data';

/**
 * Enquiry assembly (spec 13): server merges conversation facts, the latest
 * canonical estimate and the (possibly user-edited) submitted form values.
 * Demo-only storage inside the session - nothing leaves the machine.
 */

export interface InquirySubmission {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  question?: unknown; // free-text notes / original question (may be edited)
  project?: {
    projectType?: unknown;
    roofArea?: unknown;
    roofShape?: unknown;
    pitchDegrees?: unknown;
    material?: unknown;
    location?: unknown;
    extras?: unknown;
  };
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, 500) : null;
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
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: 'That email address does not look right - please check it.' };
  }
  if (phone && phone.replace(/[^\d]/g, '').length < 7) {
    return { ok: false, error: 'That phone number does not look right - please check it.' };
  }
  return { ok: true };
}

export function buildInquiryPayload(session: AssistantSession, sub: InquirySubmission) {
  const p = sub.project ?? {};
  const facts = session.facts;
  const estimateId = session.estimateFlow.latestEstimateId;
  const estimate = estimateId ? session.estimates[estimateId] ?? null : null;

  // Persist any contact details the user typed (session-scoped, spec 9.4).
  const name = str(sub.name);
  const email = str(sub.email);
  const phone = str(sub.phone);
  if (name) session.lead.name = name;
  if (email) session.lead.email = email;
  if (phone) session.lead.phone = phone;

  const extrasRaw = Array.isArray(p.extras)
    ? p.extras.filter((e): e is string => typeof e === 'string').slice(0, 10)
    : facts.extras;

  return {
    business: getBusiness().business.name,
    channel: 'smart-assistant-demo',
    contact: { name, email: email ?? null, phone: phone ?? null },
    project: {
      projectType: str(p.projectType) ?? facts.projectType,
      roofArea: num(p.roofArea) ?? facts.roofArea,
      roofShape: str(p.roofShape) ?? facts.roofShape,
      pitchDegrees: num(p.pitchDegrees) ?? facts.pitchDegrees,
      material: str(p.material) ?? facts.material,
      location: str(p.location) ?? facts.location,
      extras: extrasRaw,
    },
    estimate: estimate
      ? {
          id: estimate.id,
          catalogVersion: estimate.catalogVersion,
          total: estimate.total,
          currency: estimate.currency,
          status: estimate.status,
        }
      : null,
    question: str(sub.question) ?? session.messages.filter((m) => m.role === 'user').slice(-1)[0]?.content ?? null,
    submittedAt: new Date().toISOString(),
  };
}
