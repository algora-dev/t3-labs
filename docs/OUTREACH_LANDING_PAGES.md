# T3 Labs outreach landing pages

The private outreach landing-page system lives at `/hello/<slug>`.

It is intentionally separate from the larger proposal system. Outreach pages are short, progressive and designed around one video plus a small number of choices.

## Current architecture

- `app/hello/[slug]/page.tsx` resolves the URL and applies private noindex metadata.
- `lib/outreach/config.ts` contains the two locked generic pages and resolves all outreach routes.
- `lib/outreach/bespoke-pages.ts` is the only registry future agents should edit for prospect-specific pages.
- `components/outreach/outreach-landing-page.tsx` is the shared renderer and interaction flow.
- `app/robots.ts` disallows crawling under `/hello/`.

Do not create a separate React page for every business. Add a config record and reuse the shared renderer.

## First-screen contract

The first screen is deliberately minimal:

1. T3 Labs logo.
2. Short watch-first heading.
3. Video.
4. Request a free working demo or choose a 20-minute call.
5. Learn more first.

Nothing else should compete for attention until the visitor chooses to learn more.

The primary CTA opens a modal that offers a free 1 to 3 day website demo or the existing T3 Labs Calendly route:

`https://calendly.com/insights-t3labs/20-minute-meeting`

## Learn-more layer

The shared second layer currently contains:

- Apex Roofing demo: `/demo/roofing-site`
- RoofHub: `https://roofhub.co.nz`
- QuoteCore+: `https://quote-core.com`
- 30-second fit check

The fit check asks six quick multiple-choice questions and produces a response based on both the overall opportunity score and the strongest individual opportunities in the answers.

The lowest-scoring outcome is deliberately honest. It says the business already has a lot covered and offers a second pair of eyes rather than manufacturing a problem.

## Locked generic pages

There are exactly two generic combined-solution pages:

- Shaun: `/hello/what-you-might-be-missing`
- Co-founder: `/hello/where-they-go-next`

Both currently use a video placeholder. When the two final combined videos are recorded, place the assets under `public/assets/outreach/<slug>/` and add `src` and optionally `poster` to the matching record in `lib/outreach/config.ts`.

Do not create enquiry, information, pricing or overview generic pages. Those concepts are now folded into the combined video.

## Adding a bespoke business page

Use the business name as the public slug wherever practical:

`/hello/acme-roofing`

Add one record to `lib/outreach/bespoke-pages.ts`:

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

That is the intended future batch workflow. An agent can receive ten business names, URLs and videos, create ten asset folders and ten config records, validate once, then return the ten live `/hello/<business>` URLs.

## Generic page plan is locked

The live generic routes are:

- Shaun combined: `/hello/what-you-might-be-missing`
- Co-founder combined: `/hello/where-they-go-next`

All other outreach pages are bespoke and should normally use the prospect business name as the slug, for example `/hello/acme-roofing`. The business name itself provides the curiosity/personalization in the URL.

The shared renderer is the base for both generic and bespoke pages. For a bespoke page, the only expected differences are the slug, business name, website, optional headline/eyebrow copy, presenter and video asset.

## Publishing rules

- Keep outreach pages `noindex, nofollow`.
- Do not put recipient identifiers or tracking parameters in the public URL.
- Keep slugs lowercase and human-readable.
- Open proof examples in a new tab so the outreach page remains available.
- Do not add full site navigation, service menus or extra above-the-fold CTAs.
- Do not duplicate the shared renderer for prospect-specific changes that can be expressed in config.
- Follow the repository-wide rule: no em dashes in copy, comments or docs.


## Free demo request flow

The primary first-screen card opens a modal rather than immediately leaving the page. The visitor can either:

- request a free working demo based on their own website, normally ready in 1 to 3 days; or
- book the existing free 20-minute Calendly call.

The demo request asks only for the website. By default, the private demo link is sent to the email address used in the original outreach. The visitor can choose to provide a different email address instead.

Requests post to `app/api/outreach-demo-request/route.ts`, which uses Resend to send an internal notification including the landing-page slug, website, business name when available, and delivery preference. The website/domain is the key used to match a generic-page request back to the outbound record. This notification does not automatically send the finished demo to the prospect. Final demo delivery remains a separate manual or agent workflow.

The page deliberately explains that the demo is free, carries no obligation, uses the most relevant T3 Labs solutions, and is normally ready within 1 to 3 days.
