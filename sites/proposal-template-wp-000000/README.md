# Proposal media contract

Copy this folder to `sites/<company-slug>-<prospect-id>` and keep the proposal slug lowercase. Store the prospect ID in configuration as uppercase, for example `WP-000205`.

Every proposal uses these source filenames:

| Filename | Configuration field |
| --- | --- |
| `walkthrough-thumbnail.png` | `video.posterImage` |
| `walkthrough-video.mp4` | `video.url` |
| `concept-home-desktop.png` | `conceptImages.desktopHero` |
| `concept-home-mobile.png` | `conceptImages.mobileHero` |
| `current-site-desktop.png` | `comparison.currentSiteImage` |
| `concept-home-desktop.png` | `comparison.proposedImage` (reuse the desktop path) |
| `concept-home-tablet.png` | `comparison.proposedSupportingImages[0]` with `presentation: "natural"` |
| `concept-feature-section.png` | `conceptImages.supporting[0]` |
| `concept-quote-form.png` | `conceptImages.supporting[1]` |

`hasExistingWebsite` records whether the company factually has a website. The optional `comparison` object independently controls whether the comparison section appears. Omit `comparison` when no verified current-site screenshot is available.

The renderer displays `pageCopy.packageIntro` when it is supplied. Keep it consistent with the required `package.intro` commercial summary.

Supply no more than three verified `strengths`. Omit `strengths` when none have been verified.
