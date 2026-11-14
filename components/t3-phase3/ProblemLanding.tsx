import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/t3-rebuild/Header";

export type ProblemPage = {
  key: string; eyebrow: string; metaTitle: string; metaDescription: string;
  h1: string[]; answer: string; proof: string; focus: string; cta: string;
  diagnosisTitle: string; diagnoses: {label:string;symptom:string;action:string}[];
  choiceTitle: string; choices: {when:string;best:string;do:string}[];
  demoTitle: string; demoBody: string; demoUrl: string; demoLabel: string;
  extraUrl: string|null; extraLabel: string|null; image: string; imageAlt: string;
  limitations: string; diy: string;
  research: {text:string;source:string;url:string}; faqs: string[][];
  video: {title:string;duration:string;steps:string[];embedUrl?:string;transcript?:string};
  related: string[]; faqTitle: string;
};
const CALL_URL="https://calendly.com/insights-t3labs/20-minute-meeting";
const relatedLabels:Record<string,string>={
 "roofing-website-design":"Website design","roofing-seo":"SEO & better leads",
 "roofing-website-estimators":"Website estimators","roofing-quoting-software":"Quoting software",
 "roofing-ai-website-assistants":"Smart assistants","roofing-business-automation":"Business automation",
 "custom-roofing-software":"Custom roofing software",
};
function ExternalLink({href,children}:{href:string;children:ReactNode}){
 return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
export function ProblemLanding({page}:{page:ProblemPage}){
 const reviewUrl=`/free-review?focus=${encodeURIComponent(page.focus)}`;
 const hasRealVideo=Boolean(page.video.embedUrl);
 return <div className="t3-rebuild"><Header/>
 <main className="rwd-page rwd-service rwd-problem" id="main-content">
  <section className="rwd-v5-hero"><div className="rwd-shell rwd-v5-hero-copy">
   <nav className="rwd-v5-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/solutions">Solutions</Link><span aria-hidden="true">/</span><span aria-current="page">{page.eyebrow}</span></nav>
   <span className="rwd-eyebrow rwd-eyebrow-light">{page.eyebrow}</span>
   <h1>{page.h1[0]} <em>{page.h1[1]}</em></h1>
   <p className="rwd-v5-answer">{page.answer}</p>
   <div className="rwd-v5-actions"><Link className="rwd-button" href={reviewUrl}>{page.cta} <span aria-hidden="true">↗</span></Link><a className="rwd-text-link rwd-text-link-light" href="#demonstration">See the real example ↓</a></div>
  </div></section>
  <section className="rwd-v5-demo-band" id="demonstration" aria-label="Real example and video walkthrough"><div className="rwd-shell">
   <div className="rwd-v5-demo-card">
    <div className="rwd-v5-media">{hasRealVideo ?
      <iframe className="rwd-v5-video-frame" loading="lazy" src={page.video.embedUrl} title={page.video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/> :
      <ExternalLink href={page.demoUrl}><span className="rwd-v5-media-link"><Image src={page.image} alt={page.imageAlt} width={1280} height={800} priority sizes="(max-width:720px) 100vw, 60vw"/><span className="rwd-v5-media-label">Real working example <span aria-hidden="true">↗</span></span></span></ExternalLink>}
    </div>
    <div className="rwd-v5-demo-info">
     <span className="rwd-eyebrow">{hasRealVideo ? "WATCH THE WALKTHROUGH" : "SEE IT IN PRACTICE"}</span>
     <h2>{hasRealVideo ? page.video.title : page.demoTitle}</h2>
     <p>{page.demoBody}</p>
     <div className="rwd-v5-demo-actions"><ExternalLink href={page.demoUrl}><span className="rwd-inline-cta">{page.demoLabel} ↗</span></ExternalLink>{page.extraUrl&&page.extraLabel?<ExternalLink href={page.extraUrl}><span className="rwd-inline-cta">{page.extraLabel} ↗</span></ExternalLink>:null}</div>
     <div className="rwd-v5-research"><p>{page.research.text}</p><ExternalLink href={page.research.url}><span className="rwd-inline-cta">Source: {page.research.source} ↗</span></ExternalLink></div>
    </div>
   </div>
   {hasRealVideo&&page.video.transcript?<details className="rwd-v5-transcript"><summary>Read the video transcript</summary><p>{page.video.transcript}</p></details>:null}
  </div></section>
  <section className="rwd-v5-section" id="diagnose"><div className="rwd-shell">
   <span className="rwd-eyebrow">01 / CHECK THE PROBLEM</span><h2>{page.diagnosisTitle}</h2>
   <div className="rwd-v5-grid">{page.diagnoses.map((x,i)=><article key={x.label} className="rwd-v5-card"><span className="rwd-v5-number">0{i+1}</span><h3>{x.label}</h3><p>{x.symptom}</p><p className="rwd-v5-action">{x.action}</p></article>)}</div>
  </div></section>
  <section className="rwd-v5-section rwd-v5-soft" id="options"><div className="rwd-shell">
   <span className="rwd-eyebrow">02 / PICK THE RIGHT FIX</span><h2>{page.choiceTitle}</h2>
   <div className="rwd-v5-grid">{page.choices.map((x,i)=><article key={x.when} className="rwd-v5-card"><span className="rwd-v5-number">0{i+1}</span><h3>{x.when}</h3><p>{x.best}</p><p className="rwd-v5-action">{x.do}</p></article>)}</div>
   <div className="rwd-v5-boundary"><strong>Worth knowing</strong><p>{page.limitations}</p></div>
  </div></section>
  <section className="rwd-v5-faq"><div className="rwd-shell rwd-v5-faq-layout"><div><span className="rwd-eyebrow">03 / COMMON QUESTIONS</span><h2>{page.faqTitle}</h2></div><div className="rwd-v5-faq-items">
   {page.faqs.slice(0,3).map(([q,a])=><details key={q}><summary>{q}<span className="rwd-v5-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}
  </div></div></section>
  <section className="rwd-v5-final"><div className="rwd-shell rwd-v5-final-inner"><div><span className="rwd-eyebrow rwd-eyebrow-light">PRACTICAL HELP FROM THE PEOPLE DOING THE WORK</span><h2>Want the right fix without the guesswork?</h2><p>Tell us what is holding your roofing business back. We will review what you already have and recommend a sensible next step.</p></div><div className="rwd-v5-final-actions"><Link className="rwd-button" href={reviewUrl}>Get my free business review ↗</Link><ExternalLink href={CALL_URL}><span className="rwd-text-link rwd-text-link-light">Book a 20-minute call ↗</span></ExternalLink></div></div></section>
  <aside className="rwd-v5-related" aria-label="Related solutions"><div className="rwd-shell rwd-v5-related-inner"><span>RELATED SOLUTIONS</span><div>{page.related.map(slug=><Link key={slug} href={`/${slug}`}>{relatedLabels[slug]??slug} ↗</Link>)}<Link href="/custom-roofing-software">Custom roofing software ↗</Link><Link href="/solutions">All solutions ↗</Link></div></div></aside>
 </main><footer className="rwd-footer"><div className="rwd-shell"><Link href="/">T3Labs</Link><span>Roofing and construction technology built by people who know the trades.</span><Link href="/solutions">All solutions</Link><Link href="/contact">Contact</Link><Link href="/free-review">Free review</Link></div></footer></div>;
}
