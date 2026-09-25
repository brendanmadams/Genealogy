#!/usr/bin/env node
/**
 * 2026-09-25, evidence on two parentage questions raised by Ed Simons's
 * Ancestry tree (tree 189265374), which names Gertrude Nellie Simons and
 * Charles F. Masters as Raymond Zell Simons's parents, and Roma Eloise
 * Abernathy as Marrion (Hinds) Walker's mother. Neither is proven; these notes
 * record what the records checked so far show. Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const edit = (id, src, fn) => { const p = load(id); p.notes = p.notes || []; p.sources = p.sources || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };

const C1900 = 'Ancestry.com, 1900 United States Federal Census (Covert, Van Buren County, Michigan; ED 138, sheets 12A–12B, dwelling 259)';
const ED = 'Ancestry.com, public member tree of Ed Simons (tree 189265374)';
const MODC = 'Missouri State Archives, Missouri Death Certificates, 1910–1975, certificate 33843 (Roma E. Wilkins, 21 Oct 1935, St. Louis County)';
const C1920 = 'Ancestry.com, 1920 United States Federal Census (St. Louis Ward 13, Missouri; Shenandoah; household of William Abernathy)';

edit('simons_harriet_hattie', C1900, p => {
  note(p, 'In 1900 at Covert, Van Buren County, Michigan, aged 41 (born Dec 1858 in Canada), married 25 years, she was the mother of 6 children, 5 of them living; her father was born in Germany and her mother in Pennsylvania (1900 census). The five living would be Gertrude, Ettie, Lola, Bertha and Raymond.');
});

edit('simons_raymond_zell', [C1900, ED], p => {
  note(p, 'UNPROVEN alternative: Ed Simons\'s Ancestry tree names his parents as Gertrude Nellie Simons (Aaron and Harriet\'s eldest daughter) and Charles F. Masters, citing only another member tree. For it: Gertrude was 18 and unmarried when Raymond was born at South Haven in June 1897; she married Masters, then living at South Haven, on 12 Sep 1898. Against it: the 1900 census lists "Ramond" as Aaron and Harriet\'s son, Harriet reported 6 children born and 5 living (which fits only if Raymond is counted as hers), and his death certificate names Aaron and Hattie as his parents. Not yet checked: the 1897 Van Buren County birth register (FamilySearch, Michigan Births, 1867–1917) and Gertrude\'s own 1900 census entry.');
});

edit('simons_gertrude_nellie', ED, p => {
  note(p, 'UNPROVEN: Ed Simons\'s Ancestry tree makes her the mother of Raymond Zell Simons (born Jun 1897), with Charles F. Masters as his father; the census and his death record call Raymond her brother. Her own answer to the 1900 census question "mother of how many children" would help settle it; she has not yet been found in the 1900 index.');
});

edit('hinds_marrion_roma', [MODC, C1920, ED], p => {
  note(p, 'UNPROVEN alternative: Ed Simons\'s Ancestry tree names her mother as Roma Eloise Abernathy, father unknown, citing only a community tree; her Social Security record and 1937 marriage record name Hershel Hinds and Florence (Goodenough) Hinds. Roma was real: born 27 Jun 1902 at Perryville, Missouri, daughter of William H. Abernathy and Effie Cashion, she was 17 and single at home on Shenandoah Avenue, St. Louis, in January 1920, married John J. Wilkins, and died at Overland, St. Louis County, on 21 Oct 1935 (1920 census; Missouri death certificate 33843). Marrion was born in St. Louis in Nov 1920, and her middle name is Roma, which fits Roma as a birth mother and the Hinds couple as the parents who raised her. Not yet checked: Marrion\'s 1920 St. Louis birth certificate and her Social Security application (SS-5).');
});
console.log('Raymond and Marrion evidence applied');
