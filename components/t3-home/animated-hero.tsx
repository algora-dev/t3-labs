"use client";

import { useEffect, useRef, useState } from "react";

const HERO_SESSION_KEY = "t3HeroPlayed";

type Scene = {
  heading: string;
  emphasisWord: string;
  services: string;
};

const SCENES: Scene[] = [
  {
    heading: "CUSTOM SOFTWARE SOLUTIONS",
    emphasisWord: "SOFTWARE",
    services: "Dashboards · Internal bottlenecks · SaaS Platforms",
  },
  {
    heading: "AI INTEGRATIONS",
    emphasisWord: "AI",
    services: "Agent setup · Automation · Chatbots · Workflows",
  },
  {
    heading: "BUSINESS GROWTH",
    emphasisWord: "GROWTH",
    services: "Websites/SEO · Tracking · Conversion Tools",
  },
];

// Timeline (ms) — tuned for readability
const TYPE_SPEED = 55; // ms per char
const SERVICES_REVEAL_DELAY = 350;
const SERVICES_HOLD = 2600; // hold after services appear
const SCENE_EXIT_DURATION = 500;
const BETWEEN_SCENE_DELAY = 200;
const FINAL_REVEAL_DELAY = 400;

export default function AnimatedHero() {
  const [phase, setPhase] = useState<"intro" | "final">("intro");
  const [activeScene, setActiveScene] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showServices, setShowServices] = useState(false);
  const [sceneExiting, setSceneExiting] = useState(false);
  const [emphasisActive, setEmphasisActive] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(HERO_SESSION_KEY) === "true";

    if (reducedMotion || alreadyPlayed) {
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

        // Reset state for this scene
        setTypedText("");
        setShowServices(false);
        setSceneExiting(false);
        setEmphasisActive(false);
        setActiveScene(i);

        // Type the heading
        for (const char of scene.heading) {
          if (cancelRef.current) return;
          setTypedText((prev) => prev + char);
          await sleep(TYPE_SPEED);
        }

        // Pulse the emphasis word green
        await sleep(150);
        setEmphasisActive(true);
        await sleep(900);
        setEmphasisActive(false);

        // Reveal services
        await sleep(SERVICES_REVEAL_DELAY - 150);
        setShowServices(true);

        // Hold
        await sleep(SERVICES_HOLD);

        // Exit scene
        setSceneExiting(true);
        await sleep(SCENE_EXIT_DURATION);

        if (i < SCENES.length - 1) {
          await sleep(BETWEEN_SCENE_DELAY);
        }
      }

      if (cancelRef.current) return;

      // Reveal final hero
      await sleep(FINAL_REVEAL_DELAY);
      setPhase("final");
      sessionStorage.setItem(HERO_SESSION_KEY, "true");
    }

    runSequence();

    return () => {
      cancelRef.current = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // Split heading to wrap emphasis word
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
        {before}
        <span className={`t3-hero__emphasis${emphasisActive ? " t3-hero__emphasis--active" : ""}`}>
          {word}
        </span>
        {after}
      </>
    );
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
                  {SCENES[activeScene].services}
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
