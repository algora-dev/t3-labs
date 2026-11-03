import { after } from "next/server";
import { headers } from "next/headers";
import { CustomProposalLander } from "@/components/custom-proposal-lander";
import { VisitTracker } from "@/components/visit-tracker";
import { recordLanding } from "@/lib/visit-store";

// Per-request rendering so every landing gets a unique server-side visit_id
// and a landing record captured from the actual request (URL, fbclid, UTMs, headers).
export const dynamic = "force-dynamic";

export default async function CustomProposalPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t0 = performance.now();
  const sp = await searchParams;
  const h = await headers();
  const visitId = crypto.randomUUID();
  const serverTs = new Date().toISOString();

  // Record after the response is flushed; keeps TTFB unchanged.
  after(async () => {
    await recordLanding({
      visitId,
      serverTs,
      searchParams: sp,
      headers: h,
      renderMs: Math.round(performance.now() - t0),
    });
  });

  return (
    <>
      <CustomProposalLander />
      <VisitTracker visitId={visitId} />
    </>
  );
}
