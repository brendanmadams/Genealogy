#!/usr/bin/env node
/**
 * Ralph's surname, and Louise Morgan's maiden name, was O'Dell
 * (Brendan Adams, 2026-09-22). Re-runnable.
 */
'use strict';
const { load, save, note, rename } = require('./lib/records');

rename('ralph_husband_of_rosemary_wells', 'odell_ralph');
const r = load('odell_ralph');
r.name = "Ralph O'Dell";
note(r, "Surname O'Dell per Brendan Adams, 2026-09-22. Husband of Rosemary Wells.");
save(r);

const w = load('wells_rosemary');
w.name = "Rosemary Wells (O'Dell)";
save(w);

const l = load('morgan_louise');
l.name = "Louise O'Dell (Morgan)";
l.aliases = [...new Set([...(l.aliases || []), 'Louise Morgan'])];
l.notes = l.notes.map(n => n.replace("her maiden name (Ralph's surname) is not recorded", "her maiden name is O'Dell"));
save(l);
console.log("O'Dell names written");

// Married women's ids use their maiden surname (e.g. wheeler_dorothy_ann).
rename('morgan_louise', 'odell_louise');
