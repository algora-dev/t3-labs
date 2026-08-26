import type { ActRoofingSiteConfig } from "./types";

const asset = (name: string) => `/assets/demo-act-roofing/${name}`;

export const actRoofingSite = {
  companyName: "Apex Roofing",
  demoDisclaimer:
    "Demonstration website — Apex Roofing is a fictional business created to showcase website and tool design.",
  seo: {
    title: "Apex Roofing | Roofing Done Properly",
    description:
      "Roof replacements, repairs and specialist roofing work carried out by a trusted local team. Get an instant roof estimate online in around 60 seconds.",
  },
  brand: {
    logo: {
      src: asset("ApexLogoWhite---f166f5cd-ea1d-4d9c-86d4-f2e3dc127812.png"),
      alt: "Apex Roofing logo",
    },
    wordmark: {
      src: asset("ApexLogoBlack---ae397798-5fc2-4f9a-9c88-5c1e394f7e69.png"),
      alt: "Apex Roofing",
    },
    colors: {
      ink: "#101828",
      paper: "#F7F8FA",
      accent: "#1769E0",
    },
  },
  contact: {
    location: "Leeds",
    telephone: "0808 157 0426",
    telephoneHref: "tel:+448081570426",
    email: "hello@apexroofing.example",
    socialLinks: [],
  },
  navigation: [
    { label: "Home", href: "#top" },
    { label: "Services", href: "#services" },
    { label: "Our Work", href: "#projects" },
    { label: "Roof Estimate", href: "#estimate" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  mobileNavigation: [
    { label: "Home", href: "#top" },
    { label: "Services", href: "#services" },
    { label: "Our Work", href: "#projects" },
    { label: "Roof Estimate", href: "#estimate" },
    { label: "Reviews", href: "#reviews" },
    { label: "Areas", href: "#areas" },
    { label: "Contact", href: "#contact" },
  ],
  featuredReview: {
    summary:
      "Replaced our full slate roof in nine days. Neat, tidy and exactly the price they quoted. Easily the best trades experience we've had.",
    source: "Sarah T. — Leeds",
    rating: 5,
  },
  hero: {
    eyebrow: "Trusted local roofing specialists",
    title: "Roofing built to protect what matters.",
    description:
      "Roof replacements, repairs and specialist roofing work carried out by a trusted local team.",
    image: {
      src: asset("apex-hero.webp"),
      alt: "Completed dark slate roof on an attractive UK residential home",
    },
    secondaryCta: {
      label: "View Our Work",
      href: "#projects",
    },
  },
  trustStrip: [
    { label: "4.9 customer rating" },
    { label: "500+ roofs completed" },
    { label: "Fully insured" },
    { label: "10-year workmanship guarantee" },
  ],
  about: {
    eyebrow: "About Apex Roofing",
    title: "Roofing done properly.",
    paragraphs: [
      "From small repairs to complete roof replacements, we combine experienced workmanship with straightforward communication from start to finish.",
      "No chasing. No surprises. Just a properly managed roofing job, delivered by a team that treats your home with respect.",
    ],
  },
  servicesIntro: {
    eyebrow: "Roofing services",
    title: "Everything your roof needs.",
    description:
      "One trusted local team for new roofs, repairs and specialist roofing work.",
  },
  services: [
    {
      title: "New Roofs",
      summary:
        "Complete roof replacements built to last, using quality materials and experienced workmanship.",
      linkLabel: "Find out more",
    },
    {
      title: "Roof Repairs",
      summary:
        "Fast, effective repairs for leaks, slipped tiles and storm damage — sorted before they get worse.",
      linkLabel: "Find out more",
    },
    {
      title: "Flat Roofing",
      summary:
        "Modern flat roofing systems installed and maintained for lasting weather protection.",
      linkLabel: "Find out more",
    },
    {
      title: "Slate & Tiling",
      summary:
        "Traditional slate and tile work, finished to a standard you can be proud of.",
      linkLabel: "Find out more",
    },
    {
      title: "Leadwork & Chimneys",
      summary:
        "Careful leadwork and chimney repairs where good weatherproofing matters most.",
      linkLabel: "Find out more",
    },
    {
      title: "Inspections & Maintenance",
      summary:
        "Regular roof inspections and maintenance that keep small issues from becoming big bills.",
      linkLabel: "Find out more",
    },
  ],
  estimateTool: {
    eyebrow: "Instant roof estimate",
    title: "Know roughly what your new roof could cost.",
    description:
      "Answer a few quick questions about your property and get an estimated price range instantly.",
    benefits: [
      "Takes around 60 seconds",
      "No obligation",
      "Instant estimate",
      "Simple guided questions",
    ],
    ctaLabel: "Calculate My Roof Price",
    ctaHref: "/takeoff",
    previewSteps: [
      "Property type",
      "Roof type",
      "Approximate size",
      "Get estimate",
    ],
    previewNote: "Guided questions — no measurements or technical knowledge needed.",
  },
  projectsIntro: {
    eyebrow: "Our work",
    title: "Quality you can see.",
    description:
      "A complete slate roof replacement completed by the Apex Roofing team.",
  },
  projects: [
    {
      src: asset("apex-aerial.webp"),
      label: "Complete slate roof replacement — Leeds",
      alt: "Aerial view of a completed dark slate roof on a UK residential property",
    },
  ],
  whyChoose: {
    eyebrow: "Why choose Apex",
    title: "Straightforward advice. Reliable workmanship.",
    description:
      "We keep it simple: clear communication, quality materials and a job finished properly.",
    items: [
      "Experienced roofing team",
      "Clear, upfront communication",
      "Fully insured work",
      "Reliable scheduling",
      "Quality materials",
      "Clean, respectful workmanship",
    ],
  },
  testimonials: {
    eyebrow: "Customer reviews",
    title: "Trusted by homeowners.",
    description: "",
    items: [
      {
        summary:
          "From the first call to the final clean-up, the whole team were brilliant. The new slate roof looks fantastic and they left the place spotless.",
        source: "Sarah T. — Leeds",
        rating: 5,
      },
      {
        summary:
          "Had a leak two days before Christmas. They came out, found the problem and fixed it the same morning. Can't ask for more than that.",
        source: "James H. — Harrogate",
        rating: 5,
      },
      {
        summary:
          "Really clear from start to finish. The estimate tool gave us a sensible ballpark, the final price matched, and the job ran exactly to plan.",
        source: "Priya M. — Wakefield",
        rating: 5,
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    title: "Simple from start to finish.",
    steps: [
      {
        title: "Tell us about your roof",
        description: "Use the estimator or contact the team.",
      },
      {
        title: "Get clear recommendations",
        description: "Straightforward guidance and pricing.",
      },
      {
        title: "We complete the work",
        description: "A professional team carries out the job with minimal disruption.",
      },
    ],
  },
  gallery: {
    title: "Recent projects",
    items: [
      {
        src: asset("apex-project-2.webp"),
        alt: "UK terraced home with a freshly completed clay tiled roof",
      },
      {
        src: asset("apex-aerial.webp"),
        alt: "Aerial view of a completed dark slate roof",
      },
      {
        src: asset("apex-roofer.webp"),
        alt: "Apex Roofing team member laying natural slate tiles",
      },
      {
        src: asset("apex-hero.webp"),
        alt: "Completed slate roof on a UK residential home",
      },
    ],
  },
  coverage: {
    eyebrow: "Service area",
    title: "Local roofing specialists.",
    description:
      "Apex Roofing provides roofing services across Leeds and surrounding areas.",
    areas: [
      "Leeds",
      "Harrogate",
      "Wakefield",
      "Bradford",
      "Horsforth",
      "Wetherby",
      "Otley",
      "Pudsey",
    ],
  },
  finalCta: {
    title: "Need help with your roof?",
    description:
      "Get an instant estimate online or speak to our team about your roofing project.",
    primaryLabel: "Get an Instant Estimate",
    secondaryLabel: "Contact Apex Roofing",
  },
  contactSection: {
    eyebrow: "Contact",
    title: "Speak to our team.",
    description:
      "Call, email or use the demonstration form to tell us about the roofing work you have in mind.",
    formStatus:
      "Thanks — this demonstration has validated your details successfully. Nothing has been sent or stored.",
    generalFormTitle: "Send a demonstration enquiry",
  },
  quoteRequest: {
    eyebrow: "Demonstration quote form",
    title: "Request a roofing quote",
    helperText:
      "This local demonstration validates the form but does not send or store any information.",
    projectTypes: [
      "New roof",
      "Roof repair",
      "Flat roofing",
      "Slate & tiling",
      "Leadwork & chimneys",
      "Inspection & maintenance",
    ],
    beforeQuoteOptions: [
      "Request a call before a quote",
      "Request an email before a quote",
    ],
    fileLabel: "Attach roof photos or documents",
    fileButtonText: "Choose files",
    fileEmptyText: "No file chosen",
  },
  callsToAction: {
    estimate: "Get an Instant Estimate",
    quote: "Request a Quote",
    call: "Call Apex Roofing",
    email: "Email Apex Roofing",
  },
  footer: {
    location: "Roofing services across Leeds and surrounding areas",
  },
  quoteModal: {
    toolTitle: "Get an Instant Roof Estimate",
    toolDescription:
      "Answer a few quick questions about your property and get an estimated price range instantly — no obligation.",
    formTitle: "Send a Quick Enquiry",
    formDescription:
      "Send your project details to our team and we'll come back to you, usually within a couple of days.",
  },
} satisfies ActRoofingSiteConfig;
