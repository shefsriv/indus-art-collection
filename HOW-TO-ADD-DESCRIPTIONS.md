# Changing the website — the short version

Keep this open the first few times. Nothing here can break the website: the
tool checks everything before publishing and refuses if anything is wrong.

---

## Where everything lives

There are only three places, and only three.

| To change | Open |
| --- | --- |
| A painting's **title, size, medium, year, description** | `Indus Art Collection - Catalogue.xlsx` (Excel) |
| An artist's **name, style or biography** | `scripts\metadata.cjs` (Notepad) |
| **Any wording on any page** — headings, paragraphs, buttons | `src\config.ts` (Notepad) |

Contact details — your email address and the two phone numbers — are also in
`src\config.ts`, at the top.

Whichever you change, the last three steps are always the same:

**save → close → `npm.cmd run add-art` → answer `y`**

The rest of this note walks through that in full.

---

## 1. Open the spreadsheet

In **File Explorer**, paste this into the address bar and press Enter:

```
C:\Users\shefs\indus-art-collection
```

Double-click **`Indus Art Collection - Catalogue.xlsx`**.

## 2. Type your details

One row per painting. Five columns are yours:

**Title · Size · Medium · Year · Description**

- Leave a cell **blank** if you do not know it — the site then says
  *Details on request* by itself. Do not type that phrase in.
- Do **not** touch the **ID**, **Artist** or **Style** columns.

## 3. Save and close Excel

Both. Leaving the file open can lock it and lose your work.

## 4. Open PowerShell in the project folder

In File Explorer, still in `C:\Users\shefs\indus-art-collection`:

**Right-click any empty white space → Open in Terminal**

(If you do not see it, click *Show more options* first.)

A dark window opens ending in:

```
PS C:\Users\shefs\indus-art-collection>
```

## 5. Run the command

```
npm.cmd run add-art
```

Note the **`.cmd`**. Plain `npm` fails on this computer with *"running scripts
is disabled on this system"* — that is a Windows setting, not a fault.

You will see four steps:

```
[1/4] Preparing your photos for the web…
[2/4] Checking what changed…
      No new paintings, but other details changed (titles or descriptions).
      Gallery now holds 100 paintings.
[3/4] Making sure the website still builds…
      Builds cleanly.
[4/4] Publishing

      Publish these changes to indusartcollection.com? (y/n)
```

## 6. Answer `y`

Type **`y`** and press Enter. Wait about two minutes, then open
<https://indusartcollection.com> and press **Ctrl+Shift+R** to force a proper
refresh.

Close the dark window. Done.

---

## Changing the wording on a page

Every word on every page lives in **`src\config.ts`**, under a big block
headed *EVERY WORD ON THE WEBSITE*. Open the file in Notepad (right-click →
Open with → Notepad; not Word) and you will find the pages listed in the order
a visitor meets them — home, artists, gallery, about, news, register, contact,
footer.

Change the text between the quote marks. Four rules:

1. Keep the quote marks `'  '` and the comma at the end of the line.
2. A long sentence is split across lines joined by `+`. Each piece keeps its
   own quotes and needs **a space before the closing quote**, or words run
   together:
   ```js
   intro: 'This is the first part '
     + 'and this is the second.',
   ```
3. For an apostrophe inside the text, write `\'` — as in `'the artist\'s work'`.
4. Two words fill themselves in, so they never go stale:
   `{artists}` becomes the number of artists in words ("nine"), and `{works}`
   becomes the number of paintings in figures ("100"). Leave them out if you
   would rather not mention a number.

Then save, close Notepad, and run the command as below.

## Changing an artist's name or biography

Open **`scripts\metadata.cjs`** in Notepad. Each artist is a block:

```js
'gopal-naskar': {
  name: 'Gopal Naskar',
  style: 'Contemporary',
  bio: 'Gopal Naskar works in flat, saturated colour...',
},
```

Change `name`, `style` (`Contemporary`, `Traditional` or `Folk`) or `bio`.
Leave the key on the first line alone — it matches that artist's photographs.

⚠️ Renaming an artist changes their web address, so `ARTIST_ORDER` in
`src\config.ts` must be updated to the new spelling too, or they drop to the
end of every listing.

## To practise without publishing

```
npm.cmd run add-art -- --no-publish
```

Everything happens except the publishing. Nothing reaches the website.

## If something looks wrong

| Message | What it means |
| --- | --- |
| *"running scripts is disabled on this system"* | You typed `npm` instead of `npm.cmd` |
| *"could not be matched to an artist"* | A photo's filename does not start with an artist key. It lists which files; rename them and run again |
| *"The website failed to build"* | Something in the catalogue is malformed. Nothing was published; the site is untouched |
| *"Nothing new to publish"* | No changes found — usually the spreadsheet was not saved |

In every failing case the website is left exactly as it was. You can always
run the command again.
