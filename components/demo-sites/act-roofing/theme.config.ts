import type { ThemeConfig } from '@quote-core/roof-takeoff';

const config: ThemeConfig = {
  primary: '#2E7D32',
  primaryHover: '#1B5E20',
  accent: '#0D1B2A',
  logoUrl: '/images/act-roofing-logo-light.png',
  headingFont: 'var(--font-montserrat), "Segoe UI", Arial, sans-serif',
  bodyFont: 'var(--font-roboto), "Segoe UI", Arial, sans-serif',
  currency: 'GBP',
  currencySymbol: '\u00A3',
  defaultUnits: 'metric',
  supplierName: 'ACT Roofing',
  supplierEmail: 'hello@actroofing.example',
  features: {
    sendToSupplier: true,
    convertToQuote: false,
    saveToApp: false,
  },
  pricingModes: ['material', 'material_install'],
  roofTypeOptions: ['new_roof', 're_roof'],
  copy: {
    headerTitle: 'Roof Takeoff Calculator',
    heroTitle: 'Get your roof measurements in minutes',
    heroSubtitle: 'Enter your roof plan dimensions and get a complete material takeoff with pricing.',
    footerText: 'ACT Roofing 2026',
    poweredBy: null,
  },
};

export default config;
