import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.t3labs.tech";
const SALES_RESOURCES_URL = "/sales-resources";

const QC = {
  pricing: "https://quote-core.com/pricing",
  demo: "https://quote-core.com/demo",
  dfy: "https://quote-core.com/done-for-you-setup",
  freeTools: "https://quote-core.com/free-tools",
  digitalTakeoff: "https://quote-core.com/features/digital-roof-takeoff",
  aiScan: "https://quote-core.com/features/ai-scan-assist",
  smartComponents: "https://quote-core.com/features/smart-components",
};

export const metadata: Metadata = {
  title: "QuoteCore+ Sales Guide | T3 Labs",
  description:
    "T3 Labs sales guide for QuoteCore+: who to target, how to sell the Smart Assistant and simpler workflow, when to lead with Done-For-You, and how rep commissions work.",
  alternates: { canonical: `${BASE_URL}/qcp-careers` },
  openGraph: {
    title: "QuoteCore+ Sales Guide | T3 Labs",
    description:
      "A practical sales guide for selling QuoteCore+ and Done-For-You setup to roofing and construction contractors.",
    url: `${BASE_URL}/qcp-careers`,
    siteName: "T3 Labs",
    type: "website",
  },
};

const targetSignals = [
  "Quoting takes too much owner or estimator time.",
  "Pricing, labour, waste rules or product logic still live in spreadsheets or someone's head.",
  "Measurements, pricing and quote information are copied between separate tools.",
  "They want better software but do not want a complicated setup or another system to learn.",
  "They work from site or their phone and do not want to sit at a computer to get simple tasks done.",
];

const discoveryQuestions = [
  "How are you measuring and quoting jobs now?",
  "Where does your pricing live today?",
  "How long does it normally take to get from measurement to a finished quote?",
  "What is the most frustrating part of your current process?",
  "How useful would it be to create quotes, check information or update pricing from your phone using voice or text?",
];

const pathCards = [
  {
    number: "01",
    eyebrow: "LOOK FOR THIS FIRST",
    title: "Done-For-You",
    who: "Setup, migration or learning a new system could stop an otherwise good sale.",
    next: "Show the live Done-For-You page and move them toward the free 20-minute discovery call.",
    href: QC.dfy,
    cta: "Open Done-For-You page",
  },
  {
    number: "02",
    eyebrow: "SELF-SERVE",
    title: "Custom subscription",
    who: "They like QuoteCore+ and genuinely want to configure and run the account themselves.",
    next: "Help them choose the features, usage credits and storage they need, then use your issued rep link or code for attribution.",
    href: QC.pricing,
    cta: "Open subscription builder",
  },
  {
    number: "03",
    eyebrow: "NOT READY YET",
    title: "Free tools",
    who: "They are curious, cautious or simply not ready to pay or switch systems.",
    next: "Give them one useful free tool that solves the problem you were discussing, then leave the door open.",
    href: QC.freeTools,
    cta: "Open free tools",
  },
];

const objectionCards = [
  {
    title: "I hate complicated software.",
    answer:
      "Open the full demo instead of explaining the interface. It starts in a preloaded fictitious roofing business, then guides them through creating and editing pricing, measuring a roof, applying that pricing, lightly editing and emailing a quote, and a few Smart Assistant tasks.",
    links: [["Try the full demo", QC.demo]],
  },
  {
    title: "I do not have time to set all this up.",
    answer:
      "That is the Done-For-You trigger. Show them how the service starts with their current workflow and removes the setup project from their plate.",
    links: [["Done-For-You page", QC.dfy]],
  },
  {
    title: "My pricing is all over the place.",
    answer:
      "Show Smart Components and explain that repeatable material, labour, waste and pricing logic can be saved once and reused instead of rebuilt on every quote.",
    links: [["Smart Components", QC.smartComponents]],
  },
  {
    title: "We still measure from plans or paper.",
    answer:
      "Show Digital Roof Takeoff and AI Scan Assist when the measurement process is the pain. Keep the conversation focused on saving time and reducing manual transfer.",
    links: [
      ["Digital Roof Takeoff", QC.digitalTakeoff],
      ["AI Scan Assist", QC.aiScan],
    ],
  },
  {
    title: "I need something completely bespoke.",
    answer:
      "QuoteCore+ is the ready-made product path. Larger supplier, manufacturer or custom workflow opportunities belong in the main T3 Labs sales playbook.",
    links: [],
  },
];

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`cursor-pointer ${className}`}
    >
      {children}
    </a>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[#aab4c6]">
          <span className="mt-1 shrink-0 text-[#d7ff00]" aria-hidden="true">✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <style>{`
        html { scroll-behavior: smooth; }
        .qc-anchor { scroll-margin-top: 8.5rem; }
        .qc-nav-scroll { scrollbar-width: none; }
        .qc-nav-scroll::-webkit-scrollbar { display: none; }
        .qc-card, .qc-button, .qc-link {
          transition: transform .15s ease, border-color .15s ease, background-color .15s ease, color .15s ease;
        }
        .qc-card:hover { transform: translateY(-2px); border-color: rgba(215,255,0,.42); box-shadow: var(--t3-glow); }
        .qc-button:hover { transform: translateY(-1px); box-shadow: var(--t3-glow); filter: brightness(1.03); }
        .qc-link:hover { color: #d7ff00; }
        summary:focus-visible, a:focus-visible {
          outline: 2px solid #d7ff00;
          outline-offset: 4px;
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .qc-card, .qc-button, .qc-link { transition: none; }
          .qc-card:hover, .qc-button:hover { transform: none; }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-[#303d51] bg-[#0a0b10]/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4">
          <Link href="/" aria-label="T3 Labs home" className="cursor-pointer inline-flex items-center">
            <img
              src="/assets/t3-logo-white.png"
              alt="T3 Labs"
              className="h-8 w-auto rounded-md object-contain" style={{ background: "#0a0b10", padding: "3px" }}
            />
          </Link>

          <Link
            href={SALES_RESOURCES_URL}
            className="qc-link cursor-pointer text-xs font-semibold text-[#aab4c6]"
          >
            T3 Labs sales playbook →
          </Link>
        </div>

        <nav className="qc-nav-scroll mx-auto flex w-[min(1180px,calc(100%-32px))] gap-1 overflow-x-auto border-t border-[#303d51] py-2.5">
          {[
            ["target", "Who to target"],
            ["qualify", "Qualify + pitch"],
            ["paths", "3 paths"],
            ["dfy", "Done-For-You"],
            ["resources", "What to show"],
            ["credit", "Earnings"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="qc-link cursor-pointer shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold text-[#aab4c6]"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="border-b border-[#303d51]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#d7ff00]">
            QuoteCore+ sales guide
          </p>

          <h1 className="mt-4 max-w-5xl text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Sell the outcome, not the software.
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-8 text-[#aab4c6]">
            Find roofing and construction businesses losing time to measuring, pricing and quoting. Show them a simpler way to work, then choose the sales path that fits the customer.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Done-For-You", "Look for this first", "Best fit when setup, migration or learning the system could stop the sale."],
              ["02", "Smart Assistant", "Best product hook", "Voice or text from their phone for many everyday QuoteCore+ tasks. V1 beta."],
              ["03", "Custom subscription", "Self-serve", "Features, usage credits and storage can be matched to the business."],
              ["04", "Full demo", "Best proof tool", "A guided, preloaded roofing account they can try without setting anything up."],
            ].map(([n, title, tag, body]) => (
              <a
                key={n}
                href={n === "01" ? "#dfy" : "#qualify"}
                className="qc-card cursor-pointer rounded-2xl border border-[#303d51] bg-[#101722] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#d7ff00]">{n}</span>
                  <span className="rounded-full border border-[#303d51] px-3 py-1 text-xs font-semibold text-[#aab4c6]">
                    {tag}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#aab4c6]">{body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="target" className="qc-anchor border-b border-[#303d51]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#d7ff00]">1. Who to target</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold">
            Start with businesses where measurement becomes pricing, then becomes a quote.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#aab4c6]">
            Roofing is the easiest first conversation because QuoteCore+ was built around roofing workflows. The same sales logic applies to construction and measured trades where time is lost moving quantities, materials, labour and pricing into a finished quote.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#d7ff00]/30 bg-[rgba(215,255,0,.06)] p-6">
              <h3 className="text-xl font-semibold">Strong first targets</h3>
              <div className="mt-4">
                <CheckList
                  items={[
                    "Roofing contractors, estimators and owner-operators",
                    "Small-to-mid construction and trade businesses",
                    "Contractors quoting repeatedly from plans, site measurements or measured quantities",
                    "Measured trades such as cladding, flooring, fencing, decking and general building",
                  ]}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#303d51] bg-[#101722] p-6">
              <h3 className="text-xl font-semibold">Listen for these pains</h3>
              <div className="mt-4">
                <CheckList items={targetSignals} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="qualify" className="qc-anchor border-b border-[#303d51]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#d7ff00]">2. Qualify + pitch</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold">Ask enough to find the pain, then sell the part that solves it.</h2>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#303d51] bg-[#101722] p-6">
              <h3 className="text-xl font-semibold">Five useful discovery questions</h3>
              <ol className="mt-4 space-y-3">
                {discoveryQuestions.map((question, index) => (
                  <li
                    key={question}
                    className="flex items-start gap-3 border-t border-[#303d51] pt-3 first:border-0 first:pt-0"
                  >
                    <span className="text-xs font-bold text-[#d7ff00]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-7 text-[#aab4c6]">{question}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-[#d7ff00]/30 bg-[rgba(215,255,0,.06)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#d7ff00]">The new software objection killer</p>
              <h3 className="mt-3 text-xl font-semibold">QuoteCore+ Smart Assistant, V1 beta</h3>
              <p className="mt-3 text-sm leading-7 text-[#aab4c6]">
                The customer can use voice or text from their phone to work with their own QuoteCore+ account. It gives contractors another way to get work done without navigating through the full app interface every time.
              </p>
              <div className="mt-4">
                <CheckList
                  items={[
                    "Create and work with quotes",
                    "Check account and job information",
                    "Create or change pricing",
                    "Handle many everyday account tasks using voice or text",
                    "Control what the Smart Assistant is allowed to access",
                  ]}
                />
              </div>
              <p className="mt-4 text-xs leading-5 text-[#aab4c6]">
                Sell the convenience, not unlimited capability. It is a V1 beta and the customer controls its access.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#303d51] bg-[#101722] p-5">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#d7ff00]">Simpler UX</p>
              <h3 className="mt-3 text-xl font-semibold">Cleaner, less noise</h3>
              <p className="mt-2 text-sm leading-7 text-[#aab4c6]">
                The app has been redesigned to reduce friction and make the common measuring, pricing and quoting workflow easier to follow.
              </p>
            </div>
            <div className="rounded-2xl border border-[#303d51] bg-[#101722] p-5">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#d7ff00]">Custom subscription</p>
              <h3 className="mt-3 text-xl font-semibold">Pay for the account they need</h3>
              <p className="mt-2 text-sm leading-7 text-[#aab4c6]">
                Features, usage credits and storage can be matched to the customer instead of forcing every business into the same fixed package.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="paths" className="qc-anchor border-b border-[#303d51]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#d7ff00]">3. Choose the path</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold">Every qualified conversation should end in one of these three places.</h2>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {pathCards.map((path) => (
              <div
                key={path.number}
                className={`qc-card rounded-2xl border p-6 ${
                  path.number === "01"
                    ? "border-[#d7ff00]/40 bg-[rgba(215,255,0,.06)]"
                    : "border-[#303d51] bg-[#101722]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-[#d7ff00]">{path.number}</span>
                  <span className="text-xs font-semibold uppercase tracking-[.12em] text-[#aab4c6]">
                    {path.eyebrow}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold">{path.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-white">{path.who}</p>
                <p className="mt-3 text-sm leading-7 text-[#aab4c6]">{path.next}</p>
                <ExternalLink
                  href={path.href}
                  className="qc-link mt-6 inline-flex text-sm font-semibold text-[#d7ff00]"
                >
                  {path.cta} →
                </ExternalLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dfy" className="qc-anchor border-b border-[#303d51]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#d7ff00]">4. Primary opportunity</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold">
            Done-For-You turns the setup objection into the sale.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#aab4c6]">
            The customer shows us how they currently price, quote and run their jobs. We configure QuoteCore+ around that workflow, guide them through using their own account on their own jobs, and stay available while they get comfortable with it.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#d7ff00]/35 bg-[rgba(215,255,0,.06)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#d7ff00]">Done-For-You setup</p>
              <p className="mt-3 text-3xl font-bold">Starts from $499 USD</p>
              <p className="mt-3 text-sm leading-7 text-[#aab4c6]">
                The free 20-minute discovery call comes first. Scope and final price are agreed before any setup work begins.
              </p>
              <div className="mt-5">
                <CheckList
                  items={[
                    "QuoteCore+ account configured around the agreed workflow",
                    "At least one 1-hour personalised guided session",
                    "Guidance using their own pricing and a real or previous job",
                    "First 3 months of the agreed QuoteCore+ subscription included",
                    "3 months of ongoing setup and product support",
                  ]}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#303d51] bg-[#101722] p-6">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#aab4c6]">Listen for these buying signals</p>
              <div className="mt-4">
                <CheckList
                  items={[
                    "I do not have time to set all of this up.",
                    "My pricing is scattered across spreadsheets, old quotes or supplier lists.",
                    "Changing systems sounds like too much work.",
                    "We tried software before and never finished setting it up.",
                    "I need someone to help us get from our current process into the new one.",
                  ]}
                />
              </div>
              <p className="mt-5 text-sm font-semibold leading-7 text-white">
                Your job is to identify the fit and move them toward the discovery call. You do not need to promise technical scope or design the setup yourself.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#303d51] bg-[#101722] p-6">
            <h3 className="text-xl font-semibold">Use the live page as part of the pitch.</h3>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[#aab4c6]">
              The customer-facing Done-For-You page explains the offer, process, pricing approach and support. Send it before a call or walk through it with the prospect instead of trying to recreate the full pitch yourself.
            </p>
            <ExternalLink
              href={QC.dfy}
              className="qc-button mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#d7ff00] px-6 text-sm font-semibold text-[#0a0b10]"
            >
              Open the live Done-For-You page →
            </ExternalLink>
          </div>
        </div>
      </section>

      <section id="resources" className="qc-anchor border-b border-[#303d51]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#d7ff00]">5. What should I show them?</p>
          <h2 className="mt-3 text-3xl font-bold">Match one proof point to the objection.</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#aab4c6]">
            Show the one asset that proves the point you are discussing.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {objectionCards.map((item) => (
              <div key={item.title} className="rounded-2xl border border-[#303d51] bg-[#101722] p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#aab4c6]">{item.answer}</p>
                {item.links.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.links.map(([label, href]) => (
                      <ExternalLink
                        key={label}
                        href={href}
                        className="qc-link rounded-full border border-[#303d51] px-3 py-2 text-xs font-semibold text-[#aab4c6]"
                      >
                        {label} →
                      </ExternalLink>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={SALES_RESOURCES_URL}
                    className="qc-link mt-4 inline-flex text-sm font-semibold text-[#d7ff00]"
                  >
                    Open T3 Labs sales playbook →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="credit" className="qc-anchor border-b border-[#303d51]">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#d7ff00]">6. Earnings + attribution</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold">Know what a good customer can be worth to you.</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#aab4c6]">
            Done-For-You creates an immediate one-off commission opportunity. Self-serve subscriptions can create recurring commission for the first 12 months.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#d7ff00]/35 bg-[rgba(215,255,0,.06)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#d7ff00]">Done-For-You commission</p>
              <h3 className="mt-3 text-xl font-semibold">Earn up to 30% of the setup sale.</h3>
              <p className="mt-3 text-sm leading-7 text-[#aab4c6]">
                You can offer the customer up to 5% off without reducing your maximum 30% commission. You do not have to use that discount. If you need a larger discount to close the deal, every extra percentage point comes out of your commission.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["0% to 5% discount", "30% commission"],
                  ["10% discount", "25% commission"],
                  ["15% discount", "20% commission"],
                  ["20% discount", "15% commission"],
                ].map(([discount, commission]) => (
                  <div key={discount} className="rounded-2xl border border-[#303d51] bg-[#101722] p-4">
                    <p className="text-xs font-semibold text-[#aab4c6]">{discount}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{commission}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold leading-7 text-white">
                Example: a $499 setup at 30% is $149.70 commission.
              </p>
            </div>

            <div className="rounded-2xl border border-[#303d51] bg-[#101722] p-6">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#aab4c6]">Self-serve commission</p>
              <h3 className="mt-3 text-xl font-semibold">30% of the monthly subscription for 12 months.</h3>
              <p className="mt-3 text-sm leading-7 text-[#aab4c6]">
                Internal pricing context: current customer subscriptions generally land between about $29 and $259 USD per month, depending on the features, usage credits and storage selected.
              </p>
              <div className="mt-5 space-y-3">
                {[
                  ["$29 / month", "$8.70 / month commission", "$104.40 over 12 months"],
                  ["$150 / month", "$45 / month commission", "$540 over 12 months"],
                  ["$259 / month", "$77.70 / month commission", "$932.40 over 12 months"],
                ].map(([subscription, monthly, annual]) => (
                  <div key={subscription} className="rounded-2xl border border-[#303d51] p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <p className="text-sm font-semibold text-white">{subscription}</p>
                      <p className="text-xs text-[#aab4c6]">{monthly}</p>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-[#d7ff00]">{annual}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-[#aab4c6]">
                These examples show the commission maths for the confirmed 30% rate and 12-month period. Eligibility and payment still follow the current written rep terms.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#303d51] bg-[#101722] p-6">
            <h3 className="text-xl font-semibold">Protect the attribution.</h3>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[#aab4c6]">
              Use the unique referral URL and matching code issued to you by T3 Labs for self-serve customers. Done-For-You sales should follow the current handoff and attribution process supplied to you.
            </p>
            <p className="mt-4 text-sm font-semibold leading-7 text-white">Rep link or code not issued yet?</p>
            <p className="mt-2 text-sm leading-7 text-[#aab4c6]">
              Do not invent one and do not promise tracking that is not active. Contact T3 Labs for the current referral process before sending a paid signup.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-12 sm:py-20">
          <div className="rounded-3xl border border-[#303d51] bg-[#101722] p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#d7ff00]">Keep it simple</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-bold">
              Find the pain. Choose the path. Show one proof point. Ask for the next step.
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-[#aab4c6]">
              You do not need to know every setting. Find the problem, match it to the right route and use the right customer-facing asset to move the conversation forward.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ExternalLink
                href={QC.dfy}
                className="qc-button cursor-pointer inline-flex min-h-12 items-center justify-center rounded-full bg-[#d7ff00] px-6 text-sm font-semibold text-[#0a0b10]"
              >
                Open Done-For-You page
              </ExternalLink>

              <Link
                href={SALES_RESOURCES_URL}
                className="qc-link cursor-pointer inline-flex min-h-12 items-center justify-center rounded-full border border-[#303d51] px-6 text-sm font-semibold text-white"
              >
                T3 Labs sales playbook
              </Link>
            </div>

            <p className="mt-5 text-xs leading-5 text-[#aab4c6]">
              Commercial terms, discounts, referral attribution and commission payments should always follow the current written rep agreement or QuoteCore+ rep terms supplied by T3 Labs.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
