"use client";

/**
 * AiHelpIntakeCTA — /ai-help intake button. Passes the /ai-help source and
 * an "unrouted" problem category so funnel analytics can compare visitors
 * who self-selected a service path vs. went straight to intake (brief §18).
 */

import { openIntakeModal } from "@/lib/intake/analytics";

export default function AiHelpIntakeCTA() {
  const buttonText = "Tell us your problem";
  return (
    <button
      type="button"
      onClick={() =>
        openIntakeModal({
          trigger: "page-cta",
          source_page: "/ai-help",
          cta_text: buttonText,
          problem_category: "ai-help-unrouted",
        })
      }
      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#d7ff00] px-6 py-3 text-sm font-semibold text-[#0a0b10] transition hover:bg-[#b8dd00]"
    >
      {buttonText} <span aria-hidden="true">&rarr;</span>
    </button>
  );
}
