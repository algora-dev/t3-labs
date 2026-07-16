# Contractor Website Template

The reusable contractor website template is built from the Falcon customer-facing site.

Use this template for roofing, building, landscaping, scaffolding and other trade-business websites that need a polished one-page customer site with:

- A large project-photo hero
- Simple desktop and mobile navigation
- Service cards
- Project gallery
- Why-choose points
- Customer feedback
- Process and service-area section
- Visible general contact form
- Separate quote-request modal
- Mobile call and quote actions

## Main Files

- `components/templates/contractor-site.tsx` renders the full customer website from one config object.
- `app/components.tsx` contains the shared visual sections used by the template.
- `sites/<slug>/site-config.ts` contains the replaceable business content.
- `public/assets/<slug>/` contains the website images for that business.
- `app/<public-route>/page.tsx` imports the config and renders `<ContractorSite site={...} />`.

Keep proposal/sales pages separate from contractor websites. Proposal pages live under `/proposal/<slug>` and use `ProposalConfig`. Customer-facing contractor websites use `ProspectSiteConfig`.

## Create A New Contractor Website

1. Copy an existing `sites/<slug>/site-config.ts` into a new prospect folder.
2. Replace the slug, company name, SEO text, phone, service area, navigation labels and all visible copy.
3. Replace every image in `public/assets/<slug>/` with prospect-specific images.
4. Update image `alt` text so it describes the new company work.
5. Update `services`, `projects`, `whyChoose`, `testimonials`, `process`, `coverage` and `quoteRequest.projectTypes`.
6. Create a route in `app/<route-name>/page.tsx`:

```tsx
import { ContractorSite, createContractorSiteMetadata } from "@/components/templates/contractor-site";
import { exampleCompany } from "@/sites/example-company/site-config";

export const metadata = createContractorSiteMetadata(exampleCompany);

export default function ExampleCompanyPage() {
  return <ContractorSite site={exampleCompany} />;
}
```

7. Keep speculative/private previews as `noindex, nofollow` until the client approves launch.
8. Run `npm run typecheck`, `npm run lint` and `npm run build`.

## Replaceable Config Areas

- `brand`: logo, wordmark and colour reference
- `contact`: phone number, location and social links
- `navigation` and `mobileNavigation`: section links
- `hero`: first-screen message and hero image
- `services`: four to ten service cards
- `projects`: three to twelve gallery images
- `testimonials`: optional customer feedback
- `coverage`: local area wording and area chips
- `contactSection`: general enquiry form copy
- `quoteRequest`: modal title, helper text, dropdown options and upload labels

Before turning this into a fully generic starter, keep Falcon as the visual benchmark and only generalise what future sites genuinely need.
