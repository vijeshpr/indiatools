const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const BASE_URL = 'https://indiatools-rho.vercel.app';

console.log('=== RUNNING COMPLETE SEO INDEXABILITY & RUNTIME AUDIT ===\n');

// Helper to transpile and load TS modules
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

const toolsMod = loadTs('src/data/tools.ts');
const chequeMod = loadTs('src/data/chequeSeoData.ts');
const goldMod = loadTs('src/i18n/goldToolI18n.ts');

const TOOLS = toolsMod.TOOLS;
const CATEGORIES = toolsMod.CATEGORIES;
const CHEQUE_SEO_LANGUAGES = chequeMod.CHEQUE_SEO_LANGUAGES;
const GOLD_TOOL_I18N = goldMod.GOLD_TOOL_I18N;

// 1. SITEMAP INVENTORY
const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log(`[Phase 1 Inventory] Found ${sitemapUrls.length} production URLs in sitemap.xml.`);

const allToolSlugs = new Set(TOOLS.map(t => t.slug));
const allCategories = new Set(Object.keys(CATEGORIES));

let totalIssues = 0;
const report = [];

function logIssue(url, severity, message) {
  totalIssues++;
  report.push({ url, severity, message });
  console.error(`❌ [${severity}] ${url}: ${message}`);
}

function logPass(message) {
  console.log(`✅ [PASS] ${message}`);
}

// ==========================================
// CHECK 1: DATA REGISTRY & RELATED SLUGS
// ==========================================
console.log('\n--- CHECK 1: DATA REGISTRY & RELATED SLUGS ---');
TOOLS.forEach(tool => {
  if (!allCategories.has(tool.category)) {
    logIssue(tool.seo.canonicalPath, 'HIGH', `Invalid category: ${tool.category}`);
  }
  (tool.relatedSlugs || []).forEach(rel => {
    if (!allToolSlugs.has(rel)) {
      logIssue(tool.seo.canonicalPath, 'HIGH', `Broken relatedSlug: "${rel}" does not exist in TOOLS`);
    }
  });
  if (!tool.seo.title.endsWith('| IndiaTools')) {
    logIssue(tool.seo.canonicalPath, 'MEDIUM', `Title does not end with '| IndiaTools': ${tool.seo.title}`);
  }
  if (!tool.seo.canonicalPath.startsWith('/tools/') && !tool.seo.canonicalPath.startsWith('/calculators/')) {
    logIssue(tool.seo.canonicalPath, 'HIGH', `Invalid canonical path format: ${tool.seo.canonicalPath}`);
  }
});
if (totalIssues === 0) {
  logPass(`All ${TOOLS.length} tools have valid categories, valid SEO titles, and canonical paths.`);
}

// ==========================================
// CHECK 2: SITEMAP & PRERENDERED HTML AUDIT FOR EVERY URL
// ==========================================
console.log(`\n--- CHECK 2: SITEMAP & PRERENDERED HTML AUDIT (${sitemapUrls.length} URLs) ---`);
const distDir = path.resolve('dist');
const seenTitles = new Map();
const seenCanonicals = new Set();

sitemapUrls.forEach(fullUrl => {
  const urlPath = fullUrl.replace(BASE_URL, '') || '/';
  
  // 1. Check Prerendered HTML exists
  const filePath = urlPath === '/' 
    ? path.join(distDir, 'index.html') 
    : path.join(distDir, urlPath.replace(/^\//, ''), 'index.html');

  if (!fs.existsSync(filePath)) {
    logIssue(fullUrl, 'CRITICAL', `Prerendered HTML file missing on disk: ${filePath}`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  if (html.length < 500) {
    logIssue(fullUrl, 'CRITICAL', `Prerendered HTML file is suspiciously small (${html.length} bytes)`);
    return;
  }

  // 2. Check Canonical
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (!canonicalMatch) {
    logIssue(fullUrl, 'HIGH', `Missing canonical link tag`);
  } else if (canonicalMatch[1] !== fullUrl) {
    logIssue(fullUrl, 'HIGH', `Canonical URL mismatch! Expected "${fullUrl}", found "${canonicalMatch[1]}"`);
  }

  // 3. Check Robots Meta Tag
  const robotsMatch = html.match(/<meta\s+name="robots"\s+content="([^"]+)"/i);
  if (!robotsMatch) {
    logIssue(fullUrl, 'HIGH', `Missing robots meta tag`);
  } else if (!robotsMatch[1].includes('index') || robotsMatch[1].includes('noindex')) {
    logIssue(fullUrl, 'CRITICAL', `Accidental noindex or non-indexable robots tag: "${robotsMatch[1]}"`);
  }

  // 4. Check Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    logIssue(fullUrl, 'HIGH', `Missing or empty <title> tag`);
  } else {
    const title = titleMatch[1].trim();
    if (!title.includes('IndiaTools')) {
      logIssue(fullUrl, 'MEDIUM', `Title missing brand name IndiaTools: "${title}"`);
    }
  }

  // 5. Check Meta Description
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (!descMatch || !descMatch[1].trim() || descMatch[1].trim().length < 30) {
    logIssue(fullUrl, 'HIGH', `Missing or too short meta description (${descMatch ? descMatch[1].length : 0} chars)`);
  }

  // 6. Check H1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (!h1Match || !h1Match[1].trim()) {
    logIssue(fullUrl, 'HIGH', `Missing or empty <h1> tag in prerendered HTML`);
  }

  // 7. Check JSON-LD Structured Data
  const jsonLdMatch = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!jsonLdMatch) {
    logIssue(fullUrl, 'HIGH', `Missing JSON-LD structured data`);
  } else {
    try {
      const parsed = JSON.parse(jsonLdMatch[1]);
      if (!parsed['@context'] || !parsed['@context'].includes('schema.org')) {
        logIssue(fullUrl, 'MEDIUM', `JSON-LD missing schema.org context`);
      }
    } catch (e) {
      logIssue(fullUrl, 'HIGH', `JSON-LD failed JSON parsing: ${e.message}`);
    }
  }

  // 8. Check internal links in page
  const linkMatches = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map(m => m[1]);
  for (const href of linkMatches) {
    if (href.startsWith('/#') || href === '/') continue;
    // Check if target exists in sitemap or static assets
    const fullHref = `${BASE_URL}${href}`;
    if (!sitemapUrls.includes(fullHref) && !href.startsWith('/assets') && !href.startsWith('/favicon') && !href.startsWith('/manifest')) {
      // Check if it's a valid category or known route
      if (!href.startsWith('/category/') && !href.startsWith('/tools') && !href.startsWith('/calculators')) {
        logIssue(fullUrl, 'MEDIUM', `Internal link to unindexed or non-sitemap route: "${href}"`);
      }
    }
  }
});

// ==========================================
// CHECK 3: ROUTING & COMPONENT MAPPING AUDIT
// ==========================================
console.log('\n--- CHECK 3: ROUTING & COMPONENT MAPPING AUDIT ---');
const toolDetailPageContent = fs.readFileSync('src/pages/ToolDetailPage.tsx', 'utf8');

TOOLS.forEach(tool => {
  // Check TOOL_COMPONENTS has the tool slug
  const keyPattern = new RegExp(`['"]${tool.slug}['"]\\s*:`, 'i');
  if (!keyPattern.test(toolDetailPageContent)) {
    logIssue(tool.seo.canonicalPath, 'CRITICAL', `Tool "${tool.slug}" is missing from TOOL_COMPONENTS mapping in ToolDetailPage.tsx`);
  }
});

// ==========================================
// CHECK 4: SCAN TSX COMPONENTS FOR UNSAFE OPERATIONS
// ==========================================
console.log('\n--- CHECK 4: SCAN TSX COMPONENTS FOR UNSAFE METHODS & I18N ---');
const calculatorsDir = path.resolve('src/calculators');
const imageToolsDir = path.resolve('src/imageTools');

function scanDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  files.forEach(f => {
    const fullPath = path.join(dir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for type-only imports of i18n
    const typeOnlyI18n = content.match(/import\s*\{\s*([a-zA-Z0-9]+UI)\s*\}\s*from\s*['"]\.\.\/i18n\/tools\/([a-zA-Z0-9]+)['"]/);
    if (typeOnlyI18n && !content.includes('registerToolTranslations')) {
      logIssue(f, 'HIGH', `Suspected stripped type-only i18n import without registerToolTranslations: ${typeOnlyI18n[0]}`);
    }

    // Check for unshielded .split(' ') on localized variables
    const unshieldedSplit = content.match(/\{([a-zA-Z0-9_]+Rating)\.split\(/);
    if (unshieldedSplit) {
      logIssue(f, 'HIGH', `Unshielded .split() on rating variable: ${unshieldedSplit[0]}`);
    }

    // Check for unshielded .replace() on ui properties without fallback
    const unshieldedReplace = content.match(/\{ui\.([a-zA-Z0-9_]+)\.replace\(/);
    if (unshieldedReplace) {
      logIssue(f, 'HIGH', `Unshielded .replace() on ui property: ${unshieldedReplace[0]}`);
    }
  });
}

scanDir(calculatorsDir);
scanDir(imageToolsDir);

console.log('\n========================================');
console.log(`TOTAL AUDIT ISSUES FOUND: ${totalIssues}`);
if (totalIssues === 0) {
  console.log(`🌟 ALL ${sitemapUrls.length} URLS AND ${TOOLS.length} TOOL MODULES PASSED COMPLETE AUDIT WITHOUT ERROR!`);
} else {
  console.log(`⚠️ FOUND ${totalIssues} ISSUES ACROSS CODEBASE & SITEMAP:`);
  report.forEach((r, idx) => {
    console.log(`${idx + 1}. [${r.severity}] ${r.url} -> ${r.message}`);
  });
}
