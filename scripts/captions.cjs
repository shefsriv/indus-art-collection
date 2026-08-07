// Crop the baked-in caption strip from the bottom of each artist image and
// tile them into a few contact sheets so the captions can be read in bulk.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = process.argv[2];
const OUT = process.argv[3];
const W = 1000;          // width each strip is normalised to
const PER_SHEET = 8;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const files = fs.readdirSync(SRC)
    .filter((f) => !f.startsWith('india-folk'))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();

  const strips = [];
  for (const f of files) {
    const img = sharp(path.join(SRC, f));
    const { width, height } = await img.metadata();
    const cropH = Math.round(height * 0.22);
    const label = `${strips.length + 1}. ${f}`;
    const buf = await sharp(path.join(SRC, f))
      .extract({ left: 0, top: height - cropH, width, height: cropH })
      .resize({ width: W })
      .toBuffer();
    strips.push({ label, buf });
  }

  console.log(`strips: ${strips.length}`);

  for (let s = 0; s * PER_SHEET < strips.length; s++) {
    const group = strips.slice(s * PER_SHEET, (s + 1) * PER_SHEET);
    const parts = [];
    for (const g of group) {
      const h = (await sharp(g.buf).metadata()).height;
      const header = Buffer.from(
        `<svg width="${W}" height="46"><rect width="${W}" height="46" fill="#1b3a4b"/>` +
        `<text x="12" y="32" font-family="monospace" font-size="26" fill="#ffffff">` +
        `${g.label.replace(/&/g, '&amp;')}</text></svg>`
      );
      parts.push({ buf: await sharp(header).png().toBuffer(), h: 46 });
      parts.push({ buf: g.buf, h });
    }

    const totalH = parts.reduce((a, p) => a + p.h, 0);
    let y = 0;
    const composites = parts.map((p) => {
      const c = { input: p.buf, left: 0, top: y };
      y += p.h;
      return c;
    });

    const outFile = path.join(OUT, `sheet-${s + 1}.jpg`);
    await sharp({
      create: { width: W, height: totalH, channels: 3, background: '#ffffff' },
    }).composite(composites).jpeg({ quality: 80 }).toFile(outFile);
    console.log(`${outFile}  (${group.length} strips)`);
  }
})();
