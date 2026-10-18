'use client';

import { PriceListPage } from "@/components/demo-sites/roofline/PriceListPage";
import priceListConfig from "@/components/demo-sites/roofline/price-list.config";
import theme from "@/components/demo-sites/roofline/theme.config";

export default function PriceListRoute() {
  return <PriceListPage theme={theme} config={priceListConfig} />;
}
