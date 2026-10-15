const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const BASE_URL = 'https://indiatools-rho.vercel.app';

function loadTs(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const js = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const m = { exports: {} };
  const fn = new Function('module', 'exports', 'require', js);
  fn(m, m.exports, (mod) => {
    if (mod.endsWith('.ts') || mod.startsWith('.')) {
      const resolved = path.resolve(path.dirname(filePath), mod.endsWith('.ts') ? mod : mod + '.ts');
      return loadTs(resolved);
    }
    return require(mod);
  });
  return m.exports;
}

console.log('Loading datasets for static prerendering...');
const toolsMod = loadTs('src/data/tools.ts');
const chequeMod = loadTs('src/data/chequeSeoData.ts');
const goldMod = loadTs('src/i18n/goldToolI18n.ts');
const friendshipMod = loadTs('src/i18n/friendshipCostI18n.ts');
const repairMod = loadTs('src/i18n/repairVsReplaceI18n.ts');

const TOOLS = toolsMod.TOOLS;
const CATEGORIES = toolsMod.CATEGORIES;
const CHEQUE_SEO_LANGUAGES = chequeMod.CHEQUE_SEO_LANGUAGES;
const GOLD_TOOL_I18N = goldMod.GOLD_TOOL_I18N;
const FRIENDSHIP_TOOL_I18N = friendshipMod.FRIENDSHIP_TOOL_I18N;
const FRIENDSHIP_LOCALES = friendshipMod.FRIENDSHIP_LOCALES;
const REPAIR_TOOL_I18N = repairMod.REPAIR_TOOL_I18N;
const REPAIR_LOCALES = repairMod.REPAIR_LOCALES;

const templatePath = path.join('dist', 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('Error: dist/index.html not found. Run "vite build" first.');
  process.exit(1);
}
const baseTemplate = fs.readFileSync(templatePath, 'utf8');

const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log(`Found ${sitemapUrls.length} production URLs in sitemap.xml to prerender.`);

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderHeader() {
  return `
    <header style="background: rgba(16, 39, 28, 0.95); border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding: 12px 20px; position: sticky; top: 0; z-index: 50;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <a href="/" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: #F3F0E5; font-weight: 800; font-size: 1.15rem;">
          <span style="background: linear-gradient(135deg, #16865D, #07130E); color: #F3F0E5; padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(16,185,129,0.3);">IT</span>
          <span>India<span style="color: #D8B879;">Tools</span></span>
        </a>
        <nav style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; font-size: 0.85rem; font-weight: 600;">
          <a href="/" style="color: #A8C5AC; text-decoration: none;">Home</a>
          <a href="/tools" style="color: #D8B879; text-decoration: none;">All Tools (64)</a>
          <a href="/popular" style="color: #A8C5AC; text-decoration: none;">Popular</a>
          <a href="/categories" style="color: #A8C5AC; text-decoration: none;">Categories</a>
          <a href="/about" style="color: #A8C5AC; text-decoration: none;">About</a>
          <a href="/privacy" style="color: #A8C5AC; text-decoration: none;">Privacy</a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer style="background: #07130E; border-top: 1px solid rgba(16, 185, 129, 0.2); color: #A8C5AC; padding: 40px 20px; font-size: 0.85rem; margin-top: 60px;">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 30px;">
        <div>
          <h4 style="color: #F3F0E5; font-size: 1rem; margin-bottom: 12px; font-weight: 800;">India<span style="color: #D8B879;">Tools</span></h4>
          <p style="line-height: 1.6; font-size: 0.8rem;">Everyday calculators and utilities calibrated for Indian realities. 100% private in-browser computation with zero cloud tracking.</p>
        </div>
        <div>
          <h5 style="color: #D8B879; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 12px; font-weight: 700;">Calculator Sectors</h5>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            <li><a href="/category/drive" style="color: #A8C5AC; text-decoration: none;">🚗 Vehicle Mileage & Fuel</a></li>
            <li><a href="/category/build" style="color: #A8C5AC; text-decoration: none;">🏗️ Civil Construction & Concrete</a></li>
            <li><a href="/category/power" style="color: #A8C5AC; text-decoration: none;">⚡ Electricity & Solar Power</a></li>
            <li><a href="/category/money" style="color: #A8C5AC; text-decoration: none;">💰 Salary, Tax & Finance</a></li>
            <li><a href="/category/land" style="color: #A8C5AC; text-decoration: none;">📐 Land Area & Cent Converter</a></li>
            <li><a href="/category/work" style="color: #A8C5AC; text-decoration: none;">💼 Career & Experience</a></li>
            <li><a href="/category/create" style="color: #A8C5AC; text-decoration: none;">🎨 50KB Photo & Document Studio</a></li>
          </ul>
        </div>
        <div>
          <h5 style="color: #D8B879; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 12px; font-weight: 700;">Popular Tools</h5>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            <li><a href="/calculators/vehicle-mileage" style="color: #A8C5AC; text-decoration: none;">Vehicle Mileage Calculator</a></li>
            <li><a href="/calculators/cent-to-sqft" style="color: #A8C5AC; text-decoration: none;">Cent to Sq.ft Converter</a></li>
            <li><a href="/calculators/jcb-fuel-cost" style="color: #A8C5AC; text-decoration: none;">JCB Fuel Cost Calculator</a></li>
            <li><a href="/calculators/electricity-cost" style="color: #A8C5AC; text-decoration: none;">Electricity Bill Calculator</a></li>
            <li><a href="/tools/50kb-photo" style="color: #A8C5AC; text-decoration: none;">50KB Photo Resizer for SSC/UPSC</a></li>
            <li><a href="/calculators/indian-cheque-studio" style="color: #A8C5AC; text-decoration: none;">Indian Cheque Studio (13 Lang)</a></li>
          </ul>
        </div>
        <div>
          <h5 style="color: #D8B879; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 12px; font-weight: 700;">Platform & Legal</h5>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
            <li><a href="/about" style="color: #A8C5AC; text-decoration: none;">About IndiaTools</a></li>
            <li><a href="/privacy" style="color: #A8C5AC; text-decoration: none;">Privacy Policy</a></li>
            <li><a href="/terms" style="color: #A8C5AC; text-decoration: none;">Terms of Service</a></li>
            <li><a href="/contact" style="color: #A8C5AC; text-decoration: none;">Contact & Feedback</a></li>
          </ul>
        </div>
      </div>
      <div style="max-width: 1200px; margin: 30px auto 0; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; font-size: 0.75rem;">
        © ${new Date().getFullYear()} IndiaTools. Precision tools for everyday Indian calculations.
      </div>
    </footer>
  `;
}

function generatePageHtml(meta, bodyContent, jsonLd, hreflangs = []) {
  let html = baseTemplate;

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);

  // Replace Meta Description
  html = html.replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="${escapeHtml(meta.description)}" />`);

  // Replace Canonical
  html = html.replace(/<link rel="canonical" href="[\s\S]*?" \/>/, `<link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`);

  // Replace OpenGraph
  html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  html = html.replace(/<meta property="og:url" content="[\s\S]*?" \/>/, `<meta property="og:url" content="${escapeHtml(meta.canonicalUrl)}" />`);

  // Replace Twitter
  html = html.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);

  // Replace or inject JSON-LD
  if (jsonLd) {
    const jsonLdString = JSON.stringify(jsonLd, null, 2);
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${jsonLdString}\n    </script>`);
  }

  // Inject hreflangs if present
  if (hreflangs.length > 0) {
    const hreflangTags = hreflangs.map(h => `<link rel="alternate" hreflang="${escapeHtml(h.lang)}" href="${escapeHtml(h.href)}" data-seo-hreflang="true" />`).join('\n    ');
    html = html.replace('<!-- Canonical URL -->', `<!-- Canonical & Hreflangs -->\n    ${hreflangTags}`);
  }

  // Inject Pre-rendered semantic HTML inside <div id="root">
  const fullBody = `
    ${renderHeader()}
    <div style="min-height: 80vh; max-width: 1100px; margin: 0 auto; padding: 24px 16px;">
      ${bodyContent}
    </div>
    ${renderFooter()}
  `;

  html = html.replace('<div id="root"></div>', `<div id="root">${fullBody}</div>`);

  return html;
}

let prerenderedCount = 0;

for (const fullUrl of sitemapUrls) {
  const urlPath = fullUrl.replace(BASE_URL, '') || '/';
  let meta = {};
  let bodyContent = '';
  let jsonLd = null;
  let hreflangs = [];

  // 1. Homepage
  if (urlPath === '/') {
    meta = {
      title: 'IndiaTools – Practical Calculators & Useful Online Tools',
      description: 'IndiaTools provides practical online calculators and useful tools for vehicle costs, construction, electricity, salary, land area, image resizing and everyday calculations.',
      canonicalUrl: `${BASE_URL}/`
    };
    bodyContent = `
      <section style="text-align: center; padding: 40px 10px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #10B981; background: #0D2418; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(16,185,129,0.3);">THE PRACTICAL ONLINE TOOLBOX</span>
        <h1 style="font-size: 2.5rem; font-weight: 900; color: #FFFFFF; margin: 16px 0 10px;">Practical Calculators for Real-Life Indian Problems</h1>
        <p style="font-size: 1.1rem; color: #CBD5E1; max-width: 750px; margin: 0 auto 30px; line-height: 1.6;">Automotive mileage, civil construction material estimators, DISCOM electricity slabs, salary take-home calculators, and 100% private in-browser document utilities.</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="/tools" style="background: #10B981; color: #041009; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 12px;">Explore All 65 Tools</a>
          <a href="/popular" style="background: #1E293B; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 12px; border: 1px solid #334155;">Popular Calculators</a>
        </div>
      </section>

      <section style="margin-top: 40px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 20px;">Browse Tools by Category</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          ${Object.values(CATEGORIES).map(cat => `
            <div style="background: #0E261B; border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 16px; padding: 20px;">
              <h3 style="font-size: 1.2rem; color: #FFFFFF; margin-bottom: 8px;">
                <a href="/category/${cat.id}" style="color: #FFFFFF; text-decoration: none;">${escapeHtml(cat.title)}</a>
              </h3>
              <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.5; margin-bottom: 14px;">${escapeHtml(cat.description)}</p>
              <a href="/category/${cat.id}" style="color: #D8B879; font-weight: 700; font-size: 0.85rem; text-decoration: none;">View ${escapeHtml(cat.title)} Tools →</a>
            </div>
          `).join('')}
        </div>
      </section>

      <section style="margin-top: 50px;">
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 20px;">Flagship Everyday Indian Calculators</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          ${TOOLS.slice(0, 12).map(tool => `
            <div style="background: #0A1E15; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 18px;">
              <h3 style="font-size: 1.1rem; color: #FFFFFF; margin-bottom: 6px;">
                <a href="${tool.seo.canonicalPath}" style="color: #FFFFFF; text-decoration: none;">${escapeHtml(tool.title)}</a>
              </h3>
              <p style="font-size: 0.8rem; color: #94A3B8; line-height: 1.5; margin-bottom: 12px;">${escapeHtml(tool.description)}</p>
              <a href="${tool.seo.canonicalPath}" style="color: #10B981; font-weight: 700; font-size: 0.8rem; text-decoration: none;">Launch Calculator →</a>
            </div>
          `).join('')}
        </div>
      </section>
    `;
    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://indiatools-rho.vercel.app/#website",
          "url": "https://indiatools-rho.vercel.app/",
          "name": "IndiaTools",
          "description": "Real-life problems. One simple toolbox.",
          "inLanguage": "en"
        },
        {
          "@type": "WebApplication",
          "@id": "https://indiatools-rho.vercel.app/#webapp",
          "url": "https://indiatools-rho.vercel.app/",
          "name": "IndiaTools",
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        }
      ]
    };
  }

  // 2. Static catalog pages
  else if (urlPath === '/tools' || urlPath === '/popular') {
    const isPopular = urlPath === '/popular';
    const displayedTools = isPopular
      ? TOOLS.filter(t => ['Popular', 'Flagship', 'Govt Exam Special', 'Essential'].includes(t.badge || ''))
      : TOOLS;
    meta = {
      title: isPopular ? 'Popular Tools & Calculators | IndiaTools' : 'All Tools & Calculators – Free Online Toolbox | IndiaTools',
      description: isPopular
        ? 'Discover the most popular Indian online calculators and image tools for vehicle mileage, JCB fuel, 50KB photos, and electricity bills.'
        : 'Browse all 65 practical online calculators and tools for vehicle costs, civil construction, power bills, salary tax, and image compression.',
      canonicalUrl: `${BASE_URL}${urlPath}`
    };
    bodyContent = `
      <section style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin-bottom: 10px;">${isPopular ? 'Popular Indian Tools' : 'All Tools & Calculators'}</h1>
        <p style="color: #94A3B8; max-width: 700px; margin: 0 auto;">Browse all ${displayedTools.length} precision utilities calibrated for everyday automotive, civil construction, electricity, and document workflows.</p>
      </section>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
        ${displayedTools.map(tool => `
          <div style="background: #0E261B; border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 20px;">
            <span style="font-size: 0.7rem; font-weight: 700; color: #10B981; text-transform: uppercase;">${escapeHtml(tool.categoryLabel)}</span>
            <h3 style="font-size: 1.15rem; color: #FFFFFF; margin: 6px 0 8px;">
              <a href="${tool.seo.canonicalPath}" style="color: #FFFFFF; text-decoration: none;">${escapeHtml(tool.title)}</a>
            </h3>
            <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.5; margin-bottom: 14px;">${escapeHtml(tool.description)}</p>
            <a href="${tool.seo.canonicalPath}" style="color: #D8B879; font-weight: 700; font-size: 0.85rem; text-decoration: none;">Use Tool →</a>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 3. Categories Overview
  else if (urlPath === '/categories') {
    meta = {
      title: 'Tool Categories – Browse Utilities by Sector | IndiaTools',
      description: 'Explore practical tools categorized by Drive, Build, Power, Money, Land, Work, and Create. Designed for real-world Indian applications.',
      canonicalUrl: `${BASE_URL}/categories`
    };
    bodyContent = `
      <section style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin-bottom: 10px;">Tool Categories</h1>
        <p style="color: #94A3B8; max-width: 700px; margin: 0 auto;">Find purpose-built tools organized across vehicles, construction, power, finance, land, career, and documents.</p>
      </section>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        ${Object.values(CATEGORIES).map(cat => {
          const catTools = TOOLS.filter(t => t.category === cat.id);
          return `
            <div style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 20px; padding: 24px;">
              <h2 style="font-size: 1.4rem; color: #FFFFFF; margin-bottom: 8px;">
                <a href="/category/${cat.id}" style="color: #FFFFFF; text-decoration: none;">${escapeHtml(cat.title)}</a>
              </h2>
              <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.5; margin-bottom: 16px;">${escapeHtml(cat.description)}</p>
              <h4 style="font-size: 0.75rem; text-transform: uppercase; color: #D8B879; font-weight: 700; margin-bottom: 10px;">Featured Tools:</h4>
              <ul style="list-style: none; padding: 0; margin: 0 0 16px 0; line-height: 1.8; font-size: 0.85rem;">
                ${catTools.slice(0, 4).map(t => `
                  <li><a href="${t.seo.canonicalPath}" style="color: #A8C5AC; text-decoration: none;">• ${escapeHtml(t.title)}</a></li>
                `).join('')}
              </ul>
              <a href="/category/${cat.id}" style="color: #10B981; font-weight: 700; font-size: 0.85rem; text-decoration: none;">View All ${catTools.length} Tools in ${escapeHtml(cat.title)} →</a>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 4. Category Pages
  else if (urlPath.startsWith('/category/')) {
    const catId = urlPath.replace('/category/', '');
    const cat = CATEGORIES[catId];
    if (!cat) continue;
    const catTools = TOOLS.filter(t => t.category === catId);
    meta = {
      title: `${cat.title} Tools & Calculators (${cat.subtitle}) | IndiaTools`,
      description: cat.description || `Browse ${cat.title} tools and calculators on IndiaTools.`,
      canonicalUrl: `${BASE_URL}/category/${catId}`
    };
    bodyContent = `
      <div style="margin-bottom: 20px;">
        <a href="/tools" style="color: #94A3B8; text-decoration: none; font-size: 0.85rem;">← Back to All Tools</a>
      </div>
      <section style="background: #0E261B; border: 1px solid rgba(16,185,129,0.3); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
        <span style="font-size: 0.75rem; font-weight: 700; color: #D8B879; text-transform: uppercase;">CATEGORY DIRECTORY</span>
        <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin: 8px 0;">${escapeHtml(cat.title)}</h1>
        <p style="font-size: 1rem; color: #CBD5E1; line-height: 1.6; max-width: 800px;">${escapeHtml(cat.description)}</p>
      </section>
      <h2 style="font-size: 1.3rem; color: #FFFFFF; font-weight: 800; margin-bottom: 18px;">All Tools in ${escapeHtml(cat.title)} (${catTools.length})</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
        ${catTools.map(tool => `
          <div style="background: #0A1E15; border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 20px;">
            <h3 style="font-size: 1.15rem; color: #FFFFFF; margin: 0 0 8px 0;">
              <a href="${tool.seo.canonicalPath}" style="color: #FFFFFF; text-decoration: none;">${escapeHtml(tool.title)}</a>
            </h3>
            <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.5; margin-bottom: 14px;">${escapeHtml(tool.description)}</p>
            <a href="${tool.seo.canonicalPath}" style="color: #10B981; font-weight: 700; font-size: 0.85rem; text-decoration: none;">Launch Tool →</a>
          </div>
        `).join('')}
      </div>
    `;
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${cat.title} Tools | IndiaTools`,
      description: cat.description,
      url: `${BASE_URL}/category/${catId}`,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: catTools.map((t, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: t.title,
          url: `${BASE_URL}${t.seo.canonicalPath}`
        }))
      }
    };
  }

  // 5. About Page
  else if (urlPath === '/about') {
    meta = {
      title: 'About IndiaTools – Purpose & Philosophy | IndiaTools',
      description: 'Learn about IndiaTools: our mission to provide practical, 100% private, client-side tools and accurate calculators calibrated for everyday Indian realities.',
      canonicalUrl: `${BASE_URL}/about`
    };
    bodyContent = `
      <section style="text-align: center; margin-bottom: 40px;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #10B981; background: #0D2418; padding: 4px 12px; border-radius: 999px;">OUR MISSION & PHILOSOPHY</span>
        <h1 style="font-size: 2.4rem; font-weight: 900; color: #FFFFFF; margin: 16px 0 10px;">Smart Tools for Real-Life Indian Calculations</h1>
        <p style="font-size: 1.1rem; color: #CBD5E1; max-width: 750px; margin: 0 auto; line-height: 1.6;">IndiaTools was built to replace cluttered, ad-ridden calculator websites with a fast, 100% private, mathematically calibrated utility platform.</p>
      </section>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
        <div style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 24px;">
          <h3 style="color: #D8B879; font-size: 1.15rem; margin-bottom: 8px;">Indian Benchmarks</h3>
          <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6;">Every formula is calibrated to Indian realities: from JCB 3DX diesel consumption to DISCOM telescopic electricity slabs and New Tax Regime rules.</p>
        </div>
        <div style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 24px;">
          <h3 style="color: #10B981; font-size: 1.15rem; margin-bottom: 8px;">100% Client-Side Privacy</h3>
          <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6;">Photos, signatures, CTC numbers, and calculations are computed locally in your browser using HTML5 Canvas and WASM. Zero cloud uploads.</p>
        </div>
        <div style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 24px;">
          <h3 style="color: #38BDF8; font-size: 1.15rem; margin-bottom: 8px;">100% Free Forever</h3>
          <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6;">No subscriptions, mandatory signups, paywalls, or hidden limitations. A high-quality public utility for students, contractors, and builders.</p>
        </div>
      </div>

      <section style="background: #0A1E15; border: 1px solid rgba(16,185,129,0.2); border-radius: 20px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #FFFFFF; font-size: 1.4rem; margin-bottom: 12px;">Explore Calculators by Sector</h2>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="/category/drive" style="background: #122E21; color: #D8B879; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-size: 0.85rem;">🚗 Vehicle & Fuel</a>
          <a href="/category/build" style="background: #122E21; color: #D8B879; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-size: 0.85rem;">🏗️ Civil Construction</a>
          <a href="/category/power" style="background: #122E21; color: #D8B879; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-size: 0.85rem;">⚡ Electricity & Solar</a>
          <a href="/category/money" style="background: #122E21; color: #D8B879; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-size: 0.85rem;">💰 Salary, Tax & Finance</a>
          <a href="/category/land" style="background: #122E21; color: #D8B879; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-size: 0.85rem;">📐 Land & Cent Converter</a>
          <a href="/category/work" style="background: #122E21; color: #D8B879; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-size: 0.85rem;">💼 Career & Experience</a>
          <a href="/category/create" style="background: #122E21; color: #D8B879; padding: 8px 16px; border-radius: 10px; text-decoration: none; font-size: 0.85rem;">🎨 50KB Photo & Document Studio</a>
        </div>
      </section>
      <div style="text-align: center; margin-top: 20px;">
        <a href="/tools" style="background: #10B981; color: #041009; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 12px; display: inline-block;">Explore All 65 Tools & Calculators →</a>
      </div>
    `;
  }

  // 6. Privacy Page
  else if (urlPath === '/privacy') {
    meta = {
      title: 'Privacy Policy – Zero Data Collection | IndiaTools',
      description: 'IndiaTools privacy policy: 100% client-side calculations, zero photo or document storage, no cookies, no tracking.',
      canonicalUrl: `${BASE_URL}/privacy`
    };
    bodyContent = `
      <section style="max-width: 800px; margin: 0 auto; color: #CBD5E1; line-height: 1.7;">
        <h1 style="color: #FFFFFF; font-size: 2.2rem; margin-bottom: 12px;">Privacy Policy</h1>
        <p style="color: #10B981; font-weight: 700; margin-bottom: 24px;">Zero Cloud Uploads • 100% In-Browser Computation • No Tracking</p>
        <p>At IndiaTools (accessible from https://indiatools-rho.vercel.app), we believe utility calculators and photo tools should respect user privacy completely.</p>
        <h3 style="color: #FFFFFF; margin: 20px 0 8px;">1. Client-Side Processing</h3>
        <p>All calculations (salary CTC, EMI, vehicle mileage, construction concrete) and all media tools (50KB photo resizer, signature resizer, background remover) operate strictly inside your device's web browser memory. Your files and data are never sent to external servers.</p>
        <h3 style="color: #FFFFFF; margin: 20px 0 8px;">2. Zero Analytics & No Selling of Personal Information</h3>
        <p>We do not require user accounts, email signups, phone numbers, or passwords to access any tool.</p>
        <p style="margin-top: 24px;"><a href="/tools" style="color: #D8B879; font-weight: 700;">← Return to Tools Catalog</a></p>
      </section>
    `;
  }

  // 7. Terms Page
  else if (urlPath === '/terms') {
    meta = {
      title: 'Terms of Service – Educational Utility | IndiaTools',
      description: 'Terms of service for IndiaTools calculators. Practical estimates for automotive, construction, power, and everyday calculations.',
      canonicalUrl: `${BASE_URL}/terms`
    };
    bodyContent = `
      <section style="max-width: 800px; margin: 0 auto; color: #CBD5E1; line-height: 1.7;">
        <h1 style="color: #FFFFFF; font-size: 2.2rem; margin-bottom: 12px;">Terms of Service</h1>
        <p style="color: #10B981; font-weight: 700; margin-bottom: 24px;">Free Educational Utilities for Everyday Indian Calculations</p>
        <p>By accessing IndiaTools, you agree to use our calculators and browser utilities for personal, educational, and preliminary estimation purposes.</p>
        <h3 style="color: #FFFFFF; margin: 20px 0 8px;">1. Calculation Accuracy Disclaimer</h3>
        <p>Our formulas follow standard Indian engineering practices (IS 456 for concrete, BIS 1172 for water requirements, NHAI toll guidelines, Central Motor Vehicle Rules). However, real-world conditions (traffic, site wastage, tariff changes) may vary. Users should consult certified professionals before financial or structural commitments.</p>
        <p style="margin-top: 24px;"><a href="/tools" style="color: #D8B879; font-weight: 700;">← Return to Tools Catalog</a></p>
      </section>
    `;
  }

  // 8. Contact Page
  else if (urlPath === '/contact') {
    meta = {
      title: 'Contact IndiaTools – Feedback & Corrections | IndiaTools',
      description: 'Get in touch with IndiaTools. Submit feedback, report calculation bugs, suggest new tools, or request state-specific additions.',
      canonicalUrl: `${BASE_URL}/contact`
    };
    bodyContent = `
      <section style="max-width: 800px; margin: 0 auto; color: #CBD5E1; line-height: 1.7;">
        <h1 style="color: #FFFFFF; font-size: 2.2rem; margin-bottom: 12px;">Contact & Feedback</h1>
        <p style="color: #10B981; font-weight: 700; margin-bottom: 24px;">Have a feature request, local tariff update, or calculation suggestion?</p>
        <p>IndiaTools is continuously refined to reflect real-world Indian benchmarks across states. If your state electricity DISCOM has revised tariff slabs or you need a specific regional land unit added, we welcome your feedback.</p>
        <div style="background: #0E261B; border: 1px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 20px; margin: 20px 0;">
          <p style="color: #FFFFFF; font-weight: 700; margin-bottom: 6px;">Open Source & Community Feedback:</p>
          <p style="font-size: 0.85rem; color: #94A3B8;">Submit feedback or report calculation corrections directly via our GitHub repository: <a href="https://github.com/vijeshpr/indiatools" style="color: #D8B879; text-decoration: underline;" target="_blank" rel="noopener noreferrer">github.com/vijeshpr/indiatools</a></p>
        </div>
        <p style="margin-top: 24px;"><a href="/tools" style="color: #D8B879; font-weight: 700;">← Return to Tools Catalog</a></p>
      </section>
    `;
  }

  // 9. Multilingual Cheque Studio localized routes
  else if (urlPath.startsWith('/calculators/indian-cheque-studio')) {
    const langMatch = urlPath.match(/\/calculators\/indian-cheque-studio(?:\/([a-z]{2}))?$/);
    const langKey = (langMatch && langMatch[1]) ? langMatch[1] : 'en';
    const chequeSeo = CHEQUE_SEO_LANGUAGES[langKey] || CHEQUE_SEO_LANGUAGES['en'];

    meta = {
      title: chequeSeo.title,
      description: chequeSeo.description,
      canonicalUrl: `${BASE_URL}${chequeSeo.slugPath}`
    };

    hreflangs = Object.values(CHEQUE_SEO_LANGUAGES).map(c => ({
      lang: c.localeCode,
      href: `${BASE_URL}${c.slugPath}`
    }));
    hreflangs.push({
      lang: 'x-default',
      href: `${BASE_URL}/calculators/indian-cheque-studio`
    });

    bodyContent = `
      <div style="margin-bottom: 16px;">
        <a href="/category/money" style="color: #94A3B8; text-decoration: none; font-size: 0.85rem;">← Finance & Banking Tools</a>
      </div>
      <article>
        <span style="font-size: 0.75rem; font-weight: 700; color: #10B981; text-transform: uppercase;">13 INDIAN LANGUAGES • ZERO INSTALL</span>
        <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin: 8px 0;">${escapeHtml(chequeSeo.h1)}</h1>
        <p style="font-size: 1rem; color: #CBD5E1; line-height: 1.6; max-width: 800px; margin-bottom: 24px;">${escapeHtml(chequeSeo.subtitle)}</p>

        <section style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; color: #FFFFFF; margin-bottom: 12px;">Step-by-Step Cheque Writing Guide</h2>
          <ol style="padding-left: 20px; color: #94A3B8; line-height: 1.8; font-size: 0.9rem;">
            ${(chequeSeo.guideSteps || []).map(step => `
              <li><strong style="color: #FFFFFF;">${escapeHtml(step.title)}:</strong> ${escapeHtml(step.instruction)} ${step.tip ? `<em style="color: #D8B879;">(Tip: ${escapeHtml(step.tip)})</em>` : ''}</li>
            `).join('')}
          </ol>
        </section>

        <section style="background: #0A1E15; border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; color: #FFFFFF; margin-bottom: 16px;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${(chequeSeo.faqs || []).map(faq => `
              <div>
                <h3 style="font-size: 1rem; color: #D8B879; margin: 0 0 6px 0;">${escapeHtml(faq.question)}</h3>
                <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6; margin: 0;">${escapeHtml(faq.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </article>
    `;

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: chequeSeo.h1,
          description: chequeSeo.description,
          url: `${BASE_URL}${chequeSeo.slugPath}`,
          applicationCategory: "UtilityApplication",
          operatingSystem: "All"
        },
        {
          "@type": "FAQPage",
          mainEntity: (chequeSeo.faqs || []).map(f => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer
            }
          }))
        }
      ]
    };
  }

  // 10. Multilingual Gold Exchange Calculator localized routes
  else if (urlPath.includes('gold-exchange-calculator')) {
    const langMatch = urlPath.match(/^\/([a-z]{2})\/tools\/gold-exchange-calculator/);
    const langKey = langMatch ? langMatch[1] : 'en';
    const goldContent = GOLD_TOOL_I18N[langKey] || GOLD_TOOL_I18N['en'];

    meta = {
      title: goldContent.title,
      description: goldContent.metaDescription,
      canonicalUrl: langKey === 'en' ? `${BASE_URL}/calculators/gold-exchange-calculator` : `${BASE_URL}/${langKey}/tools/gold-exchange-calculator`
    };

    hreflangs = Object.keys(GOLD_TOOL_I18N).map(code => ({
      lang: code === 'en' ? 'en' : code,
      href: code === 'en' ? `${BASE_URL}/calculators/gold-exchange-calculator` : `${BASE_URL}/${code}/tools/gold-exchange-calculator`
    }));
    hreflangs.push({
      lang: 'x-default',
      href: `${BASE_URL}/calculators/gold-exchange-calculator`
    });

    bodyContent = `
      <div style="margin-bottom: 16px;">
        <a href="/category/money" style="color: #94A3B8; text-decoration: none; font-size: 0.85rem;">← Finance & Jewellery Tools</a>
      </div>
      <article>
        <span style="font-size: 0.75rem; font-weight: 700; color: #10B981; text-transform: uppercase;">OLD GOLD EXCHANGE RATE ESTIMATOR</span>
        <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin: 8px 0;">${escapeHtml(goldContent.h1)}</h1>
        <p style="font-size: 1rem; color: #CBD5E1; line-height: 1.6; max-width: 800px; margin-bottom: 24px;">${escapeHtml(goldContent.subtitle)}</p>

        <section style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; color: #FFFFFF; margin-bottom: 12px;">Calculation Logic & Jeweller Deduction Formulas</h2>
          <p style="color: #94A3B8; line-height: 1.7; font-size: 0.9rem;">
            Net Gold Weight = Gross Weight - Stone Weight.<br>
            Pure Gold Value = Net Weight × (Old Purity ÷ 24) × 24K Gold Rate.<br>
            Exchange Value = Pure Gold Value × (1 - Melting/Testing Deduction%).<br>
            Net Payable = (New Jewellery Cost + Making Charges + Wastage + 3% GST) - Old Gold Exchange Value.
          </p>
        </section>

        <section style="background: #0A1E15; border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; color: #FFFFFF; margin-bottom: 16px;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${(goldContent.faqs || []).map(faq => `
              <div>
                <h3 style="font-size: 1rem; color: #D8B879; margin: 0 0 6px 0;">${escapeHtml(faq.question)}</h3>
                <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6; margin: 0;">${escapeHtml(faq.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </article>
    `;

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: goldContent.h1,
          description: goldContent.metaDescription,
          url: meta.canonicalUrl,
          applicationCategory: "UtilityApplication",
          operatingSystem: "All"
        },
        {
          "@type": "FAQPage",
          mainEntity: (goldContent.faqs || []).map(f => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer
            }
          }))
        }
      ]
    };
  }

  // 10b. Multilingual Friendship & Relationship Cost Calculator localized routes
  else if (urlPath.includes('friendship-relationship-cost')) {
    const langMatch = urlPath.match(/^\/([a-z]{2,3})\/calculators\/friendship-relationship-cost/);
    const langKey = langMatch ? langMatch[1] : 'en';
    const friendshipContent = FRIENDSHIP_TOOL_I18N[langKey] || FRIENDSHIP_TOOL_I18N['en'];

    meta = {
      title: friendshipContent.title,
      description: friendshipContent.metaDescription,
      canonicalUrl: langKey === 'en'
        ? `${BASE_URL}/calculators/friendship-relationship-cost`
        : `${BASE_URL}/${langKey}/calculators/friendship-relationship-cost`
    };

    hreflangs = Object.keys(FRIENDSHIP_TOOL_I18N).map(code => ({
      lang: FRIENDSHIP_LOCALES[code].bcp47,
      href: code === 'en'
        ? `${BASE_URL}/calculators/friendship-relationship-cost`
        : `${BASE_URL}/${code}/calculators/friendship-relationship-cost`
    }));
    hreflangs.push({
      lang: 'x-default',
      href: `${BASE_URL}/calculators/friendship-relationship-cost`
    });

    bodyContent = `
      <div style="margin-bottom: 16px;">
        <a href="/category/money" style="color: #94A3B8; text-decoration: none; font-size: 0.85rem;">← Finance & Relationship Tools</a>
      </div>
      <article dir="${friendshipContent.dir || 'ltr'}">
        <span style="font-size: 0.75rem; font-weight: 700; color: #10B981; text-transform: uppercase;">22 INDIAN LANGUAGES • CLIENT-SIDE PRIVACY</span>
        <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin: 8px 0;">${escapeHtml(friendshipContent.h1)}</h1>
        <p style="font-size: 1rem; color: #CBD5E1; line-height: 1.6; max-width: 800px; margin-bottom: 24px;">${escapeHtml(friendshipContent.subtitle)}</p>

        <section style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; color: #FFFFFF; margin-bottom: 12px;">Calculation Logic & Social Budgeting Principles</h2>
          <p style="color: #94A3B8; line-height: 1.7; font-size: 0.9rem;">
            Annual Cash Outflow = (Meetups Count × Cost per Meetup) + Annual Gifts & Festivals + Annual Trips Share + Annual Digital Subscriptions & Deliveries.<br>
            Total Hours Invested = (Meetups Count × Hours/Meetup) + (Calls/Wk × 52) + (Messaging/Day × 365) + Vacation Days Hours.<br>
            Opportunity Cost of Time = Total Annual Hours × Hourly Rate (kept strictly separate from out-of-pocket cash).
          </p>
        </section>

        <section style="background: #0A1E15; border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; color: #FFFFFF; margin-bottom: 16px;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${(friendshipContent.faqs || []).map(faq => `
              <div>
                <h3 style="font-size: 1rem; color: #D8B879; margin: 0 0 6px 0;">${escapeHtml(faq.question)}</h3>
                <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6; margin: 0;">${escapeHtml(faq.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </article>
    `;

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: friendshipContent.h1,
          description: friendshipContent.metaDescription,
          url: meta.canonicalUrl,
          applicationCategory: "UtilityApplication",
          operatingSystem: "All"
        },
        {
          "@type": "FAQPage",
          mainEntity: (friendshipContent.faqs || []).map(f => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer
            }
          }))
        }
      ]
    };
  }

  // 10c. Multilingual Repair vs Replace Decision Engine localized routes
  else if (urlPath.includes('repair-vs-replace')) {
    const langMatch = urlPath.match(/^\/([a-z]{2,3})\/calculators\/repair-vs-replace/);
    const langKey = langMatch ? langMatch[1] : 'en';
    const repairContent = REPAIR_TOOL_I18N[langKey] || REPAIR_TOOL_I18N['en'];

    meta = {
      title: repairContent.title,
      description: repairContent.metaDescription,
      canonicalUrl: langKey === 'en'
        ? `${BASE_URL}/calculators/repair-vs-replace`
        : `${BASE_URL}/${langKey}/calculators/repair-vs-replace`
    };

    hreflangs = Object.keys(REPAIR_TOOL_I18N).map(code => ({
      lang: REPAIR_LOCALES[code].bcp47,
      href: code === 'en'
        ? `${BASE_URL}/calculators/repair-vs-replace`
        : `${BASE_URL}/${code}/calculators/repair-vs-replace`
    }));
    hreflangs.push({
      lang: 'x-default',
      href: `${BASE_URL}/calculators/repair-vs-replace`
    });

    bodyContent = `
      <div style="margin-bottom: 16px;">
        <a href="/category/money" style="color: #94A3B8; text-decoration: none; font-size: 0.85rem;">← Salary & Finance Tools</a>
      </div>
      <article dir="${repairContent.dir || 'ltr'}">
        <span style="font-size: 0.75rem; font-weight: 700; color: #8B5CF6; text-transform: uppercase;">22 INDIAN LANGUAGES • 50% RULE • ZERO CLOUD UPLOADS</span>
        <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin: 8px 0;">${escapeHtml(repairContent.h1)}</h1>
        <p style="font-size: 1rem; color: #CBD5E1; line-height: 1.6; max-width: 800px; margin-bottom: 24px;">${escapeHtml(repairContent.subtitle)}</p>

        <section style="background: #0E1726; border: 1px solid rgba(139,92,246,0.25); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; color: #FFFFFF; margin-bottom: 12px;">Methodology & Financial Evaluation Principles</h2>
          <p style="color: #94A3B8; line-height: 1.7; font-size: 0.9rem;">
            The 50% Rule: If the estimated repair cost exceeds 50% of the price of a brand-new replacement, AND the item has already exceeded 50% of its typical category lifespan, replacement is generally favored.<br>
            Equal-Horizon Cost (36 Months): Normalizes both options across a 36-month timeline, including expected secondary failures and monthly maintenance.<br>
            Break-Even Timeline: Calculates exactly how many months the repaired item must survive to economically justify the repair outlay over replacing today.
          </p>
        </section>

        <section style="background: #090D14; border: 1px solid rgba(139,92,246,0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1.3rem; color: #FFFFFF; margin-bottom: 16px;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${(repairContent.faqs || []).map(faq => `
              <div>
                <h3 style="font-size: 1rem; color: #A78BFA; margin: 0 0 6px 0;">${escapeHtml(faq.question)}</h3>
                <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6; margin: 0;">${escapeHtml(faq.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>
      </article>
    `;

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: repairContent.h1,
          description: repairContent.metaDescription,
          url: meta.canonicalUrl,
          applicationCategory: "UtilityApplication",
          operatingSystem: "All"
        },
        {
          "@type": "FAQPage",
          mainEntity: (repairContent.faqs || []).map(f => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer
            }
          }))
        }
      ]
    };
  }

  // 11. Individual Calculator & Image Tools (all 66 tools)
  else {
    const tool = TOOLS.find(t => t.seo.canonicalPath === urlPath);
    if (!tool) {
      console.warn(`Unmatched URL path in prerender: ${urlPath}`);
      continue;
    }

    meta = {
      title: tool.seo.title,
      description: tool.seo.metaDescription,
      canonicalUrl: `${BASE_URL}${tool.seo.canonicalPath}`
    };

    const relatedTools = (tool.relatedSlugs || [])
      .map(s => TOOLS.find(t => t.slug === s))
      .filter(Boolean);

    bodyContent = `
      <nav aria-label="Breadcrumb" style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 16px;">
        <a href="/" style="color: #94A3B8; text-decoration: none;">Home</a> &gt; 
        <a href="/tools" style="color: #94A3B8; text-decoration: none;">Tools</a> &gt; 
        <a href="/category/${tool.category}" style="color: #D8B879; text-decoration: none; text-transform: uppercase;">${escapeHtml(tool.categoryLabel)}</a> &gt; 
        <span style="color: #FFFFFF;">${escapeHtml(tool.shortTitle)}</span>
      </nav>

      <article>
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 10px;">
          <span style="background: rgba(16,185,129,0.15); color: #10B981; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 6px; text-transform: uppercase;">${escapeHtml(tool.categoryLabel)}</span>
          ${tool.badge ? `<span style="background: rgba(216,184,121,0.15); color: #D8B879; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 6px;">${escapeHtml(tool.badge)}</span>` : ''}
          <span style="font-size: 0.75rem; color: #34D399; background: #062418; padding: 3px 10px; border-radius: 6px;">100% Client-Side Privacy</span>
        </div>

        <h1 style="font-size: 2.2rem; font-weight: 900; color: #FFFFFF; margin: 0 0 10px 0; line-height: 1.25;">${escapeHtml(tool.title)}</h1>
        <p style="font-size: 1.05rem; color: #CBD5E1; line-height: 1.6; max-width: 800px; margin-bottom: 24px;">${escapeHtml(tool.detailedDescription || tool.description)}</p>

        <!-- Calculation Logic & Formula -->
        <section style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 24px; margin-bottom: 20px;">
          <h2 style="font-size: 1.25rem; color: #FFFFFF; margin: 0 0 12px 0;">How It Works & Calculation Logic</h2>
          <div style="background: #07130E; border: 1px solid rgba(255,255,255,0.08); padding: 14px; border-radius: 10px; font-family: monospace; font-size: 0.85rem; color: #A8C5AC; line-height: 1.6; margin-bottom: 14px;">
            ${escapeHtml(tool.formulaExplanation)}
          </div>
          ${tool.assumptions && tool.assumptions.length > 0 ? `
            <h4 style="font-size: 0.8rem; text-transform: uppercase; color: #D8B879; margin: 14px 0 6px 0; font-weight: 700;">Standards & Assumptions:</h4>
            <ul style="color: #94A3B8; font-size: 0.85rem; line-height: 1.6; padding-left: 20px; margin: 0;">
              ${tool.assumptions.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
            </ul>
          ` : ''}
        </section>

        <!-- Practical Example Walkthrough -->
        ${tool.exampleCalculation ? `
          <section style="background: #0A1E15; border: 1px solid rgba(16,185,129,0.2); border-radius: 16px; padding: 24px; margin-bottom: 20px;">
            <h3 style="font-size: 1.2rem; color: #FFFFFF; margin: 0 0 14px 0;">Practical Example: ${escapeHtml(tool.exampleCalculation.title)}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 12px;">
              <div style="background: #0E261B; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
                <strong style="color: #94A3B8; font-size: 0.75rem; text-transform: uppercase; display: block; margin-bottom: 6px;">Inputs:</strong>
                ${Object.entries(tool.exampleCalculation.inputs).map(([k, v]) => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #CBD5E1; margin-bottom: 4px;">
                    <span>${escapeHtml(k)}:</span>
                    <strong style="color: #FFFFFF;">${escapeHtml(v)}</strong>
                  </div>
                `).join('')}
              </div>
              <div style="background: #0E261B; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06);">
                <strong style="color: #10B981; font-size: 0.75rem; text-transform: uppercase; display: block; margin-bottom: 6px;">Outputs:</strong>
                ${Object.entries(tool.exampleCalculation.outputs).map(([k, v]) => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: #CBD5E1; margin-bottom: 4px;">
                    <span>${escapeHtml(k)}:</span>
                    <strong style="color: #34D399;">${escapeHtml(v)}</strong>
                  </div>
                `).join('')}
              </div>
            </div>
            <p style="font-size: 0.85rem; color: #94A3B8; font-style: italic; margin: 0;">"${escapeHtml(tool.exampleCalculation.explanation)}"</p>
          </section>
        ` : ''}

        <!-- FAQs Section -->
        ${tool.faqs && tool.faqs.length > 0 ? `
          <section style="background: #0E261B; border: 1px solid rgba(16,185,129,0.25); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-size: 1.3rem; color: #FFFFFF; margin: 0 0 16px 0;">Frequently Asked Questions</h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${tool.faqs.map(faq => `
                <div>
                  <h3 style="font-size: 1rem; color: #D8B879; margin: 0 0 6px 0;">${escapeHtml(faq.question)}</h3>
                  <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.6; margin: 0;">${escapeHtml(faq.answer)}</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Related Tools -->
        ${relatedTools.length > 0 ? `
          <section style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <h3 style="font-size: 1.2rem; color: #FFFFFF; margin-bottom: 14px;">Related Practical Tools</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px;">
              ${relatedTools.map(rt => `
                <div style="background: #0A1E15; border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 14px;">
                  <h4 style="font-size: 0.95rem; margin: 0 0 4px 0;">
                    <a href="${rt.seo.canonicalPath}" style="color: #FFFFFF; text-decoration: none;">${escapeHtml(rt.title)}</a>
                  </h4>
                  <p style="font-size: 0.75rem; color: #94A3B8; margin: 0 0 8px 0; line-height: 1.4;">${escapeHtml(rt.description)}</p>
                  <a href="${rt.seo.canonicalPath}" style="color: #10B981; font-size: 0.8rem; font-weight: 700; text-decoration: none;">Launch Tool →</a>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </article>
    `;

    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          name: tool.title,
          description: tool.detailedDescription || tool.description,
          url: `${BASE_URL}${tool.seo.canonicalPath}`,
          applicationCategory: "UtilityApplication",
          operatingSystem: "All"
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE_URL}/tools` },
            { "@type": "ListItem", position: 3, name: tool.categoryLabel, item: `${BASE_URL}/category/${tool.category}` },
            { "@type": "ListItem", position: 4, name: tool.shortTitle, item: `${BASE_URL}${tool.seo.canonicalPath}` }
          ]
        },
        ...(tool.faqs && tool.faqs.length > 0 ? [
          {
            "@type": "FAQPage",
            mainEntity: tool.faqs.map(f => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer
              }
            }))
          }
        ] : [])
      ]
    };
  }

  // Generate the full HTML for this URL
  const outputHtml = generatePageHtml(meta, bodyContent, jsonLd, hreflangs);

  // Write to destination
  if (urlPath === '/') {
    fs.writeFileSync(path.join('dist', 'index.html'), outputHtml, 'utf8');
  } else {
    const targetDir = path.join('dist', ...urlPath.split('/').filter(Boolean));
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), outputHtml, 'utf8');
  }
  prerenderedCount++;
}

console.log(`\n🎉 Prerendering complete! Successfully generated static HTML files for ${prerenderedCount} production URLs.`);
