"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";
type Tokens = {
  bg: string; surface: string; surfaceAlt: string; border: string; text: string;
  muted: string; accent: string; accentText: string; accentInk: string; accentSoft: string;
};

const dark: Tokens = {
  bg: "#0a0b10", surface: "#101219", surfaceAlt: "#161927", border: "#262a3a",
  text: "#e8eaf2", muted: "#9aa1b5", accent: "#d7ff00", accentText: "#0a0b10",
  accentInk: "#d7ff00", accentSoft: "rgba(215,255,0,0.08)",
};
const light: Tokens = {
  bg: "#fbfcff", surface: "#ffffff", surfaceAlt: "#f3f5fa", border: "#e7e9ef",
  text: "#0a0b10", muted: "#5a6172", accent: "#d7ff00", accentText: "#0a0b10",
  accentInk: "#809000", accentSoft: "rgba(215,255,0,0.18)",
};

const BOOKING_URL = "https://calendly.com/cece-t3labs/20min";

const DEMOS = [
  {
    name: "Roofing Supplier Demo",
    body: "Measure a roof, calculate quantities and apply supplier pricing before the enquiry reaches the team.",
    href: "/supplier-pricing-tool/apex-roofing",
  },
  {
    name: "Flooring Supplier Demo",
    body: "Estimate a room, calculate material requirements and turn the result into a stronger sales enquiry.",
    href: "/supplier-pricing-tool/oakline-flooring",
  },
  {
    name: "Cladding Supplier Demo",
    body: "Calculate sheet quantities and pricing without making the customer wait for a manual quote.",
    href: "/supplier-pricing-tool/vertex-cladding",
  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== "undefined") {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", name, params);
  }
}

function ProofCard({ t, title, stat, children }: { t: Tokens; title: string; stat: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border">
      <button onClick={() => setOpen(!open)} className="flex w-full items-start justify-between gap-4 p-6 text-left" aria-expanded={open}>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>{stat}</p>
        </div>
        <span style={{ color: t.accentInk }} className={`text-lg transition-transform ${open ? "rotate-180" : ""}`}>&#9662;</span>
      </button>
      {open && <div className="border-t px-6 pb-6 pt-4 text-sm leading-7" style={{ borderColor: t.border, color: t.muted }}>{children}</div>}
    </div>
  );
}

const ASSESSMENT = [
  "Can customers get useful pricing without waiting for your team?",
  "Can customers work out what products or quantities they need online?",
  "Can they send you a mostly complete job or quote request before staff get involved?",
  "Is your product, pricing and technical information easy to find online?",
  "Are you collecting useful data from quotes, pricing or customer activity?",
];

type Answer = "yes" | "partly" | "no";

function QuickAssessment({ t }: { t: Tokens }) {
  const [answers, setAnswers] = useState<(Answer | null)[]>(Array(ASSESSMENT.length).fill(null));
  const [done, setDone] = useState(false);

  const score = answers.reduce((sum, a) => sum + (a === "yes" ? 2 : a === "partly" ? 1 : 0), 0);
  const completed = answers.every(Boolean);
  const result = score <= 3
    ? { title: "There are clear opportunities to improve the buying journey.", body: "The quickest wins are usually faster pricing, better self-service and stronger enquiries before your team gets involved." }
    : score <= 7
    ? { title: "You already have a good base.", body: "The next step is connecting the gaps, reducing friction and getting more value from what you already have." }
    : { title: "You already have a strong foundation.", body: "That makes the next stage easier: improve the final gaps, capture better first-party data and compound the advantage over time." };

  return (
    <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 sm:p-8">
      {!done ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.accentInk }}>Quick check</p>
              <h3 className="mt-2 text-2xl font-bold">Could your online buying journey be doing more?</h3>
            </div>
            <p className="text-sm" style={{ color: t.muted }}>5 quick questions</p>
          </div>
          <div className="mt-7 space-y-5">
            {ASSESSMENT.map((q, i) => (
              <div key={q}>
                <p className="font-medium leading-6">{q}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["yes", "partly", "no"] as Answer[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => {
                        const next = [...answers]; next[i] = a; setAnswers(next);
                      }}
                      style={answers[i] === a ? { background: t.accent, color: t.accentText, borderColor: t.accent } : { background: t.surfaceAlt, color: t.text, borderColor: t.border }}
                      className="rounded-full border px-4 py-2 text-sm font-semibold"
                    >
                      {a === "yes" ? "Yes" : a === "partly" ? "Partly" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            disabled={!completed}
            onClick={() => { setDone(true); trackEvent("construction_assessment_complete", { score: String(score) }); }}
            style={{ background: completed ? t.accent : t.surfaceAlt, color: completed ? t.accentText : t.muted }}
            className="mt-8 min-h-12 rounded-full px-7 text-sm font-semibold disabled:cursor-not-allowed"
          >
            See my result
          </button>
        </>
      ) : (
        <div>
          <h3 className="text-2xl font-bold sm:text-3xl">{result.title}</h3>
          <p className="mt-4 max-w-2xl leading-7" style={{ color: t.muted }}>{result.body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="rounded-full px-7 py-3 font-semibold">Book a free short call</a>
            <button onClick={() => scrollToId("contact")} style={{ borderColor: t.border }} className="rounded-full border px-7 py-3 font-semibold">Send us how you work</button>
          </div>
          <button onClick={() => { setDone(false); setAnswers(Array(ASSESSMENT.length).fill(null)); }} className="mt-4 text-sm font-semibold hover:underline" style={{ color: t.muted }}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default function ConstructionSolutionPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const t = theme === "dark" ? dark : light;

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("sent") === "1") {
      setSent(true);
      setFormOpen(true);
    }
  }, []);

  return (
    <main style={{ background: t.bg, color: t.text, ["--accent" as string]: t.accent }} className="min-h-screen antialiased">
      <style>{`
        main button, main a { transition: transform .15s ease, filter .15s ease, border-color .15s ease; }
        .solid:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .card:hover { transform: translateY(-2px); border-color: var(--accent) !important; }
      `}</style>

      <header style={{ background: theme === "dark" ? "rgba(10,11,16,.88)" : "rgba(251,252,255,.94)", borderColor: t.border }} className="sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="https://www.t3labs.tech" className="flex items-center gap-2 font-semibold"><span style={{ background: t.accent, color: t.accentText }} className="rounded-md px-2 py-0.5 text-sm font-bold">T3</span><span className="text-sm" style={{ color: t.muted }}>Labs</span></a>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ borderColor: t.border, color: t.muted }} className="rounded-full border px-3 py-1.5 text-xs">{theme === "dark" ? "&#9728; Light" : "&#9790; Dark"}</button>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="solid hidden rounded-full px-4 py-2 text-xs font-semibold sm:inline-block">Book a free short call</a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        <section className="py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: t.accentInk }}>Built for construction suppliers &amp; trade businesses</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Help customers find you, price with you and buy from you faster.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8" style={{ color: t.muted }}>We build practical tools that give customers faster answers, make quoting easier and reduce repetitive work for your team — while giving search engines and AI more useful information about your business.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => scrollToId("problem")} style={{ background: t.accent, color: t.accentText }} className="solid rounded-full px-7 py-3 font-semibold">See how it works</button>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ borderColor: t.border }} className="rounded-full border px-7 py-3 font-semibold">Book a free short call</a>
          </div>
        </section>

        <section id="problem" className="scroll-mt-20 py-14 sm:py-18">
          <h2 className="max-w-3xl text-3xl font-bold sm:text-4xl">Construction buying is still full of unnecessary friction.</h2>
          <p className="mt-5 max-w-3xl leading-7" style={{ color: t.muted }}>A customer finds the right product, then hits &ldquo;contact us for pricing&rdquo;, a basic quote form, or a process that still needs staff to work everything out manually.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {["No useful pricing", "Basic quote forms", "Customers unsure what they need", "Staff repeating the same work"].map((x) => <div key={x} style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-5 font-semibold">{x}</div>)}
          </div>
          <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="mt-8 rounded-2xl border p-6">
            <p className="font-semibold">AI raises the expectation further.</p>
            <p className="mt-2 max-w-3xl leading-7" style={{ color: t.muted }}>Customers are increasingly asking AI the full question and expecting a useful answer immediately. The more clear, useful product, pricing and technical information your business provides, the more opportunity you have to become part of that answer.</p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ProofCard t={t} title="People are asking AI bigger questions." stat={<>Google says AI Mode queries are around <strong>3&times; longer</strong> than traditional searches.</>}>
              <p>Longer, conversational questions are a strong signal that people are using AI to solve more of the research problem rather than just find a list of websites.</p>
              <a href="https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/" target="_blank" rel="noopener noreferrer" style={{ color: t.accentInk }} className="mt-2 inline-block font-semibold hover:underline">Read Google&apos;s research &rarr;</a>
            </ProofCard>
            <ProofCard t={t} title="AI is already part of purchase research." stat={<>In a 2026 US/UK home-services study, <strong>63%</strong> of respondents said they used generative AI to research a high-stakes purchase.</>}>
              <p>That figure was up from 46% in 2025. It is directional survey evidence, not a universal market statistic.</p>
              <a href="https://www.invoca.com/uk/reports/home-services-buyer-experience-report-2026" target="_blank" rel="noopener noreferrer" style={{ color: t.accentInk }} className="mt-2 inline-block font-semibold hover:underline">View the research &rarr;</a>
            </ProofCard>
          </div>
        </section>

        <section className="py-14 sm:py-18">
          <h2 className="text-3xl font-bold sm:text-4xl">What we build.</h2>
          <p className="mt-5 max-w-3xl leading-7" style={{ color: t.muted }}>We turn construction websites from something people read into something they can actually use.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Answer faster", "Pricing, quantities and product guidance without unnecessary waiting."],
              ["Quote easier", "Measurement, estimating and quoting workflows for customers, contractors and staff."],
              ["Send better enquiries", "More complete project information before your team needs to get involved."],
            ].map(([title, body]) => <div key={title} style={{ background: t.surface, borderColor: t.border }} className="card rounded-2xl border p-6"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>{body}</p></div>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Measure plans", "Calculate quantities", "Apply products &amp; pricing", "Add labour &amp; waste", "Generate estimates &amp; quotes", "Send complete jobs"].map((x) => <span key={x} style={{ background: t.surfaceAlt, borderColor: t.border }} className="rounded-full border px-4 py-2 text-sm font-medium">{x}</span>)}
          </div>
        </section>

        <section id="demos" className="scroll-mt-20 py-14 sm:py-18">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.accentInk }}>Live examples</p><h2 className="mt-2 text-3xl font-bold sm:text-4xl">See it in construction.</h2></div>
            <p className="max-w-xl text-sm leading-6" style={{ color: t.muted }}>These are examples of what is possible. Every tool can be tailored to the customer&apos;s products, pricing, workflow and brand.</p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {DEMOS.map((d) => <div key={d.name} style={{ background: t.surface, borderColor: t.border }} className="card flex flex-col rounded-2xl border p-6"><h3 className="text-lg font-semibold">{d.name}</h3><p className="mt-3 flex-1 text-sm leading-6" style={{ color: t.muted }}>{d.body}</p><a href={d.href} target="_blank" rel="noopener noreferrer" style={{ color: t.accentInk }} className="mt-5 font-semibold hover:underline">Try the demo &rarr;</a></div>)}
          </div>
        </section>

        <section className="py-14 sm:py-18">
          <h2 className="text-3xl font-bold sm:text-4xl">What this improves.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Get found", "Give search engines and AI more useful product, pricing and technical information."],
              ["Convert more", "Give buyers answers before they leave or wait for a competitor."],
              ["Save time", "Remove repetitive questions, calculations and quote follow-up."],
              ["Build an advantage", "Turn real usage and first-party data into information competitors cannot easily copy."],
            ].map(([title, body]) => <div key={title} style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>{body}</p></div>)}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <ProofCard t={t} title="Customers do not want to wait for basic information." stat={<>In a 2026 home-services study, <strong>79%</strong> said they would switch to a faster-responding competitor.</>}>
              <p>The same research found 26% had called a business because the information they needed was not available online.</p>
              <a href="https://www.invoca.com/uk/reports/home-services-buyer-experience-report-2026" target="_blank" rel="noopener noreferrer" style={{ color: t.accentInk }} className="mt-2 inline-block font-semibold hover:underline">View research &rarr;</a>
            </ProofCard>
            <ProofCard t={t} title="Useful, original public information supports AI visibility." stat={<>Google recommends <strong>unique, useful, non-commodity content</strong>; OpenAI says public sites can appear in ChatGPT Search.</>}>
              <p>That supports the long-term strategy: build genuinely useful tools and information, then use first-party data to create resources that are difficult for competitors to replicate.</p>
              <div className="mt-2 flex flex-wrap gap-4"><a href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" target="_blank" rel="noopener noreferrer" style={{ color: t.accentInk }} className="font-semibold hover:underline">Google guidance &rarr;</a><a href="https://help.openai.com/en/articles/12627856-publishers-and-developers-faq" target="_blank" rel="noopener noreferrer" style={{ color: t.accentInk }} className="font-semibold hover:underline">OpenAI guidance &rarr;</a></div>
            </ProofCard>
          </div>
        </section>

        <section className="py-14 sm:py-18">
          <QuickAssessment t={t} />
        </section>

        <section id="contact" className="scroll-mt-20 py-16 sm:py-24">
          <h2 className="text-3xl font-bold sm:text-4xl">Start with how you work today.</h2>
          <p className="mt-5 max-w-3xl leading-7" style={{ color: t.muted }}>You do not need to know which tool you need. Show us how customers currently get information, pricing or quotes — and how your team handles that process. We&apos;ll look for the simplest place to create value.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 sm:p-8"><h3 className="text-xl font-semibold">Have a short call</h3><p className="mt-3 leading-7" style={{ color: t.muted }}>Talk us through the current process and we&apos;ll identify where the strongest opportunities may be.</p><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.accentText }} className="solid mt-6 inline-flex rounded-full px-7 py-3 font-semibold">Book a free short call</a></div>
            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 sm:p-8"><h3 className="text-xl font-semibold">Send us how you work</h3><p className="mt-3 leading-7" style={{ color: t.muted }}>Send your website and a quick outline of how pricing, quotes or orders work today. We&apos;ll take a look and come back with initial thoughts.</p><button onClick={() => setFormOpen(!formOpen)} style={{ borderColor: t.border }} className="mt-6 rounded-full border px-7 py-3 font-semibold">Send us how you work</button></div>
          </div>

          {formOpen && !sent && (
            <form action="/api/our-solution-enquiry" method="post" style={{ background: t.surface, borderColor: t.border }} className="mt-6 rounded-2xl border p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {[["name", "Your name"], ["business", "Business name"], ["email", "Email"], ["website", "Website"]].map(([name, label]) => <input key={name} name={name} type={name === "email" ? "email" : "text"} required={name !== "website"} placeholder={label + (name !== "website" ? " *" : "")} style={{ background: t.surfaceAlt, borderColor: t.border, color: t.text }} className="min-h-12 rounded-xl border px-4" />)}
              </div>
              <textarea name="message" rows={4} placeholder="How do customers currently get pricing, quotes or place orders? What feels slow or manual?" style={{ background: t.surfaceAlt, borderColor: t.border, color: t.text }} className="mt-4 w-full rounded-xl border px-4 py-3" />
              <button type="submit" style={{ background: t.accent, color: t.accentText }} className="solid mt-5 rounded-full px-7 py-3 font-semibold">Send us how you work</button>
            </form>
          )}

          {sent && (
            <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="mt-6 rounded-2xl border p-6">
              <p className="font-semibold">Thanks — we&apos;ve got it.</p>
              <p className="mt-2 leading-7" style={{ color: t.muted }}>We&apos;ll take a look at how you work and come back to you shortly. If you&apos;d rather talk it through now, you can <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ color: t.accentInk }} className="font-semibold hover:underline">book a free short call</a>.</p>
            </div>
          )}
        </section>

        <footer style={{ borderColor: t.border, color: t.muted }} className="border-t py-8 text-center text-sm">T3 Labs — practical digital tools for modern construction businesses.</footer>
      </div>
    </main>
  );
}
