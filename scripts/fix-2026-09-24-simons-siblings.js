#!/usr/bin/env node
/**
 * 2026-09-24, Aaron Simons's brothers and sisters and their families, from
 * Henry Simons's will (Williams County, Ohio), Find a Grave, George's Indiana
 * death certificate and marriage record, Mary Jane's Ohio death certificate
 * (as quoted on Find a Grave) and Sarah's 1932 obituary. Run after
 * fix-2026-09-24-ancestry-simons-henry.js. Re-runnable.
 *  - The will names nine children: Mary Jane, Sarah, Isabell, Harriet Emma,
 *    Aaron, Richard, George A., Ann Rebecca and Olive Catherine. "Ann"
 *    (1860 census) and "Han R." (1870) are one daughter, Rebecca Ann.
 *  - Mary Jane (Fryman), born 1841, was missing; her death certificate names
 *    her mother as Elizabeth Marsh.
 */
'use strict';
const { exists, load, save, note, rename: move } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };
const dates = (p, b, d) => { if (b) p.birth = b; if (d) p.death = d; };

const WILL = 'Ancestry.com, Ohio, U.S., Wills and Probate Records (Williams County will records, vol. 5–6, 1889–1897): will of Henry Simons';
const FAG = n => `Find a Grave, memorial ${n}`;
const INDEATH = 'Ancestry.com, Indiana, U.S., Death Certificates, 1899–2017 (George Simons, 1933)';
const INMARR = 'Ancestry.com, Indiana, U.S., Marriages, 1810–2001';
const OB_SARAH = 'Obituary of Sarah Simons Rogers, Garrett Clipper, Garrett, Indiana, 7 Jan 1932 (transcribed on Find a Grave)';
const KIDS = 'Henry Simons\'s will names his wife Mary and nine children: Mary Jane, Sarah, Isabell, Harriet Emma, Aaron, Richard, George A., Ann Rebecca and Olive Catherine.';

// "Ann" and "Han R." are the same daughter
if (exists('simons_han_r')) move('simons_han_r', 'simons_ann_1854');
edit('simons_henry', WILL, p => {
  p.milestones = p.milestones.filter(t => t !== 'Will recorded in Williams County, Ohio (will records 1889–1897)');
  add(p.milestones, 'Made his will on 17 Mar 1889; proved at Bryan, Williams County, Ohio, 23 Jul 1890');
  note(p, KIDS);
  note(p, 'His will, made 17 Mar 1889 in Northwest Township, left his property to his wife Mary while she remained his widow (she died first, in Dec 1889); thirty acres of section 15 to "Mary A. Simons, wife of Richard Simons"; five dollars each to his daughters Mary Jane, Sarah, Isabell and Emma and his sons Aaron and Richard; and the rest in equal shares to George A., Ann Rebecca and Olive Catharine. When it was proved at Bryan on 23 Jul 1890, notice went to the next of kin living in Ohio: Ann R. Forester, Olive C. Decker, Mary J. Fryman and a Rachel Simons (not identified). Witnesses: R. K. and J. M. Haughey.');
});

// Mary Jane, born before the 1845 marriage
person('simons_mary_jane', 'Mary Jane Simons (Fryman)', 'F', [WILL, FAG(29778599)], p => {
  dates(p, '10 Feb 1841', '10 Aug 1919');
  add(p.aliases, 'Mary Jane Fryman');
  for (const l of ['Coventry Township, Summit County, Ohio', 'Copley, Summit County, Ohio']) add(p.locations, l);
  add(p.milestones, 'Married Joel Fryman');
  add(p.milestones, 'Buried at Copley Cemetery, Copley, Ohio');
  note(p, 'Born 10 Feb 1841 in Coventry Township, Summit County, Ohio; died 10 Aug 1919 at Copley, Summit County. Named first among the children in her father Henry Simons\'s will. Her Ohio death certificate (no. 50581, as quoted on Find a Grave) names her father as Henry Simons, born in England, and her mother as Elizabeth Marsh, born in Ohio. She was born four years before Henry married "Mary Marsh" in 1845 and is not in the 1850 household.');
  note(p, 'Wife of Joel Fryman (1836–1921); children on Find a Grave: Sarah (Swift, 1859–1945), William J. (1861–1928) and Homer (1875–1916).');
});
child('simons_mary_jane', 'simons_henry', null);
person('fryman_joel', 'Joel Fryman', 'M', FAG(29778599), p => { dates(p, p.birth || '1836', p.death || '1921'); add(p.milestones, 'Married Mary Jane Simons'); note(p, 'Husband of Mary Jane Simons.'); });
wed('simons_mary_jane', 'fryman_joel');
for (const [id, name, sex, b, d] of [['fryman_sarah', 'Sarah Fryman (Swift)', 'F', '1859', '1945'], ['fryman_william_j', 'William J. Fryman', 'M', '1861', '1928'], ['fryman_homer', 'Homer Fryman', 'M', '1875', '1916']]) {
  person(id, name, sex, FAG(29778599), p => { dates(p, p.birth || b, p.death || d); note(p, 'Child of Joel and Mary Jane (Simons) Fryman.'); });
  child(id, 'fryman_joel', 'simons_mary_jane');
}
edit('wagner_mary', FAG(29778599), p => note(p, 'Mary Jane Simons Fryman\'s 1919 death certificate names her mother as Elizabeth Marsh, born in Ohio. With the 1845 marriage record\'s "Mary Marsh", this suggests Marsh may have been her birth surname rather than a first husband\'s, or that Henry had an earlier wife; the Wagner name appears only on Find a Grave and in trees.'));

// Sarah
edit('simons_sarah_1844', [WILL, FAG(92466844), OB_SARAH], p => {
  dates(p, '9 Nov 1844', '5 Jan 1932');
  for (const l of ['Altona, DeKalb County, Indiana', 'Avilla, Noble County, Indiana']) add(p.locations, l);
  add(p.milestones, 'Married Charles T. Rogers (m. 20 Feb 1862)');
  add(p.milestones, 'Buried at Christian Union Cemetery, Garrett, Indiana');
  note(p, 'Born 9 Nov 1844 near Akron, Ohio (her obituary says 1843); married Charles T. Rogers on 20 Feb 1862; lived many years at Altona, DeKalb County, Indiana; died 5 Jan 1932 at Avilla, Indiana, aged 87. Survived by her children Henry Rogers of Portis, Kansas, and Orpha (Mrs. Pence) of Chicago, eleven grandchildren and eight great-grandchildren; four children died before her.');
});
person('rogers_charles_t', 'Charles T. Rogers', 'M', FAG(92466844), p => { dates(p, p.birth || '1843', p.death || '1910'); add(p.milestones, 'Married Sarah E. Simons (m. 20 Feb 1862)'); note(p, 'Husband of Sarah E. Simons (married 20 Feb 1862).'); });
wed('simons_sarah_1844', 'rogers_charles_t');
for (const [id, name, sex, text] of [['rogers_henry', 'Henry Rogers', 'M', 'Of Portis, Kansas, in 1932.'], ['rogers_orpha', 'Orpha Rogers (Pence)', 'F', 'Mrs. Pence, of Chicago, in 1932; her mother lived with her after being widowed.']]) {
  person(id, name, sex, OB_SARAH, p => note(p, `Child of Charles T. and Sarah (Simons) Rogers. ${text}`));
  child(id, 'rogers_charles_t', 'simons_sarah_1844');
}

// Isabella and Harriet Emma
const NOT_OHIO = 'She was not among the next of kin living in Ohio who were notified when the will was proved in 1890, so she probably lived elsewhere by then (or had died). Searches of the Indiana and Ohio county marriage indexes, including DeKalb and Williams counties, found no certain match; an Isabella Simmons married John White in Indiana on 22 Mar 1876, county not given.';
edit('simons_isabella', WILL, p => {
  add(p.aliases, 'Isabell Simons');
  p.notes = p.notes.filter(t => t !== 'Named "Isabell" in her father Henry Simons\'s will; her married name and later life are not yet found.');
  note(p, 'Named "Isabell" in her father Henry Simons\'s will (1889), which left her five dollars. Her married name and later life are not yet found.');
  note(p, NOT_OHIO);
});
edit('simons_harriet_e', WILL, p => {
  rename(p, ['Harriet E. Simons'], 'Harriet Emma Simons');
  add(p.aliases, 'Emma Simons');
  p.notes = p.notes.filter(t => t !== 'Named Harriet Emma in her father Henry Simons\'s will; her married name and later life are not yet found.');
  note(p, 'Called "Emma" in the text of her father Henry Simons\'s will (1889), which left her five dollars, and indexed as Harriet Emma. Her married name and later life are not yet found.');
  note(p, NOT_OHIO.replace('; an Isabella Simmons married John White in Indiana on 22 Mar 1876, county not given', ', under either Harriet or Emma'));
});
edit('simons_richard', WILL, p => note(p, 'His father\'s will (1889) left thirty acres of section 15, Northwest Township, Williams County, to his wife Mary A. Simons, and five dollars to Richard.'));

// George A.
edit('simons_george_a', [WILL, INDEATH, INMARR], p => {
  dates(p, '25 Jan 1848', '26 Apr 1933');
  add(p.locations, 'Steuben County, Indiana');
  add(p.milestones, 'Married Sophronia McClain');
  note(p, 'Born 25 Jan 1848 (Indiana death certificate, which gives Indiana; the 1850 and 1860 censuses give Ohio); died 26 Apr 1933 in Steuben County, Indiana, a widower, aged 85. The certificate names his father Henry Simons and his wife Sophronia; an Indiana marriage record names her Sophronia McClain.');
});
person('mcclain_sophronia', 'Sophronia McClain (Simons)', 'F', [INMARR, INDEATH], p => { add(p.aliases, 'Sophronia Simons'); add(p.milestones, 'Married George A. Simons'); note(p, 'Wife of George A. Simons; she died before him (he was a widower in 1933).'); });
wed('simons_george_a', 'mcclain_sophronia');

// Richard: three marriages
edit('simons_richard', [WILL, FAG(66385846)], p => {
  if (p.birth === 'abt 1853') p.birth = '1853';
  add(p.milestones, 'Married Mary Ellen VanFossen (m. 1875); later divorced');
  add(p.milestones, 'Married Mary A. Turnipseed (m. 23 Aug 1880)');
  add(p.milestones, 'Married Minnie Belle (Purdy) Adams (m. 28 Sep 1912)');
  add(p.milestones, 'Buried at Fremont Cemetery, Fremont, Indiana');
  note(p, 'Married first Mary Ellen VanFossen in 1875 (later divorced; daughter Della "Hallah" M.); second Mary A. Turnipseed on 23 Aug 1880 in Wabash County, Indiana (sons LeRoy Scott and Elmer Henry); third Minnie Belle (Purdy) Adams on 28 Sep 1912 at Coldwater, Michigan. Buried at Fremont, Steuben County, Indiana.');
});
const sp = (id, name, b, d, m) => { person(id, name, 'F', FAG(66385846), p => { dates(p, p.birth || b, p.death || d); add(p.milestones, m); note(p, 'A wife of Richard Simons.'); }); wed('simons_richard', id); };
sp('vanfossen_mary_ellen', 'Mary Ellen VanFossen (Simons, Rice)', '1856', '1898', 'Married Richard Simons (m. 1875); later divorced');
sp('turnipseed_mary_a', 'Mary A. Turnipseed (Simons)', '1858', '1912', 'Married Richard Simons (m. 23 Aug 1880)');
sp('purdy_minnie_belle', 'Minnie Belle Purdy (Adams, Simons)', '1863', '1923', 'Married Richard Simons (m. 28 Sep 1912)');
person('simons_hallah', 'Della “Hallah” M. Simons (Adams)', 'F', FAG(66385846), p => { dates(p, p.birth || '1877', p.death || '1938'); note(p, 'Daughter of Richard Simons and Mary Ellen VanFossen.'); });
child('simons_hallah', 'simons_richard', 'vanfossen_mary_ellen');
for (const [id, name, b, d] of [['simons_leroy_scott', 'LeRoy Scott Simons', '1881', '1964'], ['simons_elmer_henry', 'Elmer Henry Simons', '1886', '1968']]) {
  person(id, name, 'M', FAG(66385846), p => { dates(p, p.birth || b, p.death || d); note(p, 'Son of Richard Simons and Mary A. Turnipseed.'); });
  child(id, 'simons_richard', 'turnipseed_mary_a');
}

// Rebecca Ann
edit('simons_ann_1854', [WILL, FAG(68165791)], p => {
  rename(p, ['Ann Simons'], 'Rebecca Ann Simons (Forester)');
  for (const a of ['Ann Rebecca Simons', 'Han R. Simons', 'Rebecca Ann Forester']) add(p.aliases, a);
  dates(p, '25 Jun 1855', '23 Jun 1904');
  p.notes = p.notes.filter(t => !/^Child of Henry and Mary Simons; brother or sister of Aaron Simons\. (Born in Indiana; aged 6 in 1860\. Possibly the Rebecca Ann|Born in Indiana; "Han R\." \(perhaps Hannah\))/.test(t));
  add(p.milestones, 'Married Stephen S. Forester (m. 1874)');
  add(p.milestones, 'Buried at Camden Cemetery, Camden, Michigan');
  note(p, 'Died 23 Jun 1904 in Northwest Township, Williams County, Ohio. Married Stephen S. Forester (1854–1923) in 1874; their son was Charles Elmer "Charlie" Forester (1875–1954).');
});
person('forester_stephen_s', 'Stephen S. Forester', 'M', FAG(68165791), p => { dates(p, p.birth || '1854', p.death || '1923'); add(p.milestones, 'Married Rebecca Ann Simons (m. 1874)'); note(p, 'Husband of Rebecca Ann Simons.'); });
wed('simons_ann_1854', 'forester_stephen_s');
person('forester_charles_elmer', 'Charles Elmer “Charlie” Forester', 'M', FAG(68165791), p => { dates(p, p.birth || '1875', p.death || '1954'); note(p, 'Son of Stephen S. and Rebecca Ann (Simons) Forester.'); });
child('forester_charles_elmer', 'forester_stephen_s', 'simons_ann_1854');

// Olive Catherine
edit('simons_olive_catherine', [WILL, FAG(15329399)], p => {
  if (p.birth === '28 Oct 1856') { p.birth = '28 Oct 1857'; note(p, 'CORRECTION: born 28 Oct 1857 in DeKalb County, Indiana (Find a Grave; aged 3 in 1860); the Ancestry tree gives 1856.'); }
  p.death = '9 Apr 1932';
  add(p.locations, 'Battle Creek, Calhoun County, Michigan');
  add(p.milestones, 'Married Peter Decker (m. 1874)');
  add(p.milestones, 'Married Stephen Parsons (m. 1928)');
  add(p.milestones, 'Buried at Oak Hill Cemetery, Battle Creek, Michigan');
  note(p, 'Died 9 Apr 1932 at Battle Creek, Michigan. Married Peter Decker (1856–1924) in 1874; their sons were Simeon (1881–1949) and Clyde (1888–1981). In 1928 she married Stephen Parsons (1851–1931).');
});
person('decker_peter', 'Peter Decker', 'M', FAG(15329399), p => { dates(p, p.birth || '1856', p.death || '1924'); add(p.milestones, 'Married Olive Catherine Simons (m. 1874)'); note(p, 'First husband of Olive Catherine Simons.'); });
person('parsons_stephen', 'Stephen Parsons', 'M', FAG(15329399), p => { dates(p, p.birth || '1851', p.death || '1931'); add(p.milestones, 'Married Olive Catherine (Simons) Decker (m. 1928)'); note(p, 'Second husband of Olive Catherine Simons.'); });
wed('simons_olive_catherine', 'decker_peter');
wed('simons_olive_catherine', 'parsons_stephen');
for (const [id, name, b, d] of [['decker_simeon', 'Simeon Decker', '1881', '1949'], ['decker_clyde', 'Clyde Decker', '1888', '1981']]) {
  person(id, name, 'M', FAG(15329399), p => { dates(p, p.birth || b, p.death || d); note(p, 'Son of Peter and Olive Catherine (Simons) Decker.'); });
  child(id, 'decker_peter', 'simons_olive_catherine');
}
console.log('Simons siblings applied');
