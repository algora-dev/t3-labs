import type { ComponentConfigEntry } from '@quote-core/roof-takeoff';

const components: ComponentConfigEntry[] = [
  // Roof Area
  { name: 'Concrete Interlocking Tiles', kind: 'roof_area', unit: 'm\u00B2', price_per_unit: 18.50, labour_rate: 22.00, description: 'Marley Modern or similar interlocking concrete tile', suggested_waste_percent: 5 },
  { name: 'Clay Plain Tiles', kind: 'roof_area', unit: 'm\u00B2', price_per_unit: 28.00, labour_rate: 28.00, description: 'Sand-faced clay plain tiles', suggested_waste_percent: 7 },
  { name: 'Slate Tiles', kind: 'roof_area', unit: 'm\u00B2', price_per_unit: 35.00, labour_rate: 30.00, description: 'Welsh or Spanish natural slate', suggested_waste_percent: 5 },
  { name: 'Felt Roofing System', kind: 'roof_area', unit: 'm\u00B2', price_per_unit: 25.00, labour_rate: 18.00, description: 'Torched-on built-up felt system', suggested_waste_percent: 10 },

  // Ridges
  { name: 'Concrete Ridge Tile', kind: 'ridge', unit: 'm', price_per_unit: 8.50, labour_rate: 6.00, description: 'Half-round concrete ridge', suggested_waste_percent: 3 },
  { name: 'Clay Ridge Tile', kind: 'ridge', unit: 'm', price_per_unit: 12.00, labour_rate: 6.00, description: 'Clay half-round ridge' },
  { name: 'Dry Ridge System', kind: 'ridge', unit: 'm', price_per_unit: 15.00, labour_rate: 8.00, description: 'Mechanically fixed dry ridge kit' },

  // Hips
  { name: 'Concrete Hip Tile', kind: 'hip', unit: 'm', price_per_unit: 9.50, labour_rate: 7.00, description: 'Third-round concrete hip tile' },
  { name: 'Dry Hip System', kind: 'hip', unit: 'm', price_per_unit: 16.00, labour_rate: 8.00, description: 'Mechanically fixed dry hip kit' },

  // Valleys
  { name: 'GRP Valley Trough', kind: 'valley', unit: 'm', price_per_unit: 14.00, labour_rate: 10.00, description: 'Pre-formed GRP valley trough' },
  { name: 'Lead Valley', kind: 'valley', unit: 'm', price_per_unit: 28.00, labour_rate: 15.00, description: 'Code 4 lead-lined valley' },

  // Barges
  { name: 'Concrete Barge Tile', kind: 'barge', unit: 'm', price_per_unit: 7.50, labour_rate: 6.00, description: 'Concrete barge tile for gable edges' },

  // Spouting
  { name: 'PVC Gutter 112mm', kind: 'spouting', unit: 'm', price_per_unit: 6.50, labour_rate: 5.00, description: 'Half-round PVC guttering' },
  { name: 'PVC Downpipe 68mm', kind: 'spouting', unit: 'm', price_per_unit: 5.50, labour_rate: 4.00, description: 'Round PVC downpipe' },
  { name: 'Aluminium Gutter 125mm', kind: 'spouting', unit: 'm', price_per_unit: 15.00, labour_rate: 8.00, description: 'Seamless aluminium half-round gutter' },

  // Underlay
  { name: 'Breathable Membrane', kind: 'underlay', unit: 'm\u00B2', price_per_unit: 2.80, labour_rate: 2.00, description: 'Vapour permeable underlay', suggested_waste_percent: 10 },
  { name: '1F Felt Underlay', kind: 'underlay', unit: 'm\u00B2', price_per_unit: 1.80, labour_rate: 2.00, description: 'Traditional bituminous underlay' },

  // Fixings
  { name: 'Roofing Nails (bag of 500)', kind: 'fixings', unit: 'm\u00B2', price_per_unit: 1.20, labour_rate: 0, description: 'Galvanised clout nails', pricing_strategy: 'per_unit', suggested_waste_percent: 3 },
  { name: 'Tile Clips (box of 100)', kind: 'fixings', unit: 'm\u00B2', price_per_unit: 2.50, labour_rate: 0, description: 'Aluminium tile clips for wind resistance', pricing_strategy: 'per_unit' },
];

export default components;
