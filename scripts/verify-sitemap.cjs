const fs = require('fs');

const xml = fs.readFileSync('public/sitemap.xml', 'utf8');

// XML Declaration
const hasXmlDecl = xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>');
console.log('XML Declaration valid:', hasXmlDecl);

// Root urlset tag
const hasUrlsetOpen = xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
const hasUrlsetClose = xml.trim().endsWith('</urlset>');
console.log('Root urlset valid:', hasUrlsetOpen && hasUrlsetClose);

// Tag matching
const openUrl = (xml.match(/<url>/g) || []).length;
const closeUrl = (xml.match(/<\/url>/g) || []).length;
console.log('Tags count: <url> =', openUrl, ', </url> =', closeUrl);

const openLoc = (xml.match(/<loc>/g) || []).length;
const closeLoc = (xml.match(/<\/loc>/g) || []).length;
console.log('Tags count: <loc> =', openLoc, ', </loc> =', closeLoc);

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log('Total URLs indexed:', locs.length);

// Check for any placeholder, localhost or invalid domains
const nonProd = locs.filter(u => !u.startsWith('https://indiatools-rho.vercel.app/'));
console.log('Non-production URLs:', nonProd.length);

// Check duplicates
const duplicates = locs.filter((item, index) => locs.indexOf(item) !== index);
console.log('Duplicate URLs:', duplicates.length);

// Check trailing slashes
const invalidSlashes = locs.filter(u => u !== 'https://indiatools-rho.vercel.app/' && u.endsWith('/'));
console.log('Invalid trailing slashes:', invalidSlashes.length);

// Check lastmod format (YYYY-MM-DD)
const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]);
const invalidDates = lastmods.filter(d => !/^\d{4}-\d{2}-\d{2}$/.test(d));
console.log('Invalid lastmod dates:', invalidDates.length);

// Check alternate links
const alternates = [...xml.matchAll(/<xhtml:link([^>]+)\/>/g)];
console.log('Total xhtml:link alternate tags:', alternates.length);

if (hasXmlDecl && hasUrlsetOpen && hasUrlsetClose && openUrl === closeUrl && openLoc === closeLoc && nonProd.length === 0 && duplicates.length === 0 && invalidDates.length === 0) {
  console.log('\n✅ SITEMAP VERIFICATION: 100% VALID & ERROR FREE!');
} else {
  console.error('\n❌ SITEMAP VERIFICATION FAILED');
  process.exit(1);
}
