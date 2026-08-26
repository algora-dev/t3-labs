"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function DemoSiteStrip({ siteLabel }: { siteLabel: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let ticking = false;
    function update() {
      setHidden(window.scrollY > 40);
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-[80] flex items-center justify-between gap-3 bg-black px-4 py-2 text-white transition-all duration-300 ${
        hidden ? "pointer-events-none -translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      aria-hidden={hidden}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 items-center justify-center rounded-md bg-white px-1.5 py-1">
          <Image
            src="/assets/t3-labs-black.png"
            alt="T3 Labs"
            width={56}
            height={26}
            className="h-[26px] w-auto object-contain"
          />
        </span>
        <p className="text-xs font-semibold tracking-wide sm:text-sm">
          {siteLabel} — demo website built by <span className="text-[#d7ff00]">T3 Labs</span>
        </p>
      </div>
      <a
        href="https://www.t3labs.tech"
        tabIndex={hidden ? -1 : 0}
        className="shrink-0 rounded-full bg-[#d7ff00] px-3 py-1.5 text-xs font-bold text-black transition hover:opacity-90 sm:text-sm"
      >
        t3labs.tech
      </a>
    </div>
  );
}
