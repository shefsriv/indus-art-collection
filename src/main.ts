import './styles.css';
import catalogData from './data/catalog.json';
import type { Catalog, Work, Artist } from './types';
import { site, NAV } from './config';

const catalog = catalogData as Catalog;
const app = document.getElementById('app')!;

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const base = import.meta.env.BASE_URL;
const asset = (p: string) => `${base}${p}`;

/** Line under a thumbnail: "Untitled · 24 x 24 in" etc. */
const workLine = (w: Work) =>
  [w.size, w.medium].filter(Boolean).join('  ·  ') || 'Details on request';

const workTitle = (w: Work) => w.title || 'Untitled';

/* ------------------------------------------------------------------ layout */

function header(route: string): string {
  const links = NAV.map((n) => {
    const active = n.href === route || (n.href !== '#/' && route.startsWith(n.href));
    return `<a href="${n.href}" class="${active ? 'active' : ''}">${n.label}</a>`;
  }).join('');

  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="#/">
          <img src="${asset('logo.png')}" alt="${esc(site.name)} logo" />
          <span class="brand-text">Indus Art<small>Collection</small></span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false">☰</button>
        <nav class="nav" id="nav">${links}</nav>
      </div>
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
              <img src="${asset('logo.png')}" alt="" />
              <div>
                <h4 style="margin-bottom:6px">${esc(site.name)}</h4>
                <p style="margin:0">${esc(site.tagline)}</p>
              </div>
            </div>
            <p>Curating authentic paintings by Indian artists for collectors,
               galleries, designers and corporate spaces.</p>
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
              ${site.phone ? `<li>${esc(site.phone)}</li>` : ''}
              <li>${esc(site.location)}</li>
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
      <img src="${asset(w.thumb)}" alt="${esc(workTitle(w))} by ${esc(w.artist)}" loading="lazy" />
      <figcaption>
        <strong>${esc(workTitle(w))}</strong>
        <span>${esc(w.artist)} · ${esc(workLine(w))}</span>
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
      <p class="privacy">100% privacy — your details are never shared.</p>
      ${site.formspree ? '' : `<div class="form-note">Set up is not finished: add your
        Formspree endpoint in <code>src/config.ts</code> so enquiries arrive by email.
        Until then this opens the visitor's mail app.</div>`}
    </form>`;
}

/* ------------------------------------------------------------------- pages */

function homePage(): string {
  const heroImgs = catalog.works.slice(0, 8).map(
    (w) => `<img src="${asset(w.thumb)}" alt="" />`).join('');

  const featured = catalog.works.filter((w) => w.style !== 'Folk').slice(0, 12);
  const folk = catalog.works.filter((w) => w.style === 'Folk').slice(0, 8);

  return `
    <section class="hero">
      <div class="hero-bg">${heroImgs}</div>
      <div class="hero-inner">
        <span class="eyebrow">Est. 2025 · India</span>
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
        ${artistGrid(catalog.artists)}
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
      <p class="lede">Ten artists working across contemporary, traditional and folk
        idioms. Select a name to open that artist's full collection.</p>
    </div>
    <section class="section"><div class="wrap">${artistGrid(catalog.artists)}</div></section>`;
}

function artistPage(slug: string): string {
  const artist = catalog.artists.find((a) => a.slug === slug);
  if (!artist) return notFound();
  const works = catalog.works.filter((w) => w.artistSlug === slug);

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

function galleryPage(styleFilter: string): string {
  const styles = ['All', ...Array.from(new Set(catalog.works.map((w) => w.style)))];
  const works = styleFilter === 'All'
    ? catalog.works
    : catalog.works.filter((w) => w.style === styleFilter);

  const buttons = styles.map((s) =>
    `<button class="filter ${s === styleFilter ? 'active' : ''}" data-style="${esc(s)}">${esc(s)}</button>`
  ).join('');

  return `
    <div class="wrap page-head">
      <span class="eyebrow">Catalogue</span>
      <h1>The collection</h1>
      <p class="lede">${catalog.works.length} paintings across contemporary, traditional
        and folk traditions. Click any work to view it large and zoom in.</p>
    </div>
    <section class="section">
      <div class="wrap">
        <div class="filters">${buttons}</div>
        <div id="galleryWorks">${artGrid(works)}</div>
      </div>
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
           contemporary studio painters working in Lucknow, Bengal and the south, and
           the folk and tribal masters carrying forward Madhubani, Warli and allied
           traditions.</p>
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
            ${site.phone ? `<li><b>Phone</b><span>${esc(site.phone)}</span></li>` : ''}
            <li><b>Based in</b><span>${esc(site.location)}</span></li>
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
  img.alt = `${workTitle(w)} by ${w.artist}`;
  stage.classList.remove('zoomed');
  img.style.transform = '';
  (document.getElementById('lbZoom') as HTMLButtonElement).textContent = 'Zoom in';

  const bits = [w.artist, w.size, w.medium, w.year].filter(Boolean).join('  ·  ');
  info.innerHTML = `<strong>${esc(workTitle(w))}</strong><span>${esc(bits)}</span>` +
    (w.description ? `<span style="display:block;margin-top:6px">${esc(w.description)}</span>` : '');

  box.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(): void {
  document.getElementById('lightbox')!.classList.remove('open');
  document.body.style.overflow = '';
}

function wireLightbox(): void {
  const stage = document.getElementById('lbStage')!;
  const img = document.getElementById('lbImg') as HTMLImageElement;
  const zoomBtn = document.getElementById('lbZoom') as HTMLButtonElement;

  const toggleZoom = () => {
    const zoomed = stage.classList.toggle('zoomed');
    img.style.transform = zoomed ? 'scale(1.9)' : '';
    zoomBtn.textContent = zoomed ? 'Zoom out' : 'Zoom in';
  };

  zoomBtn.addEventListener('click', toggleZoom);
  img.addEventListener('click', toggleZoom);
  document.getElementById('lbClose')!.addEventListener('click', closeLightbox);
  document.getElementById('lbPrev')!.addEventListener('click', () =>
    showLightbox((lightboxIndex - 1 + lightboxWorks.length) % lightboxWorks.length));
  document.getElementById('lbNext')!.addEventListener('click', () =>
    showLightbox((lightboxIndex + 1) % lightboxWorks.length));

  document.getElementById('lightbox')!.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox')!.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox((lightboxIndex - 1 + lightboxWorks.length) % lightboxWorks.length);
    if (e.key === 'ArrowRight') showLightbox((lightboxIndex + 1) % lightboxWorks.length);
  });
}

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

function render(): void {
  const { path, query } = parseRoute();
  const parts = path.split('/').filter(Boolean);

  let body: string;
  let routeKey = `#${path}`;

  if (parts.length === 0) body = homePage();
  else if (parts[0] === 'artists') body = artistsPage();
  else if (parts[0] === 'artist' && parts[1]) { body = artistPage(parts[1]); routeKey = '#/artists'; }
  else if (parts[0] === 'gallery') body = galleryPage(query.get('style') || 'All');
  else if (parts[0] === 'about') body = aboutPage();
  else if (parts[0] === 'news') body = newsPage();
  else if (parts[0] === 'contact') body = contactPage();
  else body = notFound();

  app.innerHTML = header(routeKey) + `<main>${body}</main>` + footer() + lightboxMarkup() +
    `<button class="to-top" id="toTop" aria-label="Back to top">↑</button>`;

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

  // gallery filters
  document.querySelectorAll<HTMLButtonElement>('.filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      const style = btn.dataset.style!;
      location.hash = style === 'All' ? '#/gallery' : `#/gallery?style=${encodeURIComponent(style)}`;
    });
  });

  // scroll to top
  const toTop = document.getElementById('toTop')!;
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const onScroll = () => toTop.classList.toggle('show', window.scrollY > 500);
  window.removeEventListener('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', render);
render();
