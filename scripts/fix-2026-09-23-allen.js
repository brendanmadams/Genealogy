#!/usr/bin/env node
/**
 * George Philip Allen's two wives, his children's mother, exact marriage
 * dates, and William W. "Bill" Allen, from "Descendants of Jose Pierre Adams"
 * (compiled by Bill Allen, Nov 2010). Added at Brendan Adams's request,
 * 2026-09-23. Re-runnable.
 */
'use strict';
const { exists, load, save, note, rename } = require('./lib/records');
const DOC = 'Descendants of Jose Pierre Adams (compiled by William W. "Bill" Allen, Nov 2010)';
const TAG = 'CORRECTION 2026-09-23:';
const add = (arr, v) => { if (v && !arr.includes(v)) arr.push(v); };
const swap = (arr, from, to) => { const i = arr.indexOf(from); if (i >= 0) arr[i] = to; else add(arr, to); };

function person(id, name, extra = {}) {
  const p = exists(id) ? load(id) : {
    id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [],
    risk_events: [], milestones: [], education: [], career: [],
    relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] },
    locations: [], sources: [], notes: [], aliases: [],
  };
  if (extra.birth) p.birth = extra.birth;
  if (extra.death) p.death = extra.death;
  for (const k of ['locations', 'aliases', 'milestones', 'notable_stories', 'career', 'education', 'roles', 'personality', 'sources', 'notes']) p[k] = p[k] || [];
  for (const k of ['locations', 'aliases', 'milestones', 'notable_stories', 'career', 'education', 'roles']) for (const v of extra[k] || []) add(p[k], v);
  for (const n of extra.notes || []) note(p, n);
  add(p.sources, DOC);
  save(p);
  return p;
}
const setRel = (id, k, v) => { const p = load(id); p.relationships[k] = v; save(p); };
const addChild = (par, kid) => { const p = load(par); add(p.relationships.children, kid); save(p); };
const addSpouse = (a, b) => {
  for (const [x, y] of [[a, b], [b, a]]) {
    const p = load(x); const r = p.relationships;
    if (!r.spouse) r.spouse = y; else if (r.spouse !== y) { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); }
    save(p);
  }
};

// ── Esther Jane Anthony and her parents ────────────────────────────────────
person('anthony_esther_jane', 'Esther Jane Anthony (Allen)', {
  birth: 'Sep 1898', death: '18 Jun 1982',
  locations: ['Custer County, NE', 'Marceline, MO', 'Waukegan, IL', 'Pueblo, CO'],
  milestones: ['Born September 1898, Custer County, Nebraska', 'Married George Philip Allen (m. 15 Jun 1919, First Baptist Church, Marceline, MO)', 'Died 18 June 1982, Pueblo, Colorado, aged 83'],
  notable_stories: ['After years of moving around the West and Midwest for George Philip\'s work during the Depression, the family settled in Pueblo, Colorado. She wanted a steadier life and was not happy with their modest means.'],
  notes: [`${TAG} Dates, places, parents and children added from Bill Allen's family document. Mother of George Homer Allen and Margaret Jeanice "Peggy" Allen.`],
});
{ const e = load('anthony_esther_jane'); e.name = 'Esther Jane Anthony (Allen)'; e.notes = e.notes.filter(n => n !== 'First spouse of George Philip Allen (m. 1919).'); save(e); }
person('anthony_homer_gideon', 'Homer Gideon Anthony', { notes: ['Father of Esther Jane Anthony.'] });
person('shoush_anna_elizabeth', 'Anna Elizabeth Shoush (Anthony)', { notes: ['Mother of Esther Jane Anthony.'] });
addSpouse('anthony_homer_gideon', 'shoush_anna_elizabeth');
setRel('anthony_esther_jane', 'father', 'anthony_homer_gideon');
setRel('anthony_esther_jane', 'mother', 'shoush_anna_elizabeth');
addChild('anthony_homer_gideon', 'anthony_esther_jane');
addChild('shoush_anna_elizabeth', 'anthony_esther_jane');

for (const kid of ['allen_george_homer', 'allen_margaret_jeanice']) {
  setRel(kid, 'mother', 'anthony_esther_jane');
  addChild('anthony_esther_jane', kid);
  const k = load(kid);
  k.notes = k.notes.map(n => n.replace(' Mother left unknown pending a source (George Philip\'s first wife Esther Jane Anthony, m. 1919, is the likely candidate).', ''));
  note(k, `${TAG} Mother set to Esther Jane Anthony, per Bill Allen's family document.`);
  add(k.sources, DOC);
  save(k);
}

// ── Anna Caroline Koenig and Victor Winfrey ────────────────────────────────
person('koenig_anna_caroline', 'Anna Caroline Koenig (Winfrey, Allen)', {
  birth: '16 Feb 1894', death: '27 Jul 1962',
  aliases: ['Caroline Allen', 'Caroline Winfrey'],
  locations: ['Germany', 'San Mateo, CA', 'Burlingame, CA', 'Santa Cruz Mountains, CA', 'Millbrae, CA'],
  career: ['Short-order cook at a diner in San Mateo, CA', 'Chef at a German restaurant in Burlingame, CA'],
  milestones: ['Born 16 February 1894, Germany', 'Widowed in 1946 when her first husband, Victor Winfrey, died; she had two young sons', 'Married George Philip Allen (second marriage for both)', 'Died 27 July 1962, Millbrae, San Mateo County, California, aged 68'],
  notable_stories: [
    'Met George Philip Allen at the San Mateo diner where she cooked. It was on his mail route; he came for lunch, then breakfast and lunch, and dinner too when she worked evenings.',
    'She and George Philip had a cabin in the Santa Cruz Mountains with an open-air kitchen. Grandchildren remembered her breakfasts cooked on the big wood-burning stove: blueberry pancakes, French toast, bacon and eggs.',
  ],
  personality: [],
  notes: [`${TAG} Dates, places, first marriage and story added from Bill Allen's family document, which remembers her as warm and caring, treating the grandchildren as her own. Her two sons with Victor Winfrey are not named there.`],
});
{
  const c = load('koenig_anna_caroline');
  c.name = 'Anna Caroline Koenig (Winfrey, Allen)';
  add(c.personality, 'Warm and caring');
  add(c.personality, 'An incredible cook');
  c.notes = c.notes.filter(n => n !== 'Second spouse of George Philip Allen; was a chef at a diner he frequented on his mail route.');
  save(c);
}
person('winfrey_victor', 'Victor Winfrey', { death: '1946', notes: ['First husband of Anna Caroline Koenig; died 1946, leaving her with two young sons.'] });
addSpouse('koenig_anna_caroline', 'winfrey_victor');
{ // keep George Philip as her listed spouse, Victor as the earlier one
  const c = load('koenig_anna_caroline');
  c.relationships.spouse = 'allen_george_philip';
  c.relationships._extra_spouses = ['winfrey_victor'];
  save(c);
}

// ── George Philip Allen ────────────────────────────────────────────────────
{
  const g = load('allen_george_philip');
  swap(g.milestones, 'Married Esther Jane Anthony (m. 1919)', 'Married Esther Jane Anthony (m. 15 Jun 1919, First Baptist Church, Marceline, MO)');
  add(g.milestones, 'Joined the U.S. Navy, 3 December 1917, St. Louis, Missouri');
  add(g.milestones, 'Died 24 February 1972, Santa Clara, California, aged 74');
  add(g.notable_stories, 'Shortly after World War II he left the family home in Pueblo, Colorado, and moved to San Mateo, California, where he kept delivering mail for the Post Office.');
  add(g.locations, 'Santa Clara, CA');
  add(g.sources, DOC);
  save(g);
}

// ── Exact marriage dates ───────────────────────────────────────────────────
{
  const h = load('allen_george_homer');
  swap(h.milestones, 'Married Dorothy Ann Wheeler (m. 1944)', 'Married Dorothy Ann Wheeler (m. 8 May 1944, Sioux Falls, SD)');
  swap(h.milestones, 'Married Suzzanne Modine (m. 1972)', 'Married Suzzanne Modine (m. 22 Nov 1972, Las Vegas, NV)');
  add(h.sources, DOC); save(h);
  const d = load('wheeler_dorothy_ann');
  swap(d.milestones, 'Married George Homer Allen', 'Married George Homer Allen (m. 8 May 1944, Sioux Falls, SD)');
  add(d.sources, DOC); save(d);
  const s = load('modine_suzzanne');
  s.notes = s.notes.map(n => n === 'Second spouse of George Homer Allen (m. 1972).' ? 'Second spouse of George Homer Allen (m. 22 Nov 1972, Las Vegas, NV).' : n);
  add(s.sources, DOC); save(s);
  const m = load('allen_margaret_jeanice');
  swap(m.milestones, 'Married Jack Frederick Seavy (m. 1948)', 'Married Jack Frederick Seavy (m. 3 Sep 1948)');
  save(m);
  const j = load('seavy_jack_frederick');
  j.notes = j.notes.map(n => n === 'Spouse of Margaret Jeanice Peggy Allen (m. 1948).' ? 'Spouse of Margaret Jeanice Peggy Allen (m. 3 Sep 1948).' : n);
  add(j.sources, DOC); save(j);
}

// ── William W. "Bill" Allen ────────────────────────────────────────────────
rename('allen_william_dorothy', 'allen_william_w');
person('allen_william_w', 'William W. Allen', {
  birth: '5 Dec 1952',
  aliases: ['Bill Allen'],
  locations: ['Santa Barbara, CA', 'Columbus, OH'],
  education: ['Associate of Arts, Santa Barbara City College, 1974', 'Studied photography, including with Ruth Bernhardt, Robert Werling and Michael Smith', 'B.S. Electrical Engineering, Ohio State University, 1987', 'M.S. Electrical Engineering, Ohio State University, 1990'],
  roles: ['Family historian: compiled "Descendants of Jose Pierre Adams" (2010) and "Further Research on the Family and Descendants of Joseph P. and Elizabeth (Hamilton) Adams" (February 2012), continuing research begun by Ralph Allen'],
  milestones: ['Born 5 December 1952, Santa Barbara, California', 'Married Ruth Pamela Janes (m. 8 Dec 1991, La Casa de Maria, Santa Barbara, CA)'],
  notes: [`${TAG} Renamed from "William Allen" (id allen_william_dorothy) to William W. "Bill" Allen, the family researcher behind the family document and many of the Adams research emails.`],
});
{ const w = load('allen_william_w'); w.name = 'William W. Allen'; w.notes = w.notes.filter(n => n !== 'Child of George Homer Allen and Dorothy Ann Wheeler. Disambiguated from other William Allens.'); note(w, 'Son of George Homer Allen and Dorothy Ann Wheeler.'); save(w); }
person('janes_ruth_pamela', 'Ruth Pamela Janes (Allen)', {
  birth: '16 Sep 1955',
  locations: ['Long Beach, CA', 'Santa Barbara, CA'],
  milestones: ['Born 16 September 1955, Long Beach, California', 'Married William W. Allen (m. 8 Dec 1991, La Casa de Maria, Santa Barbara, CA)'],
});
addSpouse('allen_william_w', 'janes_ruth_pamela');
console.log('Allen family written');
