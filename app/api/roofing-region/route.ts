/**
 * Install at app/api/roofing-region/route.ts (or src/app/api/roofing-region/route.ts).
 * Reads a hosting provider's country header. Does not look up, return or log an IP.
 * Display-only regional pricing. Never use this as an authorisation decision.
 *
 * Vercel: automatic when process.env.VERCEL === "1".
 * Cloudflare: set T3_GEO_PROVIDER=cloudflare and enable visitor country headers.
 * Other host/local development: USD fallback + the page's manual currency switch.
 * Unknown providers/headers are deliberately ignored.
 */
export async function GET(request: Request) {
  const provider = process.env.T3_GEO_PROVIDER || (process.env.VERCEL === "1" ? "vercel" : "none");
  const headerName = provider === "vercel"
    ? "x-vercel-ip-country"
    : provider === "cloudflare" ? "cf-ipcountry" : null;

  const rawCountry = headerName ? request.headers.get(headerName)?.trim().toUpperCase() : undefined;
  const country = rawCountry && /^[A-Z]{2}$/.test(rawCountry) && rawCountry !== "XX" ? rawCountry : null;
  const currency = country === "GB" ? "GBP" : "USD";

  return Response.json(
    { currency },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
        "Vary": "x-vercel-ip-country, cf-ipcountry",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
