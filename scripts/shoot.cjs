// Screenshot the running dev server so layout can actually be inspected.
//   node scripts/shoot.cjs <outDir> [baseUrl]
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const OUT = process.argv[2];
const BASE = process.argv[3] || 'http://localhost:5173';

const PAGES = [
  ['home', '/#/'],
  ['gallery', '/#/gallery'],
  ['contact', '/#/contact'],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

  for (const [name, route] of PAGES) {
    await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
    // let lazy images in view settle
    await page.evaluate(() => new Promise((r) => setTimeout(r, 900)));
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log(file);

    // a taller capture of the top of the page for layout review
    await page.screenshot({ path: path.join(OUT, `${name}-tall.png`), clip: { x: 0, y: 0, width: 1440, height: 2600 } })
      .catch(() => {});
  }

  await browser.close();
})();
