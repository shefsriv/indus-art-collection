// Turns the extracted source images into web-sized assets plus the catalogue
// the site reads, and writes the spreadsheet Shefali fills descriptions into.
//
//   node scripts/build-catalog.js
//
// Source images live outside the repo (see SRC) so the originals stay pristine.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ExcelJS = require('exceljs');
const { artists, works } = require('./metadata.cjs');
const { findCropBox } = require('./autocrop.cjs');

const SRC = process.env.ART_SRC || 'C:/Users/shefs/indus-art-source';
const ROOT = path.join(__dirname, '..');
const PLACEHOLDER = 'Add a short description of this painting here.';
const THUMB_DIR = path.join(ROOT, 'public', 'art', 'thumb');
const FULL_DIR = path.join(ROOT, 'public', 'art', 'full');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'catalog.json');
const XLSX_FILE = path.join(ROOT, 'Indus Art Collection - Catalogue.xlsx');

// Every thumbnail is rendered to the same 4:5 tile so the grid lines up. The
// painting is fitted inside rather than cropped to fill, so no artwork is lost —
// the leftover space reads as a mat around the picture.
const TILE_W = 760;
const TILE_H = 950;
const MAT = '#f4f1ea';
const FULL_W = 2000;

// Pages of the folk-collection document that are not a work to sell. Two kinds:
// page furniture and studio clutter (a locator map, the blank back of a canvas,
// a shot of the workshop wall, a scroll lying rolled up on the floor), and the
// angled snapshot of a painting that is also present as a flat scan — in every
// pair below the flat scan is the one kept.
const FOLK_PREFIX = 'india-folk-tribal-paintings-song-collection-2604-260408-001807-';
const FOLK_EXCLUDE = new Set([
  7,  // map of India
  8,  // photograph of village houses
  9,  // several framed works propped in a room
  11, // blank grey canvas back
  21, // blank grey canvas back
  22, // close crop of a detail, not the whole work
  35, // close crop of a detail, not the whole work
  37, // workshop wall
  58, // blank rolled paper
  69, // scroll lying rolled up
  71, // work lying on the floor
  // angled duplicates (flat scan kept in brackets)
  12, // [13]
  20, // [19]
  23, // [24]
  25, // [26]
  34, // [33]
  52, // [51]
  56, // [55]
  63, // [64]
  82, // [83]
  84, // [85]
]);

const isExcluded = (base) => {
  if (!base.startsWith(FOLK_PREFIX)) return false;
  return FOLK_EXCLUDE.has(parseInt(base.slice(FOLK_PREFIX.length), 10));
};

const artistKeyOf = (base) => {
  const keys = Object.keys(artists).sort((a, b) => b.length - a.length);
  return keys.find((k) => base.startsWith(k));
};

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

(async () => {
  fs.mkdirSync(THUMB_DIR, { recursive: true });
  fs.mkdirSync(FULL_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

  const files = fs.readdirSync(SRC)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    // the folk-collection PNGs are decorative page furniture, not artwork
    .filter((f) => !(f.startsWith('india-folk') && f.toLowerCase().endsWith('.png')))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const catalog = [];
  let skipped = 0;

  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    if (isExcluded(base)) { skipped++; continue; }

    const artistKey = artistKeyOf(base);
    if (!artistKey) { skipped++; console.warn(`no artist for ${file}`); continue; }

    const artist = artists[artistKey];
    const meta = works[base] || {};
    const id = base;

    const src = path.join(SRC, file);

    // Discard the page margin and the caption the artist printed under the work.
    const box = await findCropBox(src);
    const width = box.width;
    const height = box.height;

    await sharp(src).extract(box)
      .resize(TILE_W, TILE_H, { fit: 'contain', background: MAT })
      .jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(THUMB_DIR, `${id}.jpg`));

    await sharp(src).extract(box)
      .resize({ width: FULL_W, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(FULL_DIR, `${id}.jpg`));

    catalog.push({
      id,
      artist: artist.name,
      artistSlug: slugify(artist.name),
      style: artist.style,
      title: meta.title || '',
      size: meta.size || '',
      medium: meta.medium || '',
      year: meta.year || '',
      ref: meta.ref || '',
      description: '',
      aspect: +(width / height).toFixed(4),
      thumb: `art/thumb/${id}.jpg`,
      full: `art/full/${id}.jpg`,
    });
  }

  // Drop assets left behind by works that have since been excluded, so the
  // published site never ships an image nothing links to.
  const live = new Set(catalog.map((w) => `${w.id}.jpg`));
  for (const dir of [THUMB_DIR, FULL_DIR]) {
    for (const f of fs.readdirSync(dir)) {
      if (!live.has(f)) { fs.unlinkSync(path.join(dir, f)); console.log(`pruned ${path.basename(dir)}/${f}`); }
    }
  }

  // merge any descriptions previously typed into the spreadsheet
  if (fs.existsSync(XLSX_FILE)) {
    const wbOld = new ExcelJS.Workbook();
    await wbOld.xlsx.readFile(XLSX_FILE);
    const ws = wbOld.getWorksheet('Catalogue');
    if (ws) {
      const byId = new Map();
      ws.eachRow((row, n) => {
        if (n === 1) return;
        const id = String(row.getCell(1).value ?? '').trim();
        const desc = String(row.getCell(8).value ?? '').trim();
        // the untouched placeholder is not a description
        if (id && desc && desc !== PLACEHOLDER) byId.set(id, desc);
      });
      for (const w of catalog) if (byId.has(w.id)) w.description = byId.get(w.id);
      if (byId.size) console.log(`carried over ${byId.size} descriptions`);
    }
  }

  const artistList = [];
  for (const w of catalog) {
    let a = artistList.find((x) => x.slug === w.artistSlug);
    if (!a) {
      const key = Object.keys(artists).find((k) => slugify(artists[k].name) === w.artistSlug);
      a = { slug: w.artistSlug, name: w.artist, style: w.style, bio: artists[key].bio, count: 0, cover: w.thumb };
      artistList.push(a);
    }
    a.count++;
  }
  artistList.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(DATA_FILE, JSON.stringify({ artists: artistList, works: catalog }, null, 2));
  console.log(`${catalog.length} works, ${artistList.length} artists, ${skipped} skipped`);

  // ---- spreadsheet ----
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Catalogue', { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = [
    { header: 'ID (do not edit)', key: 'id', width: 46 },
    { header: 'Artist', key: 'artist', width: 24 },
    { header: 'Style', key: 'style', width: 14 },
    { header: 'Title', key: 'title', width: 24 },
    { header: 'Size', key: 'size', width: 26 },
    { header: 'Medium', key: 'medium', width: 24 },
    { header: 'Year', key: 'year', width: 10 },
    { header: 'Description (fill this in)', key: 'description', width: 70 },
  ];
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A4B' } };
  ws.getRow(1).alignment = { vertical: 'middle' };
  ws.getRow(1).height = 24;

  for (const w of catalog) {
    const row = ws.addRow({
      id: w.id, artist: w.artist, style: w.style, title: w.title,
      size: w.size, medium: w.medium, year: w.year,
      description: w.description || PLACEHOLDER,
    });
    row.alignment = { vertical: 'top', wrapText: true };
    if (!w.description) row.getCell('description').font = { italic: true, color: { argb: 'FF999999' } };
    row.getCell('id').font = { color: { argb: 'FF999999' }, size: 9 };
  }
  ws.autoFilter = { from: 'A1', to: `H${catalog.length + 1}` };

  await wb.xlsx.writeFile(XLSX_FILE);
  console.log(`wrote ${XLSX_FILE}`);
})();

