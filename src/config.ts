// Everything Shefali is likely to want to change lives here.

export const site = {
  name: 'Indus Art Collection',
  tagline: 'Contemporary, Traditional & Folk Art',

  // Replace with the address enquiries should reach.
  email: 'shefsriv1968@gmail.com',
  phone: '602-741-4861',
  location: 'Phoenix, AZ',

  instagram: '',
  facebook: '',

  // Paste the Formspree endpoint here once the form is created at
  // https://formspree.io — it looks like https://formspree.io/f/abcdwxyz
  // Until then both forms fall back to opening the visitor's email client.
  formspree: 'https://formspree.io/f/mljrvbwq',
};

// The order artists are hung in wherever the whole collection is shown — the
// Gallery "All" view, the home page and the artists list. Any artist missing
// from this list follows the named ones, alphabetically.
export const ARTIST_ORDER = [
  'umesh-kumar-saxena',
  'kandan-g',
  'nirakaar-chaudhary',
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
