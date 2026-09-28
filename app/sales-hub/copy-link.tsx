"use client";

import { useEffect, useRef, useState } from "react";

export function CopyLink({ path, name }: { path: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    const url = `https://www.t3labs.tech${path}`;
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
    }
    if (ok) {
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      className={"sh-copy" + (copied ? " is-copied" : "")}
      onClick={copy}
      aria-label={"Copy link to " + name}
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
