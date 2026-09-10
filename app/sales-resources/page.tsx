"use client";

import { useState } from "react";

type Theme = "dark" | "light";
type Tokens = { bg:string; surface:string; surfaceAlt:string; border:string; text:string; muted:string; accent:string; accentText:string; accentInk:string; accentSoft:string };
const dark: Tokens = { bg:"#0a0b10",surface:"#101219",surfaceAlt:"#161927",border:"#262a3a",text:"#e8eaf2",muted:"#9aa1b5",accent:"#d7ff00",accentText:"#0a0b10",accentInk:"#d7ff00",accentSoft:"rgba(215,255,0,.08)" };
const light: Tokens = { bg:"#fbfcff",surface:"#fff",surfaceAlt:"#f3f5fa",border:"#e7e9ef",text:"#0a0b10",muted:"#5a6172",accent:"#d7ff00",accentText:"#0a0b10",accentInk:"#809000",accentSoft:"rgba(215,255,0,.18)" };

const BOOKING_URL = "https://calendly.com/cece-t3labs/20min";
const CUSTOMER_PAGE = "/our-solution";

const DEMOS = [
  ["Roofing", "/supplier-pricing-tool/apex-roofing", "Best first demo for roof suppliers, manufacturers and roofing-focused trade businesses."],
  ["Flooring", "/supplier-pricing-tool/oakline-flooring", "Use for flooring suppliers or any business where areas, quantities and material pricing matter."],
  ["Cladding", "/supplier-pricing-tool/vertex-cladding", "Use for wall/cladding suppliers or broader construction businesses with sheet/product quantity workflows."],
] as const;

function Card({ t, title, children }: { t: Tokens; title: string; children: React.ReactNode }) {
  return <div style={{ background:t.surface,borderColor:t.border }} className="rounded-2xl border p-6"><h3 className="text-lg font-semibold">{title}</h3><div className="mt-3 text-sm leading-6" style={{ color:t.muted }}>{children}</div></div>;
}

function scrollToId(id:string){ document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"}); }

export default function SalesRepConstructionPlaybookPage(){
  const [theme,setTheme]=useState<Theme>("dark"); const t=theme==="dark"?dark:light;
  return <main style={{background:t.bg,color:t.text,["--accent" as string]:t.accent}} className="min-h-screen antialiased">
  <style>{`main button,main a{transition:transform .15s ease,filter .15s ease,border-color .15s ease}.solid:hover{filter:brightness(1.1);transform:translateY(-1px)}.card:hover{transform:translateY(-2px);border-color:var(--accent)!important}`}</style>
  <header style={{background:theme==="dark"?"rgba(10,11,16,.88)":"rgba(251,252,255,.94)",borderColor:t.border}} className="sticky top-0 z-50 border-b backdrop-blur">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
  <div className="flex items-center gap-2 font-semibold"><span style={{background:t.accent,color:t.accentText}} className="rounded-md px-2 py-0.5 text-sm font-bold">T3</span><span className="text-sm" style={{color:t.muted}}>Sales Playbook</span></div>
  <div className="flex items-center gap-2"><button onClick={()=>setTheme(theme==="dark"?"light":"dark")} style={{borderColor:t.border,color:t.muted}} className="rounded-full border px-3 py-1.5 text-xs">{theme==="dark"?"&#9728; Light":"&#9790; Dark"}</button><a href={CUSTOMER_PAGE} target="_blank" rel="noopener noreferrer" style={{background:t.accent,color:t.accentText}} className="solid rounded-full px-4 py-2 text-xs font-semibold">Open customer page</a></div>
  </div>
  </header>

  <div className="mx-auto max-w-6xl px-5">
  <section className="py-16 sm:py-20">
  <p className="text-sm font-semibold uppercase tracking-[.2em]" style={{color:t.accentInk}}>Construction Sales Playbook</p>
  <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] sm:text-5xl">Find the opportunity. Ask the right questions. Show the right demo.</h1>
  <p className="mt-6 max-w-3xl text-lg leading-8" style={{color:t.muted}}>Our current focus is construction — especially suppliers, manufacturers and trade businesses — because we already have strong roofing, flooring and cladding tools to demonstrate. The underlying service is broader: get found more, convert more and reduce unnecessary work.</p>

  <div style={{background:t.accentSoft,borderColor:t.accentInk}} className="mt-8 rounded-2xl border p-6 sm:p-8">
  <p className="text-sm font-semibold uppercase tracking-[.15em]" style={{color:t.accentInk}}>30-second version</p>
  <p className="mt-3 max-w-4xl text-xl font-semibold leading-8">We help construction businesses give customers faster answers, make pricing and quoting easier, reduce repetitive staff work and publish more useful information that helps them stay visible as search shifts towards AI.</p>
  </div>

  <div className="mt-8 grid gap-4 md:grid-cols-4">
  {[["1","Find a lead"],["2","Audit the website"],["3","Uncover backend friction"],["4","Show the closest solution"]].map(([n,x])=><div key={n} style={{background:t.surface,borderColor:t.border}} className="rounded-2xl border p-5"><span style={{color:t.accentInk}} className="text-sm font-bold">{n}</span><p className="mt-2 font-semibold">{x}</p></div>)}
  </div>
  </section>

  <section id="target" className="py-12 sm:py-16">
  <h2 className="text-3xl font-bold sm:text-4xl">1. Who to target</h2>
  <p className="mt-4 max-w-3xl leading-7" style={{color:t.muted}}>Start with English-speaking construction markets. Roofing is the easiest current niche, followed by flooring, wall/cladding and broader construction suppliers. Do not assume a strong website means there is no opportunity — good businesses often have the best foundations to improve further.</p>
  <div className="mt-7 grid gap-4 md:grid-cols-3">
  <Card t={t} title="Best current prospects"><ul className="space-y-2"><li>&bull; Roofing suppliers / manufacturers</li><li>&bull; Flooring suppliers</li><li>&bull; Cladding / wall-system suppliers</li><li>&bull; General material suppliers</li><li>&bull; Trade businesses doing lots of quoting</li></ul></Card>
  <Card t={t} title="Good signs"><ul className="space-y-2"><li>&bull; High-value products</li><li>&bull; Customers need quantities or estimates</li><li>&bull; Lots of enquiries or quoting</li><li>&bull; Trade / contractor customers</li><li>&bull; Useful technical knowledge</li></ul></Card>
  <Card t={t} title="Important mindset"><p>We are not looking only for broken websites. A business may already do a lot well and still benefit from the final improvements that unlock more value from what it has already built.</p></Card>
  </div>
  </section>

  <section className="py-12 sm:py-16">
  <h2 className="text-3xl font-bold sm:text-4xl">2. Qualify them before you contact them</h2>
  <p className="mt-4 max-w-3xl leading-7" style={{color:t.muted}}>Spend a few minutes on the website. You are not trying to diagnose the whole business — just find enough evidence to start a relevant conversation.</p>
  <div className="mt-7 grid gap-4 lg:grid-cols-2">
  <Card t={t} title="Look for obvious front-end gaps"><ul className="space-y-2"><li>&bull; Is pricing visible or is it only &ldquo;contact us&rdquo;?</li><li>&bull; Are products clearly listed and explained?</li><li>&bull; Can customers calculate quantities?</li><li>&bull; Can they estimate or quote online?</li><li>&bull; Is the website easy to use on mobile?</li><li>&bull; Are there calculators, selectors or useful tools?</li><li>&bull; Is useful technical / educational information public?</li><li>&bull; Could AI clearly understand what they sell, where and roughly what it costs?</li></ul></Card>
  <Card t={t} title="What any of these can mean"><p>Any one gap can create an opportunity. Several gaps can create a larger one. The angle does not need to be different for each problem — the same custom solution can often improve pricing, conversion, staff workload and AI/search visibility at the same time.</p><p className="mt-3 font-semibold" style={{color:t.text}}>The job at this stage is simply to find a reason to talk.</p></Card>
  </div>
  </section>

  <section className="py-12 sm:py-16">
  <h2 className="text-3xl font-bold sm:text-4xl">3. Once you speak to them, uncover what the website cannot show you</h2>
  <p className="mt-4 max-w-3xl leading-7" style={{color:t.muted}}>The biggest opportunities are often behind the website: repetitive quoting, manual calculations, staff chasing information and disconnected workflows.</p>
  <div className="mt-7 grid gap-4 md:grid-cols-2">
  <Card t={t} title="Useful discovery questions"><ul className="space-y-2"><li>&bull; How do customers currently get pricing?</li><li>&bull; What happens after someone asks for a quote?</li><li>&bull; What does your team repeatedly have to calculate or chase?</li><li>&bull; What questions do customers ask over and over?</li><li>&bull; What part of quoting takes longer than it should?</li><li>&bull; What would you love customers or contractors to do themselves?</li><li>&bull; Where do spreadsheets, emails or manual handoffs slow things down?</li></ul></Card>
  <Card t={t} title="Listen for these themes"><ul className="space-y-2"><li>&bull; Customers waiting for answers</li><li>&bull; Too much staff back-and-forth</li><li>&bull; Manual quantities / takeoffs / pricing</li><li>&bull; Poor-quality enquiries</li><li>&bull; Trade customers needing better tools</li><li>&bull; Useful information trapped internally</li><li>&bull; Existing systems that do not connect cleanly</li></ul></Card>
  </div>
  </section>

  <section id="sell" className="py-12 sm:py-16">
  <h2 className="text-3xl font-bold sm:text-4xl">4. What we can sell</h2>
  <p className="mt-4 max-w-3xl leading-7" style={{color:t.muted}}>Do not force a prospect into a fixed package. One business may need one tool; another may need several connected tools or a fully bespoke system.</p>
  <div className="mt-7 grid gap-4 md:grid-cols-3">
  <Card t={t} title="Custom T3 Labs solutions"><ul className="space-y-2"><li>&bull; Pricing / estimating tools</li><li>&bull; Takeoff / quantity tools</li><li>&bull; Product selectors</li><li>&bull; Quote workflows</li><li>&bull; Trade/customer logins</li><li>&bull; Internal staff tools</li><li>&bull; Website rebuilds</li><li>&bull; Bespoke integrations / platforms</li></ul></Card>
  <Card t={t} title="QuoteCore Plus"><p>Our full SaaS workflow for measuring, quantifying, quoting, ordering, invoicing, sending, tracking and editing in one place.</p><p className="mt-3">Use it where the existing app already solves the customer&apos;s problem better than a bespoke build.</p></Card>
  <Card t={t} title="Free tools"><p>If the prospect is not ready to buy, leave the conversation positively. Send the most relevant free tool. It gives them something useful and can still bring them back into the QuoteCore / T3 Labs ecosystem later.</p></Card>
  </div>
  </section>

  <section id="demos" className="py-12 sm:py-16">
  <h2 className="text-3xl font-bold sm:text-4xl">5. Show the closest demo</h2>
  <p className="mt-4 max-w-3xl leading-7" style={{color:t.muted}}>Learn these well enough to screen-share them. The demos are examples of capability, not fixed products. Everything can be rebranded, simplified, expanded or rebuilt around the customer&apos;s own products, pricing and workflow.</p>
  <div className="mt-7 grid gap-4 lg:grid-cols-3">
  {DEMOS.map(([name,href,body])=><div key={name} style={{background:t.surface,borderColor:t.border}} className="card flex flex-col rounded-2xl border p-6"><h3 className="text-lg font-semibold">{name}</h3><p className="mt-3 flex-1 text-sm leading-6" style={{color:t.muted}}>{body}</p><a href={href} target="_blank" rel="noopener noreferrer" style={{color:t.accentInk}} className="mt-5 font-semibold hover:underline">Open demo &rarr;</a></div>)}
  </div>
  <div style={{background:t.accentSoft,borderColor:t.accentInk}} className="mt-5 rounded-2xl border p-5"><p className="font-semibold">Mixed construction business?</p><p className="mt-2 text-sm leading-6" style={{color:t.muted}}>Show whichever demo best matches the workflow you are discussing. Roofing, flooring and cladding can also be shown together to demonstrate how one business could use multiple tailored tools.</p></div>
  </section>

  <section className="py-12 sm:py-16">
  <h2 className="text-3xl font-bold sm:text-4xl">6. Pick the sales angle that matters most</h2>
  <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card t={t} title="AI / Search">&ldquo;How much useful product, pricing and technical information can AI currently get from your business?&rdquo;</Card>
  <Card t={t} title="Faster sales">&ldquo;What happens when a customer wants a useful price now rather than tomorrow?&rdquo;</Card>
  <Card t={t} title="Staff time">&ldquo;What does your team repeatedly calculate, answer or chase that could potentially happen before they get involved?&rdquo;</Card>
  <Card t={t} title="Better enquiries">&ldquo;Could customers send you more complete project information before your team touches the enquiry?&rdquo;</Card>
  <Card t={t} title="Contractors">&ldquo;What if your trade customers used your products and pricing every time they quoted a job?&rdquo;</Card>
  <Card t={t} title="Data advantage">&ldquo;What useful market information could you build from hundreds or thousands of real estimates and quotes?&rdquo;</Card>
  </div>
  <p className="mt-5 font-semibold">Lead with the pain they care about. Do not try to sell every angle at once.</p>
  </section>

  <section className="py-12 sm:py-16">
  <h2 className="text-3xl font-bold sm:text-4xl">7. Advance the opportunity</h2>
  <div className="mt-7 grid gap-4 md:grid-cols-3">
  <Card t={t} title="Introduce it"><p>Get the right prospect into a conversation with T3 Labs. We handle discovery, proposal and closing.</p><p className="mt-3 font-semibold" style={{color:t.text}}>Lower commission / lowest involvement.</p></Card>
  <Card t={t} title="Work it with us"><p>Qualify the opportunity, understand the problems and stay involved while we shape and close the deal together.</p><p className="mt-3 font-semibold" style={{color:t.text}}>Higher commission.</p></Card>
  <Card t={t} title="Sell &amp; close"><p>Own the sales process and hand T3 Labs a confirmed customer ready for delivery.</p><p className="mt-3 font-semibold" style={{color:t.text}}>Highest standard commission.</p></Card>
  </div>
  <div style={{background:t.surfaceAlt,borderColor:t.border}} className="mt-5 rounded-2xl border p-6"><p className="font-semibold">Commercial structures are flexible.</p><p className="mt-2 text-sm leading-6" style={{color:t.muted}}>Commission can be one-off, recurring, a mixture of both, or structured differently for larger opportunities. Customer projects can also range from relatively small focused tools through to major bespoke builds with recurring work.</p></div>
  </section>

  <section className="py-12 sm:py-16">
  <h2 className="text-3xl font-bold sm:text-4xl">Quick objection: &ldquo;We don&apos;t want competitors seeing our pricing.&rdquo;</h2>
  <p className="mt-4 max-w-3xl leading-7" style={{color:t.muted}}>They do not necessarily need to publish every trade rate or their best price. The public layer can use starting prices, indicative pricing, selected products or standard pricing, while logged-in trade/customer pricing remains private.</p>
  <p className="mt-3 max-w-3xl font-semibold">The goal is simply to provide more useful buying information than &ldquo;contact us for pricing&rdquo;.</p>
  </section>

  <section className="py-12 sm:py-20">
  <div style={{background:t.surface,borderColor:t.border}} className="rounded-2xl border p-7 sm:p-10">
  <p className="text-sm font-semibold uppercase tracking-[.15em]" style={{color:t.accentInk}}>The whole job in one line</p>
  <p className="mt-4 text-xl font-semibold leading-8">Find a construction business &rarr; audit the website &rarr; identify a few possible gaps &rarr; start the conversation &rarr; uncover backend friction &rarr; show the closest demo &rarr; bring T3 Labs in or close it yourself.</p>
  <div className="mt-7 flex flex-wrap gap-3"><a href={CUSTOMER_PAGE} target="_blank" rel="noopener noreferrer" style={{background:t.accent,color:t.accentText}} className="solid rounded-full px-7 py-3 font-semibold">Open customer page</a><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{borderColor:t.border}} className="rounded-full border px-7 py-3 font-semibold">Book T3 Labs into a call</a></div>
  </div>
  </section>
  </div>
  </main>
}
