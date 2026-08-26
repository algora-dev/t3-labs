'use client';

import Link from 'next/link';
import { TakeoffFlow, loadComponentsFromConfig } from "@quote-core/roof-takeoff";
import theme from "@/components/demo-sites/act-roofing/theme.config";
import componentsConfig from "@/components/demo-sites/act-roofing/components.config";

const components = loadComponentsFromConfig(componentsConfig);

export default function TakeoffPage() {
  return (
    <>
      {/* Back breadcrumb bar (tool chrome, above the takeoff header) */}
      <div className="bg-white border-b border-slate-100">
        <div className="mx-auto max-w-2xl px-4 py-2 text-sm">
          <Link
            href="/demo/roofing-site"
            className="text-slate-500 hover:text-slate-900 transition"
          >
            &larr; Back to Apex Roofing home
          </Link>
        </div>
      </div>
      <TakeoffFlow theme={theme} components={components} />
    </>
  );
}
