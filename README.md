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
ashok-rathod-painting      gopal-naskar        kandan-g       m-d-ishak
m-salim                    n-k-mishra          nirakaar-chaudhary-painting
umendra-p-singh            umesh-ji            umesh-kumar-saxena-painting-1
```

JPG and PNG both work. Photograph the painting square-on if you can — the tool
finds the edges and crops the background away by itself.

**A painting photographed in its frame** needs one extra line, because the tool
leaves dark borders alone by default: a black edge is usually part of the
painting, not a frame around it. Add the filename to the `FRAMED` list in
`scripts/metadata.cjs` and the frame and any mount are cropped away, leaving the
picture alone:

```js
const FRAMED = [
  'm-d-ishak-43',
  'm-d-ishak-44',
];
```

Better still, photograph the canvas before it is framed.

### Step 3 — run one command

**Opening the terminal in the right folder.** In File Explorer, go to
`C:\Users\shefs\indus-art-collection`, right-click any empty white space inside
the folder, and choose **Open in Terminal** (it may be under *Show more
options*). The window opens already pointing at the project.

Then run:

```
npm.cmd run add-art
```

Note the **`.cmd`**. Windows disables PowerShell scripts by default, so plain
`npm` fails here with *"running scripts is disabled on this system"*. The
`npm.cmd` launcher is not a PowerShell script, so it runs normally — same npm,
same result. (In Command Prompt rather than PowerShell, plain `npm run add-art`
works too.)

It prepares the images, checks the site still builds, tells you exactly which
paintings it found, and then asks whether to publish. Nothing goes live until
you answer **y**. About two minutes later the paintings are on the website.

To rehearse without touching the live site:

```
npm.cmd run add-art -- --no-publish
```

**If it says a photo could not be matched to an artist,** the filename does not
start with a key from the list above. Rename it and run the command again.

---

## Filling in the painting details

Open **`Indus Art Collection - Catalogue.xlsx`** in the project folder. It has one
row per painting. Five columns are yours to fill in, and the headings say so:

**Title · Size · Medium · Year · Description**

Whatever you type into those is kept and appears on the website when a visitor
opens the painting.

**Leave a cell blank when you do not know the answer.** The site then says
*Details on request* by itself, once, under the painting. Typing that phrase in
yourself makes it appear three times over.

**Do not edit the Reference, Artist or Style columns.** The reference (IAC-001,
IAC-002 …) is what matches each row to its painting, and it is also the only
name the painting has on the website; the other two are rebuilt from the artist
list every run.

**This spreadsheet is your private list of who painted what.** Artist names are
not shown anywhere on the website, so when someone enquires about *IAC-042* look
the number up here — or in **`Painting Reference List.md`**, the same list
grouped by painter, which is rewritten each time you publish. Neither file is
part of the website.

### The reference numbers

They run in the order the paintings hang, IAC-001 upwards, with no gaps. A new
painter added to the end of the collection simply carries on from the last
number, and nothing else moves.

A painter added **in the middle** is different: their paintings would otherwise
take numbers from the end, leaving the gallery reading IAC-014, IAC-101,
IAC-102. To keep the sequence tidy the whole collection is renumbered:

```
node scripts/build-catalog.cjs --renumber
```

Every painting after the insertion point changes number, so anything you have
already sent out under the old numbers — an email, a quote, a certificate — now
points at a different painting. Send the updated reference list to anyone who
has the old one.

When you are done:

1. **Save the file and close Excel** — leaving it open can lock the file
2. Run `npm.cmd run add-art`
3. Answer **y** to publish

A cell you leave empty falls back to whatever was read off the painting's
caption, so clearing one never destroys the original reading.

---

## Artists — names and biographies

Artist details are **not** in the spreadsheet. They live in
**`scripts/metadata.cjs`**, which you open with Notepad (right-click the file →
Open with → Notepad — not Word, which adds formatting and breaks it).

Near the top there is one block per artist:

```js
'gopal-naskar': {
  name: 'Gopal Naskar',
  style: 'Contemporary',
  bio: 'Gopal Naskar works in flat, saturated colour and sinuous line, drawing '
    + 'on folk imagery of fish, water and village life.',
},
```

| Part | What it is | Safe to change? |
| --- | --- | --- |
| `'gopal-naskar'` | the **key**, matching the start of that artist's photo filenames | only if you rename the photos too |
| `name` | the painter's name — for your reference list only; it is never shown on the site | yes |
| `style` | which gallery tab their paintings appear under — see below | yes |
| `bio` | the biography — kept for your records; it is not published | yes |

`style` must be spelt exactly as one of the gallery's tabs:

`Abstract` · `Modern` · `Impressionism` · `Realism` · `Contemporary` ·
`Traditional Folk Art`

Today: Umesh Kumar Saxena is Abstract; Kandan G and Nirakar Chowdhury are
Modern; M. Salim and N. K. Mishra are Impressionism; M. D. Ishak is Realism;
Ashok Rathod, Gopal Naskar and Umendra P. Singh are Contemporary; the folk and
tribal collection is Traditional Folk Art. Change a line here and that painter's
whole collection moves to another tab. A new name spelt differently from the
ones above simply gets a tab of its own, at the end.

### Updating an existing artist

Change the text inside the quote marks and save. A long biography is written as
pieces joined by `+`, each piece in its own quotes, with a space before the
closing quote so words do not run together:

```js
bio: 'First sentence goes here. '
  + 'Second sentence goes here. '
  + 'Third sentence.',
```

⚠️ **If you change an artist's `name`, change it in `ORDER` too.** `ORDER` is
the list further down the same file that decides which painter's works hang
first. A name spelt differently in the two places drops that painter to the end
of every listing.

### Adding a new artist

Copy a whole block, paste it below, and change all four values. The key must
match how the photos are named — key `meera-devi` means `meera-devi-1.jpg`,
`meera-devi-2.jpg`, and so on. Add the new name to `ORDER`, lower down the same
file, if you want them in a particular position.

### Then publish

Save the file, close Notepad, and run `npm.cmd run add-art`.

If a quote mark or comma is lost, the site will not build — but the tool checks
that at step 3 and refuses to publish, so a broken site cannot go live. You
would see *"The website failed to build"*; undo the edit and try again.

Painting titles, sizes and mediums are normally typed into the spreadsheet, but
they can also be set here, one line per painting, in the `works` list further
down the same file:

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

`npm.cmd run add-art` publishes for you, so you normally never need this section.

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

## Where each kind of change is made

| To change | Open |
| --- | --- |
| A painting's title, size, medium, year, description | `Indus Art Collection - Catalogue.xlsx` |
| An artist's name, gallery tab (`style`) or biography | `scripts/metadata.cjs` |
| Any wording on any page, contact details, settings | `src/config.ts` |
| This week's New Collection on the home page | `src/config.ts` (`NEW_COLLECTION`) |
| Which gallery tabs there are, and their order | `src/config.ts` (`STYLE_ORDER`) |

Then always: save, close, `npm.cmd run add-art`, answer `y`.

## Settings and wording

Everything routine lives in **`src/config.ts`**:

| Setting | What it does |
| --- | --- |
| `email` | The address shown on the site and used by the enquiry forms |
| `CONTACTS` | The phone numbers listed by country on the contact page and footer |
| `instagram`, `facebook` | Social links; the icons are hidden when blank |
| `formspree` | The endpoint that makes the enquiry forms actually send email |
| `TEXT` | **Every word on every page** — see below |
| `NEW_COLLECTION` | Which paintings appear in the New Collection on the home page |
| `STYLE_ORDER` | The gallery's tabs, in the order they are shown |

The order the paintings hang in is **not** here: it is `ORDER` in
`scripts/metadata.cjs`, alongside the artists themselves, so that no painter's
name is carried into the website.

### The New Collection on the home page

The home page shows one changing selection of paintings, headed *New
Collection*, so a visitor meets new work rather than the same pictures the
gallery already holds. Choose it by reference number:

```js
export const NEW_COLLECTION = [
  'IAC-001 - IAC-008',   // Umesh Kumar Saxena
  'IAC-009 - IAC-012',   // Kandan G
];
```

One line per artist, a range or a single reference, shown in the order listed.
A number that matches nothing is skipped; if none match at all the section falls
back to the first twelve paintings, so the page is never bare.

### The gallery's tabs

A painting's style is set per artist, by the `style` line in
`scripts/metadata.cjs`, and must match one of the names in `STYLE_ORDER`
exactly. **A tab appears only when there are paintings of that kind**, so a new
style can be listed before its first painting arrives, and a style that empties
out disappears by itself. A style used by an artist but missing from
`STYLE_ORDER` still gets a tab, at the end.

### TEXT — the wording of the site

`TEXT` holds the headings, paragraphs and button labels of every page, grouped
by page in the order a visitor meets them: `home`, `artists`, `newCollection`,
`gallery`, `about`, `news`, `register`, `contact`, `footer`, `form` and
`notFound`. Change the text between the quote marks and publish.

Longer entries are split across lines joined by `+`; each piece keeps its own
quotes and needs a space before the closing quote. An apostrophe inside the
text is written `\'`.

Two placeholders fill themselves in, so counts never go stale:

| Placeholder | Becomes |
| --- | --- |
| `{artists}` | the number of artists, in words — "nine" |
| `{works}` | the number of paintings, in figures — "100" |

`TEXT.contact.lead` and `TEXT.form.failed` also accept `{email}`, which becomes
the address in `email` above, rendered as a clickable link.

Whatever is typed here is shown literally, so `&`, `<` and quotation marks are
safe to use — they cannot break the page.

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
