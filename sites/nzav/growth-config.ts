import type { GrowthProposalConfig } from "../types";

/**
 * NZAV - Phase 1 Website Repositioning & Search Growth
 * Built from the NZAV Phase 1 Proposal PDF (Aug 2026).
 */

export const nzavGrowthProposal: GrowthProposalConfig = {
  slug: "nzav",
  layout: "growth",
  prospectId: "NZAV",
  companyName: "NZAV",
  location: "New Zealand",
  status: "active",
  seo: {
    title: "NZAV - Website Repositioning & Search Growth | Private Proposal by T3 Labs",
    description: "A Phase 1 website repositioning and search growth proposal prepared for NZAV by T3 Labs.",
  },
  logo: {
    src: "/proposal-assets/nzav/nzav-logo.png",
    alt: "NZAV logo",
    darkCard: true,
  },
  hero: {
    overline: "A private Phase 1 proposal prepared for",
    headline: "Website repositioning & search growth.",
    supportingCopy:
      "Reposition NZAV so the market sees the business first as a specialist in SPON / IP paging, school bell, public-address and communication systems — while retaining broader AV capability in a supporting role.",
    metaChips: ["SPON / IP paging specialist", "High-intent search", "NZ foundation"],
    privacyNote: "This proposal is private and is not publicly listed.",
  },
  sections: [
    {
      type: "text",
      heading: "The objective",
      paragraphs: [
        "The commercial goal is to increase visibility for high-intent searches, outrank competing providers where possible, and turn more website visitors into qualified enquiries and quoting opportunities.",
      ],
    },
    {
      type: "list",
      heading: "01 — Positioning & website restructure",
      items: [
        "Rework the homepage and site hierarchy so SPON / IP paging and communication systems become the primary focus",
        "Reduce the prominence of lower-priority AV services without removing useful existing search authority",
        "Improve calls-to-action and enquiry pathways so the specialist proposition is immediately clear",
      ],
    },
    {
      type: "list",
      heading: "02 — Search engine optimisation",
      items: [
        "Keyword and competitor research focused on school paging, bell systems, PA, intercom, emergency communication, healthcare and secure facilities",
        "Optimise page titles, headings, metadata, internal linking, technical SEO, structured data/schema and indexing",
        "Build New Zealand search relevance around the highest-value commercial terms and buying-intent searches",
      ],
    },
    {
      type: "list",
      heading: "03 — Dedicated SPON sales & product pages",
      intro:
        "Create one or two flagship pages that NZAV can send directly to prospective customers during quoting, follow-up and sales conversations.",
      items: [
        "Clear explanation of how the system works, key benefits and typical applications",
        "Purpose-built graphics, system diagrams, visual examples and video content/demonstrations",
        "FAQs, common buyer concerns, proof points and strong calls-to-action for consultation or quotation",
        "Designed to act as both an educational resource and a sales funnel — helping move a prospect from interest to enquiry",
      ],
    },
    {
      type: "list",
      heading: "04 — High-value landing pages",
      intro: "Build or substantially improve dedicated pages targeting the most commercially valuable search categories:",
      items: [
        "School Paging Systems",
        "School Bell Systems",
        "School PA Systems",
        "IP Paging Systems",
        "Emergency / Lockdown Communication",
        "SPON New Zealand",
        "Healthcare Paging Systems",
        "Corrections & Secure Facility Communication",
      ],
    },
    {
      type: "list",
      heading: "05 — Content, authority & case studies",
      items: [
        "Create useful educational content answering the questions buyers search before choosing a system or supplier",
        "Turn completed installations into detailed, searchable case studies covering the problem, design, technology, installation and outcome",
        "Use each new SPON project as another proof asset that strengthens NZAV's search authority and sales credibility",
      ],
    },
    {
      type: "list",
      heading: "06 — Targeted lead & decision-maker research (additional service)",
      intro:
        "Help NZAV identify high-intent opportunities and the people involved in specifying, pricing, approving or procuring these systems — so the sales team can get onto the radar earlier and earn more chances to quote.",
      items: [
        "Research relevant schools, healthcare facilities, government organisations, corrections, consultants, construction projects and other target organisations",
        "Where publicly and lawfully available, provide decision-maker names/roles, business contact details, organisation/project context and relevant opportunity information",
      ],
    },
    {
      type: "list",
      heading: "07 — Benchmarking & measurement",
      intro: "Before work begins, snapshot the current website so the same metrics can be measured again after implementation.",
      items: [
        "Search impressions, organic clicks, CTR and organic traffic",
        "Keyword footprint and ranking positions for priority search terms",
        "Indexed pages, technical website health and organic enquiry/conversion performance",
      ],
    },
    {
      type: "text",
      heading: "Phase 1 outcome",
      paragraphs: [
        "Phase 1 establishes the New Zealand foundation. Phase 2 can then replicate and expand the strategy into Australia through a dedicated Australian website, localised search strategy and market-specific authority building.",
      ],
      pullQuote:
        'From "a general commercial AV company that also offers paging systems" to "one of New Zealand\u2019s leading specialists in SPON, IP paging, school bell, PA and communication systems".',
    },
  ],
  actions: {
    calendlyUrl: "https://calendly.com/cece-t3labs/20min",
    emailUrl:
      "mailto:cece@t3labs.co.uk?subject=Phase%201%20proposal%20-%20NZAV&body=Hi%20Cece%2C%0A%0AI%27d%20like%20to%20discuss%20the%20Phase%201%20proposal%20for%20NZAV.%0A",
    ctaLabel: "Book a 20-minute call",
  },
};
