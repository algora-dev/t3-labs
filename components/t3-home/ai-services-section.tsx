"use client";

/** Optional compact homepage block retained for compatibility.
 * All links now resolve to indexable, roofing-specific services.
 */
import Link from "next/link";
import { openIntakeModal } from "@/lib/intake/analytics";

const SERVICE_LINKS = [
  { href: "/roofing-website-design", label: "Roofing Websites" },
  { href: "/roofing-website-estimators", label: "Estimators" },
  { href: "/roofing-quoting-software", label: "Quoting" },
  { href: "/roofing-business-automation", label: "Automation" },
];

export default function AIServicesSection() {
  return (
    <section id="roofing-services" className="mb-[104px] w-[min(1180px,calc(100%-40px))] mx-auto scroll-mt-24">
      <div className="rounded-2xl border border-[#d7ff00]/20 bg-gradient-to-br from-[#0f1118] to-[#0a0b10] p-8 sm:p-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff00]">
          {SERVICE_LINKS.map((link, index) => (
            <span key={link.href}>
              <Link href={link.href} className="text-[#d7ff00] underline decoration-[#d7ff00]/40 underline-offset-4 hover:text-[#b8dd00]">{link.label}</Link>
              {index < SERVICE_LINKS.length - 1 && <span className="mx-1.5 text-white/30" aria-hidden="true">·</span>}
            </span>
          ))}
        </p>
        <h2 className="mb-5 max-w-[720px] text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-tight text-white">
          Better roofing enquiries. Faster quotes. Less admin.
        </h2>
        <p className="mb-7 max-w-[760px] text-[1.05rem] leading-8 text-white/75">
          Start with the bottleneck in your business, whether that is poor-quality enquiries, slow pricing, delayed quotes or manual follow-up.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <button type="button" onClick={() => openIntakeModal({ trigger: "page-cta", source_page: "/", cta_text: "Tell us what slows you down", problem_category: "roofing-services" })}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#d7ff00] px-6 py-3 text-sm font-semibold text-[#0a0b10] transition hover:bg-[#b8dd00]">
            Tell us what slows you down <span aria-hidden="true">→</span>
          </button>
          <Link href="/solutions" className="text-sm font-semibold text-[#d7ff00] underline underline-offset-4 transition hover:text-[#b8dd00]">Explore roofing solutions</Link>
        </div>
      </div>
    </section>
  );
}
