#!/usr/bin/env node
/**
 * 2026-09-24, Aaron Simons's parents and brothers and sisters, from the
 * 1850, 1860 and 1870 censuses, the 1845 Summit County marriage record and
 * Find a Grave, with the "A miscellaneous research tree" on Ancestry.com
 * (tree 62391298) as a guide. Re-runnable.
 *  - Henry Simons (15 Oct 1818 England – 30 Jun 1890 Williams County, Ohio)
 *    married Mary Marsh on 24 Apr 1845 in Summit County, Ohio; Find a Grave
 *    and the trees call her Mary Wagner or Wagoner.
 *  - The family: Coventry, Summit County, Ohio (1850); Richland Township,
 *    DeKalb County, Indiana (1860); Northwest Township, Williams County, Ohio
 *    (1870). Nine children, among them Aaron (1850).
 *  - Henry's parents are a tree-only lead (Berrynarbor, Devon), noted only.
 */
'use strict';
const fs = require('fs');
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };

const C1850 = 'Ancestry.com, 1850 United States Federal Census (Coventry, Summit County, Ohio; NARA M432, roll 732, page 87b)';
const C1860 = 'Ancestry.com, 1860 United States Federal Census (Richland, DeKalb County, Indiana; NARA M653, roll 254, page 242)';
const C1870 = 'Ancestry.com, 1870 United States Federal Census (Northwest, Williams County, Ohio; NARA M593, roll 1282, page 145A)';
const MARR = 'Ancestry.com, Summit County, Ohio, U.S., Marriage Records, 1840–1980 (Vol. A–C), and Ohio, U.S., County Marriage Records';
const TREE = 'Ancestry.com, public member tree "A miscellaneous research tree" (tree 62391298)';
const FAG = 'Find a Grave, memorial 78651501 (Henry Simons, Billingstown Cemetery)';

edit('simons_henry', [C1850, C1860, C1870, MARR, FAG, TREE], p => {
  add(p.aliases, 'Henry Symons');
  p.birth = '15 Oct 1818';
  p.death = '30 Jun 1890';
  for (const l of ['England', 'Coventry, Summit County, Ohio', 'Richland Township, DeKalb County, Indiana', 'Northwest Township, Williams County, Ohio']) add(p.locations, l);
  add(p.milestones, 'Married Mary Marsh (m. 24 Apr 1845)');
  add(p.milestones, 'Buried at Billingstown Cemetery, Northwest Township, Williams County, Ohio');
  add(p.career, 'Farmer: $2,500 in land in DeKalb County, Indiana, in 1860 and $6,000 in Williams County, Ohio, in 1870.');
  note(p, 'Born 15 Oct 1818 in England (Find a Grave; the 1860 and 1870 censuses give England, about 1818); died 30 Jun 1890 in Williams County, Ohio. Married "Mary Marsh" as Henry Symons on 24 Apr 1845 in Summit County, Ohio.');
  note(p, 'The family was at Coventry, Summit County, Ohio, in 1850 (Henry 29, Mary 32, Sarah, Isabella, George A. and the infant Aaron); at Richland Township, DeKalb County, Indiana (post office Auburn), in 1860, with Richard, Ann and Olive added; and at Northwest Township, Williams County, Ohio, in 1870. Aaron grew up in Indiana, which is why his son Ray gave his father\'s birthplace as Indiana in 1918.');
  note(p, 'Lead: some Ancestry trees place his birth at Berrynarbor, Devon, and name his parents William Henry Simmons (1763–1847) and Mary Pestell (1779–1857). No baptism or other record has been found to support this.');
});
edit('wagner_mary', [C1850, C1860, C1870, MARR, TREE], p => {
  rename(p, ['Mary Wagner (Simons)'], 'Mary Wagner (Marsh, Simons)');
  for (const a of ['Mary Marsh', 'Mary Wagoner']) add(p.aliases, a);
  if (!p.birth) p.birth = 'abt 1818';
  if (!p.death) p.death = '25 Dec 1889';
  add(p.locations, 'Ohio');
  add(p.milestones, 'Married Henry Simons (m. 24 Apr 1845)');
  add(p.milestones, 'Buried at Billingstown Cemetery, Northwest Township, Williams County, Ohio');
  note(p, 'Born in Ohio about 1817–18 (aged 32 in 1850, 43 in 1860, 53 in 1870); the Ancestry trees give 30 Jan 1818, and her death as 25 Dec 1889 in Williams County, Ohio.');
  note(p, 'She married Henry Symons as "Mary Marsh" on 24 Apr 1845 in Summit County, Ohio. Find a Grave and the family trees give her birth surname as Wagner or Wagoner, so she was probably a widow, Mrs. Marsh, when she married Henry; no record found so far shows the Wagner name or a first husband.');
});

// Aaron's brothers and sisters
const SRC = [C1850, C1860, C1870, TREE];
const sib = (id, name, sex, birth, death, text, extra = []) => {
  person(id, name, sex, SRC.concat(extra), p => { if (!p.birth) p.birth = birth; if (death && !p.death) p.death = death; note(p, `Child of Henry and Mary Simons; brother or sister of Aaron Simons. ${text}`); });
  child(id, 'simons_henry', 'wagner_mary');
};
sib('simons_sarah_1844', 'Sarah E. Simons (Rogers)', 'F', '9 Nov 1844', '1932', 'Born in Summit County, Ohio (tree); aged 5 in 1850 and 17 in 1860. Find a Grave lists her as Sarah E. Rogers.', [FAG]);
sib('simons_isabella', 'Isabella Simons', 'F', 'abt 1846', '', 'Born in Ohio; aged 4 in 1850 and 14 in 1860.');
sib('simons_george_a', 'George A. Simons', 'M', 'abt 1848', '1933', 'Born in Ohio; aged 2 in 1850, 12 in 1860 and 22 in 1870, when he lived with his parents with Sarah J. Simons (17) and Anna B. (2 months), probably his wife and daughter.');
sib('simons_richard', 'Richard Simons', 'M', 'abt 1853', '5 Jul 1921', 'Born in Indiana; aged 8 in 1860 and 17 in 1870. The tree gives his death as 5 Jul 1921 at Fremont, Steuben County, Indiana.', [FAG]);
sib('simons_ann_1854', 'Rebecca Ann Simons (Forester)', 'F', '25 Jun 1855', '23 Jun 1904', 'Born 25 Jun 1855 in DeKalb County, Indiana; "Ann", aged 6, in 1860 and "Han R.", 15, in 1870, and "Ann Rebecca" in her father\'s will. Find a Grave lists her as Rebecca Ann Simons Forester.', [FAG]);
// "Han R." (1870) is the same daughter as Ann (1860): Ann Rebecca in Henry's will; merged by fix-2026-09-24-simons-siblings.js
sib('simons_olive_catherine', 'Olive Catherine Simons (Decker, Parsons)', 'F', '28 Oct 1857', '9 Apr 1932', 'Born in Indiana; "Oliva", aged 3, in 1860 and Olive C., 12, in 1870. Find a Grave lists her as Olive Catherine Decker Parsons.', [FAG]);
sib('simons_harriet_e', 'Harriet E. Simons', 'F', 'abt 1862', '', 'Born in Indiana; aged 8 in 1870.');

// Aaron: his origins are no longer an open question
edit('simons_aaron', [C1850, C1860, C1870, TREE], p => {
  for (const l of ['Coventry, Summit County, Ohio', 'Richland Township, DeKalb County, Indiana', 'Northwest Township, Williams County, Ohio']) add(p.locations, l);
  add(p.aliases, 'Aaron L. Simons');
  p.notes = p.notes.filter(t => !/^(The Simons tree ends at Aaron and Hattie; their parents are unknown|Open question: Aaron Simons's origins conflict|Open question: The Simons tree ends at Aaron and Hattie)/.test(t));
  p.notes = p.notes.filter(t => !t.startsWith('Son of Henry Simons, born in England, and Mary (Marsh), born in Ohio.'));
  note(p, 'Son of Henry Simons, born in England, and Mary, born in Ohio, who married Henry as Mary Marsh. Born in Ohio and raised in DeKalb County, Indiana (1860); with his parents in Williams County, Ohio, in 1870. This explains the censuses\' English-born father and the Indiana birthplace on his son Ray\'s draft card.');
  note(p, 'He married Harriet "Hattie" Michel about 1875 (Michigan marriage records, cited in the Ancestry tree); their first child, Gertrude Nellie, was born in Minnesota in 1879.');
});
edit('simons_harriet_hattie', [], p => {
  p.notes = p.notes.filter(t => !/^Open question: The Simons tree ends at Aaron and Hattie/.test(t));
  note(p, 'Her own parents are not yet known. John Howard Adams said Irma\'s Ancestry trees contain "a couple of errors", not yet specified. [Family research emails, email 46]');
});
// the Simons line now starts with Henry and Mary
const path = require('path');
const BR = path.resolve(__dirname, '..', 'data', 'branches.json');
const bj = JSON.parse(fs.readFileSync(BR, 'utf8'));
for (const b of bj.branches) if (b.key === 'simons') b.roots = ['simons_henry', 'wagner_mary'];
fs.writeFileSync(BR, JSON.stringify(bj, null, 1) + '\n');
console.log('Henry Simons family applied');
