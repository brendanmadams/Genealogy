#!/usr/bin/env node
/**
 * Mateo Vlaho Obad is the son of Ivo John Obad and his first wife Susan, not
 * of Camille Remy (Brendan Adams, 2026-09-23). Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const TAG = 'CORRECTION 2026-09-23:';
const add = (a, v) => { if (!a.includes(v)) a.push(v); };

const m = load('mateo_vlaho_obad');
m.relationships.mother = 'susan_obad';
m.notes = m.notes.map(n => n === 'Siblings listed: Gabriel and Alina. Child of Camille Remy and Ivo Obad.' ? 'Half brother of Gabriel and Alina Obad.' : n);
note(m, `${TAG} Mother is Susan Obad, Ivo's first wife, not Camille Remy (per Brendan Adams). Gabriel and Alina, born after Ivo and Camille married in 2006, are his half siblings.`);
save(m);

const c = load('camille_remy');
c.relationships.children = c.relationships.children.filter(x => x !== 'mateo_vlaho_obad');
save(c);

const s = load('susan_obad');
s.relationships.spouse = 'ivo_john_obad';
s.relationships.children = s.relationships.children || [];
add(s.relationships.children, 'mateo_vlaho_obad');
s.milestones = s.milestones || [];
add(s.milestones, 'Married Ivo John Obad (his first wife)');
note(s, `${TAG} First wife of Ivo John Obad and mother of Mateo Vlaho Obad (per Brendan Adams). Maiden name not recorded.`);
save(s);

const i = load('ivo_john_obad');
i.relationships._extra_spouses = i.relationships._extra_spouses || [];
add(i.relationships._extra_spouses, 'susan_obad');
note(i, `${TAG} First married Susan Obad, mother of his son Mateo; married Camille Remy on 18 Aug 2006.`);
save(i);
console.log('Obad family corrected');
