// Contact sheet of auto-cropped results so the crop can be eyeballed.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { findCropBox } = require('./autocrop.cjs');

const SRC = process.argv[2];
const OUT = process.argv[3];
const picks = process.argv.slice(4);

const CELL = 300;
const COLS = 6;

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const files = picks.length
    ? picks
    : fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f)).slice(0, 24);

  const tiles = [];
  for (const f of files) {
    const p = path.join(SRC, f);
    const box = await findCropBox(p);
    const buf = await sharp(p).extract(box)
      .resize(CELL, CELL, { fit: 'contain', background: '#ffffff' })
      .jpeg({ quality: 78 }).toBuffer();
    tiles.push(buf);
    console.log(`${f}  ->  ${box.width}x${box.height}`);
  }

  const rows = Math.ceil(tiles.length / COLS);
  const composites = tiles.map((buf, i) => ({
    input: buf,
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL,
  }));
  await sharp({
    create: { width: COLS * CELL, height: rows * CELL, channels: 3, background: '#c8c8c8' },
  }).composite(composites).jpeg({ quality: 80 }).toFile(OUT);
  console.log(OUT);
})();
