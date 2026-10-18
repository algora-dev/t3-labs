import type { ActRoofingSiteConfig } from "../act-roofing/types";

const asset = (name: string) => `/assets/demo-roofline/${name}`;

export const rooflineSite = {
  companyName: "Roofline Canterbury",
  demoDisclaimer:
    "Demonstration website created for Roofline Canterbury to showcase website and tool design.",
  seo: {
    title: "Roofline Canterbury | Christchurch Roofing Experts & Manufacturers",
    description:
      "Canterbury owned and operated roofing manufacturer and roofing installation contractor. Get an instant roof estimate online in around 60 seconds.",
  },
  brand: {
    logo: {
      src: asset("branding.png"),
      alt: "Roofline Canterbury logo",
    },
    wordmark: {
      src: asset("branding.png"),
      alt: "Roofline Canterbury",
    },
    logoMark: {
      src: asset("branding.png"),
      alt: "Roofline Canterbury",
    },
    colors: {
      ink: "#111111",
      paper: "#F7F7F8",
      accent: "#C8102E",
    },
  },
  contact: {
    location: "Christchurch",
    telephone: "03 349 8439",
    telephoneHref: "tel:+6433498439",
    email: "enquiries@rooflinecanterbury.example",
    socialLinks: [],
  },
  navigation: [
    { label: "Home", href: "#top" },
    { label: "Our Products", href: "/demo/roofline-site/price-list" },
    { label: "Our Services", href: "#services" },
    { label: "Our Work", href: "#projects" },
    { label: "Free Roof Tools", href: "#estimate" },
    { label: "About", href: "#about" },
    { label: "Contact Us", href: "#contact" },
  ],
  mobileNavigation: [
    { label: "Home", href: "#top" },
    { label: "Our Products", href: "/demo/roofline-site/price-list" },
    { label: "Our Services", href: "#services" },
    { label: "Our Work", href: "#projects" },
    { label: "Free Roof Tools", href: "#estimate" },
    { label: "About", href: "#about" },
    { label: "Contact Us", href: "#contact" },
  ],
  featuredReview: {
    summary:
      "We use Roofline for all of our roof and flashing needs. They always deliver on time and to a high quality standard.",
    source: "Trade customer, Christchurch",
    rating: 5,
  },
  hero: {
    eyebrow: "Canterbury owned and operated since 1977",
    title: "Roofing and cladding, manufactured and installed locally.",
    description:
      "100% locally owned roofing and cladding manufacturer and installation contractor. We manufacture, supply and install long-run roofing and cladding from our own Christchurch factory, from small home renovations to large commercial developments.",
    image: {
      src: asset("hero-aerial-original.jpg"),
      alt: "Canterbury owned and operated roofing manufacturer and roofing installation contractor",
    },
    secondaryCta: {
      label: "View Products",
      href: "/demo/roofline-site/price-list",
    },
  },
  trustStrip: [
    { label: "40+ years in business" },
    { label: "Our own Christchurch factory" },
    { label: "100% locally owned" },
    { label: "Manufacturers and installers" },
  ],
  about: {
    eyebrow: "About Roofline Canterbury",
    title: "Personal service. Quality products. Local manufacturing.",
    paragraphs: [
      "Roofline Canterbury is a 100% locally owned and operated roofing and cladding manufacturer and roofing installation contractor. With over 40 years of experience, we understand the importance of personal service and quality products.",
      "We manufacture in our Christchurch factory, which enables unparalleled turnaround times and the right solution for your building needs. You deal with the same friendly team throughout the entire project.",
    ],
  },
  servicesIntro: {
    eyebrow: "Our solutions and services",
    title: "Everything your roof and walls need.",
    description:
      "Roofing, cladding, spouting or flashings. One local team to manufacture, supply and install.",
  },
  services: [
    {
      title: "New Roofing",
      summary:
        "Complete long-run steel roofs for new builds and renovations, manufactured to length in our own factory.",
      linkLabel: "Get an estimate",
      linkHref: "/demo/roofline-site/estimate",
      image: {
        src: asset("hero-roofing.jpg"),
        alt: "Completed long-run steel roof on a new residential build",
      },
    },
    {
      title: "Re-Roofing",
      summary:
        "Full roof replacements in corrugate or Roofdeck profiles, including underlay, flashings and safe removal of the old roof.",
      linkLabel: "Get an estimate",
      linkHref: "/demo/roofline-site/estimate",
      image: {
        src: asset("svc-reroofing.jpg"),
        alt: "Re-roofing work in progress on a residential property",
      },
    },
    {
      title: "Commercial Roofing",
      summary:
        "Large-scale roofing and cladding supply and installation for commercial and agricultural buildings.",
      linkLabel: "Get an estimate",
      linkHref: "/demo/roofline-site/estimate",
      image: {
        src: asset("svc-commercial.jpg"),
        alt: "Commercial building with a long-run metal roof",
      },
    },
    {
      title: "Wall Cladding",
      summary:
        "Roofline weatherboard and long-run wall cladding systems, manufactured and installed to suit your build.",
      linkLabel: "Find out more",
      linkHref: "/demo/roofline-site/price-list",
    },
    {
      title: "Spouting & Guttering",
      summary:
        "Fascia and quad spouting systems, gutters and downpipes in ColorCote finishes, made to length.",
      linkLabel: "Find out more",
      linkHref: "/demo/roofline-site/price-list",
      image: {
        src: asset("svc-spouting.jpg"),
        alt: "New spouting and guttering installation",
      },
    },
    {
      title: "Price Your Plans",
      summary:
        "Send us your house plans and we measure and price your roofing, cladding and spouting from the drawings.",
      linkLabel: "Contact us",
      linkHref: "#contact",
    },
  ],
  estimateTool: {
    eyebrow: "Instant roof estimate",
    title: "Know roughly what your new roof could cost.",
    description:
      "Choose a roof shape, approximate size and covering to explore quantities and indicative costs from our configured products.",
    benefits: [
      "A few simple choices",
      "No obligation",
      "Instant estimate",
      "Simple guided questions",
    ],
    ctaLabel: "Calculate My Roof Price",
    ctaHref: "/demo/roofline-site/estimate",
    previewSteps: [
      { label: "Choose your roof", hint: "Pick the closest shape, approximate footprint and slope" },
      { label: "Tell us about the job", hint: "New or replacement roof, storeys and preferred profile" },
      { label: "See your ballpark", hint: "See a clear ballpark range and request a proper quote" },
      { label: "Request a quote", hint: "Send your choices and price range to the Roofline team" },
    ],
    previewNote: "Guided entry - no technical knowledge needed. Review the assumptions, then refine your estimated measurements for a closer look.",
  },
  projectsIntro: {
    eyebrow: "Our work",
    title: "Manufactured here. Installed here.",
    description:
      "Long-run roofing and cladding manufactured in our Christchurch factory and installed by our own team.",
  },
  projects: [
    {
      src: asset("hero-aerial.jpg"),
      label: "Long-run roof installation - Canterbury",
      alt: "Aerial view of a completed long-run metal roof on a Canterbury building",
    },
    {
      src: asset("hero-roofing.jpg"),
      label: "New residential roofing solution",
      alt: "Completed long-run steel roof on a new residential build",
    },
  ],
  whyChoose: {
    eyebrow: "Why choose Roofline",
    title: "Local manufacturing. Personal service.",
    description:
      "We pride ourselves on personal service and faster turnaround times, from our family business to your project.",
    items: [
      "Manufacturing in our own Christchurch factory",
      "The same people throughout your whole project",
      "Family owned and Canterbury based since 1977",
      "One of NZ's largest roofing product ranges",
      "ColorCote and Zincalume product ranges",
      "Supply only, or supply and install",
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What our happy clients have to say.",
    description: "",
    items: [
      {
        summary:
          "We have been dealing with Roofline for over 25 years and we have received the same top service every time.",
        source: "Long-standing trade customer",
        rating: 5,
      },
      {
        summary:
          "Now they have their new machines the quality has been amazing. Their turnaround on flashings is prompt and they fit like a glove.",
        source: "Builder, Christchurch",
        rating: 5,
      },
      {
        summary:
          "We are always impressed with Roofline Canterbury's outstanding service and quality of product.",
        source: "Commercial client",
        rating: 5,
      },
      {
        summary:
          "Great service from a friendly team. I have used them for 20+ years now and occasionally check prices and they are never bettered.",
        source: "Homeowner, Canterbury",
        rating: 5,
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    title: "Simple from start to finish.",
    steps: [
      {
        title: "Tell us about your project",
        description: "Use the free estimate tools or contact the team.",
      },
      {
        title: "Get clear recommendations",
        description: "The right profile, gauge and colour, with clear pricing.",
      },
      {
        title: "We manufacture your roofing",
        description: "Made to length in our Christchurch factory with fast turnaround.",
      },
      {
        title: "We install, or supply your builder",
        description: "Our own installation team, or supply-only, delivered on time.",
      },
    ],
  },
  gallery: {
    title: "Recent projects",
    items: [
      {
        src: asset("hero-aerial.jpg"),
        alt: "Aerial view of a long-run metal roof on a Canterbury building",
      },
      {
        src: asset("hero-roofing.jpg"),
        alt: "Completed long-run steel roof on a residential build",
      },
      {
        src: asset("svc-reroofing.jpg"),
        alt: "Re-roofing work in progress",
      },
      {
        src: asset("svc-spouting.jpg"),
        alt: "New spouting and guttering installation",
      },
    ],
  },
  coverage: {
    eyebrow: "Service area",
    title: "Proudly Canterbury.",
    description:
      "Roofline Canterbury provides roofing and cladding services across Christchurch and the wider Canterbury region.",
    areas: [
      "Christchurch",
      "Selwyn",
      "Waimakariri",
      "Ashburton",
      "Rangiora",
      "Lincoln",
      "Rolleston",
      "Kaiapoi",
    ],
  },
  finalCta: {
    title: "Need help with your roof?",
    description:
      "Get an instant estimate online, send us your plans, or speak to our team about your project.",
    primaryLabel: "Get an Instant Estimate",
    secondaryLabel: "Contact Roofline",
  },
  contactSection: {
    eyebrow: "Contact",
    title: "Speak to our team.",
    description:
      "Call, email or use the demonstration form to tell us about your roofing or cladding project. You can attach your plans for pricing.",
    formStatus:
      "Thanks - this demonstration has validated your details successfully. Nothing has been sent or stored.",
    generalFormTitle: "Send a demonstration enquiry",
  },
  quoteRequest: {
    eyebrow: "Demonstration quote form",
    title: "Request a roofing quote",
    helperText:
      "This local demonstration validates the form but does not send or store any information.",
    projectTypes: [
      "New roof",
      "Re-roof",
      "Commercial roofing",
      "Wall cladding",
      "Spouting & guttering",
      "Asbestos removal",
      "Price my plans",
    ],
    beforeQuoteOptions: [
      "Request a call before a quote",
      "Request an email before a quote",
    ],
    fileLabel: "Attach plans, photos or documents",
    fileButtonText: "Choose files",
    fileEmptyText: "No file chosen",
  },
  callsToAction: {
    estimate: "Get an Instant Estimate",
    quote: "Request a Quote",
    call: "Call Roofline",
    email: "Email Roofline",
  },
  footer: {
    location: "Roofing and cladding services across Christchurch and Canterbury",
  },
  quoteModal: {
    toolTitle: "Get an Instant Roof Estimate",
    toolDescription:
      "Answer a few quick questions about your property and get an estimated price range instantly - no obligation.",
    formTitle: "Send a Quick Enquiry",
    formDescription:
      "Send your project details to our team and we'll come back to you, usually within one business day.",
  },
} satisfies ActRoofingSiteConfig;
