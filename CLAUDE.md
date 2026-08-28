# Indus Art Collection — notes for Claude

The online gallery at **indusartcollection.com**, published free on GitHub Pages
from the `main` branch. Owner: Shefali, a joint venture with her brother
Abhishek.

## Who you are working with

Shefali is **not a developer**. Explain things in plain language, avoid jargon,
and give exact steps ("click here, type this") rather than describing an
approach. She runs commands in PowerShell herself and prefers it that way.

Do what she asks and stop there. If an extra improvement seems worthwhile,
finish the request first, then offer it in a sentence and let her decide — do
not build it unprompted. She is cost-conscious, so prefer solutions she can run
herself with tools already installed over anything that assumes paid help.

## The three places anything is edited

Shefali maintains this site herself, and every routine change is made in one of
three files — never in `main.ts`:

| Change | File |
| --- | --- |
| A painting's title, size, medium, year, description | `Indus Art Collection - Catalogue.xlsx` |
| An artist's name, style, biography | `scripts/metadata.cjs` |
| Any page wording, contact details, settings | `src/config.ts` (`TEXT`) |

`TEXT` in `src/config.ts` holds the copy for every page, grouped by page, with
`{artists}`, `{works}` and `{email}` filled in at render time by the `t()`
helper in `main.ts`. If she asks to change wording that is still hard-coded in
`main.ts`, move it into `TEXT` and show her where — do not simply edit it for
her.

## Adding artwork

Source photographs live **outside** the repo, in `C:\Users\shefs\indus-art-source`,
so the originals stay pristine. A file's name must begin with an artist key from
`scripts/metadata.cjs` (e.g. `gopal-naskar-5.jpg`) or the painting is skipped.

One command does everything — prepare images, verify the build, commit, push:

```
npm run add-art                    # asks before publishing
npm run add-art -- --no-publish    # rehearsal, changes nothing live
```

`scripts/build-catalog.cjs` does the underlying work: auto-crops each photo,
renders a 760×950 thumbnail on a cream mat so the grid lines up, writes a 2000px
version, regenerates `src/data/catalog.json`, and round-trips descriptions
through `Indus Art Collection - Catalogue.xlsx`.

Artist names, styles and biographies are hand-written in `scripts/metadata.cjs`.
A new artist needs an entry there before their photos will publish.

## The blank-page trap

`public/CNAME` must exist and contain `indusartcollection.com`. The deploy
workflow tests for that file to decide whether to build for the custom domain
(`base=/`) or the longer github.io address (`base=/indus-art-collection/`).
Without it the site builds for the wrong address, every asset 404s, and the page
renders blank with no error. This happened once — see commit `daa81eb`.

## Verifying visual work

Never call a visual change done from a clean build alone. Puppeteer is already a
dev dependency: render the page and look at full-page screenshots at desktop
(1440px) and mobile (390px) widths before reporting.

Note that GitHub Pages occasionally returns transient `503`s on images during
incidents — re-request before treating a blank tile as a real fault.
