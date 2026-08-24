import type { ActRoofingSiteConfig } from "@/components/demo-sites/act-roofing/types";

const asset = (name: string) => `/assets/demo-act-roofing/${name}`;

export const actRoofingSite = {
  companyName: "ACT Roofing",
  seo: {
    title: "ACT Roofing | Roofing Services You Can Rely On",
    description:
      "New roofs, roof repairs, slate tiling, lead work and roofing maintenance from a local, family-run team.",
  },
  brand: {
    logo: {
      src: asset("act-roofing-logo-dark.png"),
      alt: "ACT Roofing white and green logo",
    },
    wordmark: {
      src: asset("act-roofing-logo-light.png"),
      alt: "ACT Roofing navy and green logo",
    },
    colors: {
      ink: "#0D1B2A",
      paper: "#F2F4F7",
      accent: "#2E7D32",
    },
  },
  contact: {
    location: "Bramfield",
    telephone: "0808 157 0426",
    telephoneHref: "tel:+448081570426",
    email: "hello@actroofing.example",
    socialLinks: [],
  },
  navigation: [
    { label: "Services", href: "#services" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ],
  mobileNavigation: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#projects" },
    { label: "Reviews", href: "#reviews" },
    { label: "About", href: "#about" },
    { label: "Areas", href: "#areas" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    eyebrow: "Local roofing services",
    title: "Reliable roofing, built to protect.",
    description:
      "New roofs, roof repairs, slate tiling, lead work and general roofing maintenance, delivered with clear communication and professional service.",
    image: {
      src: asset("roofers-hero.jpg"),
      alt: "Roofer carrying roof tiles across a pitched tiled roof",
    },
  },
  quoteModal: {
    toolTitle: "Get Preliminary Pricing",
    toolDescription:
      "Enter your roof measurements and get an instant preliminary price using ACT Roofing's products and pricing. Our tool calculates everything, including pitch if needed, and you can send the final result to ACT Roofing if you want.",
    formTitle: "Quick Quote Request",
    formDescription:
      "Send your project details to ACT Roofing and they'll prepare a quote for you, usually within a couple of days.",
  },
  about: {
    eyebrow: "About ACT Roofing",
    title: "Professional roofing support, centred on the customer.",
    paragraphs: [
      "ACT Roofing is a local, family-run roofing company, with work ranging from new roofs and repairs to slate tiling, lead work and general maintenance.",
      "The team's approach is courteous, professional service with reliable workmanship, clear answers and solutions shaped around each customer's needs.",
    ],
  },
  servicesIntro: {
    eyebrow: "Roofing services",
    title: "Practical support for roofs of every stage.",
    description:
      "From planned roofing work to repairs and ongoing maintenance, speak directly with ACT Roofing about the service your property needs.",
  },
  services: [
    {
      title: "New Roofs",
      summary:
        "Roofing support for new roof projects, with the scope discussed around your property and requirements.",
    },
    {
      title: "Roof Repairs",
      summary:
        "Repairs for roofing issues, helping to restore the affected area and protect the property.",
    },
    {
      title: "Slate Tiling",
      summary:
        "Slate tiling services for roofing projects where a durable, traditional finish is required.",
    },
    {
      title: "Lead Work",
      summary:
        "Lead work for roof details and vulnerable junctions where careful weatherproofing matters.",
    },
    {
      title: "Roofing Maintenance",
      summary:
        "General roofing maintenance to address wear and keep roof elements in serviceable condition.",
    },
  ],
  projectsIntro: {
    eyebrow: "Roofing work",
    title: "From roof preparation to the finished surface.",
    description:
      "A supplied example showing work in progress alongside a completed roof finish.",
  },
  projects: [
    {
      src: asset("roofing-work-example.jpg"),
      label: "Roof preparation and completed roofing",
      alt: "Roof membrane and battens being installed beside a completed dark tiled roof",
    },
  ],
  whyChoose: {
    eyebrow: "Why ACT Roofing",
    title: "Service shaped around your roofing needs.",
    description:
      "Professional service, teamwork and customer relationships sit at the centre of everything ACT Roofing does.",
    items: [
      "Courteous, professional service from enquiry onwards.",
      "Roofing solutions tailored to the customer's needs.",
      "Clear communication and answers to project questions.",
      "Customer satisfaction treated as a priority.",
    ],
  },
  testimonials: {
    eyebrow: "Customer feedback",
    title: "What homeowners say about ACT Roofing.",
    description:
      "Feedback from customers across the local area.",
    items: [
      {
        summary: "Quick and easy job. Prompt and polite. Great communication throughout.",
        source: "Catherine, Oakbridge",
      },
      {
        summary:
          "So easy to work with - called in the morning and the repair was done by the afternoon.",
        source: "Daniel, Langmoor",
      },
      {
        summary:
          "Replaced our slate roof ahead of schedule and left everything spotless. Would happily recommend.",
        source: "Priya, Milldale",
      },
    ],
  },
  process: {
    eyebrow: "Getting started",
    title: "A simple route to discussing your roof.",
    steps: [
      "Tell ACT Roofing what you need",
      "Share the property and project details",
      "Discuss the most suitable next step",
      "Review the proposed scope",
    ],
  },
  coverage: {
    eyebrow: "Areas covered",
    title: "Serving Bramfield and the surrounding towns.",
    description:
      "ACT Roofing works across the following local areas.",
    areas: [
      "Bramfield",
      "Oakbridge",
      "Langmoor",
      "Westbrook",
      "Milldale",
      "Ashcroft",
      "Fenwick Hollow",
    ],
  },
  contactSection: {
    eyebrow: "Contact",
    title: "Tell ACT Roofing about your project.",
    description:
      "Call, email or use the demonstration form to set out the roofing work you have in mind.",
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
      "Slate tiling",
      "Lead work",
      "Roofing maintenance",
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
    quote: "Request a Quote",
    call: "Call ACT Roofing",
    email: "Email ACT Roofing",
  },
  footer: {
    location: "Serving Bramfield and the surrounding area",
  },
} satisfies ActRoofingSiteConfig;
