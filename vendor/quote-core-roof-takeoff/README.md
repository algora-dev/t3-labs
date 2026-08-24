# @quote-core/roof-takeoff

Shared roof takeoff builder package - calculation core, flow orchestration, Guided/Fast layouts, and shared UI components.

## Installation

```bash
npm install @quote-core/roof-takeoff
```

## Peer Dependencies

- `react` >= 18
- `react-dom` >= 18
- `next` >= 15 (optional, needed for flow/layout components)

## Usage

```tsx
import { TakeoffFlow, FormsLayout, ClassicLayout, type ThemeConfig } from '@quote-core/roof-takeoff';

const theme: ThemeConfig = {
  primary: '#FF6B35',
  primaryHover: '#A03E15',
  accent: '#FF6B35',
  logoUrl: null,
  headingFont: 'Inter, sans-serif',
  bodyFont: 'Inter, sans-serif',
  currency: 'NZD',
  currencySymbol: '$',
  defaultUnits: 'metric',
  supplierName: 'My Supplier',
  supplierEmail: null,
  features: { sendToSupplier: false, convertToQuote: false, saveToApp: false },
  copy: {
    headerTitle: 'Roof Takeoff',
    heroTitle: 'Build your takeoff',
    heroSubtitle: '',
    footerText: 'Powered by QuoteCore+',
    poweredBy: 'QuoteCore+',
  },
};

const components = [/* RoofComponentDef[] */];

export function MyTakeoffPage() {
  return <TakeoffFlow theme={theme} components={components} />;
}
```

## Exports

### Core
- Types: `ComponentKind`, `Entry`, `ComponentSection`, `RoofComponentDef`, `ThemeConfig`, etc.
- Functions: `calculateTakeoffSections`, `computeEntry`, `computeMaterialCost`, `computeLabourCost`, `makeInitialSections`, etc.

### Flow
- `TakeoffFlow` - full orchestration with measure/pricing/layout step screens

### Layouts
- `FormsLayout` - Guided mode (one section per page)
- `ClassicLayout` - Fast mode (all sections on one page, accordion)

### UI
- `ChoiceIcon` - icon component for choice screens
- `ComponentGuideBox` - visual guide diagrams
- `ResultsModal` - results display modal
- `SupplierEnquiryModal` - supplier enquiry form modal
