import { APEX_ROOFING } from '../../app/supplier-pricing-tool/supplierDefs/apex-roofing';
import { ROOFLINE_ROOFING } from '../../app/supplier-pricing-tool/supplierDefs/roofline-roofing';
import { withBusinessContext } from '../assistant/business-context';
import { getEstimateRules, getV4Rules } from '../pricing/rules';
import { apexPricingProfile } from './apex-profile';
import { rooflinePricingProfile } from './roofline-profile';
import { createQuickResult, validatePricingProfile } from './pricing';
import { parseQuickInput } from './validation';

export function getApexQuickPricing() {
  const rates = getV4Rules().reroofAllowances;
  const profile = apexPricingProfile({ perM2: rates.stripRatePerM2, disposalPerJob: rates.disposalAllowancePerJob }, getEstimateRules().materialPitchRules ?? {});
  validatePricingProfile(profile);
  return { catalog: APEX_ROOFING.products, profile };
}
export function calculateApexQuickEstimate(value: unknown) {
  const input = parseQuickInput(value); const { catalog, profile } = getApexQuickPricing();
  return createQuickResult(input, catalog, profile);
}

/** Roofline Canterbury quick estimate: roofline-roofing catalogue + NZD profile. */
export async function getRooflineQuickPricing() {
  return withBusinessContext('roofline-roofing', async () => {
    const rates = getV4Rules().reroofAllowances;
    const profile = rooflinePricingProfile({ perM2: rates.stripRatePerM2, disposalPerJob: rates.disposalAllowancePerJob }, getEstimateRules().materialPitchRules ?? {});
    validatePricingProfile(profile);
    return { catalog: ROOFLINE_ROOFING.products, profile };
  });
}
export async function calculateRooflineQuickEstimate(value: unknown) {
  const input = parseQuickInput(value); const { catalog, profile } = await getRooflineQuickPricing();
  return createQuickResult(input, catalog, profile);
}
