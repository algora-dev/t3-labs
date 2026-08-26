import type { ThemeConfig } from '@quote-core/roof-takeoff';

const config: ThemeConfig = {
  primary: '#1769E0',
  primaryHover: '#1257BC',
  accent: '#101828',
  logoUrl: '/assets/demo-act-roofing/ApexLogoBlack---ae397798-5fc2-4f9a-9c88-5c1e394f7e69.png',
  headingFont: 'var(--font-manrope), "Segoe UI", Arial, sans-serif',
  bodyFont: 'var(--font-manrope), "Segoe UI", Arial, sans-serif',
  currency: 'GBP',
  currencySymbol: '\u00A3',
  defaultUnits: 'metric',
  supplierName: 'Apex Roofing',
  supplierEmail: 'hello@apexroofing.example',
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
    footerText: 'Apex Roofing 2026 — demonstration site',
    poweredBy: null,
  },
};

export default config;
