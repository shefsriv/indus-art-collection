// One command to publish new artwork:
//
//   npm run add-art
//
// It rebuilds the catalogue from the source photos, checks the site still
// builds, shows what changed, then offers to publish. Written to be run by
// Shefali directly, so every message is plain English and nothing is
// published without a yes.
//
//   npm run add-art -- --yes         publish without asking
//   npm run add-art -- --no-publish  rebuild and check only, change nothing live

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SRC = process.env.ART_SRC || 'C:/Users/shefs/indus-art-source';
const DATA_FILE = path.join(ROOT, 'src', 'data', 'catalog.json');

const args = process.argv.slice(2);
const AUTO_YES = args.includes('--yes') || args.includes('-y');
const NO_PUBLISH = args.includes('--no-publish');

// ---- plain-English output helpers -----------------------------------------

const say = (msg = '') => console.log(msg);
const step = (n, msg) => say(`\n[${n}/4] ${msg}`);
const bullet = (msg) => say(`      ${msg}`);

function fail(heading, lines) {
  say(`\n  ✕  ${heading}\n`);
  for (const l of lines) bullet(l);
  say('\n      Nothing has been published. The website is unchanged.\n');
  process.exit(1);
}

function run(cmd, cmdArgs, opts = {}) {
  return spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    ...opts,
  });
}

function ask(question) {
  if (AUTO_YES) return Promise.resolve(true);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (a) => {
      rl.close();
      resolve(/^y(es)?$/i.test(a.trim()));
    });
  });
}

// Reads the works currently in the catalogue, keyed by id.
function readCatalog() {
  if (!fs.existsSync(DATA_FILE)) return new Map();
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  return new Map(data.works.map((w) => [w.id, w]));
}

// ---------------------------------------------------------------------------

(async () => {
  say('\n  Indus Art Collection — publish new artwork');
  say('  ' + '-'.repeat(43));

  if (!fs.existsSync(SRC)) {
    fail('I cannot find your photo folder.', [
      `Expected it here:  ${SRC}`,
      '',
      'That folder holds the original photographs. If it has moved,',
      'tell me the new location and I will point this at it.',
    ]);
  }

  const before = readCatalog();

  // ---- 1. rebuild the catalogue -------------------------------------------

  step(1, 'Preparing your photos for the web…');
  bullet('(cropping, making thumbnails, updating the catalogue)');

  const build = run(process.execPath, [path.join(__dirname, 'build-catalog.cjs')]);
  const output = (build.stdout || '') + (build.stderr || '');

  if (build.status !== 0) {
    fail('Something went wrong while preparing the photos.', [
      'The full message was:',
      '',
      ...output.trim().split('\n').map((l) => `  ${l}`),
    ]);
  }

  // The catalogue script warns rather than stops when a photo's filename does
  // not begin with a known artist. That photo silently would not appear, so
  // surface it here as the real problem it is.
  const orphans = [...output.matchAll(/no artist for (.+)/g)].map((m) => m[1].trim());
  if (orphans.length) {
    fail(`${orphans.length} photo${orphans.length > 1 ? 's' : ''} could not be matched to an artist.`, [
      ...orphans.map((f) => `• ${f}`),
      '',
      'A photo\'s filename must start with the artist it belongs to.',
      'For example, a new Gopal Naskar painting should be named:',
      '',
      '      gopal-naskar-5.jpg',
      '',
      'Rename the files above to follow that pattern and run this again.',
      'If this is a brand-new artist, they need a short biography added',
      'first — see the "Adding a new artist" section of README.md.',
    ]);
  }

  // ---- 2. work out what changed -------------------------------------------

  step(2, 'Checking what changed…');

  const after = readCatalog();
  const added = [...after.keys()].filter((id) => !before.has(id));
  const removed = [...before.keys()].filter((id) => !after.has(id));

  if (!added.length && !removed.length) {
    const gitStatus = run('git', ['status', '--porcelain']).stdout.trim();
    if (!gitStatus) {
      say('\n  ✓  Everything is already published — no new paintings found.\n');
      bullet(`Put new photos in:  ${SRC}`);
      say('');
      process.exit(0);
    }
    bullet('No new paintings, but other details changed (titles or descriptions).');
  }

  for (const id of added) {
    const w = after.get(id);
    bullet(`+ added   ${w.artist} — ${w.title || 'untitled'}`);
  }
  for (const id of removed) {
    bullet(`- removed ${before.get(id).artist} — ${before.get(id).title || 'untitled'}`);
  }
  bullet(`Gallery now holds ${after.size} paintings.`);

  // ---- 3. make sure the site still builds ----------------------------------

  step(3, 'Making sure the website still builds…');

  const siteBuild = run('npm', ['run', 'build'], { env: { ...process.env, VITE_BASE: '/' } });
  if (siteBuild.status !== 0) {
    fail('The website failed to build, so nothing was published.', [
      'This usually means a detail in the catalogue is malformed.',
      'The full message was:',
      '',
      ...((siteBuild.stdout || '') + (siteBuild.stderr || '')).trim().split('\n').slice(-25).map((l) => `  ${l}`),
    ]);
  }
  bullet('Builds cleanly.');

  if (NO_PUBLISH) {
    say('\n  ✓  Checked only — nothing published (you passed --no-publish).\n');
    process.exit(0);
  }

  // ---- 4. publish ----------------------------------------------------------

  step(4, 'Publishing');

  const dirty = run('git', ['status', '--porcelain']).stdout.trim();
  if (!dirty) {
    say('\n  ✓  Nothing new to publish — the website is already up to date.\n');
    process.exit(0);
  }

  const ok = await ask('\n      Publish these changes to indusartcollection.com? (y/n) ');
  if (!ok) {
    say('\n  ✓  Left alone. Your photos are prepared but nothing was published.');
    bullet('Run this again whenever you are ready.\n');
    process.exit(0);
  }

  const summary = added.length
    ? `Add ${added.length} new work${added.length > 1 ? 's' : ''} to the gallery`
    : 'Update the gallery catalogue';

  const add = run('git', ['add', '-A']);
  if (add.status !== 0) fail('Could not stage the changes.', [add.stderr.trim()]);

  const commit = run('git', ['commit', '-m', summary]);
  if (commit.status !== 0) {
    fail('Could not save the changes.', [((commit.stdout || '') + (commit.stderr || '')).trim()]);
  }

  const push = run('git', ['push', 'origin', 'main']);
  if (push.status !== 0) {
    fail('Could not upload the changes to GitHub.', [
      ((push.stdout || '') + (push.stderr || '')).trim(),
      '',
      'Your work is saved on this computer. Check your internet',
      'connection and run this again — nothing is lost.',
    ]);
  }

  say('\n  ✓  Published.\n');
  bullet('The website rebuilds itself automatically.');
  bullet('Give it about two minutes, then open:');
  bullet('');
  bullet('      https://indusartcollection.com');
  bullet('');
  bullet('If you still see the old version, press Ctrl+Shift+R to refresh properly.');
  say('');
})();
