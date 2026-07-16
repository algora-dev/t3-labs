# Reusable Proposal Package and FAQ Copy

Use this content inside the reusable T3 Labs proposal-page template.

Replace values from one central proposal configuration. Do not hardcode commercial terms separately for each prospect.

---

## Required proposal variables

```ts
companyName
packagePrice
vatLabel
revisionRounds
includedHostingMonths
monthlyHostingPrice
hostingReminderDays
supportResponseWorkingDays
handoverMinutes
depositAmountOrPercentage
finalPaymentTiming
proposalValidityDays
ownershipSummary
sourceCodeTransferSummary
domainCostSummary
```

The proposal must not be published while any required value is empty or still contains a placeholder.

---

# Package section

## Overline

```text
WEBSITE LAUNCH PACKAGE
```

## Heading

```text
Launch this website for [PACKAGE_PRICE]
```

## Description

```text
The concept shown in your walkthrough has already been built as a working
one-page website for [COMPANY_NAME].

If you choose to proceed, we will apply the agreed revisions, connect your
domain and enquiry form, complete the final checks and prepare the website
for launch.
```

## What is included

```text
- The one-page website shown in the walkthrough
- Desktop, tablet and mobile optimisation
- Verified services, service areas and contact information
- Completed-work project gallery
- Detailed quote-request form
- Foundational on-page SEO setup
- Domain connection and launch setup
- [REVISION_ROUNDS] consolidated revision round(s) and a [HANDOVER_MINUTES]-minute handover call
```

Add this as a separate included item:

```text
- Three months of managed website hosting and technical support
```

## Primary CTA

```text
I'd like to launch this website
```

## Secondary CTA

```text
Book a free [CALL_MINUTES]-minute call
```

## CTA note

```text
Clicking does not take payment or create a binding order. We will confirm
the final scope, package terms and payment schedule with you first.
```

---

# Questions you might have

## What happens after the included hosting period?

```text
Managed website hosting and technical support are included for the first
three months from launch.

After that, you can continue hosting with T3 Labs for £10 per month. There
is no long-term commitment, and we will contact you before the included
period ends.

The monthly service begins only after you agree to continue. You can cancel
before the next monthly billing date.
```

---

## What does the hosting and technical support include?

```text
It includes secure website hosting, SSL, routine backups, technical
maintenance, security updates and assistance with genuine website faults.

It does not include routine content changes, additional pages, new features,
ongoing SEO, marketing work, domain renewal or third-party subscriptions.
Support requests will normally receive an initial response within two
working days.
```

---

## How many revision rounds are included?

```text
[REVISION_ROUNDS] consolidated revision round(s) are included.

One revision round means one complete list of reasonable changes submitted
together. New pages, a substantially different design direction or new
functionality will be quoted separately before any additional work begins.
```

Use correct singular/plural rendering in code.

---

## Can additional pages be added later?

```text
Yes. The [PACKAGE_PRICE] package covers the one-page website shown in the
walkthrough. Additional service, location or information pages can be
scoped and quoted separately.
```

---

## Can logo or brand-colour changes be included?

```text
Minor logo placement, sizing and colour refinements can be included where
they fit the existing concept.

A new logo, full brand identity or substantial change of visual direction
is not included in the website package and would be quoted separately.
```

---

## Does this guarantee Google rankings?

```text
No. The package includes foundational on-page SEO work such as page titles,
heading structure, service and location wording, image descriptions and
indexing setup where applicable.

Search rankings, traffic and enquiries depend on factors outside T3 Labs'
control and are not guaranteed.
```

---

## Can the existing domain be used?

```text
Yes. We can normally connect a domain you already own once the required
access has been supplied.

Domain registration, renewal fees and unusual transfer or recovery work are
not included unless they are specifically listed in the agreed scope.
```

---

## Who owns the finished website?

```text
Once all invoices have been paid, [COMPANY_NAME] may use the completed
website indefinitely and continues to own the logos, photographs, copy and
other materials it supplied.

T3 Labs retains ownership of its pre-existing templates, reusable
components, systems and development tools. The final ownership and
source-code transfer position will be set out in the package terms agreed
before work begins.
```

Replace the final sentence with the actual fixed transfer policy once it has been decided.

---

## What happens after I click the launch button?

```text
Clicking records your interest only. No payment is taken.

We will contact you to confirm the final scope, revision allowance, hosting,
domain access and payment schedule. Work begins only after you approve the
scope and the required initial payment has been received.
```

---

# Final CTA

## Overline

```text
YOUR NEXT STEP
```

## Heading

```text
Ready to use this concept for [COMPANY_NAME]?
```

## Supporting copy

```text
We will apply the agreed revisions, connect the domain and enquiry form,
complete the final checks and prepare the website for launch.
```

## Primary CTA

```text
I'd like to launch this website
```

## Quiet action

```text
Close my private proposal
```

---

# Optional proposal-validity note

Place this beneath the package or inside the package terms rather than making it visually prominent:

```text
This proposal is valid for [PROPOSAL_VALIDITY_DAYS] days from the date shown.
Availability and launch timing will be reconfirmed after that date.
```

---

# Recommended exclusions summary for the package terms

The fixed-price package should state that it does not include, unless expressly added to the scope:

```text
- Additional pages
- A new logo or full brand identity
- Professional photography or video
- E-commerce
- Customer accounts or portals
- Booking systems
- Bespoke calculators
- Complex third-party integrations
- Paid software, licences or subscriptions
- Domain registration or renewal
- Ongoing SEO or content creation
- Unlimited revisions
- Guaranteed rankings, traffic, enquiries or revenue
```

---

# Implementation rules

1. Store all commercial values in one central T3 Labs package configuration.
2. Keep prospect-specific values such as `[COMPANY_NAME]` in the proposal's prospect config.
3. Do not repeat the package wording separately in every prospect file.
4. Render correct singular and plural wording automatically.
5. Fail the production build when required commercial values are missing.
6. Do not publish text such as `to be confirmed`, `[PLACEHOLDER]`, `TODO` or an empty FAQ answer.
7. The launch button should remain an expression of interest until the agreed scope and terms have been accepted.
8. Link the footer and package section to the full Website Package Terms.
