#!/usr/bin/env node
/**
 * 2026-09-26, Mary Simons's half-sisters Roma Florence and Betty Ann Walker,
 * from Ed Simons (relayed by Brendan Adams) checked against Washington
 * marriage, divorce and death indexes. Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); for (const k of ['notes', 'sources', 'locations', 'aliases', 'milestones']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, p => { p.name = name; p.sex = sex; fn(p); }); };
const child = (kid, father, mother) => { edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; }); for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid)); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };

const ED = 'Ed Simons, family account of his aunts Roma and Betty Walker, relayed by Brendan Adams, 26 Sep 2026';
const EDT = 'Ancestry.com, public member tree of Ed Simons (tree 189265374)';
const RMAR = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Roma Florence Walker, born 5 Sep 1943, and Paul Carleton Hathaway, Franklin County, May 1962)';
const BDIV = 'FamilySearch, Washington Divorce Index, 1969-2014 (Betty A. Walker and Otho W. Eaton, 13 Feb 1970, Franklin County; ark 1:1:QLC7-WHPS)';
const BDEATH = 'FamilySearch, Washington Death Index, 1965-2014 (Betty A. Coomes, born 1945, died 28 Nov 2011, Benton County; ark 1:1:QLWS-6F8W); Ancestry.com, Washington, U.S., Death Records, 1907-2017 (resident of Walla Walla County) and Obituary Daily Times index (Betty Ann Coomes, née Walker, born Portland, died Kennewick, 2011); U.S., Public Records Index (Betty A. Coomes, born 11 Jun 1945; Pasco 1993, Burbank, Walla Walla County 1998–2020)';

// Roma
edit('walker_roma_florence', [ED, RMAR, EDT], p => {
  p.name = 'Roma Florence Walker (Hathaway, Walters)';
  for (const a of ['Roma Hathaway', 'Roma Walters']) add(p.aliases, a);
  for (const l of ['Richland, Benton County, Washington', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  p.notes = p.notes.map(n => n.replace(" Ed Simons's tree also names a husband Theodore Walters.", ''));
  note(p, 'Married Paul Carleton Hathaway in Franklin County in May 1962 and had two daughters, Amy and Lisa; now married to Theodore "Ted" Walters, and living at Kennewick. Ed Simons, her nephew, is close to her and her daughters (Ed Simons, 2026; county marriage record).');
  add(p.milestones, 'Married Paul Carleton Hathaway (m. May 1962, Franklin County, Washington)');
  add(p.milestones, 'Married Theodore "Ted" Walters');
});
person('hathaway_paul_carleton', 'Paul Carleton Hathaway', 'M', [RMAR, ED], p => {
  add(p.locations, 'Franklin County, Washington');
  note(p, 'Married Roma Florence Walker in Franklin County in May 1962; father of Amy and Lisa Hathaway (county marriage record; Ed Simons, 2026).');
  add(p.milestones, 'Married Roma Florence Walker (m. May 1962, Franklin County, Washington)');
});
person('walters_theodore', 'Theodore "Ted" Walters', 'M', [ED, EDT], p => {
  add(p.locations, 'Kennewick, Benton County, Washington');
  note(p, 'Roma (Walker) Hathaway\'s present husband; they live at Kennewick (Ed Simons, 2026).');
  add(p.milestones, 'Married Roma Florence (Walker) Hathaway');
});
wed('walker_roma_florence', 'hathaway_paul_carleton');
wed('walker_roma_florence', 'walters_theodore');
person('hathaway_amy', 'Amy Hathaway', 'F', [ED], p => { note(p, 'Daughter of Paul Hathaway and Roma Florence Walker; a first cousin of Ed Simons, who is close to her (Ed Simons, 2026).'); });
person('hathaway_lisa', 'Lisa Hathaway', 'F', [ED], p => { note(p, 'Daughter of Paul Hathaway and Roma Florence Walker; a first cousin of Ed Simons, who is close to her (Ed Simons, 2026).'); });
for (const k of ['hathaway_amy', 'hathaway_lisa']) child(k, 'hathaway_paul_carleton', 'walker_roma_florence');

// Betty
edit('walker_betty_ann', [ED, EDT, BDIV, BDEATH], p => {
  p.name = 'Betty Ann Walker (Eaton, Coomes)';
  p.birth = '11 Jun 1945'; p.death = '28 Nov 2011';
  for (const a of ['Betty Coomes', 'Betty Eaton']) add(p.aliases, a);
  for (const l of ['Portland, Oregon', 'Richland, Benton County, Washington', 'Pasco, Franklin County, Washington', 'Burbank, Walla Walla County, Washington', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  p.notes = p.notes.map(n => n === "Aged 4 in the 1950 census at Richland. Ed Simons's tree names her husbands as George Coomes and Otho Walter Eaton." ? 'Born 11 Jun 1945 at Portland, Oregon (public-records index; Ed Simons\'s tree); aged 4 in the 1950 census at Richland. Married first Otho Walter Eaton, whom she divorced in Franklin County on 13 Feb 1970, and then George Coomes; lived at Pasco and Burbank; died 28 Nov 2011 at Kennewick, aged 66, as Betty A. Coomes (divorce index; death index; obituary index).' : n);
  note(p, 'She had no children of her own; she and her first husband adopted a daughter, Mary Jane (Ed Simons, 2026).');
  add(p.milestones, 'Married Otho Walter Eaton (div. 13 Feb 1970, Franklin County, Washington)');
  add(p.milestones, 'Married George Coomes');
});
person('eaton_otho_walter', 'Otho Walter Eaton', 'M', [EDT, BDIV, ED], p => {
  add(p.locations, 'Franklin County, Washington');
  note(p, 'First husband of Betty Ann Walker; divorced in Franklin County 13 Feb 1970 (divorce index). With Betty he adopted a daughter, Mary Jane (Ed Simons, 2026).');
  add(p.milestones, 'Married Betty Ann Walker (div. 13 Feb 1970, Franklin County, Washington)');
});
person('coomes_george', 'George Coomes', 'M', [EDT, BDEATH, ED], p => {
  add(p.locations, 'Burbank, Walla Walla County, Washington');
  note(p, 'Second husband of Betty Ann Walker, who died as Betty A. Coomes in 2011 (Ed Simons\'s tree; death index).');
  add(p.milestones, 'Married Betty Ann Walker');
});
wed('walker_betty_ann', 'eaton_otho_walter');
wed('walker_betty_ann', 'coomes_george');
person('eaton_mary_jane', 'Mary Jane Eaton', 'F', [ED], p => {
  p.relationships.adopted = true;
  note(p, 'Adopted daughter of Betty Ann Walker and her first husband, Otho Walter Eaton; her birth family and the surname she uses are not known, and Eaton is assumed from the adoption (Ed Simons, 2026).');
});
child('eaton_mary_jane', 'eaton_otho_walter', 'walker_betty_ann');
console.log('Walker sisters applied');
