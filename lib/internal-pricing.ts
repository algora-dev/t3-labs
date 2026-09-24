export const INTERNAL_PRICING_VERSION = "2026-09-v0.2";

export type PriceOption = {
  id: string;
  label: string;
  description: string;
  setup: number;
  monthly: number;
};

export type PricingSelection = {
  estimateName: string;
  core: {
    measurement: boolean;
    takeoff: boolean;
    assistant: boolean;
  };
  catalogueSize: string;
  dataReadiness: string;
  pricingLogic: string;
  takeoffComplexity: string;
  assistantScope: string;
  tradeAccess: string;
  adminLevel: string;
  analyticsLevel: string;
  outputLevel: string;
  integrationLevel: string;
  customisationLevel: string;
  customDevelopment: string;
  supportLevel: string;
  manualSetupAdjustment: number;
  manualMonthlyAdjustment: number;
  internalNotes: string;
};

export type EstimateLine = {
  group: string;
  label: string;
  setup: number;
  monthly: number;
};

export type PricingEstimate = {
  version: string;
  setup: number;
  monthly: number;
  lines: EstimateLine[];
  mainFeatures: string[];
  notes: string[];
  normalisedSelection: PricingSelection;
};

const option = (
  id: string,
  label: string,
  description: string,
  setup: number,
  monthly = 0,
): PriceOption => ({ id, label, description, setup, monthly });

export const INTERNAL_PRICING = {
  platformMonthly: 99,
  core: {
    measurement: option(
      "measurement",
      "Measurement-to-price",
      "Known measurements into products, quantities, pricing and a useful output.",
      999,
      0,
    ),
    takeoff: option(
      "takeoff",
      "Digital takeoff",
      "Upload a plan or suitable image, measure it, then continue into the pricing workflow.",
      500,
      50,
    ),
    assistant: option(
      "assistant",
      "Smart Assistant",
      "Business-specific conversational guidance, pricing and qualified handoff capability.",
      999,
      99,
    ),
  },
  catalogueSize: [
    option("1-30", "1-30 products", "Base catalogue size.", 0, 0),
    option("31-100", "31-100 products", "Larger product catalogue and upkeep allowance.", 150, 15),
    option("101-250", "101-250 products", "Medium catalogue with added setup and support exposure.", 300, 30),
    option("251-500", "251-500 products", "Larger catalogue with more validation and upkeep.", 475, 50),
    option("501-1000", "501-1,000 products", "Large catalogue with higher ongoing support allowance.", 675, 75),
    option("1001-5000", "1,001-5,000 products", "Very large catalogue requiring more setup and platform support.", 1125, 130),
    option("5000+", "5,000+ products", "Enterprise-scale catalogue. Use as a ballpark before custom review.", 1875, 225),
  ],
  dataReadiness: [
    option("clean", "Clean structured data", "Products/prices supplied in a clean spreadsheet or structured source.", 0),
    option("minor", "Minor cleanup", "Some formatting, mapping or cleanup required before setup.", 150),
    option("mixed", "Multiple / mixed sources", "Information needs combining across spreadsheets, PDFs or other sources.", 375),
    option("significant", "Significant preparation", "Substantial extraction, cleanup or restructuring required.", 750),
  ],
  pricingLogic: [
    option("simple", "Simple", "Mostly product x quantity with straightforward rules.", 0, 0),
    option("standard", "Standard rules", "Waste, packaging, rounding or several common business rules.", 190, 15),
    option("advanced", "Advanced", "Multiple dependencies, product relationships or layered calculation logic.", 375, 30),
    option("complex", "Complex", "Business-specific pricing logic, multiple scenarios or more involved calculations.", 750, 55),
    option("bespoke", "Highly bespoke", "Extensive custom calculation logic or unusual commercial rules.", 1500, 95),
  ],
  takeoffComplexity: [
    option("standard", "Standard takeoff", "Core areas and standard lineal components.", 0, 0),
    option("extended", "Extended components", "Additional measurement types or custom components.", 190, 15),
    option("advanced", "Advanced takeoff", "More specialised measurement logic or workflows.", 375, 30),
    option("specialist", "Specialist / multi-stage", "Highly specific takeoff behaviour or multiple measurement stages.", 750, 55),
  ],
  assistantScope: [
    option("basic", "Q&A + handoff", "Approved answers, basic product guidance and qualified human handoff.", 0, 0),
    option("guidance", "Sales guidance", "Recommendations, clarification questions and stronger buying guidance.", 225, 20),
    option("pricing", "Pricing + estimates", "Assistant can work through pricing inputs and return useful estimates.", 375, 40),
    option("advanced", "Advanced multi-step sales flow", "Longer guided conversations, multiple product decisions and connected tools.", 750, 75),
    option("cross-system", "Cross-system assistant", "Advanced assistant connected to several tools, account states or workflows.", 1500, 115),
  ],
  tradeAccess: [
    option("none", "No trade / customer accounts", "Public or staff-only use.", 0, 0),
    option("basic", "Basic trade accounts", "Approved logins and trade pricing access.", 550, 55),
    option("tiers", "Trade tiers + saved jobs", "Multiple pricing tiers and repeat-user workflow.", 750, 75),
    option("customer-pricing", "Customer-specific pricing", "Individual pricing, account rules and richer saved activity.", 1125, 115),
    option("portal", "Advanced trade portal", "Broader account functionality, permissions and repeat-order workflows.", 1875, 170),
  ],
  adminLevel: [
    option("none", "No customer admin", "T3 manages configuration changes.", 0, 0),
    option("basic", "Basic admin", "Manage products and standard prices.", 375, 40),
    option("advanced", "Advanced admin", "Products, pricing, users, trade controls and more settings.", 750, 75),
    option("operations", "Operations workspace", "A broader internal workspace for jobs, staff actions and operational controls.", 1125, 115),
  ],
  analyticsLevel: [
    option("none", "No analytics layer", "Standard technical logging only.", 0, 0),
    option("basic", "Basic tracking", "Quote activity, usage and useful event tracking.", 375, 40),
    option("advanced", "Analytics + follow-up intelligence", "Commercial dashboards, product demand and follow-up opportunities.", 750, 75),
  ],
  outputLevel: [
    option("screen", "On-screen result", "Standard result/output experience.", 0, 0),
    option("branded", "Branded email / PDF", "A branded customer-facing result sent or downloaded.", 190, 10),
    option("quote-pack", "Formal quote pack", "More complete quote-ready documents and outputs.", 375, 20),
    option("advanced", "Advanced generated outputs", "Several output types, richer documents or custom generation rules.", 750, 40),
  ],
  integrationLevel: [
    option("none", "No external integration", "Standalone T3 workflow.", 0, 0),
    option("simple", "Simple webhook / email workflow", "Basic data handoff to an external destination.", 190, 15),
    option("standard", "One standard integration", "Connect one common CRM, accounting or business platform.", 550, 55),
    option("multiple", "Multiple / custom integrations", "Several systems or a more bespoke API connection.", 1125, 115),
    option("complex", "Complex integration layer", "High-complexity integration work or multiple critical systems.", 2250, 190),
  ],
  customisationLevel: [
    option("standard", "Standard branded framework", "T3 framework styled to the business brand.", 0, 0),
    option("minor", "Minor customisation", "Small layout, interaction or styling changes.", 190, 0),
    option("moderate", "Moderate bespoke UX", "Noticeably tailored screens, flow and interface behaviour.", 550, 0),
    option("bespoke", "Bespoke interface", "A substantially custom interface and customer journey.", 1125, 0),
    option("high", "Highly bespoke product", "Extensive custom UI/UX beyond the standard framework.", 2250, 0),
  ],
  customDevelopment: [
    option("none", "No additional custom development", "Covered by selected modules.", 0, 0),
    option("small", "Small custom requirement", "A focused piece of additional custom functionality.", 375, 0),
    option("medium", "Medium custom requirement", "A meaningful extra workflow or capability.", 1125, 40),
    option("large", "Large custom requirement", "A substantial custom workflow or internal system extension.", 2250, 75),
    option("major", "Major bespoke system work", "Large bespoke development component. Treat as a starting ballpark only.", 3750, 150),
  ],
  supportLevel: [
    option("self", "Self-managed", "Customer manages routine content/pricing changes where admin tools allow it.", 0, 0),
    option("standard", "Standard managed support", "Routine support and a modest allowance for ongoing assistance.", 0, 75),
    option("managed", "Managed", "More frequent help, changes and hands-on T3 involvement.", 0, 150),
    option("priority", "Priority managed", "Higher-touch support for more complex or business-critical implementations.", 0, 300),
  ],
} as const;

export function createDefaultPricingSelection(): PricingSelection {
  return {
    estimateName: "",
    core: { measurement: true, takeoff: false, assistant: false },
    catalogueSize: "1-30",
    dataReadiness: "clean",
    pricingLogic: "simple",
    takeoffComplexity: "standard",
    assistantScope: "basic",
    tradeAccess: "none",
    adminLevel: "none",
    analyticsLevel: "none",
    outputLevel: "screen",
    integrationLevel: "none",
    customisationLevel: "standard",
    customDevelopment: "none",
    supportLevel: "self",
    manualSetupAdjustment: 0,
    manualMonthlyAdjustment: 0,
    internalNotes: "",
  };
}

function getOption(options: readonly PriceOption[], id: string): PriceOption {
  const found = options.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown internal pricing option: ${id}`);
  return found;
}

function addLine(lines: EstimateLine[], group: string, item: PriceOption) {
  if (item.setup === 0 && item.monthly === 0) return;
  lines.push({ group, label: item.label, setup: item.setup, monthly: item.monthly });
}

export function calculateInternalPrice(input: PricingSelection): PricingEstimate {
  const selection: PricingSelection = {
    ...input,
    core: { ...input.core },
    manualSetupAdjustment: Number(input.manualSetupAdjustment) || 0,
    manualMonthlyAdjustment: Number(input.manualMonthlyAdjustment) || 0,
  };

  // Digital takeoff is an add-on to the measurement-to-price workflow.
  if (selection.core.takeoff) selection.core.measurement = true;

  const hasSystem =
    selection.core.measurement ||
    selection.core.assistant ||
    selection.adminLevel !== "none" ||
    selection.tradeAccess !== "none" ||
    selection.customDevelopment !== "none";

  if (!hasSystem) {
    return {
      version: INTERNAL_PRICING_VERSION,
      setup: 0,
      monthly: 0,
      lines: [],
      mainFeatures: [],
      notes: ["Select at least one core tool or custom requirement to create an estimate."],
      normalisedSelection: selection,
    };
  }

  const lines: EstimateLine[] = [];
  const mainFeatures: string[] = [];
  const notes: string[] = ["Internal ballpark only. Final scope and price should be reviewed before quoting."];

  lines.push({ group: "Platform", label: "Managed T3 platform", setup: 0, monthly: INTERNAL_PRICING.platformMonthly });

  if (selection.core.measurement) {
    addLine(lines, "Core tools", INTERNAL_PRICING.core.measurement);
    mainFeatures.push(INTERNAL_PRICING.core.measurement.label);
  }
  if (selection.core.takeoff) {
    addLine(lines, "Core tools", INTERNAL_PRICING.core.takeoff);
    mainFeatures.push(INTERNAL_PRICING.core.takeoff.label);
  }
  if (selection.core.assistant) {
    addLine(lines, "Core tools", INTERNAL_PRICING.core.assistant);
    mainFeatures.push(INTERNAL_PRICING.core.assistant.label);
    notes.push("Smart Assistant usage / model costs are variable and are not included in the fixed monthly figure.");
  }

  const catalogue = getOption(INTERNAL_PRICING.catalogueSize, selection.catalogueSize);
  const data = getOption(INTERNAL_PRICING.dataReadiness, selection.dataReadiness);
  const logic = getOption(INTERNAL_PRICING.pricingLogic, selection.pricingLogic);
  addLine(lines, "Catalogue", catalogue);
  addLine(lines, "Data", data);
  addLine(lines, "Pricing logic", logic);
  if (catalogue.id !== "1-30") mainFeatures.push(catalogue.label);
  if (logic.id !== "simple") mainFeatures.push(logic.label + " pricing logic");

  if (selection.core.takeoff) {
    const takeoff = getOption(INTERNAL_PRICING.takeoffComplexity, selection.takeoffComplexity);
    addLine(lines, "Digital takeoff", takeoff);
    if (takeoff.id !== "standard") mainFeatures.push(takeoff.label);
  }

  if (selection.core.assistant) {
    const assistant = getOption(INTERNAL_PRICING.assistantScope, selection.assistantScope);
    addLine(lines, "Smart Assistant", assistant);
    if (assistant.id !== "basic") mainFeatures.push(assistant.label);
  }

  const trade = getOption(INTERNAL_PRICING.tradeAccess, selection.tradeAccess);
  const admin = getOption(INTERNAL_PRICING.adminLevel, selection.adminLevel);
  const analytics = getOption(INTERNAL_PRICING.analyticsLevel, selection.analyticsLevel);
  const output = getOption(INTERNAL_PRICING.outputLevel, selection.outputLevel);
  const integration = getOption(INTERNAL_PRICING.integrationLevel, selection.integrationLevel);
  const customisation = getOption(INTERNAL_PRICING.customisationLevel, selection.customisationLevel);
  const customDev = getOption(INTERNAL_PRICING.customDevelopment, selection.customDevelopment);
  const support = getOption(INTERNAL_PRICING.supportLevel, selection.supportLevel);

  addLine(lines, "Accounts", trade);
  addLine(lines, "Admin", admin);
  addLine(lines, "Analytics", analytics);
  addLine(lines, "Outputs", output);
  addLine(lines, "Integrations", integration);
  addLine(lines, "Customisation", customisation);
  addLine(lines, "Custom development", customDev);
  addLine(lines, "Support", support);

  for (const item of [trade, admin, analytics, output, integration, customisation, customDev, support]) {
    if (item.setup !== 0 || item.monthly !== 0) mainFeatures.push(item.label);
  }

  if (selection.manualSetupAdjustment !== 0 || selection.manualMonthlyAdjustment !== 0) {
    lines.push({
      group: "Manual adjustment",
      label: "Internal adjustment",
      setup: selection.manualSetupAdjustment,
      monthly: selection.manualMonthlyAdjustment,
    });
  }

  const setup = Math.max(0, lines.reduce((sum, line) => sum + line.setup, 0));
  const monthly = Math.max(0, lines.reduce((sum, line) => sum + line.monthly, 0));

  return {
    version: INTERNAL_PRICING_VERSION,
    setup,
    monthly,
    lines,
    mainFeatures: [...new Set(mainFeatures)].slice(0, 8),
    notes,
    normalisedSelection: selection,
  };
}
