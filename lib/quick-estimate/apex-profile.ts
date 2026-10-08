import type { PricingProfile } from './pricing';
import type { EstimateRules } from '../pricing/rules';

/** Fictional Apex UK demo rates, ex VAT. These are not supplier quotes. */
export function apexPricingProfile(_removal: { perM2: number; disposalPerJob: number }, _pitchRules: NonNullable<EstimateRules['materialPitchRules']>): PricingProfile {
  const edges = (prefix: string) => ({ ridges: `demo-${prefix}-ridges`, hips: `demo-${prefix}-hips`, valleys: `demo-${prefix}-valleys`, barges: `demo-${prefix}-barges` });
  return {
    version: 'apex-uk-demo-2.0', currency: 'GBP', mode: 'components',
    systems: {
      tile: { label: 'Concrete tile', eavesRate: { material: 5, labour: 5 }, minPitch: 15, maxPitch: 50, areaProducts: ['marley-edgemere', 'tyvek-supro', 'tile-nails-clips', 'demo-battens'], components: edges('tile'), exclusions: ['Tile gauge and fixing design to be verified for the chosen product'] },
      slate: { label: 'Natural slate', eavesRate: { material: 5, labour: 5 }, minPitch: 20, maxPitch: 50, areaProducts: ['cupa-r18', 'tyvek-supro', 'copper-slate-nails', 'demo-battens'], components: edges('slate'), exclusions: ['Slate headlap and batten gauge require manufacturer confirmation'] },
      shingle: { label: 'Asphalt shingles', eavesRate: { material: 7, labour: 7 }, minPitch: 15, maxPitch: 50, areaProducts: ['demo-shingle', 'demo-shingle-deck', 'demo-shingle-fix'], components: edges('shingle'), exclusions: ['Deck replacement is assumed, subject to survey', 'Shingle underlayment specification requires confirmation'] },
      pressed_metal: { label: 'Pressed metal tile', eavesRate: { material: 10, labour: 7 }, minPitch: 12, maxPitch: 50, areaProducts: ['demo-pressed', 'tyvek-supro', 'demo-metal-support', 'demo-metal-fix'], components: edges('pressed'), exclusions: ['Support layout and fixing specification require manufacturer confirmation'] },
      longrun: { label: 'Long-run profiled metal', eavesRate: { material: 9, labour: 7 }, minPitch: 5, maxPitch: 50, areaProducts: ['demo-longrun', 'tyvek-supro', 'demo-metal-support', 'demo-metal-fix'], components: edges('longrun'), exclusions: ['Minimum pitch depends on the selected profile, laps and exposure'] },
      metal: { label: 'Long-run metal (legacy)', eavesRate: { material: 9, labour: 7 }, minPitch: 5, maxPitch: 50, areaProducts: ['demo-longrun', 'tyvek-supro', 'demo-metal-support', 'demo-metal-fix'], components: edges('longrun'), exclusions: ['Legacy material selection mapped to long-run metal'] },
      epdm: { label: 'EPDM flat membrane', flatPerimeterRate: { material: 10, labour: 9 }, minPitch: 0, maxPitch: 5, areaProducts: ['demo-epdm', 'demo-flat-deck'], components: {}, exclusions: ['Deck replacement is assumed', 'Flat perimeter, upstands, outlets, insulation and falls require project-specific details'] },
      grp: { label: 'GRP fibreglass flat roof', flatPerimeterRate: { material: 12, labour: 10 }, minPitch: 0, maxPitch: 5, areaProducts: ['demo-grp', 'demo-flat-deck'], components: {}, exclusions: ['Deck replacement is assumed', 'Flat perimeter, upstands, outlets, insulation and falls require project-specific details'] },
    },
    areaRates: {}, labourFactors: {}, areaComplexityFactors: {},
    access: { 1: 550, 2: 1100 },
    removal: { perM2: 22, disposalPerJob: 0 },
    removalByMaterial: { tile: { perM2: 22, disposalPerJob: 0 }, slate: { perM2: 26, disposalPerJob: 0 }, metal: { perM2: 19, disposalPerJob: 0 }, membrane: { perM2: 21, disposalPerJob: 0 } },
    taxNote: 'Fictional UK demonstration prices excluding VAT. Not a quotation or verified merchant price.',
  };
}
