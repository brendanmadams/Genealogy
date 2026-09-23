'use strict';
// Shared helpers for the dated fix scripts.
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', '..', 'data', 'people');
const file = id => path.join(DIR, id + '.json');
const exists = id => fs.existsSync(file(id));
const load = id => JSON.parse(fs.readFileSync(file(id), 'utf8'));
const save = p => fs.writeFileSync(file(p.id), JSON.stringify(p, null, 2) + '\n');
const note = (p, t) => { p.notes = p.notes || []; if (!p.notes.includes(t)) p.notes.push(t); };

/** Move a record to a new id, rewrite every reference, and tidy duplicates. Safe to re-run. */
function rename(oldId, newId) {
  if (!exists(oldId)) return false;
  if (exists(newId)) fs.unlinkSync(file(oldId));
  else { const p = load(oldId); p.id = newId; save(p); fs.unlinkSync(file(oldId)); }
  for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
    const q = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); const r = q.relationships || {};
    let t = false;
    for (const k of ['father', 'mother', 'spouse']) if (r[k] === oldId) { r[k] = newId; t = true; }
    for (const k of ['children', 'siblings', '_extra_spouses']) {
      if (!Array.isArray(r[k])) continue;
      const u = [...new Set(r[k].map(x => (x === oldId ? newId : x)))].filter(x => k !== '_extra_spouses' || x !== r.spouse);
      if (JSON.stringify(u) !== JSON.stringify(r[k])) { r[k] = u; t = true; }
    }
    if (Array.isArray(r._extra_spouses) && !r._extra_spouses.length) { delete r._extra_spouses; t = true; }
    if (t) save(q);
  }
  return true;
}
module.exports = { DIR, file, exists, load, save, note, rename };
