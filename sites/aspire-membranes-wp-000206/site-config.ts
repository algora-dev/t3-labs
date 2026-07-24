import type { ProspectSiteConfig } from "../types";

const asset = (name: string) => `/assets/aspire-membranes-wp-000206/${name}`;

export const aspireMembranes = {
  slug: "aspire-membranes-wp-000206",
  companyName: "Aspire Membranes Limited",
  seo: {
    title: "Aspire Membranes | Industrial & Domestic Roofing Across the UK",
    description: "Industrial and domestic flat roofing, membrane systems, pitched roofing and industrial roof sheeting from Aspire Membranes in Leven, serving the United Kingdom.",
  },
  brand: {
    logo: { src: asset("aspire-membranes-logo.png"), alt: "Aspire Membranes Limited roofing contractors logo" },
    wordmark: { src: asset("aspire-membranes-logo.png"), alt: "Aspire Membranes Limited roofing contractors" },
    colors: { ink: "#171933", paper: "#f5f7fb", accent: "#5635f2" },
  },
  contact: {
    location: "Unit 1, Burnmill Industrial Estate, Burnmill Road, Leven KY8 4RA",
    telephone: "01333 439882",
    telephoneHref: "tel:+441333439882",
    email: "enquiries@aspiremembranes.co.uk",
    linkedinUrl: "https://uk.linkedin.com/company/aspire-membranes-limited",
    facebookUrl: "https://www.facebook.com/aspiremembranes?locale=en_GB",
    checkatradeUrl: "",
  },
  navigation: [
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  mobileNavigation: [
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Coverage", href: "#areas" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "Specialist roofing contractors · Leven, Scotland",
    title: "Specialist roofing systems for buildings across the United Kingdom.",
    description: "Industrial and domestic flat roofing, membrane systems, pitched roofing and roof sheeting - planned around the needs of your property.",
    image: { src: asset("finished-flat-roof.webp"), alt: "Completed flat membrane roof with crisp white perimeter detailing" },
  },
  trustItems: ["Industrial & domestic roofing", "Specialist membrane systems", "UK-wide service"],
  about: {
    eyebrow: "About Aspire",
    title: "Specialist knowledge, clearly presented.",
    paragraphs: [
      "Aspire Membranes Limited provides industrial and domestic roofing services from its base in Leven, working with clients throughout the United Kingdom.",
      "The team covers flat and pitched roofing, from single ply membranes and bitumen felt to standing seam systems, roof sheeting and roof coatings.",
    ],
    image: { src: asset("aspire-roofing-team.webp"), alt: "Three Aspire roofing team members on a flat roof beside the coast" },
  },
  servicesIntro: {
    eyebrow: "Roofing services",
    title: "The right system for the roof in front of you.",
    description: "A commercially structured overview of Aspire’s verified roofing services, making it easier to identify the right starting point for an enquiry.",
  },
  services: [
    { title: "Single Ply Membranes", summary: "Single ply membrane roofing for suitable industrial and domestic flat-roof applications.", image: { src: asset("rooflight-membrane-detail.webp"), alt: "Single ply membrane roof installation around a raised rooflight" } },
    { title: "Bitumen Felt Roofing", summary: "Bitumen felt roofing systems installed for suitable flat-roof projects.", image: { src: asset("bitumen-felt-installation.webp"), alt: "Torch-on bitumen felt being installed on a flat roof" } },
    { title: "Roof Coatings", summary: "Roof coating systems for suitable roofing substrates and project requirements.", image: { src: asset("large-flat-roof.webp"), alt: "Large completed coated flat roof with perimeter edge protection" } },
    { title: "Standing Seam Systems", summary: "A range of specified standing seam roof systems for appropriate buildings and designs.", image: { src: asset("standing-seam-roof-clean.png"), alt: "Completed dark standing seam roofs on a residential development" } },
    { title: "Industrial Roofing", summary: "Industrial roofing including profiled roof sheeting, fibre cement sheeting and translucent sheeting.", image: { src: asset("commercial-roofline.webp"), alt: "Completed commercial roofline and cladding detail" } },
    { title: "Pitched Roofs", summary: "Pitched roofing work including slating and tiling for suitable domestic and commercial properties.", image: { src: asset("rooflights-flat-roof.webp"), alt: "Completed flat roof and rooflight detailing beside a tiled pitched roof" } },
  ],
  projectsIntro: {
    eyebrow: "Completed work",
    title: "Roofing work shown in the detail.",
    description: "A selection of approved Aspire project photography covering specialist membranes, industrial buildings, rooflights and standing seam systems.",
  },
  projects: [
    { src: asset("standing-seam-roof.webp"), label: "Standing seam roofing", alt: "Dark standing seam roofs completed across a residential development" },
    { src: asset("wildlife-centre-roof.webp"), label: "Commercial flat roofing", alt: "Aerial view of the completed flat roof at the Willie Clarke Centre" },
    { src: asset("rooflights-flat-roof.webp"), label: "Rooflights & detailing", alt: "Flat membrane roof finished around multiple pyramid and sloped rooflights" },
    { src: asset("large-flat-roof.webp"), label: "Large roof area", alt: "Large completed flat membrane roof with edge protection" },
    { src: asset("commercial-roofline.webp"), label: "Industrial roofline", alt: "Blue and silver commercial roof edge detail beneath a bright sky" },
    { src: asset("finished-flat-roof.webp"), label: "Flat roof finish", alt: "Finished pale flat roof membrane and perimeter trims" },
    { src: asset("bitumen-felt-installation.webp"), label: "Bitumen felt", alt: "Roofing operative installing torch-on bitumen felt" },
  ],
  whyChoose: {
    eyebrow: "Why Aspire",
    title: "A focused route into a specialist roofing team.",
    description: "The concept brings Aspire’s breadth of roofing work, national coverage and genuine project imagery into one clear commercial journey.",
    items: [
      "Industrial and domestic roofing services from one specialist contractor.",
      "Multiple flat-roof, pitched-roof and roof-sheeting systems available.",
      "Approved project photography showing genuine completed work.",
      "A business that supports local foodbank donations at Christmas.",
    ],
  },
  testimonials: {
    eyebrow: "Customer feedback",
    title: "Appreciated by customers and project partners.",
    description: "Recent feedback highlights Aspire's fast response, practical help and specialist roofing expertise.",
    items: [
      {
        summary: "Bruce responded to my email for help within a couple of hours, and his team quickly resolved the problem a couple of days later. Brilliant response, during a time when they would already be very busy.",
        source: "Richard Kiralfy",
      },
      {
        summary: "Special thanks to Ian Mathieson and Damian Williams of Aspire Membranes for their expertise and dedication to the project and helping to ensure that the end results are perfect.",
        source: "Montrose Air Station Museum",
      },
    ],
  },
  process: {
    eyebrow: "Your enquiry",
    title: "Give the team the useful details from the start.",
    steps: ["Tell us about the building and roof", "Choose the relevant roofing service", "Share your postcode and preferred timeframe", "Add photographs if they help explain the project", "Choose how you would like Aspire to respond"],
  },
  coverage: {
    eyebrow: "Coverage",
    title: "Based in Leven. Working across the United Kingdom.",
    description: "Aspire Membranes is based at Burnmill Industrial Estate in Leven and provides roofing services to clients throughout the United Kingdom.",
    areas: ["Leven", "Fife", "Scotland", "United Kingdom"],
  },
  contactSection: {
    eyebrow: "Request a quote",
    title: "Tell Aspire what the roof needs.",
    description: "Share the property, service and timing details that will make the first conversation more useful. This concept form is for demonstration only and does not send data.",
    formStatus: "Thank you - this demonstration shows how an Aspire enquiry would be confirmed. No information has been sent.",
  },
  quoteServices: ["Single Ply Membranes", "Bitumen Felt Roofing", "Roof Coatings", "Green Roofs", "Balcony Roofs", "Hotmelt Roofs", "Topdeck Roofing System", "Pitched Roofs", "Slating & Tiling", "Profiled Roof Sheeting", "Fibre Cement Sheeting", "Translucent Sheeting", "Industrial Roofing", "Standing Seam Roof Systems"],
  quoteUploadLabel: "Project Photos/Plans",
  quoteRequest: {
    eyebrow: "Detailed quote request",
    title: "Tell Aspire what the roof needs",
    helperText: "Add as much useful detail as you can. This demonstration form does not transmit or store your information.",
    preferredTimeframes: ["As soon as practical", "Within 1-3 months", "Within 3-6 months", "More than 6 months away", "Just researching"],
    preferredContactMethods: ["Phone", "Email"],
    beforeQuoteOptions: ["Request call before quote", "Request email before quote"],
    fileLabel: "Project Photos/Plans",
    fileButtonText: "Choose files",
    fileEmptyText: "No files selected",
  },
  callsToAction: { quote: "Request a Quote", call: "Call Aspire", email: "Email Aspire" },
  footer: { location: "Unit 1, Burnmill Industrial Estate, Burnmill Road, Leven KY8 4RA", socialLabel: "LinkedIn" },
  requiresConfirmation: [
    "The supplied Checkatrade URL belongs to a different Aspire Roofing business in Stanley, Durham, so Checkatrade reviews or ratings have not been used.",
    "A named contact was not supplied and has been omitted.",
    "The demonstration form needs a real delivery provider and privacy wording before any public launch.",
  ],
} satisfies ProspectSiteConfig;
