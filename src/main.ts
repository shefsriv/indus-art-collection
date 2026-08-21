import './styles.css';
import catalogData from './data/catalog.json';
import type { Catalog, Work, Artist } from './types';
import { site, NAV, ARTIST_ORDER } from './config';

const catalog = catalogData as Catalog;

/** Artists run in the order Shefali hangs them; unnamed ones follow. */
const artistRank = (slug: string) => {
  const i = ARTIST_ORDER.indexOf(slug);
  return i === -1 ? ARTIST_ORDER.length : i;
};

// Every view of the collection reads from this: artists in the hanging order,
// and within the folk collection the monochrome works before the coloured.
const allWorks = [...catalog.works].sort((a, b) =>
  artistRank(a.artistSlug) - artistRank(b.artistSlug) ||
  Number(b.mono) - Number(a.mono));

const orderedArtists = [...catalog.artists].sort((a, b) =>
  artistRank(a.slug) - artistRank(b.slug));
const app = document.getElementById('app')!;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const base = import.meta.env.BASE_URL;
const asset = (p: string) => `${base}${p}`;

/** Line under a thumbnail: "24 x 24 in · Acrylic on canvas" etc. */
const workLine = (w: Work) =>
  [w.size, w.medium].filter(Boolean).join('  ·  ') || 'Details on request';

// Most works carry no title, and a wall of "Untitled" says nothing — those
// tiles simply lead with the artist's name instead.
const workAlt = (w: Work) => (w.title ? `${w.title} by ${w.artist}` : `Painting by ${w.artist}`);

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
          placeholder="Search by artist, style, medium or size — then press Enter" />
        <button class="btn btn-dark btn-small" type="submit">Search</button>
      </form>
    </header>`;
}

function footer(): string {
  const social = (url: string, label: string, glyph: string) =>
    url ? `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${label}">${glyph}</a>` : '';

  return `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">
              <h4>${esc(site.name)}</h4>
              <img src="${asset('logo-mark.png')}" alt="" />
              <p style="margin:0">${esc(site.tagline)}</p>
            </div>
            <p class="footer-blurb">Curating authentic paintings by Indian artists for
               collectors, galleries, designers and corporate spaces.</p>
            <div class="socials">
              ${social(site.instagram, 'Instagram', 'IG')}
              ${social(site.facebook, 'Facebook', 'FB')}
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><a href="#/artists">Artists</a> — the painters we represent</li>
              <li><a href="#/gallery">Gallery</a> — the full catalogue</li>
              <li><a href="#/about">About</a> — who we are</li>
              <li><a href="#/news">News &amp; Events</a> — exhibitions</li>
            </ul>
          </div>
          <div>
            <h4>Collecting</h4>
            <ul>
              <li>Certificate of Authenticity with every original</li>
              <li>Inquire for pricing and availability</li>
              <li>Trade terms for designers and galleries</li>
              <li>Worldwide shipping arranged</li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>
              <li>${esc(site.location)}</li>
              ${site.phone ? `<li><a href="tel:${esc(site.phone.replace(/[^0-9+]/g, ''))}">${esc(site.phone)}</a></li>` : ''}
              <li><a href="#/contact">Send an enquiry</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(site.name)}. All artwork © the respective artists.</span>
          <span>${catalog.works.length} works · ${catalog.artists.length} artists</span>
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
        <span class="by">${esc(w.artist)}</span>
        <span class="spec">${esc(workLine(w))}</span>
      </figcaption>
    </figure>`).join('')}</div>`;
}

function artistGrid(artists: Artist[]): string {
  return `<div class="artist-grid">${artists.map((a) => `
    <a class="artist-card" href="#/artist/${esc(a.slug)}">
      <div class="frame"><img src="${asset(a.cover)}" alt="Work by ${esc(a.name)}" loading="lazy" /></div>
      <h3>${esc(a.name)}</h3>
      <div class="meta">${esc(a.style)} · ${a.count} work${a.count === 1 ? '' : 's'}</div>
    </a>`).join('')}</div>`;
}

function enquiryForm(subject: string): string {
  const action = site.formspree
    ? `action="${esc(site.formspree)}" method="POST"`
    : `action="mailto:${esc(site.email)}" method="POST" enctype="text/plain"`;
  return `
    <form class="form-card" ${action}>
      <input type="hidden" name="_subject" value="${esc(subject)}" />
      <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" required /></div>
      <div class="field"><label for="f-email">Email</label><input id="f-email" type="email" name="email" required /></div>
      <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message"
        placeholder="Tell us which works interest you, or what you are looking for."></textarea></div>
      <button class="btn btn-dark" type="submit" style="width:100%">Send enquiry</button>
      <p class="form-status" hidden></p>
      <p class="privacy">100% privacy — your details are never shared.</p>
      ${site.formspree ? '' : `<div class="form-note">Set up is not finished: add your
        Formspree endpoint in <code>src/config.ts</code> so enquiries arrive by email.
        Until then this opens the visitor's mail app.</div>`}
    </form>`;
}

/* ------------------------------------------------------------------- pages */

function homePage(): string {
  const heroImgs = allWorks.slice(0, 8).map(
    (w) => `<img src="${asset(w.thumb)}" alt="" />`).join('');

  // multiples of three so the rows stay complete
  const featured = allWorks.filter((w) => w.style !== 'Folk').slice(0, 12);
  const folk = allWorks.filter((w) => w.style === 'Folk').slice(0, 9);

  return `
    <section class="hero">
      <div class="hero-bg">${heroImgs}</div>
      <div class="hero-inner">
        <span class="eyebrow">Est. 2026 · United States</span>
        <h1>Indus Art Collection</h1>
        <p>We curate authentic contemporary, traditional and folk paintings by Indian
           artists — bringing works straight from the studio to collectors, galleries
           and designed spaces around the world.</p>
        <div class="btn-row">
          <a class="btn btn-light" href="#/gallery">View the collection</a>
          <a class="btn btn-light" href="#/artists">Meet the artists</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Our artists</span>
          <h2>The painters we represent</h2>
          <div class="rule"></div>
          <p>Select an artist to see their complete body of work.</p>
        </div>
        ${artistGrid(orderedArtists)}
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Featured</span>
          <h2>Contemporary works</h2>
          <div class="rule"></div>
          <p>Modern paintings from our represented artists. Click any work to enlarge.</p>
        </div>
        ${artGrid(featured)}
        <div class="btn-row" style="margin-top:40px">
          <a class="btn btn-dark" href="#/gallery">See all ${catalog.works.length} works</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Folk &amp; Tribal</span>
          <h2>Painted traditions</h2>
          <div class="rule"></div>
          <p>Madhubani, Warli and allied village traditions, made by artists working
             in forms handed down through generations.</p>
        </div>
        ${artGrid(folk)}
        <div class="btn-row" style="margin-top:40px">
          <a class="btn btn-dark" href="#/gallery?style=Folk">Explore the folk collection</a>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow">Join us</span>
          <h2>Register with us</h2>
          <div class="rule"></div>
          <p>Be first to hear about new arrivals, artist features and exhibitions.</p>
        </div>
        ${enquiryForm('Indus Art Collection — registration')}
      </div>
    </section>`;
}

function artistsPage(): string {
  return `
    <div class="wrap page-head">
      <span class="eyebrow">Artists</span>
      <h1>The painters we represent</h1>
      <p class="lede">${catalog.artists.length} artists working across contemporary,
        traditional and folk idioms. Select a name to open that artist's full collection.</p>
    </div>
    <section class="section"><div class="wrap">${artistGrid(orderedArtists)}</div></section>`;
}

function artistPage(slug: string): string {
  const artist = catalog.artists.find((a) => a.slug === slug);
  if (!artist) return notFound();
  const works = allWorks.filter((w) => w.artistSlug === slug);

  return `
    <div class="wrap page-head">
      <a class="back" href="#/artists">← All artists</a>
      <h1>${esc(artist.name)}</h1>
      <p class="lede">${esc(artist.bio)}</p>
      <div class="meta" style="margin-top:16px;font-size:0.74rem;letter-spacing:0.14em;
        text-transform:uppercase;color:var(--ink-soft)">
        ${esc(artist.style)} · ${works.length} work${works.length === 1 ? '' : 's'}
      </div>
    </div>
    <section class="section">
      <div class="wrap">
        ${artGrid(works)}
        <div class="btn-row" style="margin-top:48px">
          <a class="btn btn-dark" href="#/contact">Enquire about ${esc(artist.name)}</a>
        </div>
      </div>
    </section>`;
}

/** Everything a visitor might reasonably type is matched against. */
const matchesQuery = (w: Work, terms: string[]) => {
  const hay = [w.artist, w.title, w.style, w.medium, w.size, w.year, w.description]
    .join(' ').toLowerCase();
  return terms.every((t) => hay.includes(t));
};

function galleryPage(styleFilter: string, query: string): string {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const styles = ['All', ...Array.from(new Set(allWorks.map((w) => w.style)))];
  const works = allWorks
    .filter((w) => styleFilter === 'All' || w.style === styleFilter)
    .filter((w) => !terms.length || matchesQuery(w, terms));

  const buttons = styles.map((s) =>
    `<button class="filter ${s === styleFilter ? 'active' : ''}" data-style="${esc(s)}">${esc(s)}</button>`
  ).join('');

  const lede = terms.length
    ? `${works.length} work${works.length === 1 ? '' : 's'} matching
       “${esc(query)}”. <a href="#/gallery" class="clear-search">Clear the search</a>`
    : `${catalog.works.length} paintings across contemporary, traditional and folk
       traditions. Click any work to view it large and zoom in.`;

  return `
    <div class="wrap page-head">
      <span class="eyebrow">Catalogue</span>
      <h1>The collection</h1>
      <p class="lede">${lede}</p>
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
      <span class="eyebrow">Register</span>
      <h1>Register with us</h1>
      <p class="lede">Join the collection's list to hear first about new arrivals,
        artist features and exhibitions. We write occasionally and never share
        your details.</p>
    </div>
    <section class="section">
      <div class="wrap">${enquiryForm('Indus Art Collection — registration')}</div>
    </section>`;
}

function aboutPage(): string {
  return `
    <div class="wrap page-head">
      <span class="eyebrow">About</span>
      <h1>About Indus Art Collection</h1>
      <p class="lede">A family venture built on a simple conviction: that the best
        Indian painting deserves a wider audience, and that artists deserve a fair
        and direct route to it.</p>
    </div>
    <section class="section">
      <div class="wrap prose">
        <p>Indus Art Collection curates original paintings by Indian artists — the
           contemporary studio painters and the folk and tribal masters carrying
           forward Madhubani, Warli and allied traditions.</p>
        <p>We work directly with the artists. Every painting in the collection is an
           original, sourced from the studio rather than a secondary market, and every
           original is sold with a Certificate of Authenticity.</p>

        <h3>What we offer</h3>
        <ul class="info-list">
          <li><b>Collectors</b><span>Original works with full provenance, framing advice and
            shipping arranged worldwide.</span></li>
          <li><b>Designers</b><span>Curated selections for corporate offices, hospitality and
            residential projects, with trade terms available.</span></li>
          <li><b>Galleries</b><span>Guest exhibitions and representation for a specialised
            regional collection.</span></li>
        </ul>

        <h3>Authenticity</h3>
        <p>Each original is accompanied by a signed Certificate of Authenticity recording
           the artist, title, medium, dimensions and year. Digital copies are available
           on request.</p>

        <h3>Pricing</h3>
        <p>Because works vary widely in scale and medium we price on enquiry. Tell us
           which pieces interest you and we will come back with price, availability and
           shipping.</p>

        <div class="btn-row" style="justify-content:flex-start;margin-top:34px">
          <a class="btn btn-dark" href="#/contact">Get in touch</a>
        </div>
      </div>
    </section>`;
}

function newsPage(): string {
  return `
    <div class="wrap page-head">
      <span class="eyebrow">News &amp; Events</span>
      <h1>News &amp; Events</h1>
      <p class="lede">Exhibitions, new arrivals and artist features.</p>
    </div>
    <section class="section">
      <div class="wrap prose">
        <h3>The collection goes online</h3>
        <p>Indus Art Collection opens with ${catalog.works.length} works by
           ${catalog.artists.length} artists, spanning contemporary canvases and a large
           collection of folk and tribal painting.</p>
        <p style="color:var(--ink-soft)">Exhibition dates and gallery events will be
           announced here. Register below to be notified.</p>
        <div style="margin-top:40px">${enquiryForm('Indus Art Collection — news updates')}</div>
      </div>
    </section>`;
}

function contactPage(): string {
  return `
    <div class="wrap page-head">
      <span class="eyebrow">Contact</span>
      <h1>Enquiries</h1>
      <p class="lede">Tell us which works interest you and we will reply with price,
        availability and shipping. We welcome collectors, interior designers, galleries
        and corporate buyers.</p>
    </div>
    <section class="section">
      <div class="wrap" style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start">
        <div class="prose">
          <h3>Reach us directly</h3>
          <ul class="info-list">
            <li><b>Email</b><span><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></span></li>
            <li><b>Based in</b><span>${esc(site.location)}</span></li>
            ${site.phone ? `<li><b>Phone</b><span><a href="tel:${esc(site.phone.replace(/[^0-9+]/g, ''))}">${esc(site.phone)}</a></span></li>` : ''}
          </ul>
          <h3>Trade &amp; corporate</h3>
          <p>We work with interior designers, art consultants and corporate art
             programmes on curated sourcing, with trade terms available. Mention your
             project in the message and we will send our trade pack.</p>
        </div>
        <div>${enquiryForm('Indus Art Collection — enquiry')}</div>
      </div>
    </section>`;
}

function notFound(): string {
  return `
    <div class="wrap page-head">
      <h1>Page not found</h1>
      <p class="lede">That page does not exist. <a href="#/" style="color:var(--gold)">Return home</a>.</p>
    </div>
    <section class="section"></section>`;
}

/* ---------------------------------------------------------------- lightbox */

let lightboxWorks: Work[] = [];
let lightboxIndex = 0;

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
          <a class="lb-btn" id="lbEnquire" href="#/contact">Inquire</a>
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

  const bits = [w.artist, w.size, w.medium, w.year].filter(Boolean).join('  ·  ');
  info.innerHTML = (w.title ? `<strong>${esc(w.title)}</strong>` : '') + `<span>${esc(bits)}</span>` +
    (w.description ? `<span style="display:block;margin-top:6px">${esc(w.description)}</span>` : '');

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
  else if (parts[0] === 'artists') body = artistsPage();
  else if (parts[0] === 'artist' && parts[1]) { body = artistPage(parts[1]); routeKey = '#/artists'; }
  else if (parts[0] === 'gallery') body = galleryPage(query.get('style') || 'All', search);
  else if (parts[0] === 'about') body = aboutPage();
  else if (parts[0] === 'news') body = newsPage();
  else if (parts[0] === 'register') body = registerPage();
  else if (parts[0] === 'contact') body = contactPage();
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
        button.textContent = 'Sending…';
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
          status.textContent = 'Thank you — your message is on its way. We will be in touch shortly.';
        } catch {
          status.className = 'form-status bad';
          status.innerHTML = `Sorry, that did not send. Please email us at
            <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.`;
        } finally {
          status.hidden = false;
          button.disabled = false;
          button.textContent = 'Send enquiry';
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
