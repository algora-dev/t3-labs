"use client";

import { useEffect, useRef, useState } from "react";

type Scene = {
  heading: string;
  emphasisWord: string;
  services: string[];
};

const SCENES: Scene[] = [
  {
    heading: "CUSTOM SOFTWARE SOLUTIONS",
    emphasisWord: "SOLUTIONS",
    services: ["Dashboards", "Internal bottlenecks", "SaaS Platforms"],
  },
  {
    heading: "AI INTEGRATIONS",
    emphasisWord: "AI",
    services: ["Agent setup", "Automation", "Chatbots", "Workflows"],
  },
  {
    heading: "BUSINESS GROWTH",
    emphasisWord: "GROWTH",
    services: ["Websites/SEO", "Tracking", "Conversion Tools"],
  },
];

// Timeline (ms)
const TYPE_SPEED = 42;
const HEADING_EMPHASIS_DELAY = 150;
const HEADING_EMPHASIS_HOLD = 900;
const SERVICES_REVEAL_DELAY = 350;
const SERVICE_PULSE_DURATION = 440; // shorter total time per item
const SERVICE_PULSE_OVERLAP = 120; // overlap so next starts sooner
const SERVICES_HOLD_AFTER_PULSE = 800;
const SCENE_EXIT_DURATION = 500;
const BETWEEN_SCENE_DELAY = 200;
const FINAL_REVEAL_DELAY = 400;

export default function AnimatedHero() {
  const [phase, setPhase] = useState<"intro" | "final">("intro");
  const [activeScene, setActiveScene] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showServices, setShowServices] = useState(false);
  const [sceneExiting, setSceneExiting] = useState(false);
  const [headingEmphasis, setHeadingEmphasis] = useState(false);
  const [pulsingService, setPulsingService] = useState(-1);
  const cancelRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Play every page load — no sessionStorage check
    if (reducedMotion) {
      setPhase("final");
      return;
    }

    cancelRef.current = false;
    let timers: number[] = [];

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, ms);
        timers.push(t);
      });

    async function runSequence() {
      await sleep(400);

      for (let i = 0; i < SCENES.length; i++) {
        if (cancelRef.current) return;
        const scene = SCENES[i];

        setTypedText("");
        setShowServices(false);
        setSceneExiting(false);
        setHeadingEmphasis(false);
        setPulsingService(-1);
        setActiveScene(i);

        // Type the heading
        for (const char of scene.heading) {
          if (cancelRef.current) return;
          setTypedText((prev) => prev + char);
          await sleep(TYPE_SPEED);
        }

        // Pulse the emphasis word green
        await sleep(HEADING_EMPHASIS_DELAY);
        setHeadingEmphasis(true);
        await sleep(HEADING_EMPHASIS_HOLD);
        setHeadingEmphasis(false);

        // Reveal services
        await sleep(SERVICES_REVEAL_DELAY - HEADING_EMPHASIS_DELAY);
        setShowServices(true);

        // Pulse each service item sequentially
        await sleep(200);
        for (let s = 0; s < scene.services.length; s++) {
          if (cancelRef.current) return;
          setPulsingService(s);
          await sleep(SERVICE_PULSE_DURATION - SERVICE_PULSE_OVERLAP);
        }
        setPulsingService(-1);

        await sleep(SERVICES_HOLD_AFTER_PULSE);

        setSceneExiting(true);
        await sleep(SCENE_EXIT_DURATION);

        if (i < SCENES.length - 1) {
          await sleep(BETWEEN_SCENE_DELAY);
        }
      }

      if (cancelRef.current) return;

      await sleep(FINAL_REVEAL_DELAY);
      setPhase("final");
    }

    runSequence();

    return () => {
      cancelRef.current = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // Render heading with emphasis word — inline display, spaces preserved
  function renderHeading(scene: Scene) {
    if (!scene.emphasisWord || !typedText.includes(scene.emphasisWord)) {
      return typedText;
    }
    const idx = typedText.indexOf(scene.emphasisWord);
    const before = typedText.slice(0, idx);
    const word = typedText.slice(idx, idx + scene.emphasisWord.length);
    const after = typedText.slice(idx + scene.emphasisWord.length);
    return (
      <>
        <span>{before}</span>
        <span className={`t3-hero__emphasis${headingEmphasis ? " t3-hero__emphasis--active" : ""}`}>
          {word}
        </span>
        <span>{after}</span>
      </>
    );
  }

  // Render services with pulse
  function renderServices(scene: Scene) {
    return scene.services.map((item, idx) => (
      <span key={idx}>
        {idx > 0 && <span className="t3-hero__service-sep"> · </span>}
        <span
          className={`t3-hero__service-item${pulsingService === idx ? " t3-hero__service-item--active" : ""}`}
        >
          {item}
        </span>
      </span>
    ));
  }

  return (
    <section className="t3-hero" aria-labelledby="t3-hero-heading" data-phase={phase}>
      <div className="t3-hero__inner">
        <div className="t3-hero__eyebrow">
          <span className="t3-hero__signal" aria-hidden="true" />
          T3 Labs / Technology without the headache
        </div>

        <div className="t3-hero__stage">
          {phase === "intro" && (
            <div className="t3-hero__animation" aria-hidden="true">
              <div
                className={`t3-hero__scene${sceneExiting ? " t3-hero__scene--exiting" : ""}`}
                key={activeScene}
              >
                <h2 className="t3-hero__category">
                  {renderHeading(SCENES[activeScene])}
                  <span className="t3-hero__cursor" aria-hidden="true" />
                </h2>
                <p
                  className={`t3-hero__services${showServices ? " t3-hero__services--visible" : ""}`}
                >
                  {renderServices(SCENES[activeScene])}
                </p>
              </div>
            </div>
          )}

          <div className={`t3-hero__final${phase === "final" ? " t3-hero__final--visible" : ""}`}>
            <h1 id="t3-hero-heading">Technology built around your business.</h1>
            <p className="t3-hero__pillars">
              Custom software. AI integrations. Growth solutions.
            </p>
            <p className="t3-hero__description">
              You bring us the problem. We work out what needs to be built.
            </p>
            <div className="t3-hero__actions">
              <a href="#send-message" className="t3-hero__cta">
                <span className="t3-hero__cta-text">Tell us your problem</span>
                <span className="t3-hero__cta-arrow" aria-hidden="true">&rarr;</span>
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
