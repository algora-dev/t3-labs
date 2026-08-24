import Link from "next/link";
import Image from "next/image";

export function DemoSiteStrip({ siteLabel }: { siteLabel: string }) {
  return (
    <div className="sticky top-0 z-[80] flex items-center justify-between gap-3 bg-black px-4 py-2 text-white">
      <div className="flex items-center gap-2.5">
        <Image
          src="/assets/t3-labs-white.png"
          alt="T3 Labs"
          width={24}
          height={24}
          className="h-6 w-auto"
        />
        <p className="text-xs font-semibold tracking-wide sm:text-sm">
          {siteLabel} — demo website built by <span className="text-[#d7ff00]">T3 Labs</span>
        </p>
      </div>
      <a
        href="https://www.t3labs.tech"
        className="shrink-0 rounded-full bg-[#d7ff00] px-3 py-1.5 text-xs font-bold text-black transition hover:opacity-90 sm:text-sm"
      >
        t3labs.tech
      </a>
    </div>
  );
}
