'use client';

import { TakeoffFlow, loadComponentsFromConfig } from "@quote-core/roof-takeoff";
import theme from "@/components/demo-sites/act-roofing/theme.config";
import componentsConfig from "@/components/demo-sites/act-roofing/components.config";

const components = loadComponentsFromConfig(componentsConfig);

export default function TakeoffPage() {
  return <TakeoffFlow theme={theme} components={components} />;
}
