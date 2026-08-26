'use client';

import { PriceListPage } from "@/components/demo-sites/act-roofing/PriceListPage";
import priceListConfig from "@/components/demo-sites/act-roofing/price-list.config";
import theme from "@/components/demo-sites/act-roofing/theme.config";

export default function PriceListRoute() {
  return <PriceListPage theme={theme} config={priceListConfig} />;
}
