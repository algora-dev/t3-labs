export const falcon = {
  companyName: "Falcon Contracting Ltd",
  location: "Long Green, Essex, United Kingdom",
  telephone: "+44 792 191 4875",
  email: "",
  linkedinUrl: "https://www.linkedin.com/company/falconcontracting/",
  checkatradeUrl: "https://www.checkatrade.com/trades/falconcontractingltd987912",
  coverage: ["Long Green", "Colchester", "Essex", "London", "East of England", "Home Counties"],
  ctas: {
    quote: "Request a Quote",
    call: "Call Falcon",
    email: "Email Falcon",
  },
  requiresConfirmation: [
    "LinkedIn public profile: Colchester, Essex; construction; 18 years' experience; London, East of England and Home Counties coverage.",
    "Provided business wording: Long Green base and new roofs positioning.",
    "Checkatrade public profile: Falcon Contracting Ltd profile in Colchester with customer feedback excerpts.",
    "Review summaries should be approved by Falcon before public launch.",
    "Email address and any registered trading address should be confirmed before adding them.",
    "Form delivery needs a real provider before the enquiry form can send messages.",
  ],
  services: [
    {
      title: "New Roofs",
      summary: "Durable new roof installations for ageing structures, replacement projects and build-from-scratch roofing work.",
      image: "/assets/falcon/tiled-roof-valley.png",
    },
    {
      title: "Roof Repairs",
      summary: "Practical repair work, roof window detailing, leadwork and weathering details where a focused roofing fix is needed.",
      image: "/assets/falcon/roof-window-flashing.png",
    },
    {
      title: "Flat Roofing",
      summary: "Flat roof coverings and perimeter detailing for extensions, terraces and refurbishment work.",
      image: "/assets/falcon/flat-roof-detailing.png",
    },
    {
      title: "Reroofing",
      summary: "Replacement roof coverings and upgraded roof finishes, presented with clear staging and practical site planning.",
      image: "/assets/falcon/new-tiled-roof-brickwork.png",
    },
    {
      title: "Refurbishment",
      summary: "Building fabric improvements and exterior refurbishment work alongside roofing and construction packages.",
      image: "/assets/falcon/residential-build-roofing.png",
    },
    {
      title: "Extensions and Loft Conversions",
      summary: "Construction-led home improvement projects where roofing, structure and finish need to work together.",
      image: "/assets/falcon/dormer-roof-construction.png",
    },
    {
      title: "Residential Construction",
      summary: "Domestic construction projects, roof structures, dormers and external works for homes across the region.",
      image: "/assets/falcon/slate-roof-dormer.png",
    },
    {
      title: "Commercial Work",
      summary: "Larger-scale roofing and construction capability for commercial and community buildings.",
      image: "/assets/falcon/large-commercial-metal-roof.png",
    },
  ],
  projectImages: [
    {
      src: "/assets/falcon/standing-seam-pyramid-roof.png",
      label: "Standing Seam Roofing",
      alt: "Standing seam metal roof installation by Falcon Contracting",
    },
    {
      src: "/assets/falcon/commercial-roof-overview.png",
      label: "Commercial Roofing",
      alt: "Large commercial roof project with scaffolding around the building",
    },
    {
      src: "/assets/falcon/residential-build-roofing.png",
      label: "Residential Construction",
      alt: "Residential construction project with roof tiles and scaffold in place",
    },
    {
      src: "/assets/falcon/slate-roof-dormer.png",
      label: "Residential Roofing",
      alt: "Grey tiled roof and dormer detailing on a residential property",
    },
    {
      src: "/assets/falcon/roof-window-flashing.png",
      label: "Roof Window Detailing",
      alt: "Roof window flashing and tiled roof detailing",
    },
    {
      src: "/assets/falcon/tiled-roof-valley.png",
      label: "Roof Valley Work",
      alt: "Clay tiled roof valley with grey waterproofing detail",
    },
    {
      src: "/assets/falcon/new-tiled-roof-brickwork.png",
      label: "Reroofing",
      alt: "New clay tiled roof on a brick property",
    },
    {
      src: "/assets/falcon/flat-roof-detailing.png",
      label: "Flat Roofing",
      alt: "Flat roof and weathering detail beside brickwork",
    },
  ],
  whyChoose: [
    "Roofing and construction handled with a practical, site-led approach.",
    "Experience across residential, commercial, refurbishment and new build work.",
    "Clear conversations around scope, quotation, scheduling and next steps.",
    "Recent project photography showing real roof finishes, detailing and construction work.",
  ],
  process: [
    "Discuss the project",
    "Arrange a site visit or consultation",
    "Receive a quotation",
    "Schedule the work",
    "Complete the project",
  ],
  reviews: [
    {
      summary: "Professional, punctual and tidy, with the work completed to a high standard.",
      source: "Customer feedback published on Checkatrade",
    },
    {
      summary: "Clear communication throughout the job and a good finish on the completed work.",
      source: "Customer feedback published on Checkatrade",
    },
    {
      summary: "Helpful advice, reliable attendance and care taken around the property.",
      source: "Customer feedback published on Checkatrade",
    },
  ],
};

export type FalconContent = typeof falcon;
