import type { ProspectSiteConfig } from "../types";

const asset = (name: string) => `/assets/contractor-template/${name}`;

export const contractorTemplate = {
  slug: "contractor-template",
  companyName: "Example Contractor Ltd",
  seo: {
    title: "Contractor Website Template | T3 Labs",
    description: "A reusable one-page contractor website template for trade businesses.",
  },
  brand: {
    logo: { src: asset("wordmark-placeholder.svg"), alt: "Logo placeholder" },
    wordmark: { src: asset("wordmark-placeholder.svg"), alt: "Logo placeholder" },
    colors: { ink: "#1d2529", paper: "#f7f5ef", accent: "#a95537" },
  },
  contact: {
    location: "Service Area, United Kingdom",
    telephone: "01234 567890",
    telephoneHref: "tel:+441234567890",
    email: "",
    linkedinUrl: "#",
    checkatradeUrl: "#",
  },
  navigation: [{ label: "Services", href: "#services" }, { label: "Projects", href: "#projects" }, { label: "Contact", href: "#contact" }],
  mobileNavigation: [{ label: "Services", href: "#services" }, { label: "Projects", href: "#projects" }, { label: "About", href: "#about" }, { label: "Areas", href: "#areas" }, { label: "Contact", href: "#contact" }],
  hero: {
    eyebrow: "Company Name Ltd",
    title: "Trade services, repairs and project work across your area.",
    description: "A clear, trustworthy one-page website structure for residential and commercial trade businesses.",
    image: { src: asset("hero-placeholder.svg"), alt: "Hero project photo placeholder" },
  },
  about: {
    eyebrow: "About the business",
    title: "Straightforward support from first enquiry to finished work.",
    paragraphs: [
      "Use this section to explain the company, the type of work it takes on and the area it serves.",
      "Keep the wording practical, local and believable. Replace every placeholder before creating a real prospect page.",
    ],
  },
  servicesIntro: {
    eyebrow: "Services",
    title: "Core services, clearly laid out.",
    description: "Use four to ten service cards depending on the trade, with one strong image for each service.",
  },
  services: [
    ["Primary Service", "Short plain-English description of the main service offered by the business."],
    ["Repairs & Maintenance", "Describe smaller repair work, callouts or ongoing maintenance services."],
    ["Specialist Work", "Use this for a higher-value service, technical capability or niche offer."],
    ["Refurbishment", "Describe improvement, renovation or upgrade work for existing properties."],
    ["Extensions & Projects", "Use this for larger project support where the trade fits into a wider build."],
    ["Commercial Work", "Describe services for commercial properties, landlords or larger sites."],
  ].map(([title, summary]) => ({ title, summary, image: { src: asset("service-placeholder.svg"), alt: `${title} placeholder image` } })),
  projectsIntro: {
    eyebrow: "Recent work",
    title: "Recent project examples",
    description: "Replace these placeholders with genuine project photos from the prospect.",
  },
  projects: [
    ["project-placeholder-a.svg", "Completed Project", "Completed project image placeholder"],
    ["project-placeholder-b.svg", "Work Example", "Work example image placeholder"],
    ["project-placeholder-a.svg", "Residential Work", "Residential work image placeholder"],
    ["project-placeholder-b.svg", "Commercial Work", "Commercial work image placeholder"],
    ["project-placeholder-a.svg", "Detail Work", "Detail work image placeholder"],
    ["project-placeholder-b.svg", "Before / After", "Before and after image placeholder"],
  ].map(([src, label, alt]) => ({ src: asset(src), label, alt })),
  whyChoose: {
    eyebrow: "Why choose us",
    title: "Why choose Company Name?",
    description: "Replace these points with practical reasons a customer should trust this business.",
    items: [
      "Clear service information from one contractor.",
      "Experience across residential and commercial work.",
      "Straightforward communication around quotes and scheduling.",
      "Genuine examples of recent projects.",
    ],
  },
  testimonials: {
    eyebrow: "Customer feedback",
    title: "What customers say",
    description: "Use approved short review excerpts or remove this section when reviews are not available.",
    items: [
      { summary: "Replace with an approved customer review or short feedback summary.", source: "Customer feedback source" },
      { summary: "Keep feedback concise and avoid unverified claims or invented ratings.", source: "Customer feedback source" },
      { summary: "Use this area only when the prospect has credible review material.", source: "Customer feedback source" },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "A straightforward route from enquiry to completed work.",
    steps: ["Discuss the project", "Arrange a site visit or consultation", "Receive a quotation", "Schedule the work", "Complete the project"],
  },
  coverage: {
    eyebrow: "Areas covered",
    title: "Based locally, serving the surrounding areas.",
    description: "Replace with natural location wording that does not overstate uncertain coverage.",
    areas: ["Main Town", "County", "Nearby Area", "Surrounding Areas"],
  },
  contactSection: {
    eyebrow: "Contact",
    title: "Contact us about your upcoming project.",
    description: "Use the contact form for general enquiries, or open the quote request form when you are ready to share fuller project details.",
    formStatus: "This template form is not connected yet.",
    generalFormTitle: "Send a general enquiry",
  },
  quoteRequest: {
    eyebrow: "Quote request form",
    title: "Request a quote",
    helperText: "The more info you can provide now, the faster the business can respond with useful next steps.",
    projectTypes: ["Primary Service", "Repair", "New Project", "Refurbishment", "Commercial Work", "Other"],
    beforeQuoteOptions: ["Request call before quote", "Request email before quote"],
    fileLabel: "Attach plans/photos",
    fileButtonText: "Choose files",
    fileEmptyText: "No file chosen",
  },
  callsToAction: { quote: "Request a Quote", call: "Call Now", email: "Email" },
  footer: { location: "Service Area, United Kingdom", socialLabel: "Social link" },
  requiresConfirmation: [
    "Replace all placeholder copy before using this for a real prospect.",
    "Replace all placeholder images with prospect-specific visuals.",
    "Connect a real form destination before launch.",
  ],
} satisfies ProspectSiteConfig;
