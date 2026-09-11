import fs from 'fs';
import path from 'path';

/** Server-side loaders for the active Smart Assistant business data layer. */

export const BUSINESS_SLUG = process.env.T3_ASSISTANT_BUSINESS_SLUG || 'apex-roofing';
export const DATA_DIR = path.join(process.cwd(), 'data', BUSINESS_SLUG);

type Cache = { [k: string]: unknown };
const cache: Cache = {};

function loadJson<T>(file: string): T {
  const key = `${BUSINESS_SLUG}:${file}`;
  if (!cache[key]) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    cache[key] = JSON.parse(raw);
  }
  return cache[key] as T;
}

function loadText(file: string): string {
  const key = `${BUSINESS_SLUG}:${file}`;
  if (!cache[key]) cache[key] = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  return cache[key] as string;
}

export interface AssistantConfig {
  assistantName: string;
  assistantLabel?: string;
  brandName?: string;
  accentColor?: string;
  launcherSubtitle?: string;
  teaserTitle?: string;
  teaserText?: string;
  teaserExample?: string;
  openingIntro?: string;
  demoFooter?: string;
  model: string;
  maxUserMessageChars: number;
  maxTurnsPerSession: number;
  maxClarificationQuestions: number;
  sessionTtlMinutes: number;
  rateLimit: { maxMessagesPerMinute: number; maxMessagesPerHour: number };
  ipRateLimit?: { maxMessagesPerMinute: number; maxMessagesPerHour: number };
  turnTimeoutMs: number;
  starterPrompts: string[];
  tone: string;
}

export function getAssistantConfig(): AssistantConfig {
  return loadJson<AssistantConfig>('assistant-config.json');
}

export interface BusinessData {
  business: {
    name: string;
    demo: boolean;
    tagline: string;
    description: string;
    phone: string;
    email: string;
    serviceAreas: string[];
    hours: Record<string, string>;
    emergencyProcess: string;
    insuranceWork: string;
    guarantees: string[];
    process: string[];
    services: { id: string; name: string; summary: string }[];
    roofTypes: string[];
    materials: string[];
    handoffMessage: string;
  };
  faqs: { q: string; a: string }[];
}

export function getBusiness(): BusinessData {
  return loadJson<BusinessData>('business.json');
}

export function getRoofingKnowledge(): string {
  return loadText('roofing-knowledge.md');
}

export interface SiteMapEntry {
  id: string;
  title: string;
  path: string;
  keywords: string[];
  description: string;
  external?: boolean;
}

export function getSiteMap(): SiteMapEntry[] {
  return loadJson<SiteMapEntry[]>('site-map.json');
}

export function resolveSiteTopic(topicId: string): SiteMapEntry | null {
  return getSiteMap().find((s) => s.id === topicId) ?? null;
}
