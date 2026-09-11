"use client";

import { useState } from "react";

type Theme = "dark" | "light";

type Tokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  accentInk: string;
  accentSoft: string;
};

const dark: Tokens = {
  bg: "#0a0b10",
  surface: "#101219",
  surfaceAlt: "#161927",
  border: "#262a3a",
  text: "#e8eaf2",
  muted: "#9aa1b5",
  accent: "#d7ff00",
  accentText: "#0a0b10",
  accentInk: "#d7ff00",
  accentSoft: "rgba(215,255,0,.08)",
};

const light: Tokens = {
  bg: "#fbfcff",
  surface: "#ffffff",
  surfaceAlt: "#f3f5fa",
  border: "#e7e9ef",
  text: "#0a0b10",
  muted: "#5a6172",
  accent: "#d7ff00",
  accentText: "#0a0b10",
  accentInk: "#809000",
  accentSoft: "rgba(215,255,0,.18)",
};

const BOOKING_URL = "https://calendly.com/cece-t3labs/20min";
const CUSTOMER_PAGE = "/our-solution/referred";

// Ron: swap this to the confirmed /public logo asset if the filename differs.
const LOGO_SRC = "/assets/t3-logo-white.png";

// Add this when the Apex Roofing assistant demo is live.
const ASSISTANT_DEMO_URL = "";

const DEMOS = {
  roofing: {
    name: "Apex Roofing",
    href: "/supplier-pricing-tool/apex-roofing",
    note: "Best first demo for roofing suppliers, manufacturers and roof-focused trade businesses.",
  },
  flooring: {
    name: "Oakline Flooring",
    href: "/supplier-pricing-tool/oakline-flooring",
    note: "Use where area, quantities, material selection and pricing matter.",
  },
  cladding: {
    name: "Vertex Cladding",
    href: "/supplier-pricing-tool/vertex-cladding",
    note: "Use for cladding, sheet products and similar quantity-driven workflows.",
  },
};

type Tri = "yes" | "partly" | "no";
type StoreState = "easy" | "clunky" | "none" | "not-relevant";
type OverallState = "strong" | "mixed" | "weak";
type Industry = "roofing" | "flooring" | "cladding" | "construction" | "other";

type LeadInput = {
  industry: Industry;
  otherIndustry: string;
  pricing: Tri | null;
  guidedChoice: Tri | null;
  education: Tri | null;
  quoteReady: Tri | null;
  mobile: Tri | null;
  store: StoreState | null;
  overall: OverallState | null;
};

type AngleKey =
  | "faster"
  | "buying"
  | "guidance"
  | "manual"
  | "mobile"
  | "visibility"
  | "icing";

type AngleDefinition = {
  key: AngleKey;
  title: string;
  short: string;
  opener: string;
};

const ANGLES: Record<AngleKey, AngleDefinition> = {
  faster: {
    key: "faster",
    title: "Faster answers",
    short: "Customers still have to wait for pricing, quantities or a useful answer.",
    opener:
      "I was looking through your website and noticed customers still need to contact you for quite a bit of the information they need before buying. We build tools that can give them more of that answer instantly and send your team a much better-qualified enquiry.",
  },
  buying: {
    key: "buying",
    title: "Make buying easier",
    short: "The website has products or ordering, but the customer still has to do too much work.",
    opener:
      "You already have a lot in place online, but the customer still has to hunt around and work out quite a lot themselves. We build guided tools that make the buying journey much easier and move people toward a quote or order.",
  },
  guidance: {
    key: "guidance",
    title: "Product guidance",
    short: "Customers may struggle to know what product they need, what works together, or how it is measured.",
    opener:
      "It looks like a customer needs a fair amount of product knowledge before they can confidently choose what to buy. We build selectors, calculators and online sales assistants that can guide them through that without relying on a staff member every time.",
  },
  manual: {
    key: "manual",
    title: "Reduce manual sales work",
    short: "The website may be pushing repeat questions, quote collection and calculations back onto staff.",
    opener:
      "From the outside, it looks like quite a bit of the buying process may still end up back with your team. We build customer and staff tools that can collect the right information, calculate more of the job and reduce the repetitive back-and-forth.",
  },
  mobile: {
    key: "mobile",
    title: "Mobile buying journey",
    short: "The first impression or buying flow is weaker on a phone.",
    opener:
      "I had a look at the website on mobile and there are a few places where the buying journey could be easier. We build mobile-first pricing, selection and enquiry tools so customers can actually get something useful done from their phone.",
  },
  visibility: {
    key: "visibility",
    title: "Get found with more useful information",
    short: "Useful product, pricing or technical information is hard to find or hidden behind an enquiry.",
    opener:
      "A lot of the useful buying information still seems to sit behind an enquiry or inside the team. We help businesses turn that knowledge into useful public information and tools, so customers can find better answers earlier and the website has more value to search systems.",
  },
  icing: {
    key: "icing",
    title: "Make a good system work harder",
    short: "They already have a solid foundation. The angle is optimisation, connection and the final 10 to 20 percent.",
    opener:
      "You have already done a lot of the heavy lifting online. We often work with businesses at that stage to connect the last pieces, remove smaller points of friction and get more value from what they have already built.",
  },
};

function Card({
  t,
  title,
  children,
  className = "",
}: {
  t: Tokens;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ background: t.surface, borderColor: t.border }}
      className={`rounded-2xl border p-5 sm:p-6 ${className}`}
    >
      {title && <h3 className="text-xl font-semibold">{title}</h3>}
      <div className={title ? "mt-3" : ""}>{children}</div>
    </div>
  );
}

function CollapsibleTool({
  t,
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  t: Tokens;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ background: t.surfaceAlt, borderColor: t.accent }} className="overflow-hidden rounded-3xl border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="tool-toggle flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-7 sm:py-5"
      >
        <div>
          <p className="text-xl font-semibold">{title}</p>
          {subtitle && (
            <p className="mt-1 text-sm leading-6" style={{ color: t.muted }}>
              {subtitle}
            </p>
          )}
        </div>
        <span
          aria-hidden="true"
          style={{ color: t.accentInk }}
          className={`shrink-0 text-xl transition-transform ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>
      {open && (
        <div style={{ borderColor: t.border }} className="border-t p-3 sm:p-5">
          {children}
        </div>
      )}
    </div>
  );
}

function InnerDisclosure({
  title,
  eyebrow,
  accent,
  border,
  surface,
  surfaceAlt,
  muted,
  defaultOpen = false,
  children,
}: {
  title: string;
  eyebrow: string;
  accent: string;
  border: string;
  surface: string;
  surfaceAlt: string;
  muted: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ background: surfaceAlt, borderColor: border }} className="overflow-hidden rounded-2xl border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="tool-toggle flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: accent }}>
            {eyebrow}
          </p>
          <p className="mt-1 text-xl font-semibold">{title}</p>
        </div>
        <span
          aria-hidden="true"
          style={{ color: accent }}
          className={`shrink-0 text-xl transition-transform ${open ? "rotate-180" : ""}`}
        >
          ⌄
        </span>
      </button>
      {open && (
        <div style={{ borderColor: border, background: surface }} className="border-t p-5">
          {children}
        </div>
      )}
    </div>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1000 ? 0 : 0,
  }).format(value);
}

function triScore(value: Tri | null) {
  if (value === "yes") return 2;
  if (value === "partly") return 1;
  return 0;
}

function addScore(scores: Record<AngleKey, number>, key: AngleKey, amount: number) {
  scores[key] += amount;
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function getDemoRecommendation(input: LeadInput) {
  if (input.industry === "roofing") return [DEMOS.roofing];
  if (input.industry === "flooring") return [DEMOS.flooring];
  if (input.industry === "cladding") return [DEMOS.cladding];

  if (input.industry === "construction") {
    return [DEMOS.roofing, DEMOS.flooring, DEMOS.cladding];
  }

  return [DEMOS.roofing];
}

function getLeadResult(input: LeadInput) {
  const scores: Record<AngleKey, number> = {
    faster: 0,
    buying: 0,
    guidance: 0,
    manual: 0,
    mobile: 0,
    visibility: 0,
    icing: 0,
  };

  const solutions: string[] = [];
  const questions: string[] = [];

  if (input.pricing === "no") {
    addScore(scores, "faster", 5);
    addScore(scores, "manual", 3);
    addScore(scores, "visibility", 2);
    solutions.push("Pricing or estimating tool", "Better quote or enquiry flow");
    questions.push("How do customers currently get a useful price?");
  } else if (input.pricing === "partly") {
    addScore(scores, "faster", 3);
    addScore(scores, "visibility", 1);
    solutions.push("Improve pricing or estimating flow");
  }

  if (input.guidedChoice === "no") {
    addScore(scores, "guidance", 5);
    addScore(scores, "buying", 4);
    addScore(scores, "manual", 2);
    solutions.push("Product selector", "Intelligent Online Sales Assistant");
    questions.push("How often do customers ask which product they need or what works together?");
  } else if (input.guidedChoice === "partly") {
    addScore(scores, "guidance", 3);
    addScore(scores, "buying", 2);
    solutions.push("Improve product selection", "Intelligent Online Sales Assistant");
  }

  if (input.education === "no") {
    addScore(scores, "visibility", 5);
    addScore(scores, "guidance", 3);
    solutions.push("Product education and technical content");
    questions.push("Who inside the business holds the product knowledge customers rely on?");
  } else if (input.education === "partly") {
    addScore(scores, "visibility", 3);
    addScore(scores, "guidance", 1);
    solutions.push("Improve product and technical information");
  }

  if (input.quoteReady === "no") {
    addScore(scores, "manual", 5);
    addScore(scores, "faster", 3);
    solutions.push("Guided quote intake", "Customer estimating tool", "Internal staff workflow");
    questions.push("What information does the team normally have to chase before a quote can start?");
  } else if (input.quoteReady === "partly") {
    addScore(scores, "manual", 3);
    addScore(scores, "faster", 1);
    solutions.push("Improve quote intake and handoff");
  }

  if (input.mobile === "no") {
    addScore(scores, "mobile", 6);
    addScore(scores, "buying", 2);
    solutions.push("Mobile optimisation", "Mobile-first customer tool");
    questions.push("How important are phone enquiries and mobile visitors to the business?");
  } else if (input.mobile === "partly") {
    addScore(scores, "mobile", 3);
    solutions.push("Mobile journey improvements");
  }

  if (input.store === "clunky") {
    addScore(scores, "buying", 5);
    addScore(scores, "guidance", 2);
    solutions.push("Store UX improvements", "Product selector", "Intelligent Online Sales Assistant");
    questions.push("Where do customers get stuck or abandon the buying journey?");
  } else if (input.store === "none") {
    addScore(scores, "faster", 1);
  }

  if (input.overall === "weak") {
    addScore(scores, "buying", 3);
    addScore(scores, "mobile", 1);
    addScore(scores, "visibility", 2);
    solutions.push("Website overhaul or rebuild");
  } else if (input.overall === "mixed") {
    addScore(scores, "buying", 2);
    addScore(scores, "icing", 2);
    solutions.push("Connect and improve existing website features");
  } else if (input.overall === "strong") {
    addScore(scores, "icing", 5);
  }

  const foundation =
    triScore(input.pricing) +
    triScore(input.guidedChoice) +
    triScore(input.education) +
    triScore(input.quoteReady) +
    triScore(input.mobile);

  if (input.overall === "strong" && foundation >= 8) {
    addScore(scores, "icing", 5);
    solutions.push("Targeted optimisation", "Connected tools or integrations", "First-party data and reporting");
  }

  const ranked = (Object.keys(scores) as AngleKey[])
    .map((key) => ({ ...ANGLES[key], score: scores[key] }))
    .sort((a, b) => b.score - a.score);

  const meaningful = ranked.filter((a) => a.score > 0);
  const angles = (meaningful.length ? meaningful : [{ ...ANGLES.icing, score: 1 }]).slice(0, 3);

  if (!questions.length) {
    questions.push(
      "What part of the current customer journey still takes more staff time than you would like?",
      "What would you most like customers to be able to do themselves?",
      "Which part of the website or sales process do you think could work harder?"
    );
  } else {
    questions.push(
      "What does the team spend time doing repeatedly that they wish they did not?",
      "If one part of this process could be improved first, which would create the most value?"
    );
  }

  const demos = getDemoRecommendation(input);

  return {
    angles,
    solutions: unique(solutions).slice(0, 6),
    questions: unique(questions).slice(0, 4),
    demos,
  };
}

function ToggleGroup({
  t,
  value,
  options,
  onChange,
}: {
  t: Tokens;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            style={
              active
                ? { background: t.accent, color: t.accentText, borderColor: t.accent }
                : { background: t.surfaceAlt, color: t.text, borderColor: t.border }
            }
            className="finder-option min-h-10 rounded-full border px-4 text-sm font-semibold"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function LeadAngleFinder({ t }: { t: Tokens }) {
  const [input, setInput] = useState<LeadInput>({
    industry: "construction",
    otherIndustry: "",
    pricing: null,
    guidedChoice: null,
    education: null,
    quoteReady: null,
    mobile: null,
    store: null,
    overall: null,
  });
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const complete =
    input.pricing &&
    input.guidedChoice &&
    input.education &&
    input.quoteReady &&
    input.mobile &&
    input.store &&
    input.overall;

  const result = getLeadResult(input);

  const industryName =
    input.industry === "other"
      ? input.otherIndustry.trim() || "Other industry"
      : input.industry.charAt(0).toUpperCase() + input.industry.slice(1);

  const copyNotes = async () => {
    const notes = [
      `Lead industry: ${industryName}`,
      `Primary angle: ${result.angles[0].title}`,
      `Other angles: ${result.angles.slice(1).map((a) => a.title).join(", ") || "None needed"}`,
      `Suggested opener: ${result.angles[0].opener}`,
      `Possible solution fit: ${result.solutions.join(", ") || "Targeted custom solution"}`,
      `Demo: ${result.demos.map((d) => d.name).join(", ")}`,
      `Discovery questions: ${result.questions.join(" | ")}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    setInput({
      industry: "construction",
      otherIndustry: "",
      pricing: null,
      guidedChoice: null,
      education: null,
      quoteReady: null,
      mobile: null,
      store: null,
      overall: null,
    });
    setShowResult(false);
  };

  const triOptions = [
    { value: "yes", label: "Yes" },
    { value: "partly", label: "Partly" },
    { value: "no", label: "No" },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.02fr_.98fr]">
      <div style={{ background: t.surface, borderColor: t.border }} className="rounded-3xl border p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>
              Website audit
            </p>
            <h3 className="mt-2 text-3xl font-bold">Audit the lead in under 2 minutes.</h3>
          </div>
          <button type="button" onClick={reset} className="text-sm font-semibold hover:underline" style={{ color: t.muted }}>
            Reset
          </button>
        </div>

        <p className="mt-3 text-sm leading-6" style={{ color: t.muted }}>
          Look at what is visible on the website. You are finding the best reason to start a conversation, not diagnosing the whole business.
        </p>

        <div className="mt-7">
          <p className="text-sm font-semibold">Industry</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              ["construction", "Construction"],
              ["roofing", "Roofing"],
              ["flooring", "Flooring"],
              ["cladding", "Cladding"],
              ["other", "Other"],
            ].map(([value, label]) => {
              const active = input.industry === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setInput({ ...input, industry: value as Industry })}
                  style={
                    active
                      ? { background: t.accent, color: t.accentText, borderColor: t.accent }
                      : { background: t.surfaceAlt, color: t.text, borderColor: t.border }
                  }
                  className="finder-option min-h-10 rounded-full border px-3 text-sm font-semibold"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {input.industry === "other" && (
            <input
              value={input.otherIndustry}
              onChange={(e) => setInput({ ...input, otherIndustry: e.target.value })}
              placeholder="Industry or niche"
              style={{ background: t.surfaceAlt, color: t.text, borderColor: t.border }}
              className="mt-3 min-h-11 w-full rounded-xl border px-4 text-sm outline-none"
            />
          )}
        </div>

        <div className="mt-7 space-y-6">
          <div>
            <p className="text-sm font-semibold">Can customers get useful pricing without contacting the team?</p>
            <ToggleGroup
              t={t}
              value={input.pricing}
              options={triOptions}
              onChange={(v) => setInput({ ...input, pricing: v as Tri })}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">Can customers explain what they need and be guided to the right products?</p>
            <ToggleGroup
              t={t}
              value={input.guidedChoice}
              options={triOptions}
              onChange={(v) => setInput({ ...input, guidedChoice: v as Tri })}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">Does the site clearly explain what products are for, how they are used and how they are measured?</p>
            <ToggleGroup
              t={t}
              value={input.education}
              options={triOptions}
              onChange={(v) => setInput({ ...input, education: v as Tri })}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">Can a customer send most of what is needed for a quote before staff get involved?</p>
            <ToggleGroup
              t={t}
              value={input.quoteReady}
              options={triOptions}
              onChange={(v) => setInput({ ...input, quoteReady: v as Tri })}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">Is the important customer journey genuinely easy on mobile?</p>
            <ToggleGroup
              t={t}
              value={input.mobile}
              options={[
                { value: "yes", label: "Strong" },
                { value: "partly", label: "Okay" },
                { value: "no", label: "Poor" },
              ]}
              onChange={(v) => setInput({ ...input, mobile: v as Tri })}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">If they offer online ordering, how easy is it?</p>
            <ToggleGroup
              t={t}
              value={input.store}
              options={[
                { value: "easy", label: "Easy" },
                { value: "clunky", label: "Clunky" },
                { value: "none", label: "No store" },
                { value: "not-relevant", label: "Not relevant" },
              ]}
              onChange={(v) => setInput({ ...input, store: v as StoreState })}
            />
          </div>

          <div>
            <p className="text-sm font-semibold">Overall, how would you describe the site and current digital setup?</p>
            <ToggleGroup
              t={t}
              value={input.overall}
              options={[
                { value: "strong", label: "Strong" },
                { value: "mixed", label: "Decent, but fragmented" },
                { value: "weak", label: "Weak or outdated" },
              ]}
              onChange={(v) => setInput({ ...input, overall: v as OverallState })}
            />
          </div>
        </div>

        <button
          type="button"
          disabled={!complete}
          onClick={() => setShowResult(true)}
          style={{ background: complete ? t.accent : t.surfaceAlt, color: complete ? t.accentText : t.muted }}
          className="solid mt-7 min-h-12 w-full rounded-full px-6 text-sm font-semibold disabled:cursor-not-allowed"
        >
          Find the lead angle
        </button>

        <p className="mt-3 text-xs leading-5" style={{ color: t.muted }}>
          Important: there is almost always an angle. Missing features are an angle. Clunky features are an angle. A strong setup can still be an optimisation angle.
        </p>
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start">
        {!showResult ? (
          <div style={{ background: t.surfaceAlt, borderColor: t.border }} className="rounded-3xl border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>
              What you will get
            </p>
            <h3 className="mt-3 text-3xl font-bold">A usable reason to contact the lead.</h3>
            <div className="mt-5 grid gap-3">
              {[
                "Primary angle and supporting angles",
                "Suggested opener",
                "Closest demo to show",
                "Likely solution fit",
                "Discovery questions for the call",
              ].map((item) => (
                <div key={item} style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border px-4 py-3 text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6" style={{ color: t.muted }}>
              The result is a hypothesis. The website gives you the opening angle. The conversation tells you what is actually costing the business time or money.
            </p>
          </div>
        ) : (
          <div style={{ background: t.surfaceAlt, borderColor: t.accentInk }} className="rounded-3xl border p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>
                  Lead result
                </p>
                <h3 className="mt-2 text-3xl font-bold">{industryName}</h3>
              </div>
              <button
                type="button"
                onClick={copyNotes}
                style={{ background: t.accent, color: t.accentText }}
                className="solid rounded-full px-4 py-2 text-xs font-semibold"
              >
                {copied ? "Copied" : "Copy lead notes"}
              </button>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: t.muted }}>
                Primary angle
              </p>
              <h4 className="mt-1 text-xl font-bold">{result.angles[0].title}</h4>
              <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
                {result.angles[0].short}
              </p>
            </div>

            {result.angles.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.angles.slice(1).map((angle) => (
                  <span key={angle.key} style={{ background: t.surface, borderColor: t.border }} className="rounded-full border px-3 py-1.5 text-xs font-semibold">
                    Also: {angle.title}
                  </span>
                ))}
              </div>
            )}

            <div style={{ background: t.surface, borderColor: t.border }} className="mt-5 rounded-2xl border p-5">
              <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: t.accentInk }}>
                Suggested opener
              </p>
              <p className="mt-2 text-sm leading-6">{result.angles[0].opener}</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold">Possible solution fit</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(result.solutions.length ? result.solutions : ["Targeted custom solution"]).map((item) => (
                    <span key={item} style={{ background: t.surface, borderColor: t.border }} className="rounded-full border px-3 py-1.5 text-xs font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold">Recommended demo</p>
                <div className="mt-2 space-y-2">
                  {result.demos.map((demo) => (
                    <a
                      key={demo.name}
                      href={demo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: t.accentInk }}
                      className="block text-sm font-semibold hover:underline"
                    >
                      {demo.name} →
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold">Ask next</p>
              <div className="mt-2 grid gap-2">
                {result.questions.map((question) => (
                  <div key={question} style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border p-3 text-sm leading-6">
                    {question}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-xs leading-5" style={{ color: t.muted }}>
              Do not promise a specific build from this result. Use it to start the conversation, then let discovery determine the best solution.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

type Involvement = "refer" | "cowork" | "close";

const COMMISSION = {
  refer: {
    title: "Refer the opportunity",
    min: 0.15,
    body: "You create the introduction or get the prospect onto a call. T3 Labs handles discovery, proposal and closing.",
  },
  cowork: {
    title: "Work the deal with us",
    min: 0.20,
    body: "You qualify the lead, stay involved and help us move the opportunity through discovery and close.",
  },
  close: {
    title: "Sell and close",
    min: 0.30,
    body: "You own the sales process and hand T3 Labs a confirmed customer ready for delivery.",
  },
};

function EarningsCalculator({ t }: { t: Tokens }) {
  const [amount, setAmount] = useState("5000");
  const [involvement, setInvolvement] = useState<Involvement>("refer");

  const parsed = Math.max(0, Number(amount.replace(/[^0-9.]/g, "")) || 0);
  const minimum = parsed * COMMISSION[involvement].min;
  const potentialMax = parsed * 0.5;

  return (
    <div style={{ background: t.surface, borderColor: t.border }} className="rounded-3xl border p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>
            Calculator
          </p>
          <h3 className="mt-2 text-3xl font-bold">What could this deal be worth to you?</h3>
          <p className="mt-3 text-sm leading-6" style={{ color: t.muted }}>
            Minimum commission depends on your involvement. Higher rates can be agreed for individual deals, up to 50%. Recurring commission can also be included where the customer has ongoing fees.
          </p>

          <div className="mt-5">
            <label className="text-sm font-semibold">Project value</label>
            <div className="mt-2 flex items-center gap-2">
              <span style={{ color: t.muted }} className="text-xl font-semibold">$</span>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ background: t.surfaceAlt, borderColor: t.border, color: t.text }}
                className="min-h-11 w-full rounded-xl border px-4 font-semibold outline-none"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["999", "5000", "10000", "20000"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  style={{ background: t.surfaceAlt, borderColor: t.border }}
                  className="finder-option rounded-full border px-3 py-1.5 text-xs font-semibold"
                >
                  {money(Number(preset))}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold">Your involvement</p>
            <div className="mt-2 grid gap-2">
              {(Object.keys(COMMISSION) as Involvement[]).map((key) => {
                const active = involvement === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setInvolvement(key)}
                    style={
                      active
                        ? { background: t.accent, color: t.accentText, borderColor: t.accent }
                        : { background: t.surfaceAlt, color: t.text, borderColor: t.border }
                    }
                    className="finder-option rounded-xl border p-3 text-left"
                  >
                    <span className="block text-sm font-semibold">{COMMISSION[key].title}</span>
                    <span className="mt-0.5 block text-xs opacity-75">Minimum {(COMMISSION[key].min * 100).toFixed(0)}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="rounded-2xl border p-6">
            <p className="text-sm font-semibold">{COMMISSION[involvement].title}</p>
            <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
              {COMMISSION[involvement].body}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border p-4">
                <p className="text-xs font-semibold uppercase tracking-[.12em]" style={{ color: t.muted }}>
                  Minimum at this level
                </p>
                <p className="mt-2 text-3xl font-bold">{money(minimum)}</p>
                <p className="mt-1 text-xs" style={{ color: t.muted }}>
                  Based on {(COMMISSION[involvement].min * 100).toFixed(0)}%
                </p>
              </div>

              <div style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border p-4">
                <p className="text-xs font-semibold uppercase tracking-[.12em]" style={{ color: t.muted }}>
                  Potential upper rate
                </p>
                <p className="mt-2 text-3xl font-bold">{money(potentialMax)}</p>
                <p className="mt-1 text-xs" style={{ color: t.muted }}>
                  50% only where specifically agreed
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5" style={{ color: t.muted }}>
              These are illustrations, not an automatic entitlement to 50%. Each paying customer will have a separate deal record or agreement that confirms the project value, your role, the agreed commission rate, any recurring commission and the payment terms. Recurring commission is not included in this calculator.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["$999 project", "Referral minimum", "$150"],
              ["$5,000 project", "Referral minimum", "$750"],
              ["$10,000 project", "Referral minimum", "$1,500+"],
            ].map(([title, label, value]) => (
              <div key={title} style={{ background: t.surfaceAlt, borderColor: t.border }} className="rounded-xl border p-4">
                <p className="text-xs font-semibold" style={{ color: t.muted }}>{title}</p>
                <p className="mt-1 text-xl font-bold">{value}</p>
                <p className="mt-1 text-xs" style={{ color: t.muted }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SalesResourcesPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const t = theme === "dark" ? dark : light;

  return (
    <main
      style={{
        background: t.bg,
        color: t.text,
        ["--accent" as string]: t.accent,
        ["--accent-ink" as string]: t.accentInk,
      }}
      className="min-h-screen antialiased"
    >
      <style>{`
        main button, main a { cursor:pointer; transition:transform .15s ease, filter .15s ease, border-color .15s ease, box-shadow .15s ease; }
        .solid:hover { transform:translateY(-1px); filter:brightness(1.08); box-shadow:0 7px 22px rgba(215,255,0,.16); }
        .outline:hover, .finder-option:hover { border-color:var(--accent-ink)!important; }
        .hover-card { transition:transform .15s ease, border-color .15s ease; }
        .hover-card:hover { transform:translateY(-2px); border-color:var(--accent-ink)!important; }
        .nav-scroll { scrollbar-width:none; }
        .nav-scroll::-webkit-scrollbar { display:none; }
        .tool-toggle:hover { background:rgba(127,127,127,.05); }
        .sales-anchor { scroll-margin-top:9.5rem; }
        table { border-collapse:separate; border-spacing:0; }
        th, td { vertical-align:top; }
      `}</style>

      <header
        style={{
          background: theme === "dark" ? "rgba(10,11,16,.92)" : "rgba(251,252,255,.94)",
          borderColor: t.border,
        }}
        className="sticky top-0 z-50 border-b backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 shrink-0 items-center gap-3">
            <img src={LOGO_SRC} alt="T3 Labs" className="h-8 w-auto object-contain rounded-md" style={{background:"#0a0b10",padding:"3px"}} />
            <span className="hidden text-sm font-semibold sm:inline" style={{ color: t.muted }}>Sales Resources</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{ borderColor: t.border, color: t.muted }}
              className="outline rounded-full border px-3 py-1.5 text-xs"
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
            <a
              href={CUSTOMER_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: t.accent, color: t.accentText }}
              className="solid rounded-full px-4 py-2 text-xs font-semibold"
            >
              Customer page
            </a>
          </div>
        </div>

        <div style={{ borderColor: t.border }} className="nav-scroll mx-auto flex max-w-7xl gap-1 overflow-x-auto border-t px-4 py-2.5 sm:px-5">
          {[
            ["target", "Target"],
            ["finder", "Angle Finder"],
            ["contact", "Reach Them"],
            ["discovery", "Discovery"],
            ["sell", "What We Sell"],
            ["demos", "Demos"],
            ["earnings", "Earnings"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToId(id)}
              style={{ color: t.muted }}
              className="shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold hover:underline"
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-5">
        <section className="py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[.2em]" style={{ color: t.accentInk }}>
            T3 Labs Construction Sales Playbook
          </p>

          <h1 className="mt-4 max-w-5xl text-3xl font-bold leading-[1.06] tracking-tight sm:text-5xl">
            Find the lead. Find the angle. Start the conversation.
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-8" style={{ color: t.muted }}>
            We help businesses get found easier, then convert more of that traffic into paying customers using tools and systems that let customers find the answer they need quicker and easier. Those same systems can also soft-funnel them into the sales process and reduce repetitive work for the business.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="rounded-2xl border p-5">
              <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: t.accentInk }}>Customer starting price</p>
              <p className="mt-2 text-3xl font-bold">$999+</p>
              <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
                $999 is the entry point, not a fixed package. Scope can scale as far as the business needs.
              </p>
            </div>

            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-5">
              <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: t.muted }}>Your minimum commission</p>
              <p className="mt-2 text-3xl font-bold">15%+</p>
              <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
                Even a referral can earn roughly $150 on a $999 project, or $1,500+ on a $10,000 project.
              </p>
            </div>

            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-5">
              <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: t.muted }}>If you close the deal</p>
              <p className="mt-2 text-3xl font-bold">30%+</p>
              <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
                Higher rates can be agreed by deal, up to 50%. Some deals can also include recurring commission.
              </p>
            </div>
          </div>

          <div style={{ background: t.surfaceAlt, borderColor: t.border }} className="mt-6 rounded-2xl border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>
              30-second version
            </p>
            <p className="mt-3 max-w-5xl text-xl font-semibold leading-8">
              Find businesses where customers still have to wait, search around, call, email or fill in a generic form to get a useful answer. We build custom tools and systems that remove that friction, make the website more useful, and can also reduce manual work behind the scenes.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {[
              ["1", "Find"],
              ["2", "Audit"],
              ["3", "Angle"],
              ["4", "Contact"],
              ["5", "Discover"],
              ["6", "Demo"],
              ["7", "Advance"],
            ].map(([n, label]) => (
              <div key={n} style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border p-4">
                <span className="text-xs font-bold" style={{ color: t.accentInk }}>{n}</span>
                <p className="mt-1 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="target" className="sales-anchor py-12 sm:py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>1. Who to target</p>
            <h2 className="mt-3 text-3xl font-bold">Start where the sales friction is easiest to see.</h2>
            <p className="mt-4 leading-7" style={{ color: t.muted }}>
              Construction and roofing are the current focus because we already have useful roofing, flooring and cladding demos. You are not limited to these industries. If you understand another niche and can recognise the same problems, use that knowledge.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <Card t={t} title="Best places to start">
              <ul className="space-y-2 text-sm leading-6" style={{ color: t.muted }}>
                <li>• Roofing suppliers and manufacturers</li>
                <li>• Flooring suppliers</li>
                <li>• Cladding and wall-system suppliers</li>
                <li>• Building product merchants and distributors</li>
                <li>• Trade businesses doing frequent quoting</li>
                <li>• Manufacturers with complex product ranges</li>
              </ul>
            </Card>

            <Card t={t} title="Good commercial signals">
              <ul className="space-y-2 text-sm leading-6" style={{ color: t.muted }}>
                <li>• Meaningful order values</li>
                <li>• Customers need pricing or estimates</li>
                <li>• Quantities or measurements matter</li>
                <li>• Products need explanation or compatibility checks</li>
                <li>• Lots of enquiries or quotes</li>
                <li>• Repeat trade customers</li>
              </ul>
            </Card>

            <Card t={t} title="Do not over-filter">
              <p className="text-sm leading-6" style={{ color: t.muted }}>
                We are not only looking for bad websites. A strong business may have already paid for the heavy lifting and still be missing the final pieces that make everything work harder.
              </p>
              <p className="mt-3 text-sm font-semibold">
                There is often an angle in both weak and strong setups.
              </p>
            </Card>
          </div>
        </section>

        <section id="finder" className="sales-anchor py-12 sm:py-16">
          <CollapsibleTool
            t={t}
            title="Lead Angle Finder"
            subtitle="Audit a prospect&apos;s website, find the strongest opening angle and get a usable pitch in under 2 minutes."
            defaultOpen={true}
          >
            <LeadAngleFinder t={t} />
          </CollapsibleTool>
        </section>

        <section className="py-10 sm:py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>Angle map</p>
              <h2 className="mt-2 text-3xl font-bold">Use this if you do not need the finder.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6" style={{ color: t.muted }}>
              The website gives you the opening angle. Discovery tells you what the real project should become.
            </p>
          </div>

          <div style={{ borderColor: t.border }} className="mt-6 overflow-x-auto rounded-2xl border">
            <table className="min-w-[950px] w-full text-left text-sm">
              <thead style={{ background: t.surfaceAlt }}>
                <tr>
                  {["Angle", "What you noticed", "Simple pitch", "Likely fit"].map((h) => (
                    <th key={h} style={{ borderColor: t.border }} className="border-b px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ background: t.surface }}>
                {[
                  ["Faster answers", "No useful pricing, generic quote form, phone or email required", "Give customers more of the answer now, then send staff a better enquiry.", "Pricing tool, estimator, quote intake, assistant"],
                  ["Easier buying", "Store or products exist, but customers have to hunt or understand too much", "Make the journey guided instead of making the buyer figure it out alone.", "Product selector, store UX, guided tool"],
                  ["Product guidance", "Large range, compatibility questions, specialist knowledge", "Turn product knowledge into something customers can use without waiting for the expert.", "Selector, education, sales assistant"],
                  ["Reduce manual work", "Website appears to push the real work back onto staff", "Collect and calculate more before a person needs to get involved.", "Quote flow, staff tool, spreadsheet replacement"],
                  ["Mobile journey", "Important actions are awkward or broken on a phone", "Make the first customer experience useful on the device they are already using.", "Mobile optimisation, rebuild, mobile-first tool"],
                  ["Icing on the cake", "Strong site or store, but features are fragmented", "Get more value from what they have already paid to build.", "Optimisation, integrations, connected tools"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td
                        key={cell}
                        style={{ borderColor: t.border, color: i === 0 ? t.text : t.muted }}
                        className={`border-b px-4 py-4 leading-6 ${i === 0 ? "font-semibold" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="contact" className="sales-anchor py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>2. Reaching the lead</p>
          <h2 className="mt-3 text-3xl font-bold">Lead with the thing you actually noticed.</h2>
          <p className="mt-4 max-w-4xl leading-7" style={{ color: t.muted }}>
            Do not send a generic technology pitch. Mention one real observation from the website, connect it to a useful outcome, then ask for the conversation.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            <Card t={t} title="Cold call">
              <p className="text-sm leading-6" style={{ color: t.muted }}>
                Best when the business is accessible and the pain is obvious. Keep the first 20 to 30 seconds specific.
              </p>
              <div style={{ background: t.surfaceAlt }} className="mt-4 rounded-xl p-4 text-sm leading-6">
                “I was looking through your website and noticed customers still have to contact you for [pricing / product help / a quote]. We build tools that can handle more of that online. Worth 30 seconds?”
              </div>
            </Card>

            <Card t={t} title="Email">
              <p className="text-sm leading-6" style={{ color: t.muted }}>
                Best when you can point to something specific or send the closest demo.
              </p>
              <div style={{ background: t.surfaceAlt }} className="mt-4 rounded-xl p-4 text-sm leading-6">
                “I noticed [specific friction] on your site. We build custom tools that give customers faster answers and reduce the amount your team has to handle manually. I thought this example might be relevant.”
              </div>
            </Card>

            <Card t={t} title="LinkedIn">
              <p className="text-sm leading-6" style={{ color: t.muted }}>
                Useful for finding the right person in larger businesses and creating a warmer route into the conversation.
              </p>
              <div style={{ background: t.surfaceAlt }} className="mt-4 rounded-xl p-4 text-sm leading-6">
                Keep it short. Mention the business, the website observation and why you think it may be relevant. Do not turn the first message into a full pitch.
              </div>
            </Card>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_.9fr]">
            <Card t={t} title="Who should you contact?">
              <p className="text-sm leading-6" style={{ color: t.muted }}>
                Smaller business: owner, founder or managing director.
              </p>
              <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
                Larger business: sales, commercial, ecommerce, digital, marketing or operations leadership.
              </p>
              <p className="mt-3 text-sm font-semibold">
                You need someone who owns revenue, customer experience, digital or operations. Do not waste hours hunting for the perfect job title.
              </p>
            </Card>

            <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="rounded-2xl border p-5 sm:p-6">
              <p className="text-sm font-semibold">Mobile is a useful angle, but check both devices.</p>
              <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
                A 2026 ecommerce benchmark cited by Shopify found mobile generated 70% of traffic, while desktop conversion averaged 3.4% versus 2.0% on mobile. The useful sales angle is simple: mobile often wins the first impression, while desktop can still be important when people evaluate and buy.
              </p>
              <p className="mt-3 text-xs leading-5" style={{ color: t.muted }}>
                Treat this as an ecommerce benchmark, not the prospect&apos;s own analytics. Check their actual site on both devices.
              </p>
              <a
                href="https://www.shopify.com/blog/mobile-vs-desktop-conversion-rates"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: t.accentInk }}
                className="mt-3 inline-block text-xs font-semibold hover:underline"
              >
                Source: Shopify, 2026 →
              </a>
            </div>
          </div>
        </section>

        <section id="discovery" className="sales-anchor py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>3. Discovery</p>
          <h2 className="mt-3 text-3xl font-bold">The website shows the symptom. The conversation finds the real problem.</h2>
          <p className="mt-4 max-w-4xl leading-7" style={{ color: t.muted }}>
            Do not assume you know the backend from the public website. Ask where staff time goes, what customers repeatedly need and what slows down the sales process.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <Card t={t} title="Questions worth asking">
              <ul className="space-y-2 text-sm leading-6" style={{ color: t.muted }}>
                <li>• How do customers currently get pricing?</li>
                <li>• What usually happens after someone requests a quote?</li>
                <li>• What information does the team repeatedly have to chase?</li>
                <li>• What do customers call or email about over and over?</li>
                <li>• What calculations are still done manually?</li>
                <li>• What important work still lives in spreadsheets?</li>
                <li>• Who inside the business holds the product knowledge everyone relies on?</li>
                <li>• What would you love customers or staff to be able to do more easily?</li>
              </ul>
            </Card>

            <Card t={t} title="Listen for leverage">
              <ul className="space-y-2 text-sm leading-6" style={{ color: t.muted }}>
                <li>• Customers waiting for answers</li>
                <li>• Low-value calls and emails</li>
                <li>• Repetitive pricing or product questions</li>
                <li>• Manual quantities, takeoffs or calculations</li>
                <li>• Poor-quality or incomplete enquiries</li>
                <li>• One or two people holding all the useful knowledge</li>
                <li>• Spreadsheets that run important parts of the business</li>
                <li>• Systems that exist but do not connect cleanly</li>
              </ul>
              <p className="mt-4 text-sm font-semibold">
                The best first project is often the smallest change that removes a real bottleneck.
              </p>
            </Card>
          </div>
        </section>

        <section id="sell" className="sales-anchor py-12 sm:py-16">
          <div className="grid gap-6 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>4. What we sell</p>
              <h2 className="mt-3 text-3xl font-bold">One custom solution, many possible forms.</h2>
            </div>
            <p className="leading-7" style={{ color: t.muted }}>
              Do not force the prospect into a fixed package. $999 is only the entry point. Project value depends on the size of the business, how much tailored work is involved and how many features they need or want. Bespoke packages can easily reach $20,000+ and there is no fixed upper limit.
            </p>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            <Card t={t} title="Customer-facing sales tools">
              <ul className="space-y-2 text-sm leading-6" style={{ color: t.muted }}>
                <li>• Pricing and estimating tools</li>
                <li>• Takeoff and quantity calculators</li>
                <li>• Product selectors</li>
                <li>• Quote builders</li>
                <li>• Trade or customer portals</li>
                <li>• Ordering flows</li>
                <li>• Intelligent Online Sales Assistant</li>
              </ul>
            </Card>

            <Card t={t} title="Website and buying journey">
              <ul className="space-y-2 text-sm leading-6" style={{ color: t.muted }}>
                <li>• Mobile optimisation</li>
                <li>• Improve or rebuild the website</li>
                <li>• Product and technical information</li>
                <li>• Store UX improvements</li>
                <li>• Better enquiry flows</li>
                <li>• Connect existing website features</li>
              </ul>
            </Card>

            <Card t={t} title="Internal business systems">
              <ul className="space-y-2 text-sm leading-6" style={{ color: t.muted }}>
                <li>• Staff quoting tools</li>
                <li>• Workflow automation</li>
                <li>• Spreadsheet replacement</li>
                <li>• Pricing systems</li>
                <li>• CRM or system integrations</li>
                <li>• Dashboards and reporting</li>
                <li>• Fully bespoke internal software</li>
              </ul>
            </Card>
          </div>

          <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="mt-5 rounded-2xl border p-6 sm:p-8">
            <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.15em]" style={{ color: t.accentInk }}>
                  Major capability
                </p>
                <h3 className="mt-2 text-3xl font-bold">Intelligent Online Sales Assistant</h3>
                <p className="mt-3 text-sm leading-6" style={{ color: t.muted }}>
                  A trained online sales assistant that understands the business, product catalogue, pricing rules, compatibility and common questions. It can handle basic to complex enquiries, solve straightforward questions directly, work through product, quantity and indicative-pricing needs, then hand anything that needs a person to the human team with the context already collected. The goal is to reduce avoidable calls and emails without ever blocking the sale.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border p-4">
                  <p className="text-sm font-semibold">AI-friendly prospect</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
                    “Imagine ChatGPT on your website, except it knows your business, products and pricing. It can answer the easy questions instantly, work through product, quantity and indicative-pricing needs, and hand anything more complex to your team with the conversation already captured.”
                  </p>
                </div>
                <div style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border p-4">
                  <p className="text-sm font-semibold">AI-cautious prospect</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
                    “Think of it as a controlled online sales assistant. We define what it knows, what it can answer and when it must stop. It handles the repetitive product, usage, quantity and indicative-pricing questions that create calls and emails, and anything uncertain or complex is handed to your team, so it never needs to guess or block the sale.”
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: t.surfaceAlt, borderColor: t.border }} className="mt-5 rounded-2xl border p-5">
            <p className="text-sm font-semibold">$999 is the entry point, not a fixed package or ceiling.</p>
            <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
              Larger catalogues, complex calculations, integrations, website work, internal systems and sales-assistant functionality can move a project into the thousands or easily beyond $20,000. There is no fixed upper limit. Keep the first conversation focused on the problem and value, then T3 Labs can help scope the right build.
            </p>
          </div>
        </section>

        <section id="demos" className="sales-anchor py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>5. Demo the behaviour</p>
          <h2 className="mt-3 text-3xl font-bold">Show the closest example. Do not sell the design.</h2>
          <p className="mt-4 max-w-4xl leading-7" style={{ color: t.muted }}>
            Learn the demos well enough to screen-share them. The point is to show what the customer can do, not to convince the prospect that the demo already looks like their business.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {(Object.keys(DEMOS) as (keyof typeof DEMOS)[]).map((key) => {
              const demo = DEMOS[key];
              return (
                <a
                  key={demo.name}
                  href={demo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: t.surface, borderColor: t.border }}
                  className="hover-card rounded-2xl border p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: t.accentInk }}>
                    {key}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{demo.name}</h3>
                  <p className="mt-3 text-sm leading-6" style={{ color: t.muted }}>{demo.note}</p>
                  <p className="mt-5 text-sm font-semibold" style={{ color: t.accentInk }}>Open demo →</p>
                </a>
              );
            })}
          </div>

          {ASSISTANT_DEMO_URL && (
            <a
              href={ASSISTANT_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: t.surface, borderColor: t.accentInk }}
              className="hover-card mt-4 block rounded-2xl border p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: t.accentInk }}>
                Online Sales Assistant
              </p>
              <h3 className="mt-2 text-xl font-semibold">Apex Roofing Sales Assistant</h3>
              <p className="mt-3 text-sm leading-6" style={{ color: t.muted }}>
                Show a normal product question, then a pricing conversation that moves into a preliminary quote or handoff.
              </p>
              <p className="mt-5 text-sm font-semibold" style={{ color: t.accentInk }}>Open assistant demo →</p>
            </a>
          )}

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <Card t={t} title="When to ask for a custom demo">
              <p className="text-sm leading-6" style={{ color: t.muted }}>
                Do not ask T3 Labs to build a bespoke demo just because somebody is interested.
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6" style={{ color: t.muted }}>
                <li>• The business is clearly qualified</li>
                <li>• There is meaningful project potential</li>
                <li>• The decision maker is engaged</li>
                <li>• The existing demos cannot show the key idea properly</li>
              </ul>
            </Card>

            <Card t={t} title="Mixed or different industry?">
              <p className="text-sm leading-6" style={{ color: t.muted }}>
                Show whichever workflow best demonstrates the behaviour you are discussing. If none matches the industry, roofing is usually a good example of measurement, products, pricing and quote handoff.
              </p>
              <p className="mt-3 text-sm font-semibold">
                Explain that everything can be rebuilt around their brand, products, rules and workflow.
              </p>
            </Card>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>6. Useful objections and proof</p>
          <h2 className="mt-3 text-3xl font-bold">Know enough to support the pitch without overcomplicating it.</h2>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <Card t={t} title="“We do not want competitors seeing our pricing.”">
              <p className="text-sm leading-6" style={{ color: t.muted }}>
                They do not need to publish every trade rate or their best price. The public layer can use starting prices, indicative pricing, selected products or standard pricing, while private trade or customer pricing stays behind a login.
              </p>
              <p className="mt-3 text-sm font-semibold">
                The goal is to give the buyer more useful information than “contact us for pricing”.
              </p>
            </Card>

            <Card t={t} title="Proof you can cite live">
              <ul className="space-y-3 text-sm leading-6" style={{ color: t.muted }}>
                <li>
                  <strong style={{ color: t.text }}>Google:</strong> AI Mode queries are around 3 times longer than traditional searches.
                </li>
                <li>
                  <strong style={{ color: t.text }}>Invoca 2026 home services:</strong> 63% used generative AI to research a high-stakes purchase.
                </li>
                <li>
                  <strong style={{ color: t.text }}>Speed:</strong> 79% said they would switch to a faster-responding competitor.
                </li>
                <li>
                  <strong style={{ color: t.text }}>Information gap:</strong> 26% called because the information they needed was not available online.
                </li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: t.accentInk }}
                  className="text-xs font-semibold hover:underline"
                >
                  Google source →
                </a>
                <a
                  href="https://www.invoca.com/uk/reports/home-services-buyer-experience-report-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: t.accentInk }}
                  className="text-xs font-semibold hover:underline"
                >
                  Invoca source →
                </a>
              </div>
            </Card>
          </div>
        </section>

        <section id="earnings" className="sales-anchor py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>7. What you can earn</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold">More involvement can mean materially more commission.</h2>
          <p className="mt-4 max-w-4xl leading-7" style={{ color: t.muted }}>
            The minimum rate depends on how much of the sales process you own. These are minimums, not caps. Stronger arrangements can be discussed for individual opportunities, up to a maximum of 50%. Commission can be one-off, recurring, or a combination where the deal supports it.
          </p>

          <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="mt-6 rounded-2xl border p-5 sm:p-6">
            <p className="text-sm font-semibold">Think beyond the $999 entry project.</p>
            <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>
              A $10,000 project is $1,500+ commission even at the 15% referral minimum. A $20,000 project is $3,000+ at the same rate. Bespoke projects can go higher, and some customer arrangements may also create recurring commission.
            </p>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {(Object.keys(COMMISSION) as Involvement[]).map((key) => (
              <Card t={t} title={`${COMMISSION[key].title} · ${(COMMISSION[key].min * 100).toFixed(0)}% minimum`}>
                <p className="text-sm leading-6" style={{ color: t.muted }}>{COMMISSION[key].body}</p>
                <p className="mt-3 text-sm font-semibold">
                  $5,000 project: {money(5000 * COMMISSION[key].min)} minimum
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-5">
            <CollapsibleTool
              t={t}
              title="Earnings calculator"
              subtitle="Estimate what a one-off project could be worth at each involvement level."
              defaultOpen={false}
            >
              <EarningsCalculator t={t} />
            </CollapsibleTool>
          </div>
        </section>


        <section className="py-12 sm:py-20">
          <div style={{ background: t.surface, borderColor: t.accentInk }} className="rounded-3xl border p-7 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>The whole job</p>
            <p className="mt-4 max-w-5xl text-xl font-semibold leading-8">
              Find a business → audit the website → find the strongest angle → contact the right person → uncover the real bottleneck → show the closest demo → identify the first useful custom solution → bring T3 Labs in or close it yourself.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={CUSTOMER_PAGE}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: t.accent, color: t.accentText }}
                className="solid inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold"
              >
                Open customer page
              </a>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ borderColor: t.border }}
                className="outline inline-flex min-h-12 items-center justify-center rounded-full border px-7 text-sm font-semibold"
              >
                Book T3 Labs into the call
              </a>
            </div>

            <p className="mt-5 text-xs leading-5" style={{ color: t.muted }}>
              Next step after this sales page is final: add the formal rep agreement, define customer-specific deal agreements and commission payment terms, and collect the rep&apos;s payment details.
            </p>
          </div>
        </section>

        <section className="pb-14 sm:pb-20">
          <CollapsibleTool
            t={t}
            title="More opportunities"
            subtitle="Beyond this playbook: two more ways to earn from the same conversation."
            defaultOpen={false}
          >
            <div
              style={{ borderColor: t.accent }}
              className="rounded-3xl border p-3 sm:p-5"
            >
              <InnerDisclosure
                title="What else we can build"
                eyebrow="T3 LABS SERVICES"
                accent="#d7ff00"
                border={t.border}
                surface={t.surface}
                surfaceAlt={t.surfaceAlt}
                muted={t.muted}
                defaultOpen
              >
                <p className="text-sm leading-7" style={{ color: t.muted }}>
                  T3 Labs is a digital software builder. Beyond the solutions on this page, if a business needs a tech solution for anything, we can likely build it. Everything below works as a standalone service or as an add-on that strengthens a larger package deal.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Complete websites",
                    "Website improvements",
                    "Mobile optimisation",
                    "SEO & GEO",
                    "Ongoing support",
                    "Sales strategy",
                    "Video production",
                    "Custom tech, any problem",
                  ].map((item) => (
                    <span
                      key={item}
                      style={{ background: t.surfaceAlt, borderColor: t.border, color: t.muted }}
                      className="rounded-full border px-3 py-1 text-xs font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6" style={{ color: t.muted }}>
                  If a prospect has one visible problem, they often have several of these too. Ask. A bigger package means a better result for the customer, more commission for you and more work for T3 Labs.
                </p>
              </InnerDisclosure>

              <div className="mt-3">
                <InnerDisclosure
                  title="QuoteCore+"
                  eyebrow="READY-MADE PRODUCT"
                  accent="#FF6B35"
                  border={t.border}
                  surface={t.surface}
                  surfaceAlt={t.surfaceAlt}
                  muted={t.muted}
                >
                  <a
                    href="/careers"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: t.surface, borderColor: t.border }}
                    className="hover-card block rounded-2xl border p-5 sm:p-6"
                  >
                    <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#FF6B35]">
                          QuoteCore+
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">A ready-made measuring, estimating and quoting system for contractors.</h3>
                        <p className="mt-3 max-w-4xl text-sm leading-6" style={{ color: t.muted }}>
                          QuoteCore+ replaces disconnected spreadsheets, printed-plan measuring and repeated admin with digital takeoff, reusable pricing logic and one connected quote workflow. The strongest sales path is Done-For-You setup for contractors who want a better system but do not want the hassle of configuring it themselves.
                        </p>
                        <p className="mt-3 text-sm leading-6" style={{ color: t.muted }}>
                          You can also refer self-serve subscribers, earn recurring commission under the current rep terms, and use genuinely free QuoteCore+ tools as a useful first step when a prospect is not ready to buy.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {["Done-For-You setup", "Self-serve referrals", "Free tools", "Rep resources"].map((item) => (
                            <span
                              key={item}
                              style={{ background: t.surfaceAlt, borderColor: t.border, color: t.muted }}
                              className="rounded-full border px-3 py-1 text-xs font-semibold"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span
                        style={{ background: "#FF6B35", color: "#0a0b10" }}
                        className="solid inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold"
                      >
                        Open QuoteCore+ sales guide →
                      </span>
                    </div>
                  </a>
                </InnerDisclosure>
              </div>
            </div>
          </CollapsibleTool>
        </section>
      </div>
    </main>
  );
}
