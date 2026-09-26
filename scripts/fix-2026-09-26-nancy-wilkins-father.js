#!/usr/bin/env node
/**
 * 2026-09-26, Nancy Wilkins is Pierre Robert Wilkins's daughter, per Ed Simons
 * (relayed by Brendan Adams). Links her to Pierre and reworks the notes that
 * left her father open. Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const ED2 = 'Ed Simons, family account (Nancy Wilkins is Pierre Wilkins\'s daughter), relayed by Brendan Adams, 26 Sep 2026';

const n = load('wilkins_nancy');
n.relationships.father = 'wilkins_pierre_robert';
n.notes = n.notes.map(t => /^Granddaughter of Roma Eloise \(Abernathy\) Wilkins, through one of Roma's sons/.test(t)
  ? 'Daughter of Pierre Robert Wilkins (1932–1998) and so a granddaughter of Roma Eloise (Abernathy) Wilkins and a half first cousin of Mary (Walker) Simons, whose mother Marrion was Roma\'s daughter; a 23andMe match to Mary at first-cousin level. She lives in Portland and had two sisters and a brother, of whom one sister is living (Ed Simons, 2026). Her mother is not yet recorded.'
  : t);
add(n.sources, ED2);
save(n);

const p = load('wilkins_pierre_robert');
add(p.relationships.children, 'wilkins_nancy');
p.notes = p.notes.map(t => /^Born 14 Oct 1932 at St\. Louis, son of John J\. Wilkins and Roma Abernathy; died 6 Oct 1998 \(Social Security file\)\. Half-brother of Marrion/.test(t)
  ? 'Born 14 Oct 1932 at St. Louis, son of John J. Wilkins and Roma Abernathy; died 6 Oct 1998 (Social Security file). Half-brother of Marrion (Hinds) Walker through Roma, and father of Nancy Wilkins of Portland, Mary Simons\'s DNA match, and of her two sisters and brother (Ed Simons, 2026); his wife is not yet recorded.'
  : t);
add(p.sources, ED2);
save(p);
const m = load('hinds_marrion_roma');
m.notes = m.notes.map(t => t.replace("between Marrion's daughter Mary and Roma's granddaughter Nancy Wilkins confirms", "between Marrion's daughter Mary and Roma's granddaughter Nancy Wilkins, Pierre's daughter, confirms"));
add(m.sources, ED2);
save(m);
console.log('Nancy Wilkins father applied');
