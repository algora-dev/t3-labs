"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Search, ChartNoAxesCombined, MousePointer2, MessagesSquare, Workflow, ListFilter, UsersRound, Zap, Play, Pause, RotateCcw, Maximize, X } from "./T3OutcomeIcons";
import styles from "./T3OutcomeAnimation.module.css";
const cx = (names: string) => names.split(/\s+/).filter(Boolean).map(name => styles[name] ?? "").filter(Boolean).join(" ");
const DURATION = 12000;
const CHAPTERS = ["More customers", "Less manual work", "More profit"];
const services = [
  [{ label: "Be found", detail: "Search & AI", Icon: Search }, { label: "Rank higher", detail: "Stand out in search", Icon: ChartNoAxesCombined }, { label: "Convert more", detail: "Turn interest into action", Icon: MousePointer2 }],
  [{ label: "Answer faster", detail: "Customer self-service", Icon: MessagesSquare }, { label: "Automate tasks", detail: "Give your team time back", Icon: Workflow }, { label: "Streamline leads", detail: "Keep opportunities moving", Icon: ListFilter }],
];
function Connections({ final = false }: { final?: boolean }) {
  const paths = final
    ? ["M225 0 V45 Q225 75 255 75 H420 Q450 75 450 105 V180", "M675 0 V45 Q675 75 645 75 H480 Q450 75 450 105 V180"]
    : ["M150 0 V45 Q150 75 180 75 H420 Q450 75 450 105 V180", "M450 0 V180", "M750 0 V45 Q750 75 720 75 H480 Q450 75 450 105 V180"];
  return <svg className={cx("connections")} viewBox="0 0 900 182" preserveAspectRatio="none" aria-hidden="true">
    {paths.map((d, i) => <g key={d} style={{ "--branch": i } as CSSProperties}><path className={cx("wire")} d={d} pathLength="1"/><path className={cx("wire-light")} d={d} pathLength="1"/><path className={cx("wire-trail")} d={d} pathLength="1"/></g>)}
    {(final ? [225, 675] : [150, 450, 750]).map(x => <circle key={x} className={cx("port")} cx={x} cy="2" r="3.2"/>)}
    <circle className={cx("destination")} cx="450" cy="178" r="4"/>
  </svg>;
}
export type T3OutcomeAnimationProps = { embedded?: boolean };
/** Place below the homepage hero. Uses the existing Inter font and --lime token. */
export default function T3OutcomeAnimation({ embedded = true }: T3OutcomeAnimationProps) {
  const container = useRef<HTMLElement>(null);
  const visible = useRef(!embedded);
  const Heading = embedded ? "h2" : "h1";
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const clock = useRef(0);
  const isPlaying = useRef(true);
  const animations = useRef<Animation[]>([]);
  const activeChapter = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [chapter, setChapter] = useState(0);
  const [clean, setClean] = useState(false);
  const [ready, setReady] = useState(false);
  // One clock drives every line, transition and glow, including pause and replay.
  const paint = useCallback(() => {
    animations.current.forEach(a => { a.currentTime = clock.current; });
    if (progress.current) progress.current.style.transform = `scaleX(${clock.current / DURATION})`;
    const next = Math.min(2, Math.floor(clock.current / 4000));
    if (next !== activeChapter.current) { activeChapter.current = next; setChapter(next); }
  }, []);
  const setPlayback = useCallback((value: boolean) => { isPlaying.current = value; setPlaying(value); }, []);
  const jump = useCallback((time: number) => { clock.current = time; paint(); setPlayback(true); }, [paint, setPlayback]);
  useEffect(() => {
    animations.current = stage.current?.getAnimations({ subtree: true }) ?? [];
    animations.current.forEach(a => a.pause());
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const respectMotion = () => { if (reduced.matches) { clock.current = 10800; setPlayback(false); paint(); } };
    respectMotion(); reduced.addEventListener("change", respectMotion);
    if (!embedded && new URLSearchParams(window.location.search).get("clean") === "1") setClean(true);
    paint(); setReady(true);
    // Wait until this section reaches the visitor; pause when it leaves the viewport.
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    }, { threshold: 0 });
    if (container.current) observer.observe(container.current);
    let frame = 0, last = performance.now();
    const tick = (now: number) => {
      if (isPlaying.current && visible.current && !document.hidden) { clock.current = (clock.current + Math.min(now - last, 100)) % DURATION; paint(); }
      last = now; frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setClean(false); return; }
      if (e.ctrlKey || e.metaKey || e.altKey || (e.target instanceof Element && e.target.closest("button, a, input, textarea, select, [contenteditable]"))) return;
      if (e.code === "Space") { e.preventDefault(); setPlayback(!isPlaying.current); }
      if (e.key.toLowerCase() === "r") jump(0);
    };
    const root = container.current;
    root?.addEventListener("keydown", keydown);
    return () => { cancelAnimationFrame(frame); root?.removeEventListener("keydown", keydown); observer.disconnect(); reduced.removeEventListener("change", respectMotion); };
  }, [paint, setPlayback, jump, embedded]);
  return <section ref={container} tabIndex={0} aria-label="More customers, less manual work, more profit" className={cx(`root experience ${embedded ? "embedded" : ""} ${clean ? "presentation" : ""}`)}>
    {!embedded && <header className={cx("masthead")}><a href="/" className={cx("signature")} aria-label="The business effect home"><span className={cx("brandmark")}><ArrowUpRight size={20} strokeWidth={2.3}/></span>The business effect<span className={cx("signature-dot")}>.</span></a><span className={cx("masthead-note")}>Six solutions. One goal.</span></header>}
    <div className={cx("story")}>
      <div className={cx("intro")}><p className={cx("eyebrow")}><span/> BETTER BUSINESS, BY DESIGN</p><Heading className={cx("headline")}>More customers. Less work. <span>More profit.</span></Heading></div>
      <div className={cx("stage-shell")}>
        <div className={cx("stage-meta")}><span className={cx("chapter-count")}>0{chapter + 1}<span> / 03</span></span><span>{["GROW YOUR BUSINESS", "MAKE WORK FLOW", "BRING IT ALL TOGETHER"][chapter]}</span><span className={cx("live-dot")} /></div>
        <div className={cx(`stage ${ready ? "is-ready" : ""}`)} ref={stage} aria-hidden="true">
          {services.map((group, index) => <div key={index} className={cx("scene")} style={{ "--start": `${index * 4}s` } as CSSProperties}>
            <div className={cx("sources")}>{group.map(({ label, detail, Icon }, i) => <div className={cx("source")} key={label} style={{ "--item": i } as CSSProperties}><span className={cx("source-icon")}><Icon size={28} strokeWidth={1.5}/></span><h3>{label}</h3><p>{detail}</p></div>)}</div>
            <Connections/>
            <div className={cx("outcome")}><span className={cx("result-kicker")}>THE RESULT</span><h3>{CHAPTERS[index]}<span className={cx("period")}>.</span></h3></div>
          </div>)}
          <div className={cx("scene")} style={{ "--start": "8s" } as CSSProperties}>
            <div className={cx("sources paired")}><div className={cx("source")} style={{ "--item": 0 } as CSSProperties}><span className={cx("source-icon")}><UsersRound size={28} strokeWidth={1.5}/></span><h3>More customers</h3></div><span className={cx("plus")}>+</span><div className={cx("source")} style={{ "--item": 1 } as CSSProperties}><span className={cx("source-icon")}><Zap size={28} strokeWidth={1.5}/></span><h3>Less manual work</h3></div></div>
            <Connections final/>
            <div className={cx("outcome profit")}><span className={cx("result-kicker")}>ONE SHARED GOAL</span><h3>More profit<span className={cx("period")}>.</span><ArrowUpRight className={cx("profit-arrow")} strokeWidth={1.25}/></h3></div>
          </div>
        </div>
        <div className={cx("sr-only")}><h3>More customers</h3><p>Be found, rank higher and convert more lead to more customers.</p><h3>Less manual work</h3><p>Answer faster, automate tasks and streamline leads lead to less manual work.</p><h3>More profit</h3><p>More customers and less manual work come together with one shared goal: more profit.</p></div>
        <div className={cx("timeline")} aria-hidden="true"><div ref={progress}/></div>
      </div>
      <div className={cx("playback")}>
        <div className={cx("transport")}><button type="button" className={cx("play-button")} onClick={() => setPlayback(!isPlaying.current)} aria-label={playing ? "Pause animation" : "Play animation"}>{playing ? <Pause size={17} fill="currentColor"/> : <Play size={17} fill="currentColor"/>}</button><button type="button" className={cx("replay-button")} onClick={() => jump(0)} aria-label="Replay animation"><RotateCcw size={17}/><span>Replay</span></button><span className={cx("duration")}>12 SEC LOOP</span></div>
        <nav className={cx("chapters")} aria-label="Animation chapters">{CHAPTERS.map((label, i) => <button type="button" key={label} className={cx(chapter === i ? "active" : "")} onClick={() => jump(i * 4000 + 500)} aria-current={chapter === i ? "step" : undefined}><span className={cx("step-dot")} /><span>{label}</span></button>)}</nav>
        {!embedded && <button type="button" className={cx("present-button")} onClick={() => { setClean(true); jump(0); }}><Maximize size={16}/><span>Presentation view</span></button>}
      </div>
    </div>
    {!embedded && <footer className={cx("footer")}><p>Get found. Win customers. Make work easier.</p><span>Built around your business.</span></footer>}
    {clean && <button type="button" className={cx("exit-presentation")} onClick={() => setClean(false)} aria-label="Exit presentation view"><X size={18}/><span>Exit presentation</span></button>}
  </section>;
}
