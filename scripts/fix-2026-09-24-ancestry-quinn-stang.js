#!/usr/bin/env node
/**
 * 2026-09-24, the Quinn family from the public "Quinn Family Tree" on
 * Ancestry.com (tree 11167102, which cites the censuses, Find a Grave and
 * newspapers), checked against records, with the Stang links. Re-runnable.
 *  - Bernard Quinn was John Bernard Quinn (Dec 1853 – 14 Oct 1913), from
 *    Rasharkin, Co. Antrim; he married Emily Mariam Lynn on 6 Aug 1889. His
 *    parents James McGeer Quin and Sarah Mooney are UNPROVEN (tree only).
 *  - Ethel's brothers and sisters, and John Joseph Quinn's family: Joan was
 *    Catherine Joan Quinn (16 Dec 1930 – 25 Jan 2018), who married Bernard J.
 *    Stang about 1952; Pat was Patricia Marie Quinn (Revty).
 * The tree hides living people, so Joan's four children are not named there.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, ...(sex ? { sex } : {}), birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
function edit(id, src, fn) { const p = load(id); for (const k of ['milestones', 'notes', 'sources', 'aliases', 'locations', 'career']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); }
const person = (id, name, sex, src, fn = () => {}) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const child = (kid, father, mother) => {
  edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; });
  for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid));
};
const rename = (p, from, to) => { if (from.includes(p.name)) { add(p.aliases, p.name); p.name = to; } };

const TREE = 'Ancestry.com, public member tree "Quinn Family Tree" (tree 11167102)';
const WED = 'Ancestry.com, U.S., Newspapers.com Marriage Index (Baltimore Sun, 6 Jan 1952)';
const OBIT13 = 'Ancestry.com, U.S., Obituary Collection (John Joseph Quinn Jr., Columbia, Maryland, 22 May 2013)';
const FAG = n => `Find a Grave, memorial ${n}`;

// John Bernard Quinn and his (unproven) parents
edit('quinn_bernard', TREE, p => {
  rename(p, ['Bernard Quinn'], 'John Bernard Quinn');
  add(p.aliases, 'Bernard Quinn');
  p.birth = 'Dec 1853';
  p.death = '14 Oct 1913';
  for (const l of ['Rasharkin, County Antrim, Ireland', 'Fallston, Harford County, Maryland', 'Benson, Harford County, Maryland']) add(p.locations, l);
  add(p.milestones, 'Emigrated from Ireland to the United States in 1870, settling in Harford County, Maryland');
  add(p.milestones, 'Married Emily Mariam Lynn (m. 6 Aug 1889)');
  add(p.milestones, 'Buried 16 Oct 1913 at St John\'s Church, Long Green, Baltimore County');
  add(p.career, 'Laborer (1900 and 1910 censuses).');
  note(p, 'Per the Quinn Family Tree on Ancestry (citing the 1870–1910 censuses): born Dec 1853 at Rasharkin, County Antrim; came to the United States in 1870; married Emily Mariam Lynn on 6 Aug 1889 at St John\'s Church, Hydes, Baltimore County; lived at Fallston, Harford County; died 14 Oct 1913 at Benson, Harford County. By 1910 he had fathered eight children, seven living. Find a Grave gives his birth year as 1852.');
  note(p, 'His children, per the tree: Sarah Catherine "Sally" (b. 22 Jun 1890), Charlotte Ann (3 Mar 1892), Mariam Ellen (Jan 1894), Agnes Emily (Sep 1895), James (May–Sep 1897), John Joseph (6 May 1898), Ethel Elizabeth (13 Nov 1900) and Margaret Agatha (15 Aug 1905).');
});
const UNP = 'UNPROVEN: named as a parent of John Bernard Quinn in the Quinn Family Tree on Ancestry; not yet checked against a record.';
person('quin_james_mcgeer', 'James McGeer Quin', 'M', TREE, p => { p.birth = p.birth || '1823'; p.death = p.death || '6 Mar 1898'; add(p.locations, 'County Antrim, Ireland'); add(p.locations, 'Fallston, Harford County, Maryland'); note(p, UNP); note(p, 'The tree gives his death as 6 Mar 1898 at Fallston, Harford County, and lists other children Ann Jane (1846–1912), Elizabeth Jane (1857–1903) and John Joseph (1858–1883).'); });
person('mooney_sarah', 'Sarah Mooney (Quin)', 'F', TREE, p => { p.birth = p.birth || '1826'; p.death = p.death || '23 Jun 1890'; note(p, UNP); note(p, 'The tree gives her death as 23 Jun 1890 at Hydes, Maryland.'); });
wed('quin_james_mcgeer', 'mooney_sarah');
child('quinn_bernard', 'quin_james_mcgeer', 'mooney_sarah');

edit('lynn_emily_mariam', TREE, p => {
  p.death = '24 Sep 1937';
  add(p.milestones, 'Married John Bernard Quinn (m. 6 Aug 1889)');
  note(p, 'Died 24 Sep 1937 in Baltimore County (Quinn Family Tree on Ancestry).');
});

// Ethel's brothers and sisters
const sib = (id, name, sex, birth, death, fn = () => {}) => {
  person(id, name, sex, TREE, p => { if (!p.birth) p.birth = birth; if (death && !p.death) p.death = death; add(p.locations, 'Fallston, Harford County, Maryland'); note(p, 'Child of John Bernard Quinn and Emily Mariam Lynn, per the Quinn Family Tree on Ancestry.'); fn(p); });
  child(id, 'quinn_bernard', 'lynn_emily_mariam');
};
sib('quinn_sarah_catherine', 'Sarah Catherine “Sally” Quinn (Brady)', 'F', '22 Jun 1890', '1959', p => { add(p.aliases, 'Sally Brady'); });
sib('quinn_charlotte_ann', 'Charlotte Ann Quinn (Landreth)', 'F', '3 Mar 1892', '1971', p => add(p.aliases, 'Charlotte Landreth'));
sib('quinn_mariam_ellen', 'Mariam Ellen Quinn', 'F', 'Jan 1894', '');
sib('quinn_agnes_emily', 'Agnes Emily Quinn', 'F', 'Sep 1895', 'after 1910', p => note(p, 'Aged 14 in the 1910 census; the tree says she died after it.'));
sib('quinn_james_1897', 'James Quinn', 'M', 'May 1897', 'Sep 1897', p => add(p.milestones, 'Died in infancy'));
sib('quinn_margaret_agatha', 'Margaret Agatha Quinn (Osborne)', 'F', '15 Aug 1905', '10 Jul 1946', p => { add(p.aliases, 'Margaret M. Osborne'); add(p.locations, 'Philadelphia, Pennsylvania'); note(p, 'Margaret A., aged 4, in the 1910 census; Find a Grave calls her Margaret M. Quinn Osborne (1905–1946). The tree gives her death as 10 Jul 1946 in Philadelphia.'); });

edit('ethel_quinn_schriefer', TREE, p => { p.milestones = p.milestones.map(t => t === 'Married George Goode Schriefer' ? 'Married George Goode Schriefer (m. 12 Jul 1920)' : t).filter((t, i, a) => a.indexOf(t) === i); });
edit('schriefer_george_goode', TREE, () => {});
edit('emily_schrieffer_mckeldin', TREE, p => note(p, 'The Quinn Family Tree on Ancestry gives her birth as 4 Feb 1921 and her death as Oct 1951; her death notice (Oct 1950) and Find a Grave (20 Feb 1921) are followed here.'));
edit('schriefer_kenneth', TREE, p => { if (!p.birth || p.birth === 'abt 1923') p.birth = '7 Jul 1923'; if (!p.death) p.death = '2005'; note(p, 'The Quinn Family Tree on Ancestry gives him as Joseph Kenneth Schriefer, born 7 Jul 1923 in Baltimore, died 2005.'); });

// John Joseph Quinn's family
edit('quinn_john_joseph', TREE, p => {
  add(p.milestones, 'Married Marie Ellinghaus (m. 25 May 1925)');
  add(p.locations, 'Fallston, Harford County, Maryland');
  note(p, 'Married Marie Ellinghaus on 25 May 1925 at St Ann\'s Church, Baltimore (Quinn Family Tree on Ancestry). Children: Margaret Frances "Peggy" (1927), Catherine Joan (1930), John Joseph Jr. (1934) and Patricia Marie "Pat" (1940).');
});
edit('quinn_marie_ellinghaus', [TREE, FAG(254763745)], p => {
  rename(p, ['Marie Ellinghaus (Quinn)'], 'Marie Elizabeth Ellinghaus (Quinn)');
  add(p.aliases, 'Marie Quinn');
  p.birth = '1904';
  p.death = '12 Feb 2001';
  add(p.milestones, 'Married John Joseph Quinn (m. 25 May 1925)');
  note(p, 'CORRECTION: born 1904 and died 12 Feb 2001 in Baltimore (Find a Grave; Quinn Family Tree on Ancestry). Aged 96, matching the family\'s memory that she lived 96 years; the earlier "abt 1901" and "about 1997" were estimates.');
});
edit('quinn_joan', [TREE, WED, OBIT13, FAG(224415296)], p => {
  rename(p, ['Joan Quinn (Stang)'], 'Catherine Joan Quinn (Stang)');
  for (const a of ['Joan Quinn', 'Joan Q. Stang', 'Catherine Joan Stang']) add(p.aliases, a);
  p.birth = '16 Dec 1930';
  p.death = '25 Jan 2018';
  for (const l of ['Baltimore, Maryland', 'Greensboro, North Carolina', 'Easton, Pennsylvania']) add(p.locations, l);
  add(p.milestones, 'Married Bernard J. Stang (m. abt 1952)');
  p.notes = p.notes.filter(t => t !== 'Wife of Bern Stang and mother of Mark Stang (per Brendan Adams). Barbara calls her "my aunt Joan Hogan" in one passage, which may point to an earlier marriage. [Barbara McKeldin Adams, A Memoir, text line 540]');
  note(p, 'Born Catherine Joan Quinn on 16 Dec 1930 in Baltimore; died 25 Jan 2018 at Easton, Pennsylvania, aged 87 (Find a Grave; Quinn Family Tree on Ancestry). Find a Grave places her burial at Gethsemane Cemetery, Easton; the tree gives Hickory, Harford County.');
  p.notes = p.notes.filter(t => !t.startsWith('Her marriage to Bernard J. Stang was announced') || t.includes('Sparta'));
  note(p, 'Her marriage to Bernard J. Stang was announced in the Baltimore Sun on 6 Jan 1952, as Miss Catherine Joan Quinn, daughter of John Quinn. They lived in Greensboro, North Carolina, in 1960, and at Sparta, New Jersey, in 2004. The Quinn tree shows four children, all hidden as living; two are Mark (per Brendan Adams) and John Quinn Stang (named as their grandson Justin\'s father in his 2004 obituary). Her brother John Joseph Quinn Jr.\'s 2013 obituary names her as Catherine Joan Stang.');
  p.notes = p.notes.filter(t => !t.startsWith('Wife of Bern Stang and mother of Mark Stang (per Brendan Adams). Barbara calls her "my aunt Joan Hogan"'));
});
edit('stang_bern', WED, p => {
  rename(p, ['Bern Stang'], 'Bernard J. Stang');
  add(p.aliases, 'Bern Stang');
  add(p.milestones, 'Married Catherine Joan Quinn (m. abt 1952)');
});
edit('quinn_john_jr', [TREE, OBIT13, FAG(208190620)], p => {
  rename(p, ['John Quinn Jr.'], 'John Joseph Quinn Jr.');
  p.birth = '6 May 1934';
  p.death = '14 May 2013';
  add(p.locations, 'Forest Hill, Harford County, Maryland');
  note(p, 'Born 6 May 1934; died 14 May 2013 at Forest Hill, Harford County (Quinn Family Tree on Ancestry; Find a Grave 1934–2013). His obituary appeared in Columbia, Maryland, on 22 May 2013.');
});
edit('quinn_pat', TREE, p => {
  rename(p, ['Pat Quinn'], 'Patricia Marie Quinn (Revty)');
  for (const a of ['Pat Quinn', 'Patricia Revty']) add(p.aliases, a);
  p.birth = '28 Sep 1940';
  p.death = '21 Nov 2009';
  add(p.locations, 'Baltimore, Maryland');
  p.milestones = p.milestones.filter(t => t !== 'Married Walter G. Revty');
  add(p.milestones, 'Married (Unknown) Gilden; later married Walter G. Revty');
  note(p, 'Born 28 Sep 1940 in Baltimore; died 21 Nov 2009 in Baltimore (Quinn Family Tree on Ancestry). Her husband Walter G. Revty (1938–2006) died 19 Dec 2006.');
});
person('revty_walter_g', 'Walter G. Revty', 'M', TREE, p => { p.birth = p.birth || '1938'; p.death = p.death || '19 Dec 2006'; add(p.milestones, 'Married Patricia Marie Quinn'); note(p, 'Husband of Patricia Marie "Pat" Quinn; died 19 Dec 2006 in Baltimore (Quinn Family Tree on Ancestry).'); });
wed('quinn_pat', 'revty_walter_g');
console.log('Quinn/Stang records applied');
