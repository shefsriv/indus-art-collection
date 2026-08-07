// Build a labelled contact sheet from a set of thumbnails so pages can be eyeballed.
//   node scripts/contactsheet.cjs <globPrefix> <outFile> [start] [count]
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PREFIX = process.argv[2];
const OUT = process.argv[3];
const START = parseInt(process.argv[4] || '0', 10);
const COUNT = parseInt(process.argv[5] || '30', 10);

const DIR = path.join(__dirname, '..', 'public', 'art', 'thumb');
const CELL = 260;
const PAD = 26; // room for the index label under each cell
const COLS = 6;

(async () => {
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.startsWith(PREFIX))
    .sort((a, b) => {
      const n = (s) => parseInt((s.match(/-(\d+)\.[a-z]+$/) || [])[1] || '0', 10);
      return n(a) - n(b);
    })
    .slice(START, START + COUNT);

  const rows = Math.ceil(files.length / COLS);
  const composites = [];

  for (let i = 0; i < files.length; i++) {
    const buf = await sharp(path.join(DIR, files[i]))
      .resize(CELL, CELL, { fit: 'contain', background: '#ffffff' })
      .toBuffer();
    const n = (files[i].match(/-(\d+)\.[a-z]+$/) || [])[1] || '?';
    const label = Buffer.from(
      `<svg width="${CELL}" height="${PAD}"><rect width="${CELL}" height="${PAD}" fill="#fff"/>` +
        `<text x="${CELL / 2}" y="18" font-family="monospace" font-size="16" fill="#000" text-anchor="middle">${n}</text></svg>`
    );
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    composites.push({ input: buf, left: col * CELL, top: row * (CELL + PAD) });
    composites.push({ input: label, left: col * CELL, top: row * (CELL + PAD) + CELL });
  }

  await sharp({
    create: {
      width: COLS * CELL,
      height: rows * (CELL + PAD),
      channels: 3,
      background: '#ffffff',
    },
  })
    .composite(composites)
    .png()
    .toFile(OUT);

  console.log(`${OUT} (${files.length} images, ${START}-${START + files.length - 1})`);
})();
