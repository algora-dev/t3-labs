import type { PricingProfile } from './pricing';
import type { EstimateRules } from '../pricing/rules';

/** Roofline Canterbury demo rates, NZD. These are not supplier quotes. */
export function rooflinePricingProfile(_removal: { perM2: number; disposalPerJob: number }, _pitchRules: NonNullable<EstimateRules['materialPitchRules']>): PricingProfile {
  const edges = (prefix: 'cg' | 'rd' | 'ev') => ({ ridges: `rf-ridge-${prefix}`, hips: `rf-hip-${prefix}`, valleys: prefix === 'ev' ? 'rf-valley-ev' : 'rf-valley', barges: `rf-barge-${prefix}` });
  return {
    version: 'roofline-nz-demo-1.1', currency: 'NZD', mode: 'components',
    systems: {
      longrun: { label: 'Corrugate 0.40g (ColorCote)', eavesRate: { material: 9, labour: 8 }, minPitch: 8, maxPitch: 60, areaProducts: ['rf-cg-040', 'rf-underlay-205', 'rf-screws-65'], components: edges('cg'), exclusions: [] },
      everest_tray: { label: 'Everest Tray 0.55g (hidden fix)', eavesRate: { material: 12, labour: 10 }, minPitch: 3, maxPitch: 60, areaProducts: ['rf-ev-055', 'rf-underlay-407', 'rf-ev-clips'], components: edges('ev'), exclusions: [] },
      pressed_metal: { label: 'Roofdeck 0.40g (ColorCote)', eavesRate: { material: 10, labour: 8 }, minPitch: 3, maxPitch: 60, areaProducts: ['rf-rd-040', 'rf-underlay-205', 'rf-screws-65'], components: edges('rd'), exclusions: [] },
      metal: { label: 'Corrugate or Roofdeck 0.55g (heavy duty)', eavesRate: { material: 10, labour: 8 }, minPitch: 8, maxPitch: 60, areaProducts: ['rf-cg-055', 'rf-underlay-407', 'rf-screws-65'], components: edges('cg'), exclusions: [] },
      epdm: { label: 'Low-pitch metal (Roofdeck 0.55g)', eavesRate: { material: 12, labour: 9 }, minPitch: 3, maxPitch: 15, areaProducts: ['rf-rd-055', 'rf-underlay-407', 'rf-screws-65'], components: edges('rd'), exclusions: [] },
      grp: { label: 'Low-pitch metal (Roofdeck 0.40g)', eavesRate: { material: 10, labour: 8 }, minPitch: 3, maxPitch: 15, areaProducts: ['rf-rd-040', 'rf-underlay-407', 'rf-screws-65'], components: edges('rd'), exclusions: [] },
    },
    areaRates: {}, labourFactors: {}, areaComplexityFactors: {},
    access: { 1: 1500, 2: 3500 },
    removal: { perM2: _removal.perM2, disposalPerJob: _removal.disposalPerJob },
    removalByMaterial: { metal: { perM2: _removal.perM2, disposalPerJob: _removal.disposalPerJob }, tile: { perM2: 30, disposalPerJob: 900 }, slate: { perM2: 35, disposalPerJob: 1000 }, membrane: { perM2: 24, disposalPerJob: 750 } },
    taxNote: 'Indicative New Zealand demonstration prices in NZD, supply and install. Not a quotation or verified supplier price.',
  };
}
