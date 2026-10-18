import { withBusinessContext } from '@/lib/assistant/business-context';
import { GET as apexGet, POST as apexPost } from '../../chat/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Roofline Canterbury namespace: same handlers, roofline-roofing data context. */

export function GET() {
  return withBusinessContext('roofline-roofing', () => Promise.resolve(apexGet()));
}

export function POST(req: Request) {
  return withBusinessContext('roofline-roofing', () => Promise.resolve(apexPost(req)));
}
