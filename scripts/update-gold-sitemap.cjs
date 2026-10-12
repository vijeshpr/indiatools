const fs = require('fs');

const locales = [
  { code: 'en', bcp: 'en-IN', path: '/calculators/gold-exchange-calculator' },
  { code: 'ml', bcp: 'ml-IN', path: '/ml/tools/gold-exchange-calculator' },
  { code: 'hi', bcp: 'hi-IN', path: '/hi/tools/gold-exchange-calculator' },
  { code: 'ta', bcp: 'ta-IN', path: '/ta/tools/gold-exchange-calculator' },
  { code: 'te', bcp: 'te-IN', path: '/te/tools/gold-exchange-calculator' },
  { code: 'kn', bcp: 'kn-IN', path: '/kn/tools/gold-exchange-calculator' },
  { code: 'bn', bcp: 'bn-IN', path: '/bn/tools/gold-exchange-calculator' },
  { code: 'mr', bcp: 'mr-IN', path: '/mr/tools/gold-exchange-calculator' },
  { code: 'gu', bcp: 'gu-IN', path: '/gu/tools/gold-exchange-calculator' },
  { code: 'pa', bcp: 'pa-IN', path: '/pa/tools/gold-exchange-calculator' },
  { code: 'or', bcp: 'or-IN', path: '/or/tools/gold-exchange-calculator' }
];

const BASE = 'https://indiatools-rho.vercel.app';
let xml = '';
for (const loc of locales) {
  xml += '  <url>\n';
  xml += `    <loc>${BASE}${loc.path}</loc>\n`;
  xml += '    <lastmod>2026-10-12</lastmod>\n';
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.9</priority>\n';
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/calculators/gold-exchange-calculator" />\n`;
  for (const alt of locales) {
    xml += `    <xhtml:link rel="alternate" hreflang="${alt.bcp}" href="${BASE}${alt.path}" />\n`;
  }
  xml += '  </url>\n';
}

// Restore clean git version of sitemap before running snippet
const { execSync } = require('child_process');
execSync('git checkout HEAD -- public/sitemap.xml');

let sitemap = fs.readFileSync('public/sitemap.xml', 'utf8').replace(/\r\n/g, '\n');
const target = '  <url>\n    <loc>https://indiatools-rho.vercel.app/about</loc>';
if (sitemap.includes(target)) {
  sitemap = sitemap.replace(target, xml + target);
  fs.writeFileSync('public/sitemap.xml', sitemap, 'utf8');
  console.log('Successfully updated sitemap.xml with accurate /calculators/gold-exchange-calculator canonical.');
} else {
  console.error('Target not found in sitemap.xml');
}
