// Hand-transcribed from the caption strips printed onto the source images.
// Anything the artist did not caption is left empty and shows as "—" on the
// site, ready to be filled in from the catalogue spreadsheet.

const artists = {
  'ashok-rathod-painting': {
    name: 'Ashok Rathod',
    style: 'Contemporary',
    bio: 'Ashok Rathod paints the sacred bull Nandi as a study in texture and '
      + 'colour, setting luminous forms against weathered, fresco-like grounds.',
  },
  'gopal-naskar': {
    name: 'Gopal Naskar',
    style: 'Contemporary',
    bio: 'Gopal Naskar works in flat, saturated colour and sinuous line, drawing '
      + 'on folk imagery of fish, water and village life.',
  },
  'kandan-g': {
    name: 'Kandan G',
    style: 'Contemporary',
    bio: 'Kandan G uses colour in a highly symbolic manner, and his handling of '
      + 'it gives meaning to the meaningless. In red he symbolises meditation. '
      + 'White represents emptiness, or the absence of everything, ready to be '
      + 'filled and ready to be engaged. Black symbolises the infinity of going '
      + 'beyond. Poetics of Emotions, his series of abstract works, brings '
      + 'together the whole of his experiments in art practice. A line in his '
      + 'work emotes many feelings and a quest for knowledge and wisdom, and '
      + 'swirling patterns take a predominant place in most of it. Vibrant reds '
      + 'and blacks give the space a much-needed energy. It is an experiment in '
      + 'creating something from zero, from total emptiness; as the experiment '
      + 'continues, the space becomes energetic out of nothingness. There is '
      + 'always something beyond everything, not felt and not seen, and yet it '
      + 'announces its presence boldly. His Poetics of Emotions signifies a '
      + 'quest to know what lies beyond, what is not decipherable. Quest is a '
      + 'natural trait, and art is one way of reaching for the unknown and the '
      + 'infinite.',
  },
  'm-salim': {
    name: 'M. Salim',
    style: 'Traditional',
    bio: 'M. Salim is a landscape painter whose washes capture Indian hill '
      + 'villages, riverbeds and monsoon light with great delicacy.',
  },
  'mehnaaz-bano-painting': {
    name: 'Mainaz Bano',
    style: 'Contemporary',
    bio: 'Mainaz Bano reworks the vocabulary of Indian miniature painting at '
      + 'intimate scale, her Inheritance series placing figures in fields of '
      + 'flat, jewel-like colour.',
  },
  'n-k-mishra': {
    name: 'N. K. Mishra',
    style: 'Traditional',
    bio: 'N. K. Mishra paints in a fluid, wash-based idiom rooted in the Indian '
      + 'wash tradition, with devotional figures emerging from drifting colour.',
  },
  'nirakaar-chaudhary-painting': {
    name: 'Nirakar Chowdhury',
    style: 'Contemporary',
    bio: 'Nirakar Chowdhury is an Indian artist from Odisha, India, known for his '
      + 'nature-inspired and conceptual paintings that often incorporate '
      + 'elements of Cubism, influenced by artists like Braque and Picasso. '
      + 'He works primarily with acrylics on canvas and creates abstract '
      + 'depictions of nature and animals, exploring the value of life in his '
      + 'artwork.',
  },
  'umendra-p-singh': {
    name: 'Umendra P. Singh',
    style: 'Contemporary',
    bio: 'Umendra P. Singh paints on deep, near-black grounds, coaxing '
      + 'monuments, figures and night skies out of the shadows. '
      + 'Umendra\'s paintings depict physical remnants of the past — artifacts and '
      + 'sculptures — that encapsulate the cultural heritage of civilizations, '
      + 'providing insights into beliefs and traditions while granting access '
      + 'to ancient wisdom for societies to learn from and preserve, shaping a '
      + 'better future.',
  },
  'umesh-ji': {
    name: 'Umesh Kumar Saxena',
    style: 'Contemporary',
    bio: 'Umesh Kumar Saxena paints translucent, petal-like forms that float '
      + 'against dark grounds, suspended between botanical study and abstraction.',
  },
  'umesh-kumar-saxena-painting-1': {
    name: 'Umesh Kumar Saxena',
    style: 'Contemporary',
    bio: 'Umesh Kumar Saxena paints translucent, petal-like forms that float '
      + 'against dark grounds, suspended between botanical study and abstraction.',
  },
  'india-folk-tribal-paintings-song-collection-2604-260408-001807': {
    name: 'Folk & Tribal Masters',
    style: 'Folk',
    bio: 'A collection of Madhubani, Warli and allied folk and tribal paintings '
      + 'from across India, made by village artists working in traditions passed '
      + 'down through generations. Artist attributions for these works are being '
      + 'catalogued.',
  },
};

// key = source filename without extension
const works = {
  'ashok-rathod-painting-1': { title: 'Nandi', size: '24 x 24 in', medium: 'Acrylic on canvas' },
  'ashok-rathod-painting-2': { title: 'Nandi', size: '36 x 60 in', medium: 'Acrylic on canvas' },
  'ashok-rathod-painting-3': { title: 'Nandi', size: '36 x 60 in', medium: 'Acrylic on canvas' },
  'ashok-rathod-painting-4': { title: 'Nandi', size: '36 x 60 in', medium: 'Acrylic on canvas' },
  'ashok-rathod-painting-5': { title: 'Nandi', size: '48 x 72 in', medium: 'Acrylic on canvas' },

  'gopal-naskar-1': { title: '', size: '24 x 24 in', medium: '' },
  'gopal-naskar-2': { title: '', size: '24 x 24 in', medium: '' },
  'gopal-naskar-3': { title: '', size: '24 x 24 in', medium: '' },
  'gopal-naskar-4': { title: '', size: '24 x 24 in', medium: '' },

  'kandan-g-1': { title: '', size: '24 x 48 in / 61 x 122 cm', medium: 'Acrylic on canvas', year: '2024', ref: '1024' },
  'kandan-g-2': { title: '', size: '24 x 48 in / 61 x 122 cm', medium: 'Acrylic on canvas', year: '2024', ref: '1028' },
  'kandan-g-3': { title: '', size: '36 x 60 in / 92 x 153 cm', medium: 'Acrylic on canvas', year: '2025', ref: '1060' },
  'kandan-g-4': { title: '', size: '36 x 60 in / 92 x 153 cm', medium: 'Acrylic on canvas', year: '2025', ref: '1061' },

  'm-salim-painting-1': { title: '', size: '', medium: '' },
  'm-salim-painting-2': { title: '', size: '', medium: '' },
  'm-salim-painting-3': { title: '', size: '', medium: '' },
  'm-salim-painting-4': { title: '', size: '', medium: '' },

  'mehnaaz-bano-painting-1': { title: 'Inheritance 1', size: '8 x 8 in', medium: 'Mixed media on canvas' },
  'mehnaaz-bano-painting-2': { title: 'Inheritance 10', size: '8 x 8 in', medium: 'Acrylic on canvas' },
  'mehnaaz-bano-painting-3': { title: '', size: '12 x 12 in', medium: 'Acrylic on canvas' },
  'mehnaaz-bano-painting-4': { title: '', size: '12 x 12 in', medium: 'Acrylic on canvas' },
  'mehnaaz-bano-painting-5': { title: '', size: '12 x 12 in', medium: 'Acrylic on canvas' },
  'mehnaaz-bano-painting-6': { title: '', size: '12 x 12 in', medium: 'Acrylic on canvas' },
  'mehnaaz-bano-painting-7': { title: '', size: '12 x 12 in', medium: 'Acrylic on canvas' },
  'mehnaaz-bano-painting-8': { title: '', size: '12 x 12 in', medium: 'Acrylic on canvas' },

  'n-k-mishra-1': { title: '', size: '21.5 x 15 in', medium: '' },
  'n-k-mishra-2': { title: '', size: '13.2 x 7.1 in', medium: '' },
  'n-k-mishra-3': { title: '', size: '12.5 x 8.5 in', medium: '' },
  'n-k-mishra-4': { title: '', size: '19.5 x 19.5 in', medium: '' },

  'nirakaar-chaudhary-painting-1': { title: '', size: '140 x 85 cm', medium: '' },
  'nirakaar-chaudhary-painting-2': { title: '', size: '153 x 191 cm', medium: '' },

  'umendra-p-singh-1': { title: '', size: '', medium: '' },
  'umendra-p-singh-2': { title: '', size: '', medium: '' },
  'umendra-p-singh-3': { title: '', size: '', medium: '' },
  'umendra-p-singh-4': { title: '', size: '', medium: '' },

  'umesh-ji-1': { title: '', size: '70 x 70 in / 178 x 178 cm', medium: 'Acrylic on canvas' },
  'umesh-ji-2': { title: '', size: '36 x 72 in', medium: 'Acrylic on canvas', year: '2025' },
  'umesh-ji-3': { title: '', size: '36 x 72 in', medium: 'Acrylic on canvas', year: '2025' },
  'umesh-ji-4': { title: '', size: '36 x 72 in', medium: 'Acrylic on canvas', year: '2025' },
  'umesh-ji-5': { title: '', size: '36 x 72 in', medium: 'Acrylic on canvas', year: '2025' },
  'umesh-ji-6': { title: '', size: '36 x 72 in', medium: 'Acrylic on canvas', year: '2025' },
  'umesh-kumar-saxena-painting-1-1': { title: 'Triptych', size: '18 x 60 in each', medium: 'Acrylic on canvas' },
  'umesh-kumar-saxena-painting-1-2': { title: 'Triptych', size: '18 x 60 in each', medium: 'Acrylic on canvas' },
};

// The order the painters are hung in wherever the collection is shown. Artist
// names are never published on the website, so this ordering is applied here,
// when the catalogue is built, rather than in the site's own settings — that
// way no painter's name is carried into the pages a visitor can read.
// Any painter left off this list follows the named ones, alphabetically.
const ORDER = [
  'Umesh Kumar Saxena',
  'Kandan G',
  'Nirakar Chowdhury',
  'Ashok Rathod',
  'Gopal Naskar',
  'Umendra P. Singh',
  'M. Salim',
  'Folk & Tribal Masters',
  'N. K. Mishra',
];

module.exports = { artists, works, ORDER };
