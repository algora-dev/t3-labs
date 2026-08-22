"use client";

/**
 * ServiceIntakeCTA — button that opens the AI intake modal with the
 * current service page's context (brief §11–12: contextual CTAs, pass
 * source page + category + CTA text into the intake funnel).
 */

import { openIntakeModal } from "@/lib/intake/analytics";

interface ServiceIntakeCTAProps {
  buttonText: string;
  problemCategory: string;
  trigger: "page-cta" | "hero" | "nav" | "article-cta";
}

export default function ServiceIntakeCTA({
  buttonText,
  problemCategory,
  trigger,
}: ServiceIntakeCTAProps) {
  return (
    <button
      type="button"
      onClick={() =>
        openIntakeModal({
          trigger,
          source_page: typeof window !== "undefined" ? window.location.pathname : "/",
          cta_text: buttonText,
          problem_category: problemCategory,
        })
      }
      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#d7ff00] px-6 py-3 text-sm font-semibold text-[#0a0b10] transition hover:bg-[#b8dd00]"
    >
      {buttonText} <span aria-hidden="true">&rarr;</span>
    </button>
  );
}
