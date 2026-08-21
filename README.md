# Indus Art Collection

The online gallery for Indus Art Collection — contemporary, traditional and folk
paintings by Indian artists.

Built with TypeScript and Vite, deployed free on GitHub Pages.

---

## The two things you will actually do

### 1. Write descriptions for the paintings

Open **`Indus Art Collection - Catalogue.xlsx`** in the project folder. It has one
row per painting, with the artist, title, size and medium already filled in from
the images. Type your description into the last column, replacing the grey
placeholder text.

Then run:

```
npm run catalog
npm run build
```

Your descriptions get pulled into the site and appear when a visitor opens a
painting. **Do not edit the ID column** — that is what matches each row to its
image.

### 2. Add new paintings

1. Put the image files in `C:\Users\shefs\indus-art-source`.
   Name them `artist-key-1.jpg`, `artist-key-2.jpg`, and so on.
2. If the artist is new, add them to `scripts/metadata.cjs` — a name, a style
   (`Contemporary`, `Traditional` or `Folk`) and a short biography.
3. Add each painting's title, size and medium to the `works` list in the same file.
4. Run `npm run catalog`, then `npm run build`.

---

## Running it on your computer

```
npm install     # first time only
npm run dev
```

Then open the address it prints (usually <http://localhost:5173>).

## Publishing changes

Every push to the `main` branch rebuilds and republishes the site automatically,
which takes about two minutes.

```
git add -A
git commit -m "Add descriptions for Kandan G"
git push
```

---

## Settings you may want to change

Everything routine lives in **`src/config.ts`**:

| Setting | What it does |
| --- | --- |
| `email` | Where enquiries are sent, shown in the footer and contact page |
| `phone` | Optional; hidden when left blank |
| `instagram`, `facebook` | Social links; the icons are hidden when blank |
| `formspree` | The endpoint that makes the enquiry forms actually send email |

### The enquiry forms

Static sites cannot receive form submissions on their own, so the forms post to
[Formspree](https://formspree.io), which is set up and tested: submissions
arrive as email at the address in `email`. The free plan carries 50 submissions
a month across all the forms, so watch for Formspree's warning if enquiries
pick up.

To move the forms to a different account or service, replace `formspree` in
`src/config.ts` with the new endpoint. Left blank, the forms fall back to
opening the visitor's own email app.

### Using your own domain name

1. Create a file `public/CNAME` containing just your domain, e.g. `indusart.com`.
2. Point the domain's DNS at GitHub Pages.
3. Push. The deploy workflow notices the CNAME and adjusts the paths itself.

---

## How the project is laid out

```
public/art/thumb/     small images used in the grids
public/art/full/      large images used by the zoom viewer
public/logo.png       the tree-of-life logo
src/main.ts           every page, the router and the zoom viewer
src/styles.css        all styling, including the colour palette at the top
src/config.ts         contact details and social links
src/data/catalog.json generated — do not edit by hand
scripts/metadata.cjs  artist biographies and painting details
scripts/build-catalog.cjs  resizes images, writes the catalogue and spreadsheet
```

Original full-resolution images are kept outside the repository in
`C:\Users\shefs\indus-art-source` so the originals stay untouched and the
repository stays small.
