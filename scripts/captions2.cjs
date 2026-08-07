// Second pass: some artists place their caption further up the page, so crop a
// taller slice for just those files.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = process.argv[2];
const OUT = process.argv[3];
const prefixes = process.argv.slice(4);
const W = 1100;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(SRC)
    .filter((f) => prefixes.some((p) => f.startsWith(p)))
    .sort();

  const parts = [];
  for (const f of files) {
    const { width, height } = await sharp(path.join(SRC, f)).metadata();
    const cropH = Math.round(height * 0.45);
    const buf = await sharp(path.join(SRC, f))
      .extract({ left: 0, top: height - cropH, width, height: cropH })
      .resize({ width: W })
      .toBuffer();
    const h = (await sharp(buf).metadata()).height;
    const header = await sharp(Buffer.from(
      `<svg width="${W}" height="44"><rect width="${W}" height="44" fill="#7a2e1e"/>` +
      `<text x="12" y="31" font-family="monospace" font-size="24" fill="#fff">${f}</text></svg>`
    )).png().toBuffer();
    parts.push({ buf: header, h: 44 }, { buf, h });
  }

  let y = 0;
  const composites = parts.map((p) => { const c = { input: p.buf, left: 0, top: y }; y += p.h; return c; });
  const out = path.join(OUT, `retry-${prefixes[0]}.jpg`);
  await sharp({ create: { width: W, height: y, channels: 3, background: '#fff' } })
    .composite(composites).jpeg({ quality: 82 }).toFile(out);
  console.log(out);
})();
