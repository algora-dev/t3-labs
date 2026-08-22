import Link from "next/link";
import type { ServicePageData } from "@/lib/ai-services";
import ServiceIntakeCTA from "@/components/ai-services/service-intake-cta";

/**
 * Shared renderer for the four AI service pages (/ai-consultancy,
 * /ai-implementation, /ai-automation, /ai-training). Content lives in
 * lib/ai-services.ts; this keeps markup identical and content distinct
 * (brief §7: distinct intent per page, no near-identical copies).
 */

export default function ServicePage({ data }: { data: ServicePageData }) {
  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-20 sm:py-24">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff00]">
            {data.eyebrow}
          </p>
          <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-tight tracking-tight">
            {data.h1}
          </h1>
          {data.intro.map((p) => (
            <p key={p} className="mt-5 max-w-[720px] text-lg leading-9 text-white/75">
              {p}
            </p>
          ))}
          <div className="mt-8">
            <ServiceIntakeCTA
              buttonText={data.ctaButtonText}
              problemCategory={data.problemCategory}
              trigger="page-cta"
            />
          </div>
        </div>
      </section>

      {/* Body sections */}
      <section className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
        {data.sections.map((s) => (
          <div key={s.id} id={s.id} className="mb-12 scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {s.heading}
            </h2>
            {s.body && (
              <p className="mt-4 text-base leading-8 text-white/75">{s.body}</p>
            )}
            {s.bullets && (
              <ul className="mt-5 list-disc space-y-2 pl-6 text-base leading-8 text-white/75">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* Common questions */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="mx-auto mb-16 w-[min(880px,calc(100%-40px))]">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Common questions
          </h2>
          <div className="space-y-4">
            {data.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-white/10 bg-white/5 px-6 py-4"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-white marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="mt-3 text-base leading-8 text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA block */}
      <section
        id="intake"
        className="mx-auto mb-20 w-[min(880px,calc(100%-40px))] rounded-2xl border border-[#d7ff00]/25 bg-white/5 p-8 text-center sm:p-12"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {data.ctaHeadline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">
          {data.ctaBody}
        </p>
        <div className="mt-7">
          <ServiceIntakeCTA
            buttonText={data.ctaButtonText}
            problemCategory={data.problemCategory}
            trigger="page-cta"
          />
        </div>
        <p className="mt-6 text-sm text-white/50">
          Prefer to talk?{" "}
          <a
            href="https://calendly.com/cece-t3labs/20min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d7ff00] underline underline-offset-2 hover:text-[#b8dd00]"
          >
            Book a discovery call
          </a>
        </p>
      </section>

      {/* Related services */}
      {data.related.length > 0 && (
        <section className="mx-auto mb-20 w-[min(880px,calc(100%-40px))]">
          <h2 className="mb-5 text-xl font-semibold tracking-tight">
            {data.relatedHeading}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {data.related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-base font-medium text-white/80 transition hover:border-[#d7ff00]/40 hover:text-white"
              >
                {r.label} <span aria-hidden="true">&rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
