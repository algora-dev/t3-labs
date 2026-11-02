"use client";

import { useState } from "react";
import { CustomProposalModal } from "@/components/custom-proposal-modal";

const BOOKING_URL = "https://calendly.com/insights-t3labs/20-minute-meeting";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0" fill="none">
      <path d="m4 10.5 3.4 3.4L16 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-6 w-6 translate-x-[1px]" fill="currentColor">
      <path d="M6 4.6v10.8c0 .8.9 1.3 1.6.9l8.4-5.4c.6-.4.6-1.4 0-1.8L7.6 3.7c-.7-.4-1.6.1-1.6.9Z" />
    </svg>
  );
}

const HELP_POINTS = [
  "Get more leads and inquiries",
  "Turn more of them into paying jobs",
  "Measure, quote and close faster",
];

export default function CustomProposalPage() {
  const [open, setOpen] = useState(false);
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_76%_6%,rgba(17,19,24,.05),transparent_24rem),radial-gradient(circle_at_14%_36%,rgba(180,185,194,.08),transparent_20rem),#fbfcff] px-5 py-8 text-[#0a0b10] sm:py-12">
      <div className="mx-auto max-w-[980px]">
        <header className="flex items-center justify-between gap-4">
          <a href="https://www.t3labs.tech" aria-label="T3 Labs home">
            {/* eslint-disable-next-line @next/next/no-img-element -- static marketing asset, no optimization needed on a noindex lander */}
            <img src="/assets/t3-labs-black.png" alt="T3 Labs" className="h-auto w-[132px]" />
          </a>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#747a86]">Tailored proposal and price</span>
        </header>

        <section className="mx-auto max-w-[820px] py-10 text-center sm:py-14">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.17em] text-[#5f7000]">What we help with</p>
          <h1 className="mx-auto max-w-[740px] text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
            More leads. More jobs. Faster from measure to close.
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-[1.05rem] leading-7 text-[#606575]">
            However you&apos;re winning work today, there&apos;s usually more you can get from it. We help businesses do three things well.
          </p>
          <ul className="mx-auto mt-8 grid max-w-[760px] gap-2 text-left sm:grid-cols-3">
            {HELP_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5 rounded-xl border border-[#e7e9ef] bg-white px-4 py-3.5 shadow-[0_8px_24px_rgba(24,31,51,.04)]">
                <span className="mt-[1px] grid h-5 w-5 shrink-0 place-items-center rounded-[5px] bg-[#d7ff00] text-[#0a0b10]">
                  <CheckIcon />
                </span>
                <span className="text-[13.5px] font-semibold leading-[1.45]">{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3.5 text-[13px] text-[#858b97]">Plus whatever else is quietly getting in the way.</p>
        </section>

        <section aria-label="How it works video" className="mx-auto max-w-[860px]">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#e7e9ef] bg-[#0a0b10] shadow-[0_30px_90px_rgba(10,11,16,.22)]">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(215,255,0,.09),transparent_52%)]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.03),transparent_40%)]" />
            <div className="absolute inset-0 grid place-items-center px-6">
              <div className="text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10] shadow-[0_14px_44px_rgba(215,255,0,.22)]">
                  <PlayIcon />
                </span>
                <p className="mt-4 text-sm font-semibold text-white/75">Video coming soon</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Choose your next step" className="mx-auto mt-10 grid max-w-[820px] gap-3 sm:grid-cols-2">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[150px] flex-col justify-between gap-5 rounded-xl bg-[#d7ff00] p-5 text-left text-[#0a0b10] no-underline shadow-[0_18px_42px_rgba(10,11,16,.12)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(10,11,16,.16)] sm:p-6"
          >
            <div>
              <p className="m-0 text-[11px] font-bold uppercase tracking-[0.17em] text-[#5f7000]">Talk it through</p>
              <strong className="mt-1.5 block text-[1.15rem] font-semibold leading-[1.15] tracking-[-0.02em]">Book a 25-minute discovery call</strong>
              <p className="mt-1.5 text-sm leading-5 text-[#454918]">Discuss what you need and how we can help. You&apos;ll get a tailored proposal and price.</p>
            </div>
            <span className="flex items-center justify-between gap-2 text-[13px] font-bold">
              Choose a time that suits you
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0a0b10] text-white">
                <ArrowIcon />
              </span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex min-h-[150px] flex-col justify-between gap-5 rounded-xl border border-[#e7e9ef] bg-white p-5 text-left text-[#0a0b10] shadow-[0_10px_32px_rgba(24,31,51,.05)] transition duration-150 hover:-translate-y-0.5 hover:border-[#cfd4dd] hover:shadow-[0_16px_40px_rgba(24,31,51,.08)] sm:p-6"
          >
            <div>
              <p className="m-0 text-[11px] font-bold uppercase tracking-[0.17em] text-[#747a86]">No call needed</p>
              <strong className="mt-1.5 block text-[1.15rem] font-semibold leading-[1.15] tracking-[-0.02em]">Prefer to inquire without a call?</strong>
              <p className="mt-1.5 text-sm leading-5 text-[#606575]">Answer a 60-second questionnaire. Shaun will personally review your answers and website, then send a tailored proposal and price within 48 hours.</p>
            </div>
            <span className="flex items-center justify-between gap-2 text-[13px] font-bold">
              Start the 60-second questionnaire
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#111318] text-white">
                <ArrowIcon />
              </span>
            </span>
          </button>
        </section>

        <p className="mx-auto mt-7 max-w-[620px] text-center text-[14px] leading-6 text-[#252933]">
          <strong className="font-semibold text-[#0a0b10]">Either way, you&apos;ll also get Shaun&apos;s #1 tip for winning more jobs</strong>, from 20+ years in the trade.
        </p>

        <footer className="mt-14 border-t border-[#e7e9ef] pb-4 pt-6 text-center text-[12px] text-[#858b97]">
          T3 Labs · tailored software that wins more work ·{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-[#0a0b10]">Privacy</a>
        </footer>
      </div>
      <CustomProposalModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
