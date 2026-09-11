import websitePages from '@/data/apex-roofing/website-pages.json';

export type ApexPageGroup = 'services' | 'information' | 'commercial';

export interface ApexPageSection {
  heading?: string;
  body?: string[];
  bullets?: string[];
}

export interface ApexPage {
  slug: string;
  group: ApexPageGroup;
  title: string;
  metaDescription: string;
  intro: string;
  sections: ApexPageSection[];
}

/**
 * Shared Apex website content.
 * The page renderer and the Smart Assistant both consume the same data file so
 * website copy cannot silently drift away from assistant knowledge.
 */
export const APEX_PAGES: ApexPage[] = websitePages as ApexPage[];

export function findApexPage(slugSegments: string[]): ApexPage | null {
  const slug = slugSegments.join('/');
  return APEX_PAGES.find((page) => page.slug === slug) ?? null;
}
