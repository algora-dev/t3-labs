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

export function CustomProposalLander() {
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

        <section className="grid items-center gap-8 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[.17em] text-[#5f7000]">What we help with</p>
            <h1 className="max-w-[560px] text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.04] tracking-[-.04em]">
              More leads. More jobs. Faster from measure to close.
            </h1>
            <p className="mt-6 max-w-[480px] text-[1.02rem] leading-7 text-[#606575]">
              However you&apos;re winning work today, here&apos;s how to get more from it. Watch the short video, then pick the next step that suits you.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e7e9ef] bg-[#0a0b10] shadow-[0_30px_90px_rgba(10,11,16,.22)]">
            <video controls preload="metadata" poster="/assets/custom-proposal/call-video-poster.jpg" className="block aspect-video w-full">
              <source src="/assets/custom-proposal/call-video.mp4" type="video/mp4" />
            </video>
          </div>
        </section>

        <section aria-label="Choose your next step" className="mt-10 grid gap-3 sm:grid-cols-2">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-visit-cta="call"
            className="group flex min-h-[118px] flex-col justify-between gap-5 rounded-xl bg-[#101722] p-5 text-left no-underline shadow-[0_14px_36px_rgba(16,23,34,.18)] transition duration-150 hover:-translate-y-0.5 hover:bg-[#151d2b] sm:p-6"
          >
            <div>
              <p className="m-0 text-[11px] font-bold uppercase tracking-[.17em] text-[#d7ff00]">Talk it through</p>
              <strong className="mt-1.5 block text-[1.15rem] font-semibold leading-[1.15] tracking-[-.02em] text-white">Book a 20-minute call</strong>
              <p className="mt-1.5 text-sm leading-5 text-[#a7aeba]">Discuss what you need and how we can help. You&apos;ll get a tailored proposal and price.</p>
            </div>
            <span className="flex items-center justify-between gap-2 text-[13px] font-bold text-white">
              Choose a time that suits you
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#d7ff00] text-[#0a0b10]">
                <ArrowIcon />
              </span>
            </span>
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            data-visit-cta="questionnaire"
            className="group flex min-h-[118px] flex-col justify-between gap-5 rounded-xl bg-[#101722] p-5 text-left shadow-[0_14px_36px_rgba(16,23,34,.18)] transition duration-150 hover:-translate-y-0.5 hover:bg-[#151d2b] sm:p-6"
          >
            <div>
              <p className="m-0 text-[11px] font-bold uppercase tracking-[.17em] text-[#d7ff00]">No call needed</p>
              <strong className="mt-1.5 block text-[1.15rem] font-semibold leading-[1.15] tracking-[-.02em] text-white">Prefer to inquire without a call?</strong>
              <p className="mt-1.5 text-sm leading-5 text-[#a7aeba]">Answer a 60-second questionnaire. Shaun will personally review your answers and website, then send a tailored proposal and price within 48 hours.</p>
            </div>
            <span className="flex items-center justify-between gap-2 text-[13px] font-bold text-white">
              Start the 60-second questionnaire
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#d7ff00] text-[#0a0b10]">
                <ArrowIcon />
              </span>
            </span>
          </button>
        </section>

        <p className="mx-auto mt-7 max-w-[640px] text-center text-[14px] leading-6 text-[#252933]">
          <strong className="font-semibold text-[#0a0b10]">Either way, you&apos;ll also get Shaun&apos;s #1 tip for winning more jobs</strong>, from 20+ years in the trade. It genuinely works, and it&apos;s worth your time on its own.
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
