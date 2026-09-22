#!/usr/bin/env node
/**
 * Fill in four mothers that the records supported but never stated
 * (2026-09-22, approved by Brendan). Re-runnable.
 *
 * Rule used: the father had exactly one recorded wife, the child's birth falls
 * within that marriage, and the surrounding records (siblings' records or the
 * child's own notes) name her as the mother.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const TAG = 'CORRECTION 2026-09-22:';

const FILLS = [
  { child: 'adams_george_francis_1', mother: 'hamilton_elizabeth_eliza',
    why: 'Mother set to hamilton_elizabeth_eliza: the only recorded wife of his father Jose Pierre Adams, and named as mother by his siblings\' records.' },
  { child: 'adams_george_francis_2', mother: 'vantine_mary_frances',
    why: 'Mother set to vantine_mary_frances: his sister Alberta\'s record lists him as a full sibling, and Mary Frances Vantine is John Wesley Adams\'s wife at his birth (m. 1866; b. 1876).' },
  { child: 'adams_john_wesley', mother: 'lane_cynthia',
    why: 'Mother set to lane_cynthia: the only recorded wife of his father George Francis Adams (#1), married 1841, the year of his birth; his siblings\' records name her as mother.' },
  { child: 'elizabeth_adams', mother: 'nicole_adawn_della_selva',
    why: 'Mother set to nicole_adawn_della_selva, named in this record\'s own notes ("Child of Geoffry Louis Adams and Nicole Adawn Della Selva").' },
  { child: 'frankie_adams', mother: 'nicole_adawn_della_selva',
    why: 'Mother set to nicole_adawn_della_selva, named in this record\'s own notes ("Child of Geoffry Louis Adams and Nicole Adawn Della Selva").' },
];

const load = id => JSON.parse(fs.readFileSync(path.join(DIR, id + '.json'), 'utf8'));
const save = (id, p) => fs.writeFileSync(path.join(DIR, id + '.json'), JSON.stringify(p, null, 2) + '\n');

let n = 0;
for (const { child, mother, why } of FILLS) {
  const c = load(child);
  if (c.relationships.mother !== mother) {
    c.relationships.mother = mother;
    c.notes = c.notes || [];
    const full = `${TAG} ${why}`;
    if (!c.notes.includes(full)) c.notes.push(full);
    save(child, c); n++;
  }
  const m = load(mother);
  m.relationships.children = m.relationships.children || [];
  if (!m.relationships.children.includes(child)) {
    m.relationships.children.push(child);
    save(mother, m); n++;
  }
}
console.log(`mothers filled; ${n} file(s) written`);
