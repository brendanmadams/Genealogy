#!/usr/bin/env node
/** 2026-09-25, Thomas Orlando Olson's record carries his full name; "Umpa", the grandchildren's name for him, goes into the notes and aliases. Re-runnable. */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const p = load('olson_tom_umpa');
p.name = 'Thomas Orlando Olson';
p.aliases = p.aliases || [];
add(p.aliases, 'Umpa');
p.notes = p.notes.map(n => n.replace('Megan Adams’s maternal grandfather, called "Umpa".', 'Megan Adams’s maternal grandfather, known to his grandchildren and great-grandchildren as "Umpa".'));
save(p);
for (const id of ['vangorden_rosemary', 'olson_sigrid', 'olson_tom', 'olson_kris']) {
  const q = load(id);
  q.milestones = (q.milestones || []).map(m => m.replace('Thomas Orlando “Umpa” Olson', 'Thomas Orlando Olson'));
  q.notes = (q.notes || []).map(n => n.replace('Tom "Umpa" Olson', 'Thomas Orlando "Umpa" Olson'));
  save(q);
}
console.log('Umpa name applied');
