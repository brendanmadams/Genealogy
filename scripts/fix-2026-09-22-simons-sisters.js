#!/usr/bin/env node
/**
 * Raymond Zell Simons's sisters Ettie, Lola and Bertha, recorded under their
 * birth surname Simons (Brendan Adams, 2026-09-22). Named in the "Siblings
 * listed" note on Raymond Zell's record. Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const SRC = 'Brendan Adams, 2026-09-22; named in Raymond Zell Simons\'s record ("Siblings listed: Ettie, Lola, Bertha")';
const NOTE = 'Sister of Raymond Zell Simons. Recorded under her birth surname Simons; she likely took a husband\'s surname, which is not recorded.';
const ids = [['simons_ettie', 'Ettie Simons'], ['simons_lola', 'Lola Simons'], ['simons_bertha', 'Bertha Simons']];
for (const [id, name] of ids) {
  const p = exists(id) ? load(id) : {
    id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [],
    risk_events: [], milestones: [], education: [], career: [],
    relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] },
    locations: [], sources: [], notes: [], aliases: [],
  };
  p.relationships.father = 'simons_aaron';
  p.relationships.mother = 'simons_harriet_hattie';
  if (!p.sources.includes(SRC)) p.sources.push(SRC);
  note(p, NOTE);
  save(p);
}
for (const par of ['simons_aaron', 'simons_harriet_hattie']) {
  const p = load(par);
  for (const [id] of ids) if (!p.relationships.children.includes(id)) p.relationships.children.push(id);
  save(p);
}
console.log('Ettie, Lola and Bertha Simons written');
