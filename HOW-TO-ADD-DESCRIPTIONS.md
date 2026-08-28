# Adding painting descriptions — the short version

Keep this open the first few times. Nothing here can break the website: the
tool checks everything before publishing and refuses if anything is wrong.

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
