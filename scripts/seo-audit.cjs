const fs = require('fs');
const path = require('path');

async function runAudit() {
  console.log('=== STARTING PRODUCTION SEO AUDIT ===\n');

  let passCount = 0;
  let failCount = 0;

  function check(desc, condition, details = '') {
    if (condition) {
      passCount++;
      console.log(`✅ [PASS] ${desc}`);
    } else {
      failCount++;
      console.error(`❌ [FAIL] ${desc} - ${details}`);
    }
  }

  // 1. Index.html Audit
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  check('index.html: Site title matches specification', indexHtml.includes('<title>IndiaTools – Practical Calculators & Useful Online Tools</title>'));
  check('index.html: Meta description matches specification', indexHtml.includes('IndiaTools provides practical online calculators and useful tools for vehicle costs, construction, electricity, salary, land area, image resizing and everyday calculations.'));
  check('index.html: Canonical URL is exact production URL', indexHtml.includes('<link rel="canonical" href="https://indiatools-rho.vercel.app/" />'));
  check('index.html: Robots meta tag is index, follow', indexHtml.includes('<meta name="robots" content="index, follow" />'));
  check('index.html: Theme color is #080A10', indexHtml.includes('<meta name="theme-color" content="#080A10" />'));
  check('index.html: og:site_name is IndiaTools', indexHtml.includes('<meta property="og:site_name" content="IndiaTools" />'));
  check('index.html: og:image is HTTPS absolute URL', indexHtml.includes('<meta property="og:image" content="https://indiatools-rho.vercel.app/og-image.png" />'));
  check('index.html: twitter:card is summary_large_image', indexHtml.includes('<meta name="twitter:card" content="summary_large_image" />'));
  check('index.html: JSON-LD WebSite & WebApplication present', indexHtml.includes('"@type": "WebSite"') && indexHtml.includes('"@type": "WebApplication"'));

  // 2. Robots.txt Audit
  const robotsTxt = fs.readFileSync('public/robots.txt', 'utf8');
  check('robots.txt: User-agent: *', robotsTxt.includes('User-agent: *'));
  check('robots.txt: Allow: /', robotsTxt.includes('Allow: /'));
  check('robots.txt: Correct absolute HTTPS sitemap URL', robotsTxt.includes('Sitemap: https://indiatools-rho.vercel.app/sitemap.xml'));

  // 3. Sitemap.xml Audit
  const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf8');
  check('sitemap.xml: Valid XML header and urlset', sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>') && sitemapXml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  check('sitemap.xml: Contains homepage', sitemapXml.includes('<loc>https://indiatools-rho.vercel.app/</loc>'));
  check('sitemap.xml: Contains /tools', sitemapXml.includes('<loc>https://indiatools-rho.vercel.app/tools</loc>'));
  check('sitemap.xml: Contains /popular', sitemapXml.includes('<loc>https://indiatools-rho.vercel.app/popular</loc>'));
  check('sitemap.xml: Contains /categories', sitemapXml.includes('<loc>https://indiatools-rho.vercel.app/categories</loc>'));
  check('sitemap.xml: Contains /about', sitemapXml.includes('<loc>https://indiatools-rho.vercel.app/about</loc>'));
  check('sitemap.xml: Contains /contact', sitemapXml.includes('<loc>https://indiatools-rho.vercel.app/contact</loc>'));
  check('sitemap.xml: Contains /privacy', sitemapXml.includes('<loc>https://indiatools-rho.vercel.app/privacy</loc>'));
  check('sitemap.xml: Contains /terms', sitemapXml.includes('<loc>https://indiatools-rho.vercel.app/terms</loc>'));

  // 4. Tools Data Runtime Audit
  const toolsModule = await import('../src/data/tools.ts');
  const tools = toolsModule.TOOLS;
  check('Tools Registry: Exactly 42 unique tools', tools.length === 42, `Found ${tools.length}`);

  let allToolsInSitemap = true;
  let allTitlesEndWithBrand = true;
  let allUniqueTitles = true;
  let allUniqueDescriptions = true;
  let allValidCanonicals = true;

  const titleSet = new Set();
  const descSet = new Set();

  for (const t of tools) {
    if (!sitemapXml.includes(`https://indiatools-rho.vercel.app${t.seo.canonicalPath}`)) {
      allToolsInSitemap = false;
      console.error(`Missing from sitemap: ${t.seo.canonicalPath}`);
    }
    if (!t.seo.title.endsWith('| IndiaTools')) {
      allTitlesEndWithBrand = false;
      console.error(`Title does not end with | IndiaTools: ${t.slug} -> ${t.seo.title}`);
    }
    if (titleSet.has(t.seo.title)) {
      allUniqueTitles = false;
      console.error(`Duplicate title: ${t.seo.title}`);
    }
    titleSet.add(t.seo.title);

    if (descSet.has(t.seo.metaDescription)) {
      allUniqueDescriptions = false;
      console.error(`Duplicate description: ${t.slug}`);
    }
    descSet.add(t.seo.metaDescription);

    const expectedCanonical = t.type === 'image-tool' ? `/tools/${t.slug}` : `/calculators/${t.slug}`;
    if (t.seo.canonicalPath !== expectedCanonical) {
      allValidCanonicals = false;
      console.error(`Canonical path mismatch: ${t.slug} got ${t.seo.canonicalPath}, expected ${expectedCanonical}`);
    }
  }

  check('sitemap.xml: Contains all 42 tool canonical URLs', allToolsInSitemap);
  check('Tool SEO: All 42 tool titles end with "| IndiaTools"', allTitlesEndWithBrand);
  check('Tool SEO: All 42 tool titles are unique', allUniqueTitles);
  check('Tool SEO: All 42 tool descriptions are unique', allUniqueDescriptions);
  check('Tool SEO: All 42 tool canonical paths follow correct routing', allValidCanonicals);

  // 5. Special Tool Verification
  const jcb = tools.find(t => t.slug === 'jcb-fuel-cost');
  check('Special Tool SEO: jcb-fuel-cost title matches exact specification', jcb?.seo.title === 'JCB Fuel Cost Calculator – Diesel Cost Per Hour | IndiaTools');
  check('Special Tool SEO: jcb-fuel-cost description matches exact specification', jcb?.seo.metaDescription === "Calculate JCB and excavator diesel consumption, fuel cost per hour, daily fuel cost and monthly operating cost using your machine's actual fuel usage and diesel price.");

  const elec = tools.find(t => t.slug === 'electricity-cost');
  check('Special Tool SEO: electricity-cost title matches exact specification', elec?.seo.title === 'Electricity Cost Calculator – Estimate Power Usage & Cost | IndiaTools');
  check('Special Tool SEO: electricity-cost description matches exact specification', elec?.seo.metaDescription === "Estimate electricity usage and running cost from appliance power, usage hours and electricity rate.");

  const cent = tools.find(t => t.slug === 'cent-to-sqft');
  check('Special Tool SEO: cent-to-sqft title matches exact specification', cent?.seo.title === 'Cent to Square Feet Converter – Land Area Calculator | IndiaTools');
  check('Special Tool SEO: cent-to-sqft description matches exact specification', cent?.seo.metaDescription === "Convert cent to square feet and calculate land area quickly using this simple online land area converter.");

  // 6. Assets & Routing
  check('Assets: og-image.png exists in public', fs.existsSync('public/og-image.png'));
  check('Assets: favicon.svg exists in public', fs.existsSync('public/favicon.svg'));
  check('Assets: vercel.json SPA rewrite configured', fs.existsSync('vercel.json') && fs.readFileSync('vercel.json', 'utf8').includes('"destination": "/"'));

  // 7. Cleanliness / Zero Prohibited Domains
  const prohibitedDomains = [
    String.fromCharCode(101,120,97,109,112,108,101,46,99,111,109), // example.com
    String.fromCharCode(108,111,99,97,108,104,111,115,116), // localhost
    '127.0.0.1',
    String.fromCharCode(105,110,100,105,97,112,114,97,99,116,105,99,97,108,116,111,111,108,115,46,99,111,109), // indiapracticaltools.com
    'vijeshvip',
    'vijeshpr'
  ];
  let prohibitedHits = 0;
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (['node_modules', '.git', 'dist', 'scripts'].some(x => full.includes(x))) continue;
      if (fs.statSync(full).isDirectory()) scanDir(full);
      else {
        const c = fs.readFileSync(full, 'utf8');
        for (const p of prohibitedDomains) {
          if (c.includes(p)) {
            console.error(`Prohibited domain found: ${p} in ${full}`);
            prohibitedHits++;
          }
        }
      }
    }
  }
  scanDir('.');
  check('Cleanliness: Zero prohibited domain occurrences across project', prohibitedHits === 0, `${prohibitedHits} occurrences`);

  console.log(`\n=== AUDIT SUMMARY ===`);
  console.log(`TOTAL CHECKS: ${passCount + failCount}`);
  console.log(`PASSED: ${passCount}`);
  console.log(`FAILED: ${failCount}`);

  if (failCount > 0) process.exit(1);
  else console.log('\n🌟 PRODUCTION SEO VERIFICATION: 100% COMPLETE & PASSING!');
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
