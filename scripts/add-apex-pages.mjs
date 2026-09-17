// One-off: add products-and-prices + reroof-cost-guide pages to the Apex demo site data.
import fs from 'node:fs';

const pagesPath = 'data/apex-roofing/website-pages.json';
const siteMapPath = 'data/apex-roofing/site-map.json';

const productsPage = {
  slug: 'information/products-and-prices',
  group: 'information',
  title: 'Products & Prices',
  metaDescription:
    'Apex Roofing product list with transparent supply-and-installed rates: roof systems, components, repairs and callouts. Ask our Smart Assistant for a ballpark in about a minute.',
  intro:
    'Our full product list with transparent rates. All roof-system rates are supply and installed, and exclude stripping and disposal of an existing roof (those allowances are added separately for re-roofs and confirmed after inspection). The Smart Assistant can turn any of these into a ballpark for your roof in about a minute - just ask.',
  sections: [
    {
      heading: 'Roof covering systems',
      bullets: [
        'Concrete tile roof system (Marley Edgemere) - £62 per m², minimum job £4,500',
        'Clay tile roof system - £78 per m², minimum job £5,500',
        'Natural slate roof system (CUPA Spanish slate) - £115 per m², minimum job £8,500',
        'Each system includes breathable underlay, battens, fixings, dry verge and installation',
        'Re-roofs add a strip allowance (£10 per m²) plus a £1,000 removal and disposal allowance',
      ],
    },
    {
      heading: 'Roof components and extras',
      bullets: [
        'Dry-fix ridge and hip system - £24 per linear metre',
        'GRP valley trough replacement - £32 per linear metre',
        'Lead / aluminium flashings - £28 per linear metre',
        'PVC gutter replacement - £18 per metre (minimum £850)',
        'Downpipe replacement - £95 each',
        'Fascia and soffit replacement - £22 per metre',
        'Roof insulation upgrade - £14 per m²',
        'Breathable membrane upgrade - £4.50 per m²',
      ],
    },
    {
      heading: 'Repairs, inspections and callouts',
      bullets: [
        'Roof repair (tile, slate or flashing) - from £280',
        'Emergency callout - £195',
        'Full roof inspection with photo report - free',
      ],
    },
    {
      heading: 'How to get a real number for your roof',
      body: [
        'Rates above are per-unit and apply to typical situations. For your actual roof, size, pitch, shape and access all matter. The fastest route is to ask our Smart Assistant for a ballpark - it will ask a couple of questions and give you an itemised range - or use the interactive measuring tool to upload a plan and price your exact roof.',
      ],
    },
  ],
};

const reroofPage = {
  slug: 'information/reroof-cost-guide',
  group: 'information',
  title: 'Re-Roof Cost Guide',
  metaDescription:
    'What a re-roof costs and what is involved: strip and disposal allowances, covering systems, components, timelines and how to get an itemised ballpark from the Apex Smart Assistant.',
  intro:
    'A straight answer on re-roof costs. Covering system rates depend on material and roof size; on top of those, every re-roof adds strip and disposal allowances. Here is how the price is built.',
  sections: [
    {
      heading: 'Covering system rates (supply and installed)',
      bullets: [
        'Concrete tile - from £62 per m²',
        'Clay tile - from £78 per m²',
        'Natural slate - from £115 per m²',
      ],
    },
    {
      heading: 'Re-roof allowances every quote includes',
      bullets: [
        'Strip existing roof - £10 per m² (indicative, confirmed after inspection)',
        'Removal and disposal of all old materials - £1,000 allowance per job',
        'Timber repairs quoted transparently after inspection - never hidden in the rate',
      ],
    },
    {
      heading: 'What drives the final price',
      bullets: [
        'Roof size (measured on the actual sloped surface, not the footprint)',
        'Pitch - steeper roofs need more material and more labour time',
        'Material choice - concrete, clay or slate',
        'Roof shape - hips and valleys add component and labour cost',
        'Access - scaffolding constraints and difficult sites',
      ],
    },
    {
      heading: 'A worked example',
      body: [
        'A typical 120 m² concrete tile re-roof at medium pitch comes to roughly £7,400 for the covering system, £1,200 for strip, plus the £1,000 disposal allowance - around £9,600 before any optional components like ridge systems or guttering. Ask the Smart Assistant for your own numbers and it will itemise it for your roof.',
      ],
    },
    {
      heading: 'What the process looks like',
      bullets: [
        'Free inspection and written itemised quote within 48 hours',
        'Full strip, timber inspection, breathable underlay and battens',
        'New covering installed - most homes finished in 2 to 4 working days',
        'Final inspection, site cleaned, 10-year workmanship warranty issued in writing',
      ],
    },
  ],
};

const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
const filtered = pages.filter((p) => p.slug !== productsPage.slug && p.slug !== reroofPage.slug);
// insert after 'how-estimates-work' so it sits with the information pages
const idx = filtered.findIndex((p) => p.slug === 'information/how-estimates-work');
const insertAt = idx >= 0 ? idx + 1 : filtered.length;
filtered.splice(insertAt, 0, productsPage, reroofPage);
fs.writeFileSync(pagesPath, JSON.stringify(filtered, null, 2) + '\n');
console.log('website-pages.json updated:', filtered.length, 'pages');

const siteMap = JSON.parse(fs.readFileSync(siteMapPath, 'utf8'));
const newTopics = [
  {
    id: 'products-and-prices',
    title: 'Products & Prices',
    path: '/demo/roofing-site/information/products-and-prices',
    keywords: ['products', 'price list', 'prices', 'rates', 'how much', 'cost', 'catalogue', 'product list'],
    description: 'Full product list with transparent supply-and-installed rates.',
  },
  {
    id: 'reroof-cost-guide',
    title: 'Re-Roof Cost Guide',
    path: '/demo/roofing-site/information/reroof-cost-guide',
    keywords: ['reroof cost', 're-roof cost', 'how much to reroof', 'replacement cost', 'strip', 'disposal', 'worked example'],
    description: 'What a re-roof costs and what is involved: allowances, rates and a worked example.',
  },
];
const sm = siteMap.filter((s) => !newTopics.some((n) => n.id === s.id));
sm.splice(sm.length - 3, 0, ...newTopics); // before request-a-quote/contact/pricing-tool tail
fs.writeFileSync(siteMapPath, JSON.stringify(sm, null, 2) + '\n');
console.log('site-map.json updated:', sm.length, 'topics');
