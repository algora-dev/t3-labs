"use client";

/**
 * Homepage mission statement teaser — sits between the animated hero and the
 * outcomes animation. Collapsed by default: bold opener + one supporting line,
 * expands to the full T3 Labs mission (version 2 wording).
 */

import { useState } from "react";

export default function MissionStatement() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="mission"
      aria-labelledby="t3-mission-title"
      className="w-[min(1180px,calc(100%-40px))] mx-auto mt-10 mb-10 scroll-mt-24"
    >
      <div className="rounded-2xl border border-[#d7ff00]/20 bg-gradient-to-br from-[#0f1118] to-[#0a0b10] px-8 py-8 sm:px-12 sm:py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff00]">
          Our mission
        </p>
        <h2
          id="t3-mission-title"
          className="mt-4 text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-tight tracking-tight text-white"
        >
          Easier to find. Easier to buy from. Easier to run.
        </h2>
        <p
          className={`mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/60 transition-all duration-300 ${open ? "max-h-0 -mt-2 overflow-hidden opacity-0" : "max-h-16 opacity-100"}`}
        >
          Most businesses compete with the same websites, content and marketing
          tactics. We help you stand out.
        </p>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="t3-mission-full"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d7ff00]/40 px-5 py-2 text-xs font-semibold text-[#d7ff00] transition hover:border-[#d7ff00] hover:bg-[#d7ff00]/10"
        >
          {open ? "Hide our mission" : "Read our mission"}
          <span aria-hidden="true">{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <div
            id="t3-mission-full"
            className="mx-auto mt-8 max-w-[760px] rounded-xl border border-white/10 bg-black/30 p-6 text-left sm:p-8"
          >
            <p className="mission-reveal text-sm leading-7 text-white/70">
              Most businesses compete with the same websites, content and
              marketing tactics. We help you stand out.
            </p>
            <p className="mt-4 text-base font-medium leading-7 text-white">
              T3 Labs helps you stand out by getting more of the right people
              to your business, helping them get answers and take action
              without waiting for your team, and reducing the work required
              behind the scenes.
            </p>
            <p className="mt-4 text-sm leading-7 text-white/70">
              As search evolves into AI-driven conversations, we help make your
              business part of those answers — using tools, data and digital
              experiences built around your business and difficult for
              competitors to replicate.
            </p>
            <p className="mt-6 text-base font-semibold text-[#d7ff00]">
              More customers. Better enquiries. Less work.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
