# Indus Art Collection

The online gallery for Indus Art Collection — contemporary, traditional and folk
paintings by Indian artists.

Built with TypeScript and Vite, deployed free on GitHub Pages.

---

## Adding new paintings

**The short version: put the photos in the folder, name them after the artist,
then run one command.**

### Step 1 — put the photos in the source folder

```
C:\Users\shefs\indus-art-source
```

### Step 2 — name each file after its artist

The filename must **start with the artist's key**, followed by a dash and a
number. The key is the artist's name in lower case with dashes instead of
spaces. So the next Gopal Naskar painting is:

```
gopal-naskar-5.jpg
```

Carry on from the highest number already there for that artist. The artist keys
in use today are:

```
ashok-rathod-painting      gopal-naskar        kandan-g       m-salim
n-k-mishra                 nirakaar-chaudhary-painting
umendra-p-singh            umesh-ji            umesh-kumar-saxena-painting-1
```

JPG and PNG both work. Photograph the painting square-on if you can — the tool
finds the edges and crops the background away by itself.

### Step 3 — run one command

Open the project folder in a terminal and run:

```
npm run add-art
```

It prepares the images, checks the site still builds, tells you exactly which
paintings it found, and then asks whether to publish. Nothing goes live until
you answer **y**. About two minutes later the paintings are on the website.

To rehearse without touching the live site:

```
npm run add-art -- --no-publish
```

**If it says a photo could not be matched to an artist,** the filename does not
start with a key from the list above. Rename it and run the command again.

---

## Writing descriptions for the paintings

Open **`Indus Art Collection - Catalogue.xlsx`** in the project folder. It has one
row per painting, with the artist, title, size and medium already filled in from
the images. Type your description into the last column, replacing the grey
placeholder text.

Save the spreadsheet, then run `npm run add-art` — the same command picks up
your descriptions and publishes them.

**Do not edit the ID column** — that is what matches each row to its image.

---

## Adding a new artist

A new artist needs a biography, which has to be written by hand once. Open
**`scripts/metadata.cjs`** and copy an existing entry near the top:

```js
'gopal-naskar': {
  name: 'Gopal Naskar',
  style: 'Contemporary',
  bio: 'Gopal Naskar works in flat, saturated colour and sinuous line, drawing '
    + 'on folk imagery of fish, water and village life.',
},
```

Change the key, the name, the style (`Contemporary`, `Traditional` or `Folk`)
and the biography. Name that artist's photos to match the new key, then run
`npm run add-art` as usual.

Titles, sizes and mediums are optional. To record them, add a line per painting
to the `works` list further down the same file:

```js
'gopal-naskar-5': { title: 'Evening Catch', size: '24 x 24 in', medium: 'Acrylic on canvas' },
```

---

## Running it on your computer

```
npm install     # first time only
npm run dev
```

Then open the address it prints (usually <http://localhost:5173>).

## Publishing changes

`npm run add-art` publishes for you, so you normally never need this section.

Underneath, every push to the `main` branch rebuilds and republishes the site
automatically, which takes about two minutes.

```
git add -A
git commit -m "Add descriptions for Kandan G"
git push
```

If the site ever comes up blank after a change, check that **`public/CNAME`**
still exists and contains `indusartcollection.com`. The deploy uses that file to
decide whether to build for the custom domain or for the longer github.io
address; without it the site is built for the wrong address and loads nothing.

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
scripts/add-art.cjs   the one command that does all of the above and publishes
```

Original full-resolution images are kept outside the repository in
`C:\Users\shefs\indus-art-source` so the originals stay untouched and the
repository stays small.
