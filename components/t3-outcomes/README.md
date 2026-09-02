# T3 Labs outcome animation

A self-contained React/Next.js section for https://www.t3labs.tech/.

## Agent handoff

Add this animation as a new section immediately after the homepage hero containing the FIRST “Tell us your problem” button, before the “We do not start with a fixed service list” section. Place it outside the hero's animated `.t3-hero__final` wrapper and outside `.t3-hero__actions`, so the hero's reveal, clipping and click handlers do not affect it.

Preserve the existing hero, CTA, layout and the rest of the website. Keep the animation's approved black background, white text, layout, six labels, three scenes and 12-second timing. The brand changes are the T3 Labs lime (#D7FF00) and Inter font. Do not restyle it into a white diagram or change the sequence.

1. Copy this entire folder into `components/t3-outcomes/` in the website repository.
2. Import and render the component at the placement described above:

```tsx
import T3OutcomeAnimation from "@/components/t3-outcomes/T3OutcomeAnimation";

// Immediately after the existing hero component/section:
<T3OutcomeAnimation />
```

For a page whose actual hero component is named `Hero`, the surrounding structure would be:

```tsx
<>
  <Hero />
  <T3OutcomeAnimation />
  {/* Existing next section and remaining page content stay here. */}
</>
```

Use the existing project's import alias or an equivalent relative import. The component is already marked `"use client"`, so the parent page can remain a server component.

## Included files

- `T3OutcomeAnimation.tsx`: the animation, playback controls and visibility handling.
- `T3OutcomeAnimation.module.css`: all styles and keyframes, isolated with CSS Modules.
- `T3OutcomeIcons.tsx`: the original inline SVG icons; no icon package installation required.
- `ICONS-LICENSE.txt`: the required Lucide/Feather icon notices.
- `README.md`: this handoff.

## Dependencies and integration details

Only React and CSS Modules support are required; both are present in the existing Next.js website. No Tailwind classes, animation libraries, iframe, hosted preview URL, environment variables or new services are needed.

The component uses `Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. The current T3 Labs homepage already loads Inter in weights 400–900 from Google Fonts. Reuse that font setup; do not add another font download for this section.

The accent uses the existing `--lime` website token, with `#d7ff00` as its fallback. Explicit accent/typography overrides can be provided on a parent wrapper through `--t3-outcome-accent` and `--t3-outcome-font`. The CSS creates no document-level styles, so it does not change the existing website's body, buttons or headings. It intentionally supplies its own dark surface inside the section.

`embedded` defaults to `true`. This removes the standalone demo's header, footer, full-page minimum height and presentation button. It retains the approved headline, diagram and playback controls. The animation starts when the section becomes visible and pauses while offscreen or while the document is hidden. Reduced-motion visitors initially see a static final result and can choose to play it.

Pause/replay and chapter buttons work independently of the rest of the page. Keyboard controls (Space and R) apply only when the animation section itself has focus, so typing into the existing enquiry form is unaffected. The diagram has an equivalent screen-reader text description.

For a separate recording/demo page, use `<T3OutcomeAnimation embedded={false} />`. This includes the original standalone page controls and presentation view. Do not use that mode for the homepage section.

## Validation before deploying the T3 Labs website

Run the website's normal production build. Check the new section at desktop and mobile widths, the three animation scenes, pause/replay, reduced motion, and the existing “Tell us your problem” interaction. Keep the site's existing deployment process.

The component was production-built in the supplied demo. It has not been installed into or browser-tested within the T3 Labs repository, which was not provided.

## Brand reference

Verified against the live homepage and its linked stylesheets on 2026-09-02:
- Homepage: https://www.t3labs.tech/
- Root accent: `--lime: #d7ff00`
- Body font: `Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`
- Original prototype: Arial and #B2F968; both have been updated here.
