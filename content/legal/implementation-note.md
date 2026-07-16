# Codex Implementation Note — T3 Labs Legal Pages

Create three reusable legal routes in the existing T3 Labs codebase:

```text
/website-package-terms
/privacy
/cookies
```

Use the accompanying Markdown documents as the page copy.

## Required implementation decisions

1. Use **T3 Play Limited, trading as T3 Labs** as the legal entity.
2. Use New Zealand law for the Website Package Terms.
3. Show the £399 package as a total price with no separate VAT/GST amount added.
4. Use:
   - 50% before client-specific work;
   - 50% before launch;
   - one consolidated revision round;
   - three months of hosting and technical support included;
   - £10 per month after the included period;
   - no automatic recurring charge without the customer's agreement;
   - a continuation reminder approximately 14 days before the included period ends;
   - monthly billing in advance;
   - cancellation before the next monthly billing date;
   - seven-day invoices;
   - 7–10 working day estimated delivery.
5. Keep proposal tracking server-side and cookieless where practical.
6. Do not add advertising or retargeting cookies.
7. Prefer self-hosted proposal video.
8. If Loom is embedded, use a click-to-load consent gate before Loom scripts or requests load.
9. Keep Calendly as an external link rather than an embedded widget.
10. Hosting continuation must not start automatically. Add a renewal-status field and a manual or explicit customer-confirmation step before creating recurring billing.
11. Support wording must promise an initial response within two working days, not 24/7 or emergency support.
12. Add persistent footer links:
    - Website Package Terms
    - Privacy Notice
    - Cookie Policy
    - Cookie Settings
    - Request Removal

## Company and contact details

Use the following public legal/contact identity:

```text
T3 Play Limited, trading as T3 Labs
Registered in New Zealand
Email: insights@t3labs.co.uk
```

Do not require the NZBN or New Zealand company number to be displayed on proposal pages or legal pages.

For the Privacy Notice, obtain a genuine postal or service address before treating the notice as fully final under New Zealand Privacy Principles 3 and 3A. Keep this as an internal implementation requirement and do not show a drafting warning or placeholder on a public page.

## Versioning

Store and render:

```text
termsVersion: 2026-07-15
privacyVersion: 2026-07-15
cookieVersion: 2026-07-15
```

When a client accepts an order, record the Terms version accepted.

## Proposal event rules

Server-side events may include:

- proposal_opened
- video_started
- video_25_percent
- video_50_percent
- video_90_percent
- concept_gallery_viewed
- comparison_viewed
- offer_viewed
- launch_cta_clicked
- calendly_clicked
- proposal_closed
- do_not_contact_selected

Each event should include:

```text
prospect_id
company_slug
proposal_path
event_name
timestamp
```

Do not create a persistent browser identifier merely to recognise repeat visitors.

## Suppression

The `do_not_contact_selected` action must:

1. record the Prospect ID and relevant email identifier;
2. stop automated follow-up;
3. add the minimum identifier to the suppression list;
4. show confirmation; and
5. retain the suppression record so the person is not accidentally re-added.
