import './styles.css';
import catalogData from './data/catalog.json';
import type { Catalog, Work } from './types';
import { site, NAV, CONTACTS, TEXT, NEW_COLLECTION, STYLE_ORDER } from './config';

const catalog = catalogData as Catalog;

// Every view of the collection reads from this. The catalogue is written in
// hanging order when it is built, so nothing needs sorting here.
const allWorks = catalog.works;

/**
 * The paintings named by NEW_COLLECTION in config.ts. Each line is read for the
 * reference numbers in it: two make a range, one names a single painting. The
 * numbers are matched against the catalogue rather than trusted, so a typo
 * quietly drops out instead of breaking the page — and if nothing at all
 * matches, the first twelve works stand in so the section is never empty.
 */
const newCollection = (): Work[] => {
  const chosen: Work[] = [];
  for (const line of NEW_COLLECTION) {
    const refs = line.toUpperCase().match(/IAC-\d+/g);
    if (!refs?.length) continue;
    const first = refs[0]!;
    const last = refs[refs.length - 1]!;
    for (const w of allWorks) {
      if (w.ref >= first && w.ref <= last && !chosen.includes(w)) chosen.push(w);
    }
  }
  return chosen.length ? chosen : allWorks.slice(0, 12);
};

const app = document.getElementById('app')!;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const base = import.meta.env.BASE_URL;
const asset = (p: string) => `${base}${p}`;

// Small counts read better as words in a sentence than as digits. Anything
// larger than the list falls back to the numeral.
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const spell = (n: number) => NUMBER_WORDS[n] ?? String(n);

/**
 * Renders a line of editable wording from config.ts. The text is escaped, so
 * whatever Shefali types is shown literally, then {artists} and {works} are
 * filled in. `vars` carries anything that must stay as markup, such as the
 * email address rendered as a link.
 */
const t = (template: string, vars: Record<string, string> = {}): string => {
  let out = esc(template)
    .replace(/\{artists\}/g, spell(catalog.artistCount))
    .replace(/\{works\}/g, String(catalog.works.length));
  for (const [key, value] of Object.entries(vars)) out = out.split(`{${key}}`).join(value);
  return out;
};

/** The email address as a clickable link, for wording that mentions it. */
const emailLink = () =>
  `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`;

// Prices are never published; every work is quoted individually.
const ON_REQUEST = 'On request';

// Shown once, at the foot of a painting, when its size and medium are not yet
// catalogued. Do not type this into the spreadsheet — the site supplies it.
const DETAILS_ON_REQUEST = 'Details on request';

/** Line under a thumbnail: "24 x 24 in · Acrylic on canvas" etc. */
const workLine = (w: Work) =>
  [w.size, w.medium].filter(Boolean).join('  ·  ') || DETAILS_ON_REQUEST;

// Artists are not named on the website, so a painting is described — and
// identified in an enquiry — by its reference number.
const workAlt = (w: Work) =>
  (w.title ? `${w.title}, painting ${w.ref}` : `Painting ${w.ref}`);

/* ------------------------------------------------------------------ layout */

function header(route: string, query: string): string {
  const links = NAV.map((n) => {
    const active = n.href === route || (n.href !== '#/' && route.startsWith(n.href));
    return `<a href="${n.href}" class="${active ? 'active' : ''}">${n.label}</a>`;
  }).join('');

  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="#/">
          <img src="${asset('logo-mark.png')}" alt="${esc(site.name)} logo" />
          <span class="brand-text">${esc(site.name)}</span>
        </a>
        <div class="header-actions">
          <button class="icon-btn" id="searchToggle" aria-label="Search the collection"
            aria-expanded="false" title="Search">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor"
              stroke-width="1.7" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="M16.2 16.2 21 21" stroke-linecap="round" />
            </svg>
          </button>
          <a class="btn btn-dark btn-small" href="#/register">Register</a>
          <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">☰</button>
        </div>
      </div>
      <nav class="nav" id="nav">${links}<a class="nav-register" href="#/register">Register</a></nav>
      <form class="search-bar" id="searchBar" role="search" hidden>
        <input id="searchInput" type="search" name="q" value="${esc(query)}" autocomplete="off"
          placeholder="Search by reference, style, medium or size — then press Enter" />
        <button class="btn btn-dark btn-small" type="submit">Search</button>
      </form>
    </header>`;
}

// Strips a phone number down to what a dialler will accept.
const telHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, '')}`;

function footer(): string {
  const social = (url: string, label: string, glyph: string) =>
    url ? `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${label}">${glyph}</a>` : '';

  return `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-about">
            <div class="footer-brand">
              <h4>${esc(site.name)}</h4>
              <img src="${asset('logo-mark.png')}" alt="" />
              <p style="margin:0">${esc(site.tagline)}</p>
            </div>
            <p>${t(TEXT.footer.blurb)}</p>
            <div class="socials">
              ${social(site.instagram, 'Instagram', 'IG')}
              ${social(site.facebook, 'Facebook', 'FB')}
            </div>
          </div>
          <div>
            <h4>${t(TEXT.footer.exploreHeading)}</h4>
            <ul>
              <li><a href="#/gallery">Gallery</a> — the full catalogue</li>
              <li><a href="#/about">About</a> — who we are</li>
              <li><a href="#/news">News &amp; Events</a> — exhibitions</li>
            </ul>
          </div>
          <div>
            <h4>${t(TEXT.footer.collectingHeading)}</h4>
            <ul>
              ${TEXT.footer.collecting.map((c) => `<li>${t(c)}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4>${t(TEXT.footer.contactHeading)}</h4>
            <ul class="footer-contacts">
              <li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
              ${CONTACTS.filter((c) => c.phone).map((c) => `
                <li>
                  <b>${esc(c.region)}</b>
                  <a href="${telHref(c.phone!)}">${esc(c.phone!)}</a>
                </li>`).join('')}
              <li><a href="#/contact">${t(TEXT.footer.enquiryLink)}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(site.name)}. All artwork © the respective artists.</span>
          <span>${catalog.works.length} works · ${catalog.artistCount} artists</span>
        </div>
      </div>
    </footer>`;
}

/* ------------------------------------------------------------------- parts */

function artGrid(works: Work[]): string {
  if (!works.length) return `<p style="text-align:center;color:var(--ink-soft)">No works to show.</p>`;
  return `<div class="art-grid">${works.map((w) => `
    <figure class="art-item" data-id="${esc(w.id)}">
      <div class="frame">
        <img src="${asset(w.thumb)}" alt="${esc(workAlt(w))}" loading="lazy" />
      </div>
      <figcaption>
        ${w.title ? `<strong>${esc(w.title)}</strong>` : ''}
        <span class="by">${esc(w.ref)}</span>
        <span class="spec">${esc(workLine(w))}</span>
      </figcaption>
    </figure>`).join('')}</div>`;
}

function enquiryForm(subject: string, message = ''): string {
  const action = site.formspree
    ? `action="${esc(site.formspree)}" method="POST"`
    : `action="mailto:${esc(site.email)}" method="POST" enctype="text/plain"`;
  return `
    <form class="form-card" ${action}>
      <input type="hidden" name="_subject" value="${esc(subject)}" />
      <div class="field"><label for="f-name">${t(TEXT.form.nameLabel)}</label><input id="f-name" name="name" required /></div>
      <div class="field"><label for="f-email">${t(TEXT.form.emailLabel)}</label><input id="f-email" type="email" name="email" required /></div>
      <div class="field"><label for="f-msg">${t(TEXT.form.messageLabel)}</label><textarea id="f-msg" name="message"
        placeholder="${t(TEXT.form.messagePlaceholder)}"
        >${esc(message)}</textarea></div>
      <button class="btn btn-dark" type="submit" style="width:100%">${t(TEXT.form.button)}</button>
      <p class="form-status" hidden></p>
      <p class="privacy">${t(TEXT.form.privacy)}</p>
      ${site.formspree ? '' : `<div class="form-note">Set up is not finished: add your
        Formspree endpoint in <code>src/config.ts</code> so enquiries arrive by email.
        Until then this opens the visitor's mail app.</div>`}
    </form>`;
}

/* ------------------------------------------------------------------- pages */

function homePage(): string {
  const heroImgs = allWorks.slice(0, 8).map(
    (w) => `<img src="${asset(w.thumb)}" alt="" />`).join('');

  const thisWeek = newCollection();

  return `
    <section class="hero">
      <div class="hero-bg">${heroImgs}</div>
      <div class="hero-inner">
        <span class="eyebrow">${t(TEXT.home.eyebrow)}</span>
        <h1>${t(TEXT.home.heading)}</h1>
        <p>${t(TEXT.home.intro)}</p>
        <div class="btn-row">
          <a class="btn btn-light" href="#/gallery">${t(TEXT.home.galleryButton)}</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">${t(TEXT.artists.eyebrow)}</span>
          <h2>${t(TEXT.artists.heading)}</h2>
          <div class="rule"></div>
          <p>${t(TEXT.artists.intro)}</p>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">${t(TEXT.newCollection.eyebrow)}</span>
          <h2>${t(TEXT.newCollection.heading)}</h2>
          <div class="rule"></div>
          <p>${t(TEXT.newCollection.intro)}</p>
        </div>
        ${artGrid(thisWeek)}
        <div class="btn-row" style="margin-top:40px">
          <a class="btn btn-dark" href="#/gallery">${t(TEXT.newCollection.button)}</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">${t(TEXT.register.homeEyebrow)}</span>
          <h2>${t(TEXT.register.heading)}</h2>
          <div class="rule"></div>
          <p>${t(TEXT.register.homeIntro)}</p>
        </div>
        ${enquiryForm('Indus Art Collection — registration')}
      </div>
    </section>`;
}

/** Everything a visitor might reasonably type is matched against. */
const matchesQuery = (w: Work, terms: string[]) => {
  const hay = [w.ref, w.title, w.style, w.medium, w.size, w.year, w.description]
    .join(' ').toLowerCase();
  return terms.every((t) => hay.includes(t));
};

function galleryPage(styleFilter: string, query: string): string {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  // A tab per kind of painting actually in the collection, in the order set in
  // config.ts — a kind with nothing in it shows no tab, and a kind nobody
  // thought to list still gets one, at the end.
  const present = new Set(allWorks.map((w) => w.style));
  const styles = ['All',
    ...STYLE_ORDER.filter((s) => present.has(s)),
    ...Array.from(present).filter((s) => !STYLE_ORDER.includes(s)).sort()];
  const works = allWorks
    .filter((w) => styleFilter === 'All' || w.style === styleFilter)
    .filter((w) => !terms.length || matchesQuery(w, terms));

  const buttons = styles.map((s) =>
    `<button class="filter ${s === styleFilter ? 'active' : ''}" data-style="${esc(s)}">${esc(s)}</button>`
  ).join('');

  const lede = terms.length
    ? `${works.length} work${works.length === 1 ? '' : 's'} matching
       “${esc(query)}”. <a href="#/gallery" class="clear-search">Clear the search</a>`
    : t(TEXT.gallery.intro);

  return `
    <div class="wrap page-head">
      <span class="eyebrow">${t(TEXT.gallery.eyebrow)}</span>
      <h1>${t(TEXT.gallery.heading)}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
    </div>
    <section class="section">
      <div class="wrap">
        <div class="filters">${buttons}</div>
        <div id="galleryWorks">${artGrid(works)}</div>
      </div>
    </section>`;
}

function registerPage(): string {
  return `
    <div class="wrap page-head">
      <span class="eyebrow">${t(TEXT.register.eyebrow)}</span>
      <h1>${t(TEXT.register.heading)}</h1>
      <p class="lede">${t(TEXT.register.lede)}</p>
    </div>
    <section class="section">
      <div class="wrap">${enquiryForm('Indus Art Collection — registration')}</div>
    </section>`;
}

function aboutPage(): string {
  return `
    <div class="wrap page-head">
      <span class="eyebrow">${t(TEXT.about.eyebrow)}</span>
      <h1>${t(TEXT.about.heading)}</h1>
      <p class="lede">${t(TEXT.about.lede)}</p>
    </div>
    <section class="section">
      <div class="wrap prose">
        ${TEXT.about.paragraphs.map((p) => `<p>${t(p)}</p>`).join('')}

        <h3>${t(TEXT.about.offerHeading)}</h3>
        <ul class="info-list">
          ${TEXT.about.offers.map((o) =>
            `<li><b>${t(o.who)}</b><span>${t(o.what)}</span></li>`).join('')}
        </ul>

        ${TEXT.about.sections.map((s) =>
          `<h3>${t(s.heading)}</h3><p>${t(s.body)}</p>`).join('')}

        <div class="btn-row" style="justify-content:flex-start;margin-top:34px">
          <a class="btn btn-dark" href="#/contact">${t(TEXT.about.button)}</a>
        </div>
      </div>
    </section>`;
}

function newsPage(): string {
  return `
    <div class="wrap page-head">
      <span class="eyebrow">${t(TEXT.news.eyebrow)}</span>
      <h1>${t(TEXT.news.heading)}</h1>
      <p class="lede">${t(TEXT.news.lede)}</p>
    </div>
    <section class="section">
      <div class="wrap prose">
        <h3>${t(TEXT.news.itemHeading)}</h3>
        <p>${t(TEXT.news.itemBody)}</p>
        <p style="color:var(--ink-soft)">${t(TEXT.news.note)}</p>
        <div style="margin-top:40px">${enquiryForm('Indus Art Collection — news updates')}</div>
      </div>
    </section>`;
}

function contactPage(workId?: string): string {
  // Arriving from a painting's Enquire Now button, the form already names it.
  const work = workId ? catalog.works.find((w) => w.id === workId) : undefined;
  const subject = work
    ? `Indus Art Collection — enquiry: ${workLabel(work)}`
    : 'Indus Art Collection — enquiry';
  const prefill = work
    ? `I would like to enquire about ${workLabel(work)}${work.size ? ` (${work.size})` : ''}. `
      + 'Please send price, availability and shipping.'
    : '';

  return `
    <div class="wrap page-head">
      <span class="eyebrow">${t(TEXT.contact.eyebrow)}</span>
      <h1>${t(TEXT.contact.heading)}</h1>
      <p class="lede">${t(TEXT.contact.lede)}</p>
      ${work ? `<p class="enquiry-about">Enquiring about
        <strong>${esc(workLabel(work))}</strong>.</p>` : ''}
    </div>
    <section class="section">
      <div class="wrap contact-grid">
        <div class="prose">
          <p class="contact-lead">${t(TEXT.contact.lead, { email: emailLink() })}</p>
          <ul class="info-list">
            <li><b>Email</b><span><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></span></li>
            ${CONTACTS.filter((c) => c.phone).map((c) => `
              <li><b>${esc(c.region)}</b><span><a href="${telHref(c.phone!)}">${esc(c.phone!)}</a></span></li>`).join('')}
          </ul>
          <h3>${t(TEXT.contact.tradeHeading)}</h3>
          <p>${t(TEXT.contact.tradeBody)}</p>
        </div>
        <div>${enquiryForm(subject, prefill)}</div>
      </div>
    </section>`;
}

function notFound(): string {
  return `
    <div class="wrap page-head">
      <h1>${t(TEXT.notFound.heading)}</h1>
      <p class="lede">${t(TEXT.notFound.body)}
        <a href="#/" style="color:var(--gold)">${t(TEXT.notFound.link)}</a>.</p>
    </div>
    <section class="section"></section>`;
}

/* ---------------------------------------------------------------- lightbox */

let lightboxWorks: Work[] = [];
let lightboxIndex = 0;


/** How a work is named in an enquiry — "Nandi (IAC-014)". */
function workLabel(w: Work): string {
  return w.title ? `${w.title} (${w.ref})` : `painting ${w.ref}`;
}

function lightboxMarkup(): string {
  return `
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true">
      <button class="lb-close" id="lbClose" aria-label="Close">×</button>
      <div class="lb-stage" id="lbStage"><img id="lbImg" alt="" /></div>
      <div class="lb-bar">
        <div class="lb-info" id="lbInfo"></div>
        <div class="lb-actions">
          <button class="lb-btn" id="lbPrev">← Prev</button>
          <button class="lb-btn" id="lbZoom">Zoom in</button>
          <button class="lb-btn" id="lbNext">Next →</button>
          <a class="lb-btn lb-btn-gold" id="lbEnquire" href="#/contact">Enquire Now</a>
        </div>
      </div>
    </div>`;
}

function showLightbox(index: number): void {
  const box = document.getElementById('lightbox')!;
  const img = document.getElementById('lbImg') as HTMLImageElement;
  const info = document.getElementById('lbInfo')!;
  const stage = document.getElementById('lbStage')!;
  const w = lightboxWorks[index];
  if (!w) return;

  lightboxIndex = index;
  img.src = asset(w.full);
  img.alt = workAlt(w);
  stage.classList.remove('zoomed');
  stage.scrollTo(0, 0);
  (document.getElementById('lbZoom') as HTMLButtonElement).textContent = 'Zoom in';

  // Anything not yet catalogued is offered on request rather than left blank,
  // so every painting presents the same four lines.
  const row = (label: string, value: string) =>
    `<div class="lb-row"><b>${label}</b><span>${esc(value)}</span></div>`;

  // A painting with nothing catalogued says so once, at the foot of the panel,
  // rather than repeating "On request" against every empty line.
  const known = Boolean(w.medium || w.size);

  info.innerHTML =
    (w.title ? `<strong>${esc(w.title)}</strong>` : '') +
    row('Reference', w.ref) +
    (w.medium ? row('Medium', w.medium) : '') +
    (w.size ? row('Size', w.size) : '') +
    row('Price', ON_REQUEST) +
    (w.description ? `<p class="lb-desc">${esc(w.description)}</p>` : '') +
    (known ? '' : `<p class="lb-note">${DETAILS_ON_REQUEST}</p>`);

  // Carry the painting into the enquiry form so its message names the work.
  (document.getElementById('lbEnquire') as HTMLAnchorElement).href =
    `#/contact?work=${encodeURIComponent(w.id)}`;

  box.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(): void {
  document.getElementById('lightbox')!.classList.remove('open');
  document.body.style.overflow = '';
}

const step = (n: number) =>
  showLightbox((lightboxIndex + n + lightboxWorks.length) % lightboxWorks.length);

function wireLightbox(): void {
  const stage = document.getElementById('lbStage')!;
  const img = document.getElementById('lbImg') as HTMLImageElement;
  const zoomBtn = document.getElementById('lbZoom') as HTMLButtonElement;

  // Zooming widens the picture itself rather than scaling it with a transform:
  // a transform leaves the layout box its old size, so the enlarged edges fall
  // outside the stage with no way to scroll to them.
  const toggleZoom = () => {
    const zoomed = stage.classList.toggle('zoomed');
    zoomBtn.textContent = zoomed ? 'Zoom out' : 'Zoom in';
    if (zoomed) {
      stage.scrollTo((stage.scrollWidth - stage.clientWidth) / 2,
        (stage.scrollHeight - stage.clientHeight) / 2);
    }
  };

  zoomBtn.addEventListener('click', toggleZoom);
  img.addEventListener('click', toggleZoom);
  document.getElementById('lbClose')!.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev')!.addEventListener('click', () => step(-1));
  document.getElementById('lbNext')!.addEventListener('click', () => step(1));
  // the enquiry link leaves the page behind the lightbox, so let go of it first
  document.getElementById('lbEnquire')!.addEventListener('click', closeLightbox);

  // clicking the dark surround closes, whether it lands on the stage or beside it
  const closeOnBackdrop = (e: Event) => { if (e.target === e.currentTarget) closeLightbox(); };
  document.getElementById('lightbox')!.addEventListener('click', closeOnBackdrop);
  stage.addEventListener('click', closeOnBackdrop);
}

// Bound once for the life of the page: rebinding on every render left a stack
// of handlers, and arrow keys then jumped several works at a time.
document.addEventListener('keydown', (e) => {
  const box = document.getElementById('lightbox');
  if (!box?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
});

/** Make every thumbnail on the page open the lightbox. */
function bindThumbs(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('.art-item'));
  lightboxWorks = items
    .map((el) => catalog.works.find((w) => w.id === el.dataset.id))
    .filter((w): w is Work => Boolean(w));

  items.forEach((el, i) => el.addEventListener('click', () => showLightbox(i)));
}

/* ------------------------------------------------------------------ router */

function parseRoute(): { path: string; query: URLSearchParams } {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  return { path: path || '/', query: new URLSearchParams(qs || '') };
}

const onScroll = () =>
  document.getElementById('toTop')?.classList.toggle('show', window.scrollY > 500);
window.addEventListener('scroll', onScroll, { passive: true });

function render(): void {
  const { path, query } = parseRoute();
  const parts = path.split('/').filter(Boolean);

  let body: string;
  let routeKey = `#${path}`;
  const search = query.get('q') || '';

  if (parts.length === 0) body = homePage();
  // the artist pages have been retired; an old link lands on the collection
  else if (parts[0] === 'artists' || parts[0] === 'artist') { body = galleryPage('All', search); routeKey = '#/gallery'; }
  else if (parts[0] === 'gallery') body = galleryPage(query.get('style') || 'All', search);
  else if (parts[0] === 'about') body = aboutPage();
  else if (parts[0] === 'news') body = newsPage();
  else if (parts[0] === 'register') body = registerPage();
  else if (parts[0] === 'contact') body = contactPage(query.get('work') || undefined);
  else body = notFound();

  app.innerHTML = header(routeKey, search) + `<main>${body}</main>` + footer() + lightboxMarkup() +
    `<button class="to-top" id="toTop" aria-label="Back to top">↑</button>`;

  // whatever the last page did, this one starts scrollable
  document.body.style.overflow = '';

  wireLightbox();
  bindThumbs();

  // mobile menu
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  toggle?.addEventListener('click', () => {
    const open = nav!.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));

  // enquiry forms post in the background, so the visitor is thanked in place
  // rather than being sent off to the form service's own page
  if (site.formspree) {
    document.querySelectorAll<HTMLFormElement>('form.form-card').forEach((form) => {
      const status = form.querySelector<HTMLParagraphElement>('.form-status')!;
      const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        button.disabled = true;
        button.textContent = TEXT.form.sending;
        status.hidden = true;
        try {
          const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' },
          });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          status.className = 'form-status ok';
          status.textContent = TEXT.form.thanks;
        } catch {
          status.className = 'form-status bad';
          status.innerHTML = t(TEXT.form.failed, { email: emailLink() });
        } finally {
          status.hidden = false;
          button.disabled = false;
          button.textContent = TEXT.form.button;
        }
      });
    });
  }

  // search: the bar drops out of the header and hands the term to the gallery
  const searchBar = document.getElementById('searchBar') as HTMLFormElement;
  const searchInput = document.getElementById('searchInput') as HTMLInputElement;
  const searchToggle = document.getElementById('searchToggle')!;
  const openSearch = (open: boolean) => {
    searchBar.hidden = !open;
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) searchInput.focus();
  };
  searchToggle.addEventListener('click', () => openSearch(Boolean(searchBar.hidden)));
  searchBar.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = searchInput.value.trim();
    location.hash = q ? `#/gallery?q=${encodeURIComponent(q)}` : '#/gallery';
  });
  // a search already in play keeps its bar open, so the term can be edited
  if (search) openSearch(true);

  // gallery filters, which keep any search term in play
  document.querySelectorAll<HTMLButtonElement>('.filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      const style = btn.dataset.style!;
      const params = new URLSearchParams();
      if (style !== 'All') params.set('style', style);
      if (search) params.set('q', search);
      const qs = params.toString();
      location.hash = qs ? `#/gallery?${qs}` : '#/gallery';
    });
  });

  // scroll to top — the listener is bound once below and finds the fresh button
  document.getElementById('toTop')!
    .addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
