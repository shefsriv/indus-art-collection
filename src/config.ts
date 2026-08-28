// Everything Shefali is likely to want to change lives here.

export const site = {
  name: 'Indus Art Collection',
  tagline: 'Contemporary, Traditional & Folk Art',

  // The general business address. Enquiry forms and any "email us" link on the
  // site use this one, so a personal address never appears publicly.
  email: 'info@indusartcollection.com',

  instagram: '',
  facebook: '',

  // Paste the Formspree endpoint here once the form is created at
  // https://formspree.io — it looks like https://formspree.io/f/abcdwxyz
  // Until then both forms fall back to opening the visitor's email client.
  formspree: 'https://formspree.io/f/xjyvbwpa',
};

// ===========================================================================
// EVERY WORD ON THE WEBSITE
//
// All the wording on every page is below, page by page, in the order a
// visitor meets it. Change the text between the quote marks, save, and run
//
//     npm.cmd run add-art
//
// RULES
//   • Keep the quote marks '  ' around the text and the comma at the end.
//   • A long sentence is split across lines joined by  +  . Each piece keeps
//     its own quotes, and needs a space before the closing quote or the words
//     run together:      'first part '  +  'second part'
//   • If a line has an apostrophe in it, write \' — as in  'artist\'s work'.
//   • Two words fill themselves in, so they stay right for ever:
//         {artists}   the number of artists, in words — "nine"
//         {works}     the number of paintings, in figures — "100"
//     Leave them out if you would rather not mention a number.
//
// If you break something the site will not build, and `add-art` refuses to
// publish — the live website cannot be damaged by an edit here.
// ===========================================================================
export const TEXT = {
  // ---- HOME PAGE, the big banner at the top ----
  home: {
    eyebrow: 'Est. 2026 · United States',
    heading: 'Indus Art Collection',
    intro: 'We curate authentic contemporary, traditional and folk paintings by '
      + 'Indian artists — bringing works straight from the studio to collectors, '
      + 'galleries and designed spaces around the world.',
    galleryButton: 'View the collection',
    artistsButton: 'Meet the artists',
  },

  // ---- The artists section, shown on the home page AND the Artists page ----
  artists: {
    eyebrow: 'Our artists',      // the small label on the home page
    pageEyebrow: 'Artists',      // the small label on the Artists page
    heading: 'The painters we represent',
    intro: 'Our collection brings together contemporary, traditional and folk '
      + 'paintings, promoting artists from India and giving them an international '
      + 'platform to showcase their work. Please select an artist to see their '
      + 'complete collection.',
  },

  // ---- HOME PAGE, the contemporary paintings section ----
  featured: {
    eyebrow: 'Featured',
    heading: 'Contemporary works',
    intro: 'Modern paintings from our represented artists. Click any work to enlarge.',
    button: 'See all {works} works',
  },

  // ---- HOME PAGE, the folk and tribal section ----
  folk: {
    eyebrow: 'Folk & Tribal',
    heading: 'Painted traditions',
    intro: 'Madhubani, Warli and allied village traditions, made by artists working '
      + 'in forms handed down through generations.',
    button: 'Explore the folk collection',
  },

  // ---- THE SEARCH BAR, behind the magnifying glass in the header ----
  search: {
    // The first choice in the style dropdown, meaning "do not narrow by style".
    // The others — Contemporary, Traditional, Folk — come from the paintings
    // themselves, so a new style appears here on its own.
    allStyles: 'All paintings',
    styleLabel: 'Painting style',
    placeholder: 'Or search by artist, medium or size — then press Enter',
    button: 'Search',
  },

  // ---- GALLERY PAGE ----
  gallery: {
    eyebrow: 'Catalogue',
    heading: 'The collection',
    intro: '{works} paintings across contemporary, traditional and folk traditions. '
      + 'Click any work to view it large and zoom in.',
  },

  // ---- ABOUT PAGE ----
  about: {
    eyebrow: 'About',
    heading: 'About Indus Art Collection',
    lede: 'A family venture built on a simple conviction: that the best Indian '
      + 'painting deserves a wider audience, and that artists deserve a fair and '
      + 'direct route to it.',
    // Each line between the square brackets is one paragraph. Add or remove
    // paragraphs by adding or removing lines, keeping the quotes and comma.
    paragraphs: [
      'Indus Art Collection curates original paintings by Indian artists — the '
        + 'contemporary studio painters and the folk and tribal masters carrying '
        + 'forward Madhubani, Warli and allied traditions.',
      'We work directly with the artists. Every painting in the collection is an '
        + 'original, sourced from the studio rather than a secondary market, and '
        + 'every original is sold with a Certificate of Authenticity.',
    ],
    offerHeading: 'What we offer',
    // One line per audience: who they are, then what they get.
    offers: [
      { who: 'Collectors', what: 'Original works with full provenance, framing advice '
        + 'and shipping arranged worldwide.' },
      { who: 'Designers', what: 'Curated selections for corporate offices, hospitality '
        + 'and residential projects, with trade terms available.' },
      { who: 'Galleries', what: 'Guest exhibitions and representation for a specialised '
        + 'regional collection.' },
    ],
    // Any number of further sections, each a heading and a paragraph.
    sections: [
      { heading: 'Authenticity', body: 'Each original is accompanied by a signed '
        + 'Certificate of Authenticity recording the artist, title, medium, '
        + 'dimensions and year. Digital copies are available on request.' },
      { heading: 'Pricing', body: 'Because works vary widely in scale and medium we '
        + 'price on enquiry. Tell us which pieces interest you and we will come back '
        + 'with price, availability and shipping.' },
    ],
    button: 'Get in touch',
  },

  // ---- NEWS & EVENTS PAGE ----
  news: {
    eyebrow: 'News & Events',
    heading: 'News & Events',
    lede: 'Exhibitions, new arrivals and artist features.',
    itemHeading: 'The collection goes online',
    itemBody: 'Indus Art Collection opens with {works} works by {artists} artists, '
      + 'spanning contemporary canvases and a large collection of folk and tribal '
      + 'painting.',
    note: 'Exhibition dates and gallery events will be announced here. Register below '
      + 'to be notified.',
  },

  // ---- REGISTER PAGE, and the sign-up section at the foot of the home page ----
  register: {
    eyebrow: 'Register',
    heading: 'Register with us',
    lede: 'Join the collection\'s list to hear first about new arrivals, artist '
      + 'features and exhibitions. We write occasionally and never share your details.',
    homeEyebrow: 'Join us',
    homeIntro: 'Be first to hear about new arrivals, artist features and exhibitions.',
  },

  // ---- CONTACT PAGE ----
  contact: {
    eyebrow: 'Contact',
    heading: 'Enquiries',
    lede: 'Tell us which works interest you and we will reply with price, '
      + 'availability and shipping. We welcome collectors, interior designers, '
      + 'galleries and corporate buyers.',
    // {email} is replaced by your email address as a clickable link.
    lead: 'Write to us at {email}, or call whichever office is nearer to you.',
    tradeHeading: 'Trade & corporate',
    tradeBody: 'We work with interior designers, art consultants and corporate art '
      + 'programmes on curated sourcing, with trade terms available. Mention your '
      + 'project in the message and we will send our trade pack.',
  },

  // ---- THE FOOTER, at the bottom of every page ----
  footer: {
    blurb: 'Curating authentic paintings by Indian artists for collectors, galleries, '
      + 'designers and corporate spaces.',
    exploreHeading: 'Explore',
    collectingHeading: 'Collecting',
    // One line per point in the Collecting column.
    collecting: [
      'Certificate of Authenticity with every original',
      'Inquire for pricing and availability',
      'Trade terms for designers and galleries',
      'Worldwide shipping arranged',
    ],
    contactHeading: 'Contact',
    enquiryLink: 'Send an enquiry',
  },

  // ---- The enquiry form, wherever it appears ----
  form: {
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Message',
    messagePlaceholder: 'Tell us which works interest you, or what you are looking for.',
    button: 'Send enquiry',
    privacy: '100% privacy — your details are never shared.',
    sending: 'Sending…',
    thanks: 'Thank you — your message is on its way. We will be in touch shortly.',
    failed: 'Sorry, that did not send. Please email us at {email}.',
  },

  // ---- Shown if someone follows a broken link ----
  notFound: {
    heading: 'Page not found',
    body: 'That page does not exist.',
    link: 'Return home',
  },
};

// Where a visitor can telephone, by country. Shown on the contact page and in
// the footer of every page; add or remove an entry and both update themselves.
// Every written enquiry goes to `site.email` above, so the individual
// mailboxes (shefali@ and abhishek@) are deliberately not published here.
export type Contact = {
  region: string;
  phone?: string;
};

export const CONTACTS: Contact[] = [
  { region: 'United States', phone: '602-741-4861' },
  { region: 'India', phone: '+91 7800353989' },
];

// The order artists are hung in wherever the whole collection is shown — the
// Gallery "All" view, the home page and the artists list. Any artist missing
// from this list follows the named ones, alphabetically.
export const ARTIST_ORDER = [
  'umesh-kumar-saxena',
  'kandan-g',
  'nirakar-chowdhury',
  'ashok-rathod',
  'gopal-naskar',
  'umendra-p-singh',
  'm-salim',
  'folk-tribal-masters',
  'n-k-mishra',
];

export const NAV = [
  { label: 'Home', href: '#/' },
  { label: 'Artists', href: '#/artists' },
  { label: 'Gallery', href: '#/gallery' },
  { label: 'About', href: '#/about' },
  { label: 'News & Events', href: '#/news' },
  { label: 'Contact', href: '#/contact' },
];
