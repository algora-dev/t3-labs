# T3 Labs Outreach Pages - Agent Handoff

## Mission

Maintain and deploy the private T3 Labs roofing outreach landing-page system. The system is already built. Do not redesign or duplicate it unless explicitly instructed.

The shared page is designed for one job: get a roofing prospect to watch a short video, then either request a free working demo, book a 20-minute call, or explore proof/examples first.

## Locked generic URLs

There are only two generic combined-solution pages:

1. Shaun: `https://t3labs.tech/hello/what-you-might-be-missing`
2. Co-founder: `https://t3labs.tech/hello/where-they-go-next`

Both currently contain a video placeholder. Once recordings are supplied, add the video asset to the matching config record. Do not create four-category generic variants.

## Bespoke URLs

Every high-intent prospect gets a business-specific route:

`https://t3labs.tech/hello/<business-slug>`

Example:

`https://t3labs.tech/hello/acme-roofing`

The business name in the URL is intentional. Do not add tracking query strings or recipient IDs to public outreach links.

## Architecture

- `app/hello/[slug]/page.tsx` - one dynamic private route for every outreach page.
- `components/outreach/outreach-landing-page.tsx` - shared visual/interaction template. Do not copy this per prospect.
- `lib/outreach/config.ts` - two locked generic records and route resolver.
- `lib/outreach/bespoke-pages.ts` - add prospect-specific records here.
- `app/api/outreach-demo-request/route.ts` - demo-request endpoint. It sends internal notifications through Resend.
- `docs/OUTREACH_LANDING_PAGES.md` - detailed implementation notes.
- `app/robots.ts` - `/hello/` is blocked from crawling.

## Creating one bespoke page

You need:

- business name;
- business website URL;
- final video file;
- presenter (`shaun` or `cofounder`);
- optional custom headline/eyebrow if supplied.

1. Create a lowercase human-readable slug from the business name.
2. Put the video at `public/assets/outreach/<slug>/video.mp4`.
3. Add an optional poster at `public/assets/outreach/<slug>/poster.jpg`.
4. Add one record to `lib/outreach/bespoke-pages.ts`.
5. Validate the build/tests required by the repository.
6. Deploy normally.
7. Return the clean live URL.

Example record:

```ts
"acme-roofing": {
  slug: "acme-roofing",
  businessName: "Acme Roofing",
  website: "https://www.acmeroofing.example",
  presenter: "shaun",
  eyebrow: "A quick video for Acme Roofing",
  title: "I spotted a couple of simple things that could make a much bigger difference.",
  intro: "Watch this first. It is under a minute.",
  video: {
    src: "/assets/outreach/acme-roofing/video.mp4",
    poster: "/assets/outreach/acme-roofing/poster.jpg",
  },
},
```

For a batch of 10 prospects, create 10 asset folders and 10 records in the same file. Do not create 10 React pages.

## What the shared page already does

Initial screen:

- T3 Labs branding;
- short headline;
- video;
- free working demo card;
- learn-more card.

Free demo path:

- offers a free basic demo based on the prospect's current website;
- clarifies that T3 Labs creates a separate demo and does not edit the real website;
- asks for the website URL;
- defaults to sending the finished demo to the original outreach email;
- optionally collects a different delivery email;
- offers the existing 20-minute Calendly call as an alternative.

Learn-more path:

- Apex Roofing demo;
- RoofHub, described as a real working platform/site built for a real entity;
- QuoteCore+;
- 30-second fit check with six questions and a tailored result.

## Demo request notifications

`/api/outreach-demo-request` uses Resend to notify T3 Labs when somebody asks for a demo. The notification includes the website, route/slug, known business name and alternate email when supplied.

It does not automatically build or send the finished demo. That remains a separate human/agent workflow.

## Important rules

- Keep `/hello/` pages private: `noindex`, `nofollow`, no public directory.
- No tracking parameters in outreach URLs.
- Do not add normal site navigation or extra above-the-fold distractions.
- Keep the initial page minimal.
- Reuse the shared renderer.
- Preserve T3 Labs design tokens and interaction patterns.
- Do not use em dashes in repository copy/comments/docs, per repository rules.
- For bespoke pages, prefer the business name as the slug.
- Only change the shared renderer when the change should apply to every generic and bespoke outreach page.

## Short prompt for a future agent

Use this when handing over a batch:

> Add these prospects to the existing T3 Labs outreach system. Follow `OUTREACH_AGENT_HANDOFF.md` and `docs/OUTREACH_LANDING_PAGES.md`. Do not create separate React pages or redesign the template. For each prospect, create a clean `/hello/<business-name>` slug, add the supplied video under `public/assets/outreach/<slug>/`, add one config record to `lib/outreach/bespoke-pages.ts`, validate the repo, and return the final live URLs. Preserve all existing demo-request, Calendly, proof-card and fit-check behavior.
