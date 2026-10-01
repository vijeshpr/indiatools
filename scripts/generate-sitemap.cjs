const fs = require('fs');
const path = require('path');

// Read tools and categories from tools.ts
const toolsFile = fs.readFileSync('src/data/tools.ts', 'utf8');

// Extract categories
const catMatch = toolsFile.match(/export const CATEGORIES:\s*Record<[^>]+,\s*CategoryInfo>\s*=\s*\{([\s\S]*?)\n\}/);
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

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/tools', priority: '0.9', changefreq: 'daily' },
  { path: '/popular', priority: '0.8', changefreq: 'daily' },
  { path: '/categories', priority: '0.8', changefreq: 'weekly' },
  ...categories.map(cat => ({ path: `/category/${cat}`, priority: '0.8', changefreq: 'weekly' })),
  ...tools.map(t => ({ path: t.canonical, priority: '0.8', changefreq: 'weekly' })),
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const r of staticRoutes) {
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
console.log(`Generated public/sitemap.xml with ${staticRoutes.length} real public routes.`);
