# Short Proposal Template (WP-000000)

A shortened variant of the T3 Labs private proposal template.

## Layout

This version keeps only two blocks:

1. **Hero** - the private concept intro, up to and including "This concept is private and is not publicly listed."
2. **Final CTA** - the dark "Your next step" block ("Ready to use this concept for [COMPANY NAME]?" ... "prepare the website for launch.")

All middle sections are intentionally removed:

- concept detail / in-depth desktop-mobile views
- website comparison
- concept views gallery
- strengths ("A strong starting point")
- findings ("Three opportunities we noticed")
- improvements ("What this concept improves")
- package / £399 offer
- FAQ ("Questions you might have")

## Media contract

Every proposal built from this template uses these source filenames (kept in the
prospect-specific public media folder):

| Filename | Configuration field |
| --- | --- |
| `walkthrough-thumbnail.png` | `video.posterImage` |
| `walkthrough-video.mp4` | `video.url` |

## Commercial, privacy and tracking

- Uses `£399` (`websitePackageTerms.packagePrice`).
- Preserves booking URL (`calendly.com/cece-t3labs/20min`), launch email (`cece@t3labs.co.uk`),
  noindex/nofollow/noarchive, tracking events and the close-removal flow (notifies
  cece@t3labs.co.uk via `/api/proposal-closed`).
- The page never mentions frameworks and makes no ranking promises.

## Route

Planned live route (once added to the t3-labs app, pending approval):

```
https://www.t3labs.tech/proposal/short-proposal-template-wp-000000
```

The existing live proposals and the existing `proposal-template-wp-000000` are
unaffected. This is a separate, additive template.
