"use client";

import { useState } from "react";

type Theme = "dark" | "light";
type Tokens = {
  bg: string; surface: string; surfaceAlt: string; border: string;
  text: string; muted: string; accent: string; accentText: string;
  accentInk: string; accentSoft: string;
};

const dark: Tokens = {
  bg:"#0a0b10", surface:"#101219", surfaceAlt:"#161927", border:"#262a3a",
  text:"#e8eaf2", muted:"#9aa1b5", accent:"#d7ff00", accentText:"#0a0b10",
  accentInk:"#d7ff00", accentSoft:"rgba(215,255,0,.08)"
};
const light: Tokens = {
  bg:"#fbfcff", surface:"#fff", surfaceAlt:"#f3f5fa", border:"#e7e9ef",
  text:"#0a0b10", muted:"#5a6172", accent:"#d7ff00", accentText:"#0a0b10",
  accentInk:"#809000", accentSoft:"rgba(215,255,0,.18)"
};

const BOOKING_URL = "https://calendly.com/cece-t3labs/20min";

// Add the 90-second page explainer when it is ready.
// The video block stays hidden until a URL is provided.
const EXPLAINER_VIDEO_URL = "";

// Add the dedicated Apex Roofing sales assistant demo URL when it is live.
// Until then, the fourth demo card remains visible but is not clickable.
const APEX_ASSISTANT_DEMO_URL = "";

const BASE_DEMOS = [
  {
    name: "Roofing Supplier Tool",
    label: "Roofing",
    problem: "Let customers measure a roof, calculate quantities, apply your products and get useful pricing before your team touches the enquiry.",
    href: "/supplier-pricing-tool/apex-roofing",
  },
  {
    name: "Flooring Supplier Tool",
    label: "Flooring",
    problem: "Let customers size a room, calculate material requirements, apply pricing and send a much more complete job through.",
    href: "/supplier-pricing-tool/oakline-flooring",
  },
  {
    name: "Cladding Supplier Tool",
    label: "Cladding",
    problem: "Let customers work out sheet quantities and indicative pricing themselves instead of waiting for a basic quote response.",
    href: "/supplier-pricing-tool/vertex-cladding",
  },
];

const DEMOS = APEX_ASSISTANT_DEMO_URL
  ? [
      ...BASE_DEMOS,
      {
        name: "Apex Roofing Sales Assistant",
        label: "Online Sales Assistant",
        problem: "Ask product questions, work through pricing and guide the customer toward a complete enquiry or next sales step.",
        href: APEX_ASSISTANT_DEMO_URL,
      },
    ]
  : BASE_DEMOS;

function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, params);
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ExpandCard({
  t, id, headline, stat, source, children,
}: {
  t: Tokens; id: string; headline: string; stat: React.ReactNode;
  source: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:t.surface, borderColor:t.border }} className="rounded-2xl border">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen(!open);
          if (!open) trackEvent("solution_proof_expand", { card:id });
        }}
        className="card-toggle flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
      >
        <div>
          <p className="font-semibold">{headline}</p>
          <p className="proof-stat mt-2 text-sm leading-6" style={{ color:t.muted }}>{stat}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide" style={{ color:t.accentInk }}>
            Source: {source}
          </p>
        </div>
        <span aria-hidden="true" style={{ color:t.accentInk }} className={`mt-1 text-lg transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      <div hidden={!open} className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="border-t pt-4 text-sm leading-7" style={{ borderColor:t.border, color:t.muted }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const ASSESSMENT = [
  { id:"pricing", q:"Can customers get useful pricing or a realistic estimate without contacting your team?" },
  { id:"quantities", q:"Can customers work out the products and quantities they need without staff doing it for them?" },
  { id:"answers", q:"Can customers get useful product answers outside your normal business hours?" },
  { id:"quote", q:"Can customers send you most of the information needed for a quote before your team gets involved?" },
  { id:"information", q:"Is your most useful product, pricing and technical information easy to find online?" },
] as const;

type Answer = 0 | 1 | 2;

function Assessment({ t, onSend }: { t:Tokens; onSend:()=>void }) {
  const [answers, setAnswers] = useState<(Answer|null)[]>(Array(ASSESSMENT.length).fill(null));
  const [step, setStep] = useState(0);
  const complete = answers.every(a => a !== null);
  const score = answers.reduce<number>((s,a)=>s+(a??0),0);

  const answer = (value:Answer) => {
    const next = [...answers]; next[step] = value; setAnswers(next);
    trackEvent("construction_assessment_answer", {
      question:ASSESSMENT[step].id,
      answer:value===2?"yes":value===1?"partly":"no",
    });
    if (step < ASSESSMENT.length-1) setTimeout(()=>setStep(step+1),120);
    else trackEvent("construction_assessment_complete", { score:String(next.reduce<number>((s,a)=>s+(a??0),0)) });
  };

  if (complete) {
    const result =
      score <= 3
        ? { title:"There are some clear opportunities.", body:"The fastest wins are usually around giving customers better answers earlier, collecting better job information and reducing unnecessary staff involvement." }
        : score <= 7
        ? { title:"You already have a useful foundation.", body:"The opportunity is to remove the remaining friction, connect the stronger parts and turn more of the website into something customers can actually use." }
        : { title:"You already have a strong base.", body:"That gives us more to build on. The next step is usually optimisation: make the journey faster, connect the systems, capture better data and compound what already works." };

    return (
      <div style={{ background:t.surface, borderColor:t.border }} className="rounded-2xl border p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color:t.accentInk }}>Your result</p>
        <h3 className="mt-3 text-2xl font-bold sm:text-3xl">{result.title}</h3>
        <p className="mt-4 max-w-2xl leading-7" style={{ color:t.muted }}>{result.body}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
             style={{ background:t.accent, color:t.accentText }}
             className="btn-solid inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">
            Book a free short call
          </a>
          <button type="button" onClick={onSend} style={{ borderColor:t.border }}
                  className="btn-outline min-h-12 rounded-full border px-7 text-sm font-semibold">
            Send us how you work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:t.surface, borderColor:t.border }} className="rounded-2xl border p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color:t.accentInk }}>60-second check</p>
        <p className="text-sm font-semibold" style={{ color:t.muted }}>{step+1} / {ASSESSMENT.length}</p>
      </div>
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {ASSESSMENT.map((q,i)=><span key={q.id} style={{ background:i<=step?t.accent:t.surfaceAlt }} className="h-1.5 flex-1 rounded-full" />)}
      </div>
      <h3 className="mt-6 max-w-2xl text-xl font-semibold leading-8 sm:text-2xl">{ASSESSMENT[step].q}</h3>
      <p className="mt-3 text-sm" style={{ color:t.muted }}>Choose what best describes your business today.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          {label:"Yes",value:2 as Answer},
          {label:"Partly",value:1 as Answer},
          {label:"No",value:0 as Answer},
        ].map(o=>(
          <button key={o.label} type="button" onClick={()=>answer(o.value)}
                  style={{ background:t.surfaceAlt, borderColor:t.border }}
                  className="btn-outline min-h-12 rounded-full border px-6 text-sm font-semibold">
            {o.label}
          </button>
        ))}
      </div>
      {step>0 && <button type="button" onClick={()=>setStep(step-1)} className="mt-5 text-sm font-semibold hover:underline" style={{ color:t.muted }}>← Back</button>}
    </div>
  );
}

function EnquiryForm({ t }:{ t:Tokens }) {
  const [form,setForm]=useState({name:"",business:"",email:"",website:"",message:""});
  const [submitting,setSubmitting]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const [error,setError]=useState("");
  const inputStyle={background:t.surfaceAlt,borderColor:t.border,color:t.text};

  const submit=async()=>{
    if(!form.name.trim()||!form.business.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){
      setError("Please add your name, business name and a valid email."); return;
    }
    setSubmitting(true); setError("");
    try{
      const res=await fetch("/api/our-solution-enquiry",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if(!res.ok) throw new Error("Failed");
      setSubmitted(true); trackEvent("construction_enquiry_submit");
    }catch{
      setError("Something went wrong. Please try again, or book a short call instead.");
    }finally{setSubmitting(false);}
  };

  if(submitted) return (
    <div style={{ background:t.surface,borderColor:t.border }} className="rounded-2xl border p-8 text-center">
      <h3 className="text-2xl font-bold">Thanks, we&apos;ve got it.</h3>
      <p className="mx-auto mt-3 max-w-xl leading-7" style={{ color:t.muted }}>We&apos;ll use what you sent to understand the current journey and where the strongest opportunities may be.</p>
    </div>
  );

  return (
    <div style={{ background:t.surface,borderColor:t.border }} className="rounded-2xl border p-6 sm:p-8">
      <h3 className="text-2xl font-bold">Send us how you work</h3>
      <p className="mt-3 max-w-2xl leading-7" style={{ color:t.muted }}>Send us your website and a quick outline of how customers currently get pricing, quotes or orders through to you.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name *" style={inputStyle} className="min-h-12 rounded-xl border px-4 outline-none"/>
        <input value={form.business} onChange={e=>setForm({...form,business:e.target.value})} placeholder="Business name *" style={inputStyle} className="min-h-12 rounded-xl border px-4 outline-none"/>
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email *" type="email" style={inputStyle} className="min-h-12 rounded-xl border px-4 outline-none"/>
        <input value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="Website" style={inputStyle} className="min-h-12 rounded-xl border px-4 outline-none"/>
      </div>
      <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
        placeholder="What feels slow, manual or harder than it should be for customers or staff?"
        rows={4} style={inputStyle} className="mt-4 w-full rounded-xl border px-4 py-3 outline-none"/>
      {error && <p className="mt-4 text-sm font-semibold" style={{ color:"#ff6b6b" }}>{error}</p>}
      <button type="button" onClick={submit} disabled={submitting}
              style={{ background:t.accent,color:t.accentText }}
              className="btn-solid mt-5 min-h-12 rounded-full px-7 text-sm font-semibold disabled:opacity-60">
        {submitting?"Sending…":"Send us how you work"}
      </button>
    </div>
  );
}

function ExplainerVideo({ t }:{ t:Tokens }) {
  if(!EXPLAINER_VIDEO_URL) return null;
  return (
    <div style={{background:t.surface,borderColor:t.border}} className="mt-10 overflow-hidden rounded-2xl border">
      <video controls playsInline preload="metadata" className="aspect-video w-full bg-black">
        <source src={EXPLAINER_VIDEO_URL}/>
      </video>
      <div className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold">Prefer to watch?</p>
        <p className="text-sm" style={{color:t.muted}}>The 90-second explainer covers the same story as this page.</p>
      </div>
    </div>
  );
}

export default function ConstructionSolutionPage(){
  const [theme,setTheme]=useState<Theme>("dark");
  const [formOpen,setFormOpen]=useState(false);
  const t=theme==="dark"?dark:light;
  const openForm=()=>{ setFormOpen(true); setTimeout(()=>scrollToId("enquiry"),80); };

  return (
    <main style={{background:t.bg,color:t.text,["--accent" as string]:t.accent,["--accent-ink" as string]:t.accentInk}} className="min-h-screen antialiased">
      <style>{`
        main button,main a{cursor:pointer;transition:transform .15s ease,filter .15s ease,border-color .15s ease,box-shadow .15s ease}
        .btn-solid:hover{transform:translateY(-1px);filter:brightness(1.08);box-shadow:0 7px 22px rgba(215,255,0,.18)}
        .btn-outline:hover{transform:translateY(-1px);border-color:var(--accent-ink)!important}
        .hover-card{transition:transform .15s ease,border-color .15s ease}.hover-card:hover{transform:translateY(-2px);border-color:var(--accent-ink)!important}
        .card-toggle:hover{background:rgba(127,127,127,.05)}.proof-stat strong{color:var(--accent-ink)}
        .loop-pill{transition:transform .15s ease,background .15s ease,color .15s ease,border-color .15s ease}
        .loop-pill:hover,.loop-pill:focus-visible{transform:scale(1.04);background:var(--accent)!important;color:#0a0b10!important;border-color:var(--accent)!important}
      `}</style>

      <header style={{background:theme==="dark"?"rgba(10,11,16,.88)":"rgba(251,252,255,.92)",borderColor:t.border}} className="sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="https://www.t3labs.tech" className="flex items-center gap-2 font-semibold">
            <span style={{background:t.accent,color:t.accentText}} className="rounded-md px-2 py-0.5 text-sm font-bold">T3</span>
            <span className="hidden text-sm sm:inline" style={{color:t.muted}}>Labs</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm lg:flex" style={{color:t.muted}}>
            <button onClick={()=>scrollToId("problem")}>The Problem</button>
            <button onClick={()=>scrollToId("solution")}>The Solution</button>
            <button onClick={()=>scrollToId("assistant")}>How It Works</button>
            <button onClick={()=>scrollToId("pricing")}>Pricing</button>
            <button onClick={()=>scrollToId("demos")}>Demos</button>
            <button onClick={()=>scrollToId("assessment")}>Quick Check</button>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>setTheme(theme==="dark"?"light":"dark")} style={{borderColor:t.border,color:t.muted}} className="btn-outline rounded-full border px-3 py-1.5 text-xs font-medium">
              {theme==="dark"?"☀ Light":"☾ Dark"}
            </button>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{background:t.accent,color:t.accentText}} className="btn-solid hidden rounded-full px-4 py-1.5 text-xs font-semibold sm:inline-flex">
              Book a free short call
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        <section className="py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[.2em]" style={{color:t.accentInk}}>Built for construction suppliers & trade businesses</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Your customers want answers now. If they cannot get them from you, they keep looking.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8" style={{color:t.muted}}>
            For years, a professional website, products or services list, and basic inquiry form were enough. Today, buyers increasingly expect basic, useful pricing, quantities, and product guidance instantly, because if you can&apos;t provide that, AI or your competitors will.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-8" style={{color:t.muted}}>
            We help construction businesses get found more easily, give buyers better answers faster, and reduce the manual back-and-forth work for your team.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={()=>scrollToId("problem")} style={{background:t.accent,color:t.accentText}} className="btn-solid min-h-12 rounded-full px-8 text-base font-semibold">See how it works</button>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{borderColor:t.border}} className="btn-outline inline-flex min-h-12 items-center justify-center rounded-full border px-8 text-base font-semibold">Book a free short call</a>
          </div>

          <button
            type="button"
            onClick={()=>scrollToId("pricing")}
            style={{color:t.muted}}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          >
            <span style={{color:t.accentInk}}>Focused projects can start from $999</span>
            <span>See pricing ↓</span>
          </button>

          <ExplainerVideo t={t}/>

          <div style={{background:t.surfaceAlt,borderColor:t.border}} className="mt-8 max-w-4xl rounded-2xl border p-5 sm:p-6">
            <p className="text-sm font-semibold" style={{color:t.accentInk}}>This shift is already happening.</p>
            <p className="mt-2 text-sm leading-6" style={{color:t.muted}}>
              The opportunity is to improve the buying journey while many competitors still rely on basic enquiry forms and manual follow-up. The earlier you improve it, the longer that advantage has to compound.
            </p>
          </div>
        </section>

        <section id="problem" className="scroll-mt-20 py-14 sm:py-18">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>The problem</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What used to look professional can now become a bottleneck.</h2>
              <p className="mt-5 max-w-2xl leading-7" style={{color:t.muted}}>
                If a buyer reaches your site and still has to call, email or submit a generic form just to understand price, quantities or the right product,
                you are asking them to wait when they increasingly know they can get an answer somewhere else.
              </p>
            </div>
            <div style={{background:t.surface,borderColor:t.border}} className="rounded-2xl border p-6">
              <p className="font-semibold">Does any of this sound familiar?</p>
              <div className="mt-4 grid gap-2">
                {[
                  "“Contact us for pricing”",
                  "A basic quote or enquiry form",
                  "Customers calling to ask what they need",
                  "Staff manually calculating quantities",
                  "Repeated back-and-forth before a quote can start",
                  "Useful product knowledge that only exists inside one to two team members",
                ].map(item=><div key={item} style={{background:t.surfaceAlt}} className="rounded-xl px-4 py-3 text-sm font-medium">{item}</div>)}
              </div>
            </div>
          </div>

          <div style={{background:t.accentSoft,borderColor:t.accentInk}} className="mt-8 rounded-2xl border p-6 sm:p-8">
            <p className="text-lg font-semibold">Search used to send people to websites to find the answer themselves. AI is now doing more of that work for them, using information it can find across the web.</p>
            <p className="mt-3 max-w-3xl leading-7" style={{color:t.muted}}>
              If your competitors make the useful answer easier to find and easier to act on, they have an advantage before the buyer even contacts anyone.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ExpandCard t={t} id="google-query" headline="Buyers are asking bigger, more detailed questions."
              stat={<>Google says the average AI Mode query is <strong>around 3× longer</strong> than a traditional Search query.</>}
              source="Google">
              <p>Google says people are using AI Mode for more complex, multi-part questions. That reflects the shift from short keyword searches toward full buying questions about price, products, suitability and suppliers.</p>
              <a href="https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/" target="_blank" rel="noopener noreferrer" style={{color:t.accentInk}} className="mt-2 inline-block font-semibold hover:underline">Read Google&apos;s research →</a>
            </ExpandCard>
            <ExpandCard t={t} id="speed" headline="Faster answers matter commercially."
              stat={<><strong>79%</strong> of surveyed US/UK home-services consumers said they would switch to a competitor that responds faster.</>}
              source="Invoca, 2026">
              <p>The same research found that 26% had called a business because information they needed was not available online. The practical takeaway is simple: give customers more of the answer before they need to ask.</p>
              <a href="https://www.invoca.com/uk/reports/home-services-buyer-experience-report-2026" target="_blank" rel="noopener noreferrer" style={{color:t.accentInk}} className="mt-2 inline-block font-semibold hover:underline">View the research →</a>
            </ExpandCard>
          </div>
        </section>

        <section id="solution" className="scroll-mt-20 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>The solution</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl">Turn your website into a place customers can actually get an answer.</h2>
          <p className="mt-5 max-w-3xl leading-7" style={{color:t.muted}}>
            Instead of sending every buyer into the same inquiry form, give them a useful way to work out what they need, understand the likely price and take the next step.
          </p>

          <div id="assistant" className="scroll-mt-20 mt-10">
            <div style={{background:t.surfaceAlt,borderColor:t.border}} className="rounded-3xl border p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>Two ways to get the answer</p>
              <h3 className="mt-3 max-w-3xl text-2xl font-bold sm:text-3xl">Give buyers two simple paths to the same result.</h3>

              <div className="mt-7 grid gap-4 lg:grid-cols-2">
                <div style={{background:t.surface,borderColor:t.border}} className="rounded-2xl border p-6">
                  <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{color:t.accentInk}}>Self-service</p>
                  <h4 className="mt-2 text-xl font-semibold">Use the tool</h4>
                  <p className="mt-3 text-sm leading-6" style={{color:t.muted}}>
                    Customers can measure, select products, calculate quantities and build pricing themselves through a simple guided workflow.
                  </p>
                </div>

                <div style={{background:t.surface,borderColor:t.border}} className="rounded-2xl border p-6">
                  <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{color:t.accentInk}}>Conversational</p>
                  <h4 className="mt-2 text-xl font-semibold">Ask the intelligent sales assistant</h4>
                  <p className="mt-3 text-sm leading-6" style={{color:t.muted}}>
                    Customers can simply explain what they need. The assistant is configured around your products, pricing, compatibility and common questions, then guides them toward an answer, preliminary price, enquiry or purchase.
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-4xl text-sm leading-6" style={{color:t.muted}}>
                Offer either option, or use both together. The goal is the same: give the customer a useful answer sooner, then move them toward the next sales step with less work from your team.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Give customers an answer now","Let buyers get a useful result without waiting for a call, email or manual quote."],
                  ["Move them toward a sale","Turn that result into a quote, enquiry, order or clear next step."],
                  ["Reduce staff workload","Handle repetitive questions and collect better information before staff get involved."],
                  ["Capture better data","See what customers ask for, price, select and quote, then use that information to improve the business."],
                ].map(([title,body])=>(
                  <div key={title} style={{background:t.surface,borderColor:t.border}} className="rounded-xl border p-4">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-xs leading-5" style={{color:t.muted}}>{body}</p>
                  </div>
                ))}
              </div>

              <div style={{background:t.surface,borderColor:t.border}} className="mt-5 rounded-xl border p-5">
                <p className="text-sm font-semibold">The sales assistant can be tightly controlled.</p>
                <p className="mt-2 text-sm leading-6" style={{color:t.muted}}>
                  Whether you have 20 products or 20,000, it can be configured around the catalogue, pricing rules and answers you approve. If it does not have enough information or the question needs a person, it does not need to guess. It can stop and hand the customer to your team with the conversation already captured.
                </p>
              </div>
            </div>
          </div>

          <div id="pricing" className="scroll-mt-20 mt-12">
            <div style={{background:t.surface,borderColor:t.border}} className="rounded-3xl border p-6 sm:p-8 lg:p-10">
              <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>Simple starting point</p>
                  <p className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">$999<span className="text-lg font-semibold" style={{color:t.muted}}>+</span></p>
                  <p className="mt-2 text-sm font-semibold">Focused projects can start from $999.</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold sm:text-3xl">Start with the first useful version.</h3>
                  <p className="mt-4 max-w-2xl text-sm leading-6" style={{color:t.muted}}>
                    A simple first build can include a focused customer tool, basic product setup and launch configuration. Add more products, calculations, assistant features, integrations or internal workflows only if they are useful.
                  </p>
                  <p className="mt-4 text-sm font-semibold" style={{color:t.accentInk}}>
                    Scope and payment structure can be flexible around what you actually need.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div style={{background:t.accentSoft,borderColor:t.accentInk}} className="rounded-3xl border p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>The better question</p>
              <h3 className="mt-3 max-w-3xl text-2xl font-bold sm:text-3xl">What would this need to do to pay for itself?</h3>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  "How many extra sales would it need to create?",
                  "How many staff hours could it save each month?",
                  "What is getting ahead now worth compared with catching up later?",
                ].map(item=>(
                  <div key={item} style={{background:t.surface,borderColor:t.border}} className="rounded-xl border p-4 text-sm font-semibold leading-6">
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-6" style={{color:t.muted}}>
                The useful comparison is not the build cost versus doing nothing. It is the cost versus the time, low-value enquiries and sales friction it can remove. A few extra sales, saved staff hours, or a combination of both may already justify the investment.
              </p>
            </div>
          </div>

          <div id="demos" className="scroll-mt-20 mt-12">
            <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>Live examples</p>
            <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <h3 className="text-2xl font-bold sm:text-3xl">See the tools and sales assistant in action.</h3>
              <p className="max-w-xl text-sm leading-6" style={{color:t.muted}}>Examples of capability, not fixed products. The design, products, pricing, rules and workflow can all be tailored to your business.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {DEMOS.map(d=>(
                <a key={d.name} href={d.href} target="_blank" rel="noopener noreferrer"
                   onClick={()=>trackEvent("construction_demo_click",{demo:d.label})}
                   style={{background:t.surface,borderColor:t.border}} className="hover-card rounded-2xl border p-6">
                  <span style={{color:t.accentInk}} className="text-xs font-semibold uppercase tracking-[.15em]">{d.label}</span>
                  <h4 className="mt-3 text-lg font-semibold">{d.name}</h4>
                  <p className="mt-3 text-sm leading-6" style={{color:t.muted}}>{d.problem}</p>
                  <p className="mt-5 text-sm font-semibold" style={{color:t.accentInk}}>Try the demo →</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="assessment" className="scroll-mt-20 py-14 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>Quick check</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">How much friction is still in your buying journey?</h2>
              <p className="mt-5 leading-7" style={{color:t.muted}}>Five quick questions will show where customers may still be waiting on your team when they could be getting an answer themselves.</p>
            </div>
            <Assessment t={t} onSend={openForm}/>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div style={{background:t.surface,borderColor:t.border}} className="rounded-3xl border p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>The longer-term upside</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">What starts as one useful tool can become a real sales asset.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-6" style={{color:t.muted}}>
              More customers using the system can create better first-party data, better product information and new resources you can build on over time. That makes the advantage harder to copy than the tool alone.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {["Useful Tool","More Users","Better Data","Better Information","More Value"].map((item,i,arr)=>(
                <span key={item} className="flex items-center gap-2">
                  <span tabIndex={0} style={{background:t.surfaceAlt,borderColor:t.border}} className="loop-pill rounded-full border px-4 py-2 text-sm font-medium">{item}</span>
                  {i<arr.length-1?<span style={{color:t.muted}} className="text-xs">→</span>:<span role="img" aria-label="The cycle repeats" style={{color:t.accentInk}} className="ml-1 text-3xl font-bold sm:text-4xl">↺</span>}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="start" className="scroll-mt-20 py-16 sm:py-24">
          <div style={{background:t.surfaceAlt,borderColor:t.border}} className="rounded-3xl border p-6 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[.16em]" style={{color:t.accentInk}}>Start simple</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Start with the part of the buying journey that is costing you the most.</h2>
            <p className="mt-5 max-w-3xl leading-7" style={{color:t.muted}}>You do not need to know exactly what to build. Start with the customer questions, quoting work or manual steps that cause the most friction, then build the smallest useful version around that.</p>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div style={{background:t.surface,borderColor:t.border}} className="rounded-2xl border p-6">
                <h3 className="text-xl font-semibold">Have a short call</h3>
                <p className="mt-2 text-sm leading-6" style={{color:t.muted}}>Tell us how customers currently get pricing, product advice or quotes and we&apos;ll talk through where the strongest opportunity may be.</p>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{background:t.accent,color:t.accentText}} className="btn-solid mt-5 inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-semibold">Book a free short call</a>
              </div>
              <div style={{background:t.surface,borderColor:t.border}} className="rounded-2xl border p-6">
                <h3 className="text-xl font-semibold">Send us how you work</h3>
                <p className="mt-2 text-sm leading-6" style={{color:t.muted}}>Send us your website and a quick outline of how customers currently buy from you. We&apos;ll look for the most obvious friction and opportunities.</p>
                <button type="button" onClick={openForm} style={{borderColor:t.border}} className="btn-outline mt-5 min-h-12 rounded-full border px-7 text-sm font-semibold">Send us how you work</button>
              </div>
            </div>
            {formOpen && <div id="enquiry" className="scroll-mt-24 mt-6"><EnquiryForm t={t}/></div>}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{background:t.accent,color:t.accentText}} className="btn-solid flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold shadow-lg">Book a free short call</a>
      </div>

      <footer style={{borderColor:t.border}} className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between" style={{color:t.muted}}>
          <p>© T3 Labs</p><p>Construction sales tools · Pricing · Estimating · Quoting · Online sales assistants</p>
        </div>
      </footer>
    </main>
  );
}
