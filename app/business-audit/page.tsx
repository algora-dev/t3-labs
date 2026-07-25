"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";

// ─── Types ───────────────────────────────────────────────────────────────────

type Stage =
  | "landing"
  | "start"
  | "questionnaire"
  | "loading"
  | "result"
  | "paywall"
  | "prePayment";

type BusinessPath = "launchGap" | "earlyGrowth" | "businessLeak" | "";

type Answers = {
  // Universal Q1-Q6
  q1Stage: string;
  q2BusinessType: string;
  q3Customers: string;
  q4WhatYouSell: string;
  q5Revenue: string;
  q6Financial: string;

  // Launch Gap Branch A
  a1Validation: string;
  a2CustomerClarity: string;
  a3BiggestRisk: string;
  a4WantToKnow: string;

  // Early Growth Branch B
  b1MonthlyLeads: string;
  b2Conversion: string;
  b3HardestThing: string;
  b4AlreadyTried: string[];

  // Business Leak Branch C
  c1WhatChanged: string;
  c2WithoutMarketing: string;
  c3BiggestLeak: string;
  c4MostTime: string;

  // Shared Closing S1-S3
  s1Constraint: string;
  s2MarketingSpend: string;
  s3WantToKnow: string;
};

type QuestionId =
  | "q1" | "q2" | "q3" | "q4" | "q5" | "q6"
  | "a1" | "a2" | "a3" | "a4"
  | "b1" | "b2" | "b3" | "b4"
  | "c1" | "c2" | "c3" | "c4"
  | "s1" | "s2" | "s3";

const initialAnswers: Answers = {
  q1Stage: "",
  q2BusinessType: "",
  q3Customers: "",
  q4WhatYouSell: "",
  q5Revenue: "",
  q6Financial: "",
  a1Validation: "",
  a2CustomerClarity: "",
  a3BiggestRisk: "",
  a4WantToKnow: "",
  b1MonthlyLeads: "",
  b2Conversion: "",
  b3HardestThing: "",
  b4AlreadyTried: [],
  c1WhatChanged: "",
  c2WithoutMarketing: "",
  c3BiggestLeak: "",
  c4MostTime: "",
  s1Constraint: "",
  s2MarketingSpend: "",
  s3WantToKnow: "",
};

// ─── Path helpers ─────────────────────────────────────────────────────────────

function getPath(q1Stage: string): BusinessPath {
  if (
    q1Stage === "I have an idea but have not launched yet" ||
    q1Stage === "I am building / preparing to launch"
  ) return "launchGap";
  if (q1Stage === "I have launched but sales are early") return "earlyGrowth";
  if (
    q1Stage === "I am established and want to grow" ||
    q1Stage === "I am established but things are slowing down" ||
    q1Stage === "I am established and profit is dropping"
  ) return "businessLeak";
  return "";
}

function getQuestionFlow(path: BusinessPath): QuestionId[] {
  const universal: QuestionId[] = ["q1", "q2", "q3", "q4", "q5", "q6"];
  const closing: QuestionId[] = ["s1", "s2", "s3"];

  if (path === "launchGap") return [...universal, "a1", "a2", "a3", "a4", ...closing];
  if (path === "earlyGrowth") return [...universal, "b1", "b2", "b3", "b4", ...closing];
  if (path === "businessLeak") return [...universal, "c1", "c2", "c3", "c4", ...closing];
  return [...universal, ...closing];
}

// ─── Shared UI components ─────────────────────────────────────────────────────

function ProgressShell({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
  onBack,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}) {
  const progress = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="app-shell">
      <div className="container narrow">
        {onBack && (
          <button className="back-btn" onClick={onBack}>← Back</button>
        )}
        <div className="progress-wrap">
          <div className="progress-top">
            <span>{progress}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="question-card fade-in">
          <h1 className="question-title">{title}</h1>
          {subtitle && <p className="question-subtitle">{subtitle}</p>}
          <div className="stack">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function OptionButtons({
  options,
  onSelect,
}: {
  options: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="stack">
      {options.map((option) => (
        <button key={option} className="option-button" onClick={() => onSelect(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

function TextInputScreen({
  value,
  onChange,
  onContinue,
  placeholder,
  helperText,
  buttonLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  placeholder: string;
  helperText?: string;
  buttonLabel?: string;
}) {
  return (
    <div className="stack">
      <textarea
        className="text-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {helperText && <p className="helper-notice">{helperText}</p>}
      <button className="primary-button" disabled={!value.trim()} onClick={onContinue}>
        {buttonLabel || "Continue"}
      </button>
    </div>
  );
}

function MultiSelectQuestion({
  options,
  selected,
  onToggle,
  onContinue,
  maxSelections,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onContinue: () => void;
  maxSelections: number;
}) {
  const isValid = selected.length > 0;

  return (
    <div className="stack">
      <div className="helper-row">
        <span>Select up to {maxSelections}</span>
        <span>{selected.length}/{maxSelections} selected</span>
      </div>
      <div className="multi-grid">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={`multi-button ${active ? "active" : ""}`}
              onClick={() => onToggle(option)}
            >
              <span>{option}</span>
              <span className="multi-check">{active ? "✓" : "+"}</span>
            </button>
          );
        })}
      </div>
      <button className="primary-button" disabled={!isValid} onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}

const FREE_TEXT_HELPER = "Do not include personal, sensitive, customer, employee, or confidential information.";

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [stage, setStage] = useState<Stage>("landing");
  const [currentQuestion, setCurrentQuestion] = useState<QuestionId>("q1");
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [startChecked, setStartChecked] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ title: string; text: string; nextMove: string } | null>(null);

  // Currency detection
  const [currency, setCurrency] = useState<{ symbol: string; code: string; amount: string }>({ symbol: "£", code: "gbp", amount: "9" });
  useEffect(() => {
    // Detect locale — if not UK, show USD
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = navigator.language || "";
    const isUK = tz.startsWith("Europe/London") || locale.startsWith("en-GB");
    if (!isUK) setCurrency({ symbol: "$", code: "usd", amount: "11" });
  }, []);

  // Email insight capture state
  const [insightEmail, setInsightEmail] = useState("");
  const [insightEmailConsent, setInsightEmailConsent] = useState(false);
  const [insightEmailStatus, setInsightEmailStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  // Pre-payment form state
  const [payEmail, setPayEmail] = useState("");
  const [payFirstName, setPayFirstName] = useState("");
  const [payCompany, setPayCompany] = useState("");
  const [payWebsite, setPayWebsite] = useState("");
  const [payConsentTc, setPayConsentTc] = useState(false);
  const [payConsentMarketing, setPayConsentMarketing] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const path = useMemo(() => getPath(answers.q1Stage), [answers.q1Stage]);
  const questionFlow = useMemo(() => getQuestionFlow(path), [path]);
  const currentIndex = Math.max(questionFlow.indexOf(currentQuestion), 0);
  const currentStep = currentIndex + 1;
  const totalSteps = questionFlow.length;

  // AI insight generation
  useEffect(() => {
    if (stage !== "loading") return;
    let cancelled = false;

    async function generate() {
      try {
        const res = await fetch("/business-audit/api/generate-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        const data = await res.json();
        if (!cancelled && data.insight) {
          setAiInsight(data.insight);
        }
      } catch {
        // Fall back gracefully
      } finally {
        if (!cancelled) setStage("result");
      }
    }

    const minTimer = new Promise<void>((res) => setTimeout(res, 1500));
    Promise.all([generate(), minTimer]).then(() => {
      if (!cancelled) setStage("result");
    }).catch(() => {
      if (!cancelled) setStage("result");
    });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  function updateAnswer<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function goToNext(q: QuestionId) {
    const idx = questionFlow.indexOf(q);
    if (idx === -1 || idx === questionFlow.length - 1) {
      setStage("loading");
    } else {
      setCurrentQuestion(questionFlow[idx + 1]);
    }
  }

  function goToPrev(q: QuestionId) {
    const idx = questionFlow.indexOf(q);
    if (idx <= 0) {
      setStage("start");
    } else {
      setCurrentQuestion(questionFlow[idx - 1]);
    }
  }

  function selectAndAdvance<K extends keyof Answers>(key: K, value: Answers[K], q: QuestionId) {
    setAnswers((prev) => ({ ...prev, [key]: value }));

    // When Q1 is answered, recalculate flow and move to next
    if (q === "q1") {
      const newPath = getPath(value as string);
      const newFlow = getQuestionFlow(newPath);
      const q1Idx = newFlow.indexOf("q1");
      setCurrentQuestion(newFlow[q1Idx + 1]);
      return;
    }
    goToNext(q);
  }

  function toggleB4(option: string) {
    setAnswers((prev) => {
      const selected = prev.b4AlreadyTried;
      if (selected.includes(option)) {
        return { ...prev, b4AlreadyTried: selected.filter((x) => x !== option) };
      }
      if (option === "Nothing yet") {
        return { ...prev, b4AlreadyTried: ["Nothing yet"] };
      }
      if (selected.length >= 5) return prev;
      return { ...prev, b4AlreadyTried: [...selected.filter((x) => x !== "Nothing yet"), option] };
    });
  }

  async function handleCheckout() {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/business-audit/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payEmail,
          firstName: payFirstName,
          company: payCompany,
          website: payWebsite,
          marketingConsent: payConsentMarketing,
          answers,
          currency: currency.code,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError("Something went wrong. Please try again.");
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutError("Something went wrong. Please try again.");
      setCheckoutLoading(false);
    }
  }

  function renderQuestion() {
    const onBack = () => goToPrev(currentQuestion);

    switch (currentQuestion) {
      // ── Universal ──────────────────────────────────────────────────────────
      case "q1":
        return (
          <ProgressShell title="Where are you in your business journey?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "I have an idea but have not launched yet",
                "I am building / preparing to launch",
                "I have launched but sales are early",
                "I am established and want to grow",
                "I am established but things are slowing down",
                "I am established and profit is dropping",
              ]}
              onSelect={(v) => selectAndAdvance("q1Stage", v, "q1")}
            />
          </ProgressShell>
        );

      case "q2":
        return (
          <ProgressShell title="What type of business do you run?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Local service business",
                "Online service / consultancy",
                "Agency",
                "Product / eCommerce",
                "SaaS / subscription",
                "Other",
              ]}
              onSelect={(v) => selectAndAdvance("q2BusinessType", v, "q2")}
            />
          </ProgressShell>
        );

      case "q3":
        return (
          <ProgressShell title="Who are your customers?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={["Businesses", "Consumers", "Both", "Not sure yet"]}
              onSelect={(v) => selectAndAdvance("q3Customers", v, "q3")}
            />
          </ProgressShell>
        );

      case "q4":
        return (
          <ProgressShell title="What do you sell?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <TextInputScreen
              value={answers.q4WhatYouSell}
              onChange={(v) => updateAnswer("q4WhatYouSell", v)}
              onContinue={() => goToNext("q4")}
              placeholder="Describe what you sell in plain English"
              helperText={FREE_TEXT_HELPER}
            />
          </ProgressShell>
        );

      case "q5":
        return (
          <ProgressShell title="What is your current monthly revenue?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Pre-revenue",
                "Up to £10k",
                "£10k-£50k",
                "£50k-£250k",
                "£250k+",
              ]}
              onSelect={(v) => selectAndAdvance("q5Revenue", v, "q5")}
            />
          </ProgressShell>
        );

      case "q6":
        return (
          <ProgressShell title="Which best describes your current financial situation?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Pre-revenue / not earning yet",
                "Profitable and stable",
                "Profitable but inconsistent",
                "Revenue is okay but cash flow is tight",
                "Break-even",
                "Losing money / investing to grow",
                "Not sure",
              ]}
              onSelect={(v) => selectAndAdvance("q6Financial", v, "q6")}
            />
          </ProgressShell>
        );

      // ── Launch Gap Branch A ────────────────────────────────────────────────
      case "a1":
        return (
          <ProgressShell title="Have you validated the idea yet?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Yes, people have paid or pre-ordered",
                "Yes, people have shown real interest",
                "A little, but nothing serious yet",
                "No, not yet",
              ]}
              onSelect={(v) => selectAndAdvance("a1Validation", v, "a1")}
            />
          </ProgressShell>
        );

      case "a2":
        return (
          <ProgressShell title="How clear are you on who your ideal customer is?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Very clear",
                "Somewhat clear",
                "Broad / too many possible customers",
                "Not sure yet",
              ]}
              onSelect={(v) => selectAndAdvance("a2CustomerClarity", v, "a2")}
            />
          </ProgressShell>
        );

      case "a3":
        return (
          <ProgressShell title="What feels like the biggest risk before you launch?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Getting first customers",
                "Pricing it correctly",
                "Building the product/service",
                "Explaining the offer clearly",
                "Knowing where to start",
              ]}
              onSelect={(v) => selectAndAdvance("a3BiggestRisk", v, "a3")}
            />
          </ProgressShell>
        );

      case "a4":
        return (
          <ProgressShell title="What would you most want to know before you launch?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <TextInputScreen
              value={answers.a4WantToKnow}
              onChange={(v) => updateAnswer("a4WantToKnow", v)}
              onContinue={() => goToNext("a4")}
              placeholder="What is the one thing you most want clarity on?"
              helperText={FREE_TEXT_HELPER}
            />
          </ProgressShell>
        );

      // ── Early Growth Branch B ──────────────────────────────────────────────
      case "b1":
        return (
          <ProgressShell title="How many leads or enquiries do you get each month?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={["0-5", "6-20", "21-50", "50+", "Not sure"]}
              onSelect={(v) => selectAndAdvance("b1MonthlyLeads", v, "b1")}
            />
          </ProgressShell>
        );

      case "b2":
        return (
          <ProgressShell title="How many of those leads become customers?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Almost none",
                "Under 10%",
                "10-30%",
                "30%+",
                "No idea",
              ]}
              onSelect={(v) => selectAndAdvance("b2Conversion", v, "b2")}
            />
          </ProgressShell>
        );

      case "b3":
        return (
          <ProgressShell title="What is the hardest thing right now?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Getting noticed",
                "Getting people to trust us",
                "Turning interest into sales",
                "Getting repeat customers",
                "Knowing what to focus on",
              ]}
              onSelect={(v) => selectAndAdvance("b3HardestThing", v, "b3")}
            />
          </ProgressShell>
        );

      case "b4":
        return (
          <ProgressShell title="What have you already tried?" subtitle="Select up to 5." currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <MultiSelectQuestion
              options={[
                "Paid ads",
                "Organic content",
                "Cold outreach",
                "Referrals",
                "Partnerships",
                "Website changes",
                "Pricing changes",
                "Follow-up",
                "Nothing yet",
                "Other",
              ]}
              selected={answers.b4AlreadyTried}
              onToggle={toggleB4}
              onContinue={() => goToNext("b4")}
              maxSelections={5}
            />
          </ProgressShell>
        );

      // ── Business Leak Branch C ─────────────────────────────────────────────
      case "c1":
        return (
          <ProgressShell title="What has changed recently?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Fewer leads",
                "Lower conversion",
                "Customers spending less",
                "Costs have gone up",
                "Team/admin is taking more time",
                "Not sure",
              ]}
              onSelect={(v) => selectAndAdvance("c1WhatChanged", v, "c1")}
            />
          </ProgressShell>
        );

      case "c2":
        return (
          <ProgressShell title="If you stopped all marketing today, how long would customers keep coming in?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "They wouldn't",
                "A few days",
                "A few weeks",
                "1-3 months",
                "Consistently",
              ]}
              onSelect={(v) => selectAndAdvance("c2WithoutMarketing", v, "c2")}
            />
          </ProgressShell>
        );

      case "c3":
        return (
          <ProgressShell title="What is the biggest leak in your business right now?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "We lose leads before they buy",
                "We are too reliant on referrals",
                "We are busy but profit is weak",
                "Customers do not come back enough",
                "The business depends too much on me",
                "Everything feels messy/manual",
              ]}
              onSelect={(v) => selectAndAdvance("c3BiggestLeak", v, "c3")}
            />
          </ProgressShell>
        );

      case "c4":
        return (
          <ProgressShell title="What takes up most of your time right now?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Admin",
                "Fulfilment / delivery",
                "Support",
                "Sales",
                "Team management",
                "Everything",
              ]}
              onSelect={(v) => selectAndAdvance("c4MostTime", v, "c4")}
            />
          </ProgressShell>
        );

      // ── Shared Closing ─────────────────────────────────────────────────────
      case "s1":
        return (
          <ProgressShell title="What is your biggest personal constraint right now?" currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <OptionButtons
              options={[
                "Not enough time",
                "Not enough cash to invest",
                "Not sure what to focus on",
                "I need more team/support",
                "Everything feels manual",
              ]}
              onSelect={(v) => selectAndAdvance("s1Constraint", v, "s1")}
            />
          </ProgressShell>
        );

      case "s2": {
        const isEstablished = path === "businessLeak" || path === "earlyGrowth";
        return (
          <ProgressShell
            title={isEstablished
              ? "How much do you currently spend each month trying to get customers?"
              : "How much are you willing or able to invest each month to get customers?"}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={onBack}
          >
            <OptionButtons
              options={[
                "£0",
                "Under £250/month",
                "£250-£1,000/month",
                "£1,000+/month",
                "It varies",
              ]}
              onSelect={(v) => selectAndAdvance("s2MarketingSpend", v, "s2")}
            />
          </ProgressShell>
        );
      }

      case "s3":
        return (
          <ProgressShell title="What would you most want to know from this audit?" subtitle="Keep this short." currentStep={currentStep} totalSteps={totalSteps} onBack={onBack}>
            <TextInputScreen
              value={answers.s3WantToKnow}
              onChange={(v) => updateAnswer("s3WantToKnow", v)}
              onContinue={() => goToNext("s3")}
              placeholder="What is the one thing you most want this audit to tell you?"
              helperText={FREE_TEXT_HELPER}
            />
          </ProgressShell>
        );

      default:
        return null;
    }
  }

  // ── Landing ────────────────────────────────────────────────────────────────
  if (stage === "landing") {
    return (
      <>
        <div className="app-shell">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">Business Audit</div>
              <h1 className="hero-title">
                Find out what is
                <br />
                actually holding
                <br />
                your business back
              </h1>
              <p className="hero-copy">
                Answer a few quick questions and get a clear, specific insight based on how your business actually works. Free in about 3 minutes.
              </p>
              <div className="button-row">
                <button className="primary-button" onClick={() => setStage("start")}>
                  Start free audit
                </button>
              </div>
              <div className="meta-row">
                <div className="meta-pill">No signup required</div>
                <div className="meta-pill">Takes about 3 minutes</div>
                <div className="meta-pill">Built for real businesses</div>
              </div>
            </div>

            <div className="panel big-panel fade-in">
              <div className="small-label">What you get</div>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-dot" />
                  <p>A clearer view of what is actually slowing your business down</p>
                </div>
                <div className="feature-item">
                  <div className="feature-dot" />
                  <p>A free insight you can act on immediately</p>
                </div>
                <div className="feature-item">
                  <div className="feature-dot" />
                  <p>The option to unlock your full audit report for {currency.symbol}{currency.amount} - including a free 15-minute review call</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <CookieBanner />
        <Styles />
      </>
    );
  }

  // ── Start page ─────────────────────────────────────────────────────────────
  if (stage === "start") {
    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="intro-card fade-in">
              <div className="small-label">Before you start</div>
              <h1>A few things to know</h1>
              <p>
                This audit is designed to work without personal or sensitive information.
              </p>
              <p>
                Please do not include names, addresses, customer details, employee details, private financial information, passwords, legal issues, health information, or confidential business data in your answers.
              </p>
              <p>
                Your answers will be used to generate your audit result. By continuing, you agree to our <Link href="/business-audit/terms" target="_blank" className="inline-link">Terms and Conditions</Link> and acknowledge our <Link href="/business-audit/privacy" target="_blank" className="inline-link">Privacy Policy</Link>.
              </p>

              <div className="checkbox-wrap" style={{ marginTop: 24 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={startChecked}
                    onChange={(e) => setStartChecked(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span>
                    I agree to the <Link href="/business-audit/terms" target="_blank" className="inline-link">Terms and Conditions</Link> and acknowledge the <Link href="/business-audit/privacy" target="_blank" className="inline-link">Privacy Policy</Link>.
                  </span>
                </label>
              </div>

              <div className="button-row" style={{ marginTop: 24 }}>
                <button
                  className="primary-button"
                  disabled={!startChecked}
                  onClick={() => {
                    setCurrentQuestion("q1");
                    setStage("questionnaire");
                  }}
                >
                  Continue
                </button>
                <button className="secondary-button" onClick={() => setStage("landing")}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Styles />
      </>
    );
  }

  // ── Questionnaire ─────────────────────────────────────────────────────────
  if (stage === "questionnaire") {
    return (
      <>
        {renderQuestion()}
        <Styles />
      </>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (stage === "loading") {
    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="loading-card fade-in" style={{ textAlign: "center" }}>
              <div className="spinner" />
              <h1>Analysing your business</h1>
              <p>Finding the clearest opportunity based on the answers you gave.</p>
            </div>
          </div>
        </div>
        <Footer />
        <Styles />
      </>
    );
  }

  // ── Result ─────────────────────────────────────────────────────────────────
  if (stage === "result") {
    return (
      <>
        <div className="app-shell">
          <div className="results-wrap fade-in">
            <div className="results-grid">
              <div className="insight-card">
                <div className="insight-label">Your free insight</div>
                <h1 className="results-title">Here is what may be holding your business back</h1>
                {aiInsight ? (
                  <>
                    <div className="insight-panel">
                      <h2>{aiInsight.title}</h2>
                      <p>{aiInsight.text}</p>
                    </div>
                    {aiInsight.nextMove && (
                      <div className="next-move-panel">
                        <div className="next-move-label">Your next move this week</div>
                        <p>{aiInsight.nextMove}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="insight-panel">
                    <p>Your insight has been generated. Unlock the full report below to get your complete diagnosis and action plan.</p>
                  </div>
                )}
              </div>

              <div>
                <div className="locked-card">
                  <div className="locked-title">Your full audit is waiting</div>
                  <div className="locked-item">
                    <span>Your likely business bottleneck</span>
                  </div>
                  <div className="locked-item">
                    <span>Your biggest missed opportunity</span>
                  </div>
                  <div className="locked-item">
                    <span>A simple action plan for what to fix first</span>
                  </div>
                  <div className="locked-item">
                    <span>What may be wasting your time, money, or energy</span>
                  </div>
                  <div className="locked-item">
                    <span>Access to a free 15-minute Audit Review Call</span>
                  </div>
                </div>

                <div className="upsell-card">
                  <div className="upsell-small">Unlock the full audit</div>
                  <h3>Unlock your full business audit - {currency.symbol}{currency.amount}</h3>
                  <p>Your full audit also includes access to a free 15-minute Audit Review Call with the Business Audit team. After payment, your report is generated instantly.</p>
                  <button className="primary-button" style={{ width: "100%", marginTop: 18, background: "#ffffff", color: "#111111" }} onClick={() => setStage("paywall")}>
                    Unlock full audit - {currency.symbol}{currency.amount}
                  </button>
                </div>

                {/* Email insight card — right column, below upsell */}
                {aiInsight && (
                  <div className="email-insight-card">
                    {insightEmailStatus === "sent" ? (
                      <div className="email-insight-sent">
                        <div className="email-insight-sent-icon">✓</div>
                        <div>
                          <div className="email-insight-sent-title">On its way</div>
                          <p className="email-insight-sent-body">Check your inbox - your free insight is on its way from insights@t3labs.co.uk.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="email-insight-label">📩 Email me my free insight</div>
                        <p className="email-insight-body">Get a copy sent to your inbox so you can come back to it.</p>
                        <div className="email-insight-fields">
                          <input
                            className="input-field"
                            type="email"
                            value={insightEmail}
                            onChange={(e) => setInsightEmail(e.target.value)}
                            placeholder="your@email.com"
                            disabled={insightEmailStatus === "loading"}
                          />
                          <label className="checkbox-label" style={{ fontSize: 13, color: "#66665e" }}>
                            <input
                              type="checkbox"
                              className="checkbox-input"
                              checked={insightEmailConsent}
                              onChange={(e) => setInsightEmailConsent(e.target.checked)}
                              disabled={insightEmailStatus === "loading"}
                            />
                            <span>
                              I agree to T3 Labs&rsquo; <a href="/business-audit/terms" target="_blank" className="inline-link">Terms and Conditions</a> and consent to being contacted about relevant products and services.
                            </span>
                          </label>
                          {insightEmailStatus === "error" && (
                            <p style={{ color: "#c0392b", fontSize: 13, margin: 0 }}>Something went wrong. Please try again.</p>
                          )}
                          <button
                            className="primary-button"
                            style={{ width: "100%" }}
                            disabled={!insightEmail.trim() || !insightEmailConsent || insightEmailStatus === "loading"}
                            onClick={async () => {
                              setInsightEmailStatus("loading");
                              try {
                                const res = await fetch("/business-audit/api/email-insight", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    email: insightEmail,
                                    insight: aiInsight,
                                    marketingConsent: true,
                                  }),
                                });
                                if (res.ok) {
                                  setInsightEmailStatus("sent");
                                } else {
                                  setInsightEmailStatus("error");
                                }
                              } catch {
                                setInsightEmailStatus("error");
                              }
                            }}
                          >
                            {insightEmailStatus === "loading" ? "Sending..." : "Send my insight"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Styles />
      </>
    );
  }

  // ── Paywall ────────────────────────────────────────────────────────────────
  if (stage === "paywall") {
    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="pay-card fade-in">
              <button className="back-btn" style={{ marginBottom: 16 }} onClick={() => setStage("result")}>
                ← Back to insight
              </button>
              <h1>Unlock your full business audit - {currency.symbol}{currency.amount}</h1>
              <p>Your free result shows the first sign of what may be holding your business back.</p>
              <p>Unlock the full audit to get:</p>
              <ul className="paywall-list">
                <li>Your likely business bottleneck</li>
                <li>Your biggest missed opportunity</li>
                <li>A simple action plan for what to fix first</li>
                <li>What may be wasting your time, money, or energy</li>
              </ul>
              <p>Your full audit also includes access to a free 15-minute Audit Review Call with the Business Audit team.</p>
              <p style={{ color: "#66665e", fontSize: 14 }}>After payment, your report will be generated instantly and you will receive a Calendly link if you would like to book your free review call.</p>

              <div className="button-row" style={{ marginTop: 20 }}>
                <button
                  className="primary-button"
                  onClick={() => setStage("prePayment")}
                >
                  Unlock full audit - {currency.symbol}{currency.amount}
                </button>
                <button className="secondary-button" onClick={() => setStage("result")}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Styles />
      </>
    );
  }

  // ── Pre-payment ────────────────────────────────────────────────────────────
  if (stage === "prePayment") {
    const canProceed =
      payEmail.trim() &&
      payFirstName.trim() &&
      payConsentTc;

    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="pay-card fade-in">
              <button className="back-btn" style={{ marginBottom: 16 }} onClick={() => setStage("paywall")}>
                ← Back
              </button>
              <h1>Your details</h1>
              <p className="helper-notice" style={{ marginBottom: 20 }}>
                We use this to send or associate your paid audit report and, if you choose to book the free review call, to help us understand your business before the call.
              </p>

              <div className="field-group">
                <label className="field-label">First name <span className="required">*</span></label>
                <input
                  className="input-field"
                  type="text"
                  value={payFirstName}
                  onChange={(e) => setPayFirstName(e.target.value)}
                  placeholder="Your first name"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Email address <span className="required">*</span></label>
                <input
                  className="input-field"
                  type="email"
                  value={payEmail}
                  onChange={(e) => setPayEmail(e.target.value)}
                  placeholder="name@business.com"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Company name <span className="optional">(optional)</span></label>
                <input
                  className="input-field"
                  type="text"
                  value={payCompany}
                  onChange={(e) => setPayCompany(e.target.value)}
                  placeholder="Your company name"
                />
              </div>

              <div className="field-group">
                <label className="field-label">Website <span className="optional">(optional)</span></label>
                <input
                  className="input-field"
                  type="url"
                  value={payWebsite}
                  onChange={(e) => setPayWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="checkbox-wrap" style={{ marginTop: 24 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={payConsentTc}
                    onChange={(e) => setPayConsentTc(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span>
                    I agree to the <Link href="/business-audit/terms" target="_blank" className="inline-link">Terms and Conditions</Link> and acknowledge the <Link href="/business-audit/privacy" target="_blank" className="inline-link">Privacy Policy</Link>. <span className="required">*</span>
                  </span>
                </label>
              </div>

              <div className="checkbox-wrap">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={payConsentMarketing}
                    onChange={(e) => setPayConsentMarketing(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span>
                    I agree to receive occasional emails about business improvement tips, offers, and updates. (Optional)
                  </span>
                </label>
              </div>

              {checkoutError && (
                <p style={{ color: "#c0392b", marginTop: 12, fontSize: 14 }}>{checkoutError}</p>
              )}

              <div className="button-row" style={{ marginTop: 20 }}>
                <button
                  className="primary-button"
                  disabled={!canProceed || checkoutLoading}
                  onClick={handleCheckout}
                >
                  {checkoutLoading ? "Redirecting to payment..." : `Pay ${currency.symbol}${currency.amount} and unlock`}
                </button>
              </div>
              <p style={{ fontSize: 13, color: "#888", marginTop: 12 }}>
                Fields marked <span className="required">*</span> are required.
              </p>
            </div>
          </div>
        </div>
        <Footer />
        <Styles />
      </>
    );
  }

  return null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function Styles() {
  return (
    <style jsx global>{`
      * { box-sizing: border-box; }

      html, body {
        margin: 0; padding: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #fbfcff; color: #0a0b10;
      }

      body { min-height: 100vh; }

      .app-shell { min-height: 100vh; background: radial-gradient(circle at 76% 6%, rgba(17, 19, 24, 0.05), transparent 24rem), radial-gradient(circle at 14% 36%, rgba(180, 185, 194, 0.08), transparent 20rem), #fbfcff; }

      .container {
        width: 100%; max-width: 1160px; margin: 0 auto; padding: 32px 20px;
      }
      .container.narrow { max-width: 820px; }

      .hero-grid {
        display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 72px;
        align-items: center; min-height: 100vh;
      }

      .eyebrow {
        display: inline-flex; align-items: center; border: 1px solid #e7e9ef;
        background: rgba(255,255,255,0.72); color: #515763; border-radius: 999px;
        padding: 6px 12px; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 18px;
      }

      .hero-title {
        font-size: clamp(3.1rem, 5vw, 4rem); line-height: 0.92; letter-spacing: -0.045em; margin: 0; max-width: 620px; font-weight: 600;
      }

      .hero-copy {
        font-size: 1.08rem; line-height: 1.75; color: #3e4352; max-width: 600px; margin-top: 26px;
      }

      .button-row { display: flex; gap: 12px; margin-top: 30px; flex-wrap: wrap; }

      .primary-button, .secondary-button {
        height: 52px; border-radius: 8px; font-size: 15px; padding: 0 22px;
        cursor: pointer; transition: 0.2s ease; font-weight: 500;
      }

      .primary-button {
        border: 0; background: linear-gradient(135deg, #050608, #242832); color: #ffffff;
        box-shadow: 0 14px 30px rgba(10, 11, 16, 0.16);
      }
      .primary-button:hover { transform: translateY(-2px); }
      .primary-button:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

      .secondary-button {
        border: 1px solid #e7e9ef; background: #ffffff; color: #0a0b10; opacity: 0.85;
      }
      .secondary-button:hover { border-color: #e3e8bc; background: #fbfff0; }

      .meta-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 22px; }
      .meta-pill {
        border: 1px solid #e7e9ef; background: rgba(255,255,255,0.72); color: #4f5567;
        border-radius: 999px; padding: 9px 12px; font-size: 0.75rem; font-weight: 500; line-height: 1;
      }

      .panel { background: #ffffff; border: 1px solid #e7e9ef; border-radius: 18px; box-shadow: 0 10px 32px rgba(24, 31, 51, 0.05); }
      .big-panel { padding: 32px; }

      .small-label { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #515763; margin-bottom: 16px; }

      .feature-list { display: grid; gap: 14px; }
      .feature-item { display: flex; gap: 14px; align-items: flex-start; }
      .feature-dot {
        width: 8px; height: 8px; border-radius: 50%; background: #d7ff00;
        margin-top: 8px; flex-shrink: 0;
      }
      .feature-item p { margin: 0; font-size: 15px; line-height: 1.75; color: #0a0b10; }

      .center-wrap {
        max-width: 820px; margin: 0 auto; min-height: 100vh;
        display: flex; align-items: center; padding: 32px 20px;
      }

      .intro-card, .loading-card, .pay-card {
        width: 100%; background: #ffffff; border: 1px solid #e7e9ef;
        border-radius: 18px; padding: 36px; box-shadow: 0 10px 32px rgba(24, 31, 51, 0.05);
      }

      .intro-card h1, .loading-card h1, .pay-card h1 {
        font-size: 46px; line-height: 1.06; letter-spacing: -0.04em; margin: 0;
      }

      .intro-card p, .loading-card p, .pay-card p {
        margin: 18px 0 0; font-size: 1.08rem; line-height: 1.9; color: #3e4352;
      }

      .spinner {
        width: 48px; height: 48px; border-radius: 999px;
        border: 4px solid #e7e9ef; border-top-color: #d7ff00;
        animation: spin 0.9s linear infinite; margin: 0 auto 22px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      .fade-in { animation: fadeIn 0.24s ease; }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .progress-wrap { margin-bottom: 24px; }
      .progress-top {
        display: flex; justify-content: space-between;
        font-size: 13px; color: #606575; margin-bottom: 8px;
      }
      .progress-bar { height: 4px; background: #e7e9ef; border-radius: 99px; overflow: hidden; }
      .progress-fill { height: 100%; background: #d7ff00; border-radius: 99px; transition: width 0.3s ease; }

      .question-card {
        background: #ffffff; border: 1px solid #e7e9ef;
        border-radius: 18px; padding: 36px; box-shadow: 0 10px 32px rgba(24, 31, 51, 0.05);
      }

      .question-title {
        font-size: 40px; line-height: 1.1; letter-spacing: -0.04em; margin: 0;
      }
      .question-subtitle {
        margin: 12px 0 0; font-size: 16px; line-height: 1.8; color: #3e4352;
      }

      .stack { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }

      .option-button {
        width: 100%; text-align: left; padding: 14px 18px;
        border: 1px solid #e7e9ef; border-radius: 8px;
        background: #ffffff; font-size: 15px; line-height: 1.5;
        cursor: pointer; transition: 0.15s ease; color: #0a0b10;
      }
      .option-button:hover { background: #fbfff0; border-color: #e3e8bc; }
      .option-button:focus-visible { outline: 2px solid #d7ff00; outline-offset: 3px; }

      .text-area {
        width: 100%; min-height: 120px; border: 1px solid #e7e9ef;
        border-radius: 8px; padding: 14px 16px; font-size: 15px;
        line-height: 1.7; resize: vertical; outline: none;
        font-family: inherit; background: #ffffff;
      }
      .text-area:focus { border-color: #0a0b10; }
      .text-area:focus-visible { outline: 2px solid #d7ff00; outline-offset: 3px; }

      .helper-row { display: flex; justify-content: space-between; font-size: 13px; color: #606575; }

      .multi-grid { display: flex; flex-direction: column; gap: 10px; }
      .multi-button {
        display: flex; justify-content: space-between; align-items: center;
        width: 100%; padding: 14px 18px; border: 1px solid #e7e9ef;
        border-radius: 8px; background: #ffffff; font-size: 15px;
        cursor: pointer; transition: 0.15s ease; color: #0a0b10;
      }
      .multi-button.active { background: linear-gradient(135deg, #050608, #242832); color: #ffffff; border-color: #0a0b10; }
      .multi-button:hover:not(.active) { background: #fbfff0; border-color: #e3e8bc; }
      .multi-button:focus-visible { outline: 2px solid #d7ff00; outline-offset: 3px; }
      .multi-check { font-size: 16px; font-weight: 600; }

      .back-btn {
        background: none; border: none; color: #606575; font-size: 14px;
        cursor: pointer; padding: 0; display: block; margin-bottom: 16px;
      }
      .back-btn:hover { color: #0a0b10; }

      .results-wrap { max-width: 1160px; margin: 0 auto; padding: 36px 20px; }
      .results-grid {
        display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 28px; align-items: start;
      }

      .insight-card {
        background: #ffffff; border: 1px solid #e7e9ef;
        border-radius: 18px; padding: 36px; box-shadow: 0 10px 32px rgba(24, 31, 51, 0.05);
      }

      .insight-label { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #515763; margin-bottom: 18px; }
      .results-title {
        font-size: 46px; line-height: 1.08; letter-spacing: -0.04em; margin: 0 0 24px;
      }

      .insight-panel {
        background: #f6f8fc; border: 1px solid #e7e9ef; border-radius: 18px;
        padding: 24px; margin-bottom: 16px;
      }
      .insight-panel h2 { margin: 0 0 12px; font-size: 22px; line-height: 1.3; letter-spacing: -0.02em; }
      .insight-panel p { margin: 0; font-size: 16px; line-height: 1.9; color: #0a0b10; }

      .next-move-panel {
        background: #0a0b10; border-radius: 18px; padding: 24px; color: #ffffff;
      }
      .next-move-label { font-size: 13px; color: #d7ff00; margin-bottom: 10px; font-weight: 600; }
      .next-move-panel p { margin: 0; font-size: 15px; line-height: 1.8; color: #e8e8e0; }

      .email-insight-card {
        background: #fbfff0; border: 1px solid #e3e8bc;
        border-radius: 18px; padding: 24px; margin-top: 16px;
      }
      .email-insight-label {
        font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #0a0b10;
      }
      .email-insight-body {
        font-size: 14px; color: #3e4352; line-height: 1.7; margin: 0 0 16px;
      }
      .email-insight-fields { display: flex; flex-direction: column; gap: 12px; }
      .email-insight-sent {
        display: flex; gap: 14px; align-items: flex-start;
      }
      .email-insight-sent-icon {
        width: 36px; height: 36px; border-radius: 50%;
        background: linear-gradient(135deg, #050608, #242832); color: #fff;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px; font-weight: 700; flex-shrink: 0;
      }
      .email-insight-sent-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
      .email-insight-sent-body { font-size: 14px; color: #3e4352; line-height: 1.6; margin: 0; }

      .locked-card {
        background: #f6f8fc; border: 1px solid #e7e9ef;
        border-radius: 18px; padding: 24px; margin-bottom: 16px;
      }
      .locked-title { font-size: 16px; font-weight: 600; margin-bottom: 14px; }
      .locked-item {
        border: 1px solid #e7e9ef; background: #ffffff;
        border-radius: 8px; padding: 14px; margin-bottom: 8px;
      }
      .locked-item span {
        display: block; font-size: 15px; line-height: 1.7; color: #606575;
        filter: blur(3px); user-select: none;
      }

      .upsell-card {
        padding: 24px; background: #0a0b10; color: #ffffff;
        border-radius: 18px;
      }
      .upsell-small { color: #d7ff00; font-size: 14px; font-weight: 600; }
      .upsell-card h3 {
        font-size: 24px; line-height: 1.2; letter-spacing: -0.02em; margin: 12px 0 0;
      }
      .upsell-card p { margin: 14px 0 0; color: #c9c9c1; font-size: 15px; line-height: 1.8; }

      .paywall-list { margin: 12px 0; padding-left: 20px; }
      .paywall-list li { font-size: 16px; line-height: 1.8; color: #0a0b10; margin-bottom: 4px; }

      .field-group { margin-bottom: 16px; }
      .field-label { display: block; font-size: 14px; color: #0a0b10; margin-bottom: 6px; font-weight: 500; }
      .required { color: #c0392b; }
      .optional { color: #606575; font-weight: 400; }

      .input-field {
        width: 100%; height: 50px; border: 1px solid #e7e9ef;
        border-radius: 8px; padding: 0 16px; font-size: 15px;
        outline: none; font-family: inherit; background: #ffffff;
      }
      .input-field:focus { border-color: #0a0b10; }
      .input-field:focus-visible { outline: 2px solid #d7ff00; outline-offset: 3px; }

      .checkbox-wrap { margin-bottom: 14px; }
      .checkbox-label {
        display: flex; gap: 10px; align-items: flex-start;
        font-size: 14px; line-height: 1.7; color: #0a0b10; cursor: pointer;
      }
      .checkbox-input {
        margin-top: 3px; flex-shrink: 0; width: 16px; height: 16px;
        accent-color: #0a0b10;
      }

      .inline-link { color: #0a0b10; text-decoration: underline; }
      .inline-link:hover { color: #606575; }

      .helper-notice {
        font-size: 12px; color: #606575; line-height: 1.5;
        margin-top: 8px;
      }

      @media (max-width: 980px) {
        .hero-grid, .results-grid { grid-template-columns: 1fr; }
        .hero-title, .results-title, .intro-card h1, .loading-card h1, .pay-card h1 { font-size: 40px; }
        .question-title { font-size: 34px; }
      }

      @media (max-width: 640px) {
        .container, .results-wrap, .center-wrap { padding-left: 16px; padding-right: 16px; }
        .hero-title, .results-title, .intro-card h1, .loading-card h1, .pay-card h1 { font-size: 34px; }
        .question-card, .insight-card, .locked-card, .upsell-card, .intro-card, .loading-card, .pay-card { padding: 22px; border-radius: 14px; }
        .question-title { font-size: 30px; }
        .question-subtitle, .intro-card p, .loading-card p, .pay-card p { font-size: 16px; line-height: 1.75; }
      }
    `}</style>
  );
}
