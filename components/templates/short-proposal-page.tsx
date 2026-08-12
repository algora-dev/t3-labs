"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProposalConfig } from "@/sites/types";
import { proposalLegalLinks } from "@/lib/website-package-terms";

/**
 * SHORT PROPOSAL PAGE
 *
 * A separate, shortened renderer for the Short Proposal Template.
 * Keeps only the hero (up to the "private and not publicly listed" note) and
 * the final CTA block. Does NOT use or modify the shared proposal-page.tsx.
 */

type ShortProposalEvent =
  | "proposal_opened"
  | "video_started"
  | "launch_cta_clicked"
  | "launch_email_requested"
  | "calendly_clicked"
  | "proposal_closed"
  | "do_not_contact_selected";

function track(proposal: ProposalConfig, event: ShortProposalEvent) {
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

function Button({ children, onClick, href, secondary = false, className = "" }: { children: React.ReactNode; onClick?: () => void; href?: string; secondary?: boolean; className?: string }) {
  const styles = `inline-flex min-h-[52px] items-center justify-center gap-3 rounded-lg px-[22px] py-3.5 text-[15px] font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 ${secondary ? "border border-[#dfe2e9] bg-white text-[#0a0b10] shadow-[0_5px_16px_rgba(20,25,40,0.04)]" : "bg-gradient-to-br from-[#050608] to-[#242832] text-white shadow-[0_14px_30px_rgba(10,11,16,0.16)]"} ${className}`;
  return href ? <a className={styles} href={href} onClick={onClick}>{children}</a> : <button className={styles} type="button" onClick={onClick}>{children}</button>;
}

function Dialog({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0a0b10]/65 p-4" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section role="dialog" aria-modal="true" aria-labelledby="proposal-dialog-title" className="w-full max-w-lg rounded-2xl border border-white/70 bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><h2 id="proposal-dialog-title" className="proposal-section-title">{title}</h2><button type="button" onClick={onClose} autoFocus className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#e7e9ef] text-xl" aria-label="Close dialog">{"\u00d7"}</button></div><div className="mt-5">{children}</div></section></div>;
}

function ShortWalkthrough({ proposal }: { proposal: ProposalConfig }) {
  const [started, setStarted] = useState(false);
  const { video } = proposal;

  if (started && video.url) {
    return <video className="aspect-video w-full rounded-lg bg-black" controls autoPlay poster={video.posterImage.src}><source src={video.url} /></video>;
  }

  return (
    <button type="button" className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-[#111318] text-left focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#d7ff00]" onClick={() => { if (video.url) { track(proposal, "video_started"); setStarted(true); } }} aria-label={`Play the ${proposal.companyName} website walkthrough`}>
      <Image src={video.posterImage.src} alt={video.posterImage.alt} fill priority sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.01]" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/10" />
      <span className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 pl-1 text-xl text-[#9caf00] shadow-xl transition group-hover:scale-105">{"\u25b6"}</span></span>
      <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white"><span><span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d7ff00]">Private walkthrough</span><span className="mt-1 block text-xs font-medium sm:text-sm">Play recorded concept tour</span></span></span>
    </button>
  );
}

export function ShortProposalPage({ proposal }: { proposal: ProposalConfig }) {
  const [dialog, setDialog] = useState<"launch" | "remove" | null>(null);
  const [removalChoice, setRemovalChoice] = useState<"remove" | "suppress" | null>(null);
  const draft = proposal.status === "draft";
  const companyName = /\[[^\]]+\]/.test(proposal.companyName) ? "this business" : proposal.companyName;
  const copy = proposal.pageCopy ?? {};
  const launchButtonLabel = copy.launchButtonLabel ?? "I'm interested in getting this live";

  const emailHref =
    proposal.actions.launchEmailUrl ||
    `mailto:cece@t3labs.co.uk?subject=${encodeURIComponent(`Website launch request - ${proposal.companyName}`)}&body=${encodeURIComponent(`Hi Cece,\n\nI'd like to discuss launching the website concept for ${proposal.companyName}.\n`)}`;

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
      {draft ? <div className="bg-[#d7ff00] px-4 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em]">Local draft</div> : null}
      <div className="mx-auto w-[min(1180px,calc(100%-28px))] py-4 sm:w-[min(1180px,calc(100%-40px))] sm:py-6">
        <header className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-[#e7e9ef] bg-white px-4 shadow-[0_8px_28px_rgba(24,31,51,0.06)] sm:px-6">
          <a href="https://www.t3labs.tech/" aria-label="T3 Labs home" className="relative h-8 w-24 shrink-0"><Image src="/assets/t3-labs-black.png" alt="T3 Labs" fill sizes="96px" className="object-contain object-left" priority /></a>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#424657]"><Lock /><span>Private website concept</span></div>
          <a href={proposal.actions.calendlyUrl} className="hidden text-sm font-semibold text-[#252933] hover:underline sm:block" onClick={() => track(proposal, "calendly_clicked")}>Book a call</a>
        </header>

        <main className="mt-6 grid gap-6">
          {/* HERO (kept, up to the private note) */}
          <section className="grid gap-7 px-1 py-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:px-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3f4451]">{proposal.hero.overline}<span className="mt-1 block text-[#809100]">{proposal.companyName}</span></p>
              <h1 className="proposal-display mt-5 max-w-xl">{proposal.hero.headline}</h1>
              <div className="mb-7 mt-7 h-1 w-8 rounded-full bg-[#d7ff00]" />
              <p className="max-w-xl text-[clamp(1.05rem,2vw,1.2rem)] leading-[1.65] text-[#3e4352]">{proposal.hero.supportingCopy}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button href="#walkthrough">{"\u25b6"} Watch the quick walkthrough</Button></div>
              <p className="flex items-center gap-2 text-xs font-medium text-[#707582]" style={{ marginTop: "2.25rem" }}><Lock />{proposal.hero.privacyNote}</p>
            </div>
            <div id="walkthrough">
              <div className="rounded-xl border border-[#e7e9ef] bg-white p-2 shadow-[0_18px_50px_rgba(24,31,51,0.12)]"><ShortWalkthrough proposal={proposal} /></div>
              <p className="mt-4 text-xs leading-5 text-[#707582]">This is a recorded walkthrough of the working website concept we built for {proposal.companyName}. It is not live or publicly available.</p>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-3">{proposal.outcomes.map((outcome) => <div key={outcome} className="flex items-start gap-2 text-sm font-medium leading-5"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#d7ff00] text-[10px] font-black text-[#0a0b10]">{"\u2713"}</span>{outcome}</div>)}</div>
            </div>
          </section>

          {/* ALL MIDDLE SECTIONS REMOVED - hero flows straight to final CTA */}

          {/* FINAL CTA (kept) */}
          <section className="flex flex-col gap-5 rounded-xl bg-gradient-to-r from-[#08090c] to-[#1c2027] p-6 text-white sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d7ff00]">{copy.finalEyebrow ?? "Your next step"}</p><h2 className="mt-2 text-[clamp(1.7rem,3vw,2.25rem)] font-medium leading-[1.12]">{copy.finalHeading ?? `Ready to use this concept for ${companyName}?`}</h2><p className="mt-3 text-base leading-7 text-white/68">{copy.finalBody ?? "We will apply the agreed revisions, connect the domain and enquiry form, complete the final checks and prepare the website for launch."}</p></div><div className="grid shrink-0 gap-2"><Button onClick={openLaunch} className="!bg-white !from-white !to-white !text-[#0a0b10]">{launchButtonLabel} <Arrow /></Button><button type="button" className="text-sm font-medium text-white/60 underline" onClick={() => setDialog("remove")}>Close my private proposal</button></div></section>
        </main>

        <footer className="flex flex-col gap-5 px-2 py-6 text-sm text-[#606575]"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><a href="https://www.t3labs.tech/" aria-label="T3 Labs home" className="relative h-7 w-20"><Image src="/assets/t3-labs-black.png" alt="T3 Labs" fill sizes="80px" className="object-contain object-left" /></a><span>Websites that work.</span></div><span>{"\u00a9"} {new Date().getFullYear()} T3 Labs</span></div><nav aria-label="Proposal footer" className="flex flex-wrap gap-x-5 gap-y-2">{proposalLegalLinks.map((link) => link.href === "#request-removal" ? <button key={link.label} type="button" className="text-left hover:text-[#0a0b10]" onClick={() => setDialog("remove")}>{link.label}</button> : link.href === "#contact-t3-labs" ? <a key={link.label} href="https://www.t3labs.tech/#send-message" className="hover:text-[#0a0b10]">{link.label}</a> : <a key={link.label} href={link.href} className="hover:text-[#0a0b10]">{link.label}</a>)}</nav><p className="max-w-4xl text-xs leading-5 text-[#777d89]">T3 Labs is a trading name of T3 Play Limited, registered in New Zealand.</p></footer>
      </div>

      {dialog === "launch" ? <Dialog title="Ready to get this website live?" onClose={() => setDialog(null)}><p className="proposal-body">Nothing is charged when you click. Choose the easiest way to get in touch and we&apos;ll talk through the details and agree everything first.</p><div className="mt-6 grid gap-3"><Button href={emailHref} onClick={() => track(proposal, "launch_email_requested")}>Email T3 Labs about launch <Arrow /></Button><Button href={proposal.actions.calendlyUrl} secondary onClick={() => track(proposal, "calendly_clicked")}>Book a call <Arrow /></Button></div></Dialog> : null}
      {dialog === "remove" ? <Dialog title="Close this private proposal" onClose={() => setDialog(null)}>{removalChoice ? <div role="status" className="rounded-xl bg-[#f6f8fc] p-5 leading-7 text-[#424657]">Thanks - we&apos;ve noted your choice and will close this proposal out. If you selected not to be contacted, we won&apos;t reach out again.</div> : <><p className="leading-7 text-[#606575]">Choose how you would like this proposal handled. We&apos;ll be notified and can close this out accordingly.</p><div className="mt-6 grid gap-3"><Button secondary onClick={() => saveRemoval("remove")}>Close and remove this proposal</Button><Button secondary onClick={() => saveRemoval("suppress")}>Please do not contact me again</Button></div></>}</Dialog> : null}
    </div>
  );
}
