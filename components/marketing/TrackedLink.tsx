"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackMarketingEvent, type MarketingEvent } from "@/lib/marketing-analytics";

export function TrackedLink({
  href, children, eventName, source, className, target, rel, ariaLabel,
}: {
  href: string;
  children: ReactNode;
  eventName: MarketingEvent;
  source: string;
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
  ariaLabel?: string;
}) {
  const onClick = () => trackMarketingEvent(eventName, source);
  return href.startsWith("http") ? (
    <a href={href} target={target ?? "_blank"} rel={rel ?? "noopener noreferrer"} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  );
}
