import { calculateApexQuickEstimate } from '../../../lib/quick-estimate/server';
import { InputError } from '../../../lib/quick-estimate/validation';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };
/** Public, deterministic, read-only endpoint. No AI keys, saved leads or trade rates.
 * Accept selections only and recalculate server-side. Never trust client totals.
 */
export async function POST(request: Request): Promise<Response> {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) return Response.json({ error: 'Use application/json' }, { status: 415, headers });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: 'Roof selections are required' }, { status: 400, headers });
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > 8192) { await reader.cancel(); return Response.json({ error: 'Request too large' }, { status: 413, headers }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const input: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return Response.json(calculateApexQuickEstimate(input), { headers });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof InputError) return Response.json({ error: error.message }, { status: 400, headers });
    console.error('Quick roof estimate configuration error', error);
    return Response.json({ error: 'The estimate could not be calculated. Please try again.' }, { status: 500, headers });
  } finally { reader.releaseLock(); }
}
