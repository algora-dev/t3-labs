"use client";

/**
 * AIServicesSection — concise homepage AI-services block (brief §5).
 * Kept deliberately compact: heading, two short paragraphs, primary CTA
 * (intake) + secondary link to /ai-consultancy. Do not expand this into a
 * full landing section.
 */

import Link from "next/link";
import { openIntakeModal } from "@/lib/intake/analytics";

const SERVICE_LINKS = [
  { href: "/ai-consultancy", label: "AI Consultancy" },
  { href: "/ai-implementation", label: "Implementation" },
  { href: "/ai-automation", label: "Automation" },
  { href: "/ai-training", label: "Training" },
];

export default function AIServicesSection() {
  return (
    <section
      id="ai-services"
      className="mb-[104px] w-[min(1180px,calc(100%-40px))] mx-auto scroll-mt-24"
    >
      <div className="rounded-2xl border border-[#d7ff00]/20 bg-gradient-to-br from-[#0f1118] to-[#0a0b10] p-8 sm:p-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff00]">
          {SERVICE_LINKS.map((l, i) => (
            <span key={l.href}>
              <Link
                href={l.href}
                className="text-[#d7ff00] underline decoration-[#d7ff00]/40 underline-offset-4 transition hover:text-[#b8dd00]"
              >
                {l.label}
              </Link>
              {i < SERVICE_LINKS.length - 1 && (
                <span className="mx-1.5 text-white/30" aria-hidden="true">
                  ·
                </span>
              )}
            </span>
          ))}
        </p>
        <h2 className="mb-5 max-w-[720px] text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-tight text-white">
          Need help using AI in your business?
        </h2>
        <p className="mb-3 max-w-[760px] text-[1.05rem] leading-8 text-white/75">
          Know AI could help your business but not sure what to do next? We can
          identify where it makes sense, build and integrate the solution,
          automate the repetitive work, or train your team to use it themselves.
        </p>
        <p className="mb-7 max-w-[760px] text-[1.05rem] leading-8 text-white/60">
          We design around people as well as technology — AI does the heavy
          lifting, with human review kept simple wherever judgment or approval
          still matters.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() =>
              openIntakeModal({
                trigger: "page-cta",
                source_page: "/",
                cta_text: "Tell us what you need help with",
                problem_category: "ai-services",
              })
            }
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#d7ff00] px-6 py-3 text-sm font-semibold text-[#0a0b10] transition hover:bg-[#b8dd00]"
          >
            Tell us what you need help with <span aria-hidden="true">&rarr;</span>
          </button>
          <Link
            href="/ai-consultancy"
            className="text-sm font-semibold text-[#d7ff00] underline underline-offset-4 transition hover:text-[#b8dd00]"
          >
            Explore our AI consultancy services
          </Link>
        </div>
      </div>
    </section>
  );
}
