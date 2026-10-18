import { withBusinessContext } from '@/lib/assistant/business-context';
import { GET as apexGet, DELETE as apexDelete } from '../../session/route';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Roofline Canterbury namespace: same handlers, roofline-roofing data context. */

export function GET() {
  return withBusinessContext('roofline-roofing', () => Promise.resolve(apexGet()));
}

export function DELETE() {
  return withBusinessContext('roofline-roofing', () => Promise.resolve(apexDelete()));
}
