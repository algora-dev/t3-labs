import { NextResponse } from "next/server";
import cohort from "@/config/roofing-upgrade-cohort.json";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NO_CACHE = { "Cache-Control": "no-store, max-age=0" };

/**
 * EDIT ONE FILE to update every displayed availability count:
 * config/roofing-upgrade-cohort.json -> spotsAvailable
 * This is a MANUAL count, updated after Shaun confirms paid places.
 * A submitted request alone never reduces it.
 */
export async function GET() {
  const { capacity, spotsAvailable, cohortId, pricingPhase } = cohort;
  if (!Number.isInteger(capacity) || capacity <= 0 ||
      !Number.isInteger(spotsAvailable) || spotsAvailable < 0 || spotsAvailable > capacity ||
      !["early", "later"].includes(pricingPhase)) {
    console.error("Invalid roofing upgrade cohort config");
    return NextResponse.json({ ok: false, error: "Availability is being configured." },
      { status: 503, headers: NO_CACHE });
  }
  return NextResponse.json({
    ok: true,
    cohortId,
    capacity,
    confirmed: capacity - spotsAvailable,
    available: spotsAvailable,
    pricingPhase,
  }, { headers: NO_CACHE });
}
