/**
 * Practical, service-specific guidance for a roofing business owner.
 * These are checklists and example workflows, NOT invented customer case studies,
 * measured customer results, or descriptions of unverified product functions.
 */
export type ServiceGuide = {
  headline: string;
  introduction: string;
  inputsTitle: string;
  inputs: string[];
  stepsTitle: string;
  steps: { heading: string; body: string }[];
  decision: string;
  measurement: string;
  deeperReading?: { href: string; label: string };
};

export const SERVICE_GUIDES: Record<string, ServiceGuide> = {
  "roofing-website-design": {
    headline: "A roofing website should answer the questions that lead to a good enquiry.",
    introduction: "Before commissioning another redesign, test one of your most important services as if you were a homeowner who has never heard of your company.",
    inputsTitle: "What a useful roofing service page needs",
    inputs: [
      "The job type and materials you actually work with, explained in customer language.",
      "The suburbs, towns or service area you genuinely cover—without invented location pages.",
      "Real work examples with permission, plus the limits of the service and what happens next.",
      "A usable mobile enquiry path that asks enough to respond, but not enough to discourage contact.",
    ],
    stepsTitle: "A 3-minute mobile check",
    steps: [
      { heading: "Find the right service", body: "Open the site on a phone. Can a visitor find reroofing, repairs or commercial roofing without guessing which menu to use?" },
      { heading: "Find a reason to trust you", body: "Check for identifiable projects, clear service areas, an explanation of your process and genuine contact details—not generic stock claims." },
      { heading: "Complete the enquiry", body: "Try the form yourself. Does the team receive the service requested, location, preferred contact method and enough context to respond?" },
    ],
    decision: "If the content and form are the weak points, fix them before paying for a new platform. Rebuild when the current site genuinely prevents fast, accessible improvements.",
    measurement: "Measure qualified enquiries per relevant service-page visit, with mobile form completion and job suitability reviewed alongside raw traffic.",
    deeperReading: { href: "/roofing-seo", label: "How search visibility and lead quality fit together" },
  },
  "roofing-seo": {
    headline: "A better roofing lead starts with a better match between the search and the service.",
    introduction: "Roofing SEO is not just more traffic. A roof replacement enquiry in your real service area can be worth more than dozens of visits for work you do not provide.",
    inputsTitle: "What to define before optimising",
    inputs: [
      "Your priority services: repair, reroofing, new builds, commercial work, cladding or specific materials.",
      "Real service areas and the projects you will and will not travel for.",
      "Questions customers ask before hiring: price factors, materials, timescales, access and next steps.",
      "Your definition of a qualified lead—not just a contact-form submission.",
    ],
    stepsTitle: "Trace one real search to one real enquiry",
    steps: [
      { heading: "Choose a service-area combination", body: "Start with a job type you genuinely want and a location you actually serve. Avoid cloning thin pages for dozens of towns." },
      { heading: "Answer the intent on the page", body: "The title, heading and visible content should make the service, suitability, service area and next action clear. Include original work where available." },
      { heading: "Check the enquiry quality", body: "Review search queries, call or form source, location, job type and whether the team could price or pursue the lead—not just click totals." },
    ],
    decision: "If people cannot find you, address visibility and crawlability. If they arrive but do not enquire, address clarity and trust. If enquiries are unsuitable, refine targeting and qualification.",
    measurement: "Review GSC impressions and clicks together with qualified roofing enquiries by page, location and job type; don't treat rankings as a sales result by themselves.",
    deeperReading: { href: "/roofing-website-design", label: "Improve the page after a visitor lands" },
  },
  "roofing-website-estimators": {
    headline: "Answer the price question without pretending every roof is the same.",
    introduction: "A homeowner-facing estimate is an early conversation aid. It should explain its assumptions, gather useful details and invite a site-specific review, not masquerade as a binding roofing quote.",
    inputsTitle: "Inputs worth discussing with the estimator owner",
    inputs: [
      "Job category: repair, replacement or new roof, with clear exclusions.",
      "An understandable area or roof-size estimate and any known pitch, material and access constraints.",
      "The contractor's own rules for indicative pricing, uncertainty and minimum jobs.",
      "Contact details and project context only when the customer chooses to enquire.",
    ],
    stepsTitle: "A responsible indicative-pricing flow",
    steps: [
      { heading: "Ask only what a visitor can know", body: "Use diagrams or plain-English options for roof shape and size; do not require precise technical measurements from a homeowner." },
      { heading: "Explain the range", body: "Show what the indicative figure assumes and what could materially change it: access, existing roof condition, material, pitch and unforeseen work." },
      { heading: "Carry the answers into an enquiry", body: "With consent, pass selected answers to the roofing team so the first call can focus on the unknowns and next inspection step." },
    ],
    decision: "Use an estimator to qualify initial interest. Keep final job pricing subject to inspection, verified measurements, product choices and the contractor's approval.",
    measurement: "Track estimator starts, useful completions, opt-in enquiries and the proportion that match your actual service area and project types.",
    deeperReading: { href: "/roofing-quoting-software", label: "How an enquiry becomes a contractor-reviewed quote" },
  },
  "roofing-quoting-software": {
    headline: "Measure once, price consistently and review before sending.",
    introduction: "A quoting workflow can be modest—a better spreadsheet—or a connected system. QuoteCore+ is a real T3 Labs product showing how measured roofing geometry can feed reusable pricing rules and commercial documents.",
    inputsTitle: "The information a roofer needs to price a job",
    inputs: [
      "Verified roof areas and lineal edges: ridges, hips, valleys, barges and other applicable details.",
      "Material choices, coverage, pack sizes, waste assumptions and current supplier costs.",
      "Labour allowances, access, subcontractors, margin rules and job-specific exceptions.",
      "A named reviewer and approval step before a customer-facing price is issued.",
    ],
    stepsTitle: "An example takeoff-to-quote workflow",
    steps: [
      { heading: "Verify the measurements", body: "Calibrate the plan or enter site dimensions; check roof planes and edge types. AI-assisted suggestions still require a human verifier." },
      { heading: "Apply your own components", body: "Map area and lineal measurements to appropriate material, waste, labour and selling-price rules, then inspect unusual or missing quantities." },
      { heading: "Generate, review and follow up", body: "Build the proposal from the checked quantities; confirm scope and exclusions, then keep a clear record of quote status and next contact." },
    ],
    decision: "The best tool is the one that eliminates the slowest repeated handoff without removing necessary trade judgement. A working component library also takes setup and ongoing price maintenance.",
    measurement: "Time measure-to-quote, manual re-entry incidents, quote revisions, and accepted versus issued quotes—reviewed by job type and value.",
    deeperReading: { href: "/case-studies/quotecore", label: "See the implemented QuoteCore+ workflow" },
  },
  "roofing-ai-website-assistants": {
    headline: "Give reliable answers—and know when not to answer.",
    introduction: "The useful part of a roofing website assistant is the approved information and the hand-off rules. It should not guess a price, promise an installation date or diagnose a leak from a short chat.",
    inputsTitle: "The approved information to prepare",
    inputs: [
      "Current service types, materials and genuine coverage areas.",
      "Public answers about inspections, availability process, indicative pricing factors and warranties—reviewed by the business.",
      "Clear escalation triggers: safety questions, hidden damage, unusual roofs, final pricing and complaints.",
      "A consent-aware enquiry handoff with only the details the team needs.",
    ],
    stepsTitle: "Three conversation tests before launch",
    steps: [
      { heading: "A question it can answer", body: "‘Do you work on metal roofs in my suburb?’ It should answer only from your approved service and location information." },
      { heading: "A question it must qualify", body: "‘What will my reroof cost?’ It can explain price factors or offer an indicative estimator, but not invent a binding quote." },
      { heading: "A question it should hand over", body: "‘My roof is leaking near electrical fittings.’ It should avoid unsafe troubleshooting and direct the person to appropriate human help." },
    ],
    decision: "Start with a small, reviewed set of real customer questions. Test incorrect, incomplete and out-of-scope questions before increasing the assistant's autonomy.",
    measurement: "Approved-answer accuracy, escalations, qualified enquiries transferred, and unanswered or misleading responses found during reviews.",
    deeperReading: { href: "/roofing-website-estimators", label: "Pair approved answers with indicative price guidance" },
  },
  "roofing-business-automation": {
    headline: "Automate the handoffs you can explain and check.",
    introduction: "Automation earns its place when the job details remain accurate and the team can see what happened. Start with a common repeat task before replacing the business's existing systems.",
    inputsTitle: "What to map first",
    inputs: [
      "Trigger: an enquiry arrives, a quote is issued, a status changes or an approval is recorded.",
      "Owner: the person responsible if the automated step fails or needs judgement.",
      "Data: customer contact, job address, products and status—with access limited appropriately.",
      "Exception: what happens when details are missing, a supplier changes pricing or a customer opts out.",
    ],
    stepsTitle: "Example: follow up a roofing quote without losing control",
    steps: [
      { heading: "Record the quote being sent", body: "Store the sent date, job reference and responsible person once, instead of retyping it in an unrelated tracker." },
      { heading: "Make the next step visible", body: "Create a reminder or draft when no response is recorded. Keep consent, timing and customer preferences in mind." },
      { heading: "Close the loop", body: "When the job is accepted, declined or postponed, update the workflow and stop inappropriate follow-ups." },
    ],
    decision: "A reminder with a clear owner may be more valuable than a complex integration. Only automate outbound messages when the business approves the wording and timing.",
    measurement: "Hours spent on repeated entry, missed follow-ups, exceptions requiring manual correction and quote statuses that reach a definite outcome.",
    deeperReading: { href: "/custom-roofing-software", label: "When an existing tool needs a focused custom connection" },
  },
};
