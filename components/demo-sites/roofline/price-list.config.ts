import type { PriceListConfig } from "../act-roofing/price-list.config";

/** Roofline Canterbury product price list. Supply-only indicative NZD rates, ex GST.
 *  Rates mirror the roofline supplier tool catalogue for consistency. */

const config: PriceListConfig = {
  pageTitle: 'Product Price List',
  pageSubtitle: 'Indicative supply pricing for our roofing and cladding products, manufactured in our Christchurch factory. All prices are subject to confirmation - contact us for install pricing, bulk orders and trade accounts.',
  ctaTitle: 'Need trade or install pricing?',
  ctaDescription: 'We supply trade, and we install with our own team. Get in touch for a tailored quote, or price your plans with us.',
  ctaButtonText: 'Contact us for a quote',
  exVatLabel: true,
  demoDisclaimer: 'Demonstration pricing for the Roofline Canterbury demo - replace with your confirmed rates',
  products: [
    { name: 'Roofdeck 0.40g (ColorCote)', sku: 'RF-RD-040', category: 'Roofing', unit: 'm2', price: 23.5, purchaseType: 'Supply', description: 'Trapezoidal long-run profile in 0.40mm ColorCote pre-finished steel. Strong spanning, clean flat look, from about 3 degrees pitch.' },
    { name: 'Roofdeck 0.55g (ColorCote)', sku: 'RF-RD-055', category: 'Roofing', unit: 'm2', price: 28.0, purchaseType: 'Supply', description: 'Heavy-duty 0.55mm Roofdeck for exposed sites and longer spans.' },
    { name: 'Corrugate 0.40g (ColorCote)', sku: 'RF-CG-040', category: 'Roofing', unit: 'm2', price: 22.5, purchaseType: 'Supply', description: 'Classic corrugated long-run iron in 0.40mm ColorCote. Through-fixed, from about 8 degrees pitch.' },
    { name: 'Corrugate 0.55g (ColorCote)', sku: 'RF-CG-055', category: 'Roofing', unit: 'm2', price: 27.5, purchaseType: 'Supply', description: 'Heavier 0.55mm corrugate for exposed locations.' },
    { name: '205 Underlay', sku: 'UND-RF-205', category: 'Underlays', unit: 'm2', price: 5.0, purchaseType: 'Supply', description: 'Standard roofing underlay for long-run steel roofs.' },
    { name: '407 Covertek Underlay', sku: 'UND-RF-407', category: 'Underlays', unit: 'm2', price: 15.0, purchaseType: 'Supply', description: 'Heavy-grade Covertek underlay upgrade for exposed sites.' },
    { name: 'Screws (Fixings) 65mm', sku: 'FIX-RF-65', category: 'Fixings', unit: 'm2', price: 2.0, purchaseType: 'Supply', description: 'Colour-matched 65mm roofing screws, priced per square metre of roof.' },
    { name: 'Screws (Fixings) 50mm', sku: 'FIX-RF-50', category: 'Fixings', unit: 'm2', price: 1.7, purchaseType: 'Supply', description: 'Colour-matched 50mm roofing screws, priced per square metre of roof.' },
    { name: 'Ridge Flashing - Roofdeck', sku: 'RDG-RF-RD', category: 'Flashings', unit: 'lm', price: 18.5, purchaseType: 'Made to order', description: 'Colour-matched ridge flashing for Roofdeck profile, folded to length in our factory.' },
    { name: 'Ridge Flashing - Corrugate', sku: 'RDG-RF-CG', category: 'Flashings', unit: 'lm', price: 21.0, purchaseType: 'Made to order', description: 'Colour-matched ridge flashing for corrugate profile, folded to length.' },
    { name: 'Hip Flashing - Roofdeck', sku: 'HIP-RF-RD', category: 'Flashings', unit: 'lm', price: 18.5, purchaseType: 'Made to order', description: 'Colour-matched hip flashing for Roofdeck profile.' },
    { name: 'Hip Flashing - Corrugate', sku: 'HIP-RF-CG', category: 'Flashings', unit: 'lm', price: 22.5, purchaseType: 'Made to order', description: 'Colour-matched hip flashing for corrugate profile.' },
    { name: 'Valley Flashing', sku: 'VAL-RF-CG', category: 'Flashings', unit: 'lm', price: 17.0, purchaseType: 'Made to order', description: 'Folded valley flashing for internal roof intersections, suits both profiles.' },
    { name: 'Barge Flashing - Roofdeck', sku: 'BRG-RF-RD', category: 'Flashings', unit: 'lm', price: 22.5, purchaseType: 'Made to order', description: 'Colour-matched barge flashing along gable edges, Roofdeck profile.' },
    { name: 'Barge Flashing - Corrugate', sku: 'BRG-RF-CG', category: 'Flashings', unit: 'lm', price: 22.5, purchaseType: 'Made to order', description: 'Colour-matched barge flashing along gable edges, corrugate profile.' },
    { name: '185 Fascia', sku: 'FAS-RF-185', category: 'Spouting & Guttering', unit: 'lm', price: 22.0, purchaseType: 'Made to order', description: '185mm fascia in ColorCote finish, made to length.' },
    { name: 'Roofline Quad Gutter', sku: 'GUT-RF-QUAD', category: 'Spouting & Guttering', unit: 'lm', price: 22.5, purchaseType: 'Made to order', description: 'Roofline quad spouting system in ColorCote finish, continuous lengths.' },
    { name: '80mm Downpipe 3m', sku: 'DWN-RF-80', category: 'Spouting & Guttering', unit: 'each', price: 60.0, purchaseType: 'Supply', description: '80mm round downpipe in 3 metre lengths, colour-matched.' },
    { name: '75x50 Rect Downpipe 3m', sku: 'DWN-RF-7550', category: 'Spouting & Guttering', unit: 'each', price: 70.0, purchaseType: 'Supply', description: '75x50 rectangular downpipe in 3 metre lengths, colour-matched.' },
  ],
};

export default config;
