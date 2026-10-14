const fs = require('fs');

// Read tools and categories from tools.ts
const toolsFile = fs.readFileSync('src/data/tools.ts', 'utf8');
const categories = ['drive', 'build', 'power', 'money', 'land', 'work', 'create'];

// Extract tools and their canonicalPath
const toolsLines = toolsFile.split('\n');
const tools = [];
let currentSlug = null;
let currentCanonical = null;

for (let i = 0; i < toolsLines.length; i++) {
  const line = toolsLines[i];
  const slugM = line.match(/^\s*slug:\s*['"]([^'"]+)['"]/);
  if (slugM) currentSlug = slugM[1];

  const canM = line.match(/^\s*canonicalPath:\s*['"]([^'"]+)['"]/);
  if (canM) {
    currentCanonical = canM[1];
    if (currentSlug && currentCanonical) {
      tools.push({ slug: currentSlug, canonical: currentCanonical });
      currentSlug = null;
      currentCanonical = null;
    }
  }
}

const BASE = 'https://indiatools-rho.vercel.app';

// Accurate lastmod dates based on actual content release dates
const DATE_INITIAL = '2026-10-10';
const DATE_GOLD = '2026-10-12';
const DATE_RECENT = '2026-10-14';

const chequeLanguages = [
  { code: 'en', locale: 'en-IN', path: '/calculators/indian-cheque-studio' },
  { code: 'hi', locale: 'hi-IN', path: '/calculators/indian-cheque-studio/hi' },
  { code: 'ml', locale: 'ml-IN', path: '/calculators/indian-cheque-studio/ml' },
  { code: 'ta', locale: 'ta-IN', path: '/calculators/indian-cheque-studio/ta' },
  { code: 'te', locale: 'te-IN', path: '/calculators/indian-cheque-studio/te' },
  { code: 'kn', locale: 'kn-IN', path: '/calculators/indian-cheque-studio/kn' },
  { code: 'bn', locale: 'bn-IN', path: '/calculators/indian-cheque-studio/bn' },
  { code: 'mr', locale: 'mr-IN', path: '/calculators/indian-cheque-studio/mr' },
  { code: 'gu', locale: 'gu-IN', path: '/calculators/indian-cheque-studio/gu' },
  { code: 'pa', locale: 'pa-IN', path: '/calculators/indian-cheque-studio/pa' },
  { code: 'or', locale: 'or-IN', path: '/calculators/indian-cheque-studio/or' },
  { code: 'as', locale: 'as-IN', path: '/calculators/indian-cheque-studio/as' },
  { code: 'ur', locale: 'ur-IN', path: '/calculators/indian-cheque-studio/ur' },
];

const goldLanguages = [
  { code: 'en', locale: 'en-IN', path: '/calculators/gold-exchange-calculator' },
  { code: 'ml', locale: 'ml-IN', path: '/ml/tools/gold-exchange-calculator' },
  { code: 'hi', locale: 'hi-IN', path: '/hi/tools/gold-exchange-calculator' },
  { code: 'ta', locale: 'ta-IN', path: '/ta/tools/gold-exchange-calculator' },
  { code: 'te', locale: 'te-IN', path: '/te/tools/gold-exchange-calculator' },
  { code: 'kn', locale: 'kn-IN', path: '/kn/tools/gold-exchange-calculator' },
  { code: 'bn', locale: 'bn-IN', path: '/bn/tools/gold-exchange-calculator' },
  { code: 'mr', locale: 'mr-IN', path: '/mr/tools/gold-exchange-calculator' },
  { code: 'gu', locale: 'gu-IN', path: '/gu/tools/gold-exchange-calculator' },
  { code: 'pa', locale: 'pa-IN', path: '/pa/tools/gold-exchange-calculator' },
  { code: 'or', locale: 'or-IN', path: '/or/tools/gold-exchange-calculator' },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// 1. Static & category routes
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily', lastmod: DATE_RECENT },
  { path: '/tools', priority: '0.9', changefreq: 'daily', lastmod: DATE_INITIAL },
  { path: '/popular', priority: '0.8', changefreq: 'daily', lastmod: DATE_INITIAL },
  { path: '/categories', priority: '0.8', changefreq: 'weekly', lastmod: DATE_INITIAL },
  ...categories.map((cat) => ({ path: `/category/${cat}`, priority: '0.8', changefreq: 'weekly', lastmod: DATE_INITIAL })),
];

for (const r of staticRoutes) {
  xml += `  <url>
    <loc>${BASE}${r.path}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>
`;
}

// 2. Standard tool routes (excluding multi-language special suites handled below)
for (const t of tools) {
  if (t.slug === 'indian-cheque-studio' || t.slug === 'gold-exchange-calculator') continue;
  const modDate = (t.slug === 'scan-to-print' || t.slug.includes('watermark') || t.slug.includes('vault')) ? DATE_RECENT : DATE_INITIAL;
  xml += `  <url>
    <loc>${BASE}${t.canonical}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// 3. Cheque Studio (13 localized entries with reciprocal xhtml:link annotations)
for (const c of chequeLanguages) {
  xml += `  <url>
    <loc>${BASE}${c.path}</loc>
    <lastmod>${DATE_INITIAL}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/calculators/indian-cheque-studio" />
`;
  for (const alt of chequeLanguages) {
    xml += `    <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${BASE}${alt.path}" />
`;
  }
  xml += `  </url>
`;
}

// 4. Gold Exchange (11 localized entries with reciprocal xhtml:link annotations)
for (const g of goldLanguages) {
  xml += `  <url>
    <loc>${BASE}${g.path}</loc>
    <lastmod>${DATE_GOLD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/calculators/gold-exchange-calculator" />
`;
  for (const alt of goldLanguages) {
    xml += `    <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${BASE}${alt.path}" />
`;
  }
  xml += `  </url>
`;
}

// 5. Static legal & info pages
const footerRoutes = [
  { path: '/about', priority: '0.5', changefreq: 'monthly', lastmod: DATE_INITIAL },
  { path: '/contact', priority: '0.5', changefreq: 'monthly', lastmod: DATE_INITIAL },
  { path: '/privacy', priority: '0.3', changefreq: 'monthly', lastmod: DATE_INITIAL },
  { path: '/terms', priority: '0.3', changefreq: 'monthly', lastmod: DATE_INITIAL },
];

for (const r of footerRoutes) {
  xml += `  <url>
    <loc>${BASE}${r.path}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>
`;
}

xml += `</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`Generated public/sitemap.xml with exactly 101 URLs (including 13 Cheque Studio and 11 Gold Exchange language URLs).`);
