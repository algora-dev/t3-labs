// ../core/src/types.ts
var DEFAULT_CAPABILITIES = {
  knownPriceEntries: false,
  fixedQuantityComponents: false,
  resultUrls: false,
  draftPersistence: false,
  leaveWarning: false,
  supplierSelection: false
};

// ../core/src/calc.ts
var COMPONENT_DEFS = {
  roof_area: { label: "Roof Area", unit: "m\xB2", pitchType: "rafter", colour: "#3B82F6", description: "The total surface area of all roof planes. Calculated from your plan dimensions and roof pitch." },
  ridge: { label: "Ridges", unit: "m", pitchType: "none", colour: "#22C55E", description: "The horizontal line at the top of a roof where two roof slopes meet - the peak of the roof." },
  hip: { label: "Hip", unit: "m", pitchType: "hip_valley", colour: "#EF4444", description: "The angled line where two roof slopes meet on an external corner. Runs from the ridge down to the eaves." },
  valley: { label: "Valley", unit: "m", pitchType: "hip_valley", colour: "#EAB308", description: "The angled line where two roof slopes meet on an internal corner. Water flows into valleys. Runs from ridge down to the eaves." },
  barge: { label: "Barge", unit: "m", pitchType: "rafter", colour: "#A855F7", description: "The sloped edge of the roof at a gable end. Also called a rafter edge, rake or verge. Runs from the ridge down to the eaves at the side of the roof." },
  spouting: { label: "Spouting", unit: "m", pitchType: "none", colour: "#64748B", description: "The gutter system along the bottom edge of the roof. Measured along the eaves where water runs off." },
  underlay: { label: "Underlay", unit: "m\xB2", pitchType: "rafter", colour: "#0EA5E9", description: "A secondary layer that goes under the main roofing material. Measured by area, same pitch calculation as roof area." },
  fixings: { label: "Fixings", unit: "m\xB2", pitchType: "rafter", colour: "#F59E0B", description: "Nails, screws, and clips used to secure the roof covering. Priced per area squared, same pitch calculation as roof area." }
};
var BUILT_IN_ORDER = ["roof_area", "ridge", "hip", "valley", "barge", "spouting", "underlay", "fixings"];
var RAD = Math.PI / 180;
function rafterPitchFactor(degrees) {
  if (!degrees || degrees <= 0 || degrees >= 90) return 1;
  return 1 / Math.cos(degrees * RAD);
}
function hipValleyPitchFactor(degrees) {
  if (!degrees || degrees <= 0 || degrees >= 90) return 1;
  const tangent = Math.tan(degrees * RAD);
  return Math.sqrt(1 + tangent * tangent / 2);
}
function pitchFactor(degrees, pitchType) {
  if (pitchType === "none") return 1;
  if (pitchType === "hip_valley") return hipValleyPitchFactor(degrees);
  return rafterPitchFactor(degrees);
}
function areaValueForUnit(value, unitSystem, fromDimensions) {
  return unitSystem === "squares" && fromDimensions ? value / 100 : value;
}
function computeEntry(entry, kind, pitchType) {
  const qty = entry.quantity ?? 1;
  if (isCustomFixed(kind)) {
    return qty;
  }
  if (entry.inputMode === "actual") {
    return (entry.actualValue ?? 0) * qty;
  }
  if (entry.isTotalInput) {
    return (entry.actualValue ?? 0) * pitchFactor(entry.pitchDegrees, pitchType) * qty;
  }
  const isArea = kind === "roof_area" || kind === "underlay" || kind === "fixings" || kind.startsWith("custom-") && isCustomArea(kind);
  if (isArea) {
    const planArea = (entry.planWidth ?? 0) * (entry.planLengthVal ?? 0);
    return planArea * pitchFactor(entry.pitchDegrees, pitchType) * qty;
  }
  const planLength = entry.planLength ?? 0;
  return planLength * pitchFactor(entry.pitchDegrees, pitchType) * qty;
}
var customAreaMap = /* @__PURE__ */ new Map();
var customFixedMap = /* @__PURE__ */ new Map();
function registerCustomKind(id, isArea, isFixed) {
  customAreaMap.set(id, isArea);
  if (isFixed !== void 0) customFixedMap.set(id, isFixed);
}
function isCustomArea(kind) {
  return customAreaMap.get(kind) ?? false;
}
function isCustomFixed(kind) {
  return customFixedMap.get(kind) ?? false;
}
function computeMaterialCost(qty, comp) {
  if (!comp || qty <= 0) return { cost: 0, packs: 0 };
  if (comp.pricing_strategy === "per_unit") {
    return { cost: qty * comp.price_per_unit, packs: 0 };
  }
  const packSize = comp.pack_size ?? 1;
  if (packSize <= 0) return { cost: 0, packs: 0 };
  const packs = Math.ceil(qty / packSize);
  const packPrice = comp.pack_price ?? comp.price_per_unit;
  return { cost: packs * packPrice, packs };
}
function computeLabourCost(qty, comp) {
  if (!comp || comp.labour_rate <= 0) return 0;
  if (comp.labour_unit === "fixed") return comp.labour_rate;
  if (comp.labour_unit === "per_unit") return qty * comp.labour_rate;
  if (comp.labour_unit === "hourly") return qty * comp.labour_rate;
  return 0;
}
function computeKnownPriceCost(qty, knownPrice) {
  if (qty <= 0 || knownPrice <= 0) return 0;
  return qty * knownPrice;
}
function entriesFromPrefillValues(values, measureMode, pitchDegrees, unitSystem) {
  const result = {};
  for (const [kind, nums] of Object.entries(values)) {
    if (!Array.isArray(nums)) continue;
    const pitchType = COMPONENT_DEFS[kind]?.pitchType ?? "none";
    const isArea = kind === "roof_area" || kind === "underlay" || kind === "fixings";
    result[kind] = nums.filter((v) => typeof v === "number" && Number.isFinite(v) && v > 0).map((value) => {
      const entry = {
        id: makeId(),
        label: "",
        inputMode: measureMode === "actual" ? "actual" : "pitch_calculated",
        pitchDegrees,
        computedValue: 0,
        selectedComponentId: null,
        quantity: 1,
        isTotalInput: true,
        actualValue: value
      };
      entry.computedValue = computeEntry(entry, kind, pitchType);
      if (unitSystem === "squares" && isArea) {
        entry.computedValue = areaValueForUnit(entry.computedValue, unitSystem, false);
      }
      return entry;
    });
  }
  return result;
}
function makeId() {
  return `e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function makeCustomId() {
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function makeEntry(pitchDegrees = 25) {
  return {
    id: makeId(),
    label: "",
    inputMode: "pitch_calculated",
    pitchDegrees,
    computedValue: 0,
    selectedComponentId: null
  };
}
function makeInitialSections() {
  const sections = {};
  for (const kind of BUILT_IN_ORDER) {
    sections[kind] = { kind, entries: [], wastePercent: kind === "roof_area" || kind === "underlay" || kind === "fixings" ? 10 : 5 };
  }
  return sections;
}
function makeCustomSection(def) {
  registerCustomKind(def.id, def.measurementType === "area", def.measurementType === "fixed");
  return {
    kind: def.id,
    entries: [],
    wastePercent: def.measurementType === "fixed" ? 0 : def.wastePercent,
    customDef: def
  };
}
function loadComponentsFromConfig(entries) {
  return entries.map((entry, idx) => ({
    id: `cfg-${idx}-${entry.kind}`,
    component_kind: entry.kind,
    name: entry.name,
    description: entry.description ?? null,
    unit: entry.unit,
    price_per_unit: entry.price_per_unit,
    pricing_strategy: entry.pricing_strategy ?? "per_unit",
    pack_size: entry.pack_size ?? null,
    pack_price: entry.pack_price ?? null,
    labour_rate: entry.labour_rate,
    labour_unit: entry.labour_unit ?? "per_unit",
    suggested_waste_percent: entry.suggested_waste_percent ?? 5,
    pitch_type: entry.pitch_type ?? (COMPONENT_DEFS[entry.kind]?.pitchType ?? "none"),
    is_active: true,
    sort_order: idx,
    roof_types: entry.roof_types?.length ? entry.roof_types : null
  }));
}
function filterComponentsForRoofType(components, roofType) {
  if (!roofType) return components;
  return components.filter((component) => !component.roof_types || component.roof_types.includes(roofType));
}

// ../core/src/engine.ts
function isFixedSection(section) {
  return section.customDef?.measurementType === "fixed";
}
function calculateTakeoffSections(sections, keys, getComponentById, includeLabour = true) {
  const totals = {};
  for (const key of keys) {
    const section = sections[key];
    if (!section) {
      totals[key] = { rawTotal: 0, withWaste: 0, count: 0, materialCost: 0, labourCost: 0, totalCost: 0 };
      continue;
    }
    const fixed = isFixedSection(section);
    const rawTotal = fixed ? section.entries.reduce((sum, entry) => sum + (entry.quantity ?? 1), 0) : section.entries.reduce((sum, entry) => sum + entry.computedValue, 0);
    const withWaste = fixed ? rawTotal : rawTotal * (1 + section.wastePercent / 100);
    let materialCost = 0;
    let labourCost = 0;
    for (const entry of section.entries) {
      const costQuantity = fixed ? entry.quantity ?? 1 : entry.computedValue;
      if (entry.knownPrice != null && entry.knownPrice > 0) {
        materialCost += computeKnownPriceCost(costQuantity, entry.knownPrice);
        continue;
      }
      const component = getComponentById(entry.selectedComponentId);
      materialCost += computeMaterialCost(costQuantity, component).cost;
      if (includeLabour) {
        labourCost += computeLabourCost(costQuantity, component);
      }
    }
    totals[key] = {
      rawTotal,
      withWaste,
      count: section.entries.length,
      materialCost,
      labourCost,
      totalCost: materialCost + labourCost
    };
  }
  const totalEntries = keys.reduce((sum, key) => sum + (totals[key]?.count ?? 0), 0);
  const materialTotal = keys.reduce((sum, key) => sum + (totals[key]?.materialCost ?? 0), 0);
  const labourTotal = keys.reduce((sum, key) => sum + (totals[key]?.labourCost ?? 0), 0);
  return {
    sections: totals,
    totalEntries,
    materialTotal,
    labourTotal,
    grandTotal: materialTotal + labourTotal
  };
}

// ../core/src/helpers.ts
function unitLabel(unit) {
  if (unit === "metric") return "m";
  return "ft";
}
function areaUnitLabel(unit) {
  if (unit === "metric") return "m\xB2";
  if (unit === "imperial") return "sq ft";
  return "squares";
}
function resolvePricingModes(pricingModes) {
  const modes = pricingModes?.length ? pricingModes : ["material"];
  return {
    modes,
    defaultMode: modes.length === 1 ? modes[0] : null,
    hasChoice: modes.length > 1
  };
}
function ratioToDegrees(ratio) {
  const parts = ratio.split(":");
  if (parts.length !== 2) return 0;
  const rise = parseFloat(parts[0]);
  const run = parseFloat(parts[1]);
  if (!rise || !run || run <= 0) return 0;
  return Math.atan(rise / run) * (180 / Math.PI);
}
function degreesToRatio(deg, unit) {
  if (unit === "metric") {
    const riseM = Math.tan(deg * Math.PI / 180) * 10;
    return `${riseM.toFixed(1)}:10`;
  }
  const rise = Math.tan(deg * Math.PI / 180) * 12;
  return `${rise.toFixed(1)}:12`;
}
function componentLabel(kind, customDef) {
  if (kind.startsWith("custom-") && customDef) return `${customDef.name} (Custom)`;
  const def = COMPONENT_DEFS[kind];
  return def ? def.label : "Custom";
}
function componentDescription(kind, customDef) {
  if (kind.startsWith("custom-") && customDef) {
    const mt = customDef.measurementType === "area" ? "Area-based" : customDef.measurementType === "fixed" ? "Fixed quantity" : "Linear";
    const pt = customDef.pitchType === "rafter" ? "rafter pitch" : customDef.pitchType === "hip_valley" ? "hip/valley pitch" : "no pitch";
    return `${mt} component, ${pt}.`;
  }
  const def = COMPONENT_DEFS[kind];
  return def ? def.description : "";
}

// ../flow/src/TakeoffFlow.tsx
import { useState as useState8, useEffect as useEffect4 } from "react";
import Link3 from "next/link";

// ../layouts/forms/src/FormsLayout.tsx
import { useState as useState5, useMemo, useCallback, useEffect as useEffect2 } from "react";
import Link from "next/link";

// ../ui/src/ChoiceIcon.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var iconPaths = {
  actual: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M6.75 3.75h7.5l3 3v13.5H6.75z" }),
    /* @__PURE__ */ jsx("path", { d: "M14.25 3.75v3h3M9 11.25h6M9 14.25h6M9 17.25h3" })
  ] }),
  plan: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M4.5 3.75h9v9h-9z" }),
    /* @__PURE__ */ jsx("path", { d: "M7.5 3.75v3.75M10.5 3.75v5.25M4.5 6.75h3.75M4.5 9.75h5.25" }),
    /* @__PURE__ */ jsx("path", { d: "M13.5 7.5h4.5a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5V13.5" }),
    /* @__PURE__ */ jsx("path", { d: "M17.25 9v6M16.5 9h1.5M16.5 15h1.5" })
  ] }),
  material: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "m3.75 7.5 8.25-4 8.25 4L12 11.75 3.75 7.5Z" }),
    /* @__PURE__ */ jsx("path", { d: "M3.75 7.5v9L12 20.5l8.25-4v-9M12 11.75v8.75" })
  ] }),
  install: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M4.5 15v-2.25a7.5 7.5 0 0 1 15 0V15M12 5.25V12" }),
    /* @__PURE__ */ jsx("path", { d: "M3 15h18v3.75H3z" })
  ] }),
  guided: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("path", { d: "M8.25 5.25h7.5M9 3.75h6v3H9zM6 5.25H4.5v15h15v-15H18" }),
    /* @__PURE__ */ jsx("path", { d: "m8.25 11.25 1.5 1.5 2.25-3M13.5 11.25h2.25M8.25 16.5h7.5" })
  ] }),
  fast: /* @__PURE__ */ jsx("path", { d: "m13.5 2.25-7.5 11.25h5.25l-.75 8.25L18 10.5h-5.25l.75-8.25Z" })
};
function ChoiceIcon({ icon }) {
  return /* @__PURE__ */ jsx("svg", { "aria-hidden": "true", className: "h-7 w-7", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.8, children: iconPaths[icon] });
}

// ../ui/src/ComponentGuideBox.tsx
import { useState } from "react";
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var GUIDE_CONTENT = {
  roof_area: {
    label: "Roof Area",
    instruction: (mode) => mode === "plan" ? "Measure entire roof outline. Enter plan dimensions (width x length) or total area and we will calculate the sloped area using your roof pitch." : "Measure entire roof outline. Enter plan dimensions (width x length) or total area.",
    diagram: "The entire roof outline is highlighted. This is the surface area of all roof planes.",
    tip: "If you have a plan view, enter the flat dimensions. The pitch factor is applied automatically."
  },
  ridge: {
    label: "Ridge",
    instruction: "Measure the horizontal/vertical peaks where two roof slopes meet.",
    diagram: "The horizontal lines at the top of each roof section are highlighted.",
    tip: "Ridges are always horizontal. If a line slopes downward, it is a hip or barge, not a ridge."
  },
  hip: {
    label: "Hip",
    instruction: "Measure all the angled lines where 2 roof faces meet (Exclude valleys, which start from internal corners of the roof outline, they are the next step.)",
    diagram: "The diagonal lines from the ridge to the external corners are highlighted.",
    tip: "Hips run from the ridge to an external corner. Valleys look similar but are internal corners."
  },
  valley: {
    label: "Valley",
    instruction: "Measure the angled lines where two roof planes meet and water flows into, they normally always end on an internal corner of the roof outline.",
    diagram: "The inward diagonal lines where roof sections join are highlighted.",
    tip: "Valleys collect water. If a line runs to an external corner, it is a hip, not a valley."
  },
  barge: {
    label: "Barge",
    instruction: "Measure the barge/rake sections that run parallel to the roof outline. These areas normally have no spouting, and run in the same direction that water flows on the outline of the roof.",
    diagram: "The sloped edges at the gable ends are highlighted.",
    tip: "Barges are the diagonal edges at the side of a gable. Also called rake or verge."
  },
  spouting: {
    label: "Spouting",
    instruction: "Measure the lower roof outline where gutters will be installed - Not including barge/rake sections.",
    diagram: "The perimeter edges at the bottom of the roof are highlighted.",
    tip: "Spouting runs along the bottom edge (eaves). Do not include gable edges."
  },
  underlay: {
    label: "Underlay",
    instruction: "Uses the total roof area. Underlay covers the entire roof surface beneath the main covering.",
    diagram: "The entire roof outline is highlighted, same as roof area.",
    tip: "Underlay area matches your roof area. You can use the Roof Area total directly."
  },
  fixings: {
    label: "Fixings",
    instruction: "Uses the total roof area to calculate nails, screws, or clips needed.",
    diagram: "The entire roof outline is highlighted, same as roof area.",
    tip: "Fixings are calculated per area. You can use the Roof Area total directly."
  }
};
function getInstruction(componentKey, mode) {
  const content = GUIDE_CONTENT[componentKey];
  if (!content) return "";
  return typeof content.instruction === "function" ? content.instruction(mode) : content.instruction;
}
function ComponentSymbol({ componentKey, color }) {
  const sw = 2.5;
  const cls = "h-16 w-16 sm:h-20 sm:w-20";
  switch (componentKey) {
    case "roof_area":
      return /* @__PURE__ */ jsx2("svg", { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: sw, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l9-9 9 9M5 10v10h14V10" }) });
    case "ridge":
      return /* @__PURE__ */ jsx2("svg", { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: sw, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 20L12 6l8 14" }) });
    case "hip":
      return /* @__PURE__ */ jsx2("svg", { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: sw, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 20L12 6l8 14" }) });
    case "valley":
      return /* @__PURE__ */ jsx2("svg", { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: sw, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6l8 14 8-14" }) });
    case "barge":
      return /* @__PURE__ */ jsx2("svg", { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: sw, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 20V4h14" }) });
    case "spouting":
      return /* @__PURE__ */ jsx2("svg", { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: sw, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 8v3a2 2 0 002 2h12a2 2 0 002-2V8" }) });
    case "underlay":
      return /* @__PURE__ */ jsxs2("svg", { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: sw, children: [
        /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l9-5 9 5-9 5-9-5z" }),
        /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l9 5 9-5" }),
        /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16l9 5 9-5" })
      ] });
    case "fixings":
      return /* @__PURE__ */ jsx2("svg", { className: cls, fill: "none", viewBox: "0 0 24 24", stroke: color, strokeWidth: sw, children: /* @__PURE__ */ jsx2("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 4h8M12 4v16M9 20l3-2 3 2" }) });
    default:
      return null;
  }
}
function InfoTooltip({ text, color }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs2("span", { className: "relative inline-flex", children: [
    /* @__PURE__ */ jsx2(
      "button",
      {
        type: "button",
        "aria-label": text,
        onClick: () => setOpen((o) => !o),
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
        onFocus: () => setOpen(true),
        onBlur: () => setOpen(false),
        className: "flex h-5 w-5 cursor-help items-center justify-center rounded-full border text-[10px] font-bold leading-none transition hover:scale-110",
        style: { borderColor: `${color}55`, color, backgroundColor: `${color}08` },
        children: "i"
      }
    ),
    open && /* @__PURE__ */ jsx2(
      "span",
      {
        role: "tooltip",
        className: "absolute bottom-full left-1/2 z-50 mb-2 w-60 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-center text-xs font-normal leading-relaxed text-white shadow-xl",
        children: text
      }
    )
  ] });
}
function GuideSVG({ componentKey, highlightColor }) {
  const black = "#94a3b8";
  const sw = 2;
  const ow = 6;
  const outline = "M 40 40 L 420 40 L 420 280 L 320 280 L 320 340 L 140 340 L 140 280 L 40 280 Z";
  const mainRidge = /* @__PURE__ */ jsx2("line", { x1: "160", y1: "160", x2: "300", y2: "160" });
  const dormerRidge = /* @__PURE__ */ jsx2("line", { x1: "230", y1: "340", x2: "230", y2: "190" });
  const hips = [
    /* @__PURE__ */ jsx2("line", { x1: "160", y1: "160", x2: "40", y2: "40" }, "h1"),
    /* @__PURE__ */ jsx2("line", { x1: "160", y1: "160", x2: "40", y2: "280" }, "h2"),
    /* @__PURE__ */ jsx2("line", { x1: "300", y1: "160", x2: "420", y2: "40" }, "h3"),
    /* @__PURE__ */ jsx2("line", { x1: "300", y1: "160", x2: "420", y2: "280" }, "h4")
  ];
  const valleys = [
    /* @__PURE__ */ jsx2("line", { x1: "140", y1: "280", x2: "230", y2: "190" }, "v1"),
    /* @__PURE__ */ jsx2("line", { x1: "320", y1: "280", x2: "230", y2: "190" }, "v2")
  ];
  const barges = [
    /* @__PURE__ */ jsx2("line", { x1: "140", y1: "340", x2: "230", y2: "340" }, "b1"),
    /* @__PURE__ */ jsx2("line", { x1: "230", y1: "340", x2: "320", y2: "340" }, "b2")
  ];
  const allInternal = /* @__PURE__ */ jsxs2(Fragment2, { children: [
    mainRidge,
    dormerRidge,
    hips,
    valleys,
    barges
  ] });
  let highlightElements = null;
  let blackElements = allInternal;
  let outlineColor = black;
  let outlineWidth = sw;
  switch (componentKey) {
    case "roof_area":
    case "underlay":
    case "fixings":
      outlineColor = highlightColor;
      outlineWidth = ow;
      blackElements = allInternal;
      break;
    case "ridge":
      highlightElements = /* @__PURE__ */ jsxs2(Fragment2, { children: [
        mainRidge,
        dormerRidge
      ] });
      blackElements = /* @__PURE__ */ jsxs2(Fragment2, { children: [
        hips,
        valleys,
        barges
      ] });
      break;
    case "hip":
      highlightElements = /* @__PURE__ */ jsx2(Fragment2, { children: hips });
      blackElements = /* @__PURE__ */ jsxs2(Fragment2, { children: [
        mainRidge,
        dormerRidge,
        valleys,
        barges
      ] });
      break;
    case "valley":
      highlightElements = /* @__PURE__ */ jsx2(Fragment2, { children: valleys });
      blackElements = /* @__PURE__ */ jsxs2(Fragment2, { children: [
        mainRidge,
        dormerRidge,
        hips,
        barges
      ] });
      break;
    case "barge":
      highlightElements = /* @__PURE__ */ jsx2(Fragment2, { children: barges });
      blackElements = /* @__PURE__ */ jsxs2(Fragment2, { children: [
        mainRidge,
        dormerRidge,
        hips,
        valleys
      ] });
      break;
    case "spouting":
      outlineColor = black;
      outlineWidth = sw;
      highlightElements = /* @__PURE__ */ jsxs2(Fragment2, { children: [
        /* @__PURE__ */ jsx2("line", { x1: "40", y1: "40", x2: "420", y2: "40", stroke: highlightColor, strokeWidth: ow, strokeLinecap: "round" }),
        /* @__PURE__ */ jsx2("line", { x1: "40", y1: "40", x2: "40", y2: "280", stroke: highlightColor, strokeWidth: ow, strokeLinecap: "round" }),
        /* @__PURE__ */ jsx2("line", { x1: "420", y1: "40", x2: "420", y2: "280", stroke: highlightColor, strokeWidth: ow, strokeLinecap: "round" }),
        /* @__PURE__ */ jsx2("line", { x1: "40", y1: "280", x2: "140", y2: "280", stroke: highlightColor, strokeWidth: ow, strokeLinecap: "round" }),
        /* @__PURE__ */ jsx2("line", { x1: "320", y1: "280", x2: "420", y2: "280", stroke: highlightColor, strokeWidth: ow, strokeLinecap: "round" }),
        /* @__PURE__ */ jsx2("line", { x1: "140", y1: "280", x2: "140", y2: "340", stroke: highlightColor, strokeWidth: ow, strokeLinecap: "round" }),
        /* @__PURE__ */ jsx2("line", { x1: "320", y1: "280", x2: "320", y2: "340", stroke: highlightColor, strokeWidth: ow, strokeLinecap: "round" })
      ] });
      blackElements = allInternal;
      break;
  }
  return /* @__PURE__ */ jsxs2("svg", { viewBox: "0 0 460 380", className: "h-auto w-full", style: { maxHeight: "260px" }, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx2("defs", { children: /* @__PURE__ */ jsx2("pattern", { id: `grid-${componentKey}`, width: "20", height: "20", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsx2("path", { d: "M 20 0 L 0 0 0 20", fill: "none", stroke: "#f1f5f9", strokeWidth: "0.5" }) }) }),
    /* @__PURE__ */ jsx2("rect", { width: "460", height: "380", fill: `url(#grid-${componentKey})` }),
    /* @__PURE__ */ jsx2("path", { d: outline, fill: "none", stroke: outlineColor, strokeWidth: outlineWidth, strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx2("g", { fill: "none", stroke: black, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.4", children: blackElements }),
    highlightElements && componentKey !== "spouting" && /* @__PURE__ */ jsx2("g", { fill: "none", stroke: highlightColor, strokeWidth: ow, strokeLinecap: "round", children: highlightElements }),
    componentKey === "spouting" && highlightElements
  ] });
}
function ComponentGuideBox({ componentKey, highlightColor, measureMode = "plan" }) {
  const content = GUIDE_CONTENT[componentKey];
  if (!content) return null;
  const isArea = componentKey === "roof_area" || componentKey === "underlay" || componentKey === "fixings";
  const instruction = getInstruction(componentKey, measureMode);
  return /* @__PURE__ */ jsxs2(
    "section",
    {
      className: "rounded-2xl border bg-white shadow-sm",
      style: { borderColor: `${highlightColor}30` },
      "aria-label": `${content.label} visual guide`,
      children: [
        /* @__PURE__ */ jsxs2(
          "div",
          {
            className: "relative flex items-center justify-between border-b px-4 py-2.5 sm:px-5",
            style: { borderColor: `${highlightColor}20`, backgroundColor: `${highlightColor}06` },
            children: [
              /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx2(
                  "span",
                  {
                    className: "text-[10px] font-bold uppercase tracking-[0.18em]",
                    style: { color: highlightColor },
                    children: "Guided"
                  }
                ),
                /* @__PURE__ */ jsx2("span", { className: "text-slate-300", children: "|" }),
                /* @__PURE__ */ jsx2("span", { className: "text-xs font-medium text-slate-500", children: isArea ? "Covers entire roof area" : "Highlighted on roof plan" })
              ] }),
              /* @__PURE__ */ jsx2(InfoTooltip, { text: content.tip, color: highlightColor })
            ]
          }
        ),
        /* @__PURE__ */ jsxs2("div", { className: "grid grid-cols-1 sm:grid-cols-[auto_1fr]", children: [
          /* @__PURE__ */ jsxs2(
            "div",
            {
              className: "flex flex-col items-center justify-center px-6 py-6 sm:border-r",
              style: { borderColor: `${highlightColor}20`, backgroundColor: `${highlightColor}05` },
              children: [
                /* @__PURE__ */ jsx2(
                  "div",
                  {
                    className: "flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-sm sm:h-32 sm:w-32",
                    style: {
                      boxShadow: `0 8px 30px ${highlightColor}15, 0 0 0 1px ${highlightColor}20`
                    },
                    children: /* @__PURE__ */ jsx2(ComponentSymbol, { componentKey, color: highlightColor })
                  }
                ),
                /* @__PURE__ */ jsx2("p", { className: "mt-3 text-sm font-bold text-slate-900", children: content.label })
              ]
            }
          ),
          /* @__PURE__ */ jsxs2("div", { className: "flex flex-col items-center justify-center px-4 py-5", children: [
            /* @__PURE__ */ jsx2("div", { className: "w-full max-w-md", children: /* @__PURE__ */ jsx2(GuideSVG, { componentKey, highlightColor }) }),
            /* @__PURE__ */ jsxs2("div", { className: "mt-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx2(
                "span",
                {
                  className: "inline-block h-1.5 w-6 rounded-full",
                  style: { backgroundColor: highlightColor }
                }
              ),
              /* @__PURE__ */ jsx2("span", { className: "text-xs font-medium text-slate-600", children: isArea ? "Entire roof area highlighted" : `${content.label} highlighted on plan` }),
              /* @__PURE__ */ jsx2(InfoTooltip, { text: content.diagram, color: highlightColor })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx2(
          "div",
          {
            className: "border-t px-4 py-2.5 sm:px-5",
            style: { borderColor: `${highlightColor}15`, backgroundColor: `${highlightColor}04` },
            children: /* @__PURE__ */ jsxs2("p", { className: "text-xs leading-relaxed text-slate-600", children: [
              /* @__PURE__ */ jsxs2("span", { className: "font-semibold", style: { color: highlightColor }, children: [
                content.label,
                ":"
              ] }),
              " ",
              instruction
            ] })
          }
        )
      ]
    }
  );
}

// ../ui/src/ResultsModal.tsx
import { useEffect, useState as useState3 } from "react";

// ../ui/src/SupplierEnquiryModal.tsx
import { useState as useState2, useRef } from "react";
import { Fragment as Fragment3, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var intentOptions = [
  { value: "detailed_quote", label: "Detailed Quote", desc: "Ask for a full formal quote" },
  { value: "order_request", label: "Order Request", desc: "I want to order these materials" },
  { value: "pricing_question", label: "Pricing Question", desc: "Ask about pricing or better rates" },
  { value: "general_enquiry", label: "General Enquiry", desc: "Something else" }
];
function SupplierEnquiryModal({
  theme,
  supplierSlug,
  sections,
  totals,
  getComponentById,
  grandTotal,
  allKeys,
  unitSystem,
  currencySymbol,
  onClose
}) {
  const cur = currencySymbol;
  const lenUnit = unitSystem === "metric" ? "m" : "ft";
  const areaUnit = unitSystem === "metric" ? "m\xB2" : unitSystem === "imperial" ? "sq ft" : "squares";
  const [name, setName] = useState2("");
  const [email, setEmail] = useState2("");
  const [phone, setPhone] = useState2("");
  const [intent, setIntent] = useState2("detailed_quote");
  const [message, setMessage] = useState2("");
  const [includeQuantities, setIncludeQuantities] = useState2(true);
  const [includePricing, setIncludePricing] = useState2(true);
  const [files, setFiles] = useState2([]);
  const [sending, setSending] = useState2(false);
  const [sent, setSent] = useState2(false);
  const [error, setError] = useState2(null);
  const fileInputRef = useRef(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = emailRegex.test(email);
  const nameValid = name.trim().length >= 2;
  const canSend = nameValid && emailValid && !sending;
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files ?? []);
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    const valid = selected.filter((f) => allowed.includes(f.type) && f.size <= 10 * 1024 * 1024);
    const combined = [...files, ...valid].slice(0, 5);
    setFiles(combined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
  };
  const unitFor = (key) => {
    const section = sections[key];
    if (key === "roof_area" || key === "underlay" || key === "fixings") return areaUnit;
    if (key.startsWith("custom-") && section?.customDef?.measurementType === "area") return areaUnit;
    return lenUnit;
  };
  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      const attachmentIds = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/free-tools/supplier-enquiry", {
          method: "PUT",
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.ok && uploadData.fileId) {
          attachmentIds.push(uploadData.fileId);
        } else {
          console.error("[enquiry] File upload failed:", file.name, uploadData.error);
        }
      }
      const takeoffSummary = allKeys.map((key) => {
        const section = sections[key];
        const t = totals[key];
        const label = componentLabel(key);
        const isArea = key === "roof_area" || key === "underlay" || key === "fixings";
        const unit = isArea ? areaUnit : lenUnit;
        const entries = (section?.entries || []).map((entry, idx) => {
          const comp = getComponentById(entry.selectedComponentId);
          return {
            label: entry.label || `Entry ${idx + 1}`,
            componentName: comp?.name || "No product",
            value: entry.computedValue,
            quantity: entry.quantity ?? 1
          };
        });
        return {
          label,
          unit,
          count: t?.count ?? 0,
          rawTotal: t?.rawTotal ?? 0,
          withWaste: t?.withWaste ?? 0,
          wastePercent: section?.wastePercent ?? 0,
          materialCost: t?.materialCost ?? 0,
          labourCost: t?.labourCost ?? 0,
          totalCost: t?.totalCost ?? 0,
          entries
        };
      });
      const res = await fetch("/api/free-tools/supplier-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierSlug,
          senderName: name,
          senderEmail: email,
          senderPhone: phone || void 0,
          intent,
          message,
          includeQuantities,
          includePricing,
          includeResultLink: false,
          marketingConsent: false,
          totals: takeoffSummary,
          currency: cur,
          attachmentIds: attachmentIds.length > 0 ? attachmentIds : void 0
        })
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
      } else {
        setError(data.error || "Failed to send enquiry. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  };
  if (sent) {
    return /* @__PURE__ */ jsx3("div", { className: "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-2 md:p-4", children: /* @__PURE__ */ jsxs3("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center", children: [
      /* @__PURE__ */ jsx3("div", { className: "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4", style: { backgroundColor: `${theme.primary}15` }, children: /* @__PURE__ */ jsx3("svg", { className: "w-6 h-6", style: { color: theme.primary }, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx3("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsx3("h3", { className: "text-lg font-semibold text-slate-900", children: "Enquiry sent!" }),
      /* @__PURE__ */ jsxs3("p", { className: "mt-2 text-sm text-slate-500", children: [
        "Your message has been sent to ",
        theme.supplierName,
        ". They will reply directly to your email at ",
        email,
        "."
      ] }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: onClose,
          className: "mt-5 w-full rounded-lg px-5 py-3 text-sm font-semibold text-white transition",
          style: { backgroundColor: theme.primary },
          children: "Done"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx3("div", { className: "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-2 md:p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs3("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxs3("div", { className: "sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between z-10", children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("h2", { className: "text-base font-semibold text-slate-900", children: [
          "Send to ",
          theme.supplierName
        ] }),
        /* @__PURE__ */ jsx3("p", { className: "text-xs text-slate-400", children: "They will reply directly to your email" })
      ] }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: onClose,
          "aria-label": "Close",
          className: "p-2 text-slate-400 hover:text-slate-600 transition rounded-full hover:bg-slate-50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center",
          children: /* @__PURE__ */ jsx3("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 2, children: /* @__PURE__ */ jsx3("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "px-5 py-4 space-y-4", children: [
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Your name *" }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "text",
              value: name,
              onChange: (e) => setName(e.target.value),
              className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none",
              style: { borderColor: name ? theme.primary : void 0 },
              placeholder: "John Smith"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Your email *" }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "email",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              className: "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none",
              style: { borderColor: email ? emailValid ? theme.primary : "#ef4444" : void 0 },
              placeholder: "john@example.com"
            }
          ),
          email && !emailValid && /* @__PURE__ */ jsx3("p", { className: "mt-1 text-xs text-red-500", children: "Please enter a valid email address." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Phone (optional)" }),
        /* @__PURE__ */ jsx3(
          "input",
          {
            type: "tel",
            value: phone,
            onChange: (e) => setPhone(e.target.value),
            className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none",
            style: { borderColor: phone ? theme.primary : void 0 },
            placeholder: "+44 7700 900123"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("label", { className: "block text-xs font-medium text-slate-600 mb-1.5", children: "What do you need?" }),
        /* @__PURE__ */ jsx3("div", { className: "grid grid-cols-2 gap-2", children: intentOptions.map((opt) => /* @__PURE__ */ jsxs3(
          "button",
          {
            onClick: () => setIntent(opt.value),
            className: "text-left rounded-lg border p-2.5 transition cursor-pointer",
            style: intent === opt.value ? { borderColor: theme.primary, backgroundColor: `${theme.primary}08` } : { borderColor: "#e2e8f0" },
            children: [
              /* @__PURE__ */ jsx3("div", { className: "text-xs font-semibold text-slate-900", children: opt.label }),
              /* @__PURE__ */ jsx3("div", { className: "text-[11px] text-slate-400 mt-0.5", children: opt.desc })
            ]
          },
          opt.value
        )) })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Message" }),
        /* @__PURE__ */ jsx3(
          "textarea",
          {
            value: message,
            onChange: (e) => setMessage(e.target.value),
            rows: 4,
            maxLength: 5e3,
            className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none resize-none",
            style: { borderColor: message ? theme.primary : void 0 },
            placeholder: "Hi, I have estimated my roof takeoff using your calculator. Can you provide a formal quote? I have attached the roof plan..."
          }
        ),
        /* @__PURE__ */ jsxs3("p", { className: "mt-1 text-[11px] text-slate-400 text-right", children: [
          message.length,
          "/5000"
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "space-y-2 rounded-lg bg-slate-50 p-3", children: [
        /* @__PURE__ */ jsx3("p", { className: "text-xs font-medium text-slate-600", children: "Include in email:" }),
        /* @__PURE__ */ jsxs3("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx3("input", { type: "checkbox", checked: includeQuantities, onChange: (e) => setIncludeQuantities(e.target.checked), className: "rounded border-slate-300", style: { accentColor: theme.primary } }),
          /* @__PURE__ */ jsx3("span", { className: "text-xs text-slate-600", children: "Takeoff quantities (measurements per component)" })
        ] }),
        /* @__PURE__ */ jsxs3("label", { className: "flex items-center gap-2 cursor-pointer", children: [
          /* @__PURE__ */ jsx3("input", { type: "checkbox", checked: includePricing, onChange: (e) => setIncludePricing(e.target.checked), className: "rounded border-slate-300", style: { accentColor: theme.primary } }),
          /* @__PURE__ */ jsx3("span", { className: "text-xs text-slate-600", children: "Pricing breakdown (material + labour costs)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx3("label", { className: "block text-xs font-medium text-slate-600 mb-1", children: "Attachments (optional, max 5 files, 10MB each)" }),
        /* @__PURE__ */ jsx3(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: ".pdf,.jpg,.jpeg,.png,.webp",
            multiple: true,
            onChange: handleFileSelect,
            className: "hidden"
          }
        ),
        /* @__PURE__ */ jsx3(
          "button",
          {
            onClick: () => fileInputRef.current?.click(),
            disabled: files.length >= 5,
            className: "w-full rounded-lg border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
            children: files.length >= 5 ? "Maximum 5 files reached" : "+ Add file (PDF, JPG, PNG, WebP)"
          }
        ),
        files.length > 0 && /* @__PURE__ */ jsx3("div", { className: "mt-2 space-y-1", children: files.map((file, idx) => /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5", children: [
          /* @__PURE__ */ jsx3("span", { className: "text-xs text-slate-600 truncate flex-1", children: file.name }),
          /* @__PURE__ */ jsxs3("span", { className: "text-[11px] text-slate-400 ml-2", children: [
            (file.size / 1024 / 1024).toFixed(1),
            "MB"
          ] }),
          /* @__PURE__ */ jsx3("button", { onClick: () => removeFile(idx), className: "ml-2 text-slate-300 hover:text-red-500 cursor-pointer", children: /* @__PURE__ */ jsx3("svg", { className: "w-3.5 h-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx3("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })
        ] }, idx)) })
      ] }),
      error && /* @__PURE__ */ jsx3("div", { className: "rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600", children: error })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "sticky bottom-0 bg-white border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: onClose,
          className: "px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition cursor-pointer min-h-[44px]",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: handleSend,
          disabled: !canSend,
          className: "inline-flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold text-white transition min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed",
          style: { backgroundColor: theme.primary },
          children: sending ? /* @__PURE__ */ jsxs3(Fragment3, { children: [
            /* @__PURE__ */ jsx3("div", { className: "inline-block animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" }),
            "Sending..."
          ] }) : /* @__PURE__ */ jsxs3(Fragment3, { children: [
            "Send to ",
            theme.supplierName,
            /* @__PURE__ */ jsx3("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx3("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }) })
          ] })
        }
      )
    ] })
  ] }) });
}

// ../ui/src/ResultsModal.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function ResultsModal({ sections, totals, getComponentById, grandTotal, unitSystem, allKeys, currencySymbol, theme, supplierSlug, onClose, onEdit }) {
  const cur = currencySymbol;
  const hasPricing = grandTotal > 0;
  const lenUnit = unitSystem === "metric" ? "m" : "ft";
  const areaUnit = unitSystem === "metric" ? "m\xB2" : unitSystem === "imperial" ? "sq ft" : "squares";
  useEffect(() => {
    function handleBeforePrint() {
      const el = document.getElementById("takeoff-print");
      if (el) {
        document.body.appendChild(el);
        el.style.position = "static";
        el.style.width = "100%";
        el.style.maxWidth = "none";
        el.style.maxHeight = "none";
        el.style.height = "auto";
        el.style.overflow = "visible";
        el.style.borderRadius = "0";
        el.style.boxShadow = "none";
        el.style.margin = "0";
        el.style.padding = "0";
      }
      document.body.querySelectorAll(":scope > *:not(#takeoff-print)").forEach((node) => {
        node.style.display = "none";
      });
    }
    function handleAfterPrint() {
      const el = document.getElementById("takeoff-print");
      if (el) {
        const root = document.getElementById("print-root");
        if (root) root.appendChild(el);
        el.style.position = "";
        el.style.width = "";
        el.style.maxWidth = "";
        el.style.maxHeight = "";
        el.style.height = "";
        el.style.overflow = "";
        el.style.borderRadius = "";
        el.style.boxShadow = "";
        el.style.margin = "";
        el.style.padding = "";
      }
      document.body.querySelectorAll(":scope > *").forEach((node) => {
        node.style.display = "";
      });
    }
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);
  const [showEnquiry, setShowEnquiry] = useState3(false);
  const unitFor = (key) => {
    const section = sections[key];
    if (key === "roof_area" || key === "underlay" || key === "fixings") return areaUnit;
    if (key.startsWith("custom-") && section?.customDef?.measurementType === "fixed") return "pcs";
    if (key.startsWith("custom-") && section?.customDef?.measurementType === "area") return areaUnit;
    return lenUnit;
  };
  const handleSendToSupplier = () => {
    setShowEnquiry(true);
  };
  return /* @__PURE__ */ jsxs4("div", { id: "print-root", className: "fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-2 md:p-4 print:block print:static print:p-0 print:bg-white", children: [
    /* @__PURE__ */ jsxs4("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:rounded-none print:max-h-none print:w-full print:max-w-none print:overflow-visible", id: "takeoff-print", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 print:border-slate-300", children: [
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx4("h2", { className: "text-base md:text-lg font-semibold text-slate-900", children: "Roof Takeoff Report" }),
          /* @__PURE__ */ jsxs4("p", { className: "text-xs text-slate-400", children: [
            "Generated ",
            (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB")
          ] })
        ] }),
        /* @__PURE__ */ jsx4("button", { onClick: onClose, className: "cursor-pointer p-2 text-slate-400 hover:text-slate-600 transition rounded-full hover:bg-slate-50 print:hidden min-h-[44px] min-w-[44px] flex items-center justify-center", children: /* @__PURE__ */ jsx4("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", strokeWidth: 2, children: /* @__PURE__ */ jsx4("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "overflow-y-auto px-4 md:px-6 py-4 md:py-5 space-y-5 print:overflow-visible print:px-6 print:py-2", children: [
        allKeys.map((key) => {
          const section = sections[key];
          if (!section) return null;
          const t = totals[key];
          if (!t || t.count === 0) return null;
          const label = componentLabel(key);
          const pitchType = key === "roof_area" ? "rafter" : key.startsWith("custom-") ? section.customDef?.pitchType ?? "none" : COMPONENT_DEFS[key]?.pitchType ?? "none";
          const isFixed = key.startsWith("custom-") && section.customDef?.measurementType === "fixed";
          return /* @__PURE__ */ jsxs4("div", { className: "print:break-inside-avoid", children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsx4("h3", { className: "text-sm font-semibold text-slate-900", children: label }),
              /* @__PURE__ */ jsxs4("span", { className: "text-xs text-slate-400", children: [
                "(",
                t.count,
                " ",
                t.count === 1 ? "entry" : "entries",
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsx4("div", { className: "space-y-1 mb-2", children: section.entries.map((entry, idx) => {
              const comp = getComponentById(entry.selectedComponentId);
              const costQty = isFixed ? entry.quantity ?? 1 : entry.computedValue;
              const hasKnownPrice = entry.knownPrice != null && entry.knownPrice > 0;
              const matCost = hasKnownPrice ? { cost: computeKnownPriceCost(costQty, entry.knownPrice), packs: 0 } : comp ? computeMaterialCost(costQty, comp) : { cost: 0, packs: 0 };
              const labCost = hasKnownPrice ? 0 : comp ? computeLabourCost(costQty, comp) : 0;
              const entryTotal = matCost.cost + labCost;
              return /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs print:bg-white print:border print:border-slate-100", children: [
                /* @__PURE__ */ jsxs4("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx4("span", { className: "text-slate-500", children: entry.label || `Entry ${idx + 1}` }),
                  comp && /* @__PURE__ */ jsx4("span", { className: "ml-2 text-slate-400 truncate", children: comp.name }),
                  hasKnownPrice && /* @__PURE__ */ jsxs4("span", { className: "ml-2 text-slate-400 truncate", children: [
                    "Known price ",
                    cur,
                    entry.knownPrice.toFixed(2),
                    "/",
                    isFixed ? "pc" : unitFor(key)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
                  /* @__PURE__ */ jsxs4("span", { className: "font-medium text-slate-700", children: [
                    entry.computedValue.toFixed(2),
                    " ",
                    unitFor(key)
                  ] }),
                  entryTotal > 0 && /* @__PURE__ */ jsxs4("span", { className: "font-medium", style: { color: theme.primary }, children: [
                    cur,
                    entryTotal.toFixed(2)
                  ] })
                ] })
              ] }, entry.id);
            }) }),
            /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2", children: [
              /* @__PURE__ */ jsxs4("div", { className: "text-xs text-slate-500", children: [
                "Subtotal",
                section.wastePercent > 0 && /* @__PURE__ */ jsxs4("span", { className: "ml-2", children: [
                  "+ ",
                  section.wastePercent,
                  "% waste"
                ] })
              ] }),
              /* @__PURE__ */ jsxs4("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs4("span", { className: "text-sm font-semibold text-slate-900", children: [
                  t.withWaste.toFixed(2),
                  " ",
                  unitFor(key)
                ] }),
                t.totalCost > 0 && /* @__PURE__ */ jsxs4("div", { className: "text-xs font-medium", style: { color: theme.primary }, children: [
                  "Material: ",
                  cur,
                  t.materialCost.toFixed(2),
                  t.labourCost > 0 ? ` + Labour: ${cur}${t.labourCost.toFixed(2)}` : "",
                  " = ",
                  cur,
                  t.totalCost.toFixed(2)
                ] })
              ] })
            ] })
          ] }, key);
        }),
        hasPricing && /* @__PURE__ */ jsxs4("div", { className: "rounded-xl bg-slate-900 text-white p-4 space-y-2 print:break-inside-avoid", children: [
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx4("span", { className: "text-sm font-semibold", children: "Total Materials" }),
            /* @__PURE__ */ jsxs4("span", { className: "text-lg font-bold", children: [
              cur,
              allKeys.reduce((s, k) => s + (totals[k]?.materialCost ?? 0), 0).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx4("span", { className: "text-sm font-semibold", children: "Total Labour" }),
            /* @__PURE__ */ jsxs4("span", { className: "text-lg font-bold", children: [
              cur,
              allKeys.reduce((s, k) => s + (totals[k]?.labourCost ?? 0), 0).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between pt-2 border-t border-white/10", children: [
            /* @__PURE__ */ jsx4("span", { className: "text-sm font-semibold", children: "Grand Total" }),
            /* @__PURE__ */ jsxs4("span", { className: "text-xl font-bold", children: [
              cur,
              grandTotal.toFixed(2)
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between gap-2 px-4 md:px-6 py-3 md:py-4 border-t border-slate-100 print:hidden", children: [
        /* @__PURE__ */ jsxs4("button", { onClick: () => window.print(), className: "cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 md:px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition min-h-[44px]", children: [
          /* @__PURE__ */ jsx4("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx4("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" }) }),
          /* @__PURE__ */ jsx4("span", { className: "hidden md:inline", children: "Print / PDF" })
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs4("button", { onClick: onEdit, className: "cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 md:px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition min-h-[44px]", children: [
            /* @__PURE__ */ jsx4("svg", { className: "w-4 h-4 md:hidden", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx4("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }) }),
            /* @__PURE__ */ jsx4("span", { className: "hidden md:inline", children: "Edit" })
          ] }),
          theme.features.sendToSupplier && theme.supplierEmail && /* @__PURE__ */ jsxs4("button", { onClick: handleSendToSupplier, className: "cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-3 md:px-4 py-2 text-sm font-semibold text-white transition min-h-[44px]", style: { backgroundColor: theme.primary }, children: [
            /* @__PURE__ */ jsx4("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx4("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }),
            /* @__PURE__ */ jsxs4("span", { className: "hidden md:inline", children: [
              "Send to ",
              theme.supplierName
            ] }),
            /* @__PURE__ */ jsx4("span", { className: "md:hidden", children: "Send" })
          ] }),
          /* @__PURE__ */ jsxs4("button", { onClick: onClose, className: "cursor-pointer inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 md:px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition min-h-[44px]", children: [
            /* @__PURE__ */ jsx4("svg", { className: "w-4 h-4 md:hidden", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx4("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }),
            /* @__PURE__ */ jsx4("span", { className: "hidden md:inline", children: "Close" })
          ] })
        ] })
      ] })
    ] }),
    showEnquiry && /* @__PURE__ */ jsx4(
      SupplierEnquiryModal,
      {
        theme,
        supplierSlug,
        sections,
        totals,
        getComponentById,
        grandTotal,
        allKeys,
        unitSystem,
        currencySymbol,
        onClose: () => setShowEnquiry(false)
      }
    ),
    /* @__PURE__ */ jsx4("style", { jsx: true, global: true, children: `
        @media print {
          @page { margin: 1cm; }
          html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
          #takeoff-print { display: block !important; }
          header, footer, button { display: none !important; }
        }
      ` })
  ] });
}

// ../layouts/forms/src/components.tsx
import { useState as useState4 } from "react";
import { Fragment as Fragment4, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function StepContainer({ title, subtitle, children, stepLabel }) {
  return /* @__PURE__ */ jsxs5("div", { className: "animate-[fadeIn_0.3s_ease-out]", children: [
    stepLabel && /* @__PURE__ */ jsx5("span", { className: "text-xs font-medium text-slate-400 mb-2 block", children: stepLabel }),
    /* @__PURE__ */ jsx5("h1", { className: "text-xl md:text-2xl font-semibold text-slate-900", children: title }),
    subtitle && /* @__PURE__ */ jsx5("p", { className: "mt-2 text-sm text-slate-500", children: subtitle }),
    /* @__PURE__ */ jsx5("div", { className: "mt-6 md:mt-8", children })
  ] });
}
function StepNav({ theme, onBack, onNext, nextLabel = "Continue", nextDisabled = false, onSkip }) {
  return /* @__PURE__ */ jsxs5("div", { className: "mt-8 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs5("button", { onClick: onBack, className: "cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition min-h-[44px]", children: [
      /* @__PURE__ */ jsx5("svg", { className: "w-4 h-4 inline mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19l-7-7 7-7" }) }),
      "Back"
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
      onSkip && /* @__PURE__ */ jsx5("button", { onClick: onSkip, className: "cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition min-h-[44px]", children: "Skip" }),
      /* @__PURE__ */ jsxs5("button", { onClick: onNext, disabled: nextDisabled, className: "cursor-pointer rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition min-h-[44px]", style: nextDisabled ? { backgroundColor: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" } : { backgroundColor: theme.primary }, children: [
        nextLabel,
        /* @__PURE__ */ jsx5("svg", { className: "w-4 h-4 inline ml-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) })
      ] })
    ] })
  ] });
}
function BigChoiceCard({ theme, onClick, title, description, icon }) {
  return /* @__PURE__ */ jsx5("button", { onClick, className: "w-full text-left rounded-2xl border-2 border-slate-200 bg-white p-5 md:p-6 transition-all cursor-pointer hover:shadow-lg group", onMouseEnter: (e) => {
    e.currentTarget.style.borderColor = theme.primary;
    e.currentTarget.style.boxShadow = `0 4px 20px ${theme.primary}15`;
  }, onMouseLeave: (e) => {
    e.currentTarget.style.borderColor = "";
    e.currentTarget.style.boxShadow = "";
  }, children: /* @__PURE__ */ jsxs5("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsx5("div", { className: "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", style: { backgroundColor: theme.primary }, children: icon === "check" ? /* @__PURE__ */ jsx5("svg", { className: "w-7 h-7", viewBox: "0 0 24 24", style: { fill: "#ffffff" }, children: /* @__PURE__ */ jsx5("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }) }) : /* @__PURE__ */ jsx5("svg", { className: "w-7 h-7", viewBox: "0 0 24 24", style: { fill: "#ffffff" }, children: /* @__PURE__ */ jsx5("path", { d: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" }) }) }),
    /* @__PURE__ */ jsxs5("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx5("h3", { className: "text-base md:text-lg font-semibold text-slate-900", children: title }),
      /* @__PURE__ */ jsx5("p", { className: "mt-1 text-sm text-slate-500", children: description })
    ] }),
    /* @__PURE__ */ jsx5("svg", { className: "w-5 h-5 text-slate-300 group-hover:text-slate-400 transition flex-shrink-0 mt-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) })
  ] }) });
}
function PitchInput({ theme, masterPitch, masterRatio, unitSystem, onUpdateDegrees, onUpdateRatio }) {
  const [mode, setMode] = useState4("degrees");
  const inputCls = "w-24 rounded-lg border border-slate-300 px-3 py-2 text-lg text-center focus:outline-none";
  return /* @__PURE__ */ jsxs5("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx5("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 w-fit", children: [
      /* @__PURE__ */ jsx5("button", { onClick: () => setMode("degrees"), className: "cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition", style: mode === "degrees" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Degrees" }),
      /* @__PURE__ */ jsx5("button", { onClick: () => setMode("ratio"), className: "cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition", style: mode === "ratio" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Ratio" })
    ] }) }),
    /* @__PURE__ */ jsx5("div", { className: "flex items-center gap-3", children: mode === "degrees" ? /* @__PURE__ */ jsxs5(Fragment4, { children: [
      /* @__PURE__ */ jsxs5("div", { className: "relative", children: [
        /* @__PURE__ */ jsx5("input", { type: "number", value: masterPitch, onChange: (e) => onUpdateDegrees(e.target.value), min: 0, max: 89, step: 0.5, inputMode: "decimal", className: inputCls, style: { borderColor: theme.primary } }),
        /* @__PURE__ */ jsx5("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400", children: "deg" })
      ] }),
      /* @__PURE__ */ jsxs5("span", { className: "text-sm text-slate-400", children: [
        "= ",
        masterRatio
      ] })
    ] }) : /* @__PURE__ */ jsxs5(Fragment4, { children: [
      /* @__PURE__ */ jsx5("input", { type: "text", value: masterRatio, onChange: (e) => onUpdateRatio(e.target.value), placeholder: "5:12", className: inputCls, style: { borderColor: theme.primary } }),
      /* @__PURE__ */ jsxs5("span", { className: "text-sm text-slate-400", children: [
        "= ",
        masterPitch,
        " deg"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx5("div", { className: "rounded-xl bg-slate-50 border border-slate-100 p-3", children: /* @__PURE__ */ jsxs5("p", { className: "text-xs text-slate-500", children: [
      "Common pitches: 15 deg (low pitch), 25 deg (standard UK), 35 deg (steep), 45 deg (very steep).",
      unitSystem === "metric" ? " Ratio format is rise:10 (e.g. 4.7:10)." : " Ratio format is rise:12 (e.g. 5:12)."
    ] }) })
  ] });
}
function ComponentStep({ theme, kind, section, measureMode, lenLbl, areaLbl, availableComponents, pitchDegrees, unitSystem, currencySymbol, total, roofAreaTotal, onAddEntry, onRemoveEntry, onUpdateWaste, stepNumber, totalSteps, onBack, onNext, nextLabel, capabilities }) {
  const label = componentLabel(kind);
  const desc = componentDescription(kind);
  const isRoofArea = kind === "roof_area" || kind === "underlay" || kind === "fixings";
  return /* @__PURE__ */ jsxs5("div", { className: "animate-[fadeIn_0.3s_ease-out]", children: [
    /* @__PURE__ */ jsxs5("span", { className: "text-xs font-medium text-slate-400 mb-2 block", children: [
      "Step ",
      stepNumber,
      " of ",
      totalSteps
    ] }),
    /* @__PURE__ */ jsx5("h1", { className: "text-xl md:text-2xl font-semibold text-slate-900", children: label }),
    /* @__PURE__ */ jsx5("p", { className: "mt-1.5 text-sm text-slate-500", children: desc }),
    /* @__PURE__ */ jsx5("div", { className: "mt-4", children: /* @__PURE__ */ jsx5(ComponentGuideBox, { componentKey: kind, highlightColor: theme.primary, measureMode }) }),
    /* @__PURE__ */ jsxs5("div", { className: "mt-5", children: [
      /* @__PURE__ */ jsxs5("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx5("h3", { className: "text-sm font-semibold text-slate-900", children: "Add measurements" }),
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx5("label", { className: "text-xs text-slate-500", children: "Waste" }),
          /* @__PURE__ */ jsxs5("div", { className: "relative", children: [
            /* @__PURE__ */ jsx5("input", { type: "number", value: section.wastePercent, onChange: (e) => onUpdateWaste(parseFloat(e.target.value) || 0), min: 0, max: 100, step: 1, className: "w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs text-center focus:outline-none", style: { borderColor: theme.primary } }),
            /* @__PURE__ */ jsx5("span", { className: "absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400", children: "%" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx5(AddEntryForm, { theme, kind, measureMode, lenLbl, areaLbl, availableComponents, pitchDegrees, unitSystem, currencySymbol, roofAreaTotal: roofAreaTotal ?? null, onAdd: onAddEntry, capabilities })
    ] }),
    section.entries.length > 0 && /* @__PURE__ */ jsxs5("div", { className: "mt-4 space-y-2", children: [
      /* @__PURE__ */ jsxs5("h3", { className: "text-sm font-semibold text-slate-900", children: [
        "Entries (",
        section.entries.length,
        ")"
      ] }),
      section.entries.map((entry, idx) => /* @__PURE__ */ jsx5(EntryRow, { entry, index: idx, kind, measureMode, lenLbl, areaLbl, wastePercent: section.wastePercent, onRemove: () => onRemoveEntry(entry.id) }, entry.id)),
      total.totalCost > 0 && /* @__PURE__ */ jsxs5("div", { className: "mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx5("span", { className: "text-xs text-slate-600", children: "Subtotal (with waste)" }),
        /* @__PURE__ */ jsxs5("span", { className: "text-sm font-semibold", style: { color: theme.primary }, children: [
          currencySymbol,
          total.totalCost.toFixed(2)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx5(StepNav, { theme, onBack, onNext, nextLabel: nextLabel || "Continue", onSkip: onNext })
  ] });
}
function AddEntryForm({ theme, kind, measureMode, lenLbl, areaLbl, availableComponents, pitchDegrees, unitSystem, currencySymbol, roofAreaTotal, onAdd, capabilities }) {
  const pitchType = COMPONENT_DEFS[kind]?.pitchType ?? "none";
  const isRoofArea = kind === "roof_area" || kind === "underlay" || kind === "fixings";
  const usePitch = measureMode === "plan" && pitchType !== "none";
  const planPrefix = measureMode === "plan" ? "Plan " : "";
  const [areaMode, setAreaMode] = useState4(isRoofArea ? "dimensions" : "total");
  const [val1, setVal1] = useState4("");
  const [val2, setVal2] = useState4("");
  const [totalVal, setTotalVal] = useState4("");
  const [quantity, setQuantity] = useState4("1");
  const [label, setLabel] = useState4("");
  const [selectedComponentId, setSelectedComponentId] = useState4(availableComponents[0]?.id ?? null);
  const [pricingMode, setPricingMode] = useState4("component");
  const [knownPrice, setKnownPrice] = useState4("");
  const canUseKnownPrice = capabilities?.knownPriceEntries ?? false;
  const resetForm = () => {
    setVal1("");
    setVal2("");
    setTotalVal("");
    setQuantity("1");
    setLabel("");
    setKnownPrice("");
    setPricingMode("component");
  };
  const handleAdd = () => {
    let entry;
    const qty = parseInt(quantity) || 1;
    const kp = canUseKnownPrice && pricingMode === "known_price" ? parseFloat(knownPrice) : void 0;
    const compId = canUseKnownPrice && pricingMode === "known_price" ? null : selectedComponentId;
    if (isRoofArea) {
      if (areaMode === "dimensions") {
        const w = parseFloat(val1);
        const l = parseFloat(val2);
        if (!w || w <= 0 || !l || l <= 0) return;
        entry = { id: makeId(), label, inputMode: usePitch ? "pitch_calculated" : "actual", planWidth: w, planLengthVal: l, pitchDegrees, actualValue: usePitch ? 0 : w * l, computedValue: 0, selectedComponentId: compId, quantity: qty, isTotalInput: false, knownPrice: kp };
      } else {
        const t = parseFloat(totalVal);
        if (!t || t <= 0) return;
        entry = { id: makeId(), label, inputMode: usePitch ? "pitch_calculated" : "actual", pitchDegrees, actualValue: t, computedValue: 0, selectedComponentId: compId, quantity: qty, isTotalInput: true, knownPrice: kp };
      }
    } else {
      const l = parseFloat(val1);
      if (!l || l <= 0) return;
      entry = { id: makeId(), label, inputMode: usePitch ? "pitch_calculated" : "actual", planLength: l, pitchDegrees, actualValue: usePitch ? 0 : l, computedValue: 0, selectedComponentId: compId, quantity: qty, isTotalInput: false, knownPrice: kp };
    }
    entry.computedValue = computeEntry(entry, kind, pitchType);
    if (isRoofArea) entry.computedValue = areaValueForUnit(entry.computedValue, unitSystem, areaMode === "dimensions");
    onAdd(entry);
    resetForm();
  };
  const canAdd = isRoofArea ? areaMode === "dimensions" ? parseFloat(val1) > 0 && parseFloat(val2) > 0 : parseFloat(totalVal) > 0 : parseFloat(val1) > 0;
  const canAddWithPrice = canAdd && (pricingMode === "component" || pricingMode === "known_price" && parseFloat(knownPrice) > 0);
  const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:outline-none";
  return /* @__PURE__ */ jsxs5("div", { className: "rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3", children: [
    isRoofArea && /* @__PURE__ */ jsx5("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 w-fit", children: [
      /* @__PURE__ */ jsx5("button", { onClick: () => setAreaMode("dimensions"), className: "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition", style: areaMode === "dimensions" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Width x Length" }),
      /* @__PURE__ */ jsx5("button", { onClick: () => setAreaMode("total"), className: "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition", style: areaMode === "total" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Total Area" })
    ] }) }),
    isRoofArea && kind !== "roof_area" && roofAreaTotal !== null && roofAreaTotal > 0 && /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxs5("button", { onClick: () => {
        setAreaMode("total");
        setTotalVal(roofAreaTotal.toFixed(2));
      }, className: "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-white transition", style: { backgroundColor: theme.primary }, children: [
        "Use Roof Area (",
        roofAreaTotal.toFixed(2),
        " ",
        areaLbl,
        ")"
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "relative group flex-shrink-0", children: [
        /* @__PURE__ */ jsx5("span", { className: "cursor-help inline-flex items-center justify-center w-4 h-4 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold", children: "?" }),
        /* @__PURE__ */ jsx5("div", { className: "absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-48 rounded-lg bg-slate-800 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10", children: "This automatically applies the total roof area you added in step 1" })
      ] })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "grid grid-cols-2 gap-3", children: isRoofArea && areaMode === "dimensions" ? /* @__PURE__ */ jsxs5(Fragment4, { children: [
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsxs5("label", { className: "text-xs font-medium text-slate-600", children: [
          planPrefix,
          "Width (",
          lenLbl,
          ")"
        ] }),
        /* @__PURE__ */ jsx5("input", { type: "number", value: val1, onChange: (e) => setVal1(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0", className: inputCls, style: { borderColor: theme.primary } })
      ] }),
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsxs5("label", { className: "text-xs font-medium text-slate-600", children: [
          planPrefix,
          "Length (",
          lenLbl,
          ")"
        ] }),
        /* @__PURE__ */ jsx5("input", { type: "number", value: val2, onChange: (e) => setVal2(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0", className: inputCls, style: { borderColor: theme.primary } })
      ] })
    ] }) : isRoofArea && areaMode === "total" ? /* @__PURE__ */ jsxs5("div", { className: "col-span-2", children: [
      /* @__PURE__ */ jsxs5("label", { className: "text-xs font-medium text-slate-600", children: [
        planPrefix,
        "Area (",
        areaLbl,
        ")"
      ] }),
      /* @__PURE__ */ jsx5("input", { type: "number", value: totalVal, onChange: (e) => setTotalVal(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0", className: inputCls, style: { borderColor: theme.primary } })
    ] }) : /* @__PURE__ */ jsxs5("div", { className: "col-span-2", children: [
      /* @__PURE__ */ jsxs5("label", { className: "text-xs font-medium text-slate-600", children: [
        planPrefix,
        "Length (",
        lenLbl,
        ")"
      ] }),
      /* @__PURE__ */ jsx5("input", { type: "number", value: val1, onChange: (e) => setVal1(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0", className: inputCls, style: { borderColor: theme.primary } })
    ] }) }),
    canUseKnownPrice && availableComponents.length > 0 && /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 w-fit", children: [
      /* @__PURE__ */ jsx5("button", { onClick: () => setPricingMode("component"), className: "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition", style: pricingMode === "component" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Select Product" }),
      /* @__PURE__ */ jsx5("button", { onClick: () => setPricingMode("known_price"), className: "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition", style: pricingMode === "known_price" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Known Price" })
    ] }),
    pricingMode === "component" && availableComponents.length > 0 && /* @__PURE__ */ jsxs5("div", { children: [
      /* @__PURE__ */ jsx5("label", { className: "text-xs font-medium text-slate-600", children: "Product" }),
      /* @__PURE__ */ jsxs5("select", { value: selectedComponentId || "", onChange: (e) => setSelectedComponentId(e.target.value || null), className: "mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none cursor-pointer", style: { borderColor: theme.primary }, children: [
        /* @__PURE__ */ jsx5("option", { value: "", children: "- No product (measurements only) -" }),
        availableComponents.map((comp) => /* @__PURE__ */ jsxs5("option", { value: comp.id, children: [
          comp.name,
          " (",
          currencySymbol,
          comp.price_per_unit.toFixed(2),
          "/",
          comp.unit,
          ")"
        ] }, comp.id))
      ] })
    ] }),
    canUseKnownPrice && pricingMode === "known_price" && /* @__PURE__ */ jsxs5("div", { children: [
      /* @__PURE__ */ jsxs5("label", { className: "text-xs font-medium text-slate-600", children: [
        "Price per ",
        isRoofArea ? areaLbl : lenLbl
      ] }),
      /* @__PURE__ */ jsx5("input", { type: "number", value: knownPrice, onChange: (e) => setKnownPrice(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0.00", className: inputCls, style: { borderColor: theme.primary } })
    ] }),
    pricingMode === "component" && availableComponents.length === 0 && !canUseKnownPrice && /* @__PURE__ */ jsx5("p", { className: "text-xs text-slate-400", children: "No components available for this section." }),
    canUseKnownPrice && pricingMode === "known_price" && availableComponents.length === 0 && /* @__PURE__ */ jsxs5("p", { className: "text-xs text-slate-400", children: [
      "Enter your own price per ",
      isRoofArea ? areaLbl : lenLbl,
      "."
    ] }),
    /* @__PURE__ */ jsx5("input", { type: "text", value: label, onChange: (e) => setLabel(e.target.value), placeholder: "Optional label (e.g. Front gable, Main roof)", className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:outline-none" }),
    /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsx5("label", { className: "text-xs font-medium text-slate-600", children: "Quantity" }),
        /* @__PURE__ */ jsx5("input", { type: "number", value: quantity, onChange: (e) => setQuantity(e.target.value), min: 1, step: 1, inputMode: "numeric", className: inputCls })
      ] }),
      /* @__PURE__ */ jsx5("div", { className: "flex items-end", children: /* @__PURE__ */ jsx5("button", { onClick: handleAdd, disabled: !canAddWithPrice, className: "w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition min-h-[44px]", style: canAddWithPrice ? { backgroundColor: theme.primary } : { backgroundColor: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" }, children: "Add Entry" }) })
    ] })
  ] });
}
function EntryRow({ entry, index, kind, measureMode, lenLbl, areaLbl, wastePercent, onRemove }) {
  const isRoofArea = kind === "roof_area" || kind === "underlay" || kind === "fixings";
  const isFixed = kind.startsWith("custom-") && isCustomFixed(kind);
  const unit = isFixed ? "pcs" : isRoofArea ? areaLbl : lenLbl;
  const usePitch = measureMode === "plan" && entry.inputMode === "pitch_calculated";
  const inputDesc = isFixed ? `Qty: ${entry.quantity ?? 1}` : entry.isTotalInput ? `Total: ${entry.actualValue ?? 0}` : isRoofArea ? `${entry.planWidth ?? 0} x ${entry.planLengthVal ?? 0}` : `${entry.planLength ?? entry.actualValue ?? 0}`;
  return /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300", children: [
    /* @__PURE__ */ jsxs5("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx5("span", { className: "text-sm font-medium text-slate-700", children: entry.label || `Entry ${index + 1}` }),
        usePitch && /* @__PURE__ */ jsxs5("span", { className: "text-xs text-slate-400", children: [
          "@ ",
          entry.pitchDegrees,
          " deg"
        ] }),
        entry.quantity && entry.quantity > 1 && /* @__PURE__ */ jsxs5("span", { className: "text-xs text-slate-400", children: [
          "x",
          entry.quantity
        ] })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
        /* @__PURE__ */ jsx5("span", { className: "text-xs text-slate-400", children: inputDesc }),
        usePitch && /* @__PURE__ */ jsx5("span", { className: "text-xs text-slate-300", children: "->" }),
        /* @__PURE__ */ jsxs5("span", { className: "text-xs text-slate-500", children: [
          entry.computedValue.toFixed(2),
          " ",
          unit
        ] }),
        wastePercent > 0 && /* @__PURE__ */ jsxs5("span", { className: "text-xs text-slate-400", children: [
          "+",
          wastePercent,
          "% = ",
          (entry.computedValue * (1 + wastePercent / 100)).toFixed(2)
        ] })
      ] }),
      entry.knownPrice != null && entry.knownPrice > 0 && /* @__PURE__ */ jsxs5("div", { className: "mt-0.5", children: [
        /* @__PURE__ */ jsx5("span", { className: "text-xs text-slate-500", children: "Known price" }),
        " ",
        /* @__PURE__ */ jsxs5("span", { className: "text-xs font-medium", style: { color: "#BD4A1A" }, children: [
          entry.knownPrice.toFixed(2),
          "/",
          isFixed ? "pc" : isRoofArea ? areaLbl : lenLbl
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx5("button", { onClick: onRemove, className: "text-slate-300 hover:text-red-500 transition p-1 cursor-pointer", "aria-label": "Remove entry", children: /* @__PURE__ */ jsx5("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx5("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })
  ] });
}

// ../layouts/forms/src/FormsLayout.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var COMPONENT_STEPS = BUILT_IN_ORDER.filter((k) => k !== "roof_area");
function FormsLayout({ theme, components, initialMeasureMode = null, pricingMode = null, onSwitchLayout, capabilities, prefill = null }) {
  const [measureMode, setMeasureMode] = useState5(prefill?.measureMode ?? initialMeasureMode);
  const [step, setStep] = useState5(prefill?.measureMode ?? initialMeasureMode ? 1 : 0);
  const [masterPitch, setMasterPitch] = useState5("25");
  const [masterRatio, setMasterRatio] = useState5("5:12");
  const [sections, setSections] = useState5(makeInitialSections);
  const [customSections, setCustomSections] = useState5({});
  const [showResults, setShowResults] = useState5(false);
  const [prefillApplied, setPrefillApplied] = useState5(!prefill);
  const u = theme.defaultUnits;
  const lenLbl = unitLabel(u);
  const areaLbl = areaUnitLabel(u);
  const cur = theme.currencySymbol;
  const componentsByKind = useMemo(() => {
    const map = {};
    for (const kind of BUILT_IN_ORDER) {
      map[kind] = components.filter((c) => c.component_kind === kind);
    }
    return map;
  }, [components]);
  const getComponentById = useCallback((id) => {
    if (!id) return null;
    return components.find((c) => c.id === id) ?? null;
  }, [components]);
  const effectivePitch = parseFloat(masterPitch) || 0;
  useEffect2(() => {
    if (measureMode !== "plan") return;
    const recalculate = (current) => {
      let changed = false;
      const next = {};
      for (const [key, section] of Object.entries(current)) {
        const pitchType = section.customDef?.pitchType ?? COMPONENT_DEFS[key]?.pitchType ?? "none";
        const isArea = key === "roof_area" || key === "underlay" || key === "fixings" || section.customDef?.measurementType === "area";
        const entries = section.entries.map((entry) => {
          if (entry.inputMode !== "pitch_calculated") return entry;
          const updated = { ...entry, pitchDegrees: effectivePitch };
          let cv = computeEntry(updated, key, pitchType);
          if (isArea) cv = areaValueForUnit(cv, u, !entry.isTotalInput);
          changed = changed || cv !== entry.computedValue || entry.pitchDegrees !== effectivePitch;
          return { ...updated, computedValue: cv };
        });
        next[key] = { ...section, entries };
      }
      return changed ? next : current;
    };
    setSections(recalculate);
    setCustomSections(recalculate);
  }, [effectivePitch, measureMode, u]);
  const allSections = useMemo(() => ({ ...sections, ...customSections }), [sections, customSections]);
  const allKeys = useMemo(() => [...BUILT_IN_ORDER, ...Object.keys(customSections)], [customSections]);
  const showLabour = pricingMode !== "material";
  const calculation = useMemo(
    () => calculateTakeoffSections(allSections, allKeys, getComponentById, showLabour),
    [allSections, allKeys, getComponentById, showLabour]
  );
  const totals = calculation.sections;
  const hasData = calculation.totalEntries > 0;
  const grandTotal = showLabour ? calculation.grandTotal : calculation.materialTotal;
  const addEntry = (key, entry) => {
    const setter = key.startsWith("custom-") ? setCustomSections : setSections;
    setter((prev) => ({ ...prev, [key]: { ...prev[key], entries: [...prev[key].entries, entry] } }));
  };
  const removeEntry = (key, entryId) => {
    const setter = key.startsWith("custom-") ? setCustomSections : setSections;
    setter((prev) => ({ ...prev, [key]: { ...prev[key], entries: prev[key].entries.filter((e) => e.id !== entryId) } }));
  };
  const updateWaste = (key, waste) => {
    const setter = key.startsWith("custom-") ? setCustomSections : setSections;
    setter((prev) => ({ ...prev, [key]: { ...prev[key], wastePercent: waste } }));
  };
  const totalSteps = measureMode === "plan" ? 2 + COMPONENT_STEPS.length : 1 + COMPONENT_STEPS.length;
  const roofAreaStep = measureMode === "plan" ? 2 : 1;
  const lastComponentStep = measureMode === "plan" ? 2 + COMPONENT_STEPS.length : 1 + COMPONENT_STEPS.length;
  const stepIndex = Math.min(step, lastComponentStep);
  const progress = (stepIndex + 1) / totalSteps * 100;
  const handleNext = () => {
    if (step >= lastComponentStep) {
      setShowResults(true);
    } else {
      setStep((s) => Math.min(s + 1, lastComponentStep));
    }
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));
  useEffect2(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  const startOver = () => {
    setSections(makeInitialSections());
    setCustomSections({});
    setMasterPitch("25");
    setMasterRatio("5:12");
    setMeasureMode(null);
    setStep(0);
    setShowResults(false);
  };
  const updatePitchDegrees = (val) => {
    setMasterPitch(val);
    const deg = parseFloat(val) || 0;
    setMasterRatio(degreesToRatio(deg, u));
  };
  useEffect2(() => {
    if (!prefill || prefillApplied) return;
    const pitch = prefill.pitchDegrees;
    if (typeof pitch === "number" && pitch > 0 && Number.isFinite(pitch)) {
      setMasterPitch(String(pitch));
      setMasterRatio(degreesToRatio(pitch, u));
    }
    setSections((prev) => {
      const next = { ...prev };
      const entriesByKind = entriesFromPrefillValues(prefill.values, prefill.measureMode, typeof pitch === "number" ? pitch : parseFloat(masterPitch) || 0, u);
      for (const [k, entries] of Object.entries(entriesByKind)) {
        if (next[k]) next[k] = { ...next[k], entries };
      }
      if (prefill.wastePercent) {
        for (const [k, w] of Object.entries(prefill.wastePercent)) {
          if (next[k]) next[k] = { ...next[k], wastePercent: w };
        }
      }
      return next;
    });
    setPrefillApplied(true);
  }, [prefill, prefillApplied]);
  return /* @__PURE__ */ jsxs6(
    "main",
    {
      className: "roof-takeoff-theme min-h-screen bg-white flex flex-col",
      style: { fontFamily: theme.bodyFont, "--roof-heading-font": theme.headingFont },
      children: [
        /* @__PURE__ */ jsxs6("header", { className: "border-b border-slate-100 sticky top-0 z-10 bg-white/95 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsxs6("div", { className: "mx-auto max-w-2xl px-4 py-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx6(Link, { href: theme.homeUrl ?? "/", className: "flex items-center", children: theme.logoUrl ? /* @__PURE__ */ jsx6("img", { src: theme.logoUrl, alt: theme.supplierName ?? void 0, className: "h-8 md:h-10 w-auto" }) : /* @__PURE__ */ jsx6("span", { className: "text-sm font-semibold text-slate-900", children: theme.copy.headerTitle }) }),
            /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-3", children: [
              onSwitchLayout && /* @__PURE__ */ jsx6("button", { onClick: () => onSwitchLayout("fast"), className: "cursor-pointer rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition", children: "Fast mode" }),
              theme.copy.poweredBy && /* @__PURE__ */ jsx6("span", { className: "text-xs text-slate-400", children: theme.copy.poweredBy })
            ] })
          ] }),
          measureMode && !showResults && /* @__PURE__ */ jsx6("div", { className: "h-1 bg-slate-100", children: /* @__PURE__ */ jsx6("div", { className: "h-full transition-all duration-300 ease-out", style: { width: `${progress}%`, backgroundColor: theme.primary } }) })
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "flex-1 mx-auto w-full max-w-2xl px-4 py-8 md:py-12", children: [
          step === 0 && !measureMode && /* @__PURE__ */ jsx6(StepContainer, { title: "How do you want to enter your measurements?", subtitle: "Choose the method that matches your measurements.", children: /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx6(BigChoiceCard, { theme, onClick: () => {
              setMeasureMode("actual");
              setStep(1);
            }, title: "I have actual measurements", description: "You already have final roof dimensions. Just type them in - no pitch calculation needed.", icon: "check" }),
            /* @__PURE__ */ jsx6(BigChoiceCard, { theme, onClick: () => {
              setMeasureMode("plan");
              setStep(1);
            }, title: "I'm measuring from a plan", description: "You have a top-down roof plan. Enter plan dimensions and the roof pitch - we'll calculate the real sloped lengths and areas.", icon: "plan" })
          ] }) }),
          measureMode === "plan" && step === 1 && /* @__PURE__ */ jsxs6(StepContainer, { title: "What is your roof pitch?", subtitle: "This is the angle of the roof slope. We use it to calculate the real sloped lengths from your plan measurements.", stepLabel: `Step 1 of ${totalSteps}`, children: [
            /* @__PURE__ */ jsx6(PitchInput, { theme, masterPitch, masterRatio, unitSystem: u, onUpdateDegrees: updatePitchDegrees, onUpdateRatio: (val) => {
              setMasterRatio(val);
              const deg = ratioToDegrees(val);
              if (deg > 0) setMasterPitch(deg.toFixed(1));
            } }),
            /* @__PURE__ */ jsx6(StepNav, { theme, onBack: () => {
              window.location.href = "/";
            }, onNext: handleNext, nextLabel: "Next: Roof Area" })
          ] }),
          measureMode && step === roofAreaStep && /* @__PURE__ */ jsx6(ComponentStep, { theme, kind: "roof_area", section: sections["roof_area"], measureMode, lenLbl, areaLbl, availableComponents: componentsByKind["roof_area"] || [], pitchDegrees: effectivePitch, unitSystem: u, currencySymbol: cur, total: totals["roof_area"], onAddEntry: (entry) => addEntry("roof_area", entry), onRemoveEntry: (id) => removeEntry("roof_area", id), onUpdateWaste: (w) => updateWaste("roof_area", w), stepNumber: measureMode === "plan" ? 2 : 1, totalSteps, onBack: () => window.location.href = "/", onNext: handleNext, nextLabel: COMPONENT_STEPS.length > 0 ? `Next: ${componentLabel(COMPONENT_STEPS[0])}` : "Generate Report", capabilities }),
          measureMode && COMPONENT_STEPS.map((kind, idx) => {
            const stepNum = (measureMode === "plan" ? 3 : 2) + idx;
            if (step !== stepNum) return null;
            const isLast = idx === COMPONENT_STEPS.length - 1;
            const nextLabel = isLast ? "Generate Report" : `Next: ${componentLabel(COMPONENT_STEPS[idx + 1])}`;
            return /* @__PURE__ */ jsx6(ComponentStep, { theme, kind, section: sections[kind], measureMode, lenLbl, areaLbl, availableComponents: componentsByKind[kind] || [], pitchDegrees: effectivePitch, unitSystem: u, currencySymbol: cur, total: totals[kind], roofAreaTotal: kind === "underlay" || kind === "fixings" ? totals["roof_area"]?.rawTotal ?? null : null, onAddEntry: (entry) => addEntry(kind, entry), onRemoveEntry: (id) => removeEntry(kind, id), onUpdateWaste: (w) => updateWaste(kind, w), stepNumber: stepNum, totalSteps, onBack: handleBack, onNext: handleNext, nextLabel, capabilities }, kind);
          }),
          showResults && /* @__PURE__ */ jsx6(ResultsModal, { sections: allSections, totals, getComponentById, grandTotal, unitSystem: u, allKeys, currencySymbol: cur, theme, supplierSlug: theme.supplierSlug, onClose: () => setShowResults(false), onEdit: () => {
            setShowResults(false);
            setStep(measureMode === "plan" ? 2 : 1);
          } })
        ] }),
        /* @__PURE__ */ jsx6("footer", { className: "border-t border-slate-100 py-4", children: /* @__PURE__ */ jsxs6("div", { className: "mx-auto max-w-2xl px-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx6("span", { className: "text-xs text-slate-400", children: theme.copy.footerText }),
          measureMode && !showResults && /* @__PURE__ */ jsx6("button", { onClick: startOver, className: "text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer", children: "Start over" })
        ] }) }),
        /* @__PURE__ */ jsx6("style", { jsx: true, global: true, children: `
        .roof-takeoff-theme h1,
        .roof-takeoff-theme h2,
        .roof-takeoff-theme h3 { font-family: var(--roof-heading-font); }
      ` })
      ]
    }
  );
}

// ../layouts/classic/src/ClassicLayout.tsx
import { useState as useState7, useMemo as useMemo2, useCallback as useCallback2, useEffect as useEffect3 } from "react";
import Link2 from "next/link";

// ../layouts/classic/src/components.tsx
import { useState as useState6 } from "react";
import { Fragment as Fragment5, jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
function InfoIcon({ text, color = "#94a3b8" }) {
  const [open, setOpen] = useState6(false);
  return /* @__PURE__ */ jsxs7("div", { className: "relative inline-flex", onMouseLeave: () => setOpen(false), children: [
    /* @__PURE__ */ jsx7(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        onMouseEnter: () => setOpen(true),
        className: "text-slate-300 hover:text-slate-500 transition rounded-full p-0.5 cursor-pointer",
        "aria-label": "More info",
        children: /* @__PURE__ */ jsx7("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) })
      }
    ),
    open && /* @__PURE__ */ jsxs7("div", { className: "absolute z-50 top-full left-1/2 -translate-x-1/2 mt-1 w-64 rounded-lg bg-slate-900 text-white text-xs p-3 shadow-lg", style: { borderColor: color }, children: [
      text,
      /* @__PURE__ */ jsx7("div", { className: "absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" })
    ] })
  ] });
}
function ComponentSymbol2({ kind, customDef, className = "w-4 h-4", color }) {
  const stroke = color || "currentColor";
  const sw = 1.8;
  switch (kind) {
    case "roof_area":
      return /* @__PURE__ */ jsx7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l9-9 9 9M5 10v10h14V10" }) });
    case "ridge":
      return /* @__PURE__ */ jsx7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 20L12 6l8 14" }) });
    case "hip":
      return /* @__PURE__ */ jsx7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 20L12 6l8 14" }) });
    case "valley":
      return /* @__PURE__ */ jsx7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6l8 14 8-14" }) });
    case "barge":
      return /* @__PURE__ */ jsx7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 20V4h14" }) });
    case "spouting":
      return /* @__PURE__ */ jsx7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 8v3a2 2 0 002 2h12a2 2 0 002-2V8" }) });
    case "underlay":
      return /* @__PURE__ */ jsxs7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: [
        /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l9-5 9 5-9 5-9-5z" }),
        /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l9 5 9-5" }),
        /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16l9 5 9-5" })
      ] });
    case "fixings":
      return /* @__PURE__ */ jsx7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 4h8M12 4v16M9 20l3-2 3 2" }) });
    default:
      if (customDef?.measurementType === "area") {
        return /* @__PURE__ */ jsxs7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: [
          /* @__PURE__ */ jsx7("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
          /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 16l8-8M8 8h.01M16 16h.01" })
        ] });
      }
      return /* @__PURE__ */ jsx7("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke, strokeWidth: sw, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.5 19.5h3m-3 0v-3" }) });
  }
}
function AddEntryForm2({ theme, kind, customDef, measureMode, lenLabel, areaLabel, availableComponents, pitchDegrees, unitSystem, roofAreaTotal, onAdd, capabilities }) {
  const pitchType = customDef?.pitchType ?? COMPONENT_DEFS[kind]?.pitchType ?? "none";
  const isRoofArea = kind === "roof_area" || kind === "underlay" || kind === "fixings" || customDef?.measurementType === "area";
  const isFixed = customDef?.measurementType === "fixed";
  const usePitch = measureMode === "plan" && pitchType !== "none";
  const planPrefix = measureMode === "plan" ? "Plan " : "";
  const [areaMode, setAreaMode] = useState6(isRoofArea ? "dimensions" : "total");
  const [val1, setVal1] = useState6("");
  const [val2, setVal2] = useState6("");
  const [totalVal, setTotalVal] = useState6("");
  const [quantity, setQuantity] = useState6("1");
  const [label, setLabel] = useState6("");
  const [selectedComponentId, setSelectedComponentId] = useState6(availableComponents[0]?.id ?? null);
  const [pricingMode, setPricingMode] = useState6("component");
  const [knownPrice, setKnownPrice] = useState6("");
  const canUseKnownPrice = capabilities?.knownPriceEntries ?? false;
  const resetForm = () => {
    setVal1("");
    setVal2("");
    setTotalVal("");
    setQuantity("1");
    setLabel("");
    setKnownPrice("");
    setPricingMode("component");
  };
  const handleAdd = () => {
    let entry;
    const qty = parseInt(quantity) || 1;
    const kp = canUseKnownPrice && pricingMode === "known_price" ? parseFloat(knownPrice) : void 0;
    const compId = canUseKnownPrice && pricingMode === "known_price" ? null : selectedComponentId;
    if (isFixed) {
      entry = { id: makeId(), label, inputMode: "actual", pitchDegrees: 0, actualValue: qty, computedValue: 0, selectedComponentId: compId, quantity: qty, isTotalInput: false, knownPrice: kp };
      entry.computedValue = computeEntry(entry, kind, pitchType);
      onAdd(entry);
      resetForm();
      return;
    }
    if (isRoofArea) {
      if (areaMode === "dimensions") {
        const w = parseFloat(val1);
        const l = parseFloat(val2);
        if (!w || w <= 0 || !l || l <= 0) return;
        entry = { id: makeId(), label, inputMode: usePitch ? "pitch_calculated" : "actual", planWidth: w, planLengthVal: l, pitchDegrees, actualValue: usePitch ? 0 : w * l, computedValue: 0, selectedComponentId: compId, quantity: qty, isTotalInput: false, knownPrice: kp };
      } else {
        const t = parseFloat(totalVal);
        if (!t || t <= 0) return;
        entry = { id: makeId(), label, inputMode: usePitch ? "pitch_calculated" : "actual", pitchDegrees, actualValue: t, computedValue: 0, selectedComponentId: compId, quantity: qty, isTotalInput: true, knownPrice: kp };
      }
    } else {
      const l = parseFloat(val1);
      if (!l || l <= 0) return;
      entry = { id: makeId(), label, inputMode: usePitch ? "pitch_calculated" : "actual", planLength: l, pitchDegrees, actualValue: usePitch ? 0 : l, computedValue: 0, selectedComponentId: compId, quantity: qty, isTotalInput: false, knownPrice: kp };
    }
    entry.computedValue = computeEntry(entry, kind, pitchType);
    if (isRoofArea) entry.computedValue = areaValueForUnit(entry.computedValue, unitSystem, areaMode === "dimensions");
    onAdd(entry);
    resetForm();
  };
  const canAdd = isFixed ? parseInt(quantity) > 0 : isRoofArea ? areaMode === "dimensions" ? parseFloat(val1) > 0 && parseFloat(val2) > 0 : parseFloat(totalVal) > 0 : parseFloat(val1) > 0;
  const canAddWithPrice = canAdd && (pricingMode === "component" || pricingMode === "known_price" && parseFloat(knownPrice) > 0);
  const inputCls = "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:outline-none";
  const cur = theme.currencySymbol;
  return /* @__PURE__ */ jsxs7("div", { className: "rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3", children: [
    isRoofArea && /* @__PURE__ */ jsx7("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 w-fit", children: [
      /* @__PURE__ */ jsx7("button", { onClick: () => setAreaMode("dimensions"), className: "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition", style: areaMode === "dimensions" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Width x Length" }),
      /* @__PURE__ */ jsx7("button", { onClick: () => setAreaMode("total"), className: "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition", style: areaMode === "total" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Total Area" })
    ] }) }),
    isRoofArea && kind !== "roof_area" && roofAreaTotal !== null && roofAreaTotal > 0 && /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxs7("button", { onClick: () => {
        setAreaMode("total");
        setTotalVal(roofAreaTotal.toFixed(2));
      }, className: "cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-white transition", style: { backgroundColor: theme.primary }, children: [
        "Use Roof Area (",
        roofAreaTotal.toFixed(2),
        " ",
        areaLabel,
        ")"
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "relative group flex-shrink-0", children: [
        /* @__PURE__ */ jsx7("span", { className: "cursor-help inline-flex items-center justify-center w-4 h-4 rounded-full border border-slate-300 text-slate-400 text-[10px] font-bold", children: "?" }),
        /* @__PURE__ */ jsx7("div", { className: "absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-48 rounded-lg bg-slate-800 text-white text-xs px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10", children: "This automatically applies the total roof area you added in step 1" })
      ] })
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "grid grid-cols-2 gap-3", children: isFixed ? /* @__PURE__ */ jsxs7("div", { className: "col-span-2", children: [
      /* @__PURE__ */ jsx7("label", { className: "text-xs font-medium text-slate-600", children: "Quantity" }),
      /* @__PURE__ */ jsx7("input", { type: "number", value: quantity, onChange: (e) => setQuantity(e.target.value), min: 1, step: 1, inputMode: "numeric", placeholder: "1", className: inputCls })
    ] }) : isRoofArea && areaMode === "dimensions" ? /* @__PURE__ */ jsxs7(Fragment5, { children: [
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsxs7("label", { className: "text-xs font-medium text-slate-600", children: [
          planPrefix,
          "Width (",
          lenLabel,
          ")"
        ] }),
        /* @__PURE__ */ jsx7("input", { type: "number", value: val1, onChange: (e) => setVal1(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0", className: inputCls, style: { borderColor: theme.primary } })
      ] }),
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsxs7("label", { className: "text-xs font-medium text-slate-600", children: [
          planPrefix,
          "Length (",
          lenLabel,
          ")"
        ] }),
        /* @__PURE__ */ jsx7("input", { type: "number", value: val2, onChange: (e) => setVal2(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0", className: inputCls, style: { borderColor: theme.primary } })
      ] })
    ] }) : isRoofArea && areaMode === "total" ? /* @__PURE__ */ jsxs7("div", { className: "col-span-2", children: [
      /* @__PURE__ */ jsxs7("label", { className: "text-xs font-medium text-slate-600", children: [
        planPrefix,
        "Area (",
        areaLabel,
        ")"
      ] }),
      /* @__PURE__ */ jsx7("input", { type: "number", value: totalVal, onChange: (e) => setTotalVal(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0", className: inputCls, style: { borderColor: theme.primary } })
    ] }) : /* @__PURE__ */ jsxs7("div", { className: "col-span-2", children: [
      /* @__PURE__ */ jsxs7("label", { className: "text-xs font-medium text-slate-600", children: [
        planPrefix,
        "Length (",
        lenLabel,
        ")"
      ] }),
      /* @__PURE__ */ jsx7("input", { type: "number", value: val1, onChange: (e) => setVal1(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0", className: inputCls, style: { borderColor: theme.primary } })
    ] }) }),
    canUseKnownPrice && availableComponents.length > 0 && /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 w-fit", children: [
      /* @__PURE__ */ jsx7("button", { onClick: () => setPricingMode("component"), className: "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition", style: pricingMode === "component" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Select Product" }),
      /* @__PURE__ */ jsx7("button", { onClick: () => setPricingMode("known_price"), className: "cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition", style: pricingMode === "known_price" ? { backgroundColor: theme.primary, color: "#fff" } : { color: "#64748b" }, children: "Known Price" })
    ] }),
    pricingMode === "component" && availableComponents.length > 0 && /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsx7("label", { className: "text-xs font-medium text-slate-600", children: "Product" }),
      /* @__PURE__ */ jsxs7("select", { value: selectedComponentId || "", onChange: (e) => setSelectedComponentId(e.target.value || null), className: "mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:outline-none cursor-pointer", style: { borderColor: theme.primary }, children: [
        /* @__PURE__ */ jsx7("option", { value: "", children: "- No product (measurements only) -" }),
        availableComponents.map((comp) => /* @__PURE__ */ jsxs7("option", { value: comp.id, children: [
          comp.name,
          " (",
          cur,
          comp.price_per_unit.toFixed(2),
          "/",
          comp.unit,
          ")"
        ] }, comp.id))
      ] })
    ] }),
    canUseKnownPrice && pricingMode === "known_price" && /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsxs7("label", { className: "text-xs font-medium text-slate-600", children: [
        "Price per ",
        isFixed ? "piece" : isRoofArea ? areaLabel : lenLabel
      ] }),
      /* @__PURE__ */ jsx7("input", { type: "number", value: knownPrice, onChange: (e) => setKnownPrice(e.target.value), min: 0, step: "any", inputMode: "decimal", placeholder: "0.00", className: inputCls, style: { borderColor: theme.primary } })
    ] }),
    /* @__PURE__ */ jsx7("input", { type: "text", value: label, onChange: (e) => setLabel(e.target.value), placeholder: "Optional label (e.g. Front gable, Main roof)", className: "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:outline-none" }),
    /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsx7("label", { className: "text-xs font-medium text-slate-600", children: "Quantity" }),
        /* @__PURE__ */ jsx7("input", { type: "number", value: quantity, onChange: (e) => setQuantity(e.target.value), min: 1, step: 1, inputMode: "numeric", className: inputCls })
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "flex items-end", children: /* @__PURE__ */ jsx7("button", { onClick: handleAdd, disabled: !canAddWithPrice, className: "w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition min-h-[44px]", style: canAddWithPrice ? { backgroundColor: theme.primary } : { backgroundColor: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" }, children: "Add Entry" }) })
    ] })
  ] });
}
function EntryListItem({ entry, index, kind, customDef, measureMode, lenLabel, areaLabel, wastePercent, onRemove }) {
  const isRoofArea = kind === "roof_area" || kind === "underlay" || kind === "fixings" || customDef?.measurementType === "area";
  const isFixed = customDef?.measurementType === "fixed";
  const unit = isFixed ? "pcs" : isRoofArea ? areaLabel : lenLabel;
  const usePitch = measureMode === "plan" && entry.inputMode === "pitch_calculated";
  const inputDesc = isFixed ? `Qty: ${entry.quantity ?? 1}` : entry.isTotalInput ? `Total: ${entry.actualValue ?? 0}` : isRoofArea ? `${entry.planWidth ?? 0} x ${entry.planLengthVal ?? 0}` : `${entry.planLength ?? entry.actualValue ?? 0}`;
  return /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300", children: [
    /* @__PURE__ */ jsxs7("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx7("span", { className: "text-sm font-medium text-slate-700", children: entry.label || `Entry ${index + 1}` }),
        usePitch && /* @__PURE__ */ jsxs7("span", { className: "text-xs text-slate-400", children: [
          "@ ",
          entry.pitchDegrees,
          " deg"
        ] }),
        entry.quantity && entry.quantity > 1 && /* @__PURE__ */ jsxs7("span", { className: "text-xs text-slate-400", children: [
          "x",
          entry.quantity
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
        /* @__PURE__ */ jsx7("span", { className: "text-xs text-slate-400", children: inputDesc }),
        usePitch && /* @__PURE__ */ jsx7("span", { className: "text-xs text-slate-300", children: "->" }),
        /* @__PURE__ */ jsxs7("span", { className: "text-xs text-slate-500", children: [
          entry.computedValue.toFixed(2),
          " ",
          unit
        ] }),
        wastePercent > 0 && /* @__PURE__ */ jsxs7("span", { className: "text-xs text-slate-400", children: [
          "+",
          wastePercent,
          "% = ",
          (entry.computedValue * (1 + wastePercent / 100)).toFixed(2)
        ] })
      ] }),
      entry.knownPrice != null && entry.knownPrice > 0 && /* @__PURE__ */ jsxs7("div", { className: "mt-0.5", children: [
        /* @__PURE__ */ jsx7("span", { className: "text-xs text-slate-500", children: "Known price" }),
        " ",
        /* @__PURE__ */ jsxs7("span", { className: "text-xs font-medium", style: { color: "#BD4A1A" }, children: [
          entry.knownPrice.toFixed(2),
          "/",
          isFixed ? "pc" : isRoofArea ? areaLabel : lenLabel
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx7("button", { onClick: onRemove, className: "text-slate-300 hover:text-red-500 transition p-1 cursor-pointer", "aria-label": "Remove entry", children: /* @__PURE__ */ jsx7("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })
  ] });
}
function CustomComponentCreator({ theme, onCreate }) {
  const [open, setOpen] = useState6(false);
  const [name, setName] = useState6("");
  const [measurementType, setMeasurementType] = useState6("linear");
  const [pitchType, setPitchType] = useState6("none");
  const [waste, setWaste] = useState6("5");
  const handleCreate = () => {
    if (!name.trim()) return;
    const def = {
      id: makeCustomId(),
      name: name.trim(),
      measurementType,
      pitchType: measurementType === "fixed" ? "none" : pitchType,
      wastePercent: parseFloat(waste) || 5
    };
    registerCustomKind(def.id, measurementType === "area", measurementType === "fixed");
    onCreate(def);
    setName("");
    setMeasurementType("linear");
    setPitchType("none");
    setWaste("5");
    setOpen(false);
  };
  if (!open) {
    return /* @__PURE__ */ jsx7("button", { onClick: () => setOpen(true), className: "w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:bg-slate-50 transition cursor-pointer", children: "+ Add Custom Component" });
  }
  return /* @__PURE__ */ jsxs7("div", { className: "rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3", children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx7("h4", { className: "text-sm font-semibold text-slate-900", children: "Add Custom Component" }),
      /* @__PURE__ */ jsx7("button", { onClick: () => setOpen(false), className: "text-slate-400 hover:text-slate-600 cursor-pointer", children: /* @__PURE__ */ jsx7("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx7("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) })
    ] }),
    /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsx7("label", { className: "text-xs font-medium text-slate-600", children: "Name" }),
      /* @__PURE__ */ jsx7("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g. Skylight flashing", className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none mt-0.5", style: { borderColor: name ? theme.primary : void 0 } })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsx7("label", { className: "text-xs font-medium text-slate-600", children: "Type" }),
        /* @__PURE__ */ jsxs7("select", { value: measurementType, onChange: (e) => setMeasurementType(e.target.value), className: "w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none mt-0.5 cursor-pointer", children: [
          /* @__PURE__ */ jsx7("option", { value: "linear", children: "Linear" }),
          /* @__PURE__ */ jsx7("option", { value: "area", children: "Area" }),
          /* @__PURE__ */ jsx7("option", { value: "fixed", children: "Fixed" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsx7("label", { className: "text-xs font-medium text-slate-600", children: "Pitch" }),
        /* @__PURE__ */ jsxs7("select", { value: measurementType === "fixed" ? "none" : pitchType, onChange: (e) => setPitchType(e.target.value), disabled: measurementType === "fixed", className: "w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none mt-0.5 cursor-pointer", children: [
          /* @__PURE__ */ jsx7("option", { value: "none", children: "None" }),
          /* @__PURE__ */ jsx7("option", { value: "rafter", children: "Rafter" }),
          /* @__PURE__ */ jsx7("option", { value: "hip_valley", children: "Hip/Valley" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsx7("label", { className: "text-xs font-medium text-slate-600", children: "Waste %" }),
        /* @__PURE__ */ jsx7("input", { type: "number", value: measurementType === "fixed" ? "0" : waste, onChange: (e) => setWaste(e.target.value), min: 0, max: 100, step: 1, disabled: measurementType === "fixed", className: "w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none mt-0.5" })
      ] })
    ] }),
    measurementType === "fixed" && /* @__PURE__ */ jsx7("p", { className: "text-xs text-slate-400", children: "Fixed components are priced per piece. Enter the quantity when adding entries." }),
    /* @__PURE__ */ jsx7("button", { onClick: handleCreate, disabled: !name.trim(), className: "w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition cursor-pointer disabled:opacity-50", style: { backgroundColor: theme.primary }, children: "Add Component" })
  ] });
}

// ../layouts/classic/src/ClassicLayout.tsx
import { Fragment as Fragment6, jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
function ClassicLayout({ theme, components, initialMeasureMode = null, pricingMode = null, capabilities, prefill = null, onSwitchLayout }) {
  const [measureMode, setMeasureMode] = useState7(prefill?.measureMode ?? initialMeasureMode);
  const [step, setStep] = useState7(0);
  const [masterPitch, setMasterPitch] = useState7("25");
  const [masterRatio, setMasterRatio] = useState7("5:12");
  const [pitchMode, setPitchMode] = useState7("degrees");
  const [sections, setSections] = useState7(makeInitialSections);
  const [customSections, setCustomSections] = useState7({});
  const [expandedSection, setExpandedSection] = useState7("roof_area");
  const [showResults, setShowResults] = useState7(false);
  const [prefillApplied, setPrefillApplied] = useState7(!prefill);
  const u = theme.defaultUnits;
  const lenLbl = unitLabel(u);
  const areaLbl = areaUnitLabel(u);
  const cur = theme.currencySymbol;
  const componentsByKind = useMemo2(() => {
    const map = {};
    for (const kind of BUILT_IN_ORDER) {
      map[kind] = components.filter((c) => c.component_kind === kind);
    }
    return map;
  }, [components]);
  const getComponentById = useCallback2((id) => {
    if (!id) return null;
    return components.find((c) => c.id === id) ?? null;
  }, [components]);
  const effectivePitch = parseFloat(masterPitch) || 0;
  useEffect3(() => {
    if (measureMode !== "plan") return;
    const recalculate = (current) => {
      let changed = false;
      const next = {};
      for (const [key, section] of Object.entries(current)) {
        const pitchType = section.customDef?.pitchType ?? COMPONENT_DEFS[key]?.pitchType ?? "none";
        const isArea = key === "roof_area" || key === "underlay" || key === "fixings" || section.customDef?.measurementType === "area";
        const entries = section.entries.map((entry) => {
          if (entry.inputMode !== "pitch_calculated") return entry;
          const updated = { ...entry, pitchDegrees: effectivePitch };
          let cv = computeEntry(updated, key, pitchType);
          if (isArea) cv = areaValueForUnit(cv, u, !entry.isTotalInput);
          changed = changed || cv !== entry.computedValue || entry.pitchDegrees !== effectivePitch;
          return { ...updated, computedValue: cv };
        });
        next[key] = { ...section, entries };
      }
      return changed ? next : current;
    };
    setSections(recalculate);
    setCustomSections(recalculate);
  }, [effectivePitch, measureMode, u]);
  const allSections = useMemo2(() => ({ ...sections, ...customSections }), [sections, customSections]);
  const allKeys = useMemo2(() => [...BUILT_IN_ORDER, ...Object.keys(customSections)], [customSections]);
  const showLabour = pricingMode !== "material";
  const calculation = useMemo2(
    () => calculateTakeoffSections(allSections, allKeys, getComponentById, showLabour),
    [allSections, allKeys, getComponentById, showLabour]
  );
  const totals = calculation.sections;
  const hasData = calculation.totalEntries > 0;
  const grandTotal = showLabour ? calculation.grandTotal : calculation.materialTotal;
  const addEntry = (key, entry) => {
    const setter = key.startsWith("custom-") ? setCustomSections : setSections;
    setter((prev) => ({ ...prev, [key]: { ...prev[key], entries: [...prev[key].entries, entry] } }));
  };
  const removeEntry = (key, entryId) => {
    const setter = key.startsWith("custom-") ? setCustomSections : setSections;
    setter((prev) => ({ ...prev, [key]: { ...prev[key], entries: prev[key].entries.filter((e) => e.id !== entryId) } }));
  };
  const updateWaste = (key, waste) => {
    const setter = key.startsWith("custom-") ? setCustomSections : setSections;
    setter((prev) => ({ ...prev, [key]: { ...prev[key], wastePercent: waste } }));
  };
  const addCustomComponent = (def) => {
    const key = `custom-${def.id}`;
    const section = makeCustomSection(def);
    setCustomSections((prev) => ({ ...prev, [key]: section }));
    setExpandedSection(key);
  };
  const removeCustomComponent = (key) => {
    setCustomSections((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };
  const startOver = () => {
    setSections(makeInitialSections());
    setCustomSections({});
    setMasterPitch("25");
    setMasterRatio("5:12");
    setExpandedSection("roof_area");
    setMeasureMode(null);
    setStep(0);
    setShowResults(false);
  };
  const updatePitchDegrees = (val) => {
    setMasterPitch(val);
    const deg = parseFloat(val) || 0;
    setMasterRatio(degreesToRatio(deg, u));
  };
  useEffect3(() => {
    if (!prefill || prefillApplied) return;
    const pitch = prefill.pitchDegrees;
    if (typeof pitch === "number" && pitch > 0 && Number.isFinite(pitch)) {
      setMasterPitch(String(pitch));
      setMasterRatio(degreesToRatio(pitch, u));
    }
    if (prefill.wastePercent) {
      setSections((prev) => {
        const next = { ...prev };
        for (const [k, w] of Object.entries(prefill.wastePercent)) {
          if (next[k]) next[k] = { ...next[k], wastePercent: w };
        }
        return next;
      });
    }
    setSections((prev) => {
      const next = { ...prev };
      const entriesByKind = entriesFromPrefillValues(prefill.values, prefill.measureMode, typeof pitch === "number" ? pitch : parseFloat(masterPitch) || 0, u);
      for (const [k, entries] of Object.entries(entriesByKind)) {
        if (next[k]) next[k] = { ...next[k], entries };
      }
      return next;
    });
    setPrefillApplied(true);
  }, [prefill, prefillApplied]);
  const updatePitchRatio = (val) => {
    setMasterRatio(val);
    const deg = ratioToDegrees(val);
    if (deg > 0) setMasterPitch(deg.toFixed(1));
  };
  const roofAreaPrePitch = useMemo2(() => {
    const section = allSections["roof_area"];
    if (!section || section.entries.length === 0) return null;
    let total = 0;
    for (const entry of section.entries) {
      const qty = entry.quantity ?? 1;
      if (entry.inputMode === "actual") {
        total += (entry.actualValue ?? 0) * qty;
      } else if (entry.isTotalInput) {
        total += (entry.actualValue ?? 0) * qty;
      } else {
        total += (entry.planWidth ?? 0) * (entry.planLengthVal ?? 0) * qty;
      }
    }
    return total > 0 ? total : null;
  }, [allSections]);
  const roofAreaTotal = roofAreaPrePitch;
  const renderSection = (key) => {
    const section = allSections[key];
    if (!section) return null;
    const isCustom = key.startsWith("custom-");
    const label = componentLabel(key, section.customDef);
    const desc = componentDescription(key, section.customDef);
    const isRoofArea = key === "roof_area" || key === "underlay" || key === "fixings";
    const isExpanded = expandedSection === key;
    const total = totals[key] ?? { rawTotal: 0, withWaste: 0, count: 0, totalCost: 0 };
    const hasEntries = section.entries.length > 0;
    const isFixedSection2 = isCustom && section.customDef?.measurementType === "fixed";
    const displayUnit = isFixedSection2 ? "pcs" : isRoofArea || isCustom && section.customDef?.measurementType === "area" ? areaLbl : lenLbl;
    const availableComponents = isCustom ? components : componentsByKind[key] || [];
    return /* @__PURE__ */ jsxs8("div", { className: `rounded-xl border bg-white transition ${isExpanded ? "border-slate-300 shadow-sm" : "border-slate-200"}`, children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between px-2 md:px-4 py-3", children: [
        /* @__PURE__ */ jsxs8("button", { onClick: () => setExpandedSection(isExpanded ? null : key), className: "flex items-center gap-2.5 cursor-pointer transition flex-1 min-w-0", style: { color: isExpanded ? theme.primary : void 0 }, children: [
          /* @__PURE__ */ jsx8(ComponentSymbol2, { kind: key, customDef: section.customDef, className: "w-4 h-4 text-slate-500 flex-shrink-0" }),
          /* @__PURE__ */ jsx8("span", { className: "text-sm font-semibold text-slate-900 truncate", children: label }),
          hasEntries && /* @__PURE__ */ jsxs8("span", { className: "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 flex-shrink-0", children: [
            section.entries.length,
            " ",
            section.entries.length === 1 ? "entry" : "entries"
          ] }),
          !hasEntries && /* @__PURE__ */ jsx8("span", { className: "text-xs text-slate-400 truncate hidden md:inline", children: desc })
        ] }),
        /* @__PURE__ */ jsx8("div", { className: "mr-2 flex-shrink-0", children: /* @__PURE__ */ jsx8(InfoIcon, { text: desc, color: theme.primary }) }),
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
          hasEntries && /* @__PURE__ */ jsxs8("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs8("span", { className: "text-sm font-semibold text-slate-900", children: [
              total.rawTotal.toFixed(2),
              " ",
              displayUnit
            ] }),
            total.totalCost > 0 && /* @__PURE__ */ jsxs8("span", { className: "ml-2 text-xs font-medium", style: { color: theme.primary }, children: [
              cur,
              total.totalCost.toFixed(2)
            ] }),
            section.wastePercent > 0 && /* @__PURE__ */ jsxs8("span", { className: "ml-2 text-xs text-slate-400", children: [
              "+",
              section.wastePercent,
              "%"
            ] })
          ] }),
          isCustom && /* @__PURE__ */ jsx8("button", { onClick: () => removeCustomComponent(key), className: "text-slate-300 hover:text-red-500 transition p-1 cursor-pointer", "aria-label": "Remove custom component", children: /* @__PURE__ */ jsx8("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx8("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) }),
          /* @__PURE__ */ jsx8("button", { onClick: () => setExpandedSection(isExpanded ? null : key), children: /* @__PURE__ */ jsx8("svg", { className: `w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx8("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) }) })
        ] })
      ] }),
      isExpanded && /* @__PURE__ */ jsxs8("div", { className: "border-t border-slate-100 p-2 md:p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx8("label", { htmlFor: `${key}-waste`, className: "text-xs font-medium text-slate-600", children: "Waste" }),
          /* @__PURE__ */ jsx8(InfoIcon, { text: "Waste percentage is added to the raw quantity at the end. The raw total shown does NOT include waste - the final total with waste is shown in the results.", color: theme.primary }),
          /* @__PURE__ */ jsxs8("div", { className: "relative", children: [
            /* @__PURE__ */ jsx8("input", { id: `${key}-waste`, name: `${key}WastePercent`, type: "number", value: section.wastePercent, onChange: (e) => updateWaste(key, parseFloat(e.target.value) || 0), min: 0, max: 100, step: 1, className: "w-16 rounded-lg border border-slate-300 px-2 py-1 text-base md:text-sm text-center focus:outline-none", style: { borderColor: theme.primary } }),
            /* @__PURE__ */ jsx8("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400", children: "%" })
          ] })
        ] }),
        /* @__PURE__ */ jsx8(AddEntryForm2, { theme, kind: key, customDef: section.customDef, measureMode, lenLabel: lenLbl, areaLabel: areaLbl, availableComponents, pitchDegrees: effectivePitch, unitSystem: u, roofAreaTotal: isRoofArea && key !== "roof_area" ? roofAreaTotal : null, onAdd: (entry) => addEntry(key, entry), capabilities }),
        hasEntries && /* @__PURE__ */ jsx8("div", { className: "space-y-1.5", children: section.entries.map((entry, idx) => /* @__PURE__ */ jsx8(EntryListItem, { entry, index: idx, kind: key, customDef: section.customDef, measureMode, lenLabel: lenLbl, areaLabel: areaLbl, wastePercent: section.wastePercent, onRemove: () => removeEntry(key, entry.id) }, entry.id)) }),
        !hasEntries && /* @__PURE__ */ jsxs8("p", { className: "text-xs text-slate-400 text-center py-2", children: [
          "No ",
          label.toLowerCase(),
          " entries yet. Add your first one above."
        ] })
      ] })
    ] }, key);
  };
  const planStep = measureMode === "plan";
  const stepLabels = planStep ? ["Pitch", "Roof Area", "Components", "Generate"] : ["Roof Area", "Components", "Generate"];
  return /* @__PURE__ */ jsxs8(
    "main",
    {
      className: "roof-takeoff-theme min-h-screen bg-white flex flex-col",
      style: { fontFamily: theme.bodyFont, "--roof-heading-font": theme.headingFont },
      children: [
        /* @__PURE__ */ jsx8("header", { className: "border-b border-slate-100 sticky top-0 z-10 bg-white/95 backdrop-blur-sm", children: /* @__PURE__ */ jsxs8("div", { className: "mx-auto max-w-5xl px-2 md:px-6 py-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx8(Link2, { href: theme.homeUrl ?? "/", className: "flex items-center", children: theme.logoUrl ? /* @__PURE__ */ jsx8("img", { src: theme.logoUrl, alt: theme.supplierName ?? void 0, className: "h-8 md:h-10 w-auto" }) : /* @__PURE__ */ jsx8("span", { className: "text-sm font-semibold text-slate-900", children: theme.copy.headerTitle }) }),
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3", children: [
            onSwitchLayout && /* @__PURE__ */ jsx8("button", { onClick: () => onSwitchLayout("guided"), className: "cursor-pointer rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 hover:border-slate-300 transition", children: "Guided mode" }),
            theme.copy.poweredBy && /* @__PURE__ */ jsx8("span", { className: "text-xs text-slate-400", children: theme.copy.poweredBy })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs8("div", { className: "flex-1 mx-auto w-full max-w-5xl px-2 md:px-6 py-6 md:py-10 pb-24 md:pb-10", children: [
          !measureMode && /* @__PURE__ */ jsxs8("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs8("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx8("h2", { className: "text-lg font-semibold text-slate-900", children: "How do you want to enter your measurements?" }),
              /* @__PURE__ */ jsx8("p", { className: "mt-1 text-sm text-slate-500", children: "Choose the method that matches your measurements." })
            ] }),
            /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-6", children: [
              /* @__PURE__ */ jsxs8(
                "button",
                {
                  onClick: () => setMeasureMode("actual"),
                  className: "group w-full rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all cursor-pointer hover:shadow-lg min-h-[180px] flex flex-col",
                  onMouseEnter: (e) => {
                    e.currentTarget.style.borderColor = theme.primary;
                    e.currentTarget.style.boxShadow = `0 4px 20px ${theme.primary}15`;
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  },
                  children: [
                    /* @__PURE__ */ jsx8("div", { className: "flex items-start mb-3", children: /* @__PURE__ */ jsx8("div", { className: "w-12 h-12 rounded-full flex items-center justify-center", style: { backgroundColor: theme.primary }, children: /* @__PURE__ */ jsx8("svg", { className: "w-7 h-7", viewBox: "0 0 24 24", style: { fill: "#ffffff" }, children: /* @__PURE__ */ jsx8("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }) }) }) }),
                    /* @__PURE__ */ jsx8("h3", { className: "text-base font-semibold text-slate-900", children: "I have actual measurements" }),
                    /* @__PURE__ */ jsx8("p", { className: "mt-1 text-sm text-slate-500 flex-1", children: "You already have final roof dimensions. Just type them in - no pitch calculation needed." })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs8(
                "button",
                {
                  onClick: () => setMeasureMode("plan"),
                  className: "group w-full rounded-2xl border-2 border-slate-200 bg-white p-6 text-left transition-all cursor-pointer hover:shadow-lg min-h-[180px] flex flex-col",
                  onMouseEnter: (e) => {
                    e.currentTarget.style.borderColor = theme.primary;
                    e.currentTarget.style.boxShadow = `0 4px 20px ${theme.primary}15`;
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  },
                  children: [
                    /* @__PURE__ */ jsx8("div", { className: "flex items-start mb-3", children: /* @__PURE__ */ jsx8("div", { className: "w-12 h-12 rounded-full flex items-center justify-center", style: { backgroundColor: theme.primary }, children: /* @__PURE__ */ jsx8("svg", { className: "w-7 h-7", viewBox: "0 0 24 24", style: { fill: "#ffffff" }, children: /* @__PURE__ */ jsx8("path", { d: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" }) }) }) }),
                    /* @__PURE__ */ jsx8("h3", { className: "text-base font-semibold text-slate-900", children: "I'm measuring from a plan" }),
                    /* @__PURE__ */ jsx8("p", { className: "mt-1 text-sm text-slate-500 flex-1", children: "You have a top-down roof plan. Enter plan dimensions and the roof pitch - we'll calculate the real sloped lengths and areas." })
                  ]
                }
              )
            ] })
          ] }),
          measureMode && !showResults && /* @__PURE__ */ jsxs8(Fragment6, { children: [
            /* @__PURE__ */ jsxs8("div", { className: "rounded-xl border border-slate-200 bg-slate-50/50 p-3 md:p-4 mb-5 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx8("span", { className: "text-sm font-medium text-slate-700", children: measureMode === "actual" ? "Actual Measurements Mode" : "Plan + Pitch Calculation Mode" }),
              /* @__PURE__ */ jsx8("button", { onClick: () => setMeasureMode(null), className: "text-xs font-medium text-slate-400 hover:text-slate-600 transition rounded-full px-3 py-1 hover:bg-slate-100 cursor-pointer", children: "Change mode" })
            ] }),
            planStep && /* @__PURE__ */ jsxs8(Fragment6, { children: [
              /* @__PURE__ */ jsxs8("div", { className: "mb-3", children: [
                /* @__PURE__ */ jsx8("h2", { className: "text-base md:text-lg font-bold text-slate-900", children: "Step 1: Roof Pitch" }),
                /* @__PURE__ */ jsx8("p", { className: "mt-0.5 text-xs md:text-sm text-slate-400", children: "Add the known roof pitch in degrees or ratio before continuing to Step 2." })
              ] }),
              /* @__PURE__ */ jsxs8("div", { className: "rounded-xl border border-slate-200 bg-slate-50/50 p-3 md:p-5 mb-6", children: [
                /* @__PURE__ */ jsxs8("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: [
                  /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx8("svg", { className: "w-5 h-5 text-slate-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.8, children: /* @__PURE__ */ jsx8("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l9-9 9 9M5 10v10h14V10" }) }),
                    /* @__PURE__ */ jsx8("span", { className: "text-sm font-semibold text-slate-700", children: "Roof Pitch" }),
                    /* @__PURE__ */ jsx8(InfoIcon, { text: "Roof pitch is the angle of the roof slope. E.g. 25 degrees is a common UK roof pitch. We use this to calculate the real sloped lengths from your plan measurements.", color: theme.primary })
                  ] }),
                  /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5", children: [
                    /* @__PURE__ */ jsx8("button", { onClick: () => setPitchMode("degrees"), className: `rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${pitchMode === "degrees" ? "text-white" : "text-slate-500"}`, style: pitchMode === "degrees" ? { backgroundColor: theme.primary } : {}, children: "Degrees" }),
                    /* @__PURE__ */ jsx8("button", { onClick: () => setPitchMode("ratio"), className: `rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${pitchMode === "ratio" ? "text-white" : "text-slate-500"}`, style: pitchMode === "ratio" ? { backgroundColor: theme.primary } : {}, children: "Ratio" })
                  ] }),
                  pitchMode === "degrees" ? /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxs8("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx8("label", { htmlFor: "roof-pitch-degrees", className: "sr-only", children: "Roof pitch in degrees" }),
                      /* @__PURE__ */ jsx8("input", { id: "roof-pitch-degrees", name: "pitchDegrees", type: "number", value: masterPitch, onChange: (e) => updatePitchDegrees(e.target.value), min: 0, max: 89, step: 0.5, inputMode: "decimal", className: "w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-base md:text-sm text-center focus:outline-none", style: { borderColor: theme.primary } }),
                      /* @__PURE__ */ jsx8("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400", children: "deg" })
                    ] }),
                    /* @__PURE__ */ jsxs8("span", { className: "text-xs text-slate-400", children: [
                      "= ",
                      masterRatio
                    ] })
                  ] }) : /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx8("label", { htmlFor: "roof-pitch-ratio", className: "sr-only", children: "Roof pitch ratio" }),
                    /* @__PURE__ */ jsx8("input", { id: "roof-pitch-ratio", name: "pitchRatio", type: "text", value: masterRatio, onChange: (e) => updatePitchRatio(e.target.value), placeholder: "5:12", className: "w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-base md:text-sm text-center focus:outline-none", style: { borderColor: theme.primary } }),
                    /* @__PURE__ */ jsxs8("span", { className: "text-xs text-slate-400", children: [
                      "= ",
                      masterPitch,
                      " deg"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx8("div", { className: "mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3", children: /* @__PURE__ */ jsxs8("p", { className: "text-xs text-slate-500", children: [
                  "Common pitches: 15 deg (low pitch), 25 deg (standard UK), 35 deg (steep), 45 deg (very steep).",
                  u === "metric" ? " Ratio format is rise:10 (e.g. 4.7:10)." : " Ratio format is rise:12 (e.g. 5:12)."
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs8("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsxs8("h2", { className: "text-base md:text-lg font-bold text-slate-900", children: [
                planStep ? "Step 2" : "Step 1",
                ": Roof Area"
              ] }),
              /* @__PURE__ */ jsx8("p", { className: "mt-0.5 text-xs md:text-sm text-slate-400", children: "Enter the width and length, or add the known total area. You can add a different roof covering based on the components available." })
            ] }),
            renderSection("roof_area"),
            /* @__PURE__ */ jsxs8("div", { className: "mt-6 mb-3", children: [
              /* @__PURE__ */ jsxs8("h2", { className: "text-base md:text-lg font-bold text-slate-900", children: [
                planStep ? "Step 3" : "Step 2",
                ": Components"
              ] }),
              /* @__PURE__ */ jsx8("p", { className: "mt-0.5 text-xs md:text-sm text-slate-400", children: "Add quantities for ridges, hips, valleys, barges, spouting, underlay and any other components you need." })
            ] }),
            /* @__PURE__ */ jsxs8("div", { className: "space-y-3", children: [
              BUILT_IN_ORDER.filter((k) => k !== "roof_area").map((k) => renderSection(k)),
              Object.keys(customSections).map((k) => renderSection(k)),
              /* @__PURE__ */ jsx8(CustomComponentCreator, { theme, onCreate: addCustomComponent })
            ] }),
            /* @__PURE__ */ jsxs8("div", { className: "mt-6 mb-3", children: [
              /* @__PURE__ */ jsxs8("h2", { className: "text-base md:text-lg font-bold text-slate-900", children: [
                planStep ? "Step 4" : "Step 3",
                ": Generate"
              ] }),
              /* @__PURE__ */ jsx8("p", { className: "mt-0.5 text-xs md:text-sm text-slate-400", children: "Review your summary and generate your takeoff report." })
            ] }),
            hasData ? /* @__PURE__ */ jsxs8("div", { className: "rounded-xl bg-slate-900 text-white p-4 md:p-5", children: [
              /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsx8("h3", { className: "text-sm font-semibold", children: "Summary" }),
                /* @__PURE__ */ jsxs8("span", { className: "text-xs text-slate-400", children: [
                  calculation.totalEntries,
                  " ",
                  calculation.totalEntries === 1 ? "entry" : "entries",
                  " total"
                ] })
              ] }),
              /* @__PURE__ */ jsx8("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: allKeys.map((key) => {
                const t = totals[key];
                if (!t || t.count === 0) return null;
                const section = allSections[key];
                const isArea = key === "roof_area" || key === "underlay" || key === "fixings" || key.startsWith("custom-") && section.customDef?.measurementType === "area";
                const du = isArea ? areaLbl : lenLbl;
                return /* @__PURE__ */ jsxs8("div", { className: "rounded-lg bg-white/5 border border-white/10 px-3 py-2", children: [
                  /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsx8(ComponentSymbol2, { kind: key, customDef: section.customDef, className: "w-3 h-3 text-slate-400" }),
                    /* @__PURE__ */ jsx8("span", { className: "text-xs text-slate-300 truncate", children: componentLabel(key, section.customDef) })
                  ] }),
                  /* @__PURE__ */ jsxs8("div", { className: "mt-1 text-sm font-semibold", children: [
                    t.rawTotal.toFixed(2),
                    " ",
                    du
                  ] }),
                  section.wastePercent > 0 && /* @__PURE__ */ jsxs8("div", { className: "text-xs text-slate-400", children: [
                    "w/ waste: ",
                    t.withWaste.toFixed(2),
                    " ",
                    du
                  ] }),
                  t.totalCost > 0 && /* @__PURE__ */ jsxs8("div", { className: "text-xs font-medium mt-0.5", style: { color: theme.primary }, children: [
                    cur,
                    t.totalCost.toFixed(2)
                  ] })
                ] }, key);
              }) }),
              grandTotal > 0 && /* @__PURE__ */ jsxs8("div", { className: "mt-4 pt-4 border-t border-white/10 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx8("span", { className: "text-sm font-semibold", children: "Estimated Total" }),
                /* @__PURE__ */ jsxs8("span", { className: "text-xl font-bold", children: [
                  cur,
                  grandTotal.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxs8(
                "button",
                {
                  onClick: () => setShowResults(true),
                  className: "mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold text-white transition-all min-h-[44px]",
                  style: { backgroundColor: theme.primary },
                  children: [
                    "Generate Takeoff Report",
                    /* @__PURE__ */ jsx8("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx8("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) })
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxs8("div", { className: "mt-6 rounded-xl border-dashed border border-slate-200 px-6 py-12 text-center", children: [
              /* @__PURE__ */ jsx8("svg", { className: "mx-auto w-10 h-10 text-slate-300", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: /* @__PURE__ */ jsx8("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12l9-9 9 9M5 10v10h14V10" }) }),
              /* @__PURE__ */ jsx8("p", { className: "mt-3 text-sm text-slate-500", children: "Start by adding your roof area measurements above." }),
              /* @__PURE__ */ jsx8("p", { className: "mt-1 text-xs text-slate-400", children: "Then add ridge, hip, valley, barge, spouting, or custom components below." })
            ] })
          ] }),
          showResults && /* @__PURE__ */ jsx8(
            ResultsModal,
            {
              sections: allSections,
              totals,
              getComponentById,
              grandTotal,
              unitSystem: u,
              allKeys,
              currencySymbol: cur,
              theme,
              supplierSlug: theme.supplierSlug,
              onClose: () => setShowResults(false),
              onEdit: () => setShowResults(false)
            }
          )
        ] }),
        /* @__PURE__ */ jsx8("footer", { className: "border-t border-slate-100 py-4", children: /* @__PURE__ */ jsxs8("div", { className: "mx-auto max-w-5xl px-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx8("span", { className: "text-xs text-slate-400", children: theme.copy.footerText }),
          measureMode && !showResults && /* @__PURE__ */ jsx8("button", { onClick: startOver, className: "text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer", children: "Start over" })
        ] }) }),
        /* @__PURE__ */ jsx8("style", { jsx: true, global: true, children: `
        .roof-takeoff-theme h1,
        .roof-takeoff-theme h2,
        .roof-takeoff-theme h3 { font-family: var(--roof-heading-font); }
      ` })
      ]
    }
  );
}

// ../flow/src/TakeoffFlow.tsx
import { Fragment as Fragment7, jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
function TakeoffFlow({
  theme,
  components: staticComponents,
  capabilities = DEFAULT_CAPABILITIES,
  supplierAdapter,
  enquiryAdapter,
  resultAdapter,
  initialSupplierSlug,
  prefill = null,
  hideHeader = false
}) {
  const hasSupplierStep = capabilities.supplierSelection === true && !!supplierAdapter;
  const pricing = resolvePricingModes(theme.pricingModes);
  const roofTypeOptions = theme.roofTypeOptions ?? [];
  const defaultRoofType = roofTypeOptions.length === 1 ? roofTypeOptions[0] : null;
  const prefillMode = prefill?.measureMode ?? null;
  const prefillPricing = prefill?.pricingMode ?? pricing.defaultMode ?? null;
  const prefillRoofType = prefill?.roofType ?? defaultRoofType;
  const [step, setStep] = useState8(hasSupplierStep && !initialSupplierSlug ? "supplier" : prefillMode ? "builder" : "measure");
  const [measureMode, setMeasureMode] = useState8(prefillMode);
  const [pricingMode, setPricingMode] = useState8(prefillPricing);
  const [roofType, setRoofType] = useState8(prefillRoofType);
  const [layout, setLayout] = useState8(prefill?.layout ?? "fast");
  const [supplierCtx, setSupplierCtx] = useState8(null);
  const [supplierList, setSupplierList] = useState8([]);
  const [supplierSearchQuery, setSupplierSearchQuery] = useState8("");
  const [supplierLoading, setSupplierLoading] = useState8(false);
  const [supplierError, setSupplierError] = useState8(null);
  const [catalogueLoading, setCatalogueLoading] = useState8(false);
  const [catalogueError, setCatalogueError] = useState8(null);
  const [activeComponents, setActiveComponents] = useState8(staticComponents);
  const [activeTheme, setActiveTheme] = useState8(theme);
  useEffect4(() => {
    window.scrollTo(0, 0);
  }, [step]);
  if (initialSupplierSlug && !supplierCtx && !catalogueLoading && hasSupplierStep) {
    setCatalogueLoading(true);
    setSupplierError(null);
    supplierAdapter.loadCatalogue(initialSupplierSlug).then((cat) => {
      setSupplierCtx({
        slug: cat.slug,
        name: cat.supplierName,
        currency: cat.currency,
        currencySymbol: cat.currencySymbol,
        unitSystem: cat.unitSystem,
        catalogueVersion: cat.catalogueVersion ?? null
      });
      setActiveComponents(cat.components);
      setActiveTheme({
        ...theme,
        currency: cat.currency,
        currencySymbol: cat.currencySymbol,
        defaultUnits: cat.unitSystem,
        pricingModes: cat.pricingModes ?? theme.pricingModes,
        roofTypeOptions: cat.roofTypeOptions ?? theme.roofTypeOptions,
        supplierName: cat.supplierName,
        supplierEmail: cat.supplierEmail ?? null,
        supplierSlug: cat.slug
      });
      setCatalogueLoading(false);
    }).catch((err) => {
      setCatalogueError(err instanceof Error ? err.message : "Failed to load supplier catalogue");
      setCatalogueLoading(false);
    });
  }
  useEffect4(() => {
    if (step === "supplier" && supplierAdapter && supplierList.length === 0 && !supplierLoading && !supplierError) {
      setSupplierLoading(true);
      supplierAdapter.listSuppliers({}).then((results) => {
        setSupplierList(results);
        setSupplierLoading(false);
      }).catch((err) => {
        setSupplierError(err instanceof Error ? err.message : "Failed to load suppliers");
        setSupplierLoading(false);
      });
    }
  }, [step, supplierAdapter, supplierList.length, supplierLoading, supplierError]);
  const hasPricingStep = pricing.hasChoice || roofTypeOptions.length > 1;
  const availableComponents = filterComponentsForRoofType(activeComponents, roofType);
  const handleMeasureChoice = (mode) => {
    setMeasureMode(mode);
    if (hasPricingStep) {
      setStep("pricing");
    } else {
      setStep("layout");
    }
  };
  const handlePricingChoice = (mode) => {
    setPricingMode(mode);
  };
  const handlePricingContinue = () => {
    setStep("layout");
  };
  const handleLayoutChoice = (choice) => {
    setLayout(choice);
    setStep("builder");
  };
  const handleSwitchLayout = (choice) => {
    setLayout(choice);
  };
  const handleSupplierSearch = async () => {
    if (!supplierAdapter) return;
    setSupplierLoading(true);
    setSupplierError(null);
    try {
      const results = await supplierAdapter.listSuppliers({ query: supplierSearchQuery });
      setSupplierList(results);
    } catch (err) {
      setSupplierError(err instanceof Error ? err.message : "Failed to search suppliers");
    } finally {
      setSupplierLoading(false);
    }
  };
  const handleSupplierSelect = async (slug) => {
    if (!supplierAdapter) return;
    setCatalogueLoading(true);
    setCatalogueError(null);
    try {
      const cat = await supplierAdapter.loadCatalogue(slug);
      setSupplierCtx({
        slug: cat.slug,
        name: cat.supplierName,
        currency: cat.currency,
        currencySymbol: cat.currencySymbol,
        unitSystem: cat.unitSystem,
        catalogueVersion: cat.catalogueVersion ?? null
      });
      setActiveComponents(cat.components);
      setActiveTheme({
        ...theme,
        currency: cat.currency,
        currencySymbol: cat.currencySymbol,
        defaultUnits: cat.unitSystem,
        pricingModes: cat.pricingModes ?? theme.pricingModes,
        roofTypeOptions: cat.roofTypeOptions ?? theme.roofTypeOptions,
        supplierName: cat.supplierName,
        supplierEmail: cat.supplierEmail ?? null,
        supplierSlug: cat.slug
      });
      setStep(prefillMode ? "builder" : "measure");
    } catch (err) {
      setCatalogueError(err instanceof Error ? err.message : "Failed to load supplier catalogue");
    } finally {
      setCatalogueLoading(false);
    }
  };
  const handleSupplierSkip = () => {
    setStep(prefillMode ? "builder" : "measure");
  };
  if (step === "builder" && layout && measureMode) {
    const flowTheme = prefill?.unitSystem && !supplierCtx ? { ...activeTheme, defaultUnits: prefill.unitSystem } : activeTheme;
    if (layout === "guided") {
      return /* @__PURE__ */ jsx9(
        FormsLayout,
        {
          theme: flowTheme,
          components: availableComponents,
          initialMeasureMode: measureMode,
          pricingMode,
          onSwitchLayout: handleSwitchLayout,
          capabilities,
          prefill
        }
      );
    }
    return /* @__PURE__ */ jsx9(
      ClassicLayout,
      {
        theme: flowTheme,
        components: availableComponents,
        initialMeasureMode: measureMode,
        pricingMode,
        onSwitchLayout: handleSwitchLayout,
        capabilities,
        prefill
      }
    );
  }
  return /* @__PURE__ */ jsxs9(
    "main",
    {
      className: "roof-takeoff-theme min-h-screen bg-white flex flex-col",
      style: { fontFamily: activeTheme.bodyFont, "--roof-heading-font": activeTheme.headingFont },
      children: [
        !hideHeader && /* @__PURE__ */ jsxs9("header", { className: "border-b border-slate-100 sticky top-0 z-10 bg-white/95 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsxs9("div", { className: "mx-auto max-w-2xl px-4 py-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx9(Link3, { href: activeTheme.homeUrl ?? "/", className: "flex items-center", children: activeTheme.logoUrl ? /* @__PURE__ */ jsx9("img", { src: activeTheme.logoUrl, alt: activeTheme.supplierName ?? activeTheme.copy.headerTitle, className: "h-8 md:h-10 w-auto" }) : /* @__PURE__ */ jsx9("span", { className: "text-sm font-semibold text-slate-900", children: activeTheme.copy.headerTitle }) }),
            activeTheme.copy.poweredBy && /* @__PURE__ */ jsx9("span", { className: "text-xs text-slate-400", children: activeTheme.copy.poweredBy })
          ] }),
          step !== "supplier" && step !== "measure" && /* @__PURE__ */ jsx9("div", { className: "h-1 bg-slate-100", children: /* @__PURE__ */ jsx9(
            "div",
            {
              className: "h-full transition-all duration-300 ease-out",
              style: {
                width: `${step === "pricing" ? 33 : step === "layout" ? hasPricingStep ? 66 : 50 : 100}%`,
                backgroundColor: activeTheme.primary
              }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "flex-1 mx-auto w-full max-w-2xl px-4 py-8 md:py-12", children: [
          step === "supplier" && hasSupplierStep && /* @__PURE__ */ jsxs9(Fragment7, { children: [
            /* @__PURE__ */ jsxs9("div", { className: "mb-8 md:mb-10 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4", children: [
              /* @__PURE__ */ jsxs9("div", { className: "rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsx9("div", { className: "w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx9("svg", { className: "w-4.5 h-4.5 text-[#FF6B35]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
                /* @__PURE__ */ jsx9("h3", { className: "text-sm font-semibold text-slate-900", children: "No signup required" }),
                /* @__PURE__ */ jsx9("p", { className: "mt-1 text-xs text-slate-500", children: "Use the full tool without creating an account." })
              ] }),
              /* @__PURE__ */ jsxs9("div", { className: "rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsx9("div", { className: "w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxs9("svg", { className: "w-4.5 h-4.5 text-[#FF6B35]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: [
                  /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
                  /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
                ] }) }),
                /* @__PURE__ */ jsx9("h3", { className: "text-sm font-semibold text-slate-900", children: "Find a supplier" }),
                /* @__PURE__ */ jsx9("p", { className: "mt-1 text-xs text-slate-500", children: "Browse suppliers near you with real component pricing." })
              ] }),
              /* @__PURE__ */ jsxs9("div", { className: "rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsx9("div", { className: "w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx9("svg", { className: "w-4.5 h-4.5 text-[#FF6B35]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }) }),
                /* @__PURE__ */ jsx9("h3", { className: "text-sm font-semibold text-slate-900", children: "Get pricing" }),
                /* @__PURE__ */ jsx9("p", { className: "mt-1 text-xs text-slate-500", children: "Enter measurements and get a preliminary material takeoff." })
              ] }),
              /* @__PURE__ */ jsxs9("div", { className: "rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsx9("div", { className: "w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx9("svg", { className: "w-4.5 h-4.5 text-[#FF6B35]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }),
                /* @__PURE__ */ jsx9("h3", { className: "text-sm font-semibold text-slate-900", children: "Download or send" }),
                /* @__PURE__ */ jsx9("p", { className: "mt-1 text-xs text-slate-500", children: "Export your takeoff or send it to a supplier for a quote." })
              ] })
            ] }),
            /* @__PURE__ */ jsx9(
              SupplierStep,
              {
                theme: activeTheme,
                searchQuery: supplierSearchQuery,
                onSearchQueryChange: setSupplierSearchQuery,
                onSearch: handleSupplierSearch,
                onSkip: handleSupplierSkip,
                suppliers: supplierList,
                onSelect: handleSupplierSelect,
                loading: supplierLoading,
                catalogueLoading,
                error: supplierError || catalogueError,
                preselectedSlug: initialSupplierSlug
              }
            )
          ] }),
          step === "supplier" && catalogueLoading && initialSupplierSlug && /* @__PURE__ */ jsxs9("div", { className: "text-center py-12", children: [
            /* @__PURE__ */ jsx9("div", { className: "inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" }),
            /* @__PURE__ */ jsx9("p", { className: "mt-4 text-sm text-slate-500", children: "Loading supplier catalogue..." })
          ] }),
          step === "measure" && /* @__PURE__ */ jsx9(
            ChoiceScreen,
            {
              title: "How do you want to enter your measurements?",
              subtitle: "Choose the method that matches your measurements.",
              theme: activeTheme,
              options: [
                {
                  title: "I have actual measurements",
                  description: "You already have final roof dimensions. Just type them in - no pitch calculation needed.",
                  icon: "actual",
                  onClick: () => handleMeasureChoice("actual")
                },
                {
                  title: "I'm measuring from a plan",
                  description: "You have a top-down roof plan. Enter plan dimensions and the roof pitch - we will calculate the real sloped lengths and areas.",
                  icon: "plan",
                  onClick: () => handleMeasureChoice("plan")
                }
              ]
            }
          ),
          step === "pricing" && hasPricingStep && /* @__PURE__ */ jsx9(
            PricingScreen,
            {
              theme: activeTheme,
              pricingModes: pricing.modes,
              pricingMode,
              roofTypeOptions,
              roofType,
              onSelectPricing: handlePricingChoice,
              onSelectRoofType: setRoofType,
              onContinue: handlePricingContinue,
              onBack: () => {
                setStep("measure");
                setMeasureMode(null);
              }
            }
          ),
          step === "layout" && /* @__PURE__ */ jsx9(
            ChoiceScreen,
            {
              title: "How would you like to build your takeoff?",
              subtitle: "Choose the experience that suits you. You can switch at any time.",
              theme: activeTheme,
              stepLabel: hasPricingStep ? "Step 3" : "Step 2",
              onBack: () => {
                if (hasPricingStep) {
                  setStep("pricing");
                } else {
                  setStep("measure");
                  setMeasureMode(null);
                }
              },
              options: [
                {
                  title: "Guided",
                  description: "Step-by-step wizard with one section per page. Great for first-time users or when you want extra guidance.",
                  icon: "guided",
                  badge: "Recommended",
                  onClick: () => handleLayoutChoice("guided")
                },
                {
                  title: "Fast",
                  description: "All sections on one page with expandable accordions. Best for experienced users who want to move quickly.",
                  icon: "fast",
                  onClick: () => handleLayoutChoice("fast")
                }
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx9("footer", { className: "border-t border-slate-100 py-4", children: /* @__PURE__ */ jsxs9("div", { className: "mx-auto max-w-2xl px-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx9("span", { className: "text-xs text-slate-400", children: activeTheme.copy.footerText }),
          supplierCtx && /* @__PURE__ */ jsxs9("span", { className: "text-xs text-slate-400", children: [
            "Using ",
            supplierCtx.name
          ] })
        ] }) }),
        /* @__PURE__ */ jsx9("style", { jsx: true, global: true, children: `
        .roof-takeoff-theme h1,
        .roof-takeoff-theme h2,
        .roof-takeoff-theme h3 { font-family: var(--roof-heading-font); }
      ` })
      ]
    }
  );
}
function SupplierStep({
  theme,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onSkip,
  suppliers,
  onSelect,
  loading,
  catalogueLoading,
  error,
  preselectedSlug
}) {
  return /* @__PURE__ */ jsxs9("div", { className: "animate-[fadeIn_0.3s_ease-out]", children: [
    /* @__PURE__ */ jsx9("h1", { className: "text-xl md:text-2xl font-semibold text-slate-900", children: "Step 1: Choose a supplier" }),
    /* @__PURE__ */ jsx9("p", { className: "mt-2 text-sm text-slate-500", children: "Pick a supplier to use their real component pricing, or use QuoteCore+ default to continue with test pricing." }),
    /* @__PURE__ */ jsx9(
      "button",
      {
        onClick: onSkip,
        className: "mt-5 w-full text-left rounded-xl border-2 border-[#FF6B35] bg-orange-50/40 p-4 transition-all cursor-pointer hover:border-[#FF6B35] hover:shadow-[0_0_16px_rgba(255,107,53,0.2)] hover:bg-orange-50/60 group",
        children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs9("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx9("h3", { className: "text-base font-bold text-slate-900 group-hover:text-[#BD4A1A] transition", children: "QuoteCore+" }),
              /* @__PURE__ */ jsx9("span", { className: "rounded-full bg-[#FF6B35] px-2.5 py-1 text-xs font-medium text-white", children: "Default" })
            ] }),
            /* @__PURE__ */ jsx9("p", { className: "mt-1 text-sm text-slate-600", children: "Use the tool with default test pricing - no supplier needed. Pick a real supplier below for accurate pricing." }),
            /* @__PURE__ */ jsxs9("div", { className: "mt-1.5 flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx9("span", { className: "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500", children: "All countries" }),
              /* @__PURE__ */ jsx9("span", { className: "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500", children: "USD" })
            ] })
          ] }),
          /* @__PURE__ */ jsx9("svg", { className: "w-5 h-5 text-[#FF6B35] group-hover:text-[#BD4A1A] transition flex-shrink-0 ml-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs9("div", { className: "mt-6 flex gap-2", children: [
      /* @__PURE__ */ jsx9(
        "input",
        {
          type: "text",
          value: searchQuery,
          onChange: (e) => onSearchQueryChange(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") onSearch();
          },
          placeholder: "Search suppliers by name or region...",
          className: "flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
        }
      ),
      /* @__PURE__ */ jsx9(
        "button",
        {
          onClick: onSearch,
          disabled: loading,
          className: "cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition min-h-[44px] disabled:opacity-50",
          style: { backgroundColor: theme.primary },
          children: loading ? "Searching..." : "Search"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxs9("div", { className: "mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3", children: [
      /* @__PURE__ */ jsx9("p", { className: "text-sm text-red-700", children: error }),
      /* @__PURE__ */ jsx9("button", { onClick: () => onSelect(preselectedSlug || ""), className: "mt-2 text-xs font-medium text-red-700 hover:underline", children: "Retry" })
    ] }),
    suppliers.length > 0 && /* @__PURE__ */ jsx9("div", { className: "mt-6 space-y-3", children: suppliers.map((s) => /* @__PURE__ */ jsx9(
      "button",
      {
        onClick: () => onSelect(s.slug),
        disabled: catalogueLoading,
        className: "w-full text-left rounded-2xl border-2 border-slate-200 bg-white p-5 transition-all cursor-pointer hover:shadow-lg hover:border-slate-300 disabled:opacity-50",
        children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-4", children: [
          s.logoUrl && /* @__PURE__ */ jsx9("img", { src: s.logoUrl, alt: s.name, className: "h-10 w-10 rounded object-contain flex-shrink-0" }),
          /* @__PURE__ */ jsxs9("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx9("h3", { className: "text-base font-semibold text-slate-900", children: s.name }),
            /* @__PURE__ */ jsxs9("p", { className: "text-sm text-slate-500", children: [
              [s.branchCity, s.branchRegion].filter(Boolean).join(", "),
              s.currency ? ` \xB7 ${s.currency}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx9("svg", { className: "w-5 h-5 text-slate-300 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) })
        ] })
      },
      s.slug
    )) }),
    !loading && suppliers.length === 0 && !error && /* @__PURE__ */ jsx9("div", { className: "mt-6 rounded-xl border-dashed border-slate-200 border-2 px-6 py-12 text-center", children: /* @__PURE__ */ jsx9("p", { className: "text-sm text-slate-500", children: "No suppliers found. Try searching, or skip to use default pricing." }) }),
    catalogueLoading && /* @__PURE__ */ jsxs9("div", { className: "mt-6 text-center", children: [
      /* @__PURE__ */ jsx9("div", { className: "inline-block h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" }),
      /* @__PURE__ */ jsx9("p", { className: "mt-2 text-sm text-slate-500", children: "Loading catalogue..." })
    ] }),
    /* @__PURE__ */ jsx9("p", { className: "mt-6 text-center text-xs text-slate-400", children: "You can adjust any price after selecting a supplier. No commitment." })
  ] });
}
function PricingScreen({
  theme,
  pricingModes,
  pricingMode,
  roofTypeOptions,
  roofType,
  onSelectPricing,
  onSelectRoofType,
  onContinue,
  onBack
}) {
  const canContinue = pricingMode !== null && (roofTypeOptions.length < 2 || roofType !== null);
  return /* @__PURE__ */ jsxs9("div", { className: "animate-[fadeIn_0.3s_ease-out]", children: [
    /* @__PURE__ */ jsx9("span", { className: "text-xs font-medium text-slate-400 mb-2 block", children: "Step 2" }),
    /* @__PURE__ */ jsx9("h1", { className: "text-xl md:text-2xl font-semibold text-slate-900", children: pricingModes.length > 1 ? "What pricing do you need?" : "What type of roofing job is this?" }),
    /* @__PURE__ */ jsx9("p", { className: "mt-2 text-sm text-slate-500", children: pricingModes.length > 1 ? "Choose your pricing and job type so we use the correct catalogue." : "Choose the job type so we use the correct component and pricing catalogue." }),
    pricingModes.length > 1 && /* @__PURE__ */ jsxs9("div", { className: "mt-6 md:mt-8 space-y-3", children: [
      pricingModes.includes("material") && /* @__PURE__ */ jsx9(
        PricingCard,
        {
          theme,
          title: "Material only",
          description: "See material costs only. No labour or installation costs shown.",
          icon: "material",
          selected: pricingMode === "material",
          onClick: () => onSelectPricing("material")
        }
      ),
      pricingModes.includes("material_install") && /* @__PURE__ */ jsx9(
        PricingCard,
        {
          theme,
          title: "Material and install",
          description: "See full pricing including materials, labour and installation costs.",
          icon: "install",
          selected: pricingMode === "material_install",
          onClick: () => onSelectPricing("material_install")
        }
      )
    ] }),
    roofTypeOptions.length > 1 && /* @__PURE__ */ jsxs9("div", { className: "mt-6 rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-5 md:p-6", children: [
      /* @__PURE__ */ jsx9("h3", { className: "text-sm font-semibold text-slate-900", children: "What type of job is this?" }),
      /* @__PURE__ */ jsx9("p", { className: "mt-1 text-xs text-slate-500", children: "Your selection controls which products and prices are available." }),
      /* @__PURE__ */ jsx9("div", { className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2", children: roofTypeOptions.map((option) => /* @__PURE__ */ jsx9(
        RoofTypeOption,
        {
          theme,
          label: option === "new_roof" ? "New roof" : "Re-roof",
          description: option === "new_roof" ? "Brand new roof installation" : "Replacing an existing roof",
          selected: roofType === option,
          onClick: () => onSelectRoofType(option)
        },
        option
      )) })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "mt-8 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs9(
        "button",
        {
          onClick: onBack,
          className: "cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition min-h-[44px]",
          children: [
            /* @__PURE__ */ jsx9("svg", { className: "w-4 h-4 inline mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19l-7-7 7-7" }) }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxs9(
        "button",
        {
          onClick: onContinue,
          disabled: !canContinue,
          className: "cursor-pointer rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition min-h-[44px]",
          style: canContinue ? { backgroundColor: theme.primary } : { backgroundColor: "#e2e8f0", color: "#94a3b8", cursor: "not-allowed" },
          children: [
            "Continue",
            /* @__PURE__ */ jsx9("svg", { className: "w-4 h-4 inline ml-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) })
          ]
        }
      )
    ] })
  ] });
}
function PricingCard({
  theme,
  title,
  description,
  icon,
  selected,
  onClick
}) {
  return /* @__PURE__ */ jsx9(
    "button",
    {
      onClick,
      className: "w-full text-left rounded-2xl border-2 bg-white p-5 md:p-6 transition-all cursor-pointer hover:shadow-lg group",
      style: {
        borderColor: selected ? theme.primary : void 0,
        boxShadow: selected ? `0 4px 20px ${theme.primary}15` : void 0
      },
      onMouseEnter: (e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = theme.primary;
          e.currentTarget.style.boxShadow = `0 4px 20px ${theme.primary}15`;
        }
      },
      onMouseLeave: (e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "";
          e.currentTarget.style.boxShadow = "";
        }
      },
      children: /* @__PURE__ */ jsxs9("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx9(
          "div",
          {
            className: "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white",
            style: { backgroundColor: theme.primary },
            children: /* @__PURE__ */ jsx9(ChoiceIcon, { icon })
          }
        ),
        /* @__PURE__ */ jsxs9("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx9("h3", { className: "text-base md:text-lg font-semibold text-slate-900", children: title }),
            selected && /* @__PURE__ */ jsx9(
              "span",
              {
                className: "rounded-full p-1 flex items-center justify-center",
                style: { backgroundColor: theme.primary },
                children: /* @__PURE__ */ jsx9("svg", { className: "w-3 h-3 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 3, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) })
              }
            )
          ] }),
          /* @__PURE__ */ jsx9("p", { className: "mt-1 text-sm text-slate-500", children: description })
        ] })
      ] })
    }
  );
}
function RoofTypeOption({
  theme,
  label,
  description,
  selected,
  onClick
}) {
  return /* @__PURE__ */ jsx9(
    "button",
    {
      type: "button",
      onClick,
      className: "cursor-pointer rounded-xl border-2 bg-white p-4 text-left transition-all hover:shadow-md",
      style: { borderColor: selected ? theme.primary : void 0 },
      children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx9(
          "span",
          {
            className: "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition",
            style: {
              borderColor: selected ? theme.primary : "#cbd5e1",
              backgroundColor: selected ? theme.primary : "transparent"
            },
            children: selected && /* @__PURE__ */ jsx9("span", { className: "h-2 w-2 rounded-full bg-white" })
          }
        ),
        /* @__PURE__ */ jsxs9("span", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx9("span", { className: "block text-sm font-semibold text-slate-900", children: label }),
          /* @__PURE__ */ jsx9("span", { className: "mt-0.5 block text-xs text-slate-500", children: description })
        ] })
      ] })
    }
  );
}
function ChoiceScreen({
  title,
  subtitle,
  theme,
  options,
  stepLabel,
  onBack
}) {
  return /* @__PURE__ */ jsxs9("div", { className: "animate-[fadeIn_0.3s_ease-out]", children: [
    stepLabel && /* @__PURE__ */ jsx9("span", { className: "text-xs font-medium text-slate-400 mb-2 block", children: stepLabel }),
    /* @__PURE__ */ jsx9("h1", { className: "text-xl md:text-2xl font-semibold text-slate-900", children: title }),
    subtitle && /* @__PURE__ */ jsx9("p", { className: "mt-2 text-sm text-slate-500", children: subtitle }),
    /* @__PURE__ */ jsx9("div", { className: "mt-6 md:mt-8 space-y-3", children: options.map((opt, idx) => /* @__PURE__ */ jsx9(ChoiceCard, { theme, ...opt }, idx)) }),
    onBack && /* @__PURE__ */ jsxs9(
      "button",
      {
        onClick: onBack,
        className: "mt-6 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition min-h-[44px]",
        children: [
          /* @__PURE__ */ jsx9("svg", { className: "w-4 h-4 inline mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19l-7-7 7-7" }) }),
          "Back"
        ]
      }
    )
  ] });
}
function ChoiceCard({
  theme,
  title,
  description,
  icon,
  badge,
  onClick
}) {
  return /* @__PURE__ */ jsx9(
    "button",
    {
      onClick,
      className: "w-full text-left rounded-2xl border-2 border-slate-200 bg-white p-5 md:p-6 transition-all cursor-pointer hover:shadow-lg group",
      onMouseEnter: (e) => {
        e.currentTarget.style.borderColor = theme.primary;
        e.currentTarget.style.boxShadow = `0 4px 20px ${theme.primary}15`;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow = "";
      },
      children: /* @__PURE__ */ jsxs9("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx9(
          "div",
          {
            className: "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white",
            style: { backgroundColor: theme.primary },
            children: /* @__PURE__ */ jsx9(ChoiceIcon, { icon })
          }
        ),
        /* @__PURE__ */ jsxs9("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx9("h3", { className: "text-base md:text-lg font-semibold text-slate-900", children: title }),
            badge && /* @__PURE__ */ jsx9(
              "span",
              {
                className: "rounded-full px-2.5 py-0.5 text-xs font-medium text-white",
                style: { backgroundColor: theme.primary },
                children: badge
              }
            )
          ] }),
          /* @__PURE__ */ jsx9("p", { className: "mt-1 text-sm text-slate-500", children: description })
        ] }),
        /* @__PURE__ */ jsx9(
          "svg",
          {
            className: "w-5 h-5 text-slate-300 group-hover:text-slate-400 transition flex-shrink-0 mt-1",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            strokeWidth: 2,
            children: /* @__PURE__ */ jsx9("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" })
          }
        )
      ] })
    }
  );
}
export {
  BUILT_IN_ORDER,
  COMPONENT_DEFS,
  ChoiceIcon,
  ClassicLayout,
  ComponentGuideBox,
  DEFAULT_CAPABILITIES,
  FormsLayout,
  ResultsModal,
  SupplierEnquiryModal,
  TakeoffFlow,
  areaUnitLabel,
  areaValueForUnit,
  calculateTakeoffSections,
  componentDescription,
  componentLabel,
  computeEntry,
  computeKnownPriceCost,
  computeLabourCost,
  computeMaterialCost,
  degreesToRatio,
  entriesFromPrefillValues,
  filterComponentsForRoofType,
  hipValleyPitchFactor,
  isCustomFixed,
  loadComponentsFromConfig,
  makeCustomId,
  makeCustomSection,
  makeEntry,
  makeId,
  makeInitialSections,
  pitchFactor,
  rafterPitchFactor,
  ratioToDegrees,
  registerCustomKind,
  resolvePricingModes,
  unitLabel
};
//# sourceMappingURL=index.js.map
