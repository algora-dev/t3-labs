import type { ThemeConfig } from '@quote-core/roof-takeoff';

/** Roofline Canterbury theme for the price list page (mirrors the roofline supplier tool brand). */

const config: ThemeConfig = {
  primary: '#C8102E',
  primaryHover: '#A50D26',
  accent: '#111111',
  logoUrl: '/assets/demo-roofline/branding.png',
  homeUrl: '/demo/roofline-site',
  headingFont: 'var(--font-manrope), "Segoe UI", Arial, sans-serif',
  bodyFont: 'var(--font-manrope), "Segoe UI", Arial, sans-serif',
  currency: 'NZD',
  currencySymbol: '$',
  defaultUnits: 'metric',
  supplierName: 'Roofline Canterbury',
  supplierEmail: 'enquiries@rooflinecanterbury.example',
  features: {
    sendToSupplier: true,
    convertToQuote: false,
    saveToApp: false,
  },
  pricingModes: ['material', 'material_install'],
  roofTypeOptions: ['new_roof', 're_roof'],
  copy: {
    headerTitle: 'Roof Takeoff Calculator',
    heroTitle: 'Know roughly what your new roof could cost',
    heroSubtitle: 'Answer a few quick questions about your property and get an estimated price range instantly.',
    footerText: 'Roofline Canterbury demonstration site',
    poweredBy: null,
  },
};

export default config;
