#!/usr/bin/env node
/**
 * Later death dates for James Alfred McKeldin and Dorothea Grief, confirmed by
 * Brendan on 2026-09-22. Re-runnable; earlier values kept in notes.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const TAG = 'CORRECTION 2026-09-22:';
const DATES = [
  ['mckeldin_james_alfred', 'abt 30 May 1923', 'abt 1912', 'He appears in the 1916 Baltimore city directory and registered for the WWI draft (1917-18), so he was alive after 1912.'],
  ['grief_dorothea', '5 Mar 1925', 'abt 1925', 'Consistent with the earlier estimate, now exact.'],
];
for (const [id, death, old, why] of DATES) {
  const f = path.join(DIR, id + '.json');
  const p = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (p.death === death) continue;
  p.notes = p.notes || [];
  p.notes.push(`${TAG} Death changed from "${old}" to "${death}" (confirmed by Brendan Adams). ${why}`);
  p.death = death;
  fs.writeFileSync(f, JSON.stringify(p, null, 2) + '\n');
  console.log(`${id}: ${old} -> ${death}`);
}
