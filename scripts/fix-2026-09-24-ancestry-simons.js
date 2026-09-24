#!/usr/bin/env node
/**
 * 2026-09-24, Ancestry.com records for Raymond Zell Simons and his parents
 * and sisters, looked up with Brendan Adams. Re-runnable.
 *  - Ray's birth (14 Jun 1897, South Haven, MI) and death (7 May 1977,
 *    Kennewick) are settled by his draft cards, Washington death record and
 *    the Social Security Death Index; the "Ann Arbor" birthplace comes from
 *    his obituary, and the 1976 Seattle Raymond Simons was another man.
 *  - Aaron and Hattie's dates and places; Hattie's birth surname Michel.
 *  - Ray's eldest sister Gertrude Nellie (Masters, Groves) was missing.
 *  - Lola married Matt Busey (1903), a Murphy, and Lial T. Adams (1918); Zell
 *    Busey in the 1910 household was her son.
 *  - Aaron's parents Henry Simons and Mary Wagner (later proven by the censuses).
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education', 'notable_stories']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const drop = (p, key, re) => { p[key] = p[key].filter(t => !re.test(t)); };

const CENSUS = 'Ancestry.com, U.S. Federal Censuses 1900–1950';
const DRAFT = 'Ancestry.com, U.S. World War I Draft Registration Cards, 1917–1918, and World War II Draft Cards Young Men, 1940–1947';
const WADEATH = 'Ancestry.com, Washington, U.S., Death Records, 1907–2017';
const SSDI = 'Ancestry.com, U.S. Social Security Death Index, 1935–2014';
const WAMARR = 'Ancestry.com, Washington, U.S., Marriage Records, 1854–2013';
const ORBIRTH = 'Ancestry.com, Oregon, U.S., State Births, 1842–1924';
const OBIT = 'Ancestry.com, U.S., Newspapers.com Obituary Index (Tri-City Herald, Pasco, 9 May 1977)';
const FAG = n => `Find a Grave, memorial ${n} (via Ancestry.com, U.S., Find a Grave Index)`;

// Raymond Zell Simons
edit('simons_raymond_zell', [CENSUS, DRAFT, WADEATH, SSDI, ORBIRTH, OBIT, FAG(72996672)], p => {
  drop(p, 'notable_stories', /^SSDI\/WA Death Index: Birth dates conflict/);
  drop(p, 'notes', /^(Birth June 14, 1897 confirmed via WWI draft card\. Death 1976 or 1977|Unconfirmed: Raymond Zell Simons was born 7 May 1898|Unconfirmed: The Social Security Death Index lists a Raymond Simons|Open question: Raymond Zell Simons's birth is|Open question: Ray Simons's birthplace is)/);
  for (const l of ['Kennewick, Benton County, Washington', 'Richland, Benton County, Washington', 'Franklin County, Washington']) add(p.locations, l);
  add(p.milestones, 'Registered for the WWII draft on 16 Feb 1942 at Kennewick, Washington; self-employed, with his brother-in-law Dan Groves as next of kin');
  add(p.milestones, 'Buried at Desert Lawn Memorial Park, Kennewick, Washington');
  add(p.career, 'Farmer: a rented farm at Lynden in 1920, his own farm near Richland in 1940, and a farm in Franklin County in 1950.');
  add(p.career, 'School bus driver in Delta, Whatcom County, in 1930.');
  add(p.education, 'Completed the second year of high school (1940 census).');
  note(p, 'Born 14 Jun 1897 at South Haven, Michigan, as his WWI and WWII draft cards, Washington death record and Social Security record all agree; the Ann Arbor birthplace comes from his Tri-City Herald obituary. He died 7 May 1977 at Kennewick while living in Pasco (Washington death certificate 9562). The Raymond Simons who died in Seattle in 1976 was a different man.');
  note(p, 'His Washington death record names his parents as Aaron Simons and Hattie Micheals.');
  note(p, 'Censuses give his father\'s birthplace as Ohio (1900, 1910), Iowa (1920) and Illinois (1930), and his own as Washington in 1930.');
  note(p, 'In 1930 the household at Buffalo Road, Delta, included Dradie\'s brother Elmer Kulp; in 1940 his daughter Elaine, her husband Les Rinehart and their children Jerry and Janet lived with him near Richland.');
});

// Aaron Simons and his parents
edit('simons_aaron', [CENSUS, FAG(159793415)], p => {
  p.birth = '9 May 1850';
  p.death = '16 Nov 1923';
  add(p.locations, 'Custer, Whatcom County, Washington');
  p.notes = p.notes.map(t => t.startsWith('Aaron Simons birth ~1852 confirmed') ? 'Birthplace Ohio (1900 and 1910 censuses).' : t);
  drop(p, 'notes', /^(Research lead \(Zell Busey\)|Open question: Who was Zell Busey)/);
  p.notes = p.notes.filter(t => !t.startsWith('CORRECTION: birth 9 May 1851 per his Find a Grave memorial'));
  note(p, 'CORRECTION: born 9 May 1850 in Ohio. He is an infant in the 1850 census of Coventry, Summit County, Ohio (taken as of 1 June 1850), so Find a Grave\'s 9 May 1851 is a year late; the 1900 census gives May 1852.');
  note(p, 'Died 16 Nov 1923 at Custer, Whatcom County, Washington.');
  note(p, 'Zell Busey, 4, in his 1910 household was his grandson, the son of his daughter Lola and Matt Busey.');
});
// Henry and Mary: proven by the 1850, 1860 and 1870 censuses (fix-2026-09-24-ancestry-simons-henry.js adds the detail)
const UNP_AARON = 'UNPROVEN: named as a parent of Aaron Simons on his Find a Grave memorial (159793415), a volunteer entry without a cited record.';
person('simons_henry', 'Henry Simons', 'M', FAG(159793415), p => { p.notes = p.notes.filter(t => t !== UNP_AARON); });
person('wagner_mary', 'Mary Wagner (Simons)', 'F', FAG(159793415), p => { add(p.aliases, 'Mary Simons'); p.notes = p.notes.filter(t => t !== UNP_AARON); });
wed('simons_henry', 'wagner_mary');
child('simons_aaron', 'simons_henry', 'wagner_mary');

// Hattie: birth surname Michel, remarried Davison
edit('simons_harriet_hattie', [CENSUS, WADEATH, FAG(6661061)], p => {
  if (p.name === 'Harriet M. Hattie Simons') { add(p.aliases, p.name); p.name = 'Harriet “Hattie” Michel (Simons, Davison)'; }
  for (const a of ['Harriet M. Simons', 'Hattie Simons', 'Hattie Micheals', 'Hattie Davison']) add(p.aliases, a);
  p.birth = '23 Dec 1858';
  p.death = '14 Jan 1933';
  for (const l of ['London, Middlesex County, Ontario, Canada', 'Lynden, Whatcom County, Washington']) add(p.locations, l);
  add(p.milestones, 'Buried in Lynden Cemetery, Lynden, Washington');
  note(p, 'Born 23 Dec 1858 at London, Ontario; died 14 Jan 1933 at Delta, Whatcom County. Her Find a Grave memorial gives her name as Hattie Michel Davison; her son Ray\'s death record gives her birth surname as Micheals. The "M." in "Harriet M." (1900 census) may be her birth surname.');
  note(p, 'After Aaron\'s death in 1923 she married a Davison, whose first name is not recorded.');
});

// Gertrude Nellie Simons, Ray's eldest sister
const GERT = 'simons_gertrude_nellie';
person(GERT, 'Gertrude Nellie Simons (Masters, Groves)', 'F', [FAG(14101134)], p => {
  p.birth = '16 May 1879'; p.death = '18 Jun 1947';
  p.aliases = p.aliases.filter(a => a !== 'Nellie Masters');
  for (const a of ['Nellie G. Simons', 'Gertrude Groves']) add(p.aliases, a);
  // she married in 1898 as Nellie, but is Gertrude on later records; the card follows those
  p.card_name = ['Gertrude N.', '(Simons) Groves'];
  for (const l of ['Minnesota', 'Benton Harbor, Berrien County, Michigan', 'North Yakima, Yakima County, Washington', 'Winlock, Lewis County, Washington']) add(p.locations, l);
  add(p.milestones, 'Married Charles F. Masters (m. 12 Sep 1898)');
  add(p.milestones, 'Married Dan H. Groves (m. 8 Sep 1906)');
  add(p.milestones, 'Buried in Winlock Cemetery, Winlock, Washington');
  note(p, 'Born 16 May 1879 in Minnesota, the eldest child of Aaron and Hattie Simons; died 18 Jun 1947 at Winlock, Lewis County, Washington.');
  note(p, 'Married Charles F. Masters on 12 Sep 1898 at Benton Harbor, Michigan (divorced 17 Dec 1901), then Daniel Harvey "Dan" Groves on 8 Sep 1906 at North Yakima, Washington; the 1906 return calls it her first marriage.');
});
child(GERT, 'simons_aaron', 'simons_harriet_hattie');
person('masters_charles_f', 'Charles F. Masters', 'M', FAG(14101134), p => { p.birth = p.birth || '1875'; p.death = p.death || '1928'; add(p.milestones, 'Married Gertrude Nellie Simons (m. 12 Sep 1898)'); note(p, 'First husband of Gertrude Nellie Simons; they divorced on 17 Dec 1901. The 1900 census lists him as Frank C. Masters, living with his parents at South Haven, Michigan.'); add(p.aliases, 'Frank C. Masters'); });
person('groves_dan_harvey', 'Daniel Harvey “Dan” Groves', 'M', [FAG(14101134), DRAFT], p => { p.birth = p.birth || '1882'; p.death = p.death || '1962'; add(p.aliases, 'Dan Groves'); add(p.milestones, 'Married Gertrude Nellie Simons (m. 8 Sep 1906)'); note(p, 'Second husband of Gertrude Nellie Simons. Her brother Ray Simons named him as next of kin on his 1942 draft card.'); });
wed(GERT, 'masters_charles_f');
wed(GERT, 'groves_dan_harvey');
person('groves_dorothy_helen', 'Dorothy Helen Groves (Sawyer)', 'F', FAG(14101134), p => { p.birth = p.birth || '1909'; p.death = p.death || '1999'; note(p, 'Daughter of Dan and Gertrude (Simons) Groves.'); });
child('groves_dorothy_helen', 'groves_dan_harvey', GERT);

// Lola P. Simons: Busey, Murphy, Adams
edit('simons_lola', [WAMARR, FAG(6660495)], p => {
  if (p.name === 'Lola Simons') p.name = 'Lola P. Simons (Busey, Murphy, Adams)';
  for (const a of ['Lola Simons', 'Lola Busey', 'Lola Murphy', 'Lola Adams']) add(p.aliases, a);
  p.birth = '21 Sep 1885'; p.death = '3 Dec 1918';
  p.milestones = p.milestones.filter(t => t !== 'Born Sep 1885, Michigan');
  drop(p, 'notes', /^Sister of Raymond Zell Simons\. Recorded under her birth surname/);
  for (const l of ['Hart, Oceana County, Michigan', 'Mount Vernon, Skagit County, Washington', 'Spokane, Washington', 'Butte, Silver Bow County, Montana', 'Lynden, Whatcom County, Washington']) add(p.locations, l);
  add(p.milestones, 'Married Matt Busey (m. 16 Feb 1903)');
  add(p.milestones, 'Married Lial T. Adams (m. 2 May 1918)');
  add(p.milestones, 'Buried in Lynden Cemetery, Lynden, Washington');
  note(p, 'Sister of Raymond Zell Simons. Born 21 Sep 1885 at Hart, Oceana County, Michigan; died 3 Dec 1918 at Butte, Montana, aged 33.');
  note(p, 'Married Matt Busey at Mount Vernon, Skagit County, on 16 Feb 1903 at 18 (the index also shows the couple under 26 Feb 1903 and 1 Feb 1902). She was Lola Murphy when she married Lial T. Adams at Spokane on 2 May 1918; her Murphy husband is not recorded.');
});
person('busey_matt', 'Matt Busey', 'M', WAMARR, p => { add(p.milestones, 'Married Lola Simons (m. 16 Feb 1903)'); note(p, 'First husband of Lola Simons, married at Mount Vernon, Skagit County, Washington.'); });
wed('simons_lola', 'busey_matt');
person('adams_lial_t', 'Lial T. Adams', 'M', WAMARR, p => { add(p.milestones, 'Married Lola (Simons) Murphy (m. 2 May 1918)'); note(p, 'Married Lola (Simons) Murphy at Spokane on 2 May 1918. He is not known to be related to the Adams family of this tree.'); });
wed('simons_lola', 'adams_lial_t');
person('busey_zell', 'Zell Busey', 'M', CENSUS, p => { p.birth = p.birth || 'abt 1906'; note(p, 'Grandson of Aaron and Hattie Simons, living with them at Delta, Whatcom County, aged 4 in 1910. Inferred to be the son of Lola Simons and Matt Busey: Lola is the only Simons daughter known to have married a Busey. His name likely honours his uncle Raymond Zell Simons.'); });
child('busey_zell', 'busey_matt', 'simons_lola');

// Ray's children
edit('simons_elaine_deretha', [ORBIRTH, CENSUS], p => note(p, 'Her birth is recorded in the Oregon state birth records, with parents Raymond Zell Simons (aged 20) and Dradie Ellen Kulp. The 1940 census and her Find a Grave memorial spell her married name Rinehart.'));
edit('simons_glen', CENSUS, p => { if (!p.birth) p.birth = 'abt 1936'; add(p.aliases, 'Glen E. Simons'); note(p, 'Aged 4 in the 1940 census (near Richland) and 14 in 1950 as Glen E. Simons (Franklin County).'); });

// Trudy's name: a lead
edit('gertrude_adams_remy', FAG(14101134), p => note(p, 'Lead: Beryl\'s aunt, her father\'s eldest sister, was Gertrude Nellie Simons (Groves); neither of Beryl\'s grandmothers is recorded as Gertrude.'));
console.log('Ancestry Simons records applied');
