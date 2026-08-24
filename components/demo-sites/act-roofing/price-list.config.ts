// Price List Configuration
// Edit this file with the customer's real products and pricing.
// Each product shows as an expandable card on the /price-list page.

export interface PriceListItem {
  name: string;
  sku: string;
  category: string;
  unit: string;
  price: number;
  priceNote?: string;
  description?: string;
  purchaseType: string;
}

export interface PriceListConfig {
  // Page title and intro text
  pageTitle: string;
  pageSubtitle: string;
  // CTA section at the bottom
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  // Whether to show "ex VAT" label on all prices
  exVatLabel: boolean;
  // Disclaimer shown in each expanded product card
  demoDisclaimer: string;
  // The products
  products: PriceListItem[];
}

const config: PriceListConfig = {
  pageTitle: 'Product Price List',
  pageSubtitle: 'Indicative pricing for our roofing products. All prices are subject to confirmation - contact us for trade pricing and bulk orders.',
  ctaTitle: 'Need trade pricing?',
  ctaDescription: 'We offer competitive trade pricing for contractors and bulk orders. Get in touch with our team for a tailored quote.',
  ctaButtonText: 'Contact us for a quote',
  exVatLabel: true,
  demoDisclaimer: 'Test product - replace with your own products and pricing',

  products: [
    // ── Roof Tiles ──
    {
      name: 'Concrete Interlocking Roof Tile',
      sku: 'RT-CI-001',
      category: 'Roof Tiles',
      unit: 'per tile',
      price: 1.85,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Standard concrete interlocking tile, suitable for pitches 17.5 degrees and above. Available in brown, grey, red and black. Covers approximately 9.7 tiles per m2.',
    },
    {
      name: 'Clay Plain Roof Tile',
      sku: 'RT-CP-002',
      category: 'Roof Tiles',
      unit: 'per tile',
      price: 0.95,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Traditional clay plain tile for pitches 35 degrees and above. Handmade finish available. Covers approximately 60 tiles per m2.',
    },
    {
      name: 'Concrete Plain Roof Tile',
      sku: 'RT-CPT-003',
      category: 'Roof Tiles',
      unit: 'per tile',
      price: 0.72,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Machine-made concrete plain tile. Suitable for pitches 35 degrees and above. Available in four colours.',
    },
    {
      name: 'Slate Roof Tile (500x250)',
      sku: 'RT-SL-004',
      category: 'Roof Tiles',
      unit: 'per slate',
      price: 2.40,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Natural Welsh slate, 500mm x 250mm. Premium quality, suitable for pitches 25 degrees and above. Covers approximately 19 slates per m2.',
    },
    {
      name: 'Fibre Cement Slate (600x300)',
      sku: 'RT-FC-005',
      category: 'Roof Tiles',
      unit: 'per slate',
      price: 1.65,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Man-made fibre cement slate, 600mm x 300mm. Lightweight alternative to natural slate. Suitable for pitches 20 degrees and above.',
    },

    // ── Ridge & Hip ──
    {
      name: 'Concrete Ridge Tile (Angled)',
      sku: 'RH-CRA-006',
      category: 'Ridge & Hip',
      unit: 'per linear m',
      price: 12.50,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Standard angled concrete ridge tile. Available in colours to match concrete interlocking tiles. 450mm length.',
    },
    {
      name: 'Clay Ridge Tile (Half Round)',
      sku: 'RH-CHR-007',
      category: 'Ridge & Hip',
      unit: 'per linear m',
      price: 14.20,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Half-round clay ridge tile. Traditional finish, 330mm length. Compatible with most tile profiles.',
    },
    {
      name: 'Hip End Ridge Tile',
      sku: 'RH-HE-008',
      category: 'Ridge & Hip',
      unit: 'per item',
      price: 18.75,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Hip end ridge tile for finishing hip junctions. Available in angled or half-round profiles.',
    },
    {
      name: 'Dry Fix Ridge Kit',
      sku: 'RH-DFK-009',
      category: 'Ridge & Hip',
      unit: 'per linear m',
      price: 22.00,
      priceNote: 'ex VAT',
      purchaseType: 'per pack',
      description: 'Mechanically fixed dry ridge system. No mortar required. Includes ridge tiles, unions, seals and fixings. Compliant with BS 5534.',
    },

    // ── Valleys ──
    {
      name: 'GRP Valley Trough (600mm)',
      sku: 'VL-GRP-010',
      category: 'Valleys',
      unit: 'per linear m',
      price: 16.80,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Glass reinforced plastic valley trough, 600mm wide. For use with concrete and clay tile roofs. Available in 3m lengths. Suitable for pitches 12.5 degrees and above.',
    },
    {
      name: 'Lead Lined Valley Gutter',
      sku: 'VL-LL-011',
      category: 'Valleys',
      unit: 'per linear m',
      price: 28.50,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Code 4 lead lined valley gutter, 300mm wide. For traditional valley construction on slate and tile roofs. Includes lead clips and fixings.',
    },
    {
      name: 'Dry Fix Valley System',
      sku: 'VL-DF-012',
      category: 'Valleys',
      unit: 'per linear m',
      price: 24.30,
      priceNote: 'ex VAT',
      purchaseType: 'per pack',
      description: 'Mechanically fixed dry valley system. No mortar required. Includes valley trough, tile inserts, seals and fixings. Compliant with BS 5534. For pitches 17.5 degrees and above.',
    },

    // ── Underlay & Membranes ──
    {
      name: 'Breathable Roofing Underlay',
      sku: 'UM-BR-013',
      category: 'Underlay & Membranes',
      unit: 'per m2',
      price: 2.85,
      priceNote: 'ex VAT',
      purchaseType: 'per roll',
      description: 'Vapour permeable underlay, 1.5m x 50m roll (75m2). Suitable for warm and cold roof constructions. No ventilation required.',
    },
    {
      name: 'Traditional Bituminous Felt Underlay',
      sku: 'UM-BF-014',
      category: 'Underlay & Membranes',
      unit: 'per m2',
      price: 1.45,
      priceNote: 'ex VAT',
      purchaseType: 'per roll',
      description: 'Type 1F bituminous roofing felt, 1m x 20m roll. For use with ventilated roof spaces only.',
    },
    {
      name: 'Vapour Control Layer',
      sku: 'UM-VC-015',
      category: 'Underlay & Membranes',
      unit: 'per m2',
      price: 1.20,
      priceNote: 'ex VAT',
      purchaseType: 'per roll',
      description: '500 gauge polythene vapour control layer, 4m x 25m roll. For use in warm roof constructions.',
    },

    // ── Barge & Flashing ──
    {
      name: 'Dry Verge System (per side)',
      sku: 'BF-DV-016',
      category: 'Barge & Flashing',
      unit: 'per linear m',
      price: 8.50,
      priceNote: 'ex VAT',
      purchaseType: 'per pack',
      description: 'Interlocking dry verge system, mortar-free. Available in colours to match roof tiles. 1m sections with clips and fixings.',
    },
    {
      name: 'Lead Flashing Roll (Code 4)',
      sku: 'BF-LF-017',
      category: 'Barge & Flashing',
      unit: 'per linear m',
      price: 15.30,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: 'Code 4 lead flashing, 150mm wide. For chimney stacks, abutments and roof junctions. 6m roll.',
    },
    {
      name: 'Lead Substitute Flashing',
      sku: 'BF-LS-018',
      category: 'Barge & Flashing',
      unit: 'per linear m',
      price: 6.75,
      priceNote: 'ex VAT',
      purchaseType: 'per roll',
      description: 'Glass fibre based lead alternative, 300mm wide. Lightweight, non-toxic. 10m roll. Suitable for pitches 15 degrees and above.',
    },

    // ── Spouting & Drainage ──
    {
      name: 'PVC Fascia Board (White)',
      sku: 'SD-PF-019',
      category: 'Spouting & Drainage',
      unit: 'per linear m',
      price: 7.20,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: '18mm white PVC fascia board, 150mm width. Pre-primed. 5m length.',
    },
    {
      name: 'Guttering (Half Round PVC)',
      sku: 'SD-GT-020',
      category: 'Spouting & Drainage',
      unit: 'per linear m',
      price: 5.40,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: '112mm half-round PVC gutter, white. Includes brackets and union clips. 4m lengths.',
    },
    {
      name: 'Downpipe (PVC Square)',
      sku: 'SD-DP-021',
      category: 'Spouting & Drainage',
      unit: 'per linear m',
      price: 4.80,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: '65mm square PVC downpipe, white. 5m lengths. Includes clips and offsets.',
    },

    // ── Fixings & Accessories ──
    {
      name: 'Roofing Nails (Galvanised)',
      sku: 'FA-RN-022',
      category: 'Fixings & Accessories',
      unit: 'per pack',
      price: 3.50,
      priceNote: 'ex VAT',
      purchaseType: 'per pack',
      description: 'Galvanised clout nails, 50mm. Pack of 200. For fixing roofing felt, battens and tiles.',
    },
    {
      name: 'Tile Clips (Universal)',
      sku: 'FA-TC-023',
      category: 'Fixings & Accessories',
      unit: 'per pack',
      price: 8.25,
      priceNote: 'ex VAT',
      purchaseType: 'per pack',
      description: 'Universal tile clips for mechanical fixing of concrete and clay tiles. Pack of 100. Compliant with BS 5534 wind loading requirements.',
    },
    {
      name: 'Roofing Battens (Treated)',
      sku: 'FA-RB-024',
      category: 'Fixings & Accessories',
      unit: 'per linear m',
      price: 1.15,
      priceNote: 'ex VAT',
      purchaseType: 'per item',
      description: '25mm x 50mm treated roofing batten, graded to BS 5534. 4.8m length. Pre-graded and stamped.',
    },
  ],
};

export default config;
