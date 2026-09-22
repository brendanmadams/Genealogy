#!/usr/bin/env node
/**
 * Second set of mothers, confirmed by Brendan on 2026-09-22. Re-runnable.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const TAG = 'CORRECTION 2026-09-22:';

const FILLS = [
  ['michelle_mckeldin', ['charlie_mckeldin', 'jennifer_mckeldin'], 'Mother set to michelle_mckeldin, wife of Chuck McKeldin (confirmed by Brendan Adams).'],
  ['shelly_mckeldin', ['christian_mckeldin', 'jeffery_mckeldin'], 'Mother set to shelly_mckeldin, wife of J. Michael McKeldin (confirmed by Brendan Adams).'],
  ['trumbo_serena_marie', ['wells_rosemary'], 'Mother set to trumbo_serena_marie, wife of Arthur Wells (confirmed by Brendan Adams). This makes Rosemary a half sister, not a step-sister, of George Francis Adams Sr.'],
  ['grief_dorothea', ['mckeldin_george_edward', 'mckeldin_laura_s', 'mckeldin_william'], 'Mother set to grief_dorothea (confirmed by Brendan Adams). The earlier half-sibling suspicion rested on a birth "before the ~1878 marriage", but 1880 is after it.'],
];

const load = id => JSON.parse(fs.readFileSync(path.join(DIR, id + '.json'), 'utf8'));
const save = (id, p) => fs.writeFileSync(path.join(DIR, id + '.json'), JSON.stringify(p, null, 2) + '\n');
let n = 0;
for (const [mother, kids, why] of FILLS) {
  const m = load(mother);
  m.relationships.children = m.relationships.children || [];
  for (const kid of kids) {
    const c = load(kid);
    if (c.relationships.mother !== mother) {
      c.relationships.mother = mother;
      c.notes = c.notes || [];
      const t = `${TAG} ${why}`;
      if (!c.notes.includes(t)) c.notes.push(t);
      save(kid, c); n++;
    }
    if (!m.relationships.children.includes(kid)) m.relationships.children.push(kid);
  }
  save(mother, m); n++;
}
console.log(`mothers filled; ${n} file writes`);
