import type { OutreachPageConfig } from "./config";

/**
 * Bespoke outreach page registry.
 *
 * Add one record per prospect. Do not create a new React page.
 * The shared /hello/[slug] route and OutreachLandingPage renderer handle the rest.
 *
 * Recommended asset paths:
 *   public/assets/outreach/<slug>/video.mp4
 *   public/assets/outreach/<slug>/poster.jpg
 *
 * Example:
 *
 * "acme-roofing": {
 *   slug: "acme-roofing",
 *   businessName: "Acme Roofing",
 *   website: "https://www.acmeroofing.example",
 *   presenter: "shaun",
 *   eyebrow: "A quick video for Acme Roofing",
 *   title: "I spotted a couple of simple things that could make a much bigger difference.",
 *   intro: "Watch this first. It is under a minute.",
 *   video: {
 *     src: "/assets/outreach/acme-roofing/video.mp4",
 *     poster: "/assets/outreach/acme-roofing/poster.jpg",
 *   },
 * },
 */
export const BESPOKE_OUTREACH_PAGES: Record<string, OutreachPageConfig> = {};
