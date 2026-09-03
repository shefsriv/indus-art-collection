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
const { artists, works, ORDER, FRAMED } = require('./metadata.cjs');
const { findCropBox, findFrameBox } = require('./autocrop.cjs');

const SRC = process.env.ART_SRC || 'C:/Users/shefs/indus-art-source';
const ROOT = path.join(__dirname, '..');
const PLACEHOLDER = 'Add a short description of this painting here.';
const THUMB_DIR = path.join(ROOT, 'public', 'art', 'thumb');
const FULL_DIR = path.join(ROOT, 'public', 'art', 'full');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'catalog.json');
const XLSX_FILE = path.join(ROOT, 'Indus Art Collection - Catalogue.xlsx');
const REFS_FILE = path.join(__dirname, 'refs.json');
const LIST_FILE = path.join(ROOT, 'Painting Reference List.md');

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

// Folk works painted in a single pigment — black, white, grey, sepia or ochre.
// The site hangs these before the coloured folk works, so the group is judged
// by eye once here rather than guessed from the pixels at render time.
const FOLK_MONO = new Set([
  36, 38, 39, 40, 48, 50, 62, 64, 65, 68, 74, 75,
  76, 79, 80, 81, 85, 87, 88, 89, 90, 91, 92, 93,
]);

const isMono = (base) =>
  base.startsWith(FOLK_PREFIX) && FOLK_MONO.has(parseInt(base.slice(FOLK_PREFIX.length), 10));

// Source-image prefixes for artists not shown on the site.
const ARTIST_EXCLUDE = ['mehnaaz-bano-painting'];

const isExcluded = (base) => {
  if (ARTIST_EXCLUDE.some((p) => base.startsWith(p))) return true;
  if (!base.startsWith(FOLK_PREFIX)) return false;
  return FOLK_EXCLUDE.has(parseInt(base.slice(FOLK_PREFIX.length), 10));
};

const artistKeyOf = (base) => {
  const keys = Object.keys(artists).sort((a, b) => b.length - a.length);
  return keys.find((k) => base.startsWith(k));
};

/** Where a painter hangs; anyone not listed in metadata's ORDER follows. */
const artistRank = (name) => {
  const i = ORDER.indexOf(name);
  return i === -1 ? ORDER.length : i;
};

// ---------------------------------------------------------------------------
// Reference numbers
//
// The website shows no artist names, so every painting is identified in public
// by a reference — IAC-001, IAC-002 and so on. The number is what a visitor
// quotes in an enquiry, and `Painting Reference List.md` (and the catalogue
// spreadsheet) say which painter it belongs to.
//
// scripts/refs.json remembers which number belongs to which photograph, so a
// reference, once given out, always means the same painting. New photographs
// take the next unused number; a photograph that is removed keeps its number
// reserved rather than handing it on to something else.
//
// The references are meant to be read in order, so a painter added part-way
// along the collection leaves a gap — their works take numbers from the end.
// Running the build with --renumber throws the remembered numbers away and
// numbers the whole collection afresh, in the order it hangs:
//
//     node scripts/build-catalog.cjs --renumber
//
// Do that deliberately and rarely. Every painting after the insertion point
// changes number, so any reference already quoted to a customer, printed on a
// certificate or written in an email then points at a different painting.
// ---------------------------------------------------------------------------
const REF_PREFIX = 'IAC-';
const RENUMBER = process.argv.includes('--renumber');

function loadRefs() {
  if (RENUMBER || !fs.existsSync(REFS_FILE)) return {};
  return JSON.parse(fs.readFileSync(REFS_FILE, 'utf8'));
}

function refFor(refs, base) {
  if (refs[base]) return refs[base];
  const used = new Set(Object.values(refs).map((r) => parseInt(r.slice(REF_PREFIX.length), 10)));
  let n = 1;
  while (used.has(n)) n++;
  refs[base] = REF_PREFIX + String(n).padStart(3, '0');
  return refs[base];
}

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

  // Which photograph belongs to which painter is settled first, so the works
  // can be put into their hanging order before they are numbered — reference
  // IAC-001 is then the first painting a visitor meets.
  const entries = [];
  for (const file of files) {
    const base = path.basename(file, path.extname(file));
    if (isExcluded(base)) { skipped++; continue; }

    const artistKey = artistKeyOf(base);
    if (!artistKey) { skipped++; console.warn(`no artist for ${file}`); continue; }

    entries.push({ file, base, artist: artists[artistKey], mono: isMono(base) });
  }

  // Painters in the order set in metadata.cjs and, within the folk collection,
  // the single-pigment works before the coloured ones.
  entries.sort((a, b) =>
    artistRank(a.artist.name) - artistRank(b.artist.name) ||
    a.artist.name.localeCompare(b.artist.name) ||
    Number(b.mono) - Number(a.mono) ||
    a.base.localeCompare(b.base, undefined, { numeric: true }));

  const previous = fs.existsSync(REFS_FILE) ? JSON.parse(fs.readFileSync(REFS_FILE, 'utf8')) : {};
  const refs = loadRefs();
  const painterOf = new Map();   // reference → painter, for the private list

  for (const { file, base, artist, mono } of entries) {
    const meta = works[base] || {};
    const ref = refFor(refs, base);
    // The published filename carries the reference, not the painter's name, so
    // no name can be read out of an image address in the page source.
    const id = ref.toLowerCase();
    painterOf.set(ref, artist.name);

    const src = path.join(SRC, file);

    // Discard the page margin and the caption the artist printed under the
    // work — or, for a work photographed in its frame, the frame and mount.
    const box = FRAMED.includes(base) ? await findFrameBox(src) : await findCropBox(src);
    const width = box.width;
    const height = box.height;

    await sharp(src).extract(box)
      .resize(TILE_W, TILE_H, { fit: 'contain', background: MAT })
      .jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(THUMB_DIR, `${id}.jpg`));

    await sharp(src).extract(box)
      .resize({ width: FULL_W, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(FULL_DIR, `${id}.jpg`));

    // Nothing that names the painter is written into the catalogue the website
    // reads — only the reference. The painter is recorded in the spreadsheet
    // and the reference list, neither of which is published.
    catalog.push({
      id,
      ref,
      style: artist.style,
      title: meta.title || '',
      size: meta.size || '',
      medium: meta.medium || '',
      year: meta.year || '',
      description: '',
      mono,
      aspect: +(width / height).toFixed(4),
      thumb: `art/thumb/${id}.jpg`,
      full: `art/full/${id}.jpg`,
    });
  }

  fs.writeFileSync(REFS_FILE, JSON.stringify(refs, null, 2) + '\n');

  if (RENUMBER) {
    const moved = Object.keys(refs).filter((base) => previous[base] && previous[base] !== refs[base]);
    console.log(`renumbered in hanging order — ${moved.length} paintings changed reference`);
  }

  // Drop assets left behind by works that have since been excluded, so the
  // published site never ships an image nothing links to.
  const live = new Set(catalog.map((w) => `${w.id}.jpg`));
  for (const dir of [THUMB_DIR, FULL_DIR]) {
    for (const f of fs.readdirSync(dir)) {
      if (!live.has(f)) { fs.unlinkSync(path.join(dir, f)); console.log(`pruned ${path.basename(dir)}/${f}`); }
    }
  }

  // Carry back everything typed into the spreadsheet. This file is rewritten on
  // every run, so any editable column that is not read here would be silently
  // discarded — which is exactly what used to happen to Title, Size and Medium.
  // A cell left empty falls back to the value in metadata.cjs rather than
  // wiping it, so clearing a cell never destroys the original caption reading.
  const EDITABLE = [
    { column: 4, field: 'title' },
    { column: 5, field: 'size' },
    { column: 6, field: 'medium' },
    { column: 7, field: 'year' },
    { column: 8, field: 'description' },
  ];

  if (fs.existsSync(XLSX_FILE)) {
    const wbOld = new ExcelJS.Workbook();
    await wbOld.xlsx.readFile(XLSX_FILE);
    const ws = wbOld.getWorksheet('Catalogue');
    if (ws) {
      // A spreadsheet row names its painting by the reference the painting had
      // when the sheet was written — which is not the reference it has now if
      // the collection has just been renumbered, and was the source filename in
      // the very first sheets. Both are translated back to the photograph they
      // mean, then forward to the reference it holds today; otherwise a row's
      // details would land on whichever painting inherited its old number.
      const baseOfOldRef = new Map(Object.entries(previous).map(([base, ref]) => [ref, base]));
      const asRef = (key) => {
        if (refs[key]) return refs[key];                       // a source filename
        const base = baseOfOldRef.get(key);
        return base && refs[base] ? refs[base] : key;          // a reference, old or current
      };

      const byId = new Map();
      ws.eachRow((row, n) => {
        if (n === 1) return;
        const id = asRef(String(row.getCell(1).value ?? '').trim());
        if (!id) return;
        const edits = {};
        for (const { column, field } of EDITABLE) {
          const cell = row.getCell(column).value;
          // a formula cell reports as an object; take what it evaluated to
          const raw = cell && typeof cell === 'object' && 'result' in cell ? cell.result : cell;
          const value = String(raw ?? '').trim();
          // the untouched grey placeholder is not a description
          if (value && value !== PLACEHOLDER) edits[field] = value;
        }
        if (Object.keys(edits).length) byId.set(id, edits);
      });

      let cells = 0;
      for (const w of catalog) {
        const edits = byId.get(w.ref);
        if (!edits) continue;
        for (const [field, value] of Object.entries(edits)) {
          if (w[field] !== value) cells++;
          w[field] = value;
        }
      }
      if (byId.size) console.log(`carried over details for ${byId.size} works (${cells} cells changed)`);
    }
  }

  // The painters, in hanging order, with the works belonging to each. Used for
  // the private reference list and for the count the website quotes — the site
  // is told how many painters there are, never who they are.
  const painters = [];
  for (const w of catalog) {
    const name = painterOf.get(w.ref);
    let p = painters.find((x) => x.name === name);
    if (!p) { p = { name, style: w.style, works: [] }; painters.push(p); }
    p.works.push(w);
  }

  fs.writeFileSync(DATA_FILE,
    JSON.stringify({ artistCount: painters.length, works: catalog }, null, 2) + '\n');
  console.log(`${catalog.length} works, ${painters.length} artists, ${skipped} skipped`);

  // ---- the private reference list -------------------------------------------
  // Which painter each reference on the website belongs to. This file is never
  // part of the published website: it is here so that when someone enquires
  // about "IAC-042" the painting and its painter can be found at once.
  const listLines = [
    '# Painting reference list — private',
    '',
    'The website shows no artist names. Every painting is identified in public by',
    'its reference number instead, and this list says which painter each one is by.',
    '',
    '**This list is not published on the website.** It is rewritten automatically',
    `every time new artwork is added, so do not type into it — it is for looking up.`,
    '',
    `${catalog.length} paintings · ${painters.length} painters · updated ${new Date().toISOString().slice(0, 10)}`,
    '',
  ];
  for (const p of painters) {
    listLines.push(`## ${p.name} — ${p.style} · ${p.works.length} work${p.works.length === 1 ? '' : 's'}`, '');
    listLines.push('| Reference | Title | Size | Medium | Photograph |');
    listLines.push('| --- | --- | --- | --- | --- |');
    for (const w of p.works) {
      const source = Object.keys(refs).find((k) => refs[k] === w.ref) || '';
      listLines.push(`| ${w.ref} | ${w.title || '—'} | ${w.size || '—'} | ${w.medium || '—'} | ${source} |`);
    }
    listLines.push('');
  }
  fs.writeFileSync(LIST_FILE, listLines.join('\n'));
  console.log(`wrote ${LIST_FILE}`);

  // ---- spreadsheet ----
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Catalogue', { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = [
    { header: 'Reference (do not edit)', key: 'id', width: 22 },
    { header: 'Artist (do not edit)', key: 'artist', width: 24 },
    { header: 'Style (do not edit)', key: 'style', width: 14 },
    { header: 'Title (editable)', key: 'title', width: 24 },
    { header: 'Size (editable)', key: 'size', width: 26 },
    { header: 'Medium (editable)', key: 'medium', width: 24 },
    { header: 'Year (editable)', key: 'year', width: 10 },
    { header: 'Description (editable)', key: 'description', width: 70 },
  ];
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B3A4B' } };
  ws.getRow(1).alignment = { vertical: 'middle' };
  ws.getRow(1).height = 24;

  for (const w of catalog) {
    const row = ws.addRow({
      id: w.ref, artist: painterOf.get(w.ref), style: w.style, title: w.title,
      size: w.size, medium: w.medium, year: w.year,
      description: w.description || PLACEHOLDER,
    });
    row.alignment = { vertical: 'top', wrapText: true };
    if (!w.description) row.getCell('description').font = { italic: true, color: { argb: 'FF999999' } };
    row.getCell('id').font = { bold: true };
  }
  ws.autoFilter = { from: 'A1', to: `H${catalog.length + 1}` };

  await wb.xlsx.writeFile(XLSX_FILE);
  console.log(`wrote ${XLSX_FILE}`);
})();

