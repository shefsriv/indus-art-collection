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

// ---------------------------------------------------------------------------
// WORDING YOU CAN CHANGE
//
// Edit the text between the quote marks, save, and run npm.cmd run add-art.
// Keep the quote marks and the comma at the end of each line.
// Write {n} where you want the number of artists — it fills itself in, so it
// stays right when you add an artist. Leave it out if you would rather not
// mention a number at all.
// ---------------------------------------------------------------------------
export const TEXT = {
  // Shown on the Artists page and on the home page, above the artist photographs.
  artistsHeading: 'The painters we represent',

  artistsIntro: 'Our collection brings together '
    + 'contemporary, traditional and folk paintings, promoting artists from India '
    + 'and giving them an international platform to showcase their work. Please select '
    + 'an artist to see their complete collection.',
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
