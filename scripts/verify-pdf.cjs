const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

// 1. Locate Chrome or Edge
const candidatePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let browserPath = null;
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    browserPath = p;
    break;
  }
}

if (!browserPath) {
  console.log('No Chrome or Edge browser executable found for headless print test.');
  process.exit(0);
}

console.log(`Using browser: ${browserPath}`);

const distDir = path.resolve(__dirname, '..', 'dist');
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(distDir, reqPath);
  
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 41731;
server.listen(PORT, async () => {
  console.log(`Temporary test server listening on http://localhost:${PORT}`);
  const pdfOut = path.resolve(__dirname, 'test-cheque.pdf');
  if (fs.existsSync(pdfOut)) fs.unlinkSync(pdfOut);

  const targetUrl = `http://localhost:${PORT}/calculators/indian-cheque-studio`;

  const args = [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--run-all-compositor-stages-before-draw',
    `--print-to-pdf=${pdfOut}`,
    targetUrl
  ];

  console.log(`Generating headless PDF of ${targetUrl}...`);
  execFile(browserPath, args, { timeout: 25000 }, (error, stdout, stderr) => {
    server.close();

    if (error) {
      console.error('Headless print error:', error.message);
      process.exit(1);
    }

    if (!fs.existsSync(pdfOut)) {
      console.error('PDF file was not created!');
      process.exit(1);
    }

    const pdfBuffer = fs.readFileSync(pdfOut);
    const pdfText = pdfBuffer.toString('latin1');
    console.log(`Generated PDF file size: ${pdfBuffer.length} bytes`);

    // In PDF standard, each page contains "/Type /Page" or "/Type/Page"
    const pageMatches = pdfText.match(/\/Type\s*\/Page\b/g);
    const count = pageMatches ? pageMatches.length : 0;

    console.log(`=== PDF PAGE AUDIT ===`);
    console.log(`Total Pages Counted in Output PDF: ${count}`);

    if (count === 1) {
      console.log('✅ [PASS] Cheque print sheet is strictly contained in EXACTLY 1 page! (No blank pages, no overflow)');
      try { fs.unlinkSync(pdfOut); } catch (e) {}
      process.exit(0);
    } else {
      console.warn(`⚠️ [WARNING] Cheque generated ${count} pages instead of exactly 1 page.`);
      process.exit(1);
    }
  });
});
