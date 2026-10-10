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
const today = new Date().toISOString().split('T')[0];

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

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Static & category routes
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/tools', priority: '0.9', changefreq: 'daily' },
  { path: '/popular', priority: '0.8', changefreq: 'daily' },
  { path: '/categories', priority: '0.8', changefreq: 'weekly' },
  ...categories.map(cat => ({ path: `/category/${cat}`, priority: '0.8', changefreq: 'weekly' })),
];

for (const r of staticRoutes) {
  xml += `  <url>
    <loc>${BASE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>
`;
}

// Tool routes (excluding indian-cheque-studio which has multilingual hreflangs)
for (const t of tools) {
  if (t.slug === 'indian-cheque-studio') continue;
  xml += `  <url>
    <loc>${BASE}${t.canonical}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// All 13 Cheque Studio localized entries with reciprocal xhtml:link annotations
for (const c of chequeLanguages) {
  xml += `  <url>
    <loc>${BASE}${c.path}</loc>
    <lastmod>${today}</lastmod>
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

// Remaining static legal & info pages
const footerRoutes = [
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
];

for (const r of footerRoutes) {
  xml += `  <url>
    <loc>${BASE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>
`;
}

xml += `</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`Generated public/sitemap.xml with all 13 Cheque Studio language URLs & reciprocal hreflangs.`);
