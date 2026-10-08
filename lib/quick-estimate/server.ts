import { APEX_ROOFING } from '../../app/supplier-pricing-tool/supplierDefs/apex-roofing';
import { getEstimateRules, getV4Rules } from '../pricing/rules';
import { apexPricingProfile } from './apex-profile';
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
