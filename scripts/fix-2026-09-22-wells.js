#!/usr/bin/env node
/**
 * Rosemary Wells and her daughter Louise, from Brendan Adams, 2026-09-22.
 * Re-runnable.
 *  - Rosemary was Arthur Wells's daughter, not Serena Trumbo's (Serena married
 *    Arthur in 1929; Rosemary was born about 1916). She is a step-sister of
 *    George Francis Adams Sr., not a half sister.
 *  - Louise goes by Louise Morgan, her husband's surname. She is not the DNA
 *    match Louise Craig.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const TAG = 'CORRECTION 2026-09-22:';
const load = id => JSON.parse(fs.readFileSync(path.join(DIR, id + '.json'), 'utf8'));
const save = p => fs.writeFileSync(path.join(DIR, p.id + '.json'), JSON.stringify(p, null, 2) + '\n');
const note = (p, t) => { p.notes = p.notes || []; if (!p.notes.includes(t)) p.notes.push(t); };

const r = load('wells_rosemary');
if (r.relationships.mother === 'trumbo_serena_marie') r.relationships.mother = '';
r.notes = r.notes.filter(n => !n.includes('This makes Rosemary a half sister'));
note(r, `${TAG} Mother is not Serena Marie Nevada Trumbo (confirmed by Brendan Adams): Rosemary was born about 1916 and Serena married Arthur Wells in 1929. Rosemary was Arthur's daughter from an earlier marriage, so she was a step-sister of George Francis Adams Sr. Her mother is not recorded.`);
save(r);

const s = load('trumbo_serena_marie');
s.relationships.children = s.relationships.children.filter(c => c !== 'wells_rosemary');
save(s);

const l = load('louise_daughter_of_rosemary_wells');
l.name = 'Louise Morgan';
l.notes = l.notes.filter(n => !n.startsWith('Daughter of Rosemary Wells and Ralph.'));
note(l, 'Daughter of Rosemary Wells and Ralph. Goes by Louise Morgan, her husband\'s surname; her maiden name (Ralph\'s surname) is not recorded. Not the same person as the DNA match Louise Craig (confirmed by Brendan Adams).');
save(l);

const sc = load('scott_son_of_louise');
sc.notes = sc.notes.map(n => n === 'Son of Louise, the daughter of Rosemary Wells. Surname not recorded.'
  ? 'Son of Louise Morgan, the daughter of Rosemary Wells. Surname not recorded.' : n);
save(sc);
console.log('Wells corrections written');
