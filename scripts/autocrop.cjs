// Finds the painting inside a source image, discarding the page margins and the
// caption text the artists printed underneath their work.
//
// The idea: against the flat page background, rows that belong to the painting
// have a large share of non-background pixels, while rows of caption text have
// only a sparse scattering. So we mark non-background pixels, then keep the
// single largest run of densely covered rows (and columns within it).

const sharp = require('sharp');

const SCAN_W = 400;        // work small; we only need the bounding box
const BG_TOLERANCE = 26;   // how far off the background colour counts as content
const DENSE_ROW = 0.34;    // share of content pixels for a row to be "painting"
const DENSE_COL = 0.14;
const PAD = 0.004;         // breathing room, as a share of the long edge

/** Largest contiguous run of true values; returns [start, endExclusive]. */
function longestRun(flags) {
  let best = [0, flags.length];
  let bestLen = -1;
  let start = -1;
  for (let i = 0; i <= flags.length; i++) {
    if (i < flags.length && flags[i]) {
      if (start === -1) start = i;
    } else if (start !== -1) {
      if (i - start > bestLen) { bestLen = i - start; best = [start, i]; }
      start = -1;
    }
  }
  return bestLen <= 0 ? [0, flags.length] : best;
}

async function findCropBox(file) {
  const meta = await sharp(file).metadata();
  const { width: W, height: H } = meta;

  const scale = Math.min(1, SCAN_W / W);
  const sw = Math.max(1, Math.round(W * scale));
  const sh = Math.max(1, Math.round(H * scale));

  const { data } = await sharp(file)
    .resize(sw, sh, { fit: 'fill' })
    .removeAlpha()
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // background = median of the four corner samples
  const corner = (x, y) => data[y * sw + x];
  const corners = [
    corner(0, 0), corner(sw - 1, 0), corner(0, sh - 1), corner(sw - 1, sh - 1),
  ].sort((a, b) => a - b);
  const bg = (corners[1] + corners[2]) / 2;

  // The margin-and-caption problem only occurs on images scanned onto a white
  // page. When the border is dark or coloured it is part of the artwork (a
  // painted mat, a fabric edge), and trimming by density would eat into the
  // painting itself — so leave those images exactly as they are.
  if (bg < 200) {
    return { left: 0, top: 0, width: W, height: H };
  }

  const isContent = new Uint8Array(sw * sh);
  for (let i = 0; i < data.length; i++) {
    isContent[i] = Math.abs(data[i] - bg) > BG_TOLERANCE ? 1 : 0;
  }

  const rowDense = new Array(sh);
  for (let y = 0; y < sh; y++) {
    let n = 0;
    for (let x = 0; x < sw; x++) n += isContent[y * sw + x];
    rowDense[y] = n / sw >= DENSE_ROW;
  }
  const [y0, y1] = longestRun(rowDense);

  // Columns use the outermost dense edges rather than the longest run, so that
  // a triptych photographed as three panels with gaps stays whole. The caption
  // text has already been excluded by the row band above, so nothing stray is
  // left out here for the bounds to over-reach onto.
  const colDense = new Array(sw);
  for (let x = 0; x < sw; x++) {
    let n = 0;
    for (let y = y0; y < y1; y++) n += isContent[y * sw + x];
    colDense[x] = n / Math.max(1, y1 - y0) >= DENSE_COL;
  }
  let x0 = colDense.indexOf(true);
  let x1 = colDense.lastIndexOf(true) + 1;
  if (x0 === -1) { x0 = 0; x1 = sw; }

  // back to full-resolution coordinates, with a little padding
  const pad = Math.round(Math.max(W, H) * PAD);
  let left = Math.max(0, Math.round((x0 / sw) * W) - pad);
  let top = Math.max(0, Math.round((y0 / sh) * H) - pad);
  let right = Math.min(W, Math.round((x1 / sw) * W) + pad);
  let bottom = Math.min(H, Math.round((y1 / sh) * H) + pad);

  let box = { left, top, width: right - left, height: bottom - top };

  // Refuse anything implausible — better the original than a mangled crop.
  const areaShare = (box.width * box.height) / (W * H);
  if (box.width < 40 || box.height < 40 || areaShare < 0.03) {
    box = { left: 0, top: 0, width: W, height: H };
  }
  return box;
}

/**
 * Finds the painting inside a photograph taken of a *framed* work, discarding
 * the frame and any mount around it.
 *
 * `findCropBox` above deliberately leaves dark borders alone, because a dark
 * edge is usually part of the painting. A frame is different, and it cannot be
 * told apart by colour — a black frame and a black-grounded painting are the
 * same colour. What separates them is detail: paint has texture everywhere,
 * while a frame and a mount are flat. So rows and columns are scored by how
 * much their brightness varies, and the largest band of varied ones is kept.
 *
 * Only used for the photographs named in FRAMED in metadata.cjs — it is not
 * applied to the collection at large.
 */
const FLAT = 9;            // brightness spread below this reads as flat board
const FRAME_INSET = 0.012; // trim a sliver more, to clear the mount's shadow

async function findFrameBox(file) {
  const meta = await sharp(file).metadata();
  const { width: W, height: H } = meta;

  const scale = Math.min(1, SCAN_W / W);
  const sw = Math.max(1, Math.round(W * scale));
  const sh = Math.max(1, Math.round(H * scale));

  const { data } = await sharp(file)
    .resize(sw, sh, { fit: 'fill' })
    .removeAlpha()
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const spread = (values) => {
    let sum = 0;
    for (const v of values) sum += v;
    const mean = sum / values.length;
    let acc = 0;
    for (const v of values) acc += (v - mean) * (v - mean);
    return Math.sqrt(acc / values.length);
  };

  const rowVaried = new Array(sh);
  for (let y = 0; y < sh; y++) {
    const row = new Array(sw);
    for (let x = 0; x < sw; x++) row[x] = data[y * sw + x];
    rowVaried[y] = spread(row) > FLAT;
  }
  const [y0, y1] = longestRun(rowVaried);

  const colVaried = new Array(sw);
  for (let x = 0; x < sw; x++) {
    const col = new Array(y1 - y0);
    for (let y = y0; y < y1; y++) col[y - y0] = data[y * sw + x];
    colVaried[x] = spread(col) > FLAT;
  }
  const [x0, x1] = longestRun(colVaried);

  const inset = Math.round(Math.max(W, H) * FRAME_INSET);
  const left = Math.round((x0 / sw) * W) + inset;
  const top = Math.round((y0 / sh) * H) + inset;
  const right = Math.round((x1 / sw) * W) - inset;
  const bottom = Math.round((y1 / sh) * H) - inset;

  const box = { left, top, width: right - left, height: bottom - top };
  const areaShare = (box.width * box.height) / (W * H);
  // A frame is a border, not most of the picture; anything that small means the
  // detector lost its way, and the untouched photograph is the safer answer.
  if (box.width < 40 || box.height < 40 || areaShare < 0.15) {
    return { left: 0, top: 0, width: W, height: H };
  }

  // Inside the frame there is often a pale mount as well. That is the ordinary
  // white-background case, so the everyday crop finishes the job — run over the
  // framed-off picture and folded back into whole-photograph coordinates.
  const inner = await sharp(file).extract(box).toBuffer();
  const m = await findCropBox(inner);
  return {
    left: box.left + m.left,
    top: box.top + m.top,
    width: m.width,
    height: m.height,
  };
}

module.exports = { findCropBox, findFrameBox };
