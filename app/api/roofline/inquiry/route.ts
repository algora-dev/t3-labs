import { withBusinessContext } from '@/lib/assistant/business-context';
import { POST as apexPost } from '../../inquiry/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Roofline Canterbury namespace: same handlers, roofline-roofing data context. */

export function POST(req: Request) {
  return withBusinessContext('roofline-roofing', () => Promise.resolve(apexPost(req)));
}
