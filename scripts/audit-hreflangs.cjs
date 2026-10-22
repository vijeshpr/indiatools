const fs = require('fs');

const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const locMatches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const locSet = new Set(locMatches);

const hrefMatches = [...xml.matchAll(/href="([^">]+)"/g)].map(m => m[1]);
const uniqueHrefs = [...new Set(hrefMatches)];

const missingLocs = uniqueHrefs.filter(h => !locSet.has(h));

console.log('Total <loc> entries in sitemap.xml:', locMatches.length);
console.log('Total unique hreflang hrefs in sitemap.xml:', uniqueHrefs.length);
console.log('Hreflangs pointing to missing <loc> entries (' + missingLocs.length + '):');
missingLocs.forEach(h => console.log('  ❌ ' + h));
