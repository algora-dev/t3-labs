// Demo supplier definition: Apex Roofing - the generic FULL-DEMO roofing
// build (blue/slate brand from the T3 Labs demo site). Same roofing flow
// and catalog shape as Burton; Burton stays as the "real customer" example.

import type { SupplierProduct } from '../types';

export const APEX_ROOFING = {
  slug: 'apex-roofing',
  trade: 'roofing' as const,
  name: 'Apex Roofing',
  tagline: 'Roofing Done Properly',
  demo: true,
  currency: '\u00A3', // GBP
  logoUrl: '/supplier-logos/apex-roofing.png',
  logoDarkUrl: '/supplier-logos/apex-roofing-header.png',
  brandColor: '#1E293B', // deep slate
  theme: {
    primary: '#1E293B',
    primaryHover: '#334155',
    accent: '#1769E0', // Apex blue
    accentHover: '#1258B4',
    border: '#93B4E3',
    borderHover: '#7AA0DC',
    washAlpha: 0.05,
    glowAlpha: 0.4,
  },
  poweredBy: true,
  discountPct: 12,
  tradeRequiresLogin: true,
  features: {
    login: true,
    adminPanel: true,
    quoteCoreConnect: true,
    convertToQuote: true,
    emailCapture: true,
    pricingMode: true,
  },  products: [
    // ---- Roof coverings (area) - picking one sets roof type + family ----
    { id: 'cupa-r18', name: 'CUPA R18 Natural Spanish Slate 500x250mm', code: 'SLT-CU-R18', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['slate'], family: 'CUPA Slate', unitPrice: 48.0, packSize: null, defaultWastePct: 10, defaultLabourRate: 21.0, priceEditable: true, suggested: true },
    { id: 'cupa-heavy3', name: 'CUPA Heavy 3 Natural Spanish Slate 500x250mm', code: 'SLT-CU-H3', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['slate'], family: 'CUPA Slate', unitPrice: 52.0, packSize: null, defaultWastePct: 10, defaultLabourRate: 21.0, priceEditable: true },
    { id: 'marley-edgemere', name: 'Marley Edgemere - Smooth Grey', code: 'TIL-MA-EDG', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['tile'], family: 'Marley Edgemere', unitPrice: 32.0, packSize: null, defaultWastePct: 7.5, defaultLabourRate: 14.0, priceEditable: true, suggested: true },
    { id: 'marley-ludlow', name: 'Marley Ludlow Plus - Greystone', code: 'TIL-MA-LUD', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['tile'], family: 'Marley Ludlow', unitPrice: 34.0, packSize: null, defaultWastePct: 7.5, defaultLabourRate: 14.0, priceEditable: true },

    // ---- Underlays (area, all roofs) ----
    { id: 'tyvek-supro', name: 'TYVEK Supro Felt 50m x 1.5m', code: 'UND-TY-SUP', basis: 'area', groups: ['roofAreas'], component: 'underlay', roofTypes: ['all'], unitPrice: 3.2, packSize: null, defaultWastePct: 10, defaultLabourRate: 6.0, priceEditable: true, suggested: true },
    { id: 'permavent-apex', name: 'Permavent Apex Air Permeable Membrane 1m x 50m', code: 'UND-PV-APX', basis: 'area', groups: ['roofAreas'], component: 'underlay', roofTypes: ['all'], unitPrice: 2.8, packSize: null, defaultWastePct: 10, defaultLabourRate: 6.0, priceEditable: true },

    // ---- Fixings (area, roof-type specific) ----
    { id: 'copper-slate-nails', name: 'Copper Slate Nails / Slate Fixings', code: 'FIX-CU-SLT', basis: 'area', groups: ['roofAreas'], component: 'fixing', roofTypes: ['slate'], family: 'CUPA Slate', unitPrice: 1.2, packSize: null, defaultWastePct: 0, defaultLabourRate: 0, priceEditable: true, suggested: true },
    { id: 'tile-nails-clips', name: 'Tile Nails + Clips 45 x 3.35mm', code: 'FIX-TL-45', basis: 'area', groups: ['roofAreas'], component: 'fixing', roofTypes: ['tile'], family: 'Marley', unitPrice: 0.9, packSize: null, defaultWastePct: 0, defaultLabourRate: 0, priceEditable: true, suggested: true },

    // ---- Barge / dry verge (lineal) ----
    { id: 'readyslate-verge', name: 'ReadySlate Aluminium Dry Verge 18mm Black 1m', code: 'BRS-RS-1M', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['slate'], unitPrice: 14.5, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 9.0, priceEditable: true },
    { id: 'manthorpe-slate-verge', name: 'Manthorpe Slate Dry Verge - Grey/Black', code: 'BRS-MP-SLT', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['slate'], family: 'Manthorpe', unitPrice: 11.2, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 9.0, priceEditable: true, suggested: true },
    { id: 'edgemere-verge-lh', name: 'Marley Edgemere Dry Verge LH - Smooth Grey', code: 'BRS-MA-LH', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['tile'], family: 'Marley Edgemere', unitPrice: 9.8, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 9.0, priceEditable: true, suggested: true },
    { id: 'edgemere-verge-rh', name: 'Marley Edgemere Dry Verge RH - Smooth Grey', code: 'BRS-MA-RH', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['tile'], family: 'Marley Edgemere', unitPrice: 9.8, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 9.0, priceEditable: true },

    // ---- Ridge (lineal) ----
    { id: 'manthorpe-ridge6', name: 'Manthorpe 6m Dry Ridge System - Black', code: 'RDG-MP-6M', basis: 'lineal', groups: ['ridges'], component: 'ridge', roofTypes: ['slate'], family: 'Manthorpe', unitPrice: 10.5, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 11.0, priceEditable: true },
    { id: 'easytrim-ridge', name: 'Easy-Trim Ridge F Dry Fix Ridge Kit 6m Black', code: 'RDG-ET-6M', basis: 'lineal', groups: ['ridges'], component: 'ridge', roofTypes: ['slate', 'tile'], unitPrice: 9.7, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 11.0, priceEditable: true, suggested: true },
    { id: 'marley-ridgefast', name: 'Marley RidgeFast Dry Fixing System 6m', code: 'RDG-MA-RF', basis: 'lineal', groups: ['ridges'], component: 'ridge', roofTypes: ['tile'], family: 'Marley', unitPrice: 11.3, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 11.0, priceEditable: true, suggested: true },

    // ---- Valleys (lineal) ----
    { id: 'grp-slate-valley', name: 'Slate GRP Valley Trough', code: 'VAL-GRP-SLT', basis: 'lineal', groups: ['valleys'], component: 'valley', roofTypes: ['slate'], unitPrice: 18.0, packSize: null, defaultWastePct: 6, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 16.0, priceEditable: true, suggested: true },
    { id: 'grp-tile-valley', name: 'GRP Tile Valley Trough', code: 'VAL-GRP-TIL', basis: 'lineal', groups: ['valleys'], component: 'valley', roofTypes: ['tile'], unitPrice: 16.0, packSize: null, defaultWastePct: 6, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 16.0, priceEditable: true },

    // ---- Hips (lineal) ----
    { id: 'manthorpe-hip', name: 'Manthorpe Universal Dry Ridge & Hip System', code: 'HIP-MP-UNI', basis: 'lineal', groups: ['hips'], component: 'hip', roofTypes: ['slate', 'tile'], family: 'Manthorpe', unitPrice: 12.0, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 12.0, priceEditable: true, suggested: true },
    { id: 'marley-hip', name: 'Marley Dry-Fix Hip System', code: 'HIP-MA-DF', basis: 'lineal', groups: ['hips'], component: 'hip', roofTypes: ['tile'], family: 'Marley', unitPrice: 13.0, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 12.0, priceEditable: true },

    // ---- Spouting / gutter (lineal, all roofs) ----
    { id: 'floplast-gutter', name: 'FloPlast Half Round PVC Gutter 4m - Black', code: 'SPO-FP-4M', basis: 'lineal', groups: ['spouting'], component: 'gutter', roofTypes: ['all'], unitPrice: 3.9, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 8.0, priceEditable: true, suggested: true },
    { id: 'evolve-gutter', name: 'EVOLVE Half Round Gutter 3m - Heritage Black', code: 'SPO-EV-3M', basis: 'lineal', groups: ['spouting'], component: 'gutter', roofTypes: ['all'], unitPrice: 4.7, packSize: null, defaultWastePct: 5, defaultWasteMode: 'flat', defaultWasteFlat: 0.5, defaultLabourRate: 8.0, priceEditable: true },

    // ---- Downpipes (count) ----
    { id: 'evolve-downpipe', name: 'EVOLVE 76mm Flushfit Downpipe 3m - Black', code: 'DWN-EV-76', basis: 'count', groups: ['downpipes'], component: 'downpipe', roofTypes: ['all'], family: 'EVOLVE', unitPrice: 14.8, packSize: null, defaultWastePct: 0, defaultLabourRate: 24.0, priceEditable: true, suggested: true },
    { id: 'floplast-downpipe', name: 'FloPlast Round Downpipe - Black', code: 'DWN-FP-RD', basis: 'count', groups: ['downpipes'], component: 'downpipe', roofTypes: ['all'], family: 'FloPlast', unitPrice: 13.2, packSize: null, defaultWastePct: 0, defaultLabourRate: 24.0, priceEditable: true },
    { id: 'demo-shingle', name: 'Demo architectural asphalt shingles', code: 'DEMO-SHINGLE', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['all'], unitPrice: 19, packSize: null, defaultWastePct: 10, defaultLabourRate: 20, priceEditable: true },
    { id: 'demo-pressed', name: 'Demo stone-coated pressed metal tiles', code: 'DEMO-PRESSED', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['all'], unitPrice: 34, packSize: null, defaultWastePct: 8, defaultLabourRate: 24, priceEditable: true },
    { id: 'demo-longrun', name: 'Demo 0.7mm profiled long-run steel', code: 'DEMO-LONGRUN', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['all'], unitPrice: 15, packSize: null, defaultWastePct: 8, defaultLabourRate: 22, priceEditable: true },
    { id: 'demo-epdm', name: 'Demo EPDM rubber flat membrane', code: 'DEMO-EPDM', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['all'], unitPrice: 23, packSize: null, defaultWastePct: 10, defaultLabourRate: 28, priceEditable: true },
    { id: 'demo-grp', name: 'Demo GRP fibreglass flat roof system', code: 'DEMO-GRP', basis: 'area', groups: ['roofAreas'], component: 'covering', roofTypes: ['all'], unitPrice: 31, packSize: null, defaultWastePct: 10, defaultLabourRate: 32, priceEditable: true },
    { id: 'demo-battens', name: 'Demo BS5534 roof battens, equivalent area rate', code: 'DEMO-BATTENS', basis: 'area', groups: ['roofAreas'], component: 'fixing', roofTypes: ['all'], unitPrice: 4.5, packSize: null, defaultWastePct: 10, defaultLabourRate: 4.3, priceEditable: true },
    { id: 'demo-shingle-deck', name: 'Demo OSB3 shingle roof deck', code: 'DEMO-SHINGLE-DECK', basis: 'area', groups: ['roofAreas'], component: 'fixing', roofTypes: ['all'], unitPrice: 13, packSize: null, defaultWastePct: 10, defaultLabourRate: 11, priceEditable: true },
    { id: 'demo-shingle-fix', name: 'Demo shingle fasteners and adhesive', code: 'DEMO-SHINGLE-FIX', basis: 'area', groups: ['roofAreas'], component: 'fixing', roofTypes: ['all'], unitPrice: 2, packSize: null, defaultWastePct: 5, defaultLabourRate: 0, priceEditable: true },
    { id: 'demo-metal-support', name: 'Demo metal support battens / purlins', code: 'DEMO-METAL-SUPPORT', basis: 'area', groups: ['roofAreas'], component: 'fixing', roofTypes: ['all'], unitPrice: 5, packSize: null, defaultWastePct: 8, defaultLabourRate: 5, priceEditable: true },
    { id: 'demo-metal-fix', name: 'Demo metal roof fixings', code: 'DEMO-METAL-FIX', basis: 'area', groups: ['roofAreas'], component: 'fixing', roofTypes: ['all'], unitPrice: 2.2, packSize: null, defaultWastePct: 5, defaultLabourRate: 0, priceEditable: true },
    { id: 'demo-flat-deck', name: 'Demo OSB3 flat roof deck', code: 'DEMO-FLAT-DECK', basis: 'area', groups: ['roofAreas'], component: 'fixing', roofTypes: ['all'], unitPrice: 13, packSize: null, defaultWastePct: 10, defaultLabourRate: 11, priceEditable: true },
    { id: 'demo-tile-ridges', name: 'Demo tile ridges complete edge detail', code: 'DEMO-tile-ridges', basis: 'lineal', groups: ['ridges'], component: 'ridge', roofTypes: ['tile'], unitPrice: 21, packSize: null, defaultWastePct: 5, defaultLabourRate: 12, priceEditable: true },
    { id: 'demo-tile-hips', name: 'Demo tile hips complete edge detail', code: 'DEMO-tile-hips', basis: 'lineal', groups: ['hips'], component: 'hip', roofTypes: ['tile'], unitPrice: 24, packSize: null, defaultWastePct: 5, defaultLabourRate: 14, priceEditable: true },
    { id: 'demo-tile-valleys', name: 'Demo tile valleys complete edge detail', code: 'DEMO-tile-valleys', basis: 'lineal', groups: ['valleys'], component: 'valley', roofTypes: ['tile'], unitPrice: 14, packSize: null, defaultWastePct: 5, defaultLabourRate: 16, priceEditable: true },
    { id: 'demo-tile-barges', name: 'Demo tile barges complete edge detail', code: 'DEMO-tile-barges', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['tile'], unitPrice: 12, packSize: null, defaultWastePct: 5, defaultLabourRate: 9, priceEditable: true },
    { id: 'demo-tile-spouting', name: 'Demo tile spouting complete edge detail', code: 'DEMO-tile-spouting', basis: 'lineal', groups: ['spouting'], component: 'gutter', roofTypes: ['tile'], unitPrice: 5, packSize: null, defaultWastePct: 5, defaultLabourRate: 5, priceEditable: true },
    { id: 'demo-slate-ridges', name: 'Demo slate ridges complete edge detail', code: 'DEMO-slate-ridges', basis: 'lineal', groups: ['ridges'], component: 'ridge', roofTypes: ['slate'], unitPrice: 20, packSize: null, defaultWastePct: 5, defaultLabourRate: 13, priceEditable: true },
    { id: 'demo-slate-hips', name: 'Demo slate hips complete edge detail', code: 'DEMO-slate-hips', basis: 'lineal', groups: ['hips'], component: 'hip', roofTypes: ['slate'], unitPrice: 24, packSize: null, defaultWastePct: 5, defaultLabourRate: 15, priceEditable: true },
    { id: 'demo-slate-valleys', name: 'Demo slate valleys complete edge detail', code: 'DEMO-slate-valleys', basis: 'lineal', groups: ['valleys'], component: 'valley', roofTypes: ['slate'], unitPrice: 15, packSize: null, defaultWastePct: 5, defaultLabourRate: 17, priceEditable: true },
    { id: 'demo-slate-barges', name: 'Demo slate barges complete edge detail', code: 'DEMO-slate-barges', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['slate'], unitPrice: 14, packSize: null, defaultWastePct: 5, defaultLabourRate: 10, priceEditable: true },
    { id: 'demo-slate-spouting', name: 'Demo slate spouting complete edge detail', code: 'DEMO-slate-spouting', basis: 'lineal', groups: ['spouting'], component: 'gutter', roofTypes: ['slate'], unitPrice: 5, packSize: null, defaultWastePct: 5, defaultLabourRate: 5, priceEditable: true },
    { id: 'demo-shingle-ridges', name: 'Demo shingle ridges complete edge detail', code: 'DEMO-shingle-ridges', basis: 'lineal', groups: ['ridges'], component: 'ridge', roofTypes: ['all'], unitPrice: 9, packSize: null, defaultWastePct: 5, defaultLabourRate: 10, priceEditable: true },
    { id: 'demo-shingle-hips', name: 'Demo shingle hips complete edge detail', code: 'DEMO-shingle-hips', basis: 'lineal', groups: ['hips'], component: 'hip', roofTypes: ['all'], unitPrice: 9, packSize: null, defaultWastePct: 5, defaultLabourRate: 11, priceEditable: true },
    { id: 'demo-shingle-valleys', name: 'Demo shingle valleys complete edge detail', code: 'DEMO-shingle-valleys', basis: 'lineal', groups: ['valleys'], component: 'valley', roofTypes: ['all'], unitPrice: 9, packSize: null, defaultWastePct: 5, defaultLabourRate: 15, priceEditable: true },
    { id: 'demo-shingle-barges', name: 'Demo shingle barges complete edge detail', code: 'DEMO-shingle-barges', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['all'], unitPrice: 9, packSize: null, defaultWastePct: 5, defaultLabourRate: 9, priceEditable: true },
    { id: 'demo-shingle-spouting', name: 'Demo shingle spouting complete edge detail', code: 'DEMO-shingle-spouting', basis: 'lineal', groups: ['spouting'], component: 'gutter', roofTypes: ['all'], unitPrice: 7, packSize: null, defaultWastePct: 5, defaultLabourRate: 7, priceEditable: true },
    { id: 'demo-pressed-ridges', name: 'Demo pressed ridges complete edge detail', code: 'DEMO-pressed-ridges', basis: 'lineal', groups: ['ridges'], component: 'ridge', roofTypes: ['all'], unitPrice: 17, packSize: null, defaultWastePct: 5, defaultLabourRate: 12, priceEditable: true },
    { id: 'demo-pressed-hips', name: 'Demo pressed hips complete edge detail', code: 'DEMO-pressed-hips', basis: 'lineal', groups: ['hips'], component: 'hip', roofTypes: ['all'], unitPrice: 19, packSize: null, defaultWastePct: 5, defaultLabourRate: 14, priceEditable: true },
    { id: 'demo-pressed-valleys', name: 'Demo pressed valleys complete edge detail', code: 'DEMO-pressed-valleys', basis: 'lineal', groups: ['valleys'], component: 'valley', roofTypes: ['all'], unitPrice: 20, packSize: null, defaultWastePct: 5, defaultLabourRate: 17, priceEditable: true },
    { id: 'demo-pressed-barges', name: 'Demo pressed barges complete edge detail', code: 'DEMO-pressed-barges', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['all'], unitPrice: 15, packSize: null, defaultWastePct: 5, defaultLabourRate: 11, priceEditable: true },
    { id: 'demo-pressed-spouting', name: 'Demo pressed spouting complete edge detail', code: 'DEMO-pressed-spouting', basis: 'lineal', groups: ['spouting'], component: 'gutter', roofTypes: ['all'], unitPrice: 10, packSize: null, defaultWastePct: 5, defaultLabourRate: 7, priceEditable: true },
    { id: 'demo-longrun-ridges', name: 'Demo longrun ridges complete edge detail', code: 'DEMO-longrun-ridges', basis: 'lineal', groups: ['ridges'], component: 'ridge', roofTypes: ['all'], unitPrice: 14, packSize: null, defaultWastePct: 5, defaultLabourRate: 11, priceEditable: true },
    { id: 'demo-longrun-hips', name: 'Demo longrun hips complete edge detail', code: 'DEMO-longrun-hips', basis: 'lineal', groups: ['hips'], component: 'hip', roofTypes: ['all'], unitPrice: 16, packSize: null, defaultWastePct: 5, defaultLabourRate: 13, priceEditable: true },
    { id: 'demo-longrun-valleys', name: 'Demo longrun valleys complete edge detail', code: 'DEMO-longrun-valleys', basis: 'lineal', groups: ['valleys'], component: 'valley', roofTypes: ['all'], unitPrice: 19, packSize: null, defaultWastePct: 5, defaultLabourRate: 17, priceEditable: true },
    { id: 'demo-longrun-barges', name: 'Demo longrun barges complete edge detail', code: 'DEMO-longrun-barges', basis: 'lineal', groups: ['barges'], component: 'barge', roofTypes: ['all'], unitPrice: 14, packSize: null, defaultWastePct: 5, defaultLabourRate: 10, priceEditable: true },
    { id: 'demo-longrun-spouting', name: 'Demo longrun spouting complete edge detail', code: 'DEMO-longrun-spouting', basis: 'lineal', groups: ['spouting'], component: 'gutter', roofTypes: ['all'], unitPrice: 9, packSize: null, defaultWastePct: 5, defaultLabourRate: 7, priceEditable: true },
  ] as SupplierProduct[],
} as const;

