import type { ProspectSiteConfig } from "../types";

const asset = (name: string) => `/assets/falcon-contracting/${name}`;

export const falconContracting = {
  slug: "falcon-contracting",
  companyName: "Falcon Contracting Ltd",
  seo: {
    title: "Falcon Contracting Ltd | New Roofs and Construction in Essex",
    description: "Falcon Contracting Ltd is a Long Green, Essex roofing and construction business serving Essex, London, the East of England and the Home Counties.",
  },
  brand: {
    logo: { src: asset("falcon-logo.png"), alt: "Falcon Contracting logo" },
    wordmark: { src: asset("falcon-wordmark.png"), alt: "Falcon Contracting logo" },
    colors: { ink: "#1d2529", paper: "#f7f5ef", accent: "#a95537" },
  },
  contact: {
    location: "Long Green, Essex, United Kingdom", telephone: "07921 914875", telephoneHref: "tel:+447921914875", email: "",
    linkedinUrl: "https://www.linkedin.com/company/falconcontracting/", checkatradeUrl: "https://www.checkatrade.com/trades/falconcontractingltd987912",
  },
  navigation: [{ label: "Services", href: "#services" }, { label: "Projects", href: "#projects" }, { label: "Contact", href: "#contact" }],
  mobileNavigation: [{ label: "Services", href: "#services" }, { label: "Projects", href: "#projects" }, { label: "About", href: "#about" }, { label: "Areas", href: "#areas" }, { label: "Contact", href: "#contact" }],
  hero: { eyebrow: "Falcon Contracting Ltd", title: "New roofs, repairs and construction across Essex.", description: "Roofing, refurbishment and construction work for homes and commercial properties across Essex and surrounding areas.", image: { src: asset("new-tiled-roof-brickwork.png"), alt: "Completed tiled roof and brickwork by Falcon Contracting" } },
  about: { eyebrow: "About Falcon Contracting", title: "Practical roofing and construction support from first conversation to finished work.", paragraphs: ["Based in the Essex area, Falcon Contracting Ltd undertakes new roofs, roof repairs, flat roofing, refurbishment, extensions and wider construction work.", "From smaller repairs to larger roofing and construction projects, Falcon provides a straightforward route from the first enquiry through to quotation and completed work."] },
  servicesIntro: { eyebrow: "Services", title: "Roofing and construction services, clearly laid out.", description: "Roofing and construction services for homes, commercial properties and refurbishment projects." },
  services: [
    ["New Roofs & Reroofing", "New roof installations and replacement roof coverings for residential and commercial properties.", "tiled-roof-valley.png"],
    ["Roof Repairs", "Repairs for leaks, damaged roof coverings and general roofing defects.", "roof-window-flashing.png"],
    ["Flat Roofing", "Flat roofing for extensions, refurbishment projects and other suitable properties.", "flat-roof-detailing.png"],
    ["Refurbishment", "Roofing and external refurbishment work for existing buildings.", "new-tiled-roof-brickwork.png"],
    ["Extensions & Loft Conversions", "Roofing and construction support for extension and loft-conversion projects.", "residential-build-roofing.png"],
    ["Commercial Roofing & Construction", "Roofing and construction work for commercial properties and larger projects.", "large-commercial-metal-roof.png"],
  ].map(([title, summary, image]) => ({ title, summary, image: { src: asset(image), alt: `${title} by Falcon Contracting` } })),
  projectsIntro: { eyebrow: "Recent work", title: "Recent roofing and construction work", description: "Explore a selection of recent roofing, refurbishment and construction work completed by Falcon Contracting." },
  projects: [
    ["standing-seam-pyramid-roof.png", "Standing Seam Roofing", "Standing seam metal roof installation by Falcon Contracting"], ["commercial-roof-overview.png", "Commercial Roofing", "Large commercial roof project with scaffolding around the building"], ["residential-build-roofing.png", "Residential Construction", "Residential construction project with roof tiles and scaffold in place"], ["slate-roof-dormer.png", "Residential Roofing", "Grey tiled roof and dormer detailing on a residential property"], ["roof-window-flashing.png", "Roof Window Detailing", "Roof window flashing and tiled roof detailing"], ["tiled-roof-valley.png", "Roof Valley Work", "Clay tiled roof valley with grey waterproofing detail"], ["new-tiled-roof-brickwork.png", "Reroofing", "New clay tiled roof on a brick property"], ["flat-roof-detailing.png", "Flat Roofing", "Flat roof and weathering detail beside brickwork"],
  ].map(([src, label, alt]) => ({ src: asset(src), label, alt })),
  whyChoose: { eyebrow: "Why Falcon", title: "Why choose Falcon Contracting?", description: "Practical roofing and construction experience for residential and commercial projects.", items: ["Roofing and construction services from one contractor.", "Experience across residential, commercial and refurbishment work.", "Clear communication around quotations, scheduling and next steps.", "Genuine examples of recent Falcon projects."] },
  testimonials: { eyebrow: "Customer feedback", title: "What customers say", description: "Feedback from customers who have worked with Falcon Contracting.", items: [{ summary: "Professional, punctual and tidy, with the work completed to a high standard.", source: "Customer feedback via Checkatrade" }, { summary: "Clear communication throughout the job and a good finish on the completed work.", source: "Customer feedback via Checkatrade" }, { summary: "Helpful advice, reliable attendance and care taken around the property.", source: "Customer feedback via Checkatrade" }] },
  process: { eyebrow: "Process", title: "A straightforward route from enquiry to completed work.", steps: ["Discuss the project", "Arrange a site visit or consultation", "Receive a quotation", "Schedule the work", "Complete the project"] },
  coverage: { eyebrow: "Areas covered", title: "Based around Long Green, serving Essex and surrounding areas.", description: "Falcon Contracting works across Long Green, Colchester and Essex, with projects extending into London, the East of England and the Home Counties.", areas: ["Long Green", "Colchester", "Essex", "London", "East of England", "Home Counties"] },
  contactSection: { eyebrow: "Contact", title: "Tell us about your upcoming project.", description: "Share the basics of the job, or call Falcon directly to discuss new roofs, repairs, refurbishment or construction work.", formStatus: "Please call 07921 914875 to continue your enquiry." },
  callsToAction: { quote: "Request a Quote", call: "Call Falcon", email: "Email Falcon" },
  footer: { location: "Long Green, Essex, United Kingdom", socialLabel: "LinkedIn" },
  requiresConfirmation: ["Review summaries should be approved by Falcon before public launch.", "Email address and any registered trading address should be confirmed before adding them.", "Form delivery needs a real provider before the enquiry form can send messages."],
} satisfies ProspectSiteConfig;
