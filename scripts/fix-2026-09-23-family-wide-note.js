#!/usr/bin/env node
// 2026-09-23, at Brendan Adams's request. Re-runnable.
// Removes the "CORRECTION 2026-09-22: Removed a block of family-wide places ..."
// note from every record. The block was a data-processing error, not a
// finding about anyone, so it does not belong in the records.
'use strict';
const fs = require('fs');
const { DIR, load, save } = require('./lib/records');
let n = 0;
for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.json'))) {
  const p = load(f.replace(/\.json$/, ''));
  const before = (p.notes || []).length;
  p.notes = (p.notes || []).filter(t => !/Removed a block of family-wide places/.test(t));
  if (p.notes.length !== before) { save(p); n++; }
}
console.log(`note removed from ${n} records`);
