import type { PricingProfile } from './pricing';
import type { EstimateRules } from '../pricing/rules';

/** Roofline Canterbury demo rates, NZD. These are not supplier quotes. */
export function rooflinePricingProfile(_removal: { perM2: number; disposalPerJob: number }, _pitchRules: NonNullable<EstimateRules['materialPitchRules']>): PricingProfile {
  const edges = (prefix: 'cg' | 'rd') => ({ ridges: `rf-ridge-${prefix}`, hips: `rf-hip-${prefix}`, valleys: 'rf-valley', barges: `rf-barge-${prefix}` });
  return {
    version: 'roofline-nz-demo-1.0', currency: 'NZD', mode: 'components',
    systems: {
      longrun: { label: 'Corrugate 0.40g (ColorCote)', eavesRate: { material: 9, labour: 8 }, minPitch: 8, maxPitch: 60, areaProducts: ['rf-cg-040', 'rf-underlay-205', 'rf-screws-65'], components: edges('cg'), exclusions: ['Minimum pitch depends on the profile, laps and exposure'] },
      pressed_metal: { label: 'Roofdeck 0.40g (ColorCote)', eavesRate: { material: 10, labour: 8 }, minPitch: 3, maxPitch: 60, areaProducts: ['rf-rd-040', 'rf-underlay-205', 'rf-screws-65'], components: edges('rd'), exclusions: ['Low-pitch installs need sealed laps and a site-specific fixing specification'] },
      metal: { label: 'Corrugate or Roofdeck 0.55g (heavy duty)', eavesRate: { material: 10, labour: 8 }, minPitch: 8, maxPitch: 60, areaProducts: ['rf-cg-055', 'rf-underlay-407', 'rf-screws-65'], components: edges('cg'), exclusions: ['0.55g heavy-duty gauge; confirm profile and fixing specification with the team'] },
      epdm: { label: 'Low-pitch metal (Roofdeck 0.55g)', eavesRate: { material: 12, labour: 9 }, minPitch: 3, maxPitch: 15, areaProducts: ['rf-rd-055', 'rf-underlay-407', 'rf-screws-65'], components: edges('rd'), exclusions: ['Low-pitch installs need sealed laps and a site-specific fixing specification'] },
      grp: { label: 'Low-pitch metal (Roofdeck 0.40g)', eavesRate: { material: 10, labour: 8 }, minPitch: 3, maxPitch: 15, areaProducts: ['rf-rd-040', 'rf-underlay-407', 'rf-screws-65'], components: edges('rd'), exclusions: ['Low-pitch installs need sealed laps and a site-specific fixing specification'] },
    },
    areaRates: {}, labourFactors: {}, areaComplexityFactors: {},
    access: { 1: 600, 2: 1200 },
    removal: { perM2: 20, disposalPerJob: 0 },
    removalByMaterial: { metal: { perM2: 18, disposalPerJob: 0 }, tile: { perM2: 24, disposalPerJob: 0 }, slate: { perM2: 26, disposalPerJob: 0 }, membrane: { perM2: 20, disposalPerJob: 0 } },
    taxNote: 'Indicative New Zealand demonstration prices in NZD, supply and install. Not a quotation or verified supplier price.',
  };
}
