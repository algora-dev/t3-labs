export const falcon = {
  companyName: "Falcon Contracting Ltd",
  location: "Long Green, Essex, United Kingdom",
  telephone: "07921 914875",
  telephoneHref: "tel:+447921914875",
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
      title: "New Roofs & Reroofing",
      summary: "New roof installations and replacement roof coverings for residential and commercial properties.",
      image: "/assets/falcon/tiled-roof-valley.png",
    },
    {
      title: "Roof Repairs",
      summary: "Repairs for leaks, damaged roof coverings and general roofing defects.",
      image: "/assets/falcon/roof-window-flashing.png",
    },
    {
      title: "Flat Roofing",
      summary: "Flat roofing for extensions, refurbishment projects and other suitable properties.",
      image: "/assets/falcon/flat-roof-detailing.png",
    },
    {
      title: "Refurbishment",
      summary: "Roofing and external refurbishment work for existing buildings.",
      image: "/assets/falcon/new-tiled-roof-brickwork.png",
    },
    {
      title: "Extensions & Loft Conversions",
      summary: "Roofing and construction support for extension and loft-conversion projects.",
      image: "/assets/falcon/residential-build-roofing.png",
    },
    {
      title: "Commercial Roofing & Construction",
      summary: "Roofing and construction work for commercial properties and larger projects.",
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
    "Roofing and construction services from one contractor.",
    "Experience across residential, commercial and refurbishment work.",
    "Clear communication around quotations, scheduling and next steps.",
    "Genuine examples of recent Falcon projects.",
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
      source: "Customer feedback via Checkatrade",
    },
    {
      summary: "Clear communication throughout the job and a good finish on the completed work.",
      source: "Customer feedback via Checkatrade",
    },
    {
      summary: "Helpful advice, reliable attendance and care taken around the property.",
      source: "Customer feedback via Checkatrade",
    },
  ],
};

export type FalconContent = typeof falcon;
