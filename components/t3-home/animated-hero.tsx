"use client";

import { useEffect, useState } from "react";

const HERO_SESSION_KEY = "t3HeroPlayed";
const FINAL_REVEAL_DELAY_MS = 5500;

const HERO_SCENES = [
  {
    heading: "CUSTOM SOFTWARE SOLUTIONS",
    services: "Dashboards · Internal bottlenecks · SaaS Platforms",
  },
  {
    heading: "AI INTEGRATIONS",
    services: "Agent setup · Automation · Chatbots · Workflows",
  },
  {
    heading: "BUSINESS GROWTH",
    services: "Websites/SEO · Tracking · Conversion Tools",
  },
] as const;

export default function AnimatedHero() {
  const [phase, setPhase] = useState<"intro" | "final">("intro");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = window.sessionStorage.getItem(HERO_SESSION_KEY) === "true";

    if (reducedMotion || alreadyPlayed) {
      const revealFrame = window.requestAnimationFrame(() => setPhase("final"));
      return () => window.cancelAnimationFrame(revealFrame);
    }

    const revealTimer = window.setTimeout(() => {
      setPhase("final");
      window.sessionStorage.setItem(HERO_SESSION_KEY, "true");
    }, FINAL_REVEAL_DELAY_MS);

    return () => window.clearTimeout(revealTimer);
  }, []);

  return (
    <section className="t3-hero" aria-labelledby="t3-hero-heading" data-phase={phase}>
      <div className="t3-hero__inner">
        <div className="t3-hero__eyebrow">
          <span className="t3-hero__signal" aria-hidden="true" />
          T3 Labs / Technology without the headache
        </div>

        <div className="t3-hero__stage">
          <div className="t3-hero__animation" aria-hidden="true">
            {HERO_SCENES.map((scene, index) => (
              <div
                key={scene.heading}
                className={`t3-hero__scene t3-hero__scene--${index + 1}`}
              >
                <p className="t3-hero__category">{scene.heading}</p>
                <p className="t3-hero__services">{scene.services}</p>
              </div>
            ))}
          </div>

          <div className="t3-hero__final">
            <h1 id="t3-hero-heading">Technology built around your business.</h1>
            <p className="t3-hero__pillars">
              Custom software. AI integrations. Growth solutions.
            </p>
            <p className="t3-hero__description">
              You bring us the problem. We work out what needs to be built.
            </p>
            <div className="t3-hero__actions">
              <a href="#send-message" className="t3-hero__button t3-hero__button--primary">
                Tell us what you need <span aria-hidden="true">&rarr;</span>
              </a>
              <a href="#work" className="t3-hero__button t3-hero__button--secondary">
                See what we&rsquo;ve built
              </a>
            </div>
          </div>
        </div>
      </div>

      <noscript>
        <style>{`
          .t3-hero__animation { display: none !important; }
          .t3-hero__final { opacity: 1 !important; transform: none !important; pointer-events: auto !important; }
          .t3-hero__actions { visibility: visible !important; }
        `}</style>
      </noscript>
    </section>
  );
}
