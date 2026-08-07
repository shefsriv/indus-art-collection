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

module.exports = { findCropBox };
