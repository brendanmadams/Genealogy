# Adams · McKeldin Family Tree

An interactive family history site for the whole family, published with GitHub Pages at
<https://brendanmadams.github.io/Genealogy/>.

## What is here

| Path | Purpose |
|---|---|
| `index.html`, `css/`, `js/` | The site. Pick anyone to see their grandparents, parents, siblings, spouses, children and grandchildren; click any card to move. Links like `#/p/adams_alberta` open on that person. The Ancestors and Descendants tabs draw printable charts (`#/p/<id>/ancestors/<generations>`, `#/p/<id>/descendants/all`). The details panel's “How are we related?” names the relationship between any two people and shows the path (`js/relate.js`); “This is me” remembers the viewer in their own browser so every page says how that person is related to them. |
| `images/<id>.jpg` | Portraits shown on cards and in the details panel. Generated from `data/media.json` crops, or drop one in by hand. |
| `media/` | Photos, documents and album pages shown under “Photos & documents”. Generated. |
| `data/media.json` | What each photo or document is, who is in it, where it came from, and portrait crops. |
| `data/people/*.json` | **The source of truth.** One record per person. Edit these, then rebuild. |
| `data/branches.json` | Family lines (Adams, McKeldin, Kulp, …), their colours, and the earliest known ancestor that seeds each line. |
| `data/family.json` | Generated. People, family units, and branches in one file for the site to load. |
| `scripts/build.js` | Validates the records, generates the files above, and stamps `index.html` with a version code for each script and the stylesheet so browsers pick up changes right away. Run it after editing code too. |
| `scripts/fix-*.js` | Dated, re-runnable data corrections, kept so the reasoning is on record. |

## Editing a person

1. Open `data/people/<id>.json`. Relationship fields use other people's ids
   (`father`, `mother`, `spouse`, `children`, `siblings`). A second marriage goes in
   `_extra_spouses`.
   Names: write the birth surname first and married surnames after it in
   parentheses, `"Megan Marie Falde (Adams)"` or `"Dorothy Douthit Pfander (Wheeler, Howard)"`.
   The site shows them obituary style, "Megan Marie (Falde) Adams", and the directory
   lists them under the birth surname. If the birth surname is not known, use the
   married name alone ("Nellie Kulp").
   Tree cards show a short name (the name they went by, middle initials, surname,
   latest married name). To choose it yourself, add `"card_name": ["Peggy", "(Allen) Seavy"]`.
2. Rebuild:

   ```bash
   node scripts/build.js
   ```

   The build refuses to write if a reference points to a missing person, someone ends up
   with more than two parents, or a branch root does not exist. It warns about implausible
   ages, one-sided links, and dates it cannot read.
3. Commit and push. GitHub Pages redeploys automatically.

`node scripts/build.js --check` validates without writing anything.

## Adding photos and documents

1. Put the original in the research folder named by `source_dir` in `data/media.json`
   (currently `claude_cowork/00_Raw_Input_Files/images`).
2. Add an entry to `data/media.json`: an `id`, `kind` (`photo`, `document` or `album`),
   the `file` (or `pages` for an album), a `title`, optional `caption` and `source`, and the
   `people` it belongs to. To cut a portrait, add `portraits: [{ "person": "<id>", "crop": [x, y, size] }]`
   using pixel positions in the original.
3. Run:

   ```bash
   powershell -NoProfile -File scripts/prepare-media.ps1
   node scripts/build.js
   ```

## Data model

- A **family** is a set of one or two partners plus their children, derived from the
  records rather than stored. Every spouse pair is a family (even childless); every child's
  known parents form a family. This handles multiple marriages and unknown parents without
  needing a sex or gender field.
- **Branches** come from `data/branches.json`. A person's `lineages` lists every line they
  descend from; their primary `branch` follows the father's line when known, otherwise the
  mother's. Someone who married in gets their partner's branch with `branch_by_marriage: true`.
- No person is "primary". The site chooses a focus person at run time.

## Local preview

The site loads `data/family.json`, so it must be served rather than opened as a file. Any static server works, for example:

```bash
npx serve .
```

## History

The research pipeline that produced these records (prompts, specs, raw sources, merge
reports) lives outside this repository in the private `claude_cowork` folder. Records were
brought into `data/people` on 2026-09-22; see `scripts/fix-2026-09-22.js` for the
corrections made at that time.
