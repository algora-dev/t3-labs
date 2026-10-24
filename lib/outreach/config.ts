import { BESPOKE_OUTREACH_PAGES } from "./bespoke-pages";

export type OutreachPresenter = "shaun" | "cofounder";

export type OutreachPageConfig = {
  slug: string;
  businessName?: string;
  website?: string;
  presenter: OutreachPresenter;
  eyebrow: string;
  title: string;
  intro: string;
  video?: {
    src?: string;
    poster?: string;
    label?: string;
  };
};

/**
 * The only two generic outreach pages.
 * Both use the combined-solutions video, one per presenter.
 * Replace the placeholder video config once the final recordings are ready.
 */
const GENERIC_CONFIGS: Record<string, OutreachPageConfig> = {
  "what-you-might-be-missing": {
    slug: "what-you-might-be-missing",
    presenter: "shaun",
    eyebrow: "A quick video from T3 Labs",
    title: "I spotted a couple of simple things that could make a much bigger difference.",
    intro: "Watch this first. It is under a minute.",
    video: {
      label: "Shaun combined outreach video placeholder",
    },
  },
  "where-they-go-next": {
    slug: "where-they-go-next",
    presenter: "cofounder",
    eyebrow: "A quick video from T3 Labs",
    title: "I spotted a couple of simple things that could make a much bigger difference.",
    intro: "Watch this first. It is under a minute.",
    video: {
      label: "Co-founder combined outreach video placeholder",
    },
  },
};

export function getOutreachPage(slug: string): OutreachPageConfig | undefined {
  return GENERIC_CONFIGS[slug] ?? BESPOKE_OUTREACH_PAGES[slug];
}

export function getOutreachPageSlugs(): string[] {
  return [...Object.keys(GENERIC_CONFIGS), ...Object.keys(BESPOKE_OUTREACH_PAGES)];
}
