"use client";

import { usePathname } from "next/navigation";
import { T3AssistantLauncher } from "@/components/assistant-t3/T3AssistantLauncher";

/** Preserve the existing floating legacy assistant everywhere except the two
 * redesigned V18 pages, where the approved design has no floating overlay. */
export function LegacyAssistantGate() {
  const pathname = usePathname();
  return pathname === "/" || pathname === "/free-review" ? null : <T3AssistantLauncher />;
}
