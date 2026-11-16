import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/t3-rebuild/Header";
import { SERVICE_GUIDES } from "@/components/t3-phase3/service-guides";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { SERVICE_KEY_TO_SLUG } from "@/lib/roofing-service-seo";

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
  example: {scenario:string;improvement:string;signal:string};
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
 const baseUrl = "https://www.t3labs.tech";
 // Each page's key is not its URL: use the canonical service path supplied explicitly below.
 const canonicalPath = SERVICE_KEY_TO_SLUG[page.key];
 const canonicalUrl = `${baseUrl}/${canonicalPath}`;
 const guide = SERVICE_GUIDES[canonicalPath];
 const structuredData = [
   { "@context":"https://schema.org", "@type":"Service", name:page.eyebrow, serviceType:page.eyebrow,
     description:page.metaDescription, url:canonicalUrl,
     provider:{ "@type":"Organization", name:"T3 Labs", url:baseUrl } },
   { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[
     {"@type":"ListItem",position:1,name:"Home",item:baseUrl},
     {"@type":"ListItem",position:2,name:"Roofing solutions",item:`${baseUrl}/solutions`},
     {"@type":"ListItem",position:3,name:page.eyebrow,item:canonicalUrl},
   ] },
 ];
 return <div className="t3-rebuild"><Header/>
 <main className="rwd-page rwd-service rwd-problem" id="main-content">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} />
  <section className="rwd-v5-hero"><div className="rwd-shell rwd-v5-hero-copy">
   <nav className="rwd-v5-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/solutions">Solutions</Link><span aria-hidden="true">/</span><span aria-current="page">{page.eyebrow}</span></nav>
   <span className="rwd-eyebrow rwd-eyebrow-light">{page.eyebrow}</span>
   <h1>{page.h1[0]} <em>{page.h1[1]}</em></h1>
   <p className="rwd-v5-answer">{page.answer}</p>
   <div className="rwd-v5-actions"><TrackedLink className="rwd-button" href={reviewUrl} eventName="service_to_review_click" source={canonicalPath}>{page.cta} <span aria-hidden="true">↗</span></TrackedLink><a className="rwd-text-link rwd-text-link-light" href="#demonstration">See the real example ↓</a></div>
  </div></section>
  <section className="rwd-v5-demo-band" id="demonstration" aria-label="Real example and video walkthrough"><div className="rwd-shell">
   <div className="rwd-v5-demo-card">
    <div className="rwd-v5-media">{hasRealVideo ?
      <iframe className="rwd-v5-video-frame" loading="lazy" src={page.video.embedUrl} title={page.video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/> :
      <TrackedLink href={page.demoUrl} eventName="demo_click" source={canonicalPath}><span className="rwd-v5-media-link"><Image src={page.image} alt={page.imageAlt} width={1280} height={800} priority sizes="(max-width:720px) 100vw, 60vw"/><span className="rwd-v5-media-label">Real working example <span aria-hidden="true">↗</span></span></span></TrackedLink>}
    </div>
    <div className="rwd-v5-demo-info">
     <span className="rwd-eyebrow">{hasRealVideo ? "WATCH THE WALKTHROUGH" : "SEE IT IN PRACTICE"}</span>
     <h2>{hasRealVideo ? page.video.title : page.demoTitle}</h2>
     <p>{page.demoBody}</p>
     <p className="rwd-v5-proof">{page.proof}</p>
     <div className="rwd-v5-demo-actions"><TrackedLink href={page.demoUrl} eventName="demo_click" source={canonicalPath}><span className="rwd-inline-cta">{page.demoLabel} ↗</span></TrackedLink>{page.extraUrl&&page.extraLabel?<TrackedLink href={page.extraUrl} eventName="demo_click" source={canonicalPath}><span className="rwd-inline-cta">{page.extraLabel} ↗</span></TrackedLink>:null}</div>
     <div className="rwd-v5-research"><p>{page.research.text}</p><ExternalLink href={page.research.url}><span className="rwd-inline-cta">Source: {page.research.source} ↗</span></ExternalLink></div>
    </div>
   </div>
   {hasRealVideo&&page.video.transcript?<details className="rwd-v5-transcript"><summary>Read the video transcript</summary><p>{page.video.transcript}</p></details>:null}
  </div></section>
  <section className="rwd-v5-section" id="diagnose"><div className="rwd-shell">
   <span className="rwd-eyebrow">01 / CHECK THE PROBLEM</span><h2>{page.diagnosisTitle}</h2>
   <div className="rwd-v5-grid">{page.diagnoses.map((x,i)=><article key={x.label} className="rwd-v5-card"><span className="rwd-v5-number">0{i+1}</span><h3>{x.label}</h3><p>{x.symptom}</p><p className="rwd-v5-action">{x.action}</p></article>)}</div>
   <div className="rwd-v5-try"><div><span className="rwd-eyebrow">ONE STEP YOU CAN TAKE TODAY</span><p>{page.diy}</p></div><TrackedLink href={reviewUrl} eventName="service_to_review_click" source={canonicalPath}>Ask us to look at it ↗</TrackedLink></div>
  </div></section>
  <section className="rwd-v5-section rwd-v5-soft" id="options"><div className="rwd-shell">
   <span className="rwd-eyebrow">02 / PICK THE RIGHT FIX</span><h2>{page.choiceTitle}</h2>
   <div className="rwd-v5-grid">{page.choices.map((x,i)=><article key={x.when} className="rwd-v5-card"><span className="rwd-v5-number">0{i+1}</span><h3>{x.when}</h3><p>{x.best}</p><p className="rwd-v5-action">{x.do}</p></article>)}</div>
   <div className="rwd-v5-boundary"><strong>Worth knowing</strong><p>{page.limitations}</p></div>
  </div></section>
  {guide && <section className="rwd-v5-guide" id="practical-guide" aria-labelledby="rwd-guide-heading"><div className="rwd-shell">
    <span className="rwd-eyebrow rwd-eyebrow-ink">03 / A PRACTICAL GUIDE FOR ROOFING BUSINESSES</span>
    <h2 id="rwd-guide-heading">{guide.headline}</h2>
    <p className="rwd-v5-guide-intro">{guide.introduction}</p>
    <div className="rwd-v5-guide-columns">
      <div className="rwd-v5-guide-checklist"><h3>{guide.inputsTitle}</h3><ul>{guide.inputs.map(item=><li key={item}>{item}</li>)}</ul></div>
      <div className="rwd-v5-guide-steps"><h3>{guide.stepsTitle}</h3><ol>{guide.steps.map((item,i)=><li key={item.heading}><span aria-hidden="true">{String(i+1).padStart(2,"0")}</span><div><strong>{item.heading}</strong><p>{item.body}</p></div></li>)}</ol></div>
    </div>
    <div className="rwd-v5-guide-bottom"><div><strong>How to choose the next step</strong><p>{guide.decision}</p></div><div><strong>What success should look like</strong><p>{guide.measurement}</p></div></div>
    {guide.deeperReading && <Link className="rwd-v5-guide-reading" href={guide.deeperReading.href}>{guide.deeperReading.label} ↗</Link>}
  </div></section>}
  <section className="rwd-v5-example" aria-labelledby="rwd-example-heading"><div className="rwd-shell">
   <span className="rwd-eyebrow rwd-eyebrow-light">04 / AN ILLUSTRATIVE EXAMPLE</span>
   <h2 id="rwd-example-heading">What an improvement could look like.</h2>
   <p className="rwd-v5-example-intro">A scenario to help you picture the process, not a claim about a particular customer's results.</p>
   <div className="rwd-v5-example-grid">
    <div><span>THE SITUATION</span><p>{page.example.scenario}</p></div>
    <div><span>A SENSIBLE NEXT STEP</span><p>{page.example.improvement}</p></div>
    <div><span>HOW TO CHECK IF IT HELPS</span><p>{page.example.signal}</p></div>
   </div>
  </div></section>
  <section className="rwd-v5-faq"><div className="rwd-shell rwd-v5-faq-layout"><div><span className="rwd-eyebrow">05 / COMMON QUESTIONS</span><h2>{page.faqTitle}</h2></div><div className="rwd-v5-faq-items">
   {page.faqs.slice(0,3).map(([q,a])=><details key={q}><summary>{q}<span className="rwd-v5-plus" aria-hidden="true">+</span></summary><p>{a}</p></details>)}
  </div></div></section>
  <section className="rwd-v5-final"><div className="rwd-shell rwd-v5-final-inner"><div><span className="rwd-eyebrow rwd-eyebrow-light">PRACTICAL HELP FROM THE PEOPLE DOING THE WORK</span><h2>Want the right fix without the guesswork?</h2><p>Tell us what is holding your roofing business back. We will review what you already have and recommend a sensible next step.</p></div><div className="rwd-v5-final-actions"><TrackedLink className="rwd-button" href={reviewUrl} eventName="service_to_review_click" source={canonicalPath}>Get my free business review ↗</TrackedLink><TrackedLink href={CALL_URL} eventName="book_call_click" source={canonicalPath} target="_blank"><span className="rwd-text-link rwd-text-link-light">Book a 20-minute call ↗</span></TrackedLink></div></div></section>
  <aside className="rwd-v5-related" aria-label="Related solutions"><div className="rwd-shell rwd-v5-related-inner"><span>RELATED SOLUTIONS</span><div>{page.related.map(slug=><Link key={slug} href={`/${slug}`}>{relatedLabels[slug]??slug} ↗</Link>)}<Link href="/custom-roofing-software">Custom roofing software ↗</Link><Link href="/solutions">All solutions ↗</Link></div></div></aside>
 </main><footer className="rwd-footer"><div className="rwd-shell"><Link href="/">T3Labs</Link><span>Roofing and construction technology built by people who know the trades.</span><Link href="/solutions">All solutions</Link><Link href="/contact">Contact</Link><Link href="/free-review">Free review</Link></div></footer></div>;
}
