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
  let isDarkTheme = req.url.includes('theme=dark');
  let isLightTheme = req.url.includes('theme=light');
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
      if (ext === '.html') {
        let htmlStr = content.toString('utf8');
        if (isDarkTheme) {
          htmlStr = htmlStr.replace(/class="light"/g, 'class="dark"');
          htmlStr = htmlStr.replace(
            '<head>',
            '<head><script>localStorage.setItem("ipt_theme_v2", "dark"); document.documentElement.classList.remove("light"); document.documentElement.classList.add("dark");</script>'
          );
        } else if (isLightTheme) {
          htmlStr = htmlStr.replace(/class="dark"/g, 'class="light"');
          htmlStr = htmlStr.replace(
            '<head>',
            '<head><script>localStorage.setItem("ipt_theme_v2", "light"); document.documentElement.classList.remove("dark"); document.documentElement.classList.add("light");</script>'
          );
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(htmlStr);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    }
  });
});

server.listen(42000, async () => {
  console.log('Static preview server running on http://localhost:42000');

  const lightDesktop = path.resolve(__dirname, '..', 'screenshot-light-desktop.png');
  const lightFull = path.resolve(__dirname, '..', 'screenshot-light-full.png');
  const darkDesktop = path.resolve(__dirname, '..', 'screenshot-dark-desktop.png');
  const darkFull = path.resolve(__dirname, '..', 'screenshot-dark-full.png');
  const darkMobile = path.resolve(__dirname, '..', 'screenshot-dark-mobile.png');

  function capture(url, outputPath, width, height) {
    return new Promise((resolve, reject) => {
      const args = [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        '--run-all-compositor-stages-before-draw',
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
    console.log('1. Capturing Light Desktop screenshot (1440x900)...');
    await capture('http://localhost:42000/?theme=light', lightDesktop, 1440, 900);
    console.log(`Saved: ${lightDesktop}`);

    console.log('2. Capturing Light Full-Page screenshot (1440x3400)...');
    await capture('http://localhost:42000/?theme=light', lightFull, 1440, 3400);
    console.log(`Saved: ${lightFull}`);

    console.log('3. Capturing Dark Desktop screenshot (1440x900)...');
    await capture('http://localhost:42000/?theme=dark', darkDesktop, 1440, 900);
    console.log(`Saved: ${darkDesktop}`);

    console.log('4. Capturing Dark Full-Page screenshot (1440x3400)...');
    await capture('http://localhost:42000/?theme=dark', darkFull, 1440, 3400);
    console.log(`Saved: ${darkFull}`);

    console.log('5. Capturing Dark Mobile screenshot (500x950)...');
    await capture('http://localhost:42000/?theme=dark', darkMobile, 500, 950);
    console.log(`Saved: ${darkMobile}`);

    console.log('All screenshots captured successfully!');
  } catch (err) {
    console.error('Error capturing screenshot:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
