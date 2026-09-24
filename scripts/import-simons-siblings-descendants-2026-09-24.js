#!/usr/bin/env node
/**
 * 2026-09-24, descendants of Henry Simons's children Mary Jane, Sarah, Richard,
 * Rebecca Ann and Olive, four generations down, from Find a Grave family links
 * (data/imports/findagrave-simons-siblings-2026-09-24.txt); and George A.'s
 * family from the 1870, 1880 and 1900 censuses. Re-runnable.
 * Names are put in the tree's form, "Given Middle Birth (Married)"; when the
 * order of a woman's marriages is not clear, only the last married name is
 * shown and the rest are aliases. Each person cites their own memorial.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const FAG = n => `Find a Grave, memorial ${n}`;
const exact = d => /^\d{1,2} \w{3} \d{4}$/.test(d);
const better = (old, neu) => neu && neu !== 'unknown' && (!old || (!exact(old) && exact(neu)) || (/^(abt )?\d{4}$/.test(old) && neu.endsWith(old.replace('abt ', ''))));

// memorials already in the tree
const KNOWN = {
  78651501: 'simons_henry', 78651692: 'wagner_mary',
  15329399: 'simons_olive_catherine', 15329398: 'decker_peter', 16501630: 'parsons_stephen', 15431288: 'decker_simeon', 109621327: 'decker_clyde',
  29778599: 'simons_mary_jane', 29778587: 'fryman_joel', 167803282: 'fryman_sarah', 141485149: 'fryman_william_j', 29778644: 'fryman_homer',
  66385846: 'simons_richard', 31651884: 'vanfossen_mary_ellen', 64384921: 'purdy_minnie_belle', 66385831: 'turnipseed_mary_a', 21066190: 'simons_hallah', 115063437: 'simons_leroy_scott', 120973908: 'simons_elmer_henry',
  68165791: 'simons_ann_1854', 68165790: 'forester_stephen_s', 57296268: 'forester_charles_elmer',
  92466844: 'simons_sarah_1844', 243836323: 'rogers_charles_t', 203661409: 'rogers_orpha',
};
// descendants: [sex, name in the tree's form]; names not listed are used as on Find a Grave
const DESC = {
  15431288: ['M'], 21066190: ['F'], 29778644: ['M'], 41087751: ['M'], 57296268: ['M'], 92073915: ['M'], 109621327: ['M'], 115063437: ['M'], 120973908: ['M'],
  132906187: ['F', 'Sylvia Jane Rogers (Dawson)'], 141485149: ['M'], 160352631: ['M'], 167803282: ['F'], 203661409: ['F', 'Orpha A. Rogers (Pence)'],
  13942514: ['M'], 13942677: ['M'], 32317802: ['M'], 41087749: ['F', 'Merl Rogers (Hart)'], 81827780: ['M'], 91032396: ['F', 'Clelah M. Simons (Tobey)'],
  94087042: ['M'], 111485315: ['M'], 115063436: ['F'], 120973906: ['M'], 128193003: ['M'], 149398201: ['F', 'Lurl Irella Dawson (Worman)'], 150658268: ['F'],
  152475176: ['F', 'Elizabeth K. Rogers'], 152475178: ['F', 'Mary Louise Rogers (Jacob)'], 153255137: ['F', 'Pauline Vaughn Rogers (Rohr)'], 167071020: ['M'],
  167803437: ['M', 'Rudolph Swift'], 176683873: ['M'], 193489102: ['M'], 243844811: ['F'], 276999218: ['F', 'Dorothy Dian Simons (Stephenson)'],
  7032840: ['F', 'Luzetta Mae Worman (Walter, Swantusch)'], 29778869: ['F', 'Hazel Winona Swift (Thompson)'], 32317722: ['M'], 45223299: ['F', 'Diana L. Simons (Musselman)'],
  53886208: ['F', 'Minnie E. Rogers (Loshe)'], 87356192: ['M'], 93101174: ['M'], 94068592: ['F', 'Willodean Carol Rogers (Young)'], 94068786: ['F', 'Arlene Mae Rogers (LaFever)'],
  96388216: ['F', 'Jean Ellen Jacob (Kenel)'], 141474811: ['F', 'Evelyn Elnor Dawson (Richardson)'], 148642200: ['M'], 149398106: ['M'], 150792124: ['M', 'Henry Edward Worman'],
  152475083: ['M'], 153255136: ['M', 'Robert W. Rohr'], 167802643: ['M', 'Lowell Rudolph Swift'], 167804046: ['F', 'Muriel Alberta Swift (Snyder)'],
  244766825: ['F', 'Lou Eva Rogers (Wideman)'], 247585835: ['M', 'Richard Martin Jacob'], 288301132: ['M'], 291445035: ['F', 'Margie Ann Simons (Howard)'],
  22315253: ['M'], 167802294: ['F', 'Jeanine Daire Swift (Acuff)'], 167802834: ['M', 'Dennis Lowell Swift'], 167818682: ['M'], 192499090: ['F', 'Cheryl Sue “Cheri” LaFever (Clark)'],
  195973861: ['M'], 235543451: ['M', 'Dallas Dale Thompson'], 243767527: ['M', 'Rodney Dean Wideman'], 247892206: ['M'], 300587559: ['M'], 305529967: ['M', 'Robert Stephen “Bob” Loshe'],
};
// spouses: [sex, name in the tree's form] (the other spouse's sex follows)
const SPOUSE = {
  15431289: ['F', 'Ardella M. “Della” Sisson (Decker)'], 21066131: ['M', 'George Sheridan Adams'], 13942693: ['F', 'Daisy Ann Spicer (Fryman)'],
  41087750: ['F', 'Sarah Ellen Hovarter (Rogers, Leighty)'], 57296267: ['F', 'Etta May Burch (Forester)'], 66082492: ['F', 'Nora Hogue (Rogers, Morr)'],
  109621367: ['F', 'Merle Grace Decker'], 109621240: ['F', 'Esther Shirtliff (Decker)'], 36018335: ['F', 'Florence Belle Phillips (Comerford)', 'Florence Simons'],
  115063438: ['F', 'Viola Ellen Stall (Simons)'], 120973907: ['F', 'Edna Elizabeth Isenhower (Simons)'], 18926121: ['M', 'John E. Dawson'],
  102532526: ['F', 'Lena Hubbard (Fryman)'], 240163160: ['F', 'Eva Viola Crummay (Rogers)'], 165081371: ['F', 'Grace Ann Lazenby (Rogers)'], 167803102: ['M', 'Frank A. Swift'],
  203661361: ['M', 'Kary Elva Pence'], 122956343: ['F', 'Helen Elizabeth Braden (Fryman)'], 32317798: ['F', 'Allie Jane Hopkins (Fryman)'], 41087748: ['M', 'Clarence Freeman Hart'],
  121481309: ['F', 'Thelma L. VanHoose (Simons, Sechler)'], 91032942: ['M', 'Harry A. Tobey'], 93101216: ['F', 'Sarah Ellen Gibson (Rogers)'], 120973909: ['F', 'Teresa A. Ratkowski (Simons)'],
  128193023: ['F', 'Leah Alma Clevenger (Dawson, Ritter)'], 149398173: ['M', 'Henry W. Worman'], 152475179: ['M', 'Martin Clifford Jacob'], 153255054: ['M', 'William Harvey Rohr Jr.'],
  167071104: ['F', 'Myrtle Mae Adams (Simons)'], 167803382: ['F', 'Sarah Jemima Kimble (Swift)'], 193489430: ['F', 'Constance Cathleen “Kate” Fidell (Badik)', 'Kate Rogers'],
  200148007: ['M', 'Homer Duane Stephenson'], 92754908: ['M', 'Victor Merwood Walter'], 128609175: ['M', 'Dr. Otto H. Swantusch'], 29778873: ['M', 'James Park Thompson'],
  94068601: ['M', 'Robert Dale Loshe'], 167803810: ['F', 'Helen Ida Hardy (Swift)'], 236786119: ['M', 'William James Young Sr.'], 300561391: ['M', 'Albert Jerome “Jerry” Kenel Sr.'],
  151057904: ['M', 'Forrest Leroy Richardson'], 148642207: ['F', 'Della Virginia Wade (Swift)'], 101134327: ['F', 'Mabel Pearl Lewis (Worman)'],
  167802666: ['F', 'Grace Ernestine Defenbaugh (Leopard)', 'Grace Swift'], 167804090: ['M', 'James William Snyder'], 180565215: ['F', 'Thelma I. Pieper (Jacob)'],
  300579840: ['F', 'Ruth Anne Paul (Jacob)'], 144053399: ['M', 'Philip Potvin Howard'], 167818528: ['F', 'Mary Elizabeth Ernst (Snyder)'], 288272472: ['F', 'Daphna Audie Isom (Kaenan)'],
};
const SKIP_SPOUSE = new Set(['143377693']);   // a duplicate memorial for John E. Dawson
const NO_DATES = new Set(['288272472']);      // no death date on Find a Grave; possibly living
const VETERAN = new Set(['167803437', '150792124', '167802643', '247585835', '167802834', '235543451', '305529967']);

// parse the walk
const rows = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'imports', 'findagrave-simons-siblings-2026-09-24.txt'), 'utf8')
  .split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split(';'));
const P = {};
for (const r of rows) {
  const [id, gen, fname, birth, bplace, death, dplace, parents, spouses, children] = r;
  P[id] = { id, gen: +gen, fname: fname.replace(/ VVeteran$/, ''), birth, bplace, death: death === 'unknown' ? '' : death, dplace,
    parents: parents ? parents.split(',') : [], children: children ? children.split(',') : [],
    spouses: (spouses || '').split('|').filter(Boolean).map(s => { const [sid, txt] = s.split('~'); const m = txt.match(/^(.*?) (\d{4}) ?– ?(\d{4}|unknown)?(?:\(m\.(\d{4})?)?/); return { id: sid, name: m ? m[1] : txt, b: m && m[2], d: m && m[3] !== 'unknown' ? m[3] : '', m: m && m[4] }; }) };
}
const slug = s => s.normalize('NFKD').replace(/[“”"().]/g, '').replace(/[^\w\s-]/g, '').trim().toLowerCase().split(/\s+/);
const used = new Map();
const idFor = (fgid, name) => {
  if (KNOWN[fgid]) return KNOWN[fgid];
  const t = slug(name.replace(/\s*\(.*\)$/, '').replace(/^Dr\.? /, '').replace(/ (Jr|Sr)\.?$/, ''));
  const base = `${t[t.length - 1]}_${t[0]}`;
  const taken = used.has(base) && used.get(base) !== fgid;
  const id = taken || (exists(base) && !load(base).sources.includes(FAG(fgid))) ? `${base}_${fgid}` : base;
  used.set(id, fgid);
  return id;
};
const ID = {};
for (const id of Object.keys(P)) ID[id] = idFor(id, (DESC[id] && DESC[id][1]) || P[id].fname);
for (const p of Object.values(P)) for (const s of p.spouses) if (!SKIP_SPOUSE.has(s.id) && !ID[s.id]) ID[s.id] = idFor(s.id, (SPOUSE[s.id] && SPOUSE[s.id][1]) || s.name);
const sexOf = fg => (DESC[fg] && DESC[fg][0]) || (SPOUSE[fg] && SPOUSE[fg][0]) || '';

// people
for (const p of Object.values(P)) {
  const id = ID[p.id];
  const name = (DESC[p.id] && DESC[p.id][1]) || p.fname;
  if (!exists(id)) save(blank(id, name, sexOf(p.id)));
  edit(id, FAG(p.id), r => {
    if ((!KNOWN[p.id] || (DESC[p.id] && DESC[p.id][1])) && r.name !== name) { add(r.aliases, r.name); r.name = name; }
    if (p.fname !== r.name) add(r.aliases, p.fname);
    if (!r.sex && sexOf(p.id)) r.sex = sexOf(p.id);
    if (better(r.birth, p.birth)) r.birth = p.birth;
    if (better(r.death, p.death)) r.death = p.death;
    for (const l of [p.bplace, p.dplace]) if (l) add(r.locations, l);
    const born = p.birth ? `Born ${p.birth}${p.bplace ? ` at ${p.bplace}` : ''}` : '';
    const died = p.death ? `died ${p.death}${p.dplace ? ` at ${p.dplace}` : ''}` : '';
    if (!KNOWN[p.id] && (born || died)) note(r, `${[born, died].filter(Boolean).join('; ')} (Find a Grave, memorial ${p.id}).`.replace(/^died/, 'Died'));
    if (VETERAN.has(p.id)) note(r, 'Find a Grave marks him as a veteran.');
    if (p.id === '243767527') note(r, 'Find a Grave spells his surname Widewman, apparently an error for his mother\'s married name Wideman.');
    if (p.id === '167818682') note(r, 'Find a Grave gives no death date.');
  });
}
// spouses and marriages
for (const p of Object.values(P)) for (const s of p.spouses) {
  if (SKIP_SPOUSE.has(s.id)) continue;
  const both = KNOWN[p.id] && KNOWN[s.id];   // marriages already recorded by fix-2026-09-24-simons-siblings.js
  const sid = ID[s.id];
  const def = SPOUSE[s.id] || [sexOf(p.id) === 'M' ? 'F' : sexOf(p.id) === 'F' ? 'M' : '', s.name];
  if (!exists(sid)) save(blank(sid, def[1], def[0]));
  edit(sid, FAG(s.id), r => {
    if (!KNOWN[s.id] && r.name !== def[1]) { add(r.aliases, r.name); r.name = def[1]; }
    if (s.name !== r.name) add(r.aliases, s.name);
    if (def[2]) add(r.aliases, def[2]);
    if (!r.sex && def[0]) r.sex = def[0];
    if (!NO_DATES.has(s.id)) { if (better(r.birth, s.b)) r.birth = s.b; if (better(r.death, s.d)) r.death = s.d; }
    const other = load(ID[p.id]).name;
    if (!both) add(r.milestones, `Married ${other}${s.m ? ` (m. ${s.m})` : ''}`);
    if (!KNOWN[s.id]) note(r, `${def[0] === 'F' ? 'Wife' : def[0] === 'M' ? 'Husband' : 'Spouse'} of ${other}${s.m ? `, married ${s.m}` : ''} (Find a Grave, memorial ${s.id}).`);
  });
  if (!both) edit(ID[p.id], [], r => add(r.milestones, `Married ${load(sid).name}${s.m ? ` (m. ${s.m})` : ''}`));
  wed(ID[p.id], sid);
}
// parents and children, from both directions of the links
const setParent = (kidFg, parFg) => {
  const kid = ID[kidFg], par = ID[parFg] || KNOWN[parFg];
  if (!kid || !par || !exists(par)) return;
  const sex = sexOf(parFg) || load(par).sex;
  edit(kid, [], r => { if (sex === 'F') { if (!r.relationships.mother) r.relationships.mother = par; } else if (sex === 'M') { if (!r.relationships.father) r.relationships.father = par; } });
  edit(par, [], r => add(r.relationships.children, kid));
};
for (const p of Object.values(P)) {
  if (p.gen === 0) continue;
  for (const par of p.parents) setParent(p.id, par);
}
for (const p of Object.values(P)) for (const c of p.children) if (P[c]) setParent(c, p.id);

// ── George A. Simons's family, from the censuses ──────────────────────────────
const C = y => `Ancestry.com, ${y} United States Federal Census`;
edit('mcclain_sophronia', [C(1870), C(1880), C(1900)], r => {
  add(r.aliases, 'Sarah J. Simons'); add(r.aliases, 'Sarah Simons');
  if (!r.birth) r.birth = 'abt 1853';
  r.milestones = r.milestones.map(t => t === 'Married George A. Simons' ? 'Married George A. Simons (m. abt 1870)' : t);
  note(r, 'Listed as Sarah J. (17) in 1870, Sarah (27) in 1880 and Sophronia (46) in 1900, when she and George had been married 30 years; so the Sarah of the earlier censuses is Sophronia. Her daughters: Anna B. and Alvaretta (both about 1870), Merta M. (about 1878) and Hallie (about 1891).');
});
edit('simons_george_a', [C(1880), C(1900)], r => {
  r.milestones = r.milestones.map(t => t === 'Married Sophronia McClain' ? 'Married Sophronia McClain (m. abt 1870)' : t);
  for (const l of ['North West Township, Williams County, Ohio', 'Clear Lake, Steuben County, Indiana']) add(r.locations, l);
  note(r, 'A farmer in North West Township, Williams County, Ohio, in 1880 and at Clear Lake, Steuben County, Indiana, by 1900 (owning a mortgaged farm), with his wife Sophronia ("Sarah") and their daughters Anna B., Alvaretta, Merta M. and Hallie.');
});
for (const [id, name, b, text] of [
  ['simons_anna_b', 'Anna B. Simons', 'abt Apr 1870', 'Aged 2 months in the 1870 census and 10 in 1880.'],
  ['simons_alvaretta', 'Alvaretta Simons', 'abt 1870', 'Aged 10 in the 1880 census, like her sister Anna B.'],
  ['simons_merta_m', 'Merta M. Simons', 'abt 1878', 'Aged 2 in the 1880 census.'],
  ['simons_hallie', 'Hallie Simons', 'abt 1891', 'Aged 9 in the 1900 census, Clear Lake, Steuben County, Indiana.'],
]) {
  if (!exists(id)) save(blank(id, name, 'F'));
  edit(id, [C(1870), C(1880), C(1900)], r => { if (!r.birth) r.birth = b; note(r, `Daughter of George A. and Sophronia (McClain) Simons. ${text}`); });
  edit(id, [], r => { r.relationships.father = 'simons_george_a'; r.relationships.mother = 'mcclain_sophronia'; });
  for (const par of ['simons_george_a', 'mcclain_sophronia']) edit(par, [], r => add(r.relationships.children, id));
}
edit('simons_henry', C(1880), r => note(r, 'In the 1880 census he was 62, a farmer in North West Township, Williams County, Ohio, both his parents born in England; the index lists him alone, and his son George lived nearby (dwelling 209).'));
console.log('Simons siblings\' descendants imported:', Object.keys(P).length, 'memorials');
