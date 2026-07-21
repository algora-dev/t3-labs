import type { ProspectSiteConfig } from "../types";

const asset = (name: string) => `/assets/blenheim-roofing-wp-000209/${name}`;

export const blenheimRoofing = {
  slug: "blenheim-roofing-wp-000209",
  companyName: "Blenheim Roofing Services Limited",
  seo: {
    title: "Blenheim Roofing Services Ltd | Industrial Roofing in Surrey",
    description:
      "Industrial and commercial roofing refurbishment specialists in Surrey, covering asbestos cement removal, cladding, sheeting, felting, single ply, liquid waterproofing, rooflight replacement and maintenance.",
  },
  brand: {
    logo: { src: asset("logo.jpg"), alt: "Blenheim Roofing Services Limited logo" },
    wordmark: { src: asset("logo.jpg"), alt: "Blenheim Roofing Services Limited logo" },
    colors: { ink: "#17315f", paper: "#f6f8fc", accent: "#3958a5" },
  },
  contact: {
    location: "17 First Quarter, Blenheim Road, Epsom, Surrey KT19 9QN",
    telephone: "01372 728866",
    telephoneHref: "tel:+441372728866",
    email: "info@blenheimroofing.co.uk",
    linkedinUrl: "https://uk.linkedin.com/company/blenheim-roofing-services-limited",
    checkatradeUrl: "https://share.google/RsSSZORd3Ov0QfpJ1",
  },
  navigation: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ],
  mobileNavigation: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "Industrial and commercial roofing refurbishment",
    title: "Design and installation for Surrey roofing projects with minimal disruption.",
    description:
      "Blenheim Roofing Services Ltd works on asbestos cement removal, cladding, sheeting, felting, single ply, liquid waterproofing and maintenance for occupied industrial and commercial sites.",
    image: { src: asset("hero-main-image.jpg"), alt: "Large industrial building with a completed roof by Blenheim Roofing Services Limited" },
  },
  trustItems: ["25 years in the industry", "NFRC Gold Health & Safety Award", "ISO 9001 and CHAS"],
  about: {
    eyebrow: "About Blenheim",
    title: "A clear route from survey to completion.",
    paragraphs: [
      "Blenheim Roofing Services Ltd provides industrial and commercial roofing refurbishment work, with a full design and installation service for guaranteed roofing systems.",
      "The team covers asbestos cement roof removal, sheeting and cladding, high performance felt, single ply, liquid waterproofing, rooflight replacement, maintenance and powered access equipment.",
      "Projects are planned around method statements, risk assessments and site safety procedures, with minimal disruption to people and production where work is carried out on occupied buildings.",
    ],
  },
  servicesIntro: {
    eyebrow: "Services",
    title: "Roofing systems and support work for industrial and commercial sites.",
    description:
      "A concise overview of the verified services Blenheim offers, from roof removal and replacement through to maintenance and access support.",
  },
  services: [
    {
      title: "Asbestos Cement Roof Removal",
      summary: "Safe replacement of asbestos cement roof coverings on industrial and commercial premises.",
      image: { src: asset("asbestos-roof-close-up.jpg"), alt: "Close-up of an asbestos cement roof covering" },
    },
    {
      title: "Sheeting and Cladding",
      summary: "Replacement and refurbishment of roof sheeting and cladding systems for commercial buildings.",
      image: { src: asset("sheet-cladding.jpg"), alt: "Industrial building with roof sheeting and cladding" },
    },
    {
      title: "High Performance Felt",
      summary: "High performance felt roofing for suitable flat roof areas and refurbishment projects.",
      image: { src: asset("high-performance-felt.jpg"), alt: "Completed high performance felt flat roof" },
    },
    {
      title: "Single Ply",
      summary: "Single ply roofing for suitable commercial roofs and refurbishment work.",
      image: { src: asset("single-ply-roof.jpg"), alt: "Completed single ply flat roof" },
    },
    {
      title: "Liquid Waterproofing",
      summary: "Liquid waterproofing systems for suitable roofs and detailing around equipment or edges.",
      image: { src: asset("liquid-waterproofing.jpg"), alt: "Completed liquid waterproofing roof installation" },
    },
    {
      title: "Rooflight Replacement",
      summary: "Replacement rooflight work to support daylight, weather protection and safe upkeep.",
      image: { src: asset("rooflight-replacement.jpg"), alt: "Replacement rooflights on a commercial roof" },
    },
  ],
  projectsIntro: {
    eyebrow: "Project examples",
    title: "A small selection of recent-looking work examples.",
    description:
      "The gallery uses the supplied imagery to show the scale and type of project Blenheim handles on occupied industrial and commercial buildings.",
  },
  projects: [
    {
      src: asset("powered-access.jpg"),
      label: "Powered access",
      alt: "Operative using powered access equipment beside a commercial building",
    },
    {
      src: asset("asbestos-removal-safety-netting.jpg"),
      label: "Removal showing safety netting in place",
      alt: "Roof work with safety netting in place during asbestos removal",
    },
  ],
  whyChoose: {
    eyebrow: "Why choose Blenheim",
    title: "Experience, methodical planning and recognised standards.",
    description:
      "The page brings the verified strengths of the business into one clear view, without overstating anything that is not publicly confirmed.",
    items: [
      "25 years in the industry.",
      "National Federation of Roofing Contractors Gold Health & Safety Award.",
      "ISO 9001, Constructionline, CHAS and Avetta listed on the live site.",
      "Method statements and risk assessments planned around your site procedures.",
    ],
  },
  testimonials: {
    eyebrow: "Reviews",
    title: "Client feedback from the live website.",
    description:
      "These summaries are taken from the public testimonials page and kept deliberately short for the concept build.",
    items: [
      {
        summary: "Blenheim Roofing have carried out several contracts for us, always to a very high standard",
        source: "Adams & Adams",
      },
      {
        summary: "Blenheim Roofing Services are a very professional company. They are very reliable and put safety first",
        source: "Designplan Lighting",
      },
      {
        summary: "We have always been very pleased with the service provided. Each contract has been carried out on time within budget and with a high degree of safety,",
        source: "Ibstock Bricks",
      },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "A straightforward enquiry path for occupied-site work.",
    steps: [
      "Tell us about the building and roof type",
      "Choose the service that best matches the work",
      "Share your timeline and access needs",
      "Add any useful photos or notes",
      "Arrange the next conversation",
    ],
  },
  coverage: {
    eyebrow: "Service area",
    title: "Based in Surrey and working across the county.",
    description:
      "Blenheim Roofing Services Ltd is based in Epsom, Surrey and the verified service area supplied for this project is Surrey.",
    areas: ["Surrey", "United Kingdom"],
  },
  contactSection: {
    eyebrow: "Contact",
    title: "Talk through the roof work you need.",
    description:
      "Use the demonstration form to outline the site, roof type and access requirements. It is for presentation only and does not send data.",
    formStatus: "Thanks - this is a demonstration enquiry form, so no message has been sent.",
  },
  quoteServices: [
    "Asbestos Cement Roof Removal",
    "Sheeting and Cladding",
    "High Performance Felt",
    "Single Ply",
    "Liquid Waterproofing",
    "Rooflight Replacement",
    "Maintenance",
    "Powered Access Equipment",
  ],
  quoteRequest: {
    eyebrow: "Quote request",
    title: "Tell Blenheim what the roof needs",
    helperText: "Add the useful details now so the first conversation is more specific. This form is for demonstration only.",
    preferredTimeframes: ["As soon as practical", "Within 1-3 months", "Within 3-6 months", "More than 6 months away"],
    preferredContactMethods: ["Phone", "Email"],
    beforeQuoteOptions: ["Request a call before quote", "Request email before quote"],
    fileLabel: "Roof photos / drawings",
    fileButtonText: "Choose files",
    fileEmptyText: "No files selected",
  },
  callsToAction: { quote: "Request a Quote", call: "Call Blenheim", email: "Email Blenheim" },
  footer: { location: "17 First Quarter, Blenheim Road, Epsom, Surrey KT19 9QN", socialLabel: "LinkedIn" },
  requiresConfirmation: [],
} satisfies ProspectSiteConfig;
