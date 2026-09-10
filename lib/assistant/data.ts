import fs from 'fs';
import path from 'path';

/**
 * Server-side loaders for the Apex Roofing data layer.
 * All business facts, prices and rules come from /data/apex-roofing - never hardcoded.
 */

const DATA_DIR = path.join(process.cwd(), 'data', 'apex-roofing');

type Cache = { [k: string]: unknown };
const cache: Cache = {};

function loadJson<T>(file: string): T {
  if (!cache[file]) {
    const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    cache[file] = JSON.parse(raw);
  }
  return cache[file] as T;
}

function loadText(file: string): string {
  if (!cache[file]) {
    cache[file] = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
  }
  return cache[file] as string;
}

/* ---------- assistant-config.json ---------- */
export interface AssistantConfig {
  assistantName: string;
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

/* ---------- business.json ---------- */
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

/* ---------- roofing-knowledge.md ---------- */
export function getRoofingKnowledge(): string {
  return loadText('roofing-knowledge.md');
}

/* ---------- site-map.json ---------- */
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
