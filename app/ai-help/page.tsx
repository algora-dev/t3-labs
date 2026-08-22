import type { Metadata } from "next";
import Link from "next/link";
import IntakeModalMount from "@/components/intake/intake-modal-mount";
import AiHelpIntakeCTA from "@/components/ai-services/ai-help-intake-cta";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "Need Help With AI? Consultancy, Automation & Implementation",
  description:
    "AI told you what's possible. Need help actually doing it? Route yourself to the right T3 Labs service — consultancy, implementation, automation or training — or just tell us the problem.",
  alternates: { canonical: `${BASE_URL}/ai-help` },
  openGraph: {
    title: "Need Help With AI? Consultancy, Automation & Implementation | T3 Labs",
    description:
      "AI told you what's possible. Need help actually doing it? Tell us the problem — no technical brief needed.",
    url: `${BASE_URL}/ai-help`,
    siteName: "T3 Labs",
    type: "website",
  },
};

const PATHS = [
  {
    href: "/ai-consultancy",
    title: "I don't know where AI fits",
    body: "We look at how your business works and identify what's worth doing — and what isn't.",
    tag: "ai-consultancy",
  },
  {
    href: "/ai-implementation",
    title: "I know what I want built",
    body: "You have the outcome in mind — even if an AI gave you the sketch. We make it work.",
    tag: "ai-implementation",
  },
  {
    href: "/ai-automation",
    title: "I want repetitive work automated",
    body: "The routine work runs itself; your people handle exceptions and approvals.",
    tag: "ai-automation",
  },
  {
    href: "/ai-training",
    title: "I want my team to learn AI",
    body: "Training around the work your people actually do — not theoretical AI education.",
    tag: "ai-training",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-20 sm:py-24">
          <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-tight tracking-tight">
            AI told you what&apos;s possible. Need help actually doing it?
          </h1>
          <p className="mt-5 max-w-[720px] text-lg leading-9 text-white/75">
            You may already know AI could solve the problem. The difficult part
            is turning that answer into something that actually works in your
            business.
          </p>
          <p className="mt-3 max-w-[720px] text-lg leading-9 text-white/75">
            You don&apos;t need to work out the technical solution first. Tell
            us what you&apos;re trying to achieve and we&apos;ll work out the
            sensible next step.
          </p>
        </div>
      </section>

      <section className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {PATHS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              data-service-path={p.tag}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#d7ff00]/40 hover:bg-white/[0.07]"
            >
              <h2 className="text-xl font-semibold tracking-tight">{p.title}</h2>
              <p className="mt-2 text-base leading-7 text-white/70">{p.body}</p>
              <p className="mt-4 text-sm font-semibold text-[#d7ff00]">
                {p.href.replace("/", "").replace("-", " ")}{" "}
                <span aria-hidden="true">&rarr;</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="intake"
        className="mx-auto mb-20 w-[min(880px,calc(100%-40px))] rounded-2xl border border-[#d7ff00]/25 bg-white/5 p-8 text-center sm:p-12"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Still not sure?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">
          Speak it or type it. No technical brief needed. A real person at T3
          Labs reviews every enquiry.
        </p>
        <div className="mt-7">
          <AiHelpIntakeCTA />
        </div>
        <p className="mt-6 text-sm text-white/50">
          Prefer to talk?{" "}
          <a
            href="https://calendly.com/cece-t3labs/20min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d7ff00] underline underline-offset-2 hover:text-[#b8dd00]"
          >
            Book a free call
          </a>
        </p>
      </section>

      <IntakeModalMount />
    </main>
  );
}
