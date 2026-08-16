"use client";

/**
 * IntakeModalMount — single site-wide mount point for the AI intake modal.
 *
 * Listens for:
 *  - `t3:intake-open` CustomEvents (fired via openIntakeModal() from hero,
 *    mid-page CTAs, and ContextualIntakeCTA blocks)
 *  - `#intake` URL hash (deep links — reviewer §8 requirement)
 *
 * Also captures landing-page + UTM attribution on first load per session.
 * Mount once per page that needs intake availability.
 */

import { useEffect, useState } from "react";
import IntakeModal from "@/components/intake/intake-modal";
import {
  captureLandingAttribution,
  type IntakeOpenContext,
} from "@/lib/intake/analytics";

export default function IntakeModalMount() {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<IntakeOpenContext | undefined>(undefined);

  useEffect(() => {
    captureLandingAttribution();

    function handleOpen(event: Event) {
      const detail = (event as CustomEvent<IntakeOpenContext>).detail;
      setContext(detail);
      setOpen(true);
    }

    function handleHash() {
      if (window.location.hash === "#intake") {
        setContext({
          trigger: "nav",
          source_page: window.location.pathname,
          cta_text: "#intake",
        });
        setOpen(true);
      }
    }

    handleHash();
    window.addEventListener("t3:intake-open", handleOpen);
    window.addEventListener("hashchange", handleHash);
    return () => {
      window.removeEventListener("t3:intake-open", handleOpen);
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  return <IntakeModal open={open} onClose={() => setOpen(false)} context={context} />;
}
