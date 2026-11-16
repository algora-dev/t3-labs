"use client";

import { useState } from "react";
import { trackMarketingEvent } from "@/lib/marketing-analytics";

/** Do not load YouTube's third-party iframe until the visitor explicitly requests it. */
export function ClickToPlayOverview({videoId}:{videoId:string}) {
  const [opened, setOpened] = useState(false);
  if (opened) return (
    <iframe
      loading="lazy"
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
      title="T3 Labs roofing business tools video overview"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  );
  return (
    <button
      type="button"
      className="t3s-video-gate"
      onClick={() => { trackMarketingEvent("video_open", "solutions"); setOpened(true); }}
      aria-label="Play the existing T3 Labs roofing business tools video"
    >
      <span className="t3s-video-play" aria-hidden="true">▶</span>
      <span className="t3s-video-gate-title">See how the tools fit together</span>
      <span className="t3s-video-gate-help">Play the existing overview video</span>
    </button>
  );
}
