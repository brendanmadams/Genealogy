#!/usr/bin/env node
/**
 * 2026-09-24, children and grandchildren of Beryl's brothers and sister
 * (Glen, Orval, Howard, Elmer, Elaine) and of her cousins Zell Busey and
 * Dorothy (Groves) Sawyer, from obituaries and the 1920–1950 censuses.
 * Re-runnable. Living people get names and relationships only.
 *  - Howard: Nancy Simons's 2012 obituary (children's married names).
 *  - Orval: Irene Simons's and Rod Simons's 2017 obituaries (a fourth
 *    child, Billy, and the grandchildren).
 *  - Elmer: Carl Ray Simons's 2025 obituary. Glen: dates from his funeral
 *    home. Elaine: William Upham's 2016 obituary.
 *  - Zell Busey: his three marriages and four children, from the censuses
 *    and his son Bud's 2005 obituary. Ray's sister Bertha was living with
 *    her husband Harry H. Harrington and nephew Zell in 1920.
 *  - Dorothy (Groves) Sawyer: her husband and son, from Find a Grave and
 *    her son Ben's 2014 obituary.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };
const drop = (p, key, re) => { p[key] = p[key].filter(t => !re.test(t)); };
// a spouse known only by first name, from an obituary's "(Name)" after a child
const inlaw = (id, name, sex, src, of, text) => { person(id, name, sex, src, p => note(p, text)); wed(of, id); };

const OB_NANCY = 'Obituary of Nancy A. Simons, Tri-City Herald, 20 Nov 2012 (Legacy.com)';
const OB_IRENE = 'Obituary of Irene Simons, Tri-City Herald, 15 Oct 2017 (Legacy.com)';
const OB_ROD = 'Obituary of Rodney Keith Simons, Mueller\'s Tri-Cities Funeral Home, Feb 2017';
const OB_CARL = 'Obituary of Carl Ray Simons, Fisher-Cheney Funeral Home, Troy, Aug 2025';
const OB_GLEN = 'Sumner Voiles Funeral Chapel, memorial page for Glen Simons (12 Jan 1936 – 1 Dec 2020)';
const OB_UPHAM = 'Obituary of William Clifford Upham, The Oregonian, 18 Oct 2016 (Legacy.com)';
const OB_BUD = 'Obituary of Gordon "Bud" Busey, Times-Standard, Eureka, California, 19 Oct 2005 (Legacy.com)';
const OB_BEN = 'Obituary of Benjamin S. Sawyer III, Weaver Mortuary, Beaumont, California, Oct 2014 (Dignity Memorial)';
const FAG_DOR = 'Find a Grave, memorial 155822857 (Dorothy Helen Groves Sawyer)';
const CEN = y => `Ancestry.com, ${y} United States Federal Census`;
const ZELL_SRC = [CEN(1920), CEN(1930), CEN(1940), CEN(1950), 'Ancestry.com, U.S. World War II Draft Cards Young Men, 1940–1947', 'Ancestry.com, Washington, U.S., Death Records, 1907–2017', 'Ancestry.com, Washington, U.S., Marriage Records, 1854–2013'];

// ── Howard and Nancy ─────────────────────────────────────────────────────────
edit('simons_nancy', OB_NANCY, p => {
  rename(p, ['Nancy Simons'], 'Nancy A. Simons');
  p.birth = p.birth || '14 Oct 1929';
  p.death = p.death || 'Nov 2012';
  for (const l of ['Illinois', 'Pasco, Washington', 'Kennewick, Washington']) add(p.locations, l);
  add(p.career, 'Life insurance agent from 1973 until she retired in 2008; the first woman president of the Washington State Association of Life Underwriters.');
  drop(p, 'notes', /^Wife of Howard \(Byron Daniel\) Simons\. Maiden name not recorded\.$/);
  note(p, 'Wife of Howard (Byron Daniel) Simons. Born 14 Oct 1929 in Illinois; her family came to the Tri-Cities in 1943 with the Hanford project. She and Howard farmed raw land north of Pasco for ten years and moved to Kennewick in 1960. She died in Nov 2012. Her brother was Lyle Mineer of Richland, so her birth surname was probably Mineer.');
  note(p, 'At her death she had 11 grandchildren and 9 great-grandchildren, not named in her obituary.');
});
edit('simons_sharon', OB_NANCY, p => { rename(p, ['Sharon Simons'], 'Sharon Simons (Thompson)'); add(p.aliases, 'Sharon Thompson'); add(p.locations, 'Camas, Washington'); });
inlaw('thompson_alan', 'Alan Thompson', 'M', OB_NANCY, 'simons_sharon', 'Husband of Sharon (Simons) Thompson, of Camas, Washington (2012).');
edit('simons_steve', OB_NANCY, p => add(p.locations, 'Sequim, Washington'));
edit('simons_lynn', OB_NANCY, p => add(p.locations, 'Kennewick, Washington'));
edit('simons_sandy', OB_NANCY, p => { rename(p, ['Sandy Simons'], 'Sandy Simons (Warner)'); add(p.aliases, 'Sandy Warner'); add(p.locations, 'Kennewick, Washington'); });
inlaw('warner_marc', 'Marc Warner', 'M', OB_NANCY, 'simons_sandy', 'Husband of Sandy (Simons) Warner, of Kennewick (2012).');
edit('simons_judy', OB_NANCY, p => { rename(p, ['Judy Simons'], 'Judith “Judy” Simons (Doshier)'); add(p.aliases, 'Judith Doshier'); add(p.locations, 'Kennewick, Washington'); });
inlaw('doshier_doug', 'Doug Doshier', 'M', OB_NANCY, 'simons_judy', 'Husband of Judith (Simons) Doshier, of Kennewick (2012).');

// ── Orval and Irene ──────────────────────────────────────────────────────────
edit('simons_irene', OB_IRENE, p => {
  rename(p, ['Irene Simons'], 'Bessie Irene Cantrell (Simons)');
  add(p.aliases, 'Irene Simons');
  p.birth = p.birth || '4 Nov 1932';
  p.death = p.death || '10 Oct 2017';
  for (const l of ['Rock Island, Tennessee', 'Pasco, Washington']) add(p.locations, l);
  add(p.milestones, 'Married Orvel Keith Simons (m. 1951)');
  drop(p, 'notes', /^Wife of Orval Keith Simons\. Maiden name not recorded\.$/);
  note(p, 'Born Bessie Irene Cantrell on 4 Nov 1932 at Rock Island, Tennessee, the eldest of three daughters of Hallie and Houston Cantrell; the family moved to Washington in 1942. She married her high school sweetheart Orvel Keith Simons in 1951 and raised their four children, Janine, Les, Rod and Billy, after his death in 1979. Known to her grandchildren as "Gam". She died 10 Oct 2017, a long-time Pasco resident.');
});
edit('simons_orval_keith', OB_IRENE, p => add(p.milestones, 'Married Bessie Irene Cantrell (m. 1951)'));
edit('simons_janine', OB_IRENE, p => { rename(p, ['Janine Simons'], 'Janine Simons (Bensussen)'); add(p.aliases, 'Janine Bensussen'); add(p.locations, 'Richland, Washington'); drop(p, 'notes', /^Married Stan \(surname not recorded\)\.$/); note(p, 'Married Stan Bensussen.'); });
edit('stan_husband_of_janine_simons', OB_IRENE, p => { rename(p, ['Stan'], 'Stan Bensussen'); drop(p, 'notes', /^Husband of Janine Simons\. Surname not recorded\.$/); note(p, 'Husband of Janine (Simons) Bensussen.'); });
for (const [id, name, fn] of [['bensussen_simon', 'Simon Bensussen', () => {}], ['bensussen_michael', 'Michael Bensussen', p => note(p, 'His wife is Jenna, and their son Jacob is Irene Simons\'s great-grandson (2017).')]]) {
  person(id, name, 'M', OB_IRENE, p => { note(p, 'Son of Stan and Janine (Simons) Bensussen; grandson of Orvel and Irene Simons.'); fn(p); });
  child(id, 'stan_husband_of_janine_simons', 'simons_janine');
}
edit('simons_les', OB_IRENE, p => add(p.locations, 'Kent, Washington'));
person('simons_jessica_irene', 'Jessica Irene Simons', 'F', OB_IRENE, p => note(p, 'Daughter of Les and Lenore Simons; granddaughter of Orvel and Irene Simons.'));
child('simons_jessica_irene', 'simons_les', 'simons_lenore');
person('simons_leslie', 'Leslie Simons (Addis)', 'F', OB_IRENE, p => { add(p.aliases, 'Leslie Addis'); note(p, 'Daughter of Les and Lenore Simons; married Paul Addis.'); });
child('simons_leslie', 'simons_les', 'simons_lenore');
person('simons_billy', 'Billy Simons', 'M', [OB_IRENE, OB_ROD], p => note(p, 'Son of Orvel and Irene Simons, of the Tri-Cities; his wife is Yvette, and they have a daughter, Amanda.'));
child('simons_billy', 'simons_orval_keith', 'simons_irene');
person('simons_amanda', 'Amanda Simons', 'F', OB_IRENE, p => note(p, 'Daughter of Billy and Yvette Simons; granddaughter of Orvel and Irene Simons.'));
child('simons_amanda', 'simons_billy', null);
edit('simons_rodney', [OB_ROD, OB_IRENE], p => {
  rename(p, ['Rodney Simons'], 'Rodney Keith “Rod” Simons');
  add(p.aliases, 'Rod Simons');
  p.birth = p.birth || '30 Jun 1960';
  p.death = p.death || '20 Feb 2017';
  for (const l of ['Pasco, Washington', 'Minneapolis, Minnesota', 'Fort Myers, Florida']) add(p.locations, l);
  add(p.career, 'Radio and sports broadcaster, based in Minneapolis.');
  add(p.education, 'Washington State University.');
  add(p.milestones, 'Buried at Desert Lawn Memorial Park, Kennewick, Washington');
  note(p, 'Born 30 Jun 1960; grew up in the Tri-Cities and studied at Washington State University, where he found radio and then sports broadcasting. He died 20 Feb 2017 at Fort Myers, Florida, aged 56, and was buried at Desert Lawn Memorial Park, Kennewick, where his grandparents Ray and Dradie Simons lie. His wife is Pam (Pamela), and their daughter Anna Bess "Annie" Simons.');
});
person('simons_pamela', 'Pamela “Pam” Simons', 'F', OB_ROD, p => note(p, 'Wife of Rod Simons; her birth surname is not recorded.'));
wed('simons_rodney', 'simons_pamela');
person('simons_anna_bess', 'Anna Bess “Annie” Simons', 'F', [OB_ROD, OB_IRENE], p => note(p, 'Daughter of Rod and Pam Simons; granddaughter of Orvel and Irene Simons.'));
child('simons_anna_bess', 'simons_rodney', 'simons_pamela');
for (const id of ['simons_janine', 'simons_les', 'simons_rodney', 'simons_billy']) for (const o of ['simons_janine', 'simons_les', 'simons_rodney', 'simons_billy']) if (o !== id) edit(id, [], p => add(p.relationships.siblings, o));

// ── Elmer ────────────────────────────────────────────────────────────────────
edit('simons_carl_ray', OB_CARL, p => {
  p.birth = p.birth || '18 May 1954';
  p.death = p.death || '7 Aug 2025';
  note(p, 'Born 18 May 1954; grew up in Washington and died 7 Aug 2025. He loved motorcycles, music and the boat races on the Columbia River. His partner was Judy Simons; his children are Ashley and Shawn Simons. His obituary names his parents as Wilma and Elmer Simons, and says his sister Deborah died before him.');
});
for (const [id, name] of [['simons_ashley', 'Ashley Simons'], ['simons_shawn', 'Shawn Simons']]) {
  person(id, name, '', OB_CARL, p => note(p, 'Child of Carl Ray Simons; grandchild of Elmer Simons.'));
  child(id, 'simons_carl_ray', null);
}
edit('simons_debra_sue', OB_CARL, p => { if (!p.death) p.death = 'before 2025'; note(p, 'Her brother Carl Ray\'s 2025 obituary says she died before him.'); });
edit('simons_betty', OB_CARL, p => note(p, 'Carl Ray Simons\'s 2025 obituary names his mother as Wilma, not Betty; Elmer may have married twice, or Betty may be a nickname. Not resolved.'));

// ── Glen ─────────────────────────────────────────────────────────────────────
edit('simons_glen', [OB_GLEN, OB_IRENE], p => {
  if (!p.birth || p.birth === 'abt 1936') p.birth = '12 Jan 1936';
  p.death = p.death || '1 Dec 2020';
  note(p, 'Born 12 Jan 1936; died 1 Dec 2020 (Sumner Voiles Funeral Chapel, near Bonney Lake). He and Mary were living when his sister-in-law Irene died in 2017.');
});

// ── Elaine ───────────────────────────────────────────────────────────────────
edit('simons_elaine_deretha', OB_UPHAM, p => { add(p.milestones, 'Married William Clifford Upham (m. 1991)'); });
edit('upham_william', OB_UPHAM, p => {
  rename(p, ['William “Bill” Upham'], 'William Clifford “Bill” Upham');
  p.birth = p.birth || '8 Jul 1919'; p.death = p.death || '5 Oct 2016';
  for (const l of ['Portland, Oregon', 'Gladstone, Oregon']) add(p.locations, l);
  add(p.career, 'Accountant at Consolidated Freightways for 46 years; U.S. Army, 106th Infantry Regiment, 27th Infantry Division, in the Pacific, 1942–1945.');
  add(p.milestones, 'Married Elaine (Simons) Rinehart (m. 1991)');
  note(p, 'Born 8 Jul 1919 in Portland; died 5 Oct 2016, aged 97. He married Marie Maxine Smith in 1947 (two daughters), Virginia Rounds in 1977, and Elaine Rinehart in 1991.');
});
edit('rhinehart_janet', OB_UPHAM, p => { rename(p, ['Janet Rhinehart', 'Janet Rinehart'], 'Janet Rinehart (Holter)'); add(p.aliases, 'Jan Holter'); add(p.locations, 'Coeur d\'Alene, Idaho'); });
for (const id of ['rhinehart_jerry', 'rhinehart_janet']) for (const o of ['rhinehart_jerry', 'rhinehart_janet']) if (o !== id) edit(id, [], p => add(p.relationships.siblings, o));

// ── Zell Busey ───────────────────────────────────────────────────────────────
edit('busey_zell', [...ZELL_SRC, OB_BUD], p => {
  rename(p, ['Zell Busey'], 'Zell Martin Busey');
  add(p.aliases, 'Zell Busey'); add(p.aliases, 'Zell M. Busey');
  if (p.birth === 'abt 1906' || !p.birth) p.birth = '21 Nov 1906';
  p.death = p.death || '28 Apr 1983';
  for (const l of ['Bellingham, Washington', 'Umatilla County, Oregon', 'Seattle, Washington', 'Kirkland, Washington']) add(p.locations, l);
  add(p.career, 'Lumber mill foreman (1930), crane operator (1940), National Guard caretaker (1950); a master sergeant by 1957.');
  add(p.milestones, 'Married Rose Lee (m. abt 1926); divorced 1935');
  add(p.milestones, 'Married Jessie L. (m. 4 Mar 1939)');
  add(p.milestones, 'Married Grace M. (m. 31 Dec 1948)');
  note(p, 'Born 21 Nov 1906 at Bellingham, Washington (WWII draft card; other records give 1905 or 1908); died 28 Apr 1983 at Kirkland, Washington. In 1920, aged 14, he lived in Umatilla County, Oregon, as the nephew of Harry H. and Bertha Harrington, his mother Lola\'s sister.');
  note(p, 'Married Rose Lee about 1926 (they had twins Gordon "Bud" and Lola in 1929 and a younger daughter Ana Jean, and divorced in 1935); Jessie L. on 4 Mar 1939 in Seattle; and Grace M. on 31 Dec 1948 at Sedro-Woolley, Skagit County, with whom he had a daughter, Joan Cora, about 1949.');
});
person('busey_rose_lee', 'Rose Lee Diebell', 'F', [CEN(1930), OB_BUD], p => { add(p.aliases, 'Rose Lee Busey'); add(p.aliases, 'Rosa Lee Busey'); add(p.milestones, 'Married Zell Martin Busey (m. abt 1926); divorced 1935'); add(p.milestones, 'Married Peter Diebell (m. 1937)'); note(p, 'First wife of Zell Busey ("Rosa Lee", 22, in the 1930 census) and mother of Gordon, Lola and Ana Jean. After their divorce in 1935 she married Peter Diebell in 1937 and moved with the children to Albany, California. Her birth surname is not recorded.'); });
wed('busey_zell', 'busey_rose_lee');
person('busey_jessie', 'Jessie L. Busey', 'F', CEN(1940), p => { add(p.milestones, 'Married Zell Martin Busey (m. 4 Mar 1939)'); note(p, 'Second wife of Zell Busey; aged 21 in the 1940 census, at 4524 Orcas Street, Seattle. Her birth surname is not recorded.'); });
wed('busey_zell', 'busey_jessie');
person('busey_grace', 'Grace M. Busey', 'F', CEN(1950), p => { add(p.milestones, 'Married Zell Martin Busey (m. 31 Dec 1948)'); note(p, 'Third wife of Zell Busey (married 31 Dec 1948 at Sedro-Woolley); aged 39 in the 1950 census. Her birth surname is not recorded.'); });
wed('busey_zell', 'busey_grace');
person('busey_gordon', 'Gordon James “Bud” Busey', 'M', [CEN(1930), OB_BUD], p => {
  add(p.aliases, 'Bud Busey');
  p.birth = p.birth || '24 Mar 1929'; p.death = p.death || '14 Oct 2005';
  for (const l of ['Seattle, Washington', 'Albany, California', 'Eureka, California']) add(p.locations, l);
  add(p.career, 'U.S. Marine Corps, 1946–1948; Eureka Police Department for 25 years, retiring in 1977 as Captain of Patrol Operations; then security program director at PG&E\'s Humboldt Bay plant until 1987.');
  add(p.milestones, 'Married Helen Laverne Larsen (d. 1983)');
  add(p.milestones, 'Married Maggie Murray (m. 1985)');
  note(p, 'Born 24 Mar 1929, twin of Lola; son of Zell and Rose Lee Busey. Raised in Albany, California, by his mother and stepfather Peter Diebell. He married Helen Laverne Larsen, and they had Sheryl (1949), Greg, Debbie and Kris; after Helen\'s death in 1983 he married Maggie Murray in 1985 (her children Dayton Murray and Mitzi Goodrow). He died 14 Oct 2005 at Eureka, California.');
  note(p, 'His grandchildren in 2005: Jeff and Christopher Mitchell, Ryan Busey, Charlene Johnson, Erin Hogan, Jackie and Justin Christensen, and Megan Murray; and five great-grandchildren.');
});
child('busey_gordon', 'busey_zell', 'busey_rose_lee');
person('busey_lola', 'Lola Busey (Long)', 'F', [CEN(1930), OB_BUD], p => { add(p.aliases, 'Lola Long'); p.birth = p.birth || '24 Mar 1929'; note(p, 'Twin sister of Gordon "Bud" Busey; daughter of Zell and Rose Lee Busey (indexed as "Sola Marie" in the 1930 census). Married Harry Long. Likely named for her grandmother Lola (Simons) Busey.'); add(p.aliases, 'Lola Marie Busey'); });
child('busey_lola', 'busey_zell', 'busey_rose_lee');
person('busey_ana_jean', 'Ana Jean Busey (Lewis)', 'F', OB_BUD, p => { add(p.aliases, 'Ana Jean Lewis'); note(p, 'Younger sister of Gordon and Lola; daughter of Zell and Rose Lee Busey.'); });
child('busey_ana_jean', 'busey_zell', 'busey_rose_lee');
person('busey_joan_cora', 'Joan Cora Busey', 'F', CEN(1950), p => { p.birth = p.birth || 'abt 1949'; note(p, 'Daughter of Zell and Grace M. Busey; aged 1 in the 1950 census, King County, Washington.'); });
child('busey_joan_cora', 'busey_zell', 'busey_grace');
person('larsen_helen_laverne', 'Helen Laverne Larsen (Busey)', 'F', OB_BUD, p => { if (!p.death) p.death = '1983'; add(p.aliases, 'Helen Busey'); note(p, 'First wife of Gordon "Bud" Busey and mother of his children; she died in 1983.'); });
wed('busey_gordon', 'larsen_helen_laverne');
for (const [id, name, sex, spouse] of [['busey_sheryl', 'Sheryl Busey (Mitchell)', 'F', 'Wally Mitchell'], ['busey_greg', 'Greg Busey', 'M', 'Peggy'], ['busey_debbie', 'Debbie Busey (Ludtke)', 'F', 'Jesse Ludtke'], ['busey_kris', 'Kris Busey (Christensen)', 'F', 'Bill Christensen']]) {
  person(id, name, sex, OB_BUD, p => { note(p, `Child of Gordon "Bud" and Helen (Larsen) Busey; grandchild of Zell Busey. Spouse: ${spouse} (2005).`); if (id === 'busey_sheryl') p.birth = p.birth || '1949'; });
  child(id, 'busey_gordon', 'larsen_helen_laverne');
}

// ── Bertha Simons ────────────────────────────────────────────────────────────
edit('simons_bertha', CEN(1920), p => {
  rename(p, ['Bertha Simons'], 'Bertha Simons (Harrington)');
  add(p.aliases, 'Bertha Harrington');
  add(p.locations, 'Umatilla County, Oregon');
  drop(p, 'notes', /^Sister of Raymond Zell Simons\. Recorded under her birth surname Simons; she likely took a husband's surname, which is not recorded\.$/);
  note(p, 'Sister of Raymond Zell Simons. Inferred: she is the Bertha Harrington, 33, wife of Harry H. Harrington, in Precinct 12, Umatilla County, Oregon, in 1920, with their nephew Zell Busey, 14, the son of her sister Lola. Her age matches her 1887 birth.');
});
person('harrington_harry_h', 'Harry H. Harrington', 'M', CEN(1920), p => { p.birth = p.birth || 'abt 1887'; add(p.locations, 'Umatilla County, Oregon'); note(p, 'Aged 33 in the 1920 census, Precinct 12, Umatilla County, Oregon, with his wife Bertha (33) and her nephew Zell Busey (14). Inferred husband of Bertha Simons.'); });
wed('simons_bertha', 'harrington_harry_h');

// ── Dorothy (Groves) Sawyer ──────────────────────────────────────────────────
edit('groves_dorothy_helen', [FAG_DOR, OB_BEN, 'Ancestry.com, U.S. Social Security Death Index; Oregon, U.S., Death Index, 1898–2008'], p => {
  if (p.birth === '1909' || !p.birth) p.birth = '18 Oct 1909';
  if (p.death === '1999' || !p.death) p.death = '11 Aug 1999';
  add(p.milestones, 'Married Benjamin Sebastian Sawyer Jr. (m. 1929)');
  add(p.milestones, 'Buried at Hillcrest Burial Park, Kent, Washington');
  for (const l of ['Seattle, Washington', 'Portland, Oregon', 'Kent, Washington']) add(p.locations, l);
  note(p, 'Born 18 Oct 1909; died 11 Aug 1999 (Find a Grave and the Social Security Death Index; the Oregon death index gives 11 Jun 1999 in Multnomah County). Married Benjamin Sebastian Sawyer Jr. in 1929; their son Benjamin III was born in Seattle in 1931 and raised in Portland.');
});
person('sawyer_benjamin_jr', 'Benjamin Sebastian Sawyer Jr.', 'M', FAG_DOR, p => { p.birth = p.birth || '1909'; p.death = p.death || '1956'; add(p.aliases, 'Ben Sawyer'); add(p.milestones, 'Married Dorothy Helen Groves (m. 1929)'); note(p, 'Husband of Dorothy Helen Groves (married 1929).'); });
wed('groves_dorothy_helen', 'sawyer_benjamin_jr');
person('sawyer_benjamin_iii', 'Benjamin Sebastian Sawyer III', 'M', [FAG_DOR, OB_BEN], p => {
  add(p.aliases, 'Ben Sawyer');
  p.birth = p.birth || '10 Nov 1931'; p.death = p.death || '9 Oct 2014';
  for (const l of ['Seattle, Washington', 'Portland, Oregon', 'Walnut Creek, California', 'Banning, California']) add(p.locations, l);
  add(p.education, 'Grant High School, Portland, class of 1949.');
  add(p.career, 'Owned and ran Sawyer Communications in Portland and later in Walnut Creek and Martinez, California.');
  note(p, 'Born 10 Nov 1931 in Seattle; died 9 Oct 2014, of Banning, California. Survived by his wife Carolyn, his children Brent, Lyn and Benjamin, and fifteen grandchildren.');
});
child('sawyer_benjamin_iii', 'sawyer_benjamin_jr', 'groves_dorothy_helen');
person('sawyer_carolyn', 'Carolyn Sawyer', 'F', OB_BEN, p => note(p, 'Wife of Benjamin Sebastian Sawyer III; of Banning, California (2014).'));
wed('sawyer_benjamin_iii', 'sawyer_carolyn');
for (const [id, name, sex, text] of [['sawyer_brent', 'Brent Sawyer', 'M', 'Of Gilbert, Arizona (2014).'], ['sawyer_lyn', 'Lyn Sawyer', 'F', 'Of Ferndale, Washington, with her husband Scott (2014); her married surname is not given.'], ['sawyer_benjamin_iv', 'Benjamin Sawyer', 'M', 'Of Seattle (2014).']]) {
  person(id, name, sex, OB_BEN, p => note(p, `Child of Benjamin Sebastian Sawyer III; grandchild of Dorothy (Groves) Sawyer. ${text}`));
  child(id, 'sawyer_benjamin_iii', null);
}
console.log('Simons cousins\' descendants applied');
