"use client";

/**
 * ContextualIntakeCTA — per-article contextual CTA block (Tom's Phase 2
 * prerequisite, reviewer §8 CTA system).
 *
 * Takes headline/body/buttonText per article, opens the existing intake
 * modal via the site-wide event bus, and passes source_page + cta_text +
 * problem_category into the intake context so funnel analytics and the
 * submitted brief carry the article's context.
 *
 * Deep-linkable: the wrapping section carries id="intake".
 */

import { openIntakeModal } from "@/lib/intake/analytics";

interface ContextualIntakeCTAProps {
  headline: string;
  body: string;
  buttonText: string;
  /** Optional problem category fed into the intake context (Phase 3 use). */
  problemCategory?: string;
}

export default function ContextualIntakeCTA({
  headline,
  body,
  buttonText,
  problemCategory,
}: ContextualIntakeCTAProps) {
  return (
    <section
      id="intake"
      className="my-12 rounded-2xl border border-[#d7ff00]/25 bg-white/5 p-8 text-center sm:p-10"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {headline}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">{body}</p>
      <button
        type="button"
        onClick={() =>
          openIntakeModal({
            trigger: "article-cta",
            source_page: typeof window !== "undefined" ? window.location.pathname : "/blog",
            cta_text: buttonText,
            problem_category: problemCategory,
          })
        }
        className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#d7ff00] px-6 py-3 text-sm font-semibold text-[#0a0b10] transition hover:bg-[#b8dd00]"
      >
        {buttonText} <span aria-hidden="true">&rarr;</span>
      </button>
    </section>
  );
}
