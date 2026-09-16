// Everything Shefali is likely to want to change lives here.

export const site = {
  name: 'Indus Art Collection',

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
    eyebrow: 'Est. 2020 · United States',
    heading: 'Indus Art Collection',
    intro: 'We curate authentic contemporary, traditional and folk paintings by '
      + 'Indian artists — bringing works straight from the studio to collectors, '
      + 'galleries and designed spaces around the world.',
    galleryButton: 'View the collection',
  },

  // ---- The painters section on the home page ----
  artists: {
    eyebrow: 'Our collection',
    heading: 'The artwork we present',
    intro: 'Our collection brings together paintings in many styles by various '
      + 'artists, promoting painters from India and giving them an international '
      + 'platform to showcase their work. Every painting carries a reference '
      + 'number — quote it in an enquiry and we will send you the full details.',
    button: 'Meet the artists',
  },

  // ---- MEET THE ARTISTS PAGE ----
  // The artists themselves — names, styles and biographies — are written in
  // scripts/metadata.cjs; this is only the wording around them.
  artistsPage: {
    eyebrow: 'Artists',
    heading: 'Meet the Artists',
    lede: 'The painters behind the collection — each working in their own idiom, '
      + 'from studio abstraction to living folk traditions.',
    // Shown under each artist; {count} becomes the number of their paintings.
    worksLink: 'View all {count} works',
    // On an individual artist's page
    backLink: 'All artists',
    worksHeading: 'Works in the collection',
  },

  // ---- Under every painting in the gallery ----
  tile: {
    enquire: 'Enquire',
  },

  // ---- The enlarged view of a painting ----
  lightbox: {
    // Shown beside a certificate seal, under the painting's details.
    certified: 'Certified and authenticated by the artist. Sold with a signed '
      + 'Certificate of Authenticity.',
  },

  // ---- HOME PAGE, this week's paintings ----
  // Which paintings appear here is set by NEW_COLLECTION further down.
  newCollection: {
    eyebrow: 'This week',
    heading: 'New Collection',
    intro: 'A changing selection from the collection, shown here first. '
      + 'Click any work to enlarge.',
    button: 'See the full collection',
  },

  // ---- GALLERY PAGE ----
  gallery: {
    eyebrow: 'Catalogue',
    heading: 'The collection',
    // Left empty on purpose: the page opens straight onto the paintings. Put a
    // sentence back between the quote marks and it appears under the heading.
    intro: '',
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
    itemBody: 'Indus Art Collection opens with a collection by various artists, '
      + 'spanning contemporary canvases and a large collection of folk and tribal '
      + 'painting.',
    note: 'Exhibition dates and gallery events will be announced here. Register below '
      + 'to be notified.',
  },

  // ---- FAQ PAGE ----
  // Questions are shown in groups, each group under its own small heading.
  // Every question is  { q: 'the question', a: 'the answer' },  and a group is
  // a heading plus a list of questions. Add, remove or reorder freely, keeping
  // the quotes, the curly brackets and the commas.
  faq: {
    eyebrow: 'FAQ',
    heading: 'Frequently Asked Questions',
    lede: 'Everything you might want to know about the collection, choosing a '
      + 'work, and how it reaches you.',
    groups: [
      { heading: 'About Indus Art Collection', items: [
        { q: 'What makes Indus Art Collection different?',
          a: 'We bring authentic, handcrafted artwork from talented artists in India '
            + 'to collectors and art lovers in the U.S. and internationally. Our goal '
            + 'is to give local artists an international platform while helping you '
            + 'discover art with beauty, character, and a story.' },
        { q: 'Where does your artwork come from?',
          a: 'Our collection features artwork sourced from artists and galleries in '
            + 'India, representing a range of Modern, Contemporary, cultural, '
            + 'traditional, landscape, folk-inspired, and other artistic styles.' },
        { q: 'Is the artwork handmade?',
          a: 'Our collection focuses on authentic, handcrafted artwork, with '
            + 'techniques and materials varying by artist. Artwork-specific details '
            + 'are provided whenever available.' },
        { q: 'What am I buying when I purchase artwork?',
          a: 'You are purchasing more than décor—you are investing in a curated, '
            + 'handcrafted piece of art created by an artist. Like fine jewelry or a '
            + 'luxury piece, original art is chosen for its craftsmanship and '
            + 'individuality, but it can also become a family heirloom—part of your '
            + 'family\'s story today, and something your children can enjoy and pass '
            + 'on to future generations.' },
        { q: 'Do I receive a Certificate of Authenticity?',
          a: 'Yes. Every original is sold with a signed Certificate of Authenticity '
            + 'recording the artist, title, medium, dimensions, and year. Digital '
            + 'copies are available on request.' },
      ] },
      { heading: 'Choosing artwork', items: [
        { q: 'Can you help me choose the right artwork?',
          a: 'Absolutely! Our art consultation service can help you select artwork '
            + 'based on your space, décor, colors, style, size, and budget.' },
        { q: 'Can I share a photo of my space?',
          a: 'Yes. Send us a photo of your room or wall, along with the approximate '
            + 'dimensions, and we can help you explore artwork that complements your '
            + 'space.' },
        { q: 'Do you offer customized sizes?',
          a: 'Yes, custom sizes may be available for selected artwork. Contact us '
            + 'with your requirements, and we will check with the artist and provide '
            + 'options and pricing.' },
        { q: 'Can you source artwork that isn\'t on your website?',
          a: 'Yes. Through our relationships with artists and galleries in India and '
            + 'other markets, we may be able to source artwork based on your '
            + 'preferred style, subject, size, colors, medium, or budget.' },
        { q: 'How is artwork priced, and how do I buy?',
          a: 'Because works vary widely in size and medium, every painting is priced '
            + 'on enquiry. Tell us the reference number of the piece that interests '
            + 'you and we will reply with the price, availability, and shipping '
            + 'options, then arrange payment and delivery with you directly.' },
      ] },
      { heading: 'Delivery and framing', items: [
        { q: 'How long does it take to receive my artwork?',
          a: 'Please allow approximately 8 weeks (about 2 months) from order to '
            + 'delivery, as each piece travels from India and is prepared for you '
            + 'before it is delivered. We recommend planning ahead for gifts, '
            + 'special occasions, and design projects.' },
        { q: 'Do you ship outside the U.S.?',
          a: 'Yes. We arrange shipping worldwide. Delivery times and framing '
            + 'arrangements vary by destination, so contact us with your location '
            + 'and we will confirm the details before you order.' },
        { q: 'Can I order artwork for a specific deadline?',
          a: 'Yes. Please contact us before placing your order with your required '
            + 'date. We will confirm whether the artwork can be delivered within your '
            + 'timeframe.' },
        { q: 'Will my painting arrive framed?',
          a: 'Yes. When framing is included or requested, your artwork is delivered '
            + 'framed and ready to hang. We select a frame that complements the '
            + 'work, so there is nothing for you to arrange.' },
        { q: 'Can I choose the frame myself?',
          a: 'For most works we take care of framing for you. For selected '
            + 'higher-value pieces we are happy to discuss framing options that suit '
            + 'both the artwork and your space—just ask when you enquire.' },
        { q: 'What if my artwork arrives damaged?',
          a: 'Every piece is packed carefully and inspected before delivery. If it '
            + 'arrives damaged, contact us within 48 hours with photographs and we '
            + 'will put it right.' },
      ] },
      { heading: 'Designers, hotels and businesses', items: [
        { q: 'Do you work with interior designers and architects?',
          a: 'Yes. We can source individual pieces or curate collections for '
            + 'residential, commercial, hospitality, and design projects based on '
            + 'style, size, theme, quantity, and budget.' },
        { q: 'Do you offer artwork for hotels and businesses?',
          a: 'Yes. We can source artwork for hotels, restaurants, corporate offices, '
            + 'luxury residences, healthcare spaces, and other commercial '
            + 'environments, including larger coordinated collections.' },
      ] },
      { heading: 'Offers and getting started', items: [
        { q: 'Do you offer discounts?',
          a: 'We periodically offer special promotions around major Indian festivals '
            + 'and special occasions. Follow us or check our website for current '
            + 'offers.' },
        { q: 'How do I get started?',
          a: 'Browse our collection and find something that speaks to you. If you '
            + 'need help, send us a photo of your space or contact us for a '
            + 'personalized art consultation—we would love to help.' },
      ] },
    ],
    exploreButton: 'Explore the Collection',
    consultButton: 'Request an Art Consultation',
    // The message the enquiry form starts with when someone clicks the
    // consultation button above.
    consultPrefill: 'I would like to request an art consultation. ',
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
    // The very last line of every page, bottom right.
    artistsLine: 'Original paintings by various artists',
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

// ===========================================================================
// THIS WEEK'S NEW COLLECTION
//
// The paintings shown in the "New Collection" section on the home page. Change
// this whenever you want to put a different artist forward — once a week, or
// whenever new work arrives.
//
// Write the reference numbers from `Painting Reference List.md`. A range needs
// its first and last number; a single painting needs only its own:
//
//     'IAC-001 - IAC-008',      a whole artist
//     'IAC-042',                one painting
//
// Add as many lines as you like, each in quotes and ending with a comma. They
// appear in the order you list them. If none of the numbers can be found the
// section falls back to the first twelve paintings, so the page is never bare.
// ===========================================================================
export const NEW_COLLECTION = [
  // September 2026 arrivals
  'IAC-007 - IAC-010',   // Umesh Kumar Saxena — four new two-panel works
  'IAC-017 - IAC-020',   // Kandan G — four new works
  'IAC-060 - IAC-067',   // Santosh Kumar Shandilya — Varanasi ghats
  'IAC-068 - IAC-071',   // Swapon Roy — Buddha
  'IAC-072 - IAC-082',   // the portraits (artist to be confirmed)
];

// The gallery's tabs, in the order they are shown. A tab appears only when
// there are paintings of that kind, so a new one can be listed here before the
// first painting arrives. Anything not listed follows at the end.
// A painting's kind is set per artist, in `scripts/metadata.cjs`.
export const STYLE_ORDER = [
  'Abstract',
  'Modern',
  'Impressionism',
  'Realism',
  'Contemporary',
  'Traditional Folk Art',
];

// The order the paintings hang in is set in `scripts/metadata.cjs`, alongside
// the artists themselves, so that no painter's name reaches the website.

export const NAV = [
  { label: 'Home', href: '#/' },
  { label: 'Gallery', href: '#/gallery' },
  { label: 'Artists', href: '#/artists' },
  { label: 'About', href: '#/about' },
  { label: 'News & Events', href: '#/news' },
  { label: 'FAQ', href: '#/faq' },
  { label: 'Contact', href: '#/contact' },
];
