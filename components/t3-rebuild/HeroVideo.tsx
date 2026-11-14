"use client";

// Hero team video: branded play button over the poster, native controls appear once playback starts.
import { useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    video.play().catch(() => {
      // If the browser blocks playback, the native controls are already visible for a manual start.
    });
  };

  return (
    <div className="hero-video-visual">
      <video
        ref={videoRef}
        aria-label="T3Labs team introduction video"
        className="hero-video-player"
        controls={started}
        playsInline
        preload="metadata"
        poster="/assets/t3-rebuild/t3-hero-video-poster.jpg"
      >
        <source src="/assets/t3-rebuild/t3-hero-team-video.mp4" type="video/mp4" />
      </video>
      {!started && (
        <button type="button" className="hero-video-play" aria-label="Play the T3Labs team introduction video" onClick={start}>
          <span className="hero-video-play-circle" aria-hidden="true">
            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
