#!/usr/bin/env node
/**
 * 2026-09-24, three lines carried forward from Ancestry.com public member
 * trees, checked against Find a Grave and obituaries where they exist.
 * Re-runnable. People the trees mark as living are left out; living
 * grandchildren named in obituaries get names and relationships only.
 *  - Forester (Rebecca Ann Simons's son Charlie): the Cox Family Tree
 *    (17224056). Sons Glenn C. and Ivan Duane, and Glenn's daughters.
 *  - Decker (Olive Simons's sons Simeon and Clyde): the Bicha-Dale Family
 *    Tree (8839537). Clyde's children Clesson and Cleda, and Cleda's children.
 *  - Rinehart (Elaine Simons's family): Find a Grave for Les, Elaine and
 *    Jerry, Elaine's 2011 obituary and Jerry's 2016 obituary. Elaine had two
 *    children, Jerry and Janet; the "Debbie Groom" in William Upham's 2016
 *    obituary was his stepdaughter, not Elaine's daughter.
 */
'use strict';
const fs = require('fs');
const { exists, load, save, note, file } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const sibs = ids => { for (const id of ids) edit(id, [], p => { for (const o of ids) if (o !== id) add(p.relationships.siblings, o); }); };
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };
const dates = (p, b, d) => { if (b && !p.birth) p.birth = b; if (d && !p.death) p.death = d; };
const marry = (a, b, when) => {
  wed(a, b);
  for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const n = load(y).name; if (!p.milestones.some(t => t.startsWith(`Married ${n}`))) add(p.milestones, `Married ${n}${when ? ` (m. ${when})` : ''}`); });
};
// someone known from a tree: record if missing, then dates, places and a note
const tree = (id, name, sex, src, b, d, places, text) => person(id, name, sex, src, p => { dates(p, b, d); for (const l of places) add(p.locations, l); if (text) note(p, text); });

const COX = 'Ancestry.com, public member tree "Cox Family Tree" (tree 17224056)';
const BICHA = 'Ancestry.com, public member tree "Bicha-Dale Family Tree" (tree 8839537)';
const KULP = 'Ancestry.com, public member tree "Kulp-Ritchey-Dorsett Family Tree" (tree 4662169)';
const FAG_LES = 'Find a Grave, memorial 80541885 (Leslie B. "Les" Rinehart, Desert Lawn Memorial Park, Kennewick)';
const FAG_ELAINE = 'Find a Grave, memorial 75368477 (Elaine Simons Rinehart Upham, Desert Lawn Memorial Park, Kennewick)';
const FAG_JERRY = 'Find a Grave, memorial 281162175 (Jerry Allen Rinehart, Desert Lawn Memorial Park, Kennewick)';
const OB_ELAINE = 'Obituary of Elaine Upham, Tri-City Herald, 14 Aug 2011 (transcribed on Find a Grave, memorial 75368477)';
const OB_JERRY = 'Obituary of Jerry Allen Rinehart, Tri-City Herald, 23 Jun 2016';
const WA_DEATH = 'Ancestry.com, Washington, U.S., Death Records, 1907–2017';

// ── Forester ─────────────────────────────────────────────────────────────────
edit('forester_charles_elmer', COX, p => {
  for (const l of ['Northwest Township, Williams County, Ohio', 'Clear Lake, Steuben County, Indiana', 'Coldwater, Branch County, Michigan']) add(p.locations, l);
  add(p.milestones, 'Buried at Montgomery, Hillsdale County, Michigan');
  note(p, 'Born in Northwest Township, Williams County, Ohio; the Cox Family Tree gives 21 Jan 1875, a day earlier than Find a Grave. He married Etta May Burch on 24 Oct 1896 at Clear Lake, Indiana, and died 28 Nov 1954 at Coldwater, Michigan. Sons Glenn C. (1897) and Ivan Duane (1899).');
});
edit('burch_etta', COX, p => { add(p.aliases, 'Addie May Burch'); note(p, 'The Cox Family Tree calls her Addie May "Etta" Burch.'); });

tree('forester_glenn_c', 'Glenn C. Forester', 'M', COX, '15 Mar 1897', '1 Dec 1965', ['Maplecrest, Williams County, Ohio', 'Hillsdale, Michigan'],
  'Son of Charles Elmer and Etta (Burch) Forester. Born 15 Mar 1897 at Maplecrest, Williams County, Ohio; died 1 Dec 1965 at Hillsdale, Michigan; buried at Montgomery, Hillsdale County. He married Ruth Trilby Borton on 3 Nov 1917 at Jackson, Michigan (daughters Betty Joyce and Dorothy Jean), and after 1959 Helen Morrison Rowley.');
child('forester_glenn_c', 'forester_charles_elmer', 'burch_etta');
tree('borton_ruth_trilby', 'Ruth Trilby Borton (Forester)', 'F', COX, '1896', '1983', [], 'First wife of Glenn C. Forester (m. 3 Nov 1917, Jackson, Michigan).');
marry('forester_glenn_c', 'borton_ruth_trilby', '3 Nov 1917');
tree('rowley_helen_morrison', 'Helen Morrison Rowley (Forester)', 'F', COX, '1900', '1987', [], 'Second wife of Glenn C. Forester, married after 1959.');
marry('forester_glenn_c', 'rowley_helen_morrison', 'after 1959');

tree('forester_ivan_duane', 'Ivan Duane Forester', 'M', COX, '22 Jul 1899', '14 Feb 1989', ['Michigan', 'Zephyrhills, Pasco County, Florida'],
  'Son of Charles Elmer and Etta (Burch) Forester. Born 22 Jul 1899 in Michigan; died 14 Feb 1989 at Zephyrhills, Florida; buried at Montgomery, Hillsdale County, Michigan. He and his wife Vera Munger had a son Max and three other children, living in the tree.');
child('forester_ivan_duane', 'forester_charles_elmer', 'burch_etta');
sibs(['forester_glenn_c', 'forester_ivan_duane']);
tree('munger_vera', 'Vera Munger (Forester)', 'F', COX, '1898', '1992', [], 'Wife of Ivan Duane Forester.');
marry('forester_ivan_duane', 'munger_vera');
tree('forester_max', 'Max Forester', 'M', COX, '1939', '2014', ['Coldwater, Branch County, Michigan'], 'Son of Ivan Duane and Vera (Munger) Forester; born 1939 at Coldwater, Michigan, died 2014 in Michigan.');
child('forester_max', 'forester_ivan_duane', 'munger_vera');

tree('forester_betty_joyce', 'Betty Joyce Forester (Oxenger)', 'F', COX, '26 Apr 1926', '4 Aug 1989', ['Hillsdale County, Michigan', 'Fremont, Steuben County, Indiana'],
  'Daughter of Glenn C. and Ruth (Borton) Forester. Born 26 Apr 1926 in Hillsdale County, Michigan; married Richard Oxenger on 19 Dec 1943 in Steuben County, Indiana; died 4 Aug 1989 at Fremont, Indiana; buried at Ransom, Hillsdale County, Michigan.');
child('forester_betty_joyce', 'forester_glenn_c', 'borton_ruth_trilby');
tree('oxenger_richard', 'Richard Oxenger', 'M', COX, '1922', '2015', [], 'Husband of Betty Joyce (Forester) Oxenger.');
marry('forester_betty_joyce', 'oxenger_richard', '19 Dec 1943');
for (const [id, name, b] of [['oxenger_lee_ann', 'Lee Ann Oxenger', 'abt 1948'], ['oxenger_marty', 'Marty Oxenger', 'abt 1951']]) {
  tree(id, name, 'F', COX, b, '', [], 'Daughter of Richard and Betty Joyce (Forester) Oxenger.');
  child(id, 'oxenger_richard', 'forester_betty_joyce');
}
sibs(['oxenger_lee_ann', 'oxenger_marty']);

tree('forester_dorothy_jean', 'Dorothy Jean Forester (Cox)', 'F', COX, '22 Oct 1931', '1 Jan 1987', ['Clear Lake, Steuben County, Indiana', 'Jackson, Michigan'],
  'Daughter of Glenn C. and Ruth (Borton) Forester. Born 22 Oct 1931 at Clear Lake, Indiana; married Loren Wayne Cox on 4 Jul 1951 at Clear Lake; died 1 Jan 1987 at Jackson, Michigan; buried at Ransom, Hillsdale County, Michigan.');
child('forester_dorothy_jean', 'forester_glenn_c', 'borton_ruth_trilby');
sibs(['forester_betty_joyce', 'forester_dorothy_jean']);
tree('cox_loren_wayne', 'Loren Wayne Cox', 'M', COX, '1933', '2009', [], 'Husband of Dorothy Jean (Forester) Cox.');
marry('forester_dorothy_jean', 'cox_loren_wayne', '4 Jul 1951');

// ── Decker ───────────────────────────────────────────────────────────────────
edit('decker_simeon', BICHA, p => {
  for (const l of ['Northwest Township, Williams County, Ohio', 'Pennfield Township, Calhoun County, Michigan']) add(p.locations, l);
  add(p.milestones, 'Buried at Battle Creek, Calhoun County, Michigan');
  note(p, 'Born 17 Jan 1881 in Northwest Township, Williams County, Ohio. He married Ardella M. Sisson on 1 Apr 1919 at Marshall, Michigan; the Bicha-Dale tree records no children. The tree gives his death as 17 Aug 1949 at Pennfield Township, Calhoun County, and his burial as 19 Aug 1949 at Battle Creek.');
});
edit('decker_merle', BICHA, p => {
  rename(p, ['Merle Grace Decker'], 'Merle Grace Waddell (Decker)');
  note(p, 'Born Merle Grace Waddell (Bicha-Dale Family Tree). She married Clyde Decker on 21 Nov 1907 in Michigan; their children were Clesson Dale (abt 1910) and Cleda Marie (1914).');
});
const MARR_FIX = { 'Married Merle Grace Decker (m. 1907)': 'Married Merle Grace Waddell (Decker) (m. 21 Nov 1907)', 'Married Clyde Decker (m. 1907)': 'Married Clyde Decker (m. 21 Nov 1907)', 'Married Esther Shirtliff (Decker) (m. 1951)': 'Married Esther Shirtliff (Decker) (m. 21 Dec 1951)', 'Married Clyde Decker (m. 1951)': 'Married Clyde Decker (m. 21 Dec 1951)' };
for (const id of ['decker_clyde', 'decker_merle', 'shirtliff_esther']) edit(id, [], p => { p.milestones = p.milestones.map(t => MARR_FIX[t] || t).filter((t, i, a) => a.indexOf(t) === i); p.aliases = p.aliases.filter(x => x !== p.name); });
edit('decker_clyde', BICHA, p => {
  for (const l of ['Northwest Township, Williams County, Ohio', 'Bronson, Branch County, Michigan', 'Howell, Livingston County, Michigan']) add(p.locations, l);
  add(p.milestones, 'Buried at Bethel Township, Branch County, Michigan');
  note(p, 'Born 16 Sep 1888 in Northwest Township, Williams County, Ohio. He married Merle Grace Waddell on 21 Nov 1907, and Esther Shirtliff on 21 Dec 1951 at Brighton, Michigan. He died 19 Dec 1981 at Howell, Michigan, and was buried at Bethel Township, Branch County.');
});
edit('shirtliff_esther', BICHA, () => {});

tree('decker_clesson_dale', 'Clesson Dale Decker', 'M', BICHA, 'abt 1910', '', ['Branch County, Michigan'], 'Son of Clyde and Merle (Waddell) Decker; born about 1910 in Branch County, Michigan. He married Alice Heistand on 8 Aug 1928 at Kalamazoo, Michigan.');
child('decker_clesson_dale', 'decker_clyde', 'decker_merle');
tree('heistand_alice', 'Alice Heistand (Decker)', 'F', BICHA, 'abt 1910', '', [], 'Wife of Clesson Dale Decker (m. 8 Aug 1928, Kalamazoo, Michigan).');
marry('decker_clesson_dale', 'heistand_alice', '8 Aug 1928');

tree('decker_cleda_marie', 'Cleda Marie Decker (Merithew)', 'F', BICHA, '15 Jul 1914', '25 Sep 1941', ['Bronson, Branch County, Michigan', 'Howell, Livingston County, Michigan'],
  'Daughter of Clyde and Merle (Waddell) Decker. Born 15 Jul 1914 at Bronson, Michigan; married Harold Romeyn Merithew Sr. on 31 Jul 1931 in Elkhart County, Indiana; died 25 Sep 1941 at Howell, Michigan, the day her daughter Gay Marie was born, and was buried there on 28 Sep. The tree lists seven children: Philip, Susan, Sharon, Gay Marie and three living.');
child('decker_cleda_marie', 'decker_clyde', 'decker_merle');
sibs(['decker_clesson_dale', 'decker_cleda_marie']);
tree('merithew_harold_romeyn', 'Harold Romeyn Merithew Sr.', 'M', BICHA, '1910', '1988', [], 'Husband of Cleda Marie (Decker) Merithew.');
marry('decker_cleda_marie', 'merithew_harold_romeyn', '31 Jul 1931');

const MER = [
  ['merithew_philip_romeyn', 'Philip Romeyn Merithew', 'M', '3 Feb 1935', '14 Jun 1940', ['Howell, Livingston County, Michigan'], 'Born 3 Feb 1935 at Howell, Michigan; died there 14 Jun 1940, aged 5.'],
  ['merithew_susan_rebecca', 'Susan Rebecca Merithew (Rosher, Tullar)', 'F', '1 Jun 1936', '12 May 1991', ['Howell, Livingston County, Michigan', 'Flint, Genesee County, Michigan'], 'Born 1 Jun 1936 at Howell, Michigan; died 12 May 1991 at Flint and was buried at Gaines, Genesee County. She married Marvin Kenneth Rosher (1931–1961) about 1960, twice more in the 1960s, and Theodore Richard Tullar Sr. (1935–2010) on 10 Nov 1967; the tree lists eleven children, all living.'],
  ['merithew_sharon_annette', 'Sharon Annette Merithew', 'F', '27 Mar 1939', '11 Feb 1958', ['Howell, Livingston County, Michigan', 'Houston, Texas'], 'Born 27 Mar 1939 at Howell, Michigan; married in Apr 1955 at Howell; died 11 Feb 1958 at Houston, Texas, aged 18, and was buried at Howell. The tree also lists a John Middlebrook as a husband.'],
  ['merithew_gay_marie', 'Gay Marie Merithew (Collier, Garrick, Sipple, Forsythe)', 'F', '25 Sep 1941', '24 Aug 1999', ['Howell, Livingston County, Michigan', 'Gladstone, Clackamas County, Oregon'], 'Born 25 Sep 1941 at Howell, Michigan, the day her mother died. She married Jesse Lee Collier (1937–1993) on 19 Mar 1960 at Great Falls, Montana; Wallace Eugene Garrick (1939–1995) on 13 Jun 1964 at Stevenson, Washington; again about 1966; Donald Jacob Sipple (1914–1988) on 26 Aug 1970 at Sherwood, Oregon; and Joseph Creighton "Joe" Forsythe (1941–2016) on 17 Aug 1973 at Portland. She died 24 Aug 1999 at Gladstone, Oregon.'],
];
for (const [id, name, sex, b, d, places, text] of MER) {
  tree(id, name, sex, BICHA, b, d, places, `Child of Harold Romeyn and Cleda Marie (Decker) Merithew; grandchild of Clyde Decker. ${text}`);
  child(id, 'merithew_harold_romeyn', 'decker_cleda_marie');
}
sibs(MER.map(m => m[0]));
edit('merithew_susan_rebecca', [], p => { add(p.milestones, 'Married Marvin Kenneth Rosher (m. abt 1960)'); add(p.milestones, 'Married Theodore Richard Tullar Sr. (m. 10 Nov 1967)'); });
edit('merithew_gay_marie', [], p => { for (const t of ['Married Jesse Lee Collier (m. 19 Mar 1960)', 'Married Wallace Eugene Garrick (m. 13 Jun 1964)', 'Married Donald Jacob Sipple (m. 26 Aug 1970)', 'Married Joseph Creighton “Joe” Forsythe (m. 17 Aug 1973)']) add(p.milestones, t); });

// ── Rinehart ─────────────────────────────────────────────────────────────────
// Elaine's 2011 obituary names two children; "Debbie Groom" was William Upham's stepdaughter
if (exists('rhinehart_debbie')) {
  fs.unlinkSync(file('rhinehart_debbie'));
  for (const id of ['simons_elaine_deretha', 'rhinehart_les', 'rhinehart_jerry', 'rhinehart_janet']) edit(id, [], p => { const r = p.relationships; r.children = r.children.filter(x => x !== 'rhinehart_debbie'); r.siblings = r.siblings.filter(x => x !== 'rhinehart_debbie'); });
}
edit('upham_william', [], p => note(p, 'His 2016 obituary also names two stepdaughters, Debbie Groom and Jan Holter. Jan is Elaine\'s daughter; Debbie is not named in Elaine\'s 2011 obituary, so she was probably a daughter of his second wife, Virginia Rounds. Elaine\'s obituary names his daughters as Diane Angelo and Janet Upham.'));

edit('simons_elaine_deretha', [FAG_ELAINE, OB_ELAINE, KULP], p => {
  p.notes = p.notes.filter(t => t !== 'Her children were Jerry, Janet (Holter) and Debbie (Groom); William Upham\'s 2016 obituary names Debbie and Jan as his stepdaughters.');
  p.milestones = p.milestones.map(t => t === 'Married William Clifford Upham (m. 1991)' ? 'Married William Clifford Upham (m. 21 Jun 1991)' : t).filter((t, i, a) => a.indexOf(t) === i);
  add(p.milestones, 'Married Leslie Bernard “Les” Rinehart (m. 10 Sep 1935)');
  add(p.education, 'Lynden High School, Lynden, Washington');
  for (const l of ['Lynden, Washington', 'Burlington, Skagit County, Washington', 'Pasco, Washington', 'Gladstone, Oregon']) add(p.locations, l);
  note(p, 'She married Leslie Bernard Rinehart on 10 Sep 1935 at Burlington, Skagit County, Washington (Kulp-Ritchey-Dorsett Family Tree), and was married to him until his death in 1988. They lived in Pasco for many years before moving to Gladstone, Oregon, in 1958.');
  note(p, 'Her 2011 obituary: born at Milton, Oregon, to Ray and Dradie Simons; graduated from Lynden High School. Active for many years with the Gladstone Historical Society, the Oregon City Elks Ladies Auxiliary, the Gladstone Senior Center and the Gladstone Chautauqua Festival, and "Fairest of the Fair" at the 1988 Clackamas County Fair. She loved family, playing the piano, music and needlework.');
  note(p, 'Survived by her son Jerry Rinehart, daughter Janet "Jan" Holter, stepdaughters Diane Angelo and Janet Upham, brother Glen Simons, three grandchildren (Jana Holter, Jeff Holter and Martin Rinehart), 11 great-grandchildren and 7 great-great-grandchildren. Preceded in death by her first husband, a grandson, her parents, three brothers and two sisters.');
});
edit('simons_raymond_zell', OB_ELAINE, p => note(p, 'Elaine\'s 2011 obituary says she was preceded in death by two sisters. Only Beryl is known, so Ray and Dradie may have had another daughter who is not yet in the tree.'));
edit('simons_raymond_elmer', FAG_ELAINE, p => { if (!p.death) p.death = '1994'; });

edit('rhinehart_les', [FAG_LES, KULP], p => {
  if (!p.birth || p.birth === '1913') p.birth = '27 May 1913';
  if (!p.death || p.death === '1988') p.death = '9 Jul 1988';
  for (const l of ['Washington', 'Pasco, Washington', 'Gladstone, Oregon']) add(p.locations, l);
  p.milestones = p.milestones.filter(t => t !== 'Married Elaine Deretha Simons');
  add(p.milestones, 'Married Elaine Deretha Simons (m. 10 Sep 1935)');
  add(p.milestones, 'Buried at Desert Lawn Memorial Park, Kennewick, Washington');
  note(p, 'Born 27 May 1913 in Washington; died 9 Jul 1988 at Gladstone, Oregon. His Find a Grave memorial says he and Elaine had two children, Jerry and Janet (Holter), both living in 1988.');
});
edit('rhinehart_jerry', [FAG_JERRY, OB_JERRY, WA_DEATH, KULP], p => {
  rename(p, ['Jerry Rinehart'], 'Jerry Allen Rinehart');
  add(p.aliases, 'Jerry Allyn Rinehart');
  if (!p.birth) p.birth = '15 Oct 1936';
  if (!p.death) p.death = '21 Jun 2016';
  for (const l of ['Mount Vernon, Washington', 'Pasco, Washington']) add(p.locations, l);
  add(p.career, 'Diesel mechanic, truck driver and landscape contractor; U.S. military veteran.');
  add(p.milestones, 'Buried at Desert Lawn Memorial Park, Kennewick, Washington');
  note(p, 'Born 15 Oct 1936 at Mount Vernon, Washington (the Kulp-Ritchey-Dorsett tree gives 1937); in the Tri-Cities from 1938. Died 21 Jun 2016 at Pasco. His Korean War-era draft registration names his mother, Mrs. Elaine Rinehart. His 2016 obituary does not name his children; his mother\'s 2011 obituary names a grandson, Martin Rinehart.');
});
edit('rhinehart_janet', [OB_ELAINE, FAG_LES], p => {
  rename(p, ['Janet Rinehart (Holter)'], 'Janet Lee “Jan” Rinehart (Holter)');
  add(p.aliases, 'Janet Lee Rinehart');
  note(p, 'Daughter of Les and Elaine (Simons) Rinehart; "Janet Lee" in the 1940 census.');
});
for (const [id, name, sex] of [['holter_jana', 'Jana Holter', 'F'], ['holter_jeff', 'Jeff Holter', 'M']]) {
  person(id, name, sex, OB_ELAINE, p => note(p, 'Grandchild of Elaine (Simons) Rinehart Upham, named in her 2011 obituary. Inferred: a child of Janet (Rinehart) and Duane Holter.'));
  child(id, 'holter_duane', 'rhinehart_janet');
}
sibs(['holter_jana', 'holter_jeff']);
person('rinehart_martin', 'Martin Rinehart', 'M', OB_ELAINE, p => note(p, 'Grandson of Elaine (Simons) Rinehart Upham, named in her 2011 obituary. Inferred: a son of Jerry Rinehart, her only son.'));
child('rinehart_martin', 'rhinehart_jerry', '');
console.log('Forester, Decker and Rinehart lines applied');
