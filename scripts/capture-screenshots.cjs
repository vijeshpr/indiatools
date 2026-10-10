const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

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
  console.error('No Chrome/Edge browser found.');
  process.exit(1);
}

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

server.listen(42000, async () => {
  console.log('Static preview server running on http://localhost:42000');

  const desktopScreenshot = path.resolve(__dirname, '..', 'screenshot-desktop.png');
  const desktopFullScreenshot = path.resolve(__dirname, '..', 'screenshot-desktop-full.png');
  const mobileScreenshot = path.resolve(__dirname, '..', 'screenshot-mobile.png');

  function capture(url, outputPath, width, height) {
    return new Promise((resolve, reject) => {
      const args = [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--hide-scrollbars',
        `--window-size=${width},${height}`,
        `--screenshot=${outputPath}`,
        '--virtual-time-budget=4000',
        url
      ];

      execFile(browserPath, args, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  try {
    console.log('Capturing Desktop screenshot (1440x900)...');
    await capture('http://localhost:42000', desktopScreenshot, 1440, 900);
    console.log(`Saved desktop screenshot to ${desktopScreenshot}`);

    console.log('Capturing Desktop Full-Page screenshot (1440x2800)...');
    await capture('http://localhost:42000', desktopFullScreenshot, 1440, 2800);
    console.log(`Saved desktop full screenshot to ${desktopFullScreenshot}`);

    console.log('Capturing Mobile screenshot (390x844)...');
    await capture('http://localhost:42000', mobileScreenshot, 390, 844);
    console.log(`Saved mobile screenshot to ${mobileScreenshot}`);

    console.log('Screenshots captured successfully!');
  } catch (err) {
    console.error('Error capturing screenshot:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
