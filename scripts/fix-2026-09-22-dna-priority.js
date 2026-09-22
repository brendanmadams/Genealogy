#!/usr/bin/env node
/**
 * Mark unplaced 23andMe matches as low-priority DNA-match records
 * (Brendan Adams, 2026-09-22: "they are quite a stretch"). Re-runnable.
 * A record qualifies when it comes from adams_dna_linkage_v1 and has no
 * parent, spouse or child links. Records that later gain links should have
 * record_type/priority removed by hand.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const NOTE = 'CORRECTION 2026-09-22: Marked as a low-priority DNA match. Known only from a 23andMe match list; relationship unconfirmed.';
let n = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const file = path.join(DIR, f);
  const p = JSON.parse(fs.readFileSync(file, 'utf8'));
  const r = p.relationships || {};
  const linked = [r.father, r.mother, r.spouse].some(Boolean) || (r.children || []).length || (r._extra_spouses || []).length;
  if (!(p.sources || []).includes('adams_dna_linkage_v1') || linked) continue;
  // also skip anyone another record names as parent/child/spouse
  p.record_type = 'dna_match';
  p.priority = 'low';
  p.notes = p.notes || [];
  if (!p.notes.includes(NOTE)) p.notes.push(NOTE);
  fs.writeFileSync(file, JSON.stringify(p, null, 2) + '\n');
  n++;
}
console.log(`marked ${n} DNA-match records as low priority`);
