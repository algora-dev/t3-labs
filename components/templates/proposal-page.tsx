"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { pluralise, proposalLegalLinks, websitePackageTerms } from "@/lib/website-package-terms";
import type { ProposalConfig } from "@/sites/types";

type ProposalEvent = "proposal_opened" | "video_started" | "video_25_watched" | "video_50_watched" | "video_90_watched" | "concept_gallery_viewed" | "comparison_viewed" | "offer_viewed" | "launch_cta_clicked" | "launch_email_requested" | "calendly_clicked" | "interactive_preview_requested" | "proposal_closed" | "do_not_contact_selected";

const opportunityIcons = [
  "/assets/t3-icons/magnifying-glass.png",
  "/assets/t3-icons/camera.png",
  "/assets/t3-icons/clipboard-and-checklist.png",
];

const improvementIcons = [
  "/assets/t3-icons/desktop-monitor.png",
  "/assets/t3-icons/clipboard-and-checklist.png",
  "/assets/t3-icons/star.png",
  "/assets/t3-icons/mobile-phone.png",
  "/assets/t3-icons/speech-bubble.png",
  "/assets/t3-icons/map-pin.png",
];

function track(proposal: ProposalConfig, event: ProposalEvent) {
  window.dispatchEvent(new CustomEvent("t3:proposal-event", {
    detail: {
      event,
      prospect_id: proposal.prospectId,
      company_slug: proposal.slug,
      proposal_path: window.location.pathname,
    },
  }));
}

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none"><path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function Lock() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none"><rect x="4.5" y="8" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M7 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

function Check({ muted = false }: { muted?: boolean }) {
  return <span aria-hidden="true" className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-black ${muted ? "bg-[#aeb3bd] text-white" : "bg-[#d7ff00] text-[#0a0b10]"}`}>{"\u2713"}</span>;
}

function publicCompanyName(companyName: string) {
  return /\[[^\]]+\]/.test(companyName) ? "this business" : companyName;
}

function launchEmailHref(proposal: ProposalConfig) {
  if (proposal.actions.launchEmailUrl) return proposal.actions.launchEmailUrl;

  const subject = encodeURIComponent(`Website launch request - ${proposal.companyName}`);
  const body = encodeURIComponent(
    `Hi Cece,\n\nI'd like to launch the website concept for ${proposal.companyName}.\n\nPlease let me know the next steps.\n`,
  );

  return `mailto:cece@t3labs.co.uk?subject=${subject}&body=${body}`;
}

function IconTile({ children }: { children: React.ReactNode }) {
  return <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#e3e8bc] bg-[#fbfff0] text-lg text-[#758300]">{children}</span>;
}

function Button({ children, onClick, href, secondary = false, className = "" }: { children: React.ReactNode; onClick?: () => void; href?: string; secondary?: boolean; className?: string }) {
  const styles = `inline-flex min-h-[52px] items-center justify-center gap-3 rounded-lg px-[22px] py-3.5 text-[15px] font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 ${secondary ? "border border-[#dfe2e9] bg-white text-[#0a0b10] shadow-[0_5px_16px_rgba(20,25,40,0.04)]" : "bg-gradient-to-br from-[#050608] to-[#242832] text-white shadow-[0_14px_30px_rgba(10,11,16,0.16)]"} ${className}`;
  return href ? <a className={styles} href={href} onClick={onClick}>{children}</a> : <button className={styles} type="button" onClick={onClick}>{children}</button>;
}

function Walkthrough({ proposal }: { proposal: ProposalConfig }) {
  const [started, setStarted] = useState(false);
  const [milestones, setMilestones] = useState<number[]>([]);
  const { video } = proposal;

  const trackProgress = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const { currentTime, duration } = event.currentTarget;
    if (!duration) return;
    const percentage = (currentTime / duration) * 100;
    ([25, 50, 90] as const).forEach((milestone) => {
      if (percentage >= milestone && !milestones.includes(milestone)) {
        setMilestones((current) => [...current, milestone]);
        track(proposal, `video_${milestone}_watched` as ProposalEvent);
      }
    });
  };

  if (started && video.url) {
    return video.provider === "self-hosted"
      ? <video className="aspect-video w-full rounded-lg bg-black" controls autoPlay poster={video.posterImage.src} onTimeUpdate={trackProgress}><source src={video.url} />{video.transcriptUrl ? <track kind="captions" src={video.transcriptUrl} srcLang="en" label="English" /> : null}</video>
      : <iframe className="aspect-video w-full rounded-lg bg-black" src={video.url} title={`${proposal.companyName} website walkthrough`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />;
  }

  return (
    <button type="button" className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-[#111318] text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#d7ff00]" onClick={() => { if (video.url) { track(proposal, "video_started"); setStarted(true); } }} aria-label={video.url ? `Play the ${proposal.companyName} website walkthrough` : "Walkthrough video is being prepared"}>
      <Image src={video.posterImage.src} alt={video.posterImage.alt} fill priority sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.01]" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/10" />
      <span className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 pl-1 text-xl text-[#9caf00] shadow-xl transition group-hover:scale-105">{"\u25b6"}</span></span>
      <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white"><span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d7ff00]">{video.url ? "Private walkthrough" : "Local draft"}</span><span className="mt-1 block text-xs font-medium sm:text-sm">{video.url ? "Play recorded concept tour" : "Video to be added before publication"}</span></span>{video.durationLabel ? <span className="rounded-full bg-black/50 px-2 py-1 text-[10px] font-medium">{video.durationLabel}</span> : null}</span>
    </button>
  );
}

function Dialog({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0a0b10]/65 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section role="dialog" aria-modal="true" aria-labelledby="proposal-dialog-title" className="w-full max-w-lg rounded-2xl border border-white/70 bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><h2 id="proposal-dialog-title" className="proposal-section-title">{title}</h2><button type="button" onClick={onClose} autoFocus className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#e7e9ef] text-xl" aria-label="Close dialog">{"\u00d7"}</button></div><div className="mt-5">{children}</div></section></div>;
}

export function ProposalPage({ proposal }: { proposal: ProposalConfig }) {
  const [dialog, setDialog] = useState<"launch" | "remove" | null>(null);
  const [removalChoice, setRemovalChoice] = useState<"remove" | "suppress" | null>(null);
  const draft = proposal.status === "draft";
  const revisionRounds = proposal.package.revisionRounds ?? websitePackageTerms.revisionRounds;
  const includedHostingMonths = proposal.package.includedHostingMonths ?? websitePackageTerms.includedHostingMonths;
  const callMinutes = websitePackageTerms.callMinutes;
  const companyName = publicCompanyName(proposal.companyName);
  const emailHref = launchEmailHref(proposal);
  const copy = proposal.pageCopy ?? {};
  const strengths = (proposal.strengths ?? [])
    .filter((strength) => strength.title.trim() && strength.description.trim())
    .slice(0, 3);
  const launchButtonLabel = copy.launchButtonLabel ?? "I’m interested in getting this live";
  const includedItems = [
    ...proposal.package.includedItems.slice(0, 7),
    `${revisionRounds} ${pluralise(revisionRounds, "revision round")} and ${includedHostingMonths} months hosting`,
  ];

  useEffect(() => {
    track(proposal, "proposal_opened");
  }, [proposal]);

  const openLaunch = () => {
    track(proposal, "launch_cta_clicked");
    if (proposal.actions.launchActionUrl) window.location.href = proposal.actions.launchActionUrl;
    else setDialog("launch");
  };

  const saveRemoval = (choice: "remove" | "suppress") => {
    track(proposal, choice === "suppress" ? "do_not_contact_selected" : "proposal_closed");
    localStorage.setItem(`t3-proposal:${proposal.prospectId}:suppression`, choice);
    // Notify Cece so the closure is recorded server-side rather than lost in browser state
    try {
      fetch("/api/proposal-closed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: proposal.companyName,
          prospectId: proposal.prospectId,
          choice,
          proposalUrl: window.location.href,
        }),
      }).catch((err) => console.error("Proposal closed notification failed", err));
    } catch (err) {
      console.error("Proposal closed notification failed", err);
    }
    setRemovalChoice(choice);
  };

  return (
    <div className="proposal-page min-h-screen bg-[radial-gradient(circle_at_85%_6%,rgba(215,255,0,0.07),transparent_20rem),#fbfcff] text-[#0a0b10]">
      {draft ? <div className="bg-[#d7ff00] px-4 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em]">Local draft - publication safeguards are active</div> : null}
      <div className="mx-auto w-[min(1180px,calc(100%-28px))] py-4 sm:w-[min(1180px,calc(100%-40px))] sm:py-6">
        <header className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-[#e7e9ef] bg-white px-4 shadow-[0_8px_28px_rgba(24,31,51,0.06)] sm:px-6">
          <a href="https://www.t3labs.tech/" aria-label="T3 Labs home" className="relative h-8 w-24 shrink-0"><Image src="/assets/t3-labs-black.png" alt="T3 Labs" fill sizes="96px" className="object-contain object-left" priority /></a>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#424657]"><Lock /><span>Private website concept</span></div>
          <a href={proposal.actions.calendlyUrl} className="hidden text-sm font-semibold text-[#252933] hover:underline sm:block" onClick={() => track(proposal, "calendly_clicked")}>Book a {callMinutes}-minute call</a>
        </header>

        <main className="mt-6 grid gap-6">
          <section className="grid gap-7 px-1 py-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:px-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3f4451]">{proposal.hero.overline}<span className="mt-1 block text-[#809100]">{proposal.companyName}</span></p>
              <h1 className="proposal-display mt-5 max-w-xl">{proposal.hero.headline}</h1>
              <div className="mb-7 mt-7 h-1 w-8 rounded-full bg-[#d7ff00]" />
              <p className="max-w-xl text-[clamp(1.05rem,2vw,1.2rem)] leading-[1.65] text-[#3e4352]">{proposal.hero.supportingCopy}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="#walkthrough">{"\u25b6"} Watch the quick walkthrough</Button><Button href="#package" secondary onClick={() => track(proposal, "offer_viewed")}>See what&apos;s included</Button></div>
              <p className="flex items-center gap-2 text-xs font-medium text-[#707582]" style={{ marginTop: "2.25rem" }}><Lock />{proposal.hero.privacyNote}</p>
            </div>
            <div id="walkthrough">
              <div className="rounded-xl border border-[#e7e9ef] bg-white p-2 shadow-[0_18px_50px_rgba(24,31,51,0.12)]"><Walkthrough proposal={proposal} /></div>
              <p className="mt-4 text-xs leading-5 text-[#707582]">This is a recorded walkthrough of the working website concept we built for {proposal.companyName}. It is not live or publicly available.</p>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4">{proposal.outcomes.map((outcome) => <div key={outcome} className="flex items-start gap-2 text-sm font-medium leading-5"><Check />{outcome}</div>)}</div>
            </div>
          </section>

          <div>
            <section className="rounded-xl border border-[#e7e9ef] bg-white p-5 sm:p-6">
              <h2 className="proposal-section-title">{copy.conceptHeading ?? "See the concept in detail"}</h2>
              <div className="relative mt-4">
                <figure className="min-w-0 overflow-hidden rounded-lg border border-[#dfe2e9] bg-[#111318] shadow-md"><Image src={proposal.conceptImages.desktopHero.src} alt={proposal.conceptImages.desktopHero.alt} width={1440} height={960} className="h-auto w-full" /></figure>
                <figure className="hidden w-full max-w-[180px] overflow-hidden rounded-[1.25rem] border-[4px] border-[#111318] bg-white shadow-xl lg:absolute lg:bottom-6 lg:right-6 lg:block lg:w-[16%] lg:max-w-[165px]"><Image src={proposal.conceptImages.mobileHero.src} alt={proposal.conceptImages.mobileHero.alt} width={390} height={844} className="h-auto w-full" /><figcaption className="sr-only">Mobile concept view</figcaption></figure>
              </div>
            </section>

          </div>

  {proposal.comparison ? <section className="rounded-xl border border-[#e7e9ef] bg-white p-6 shadow-[0_10px_32px_rgba(24,31,51,0.05)] sm:p-8" onMouseEnter={() => track(proposal, "comparison_viewed")}><div className="max-w-2xl"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#758300]">Website comparison</p><h2 className="proposal-section-title mt-2">{copy.comparisonHeading ?? "Current website and proposed concept"}</h2><p className="proposal-body mt-3">{copy.comparisonIntro ?? `A fair side-by-side view of the current public website and the private concept created for ${proposal.companyName}.`}</p></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><article className="rounded-xl border border-[#e1e4ea] bg-[#f8f9fb] p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm font-medium"><span className="h-3 w-3 rounded-full bg-[#aeb3bd]" />{proposal.comparison.currentLabel ?? "Current website"}</p><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#777d89]">{proposal.comparison.currentBadge ?? "As captured"}</span></div>{proposal.comparison.currentSiteImage ? <Image src={proposal.comparison.currentSiteImage.src} alt={proposal.comparison.currentSiteImage.alt} width={1440} height={960} className="mt-4 aspect-[16/10] w-full rounded-lg border border-[#dfe2e9] object-cover object-top shadow-sm" /> : <div className="mt-4 grid aspect-[16/10] place-items-center rounded-lg border border-dashed border-[#cfd3dc] bg-white px-3 text-center text-[10px] font-medium text-[#777d89]">Current-site screenshot pending verified input</div>}<ul className="mt-5 grid gap-3">{proposal.comparison.currentPoints.map((point) => <li key={point} className="flex gap-3 text-[15px] leading-6 text-[#606575]"><Check muted />{point}</li>)}</ul></article><article className="relative min-w-0 overflow-hidden rounded-xl border border-[#d8e6a2] bg-[#fcfff4] p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm font-medium"><span className="h-3 w-3 rounded-full bg-[#d7ff00]" />{proposal.comparison.proposedLabel ?? "New website concept"}</p><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#758300]">{proposal.comparison.proposedBadge ?? "Private concept"}</span></div><div className="relative mt-4"><Image src={proposal.comparison.proposedImage.src} alt={proposal.comparison.proposedImage.alt} width={1440} height={960} className="aspect-[16/10] w-full rounded-lg border border-[#dfe2e9] object-cover object-top shadow-sm" />{proposal.comparison.proposedSupportingImages?.length ? <div className="hidden min-w-0 justify-items-end gap-3 lg:pointer-events-none lg:absolute lg:bottom-0 lg:right-2 lg:z-10 lg:grid lg:w-[30%] lg:max-w-[180px]">{proposal.comparison.proposedSupportingImages.map((image) => <figure key={image.src} className="w-full max-w-[220px] min-w-0 overflow-hidden rounded-md bg-[#07090d] p-1 shadow-[0_14px_32px_rgba(10,11,16,0.28)]"><Image src={image.src} alt={image.alt} width={1440} height={1668} className={`${image.presentation === "natural" ? "h-auto" : "aspect-[3/5] object-cover object-top"} w-full max-w-full rounded border border-white/10`} /></figure>)}</div> : null}</div><ul className="mt-5 grid gap-3">{proposal.comparison.proposedPoints.map((point, index) => <li key={point} className={`flex gap-3 text-[15px] leading-6 text-[#606575] ${index === 2 ? "mt-4" : ""}`}><Check />{point}</li>)}</ul></article></div></section> : null}

          {proposal.conceptImages.supporting?.length ? <section className="rounded-xl border border-[#e7e9ef] bg-white p-5 sm:p-6" onMouseEnter={() => track(proposal, "concept_gallery_viewed")}><div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#758300]">Concept views</p><h2 className="proposal-section-title mt-1">{copy.supportingViewsHeading ?? "Designed for useful project enquiries"}</h2></div><p className="text-sm text-[#606575]">{copy.supportingViewsNote ?? "Private concept views, not a public website."}</p></div><div className="mt-4 grid gap-4 sm:grid-cols-2">{proposal.conceptImages.supporting.map((image) => <figure key={image.src} className="overflow-hidden rounded-lg border border-[#dfe2e9] bg-[#f7f8fa]"><Image src={image.src} alt={image.alt} width={1440} height={960} className="h-auto w-full" /></figure>)}</div></section> : null}

          {strengths.length ? <section className="rounded-xl border border-[#dfe8bb] bg-[#fcfff4] p-5 shadow-[0_10px_32px_rgba(24,31,51,0.04)] sm:p-7"><div className="max-w-2xl"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#758300]">A strong starting point</p><h2 className="proposal-section-title mt-2">What {proposal.companyName} is already doing well</h2><p className="proposal-body mt-3">The new concept builds on strengths the business already has.</p></div><div className="mt-6 grid gap-4 md:grid-cols-3">{strengths.map((strength) => <article key={strength.title} className="rounded-lg border border-[#dfe8bb] bg-white p-5"><Check /><h3 className="mt-4 text-[15px] font-medium leading-5">{strength.title}</h3><p className="mt-2 text-[15px] leading-6 text-[#606575]">{strength.description}</p></article>)}</div></section> : null}

          <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <section className="rounded-xl border border-[#e7e9ef] bg-white p-5 sm:p-6"><h2 className="proposal-card-title">{copy.findingsHeading ?? "Three opportunities we noticed"}</h2><div className="mt-5 grid gap-5">{proposal.findings.map((finding, index) => <article key={finding.title} className="flex items-start gap-4"><IconTile><Image src={opportunityIcons[index]} alt="" width={22} height={22} className="h-5 w-5 object-contain" /></IconTile><div><h3 className="text-[15px] font-medium leading-5">{finding.title}</h3><p className="mt-1 text-[15px] leading-6 text-[#606575]">{finding.description}</p></div></article>)}</div></section>
            <section className="rounded-xl border border-[#e7e9ef] bg-white p-5 sm:p-6"><h2 className="proposal-card-title">{copy.improvementsHeading ?? "What this concept improves"}</h2><div className="mt-5 grid overflow-hidden rounded-lg border border-[#e7e9ef] sm:grid-cols-3">{proposal.improvements.map((improvement, index) => <article key={improvement.title} className="flex min-h-28 gap-4 border-b border-[#e7e9ef] p-4 sm:border-r"><IconTile><Image src={improvementIcons[index]} alt="" width={22} height={22} className="h-5 w-5 object-contain" /></IconTile><div><h3 className="text-[15px] font-medium leading-5">{improvement.title}</h3><p className="mt-1 text-[15px] leading-6 text-[#606575]">{improvement.description}</p></div></article>)}</div></section>
          </div>

          <section id="package" className="rounded-xl border border-[#e1e4ea] bg-white p-6 shadow-[0_10px_32px_rgba(24,31,51,0.05)] sm:p-8" onMouseEnter={() => track(proposal, "offer_viewed")}>
            <div className="proposal-package-grid gap-0 overflow-hidden">
              <div className="py-2 md:pr-7 lg:pr-8"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#758300]">{copy.packageLabel ?? "Website launch package"}</p><h2 className="proposal-package-heading mt-3">{copy.packageHeading ?? "Launch this website for"} <span className="proposal-package-price">{proposal.package.priceLabel}</span></h2>{proposal.package.vatLabel ? <p className="mt-1 text-sm font-medium text-[#777d89]">{proposal.package.vatLabel}</p> : null}<div className="mt-5 h-1 w-8 rounded-full bg-[#d7ff00]" /><div className="proposal-body mt-5 grid gap-3">{copy.packageIntro ? <p>{copy.packageIntro}</p> : <><p>The working website concept shown in your walkthrough has already been built for <strong className="font-medium text-[#0a0b10]">{companyName}</strong>.</p><p>If you decide to proceed, we will apply the agreed revisions, connect your domain and enquiry form, complete the final checks and prepare it for launch.</p></>}</div></div>
              <div className="grid content-center border-y border-[#e1e4ea] py-6 md:border-x md:border-y-0 md:px-7 md:py-2 lg:px-9"><p className="proposal-card-title">What&apos;s included</p><ul className="mt-7 grid gap-x-12 gap-y-7 sm:grid-cols-2">{includedItems.map((item) => <li key={item} className="flex items-start gap-5 text-[15px] font-medium leading-6 text-[#424657]"><Check />{item}</li>)}</ul></div>
              <div className="grid content-center gap-4 py-6 md:pl-7 md:py-2 lg:pl-9"><Button onClick={openLaunch} className="min-h-20 !justify-between !rounded-xl !px-6 !py-5 !text-left !text-base"><span>{launchButtonLabel}</span><Arrow /></Button><Button href={proposal.actions.calendlyUrl} secondary onClick={() => track(proposal, "calendly_clicked")} className="min-h-20 !justify-between !rounded-xl !px-6 !py-5 !text-left !text-base">Book a {callMinutes}-minute call <Arrow /></Button>{proposal.actions.interactivePreviewRequestUrl ? <Button href={proposal.actions.interactivePreviewRequestUrl} secondary onClick={() => track(proposal, "interactive_preview_requested")}>Ask to click through the concept</Button> : null}<div className="mt-2 border-t border-[#e1e4ea] pt-5"><p className="flex items-center gap-4 text-[15px] leading-6 text-[#707582]"><span className="flex h-9 w-9 shrink-0 items-center justify-center [&>svg]:h-6 [&>svg]:w-6"><Lock /></span><span>Nothing is charged when you click. We&apos;ll talk through the details and agree everything first.</span></p></div></div>
            </div>
          </section>

          <section id="questions" className="px-2 py-2"><h2 className="proposal-card-title">Questions you might have</h2><div className="mt-4 grid gap-x-6 md:grid-cols-2">{proposal.faq.map((item) => <details key={item.question} className="group border-t border-[#e2e5eb] py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-medium marker:hidden"><span>{item.question}</span><span aria-hidden="true" className="text-base transition group-open:rotate-45">+</span></summary><p className="proposal-body pt-3">{item.answer}</p></details>)}</div></section>

          <section className="flex flex-col gap-5 rounded-xl bg-gradient-to-r from-[#08090c] to-[#1c2027] p-6 text-white sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d7ff00]">{copy.finalEyebrow ?? "Your next step"}</p><h2 className="mt-2 text-[clamp(1.7rem,3vw,2.25rem)] font-medium leading-[1.12]">{copy.finalHeading ?? `Ready to use this concept for ${proposal.companyName}?`}</h2><p className="mt-3 text-base leading-7 text-white/68">{copy.finalBody ?? "We will apply the agreed revisions, connect the domain and enquiry form, complete the final checks and prepare the website for launch."}</p></div><div className="grid shrink-0 gap-2"><Button onClick={openLaunch} className="!bg-white !from-white !to-white !text-[#0a0b10]">{launchButtonLabel} <Arrow /></Button><button type="button" className="text-sm font-medium text-white/60 underline" onClick={() => setDialog("remove")}>Close my private proposal</button></div></section>
        </main>

        <footer className="flex flex-col gap-5 px-2 py-6 text-sm text-[#606575]"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><a href="https://www.t3labs.tech/" aria-label="T3 Labs home" className="relative h-7 w-20"><Image src="/assets/t3-labs-black.png" alt="T3 Labs" fill sizes="80px" className="object-contain object-left" /></a><span>Websites that work.</span></div><span>{"\u00a9"} {new Date().getFullYear()} T3 Labs</span></div><nav aria-label="Proposal footer" className="flex flex-wrap gap-x-5 gap-y-2">{proposalLegalLinks.map((link) => link.href === "#request-removal" ? <button key={link.label} type="button" className="text-left hover:text-[#0a0b10]" onClick={() => setDialog("remove")}>{link.label}</button> : link.href === "#contact-t3-labs" ? <a key={link.label} href="https://www.t3labs.tech/#send-message" className="hover:text-[#0a0b10]">{link.label}</a> : <a key={link.label} href={link.href} className="hover:text-[#0a0b10]">{link.label}</a>)}</nav><p className="max-w-4xl text-xs leading-5 text-[#777d89]">T3 Labs is a trading name of T3 Play Limited, registered in New Zealand.</p></footer>
      </div>

      {dialog === "launch" ? <Dialog title="Ready to get this website live?" onClose={() => setDialog(null)}><p className="proposal-body">Nothing is charged when you click. Choose the easiest way to get in touch and we&apos;ll talk through the details and agree everything first.</p><div className="mt-6 grid gap-3"><Button href={emailHref} onClick={() => track(proposal, "launch_email_requested")}>Email T3 Labs about launch <Arrow /></Button><Button href={proposal.actions.calendlyUrl} secondary onClick={() => track(proposal, "calendly_clicked")}>Book a {callMinutes}-minute call <Arrow /></Button></div></Dialog> : null}
      {dialog === "remove" ? <Dialog title="Close this private proposal" onClose={() => setDialog(null)}>{removalChoice ? <div role="status" className="rounded-xl bg-[#f6f8fc] p-5 leading-7 text-[#424657]">Thanks - we&apos;ve noted your choice and will close this proposal out. If you selected not to be contacted, we won&apos;t reach out again.</div> : <><p className="leading-7 text-[#606575]">Choose how you would like this proposal handled. We&apos;ll be notified and can close this out accordingly.</p><div className="mt-6 grid gap-3"><Button secondary onClick={() => saveRemoval("remove")}>Close and remove this proposal</Button><Button secondary onClick={() => saveRemoval("suppress")}>Please do not contact me again</Button></div></>}</Dialog> : null}
    </div>
  );
}
