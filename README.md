# Adams · McKeldin Family Tree

An interactive family history site for the whole family, published with GitHub Pages at
<https://brendanmadams.github.io/Genealogy/>.

## What is here

| Path | Purpose |
|---|---|
| `index.html` | The site (currently a single page; being rebuilt as a focus-and-context tree). |
| `data/people/*.json` | **The source of truth.** One record per person. Edit these, then rebuild. |
| `data/branches.json` | Family lines (Adams, McKeldin, Kulp, …), their colours, and the earliest known ancestor that seeds each line. |
| `data/family.json` | Generated. People, family units, and branches in one file for the site to load. |
| `family-graph.js`, `family-canon.js` | Generated. Data in the shape the current page expects. |
| `scripts/build.js` | Validates the records and generates the files above. |
| `scripts/fix-*.js` | Dated, re-runnable data corrections, kept so the reasoning is on record. |

## Editing a person

1. Open `data/people/<id>.json`. Relationship fields use other people's ids
   (`father`, `mother`, `spouse`, `children`, `siblings`). A second marriage goes in
   `_extra_spouses`.
2. Rebuild:

   ```bash
   node scripts/build.js
   ```

   The build refuses to write if a reference points to a missing person, someone ends up
   with more than two parents, or a branch root does not exist. It warns about implausible
   ages, one-sided links, and dates it cannot read.
3. Commit and push. GitHub Pages redeploys automatically.

`node scripts/build.js --check` validates without writing anything.

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

Any static server works, for example:

```bash
npx serve .
```

## History

The research pipeline that produced these records (prompts, specs, raw sources, merge
reports) lives outside this repository in the private `claude_cowork` folder. Records were
brought into `data/people` on 2026-09-22; see `scripts/fix-2026-09-22.js` for the
corrections made at that time.
