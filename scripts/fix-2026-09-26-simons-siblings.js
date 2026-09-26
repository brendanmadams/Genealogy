#!/usr/bin/env node
/**
 * 2026-09-26, Ray and Dradie Simons's other children and their families
 * (Rhea, Elaine, Elmer, Orval) checked against records: censuses, draft cards,
 * Washington and Oregon marriage, divorce and death records, Find a Grave and
 * newspaper indexes. Re-runnable.
 */
'use strict';
const { exists, load, save, note, rename } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); for (const k of ['notes', 'sources', 'locations', 'aliases', 'milestones', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, p => { p.name = name; p.sex = sex; fn(p); }); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim()) || /^[A-Za-z]{3} \d{4}$/.test(String(p[k]).trim())) p[k] = v; };
const child = (kid, father, mother) => { edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; }); for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid)); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };
const swapNote = (p, re, text) => { const i = p.notes.findIndex(n => re.test(n)); if (i >= 0) p.notes[i] = text; else note(p, text); };
const dropNote = (p, re) => { p.notes = p.notes.filter(n => !re.test(n)); };
const setMilestone = (p, re, text) => { const i = p.milestones.findIndex(m => re.test(m)); if (i >= 0) p.milestones[i] = text; else add(p.milestones, text); };

const ED = 'Ancestry.com, public member tree of Ed Simons (tree 189265374)';
const PUB = 'Ancestry.com, U.S., Public Records Index, 1950-1993 and U.S., Index to Public Records, 1994-2019';

// ---- Rhea, the unnamed first child ---------------------------------------
const RHEA = 'FamilySearch, Washington Death Certificates, 1907-1960 (female infant Simons, born 1916, died 19 Sep 1916 at Odessa, Lincoln County; father Ray Simons, mother Dradie Kulp; certificate 113; ark 1:1:N3L5-VXJ); Washington County Death Registers, 1881-1979 (ark 1:1:6F6X-7ZR8); Washington County Birth Registers, 1873-1965 (female Simons, born 19 Sep 1916, parents Ray Simons and Dradie Kulp; ark 1:1:Z1NG-ZZ3Z)';
edit('simons_rhea_dradie', [RHEA], p => {
  p.locations = ['Odessa, Lincoln County, Washington'];
  swapNote(p, /^First child of Ray and Dradie/, 'First child of Ray and Dradie (Kulp) Simons, born and died on 19 Sep 1916 at Odessa, Lincoln County, Washington: the county birth register, county death register and state death certificate (no. 113) all record an unnamed female infant of Ray Simons and Dradie Kulp. The name Rhea Dradie and the Milton birthplace come from family trees (Kulp-Ritchey-Dorsett; Ed Simons), not from the records. She is the second sister who, with Beryl, predeceased Elaine, according to Elaine\'s 2011 obituary.');
  setMilestone(p, /^Born/, 'Born and died 19 Sep 1916, Odessa, Lincoln County, Washington');
});

// ---- Rod --------------------------------------------------------------------
const RODM = 'Ancestry.com, Washington, U.S., Marriage Index, 1969-2017 (Rodney K. Simons and Pamela R. Penny, 29 Aug 1998, King County)';
const RODD = 'Find a Grave, memorial 176738188 (Rodney Keith Simons, 30 Jun 1960 Pasco – 20 Feb 2017 Fort Myers, Florida; Desert Lawn Memorial Park, Kennewick; parents Orvel Keith Simons and Bessie Irene Cantrell), via the Ancestry.com Find a Grave index; U.S., Newspapers.com Obituary Index (The News Tribune, Tacoma, 28 Feb 2017); U.S., Obituary Collection (Legacy.com)';
edit('simons_rodney', [ED, RODM, RODD, PUB], p => {
  p.name = 'Rodney Keith Simons';
  add(p.aliases, 'Rod Simons');
  for (const l of ['Pasco, Franklin County, Washington', 'Tacoma, Washington', 'Boise, Idaho', 'Minneapolis, Minnesota', 'Fort Myers, Florida']) add(p.locations, l);
  swapNote(p, /^Born 30 Jun 1960; grew up/, 'Born 30 Jun 1960 at Pasco; grew up in the Tri-Cities and studied at Washington State University, where he found radio and then sports broadcasting; lived at Tacoma, Boise and, from 2007, Minneapolis. He married Pamela R. Penny in King County on 29 Aug 1998. He died 20 Feb 2017 at Fort Myers, Florida, aged 56; a Rosary was said at Mueller\'s Tri-Cities Funeral Home on 27 Feb and a funeral Mass at St. Patrick\'s, Pasco, on 28 Feb, and he was buried at Desert Lawn Memorial Park, Kennewick, where his grandparents Ray and Dradie Simons lie. Survived by his wife Pam, daughter Annie, mother Irene, sister Janine Bensussen of Richland and brothers Les, of Kent, and Billy (marriage index; Find a Grave; obituary, The News Tribune, 28 Feb 2017; public-records indexes).');
  add(p.milestones, 'Married Pamela R. Penny (m. 29 Aug 1998, King County, Washington)');
});
edit('simons_pamela', [RODM], p => {
  p.name = 'Pamela R. Penny (Simons)';
  add(p.aliases, 'Pam Simons');
  swapNote(p, /^Wife of Rod Simons; her birth surname is not recorded\./, 'Married Rodney Keith Simons in King County, Washington, on 29 Aug 1998 (state marriage index); "Pam" in his 2017 obituary; mother of Anna Bess.');
  add(p.milestones, 'Married Rodney Keith Simons (m. 29 Aug 1998, King County, Washington)');
});

// ---- Billy ------------------------------------------------------------------
const BILLM = 'Ancestry.com, U.S., Newspapers.com Marriage Index (Billy Simons of Pasco and Kimberly Littrell, The Spokesman-Review, 4 Apr 1990); Washington, U.S., Divorce Records, 1968-2017 (Billy M. Simons from Kimberly L. Simons, 23 Aug 1991, Benton County, no children; from Leeann R. Simons, 13 Feb 2003, Benton County, no children); Washington, U.S., Marriage Index, 1969-2017 (Billy M. Simons and Leeann R. Collins, 17 Jun 2000, Benton County; Billy M. Simons and Yvette L. Johnson, 22 Sep 2017, Lincoln County)';
edit('simons_billy', [ED, BILLM, PUB], p => {
  p.name = 'Billy Michael Simons';
  p.birth = '10 Dec 1961';
  add(p.aliases, 'Billie Michael Simons');
  for (const l of ['Pasco, Franklin County, Washington', 'Kennewick, Benton County, Washington', 'West Richland, Benton County, Washington']) add(p.locations, l);
  swapNote(p, /^Billy Michael Simons married LeAnn Robin Collins/, 'Born 10 Dec 1961, the youngest of Orvel and Irene\'s four children. Married Kimberly Littrell about April 1990, while of Pasco, and divorced her in Benton County on 23 Aug 1991; married LeAnn Robin Collins in Benton County on 17 Jun 2000 and divorced her there on 13 Feb 2003; married Yvette Lavon Johnson in Lincoln County on 22 Sep 2017. Both divorce records say no children, so the mother of his daughter Amanda, born in November 1992, is not established by them (Spokesman-Review notice; state marriage and divorce indexes; public-records index). Of West Richland from 2010.');
  setMilestone(p, /Collins/, 'Married LeAnn Robin Collins (m. 17 Jun 2000, Benton County, Washington; div. 13 Feb 2003)');
  setMilestone(p, /Yvette/, 'Married Yvette Lavon Johnson (m. 22 Sep 2017, Lincoln County, Washington)');
  add(p.milestones, 'Married Kimberly Littrell (m. abt Apr 1990; div. 23 Aug 1991, Benton County, Washington)');
});
edit('simons_amanda', [PUB], p => {
  p.birth = 'Nov 1992';
  for (const l of ['West Richland, Benton County, Washington', 'Richland, Benton County, Washington', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  swapNote(p, /^Daughter of Billy and Yvette Simons/, 'Daughter of Billy Simons, born November 1992; granddaughter of Orvel and Irene Simons. Her mother is not established: Billy\'s 1991 and 2003 divorce records list no children, and Yvette, his wife from 2017, is a stepmother (public-records index; divorce records). Of West Richland, Richland and Pasco 2007–20.');
});

// ---- Elaine and the Rineharts ----------------------------------------------
const EB = 'Ancestry.com, Oregon, U.S., State Births, 1842-1924 (Elaine Dereatha Simons, 20 Jan 1918, Milton, Umatilla County)';
const EM35 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Leslie Rinehart, 22, born Lynden, son of John and Amelia Rinehart, and Elaine Simons, born Milton, Oregon; 10 Sep 1935, Skagit County; ref. nwskgmr10557)';
const E1940 = 'Ancestry.com, 1940 United States Federal Census (Kahlotus, Franklin County, Washington, ED 11-6, sheet 3A: Lester Rinehart, 27, farm labourer, with Elaine, 23, Jerry, 3, and Janet Lee, 2)';
const EM91 = 'Ancestry.com, Oregon, U.S., Marriage Indexes, 1906-2009 (William C. Upham and Elaine D. Simonds [Rinehart], 21 Jun 1991, Clackamas County)';
const FAGE = 'Find a Grave, memorial 75368477 (Elaine Simons Rinehart Upham, 20 Jan 1918 – 11 Aug 2011, Desert Lawn Memorial Park, Kennewick), with the Tri-City Herald obituary of 14 Aug 2011';
const LESB = 'Ancestry.com, Washington, U.S., Birth Records, 1907-1920 (Leslie Bernard Rinehart, 27 May 1913, Lynden, Whatcom County; parents John A. Rinehart and Amelia Carlson; certificate 8798)';
const LESW2 = 'Ancestry.com, U.S., World War II Draft Cards Young Men, 1940-1947 (Leslie Bernard Rinehart, 27, registered 16 Oct 1940 at Pasco; employer Washington State Park Committee; 5 ft 11 in, 170 lb, brown hair, blue eyes; next of kin his wife Elaine Doretha Rinehart)';
const LESD = 'Ancestry.com, Oregon, U.S., Death Index, 1898-2008 (Leslie B. Rinehart, born 27 May 1913, died 9 Jul 1988, Clackamas County; spouse Elaine); U.S., Newspapers.com Obituary Index (Tri-City Herald, 12 Jul 1988); Find a Grave, memorial 80541885 (Desert Lawn Memorial Park, Kennewick)';
const UPH = 'Ancestry.com, Oregon, U.S., State Births, 1842-1924 (William Clifford Upham, 8 Jul 1919, Portland); Find a Grave, memorial 171899864 (William Clifford "Bill" Upham, 1919–2016, S/Sgt US Army, River View Cemetery, Portland, section 125, lot 19, grave 4; parents Cecil Henry Upham 1889–1949 and Julia Anne Johnson 1891–1980; wives Marie Maxine Smith 1922–1968, Virginia Beth DuBois Rounds 1922–1988, Elaine Simons Rinehart)';
const JERM = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Jerry A. Rinehart, 21, born 15 Oct 1936, and Claudine P. Johnson, 3 Nov 1957, Pasco); Washington, U.S., Divorce Records, 1968-2017 (12 Sep 1969, Franklin County; and from Linda R. Rinehart, née Wilson, 29 Aug 2005, Franklin County); Idaho, U.S., Marriage Records, 1863-1974 (Jerry A. Rinehart and Linda R. Wilson, 17 Nov 1973, Kootenai County, certificate 00010704); U.S., Newspapers.com Marriage Index (Spokane Daily Chronicle, 20 Nov 1973)';
const JERD = 'Ancestry.com, U.S., Korean War Era Draft Cards, 1948-1959 (Jerry Allen Rinehart, born 15 Oct 1936 Mount Vernon, of Pasco; relative Mrs Elaine Rinehart); Washington, U.S., Death Records, 1907-2017 (Jerry A. Rinehart, 79, Jun 2016, Franklin County); Department of Veterans Affairs BIRLS Death File (15 Oct 1936 – 21 Jun 2016); Find a Grave, memorial 281162175 (Desert Lawn Memorial Park, Kennewick), with the Tri-City Herald obituary of 23 Jun 2016';
const DAVJ = 'FamilySearch, Washington Death Certificates, 1907-1960 (David James Rinehart, infant, died 13 Nov 1958 at Pasco; father Jerry A. Rinehart, mother Claudine P. Johnson; ark 1:1:N31J-HDQ)';
const MARTM = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Martin Allen Rinehart, 27, born Pasco, and Marta Johnston, 27 Jul 1991, Whatcom County; ref. nwwtcmcv91b_166); U.S., Index to Public Records, 1994-2019 (Martin A. Rinehart, born Nov 1963, Everson, Washington 1995–2020)';
const JANM = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Janet Lee Rinehart, 19, born 30 Jun 1938, and Leslie D. Holter, 30 Jun 1957, Pasco); U.S., Newspapers.com Marriage Index (Leslie Duane Holter, son of Neil Holter)';
const DUAN = 'Ancestry.com, U.S., Korean War Era Draft Cards, 1948-1959 (Leslie Duane Holter, born 27 Nov 1937 Algona, North Dakota, of Pasco; relative Neil Holter); U.S., Evangelical Lutheran Church in America Church Records (baptism 5 May 1938, Valley City, North Dakota); public-records indexes (Gladstone, Oregon; Spokane Valley; Sequim 1993–96; Priest River and Coeur d\'Alene, Idaho, 2010–20)';
const JANA = 'Ancestry.com, U.S., School Yearbooks (Jana Holter, Spokane, 1975); Washington, U.S., Marriage Index, 1969-2017 (Jana K. Holter and Ronald C. Marvin, 26 Aug 1978, Spokane); Washington, U.S., Divorce Records, 1968-2017 (Jana K. Marvin from Ronald C. Marvin, 19 Jun 1985, Spokane County); U.S., Index to Public Records, 1994-2019 (Jana K. Holter Wells, born Dec 1958, Oldtown, Priest River and Coeur d\'Alene, Idaho)';
const JEFF = 'Ancestry.com, U.S., Public Records Index, 1950-1993 (Jeffrey Duane Holter, born 21 Feb 1960); Washington, U.S., Marriage Records, 1854-2013 (Jeffrey D. Holter, 39, born Oregon City, and Grace Catherine Wadlington, application 7 Jul 1999, Clallam County) and Marriage Index, 1969-2017 (31 Jul 1999, Clallam County); U.S., Index to Public Records, 1994-2019 (Spokane and Spokane Valley 2005–20)';

edit('simons_elaine_deretha', [ED, EB, EM35, E1940, LESW2, EM91, FAGE], p => {
  p.name = 'Elaine Dereatha Simons (Rinehart, Upham)';
  for (const a of ['Elaine Deretha Simons', 'Elaine Doretha Rinehart', 'Elaine Upham']) add(p.aliases, a);
  p.locations = p.locations.filter(l => !/^Milton, Oregon$|^Washington$|^Whatcom County, Washington$|^Lynden, Washington$/.test(l));
  for (const l of ['Milton (Milton-Freewater), Umatilla County, Oregon', 'Kahlotus, Franklin County, Washington']) add(p.locations, l);
  swapNote(p, /^She married Leslie Bernard Rinehart on 10 Sep 1935/, 'She married Leslie Bernard Rinehart, 22, of Lynden, in Skagit County on 10 Sep 1935, aged 17 (county marriage record). In April 1940 they were on a rented farm at Kahlotus, Franklin County, with Jerry, 3, and Janet Lee, 2 (the same year\'s enumeration near Richland lists them in her father\'s household as well), and in October 1940 Les registered for the draft at Pasco naming her as next of kin. They lived in Pasco for many years and moved to Gladstone, Oregon, in 1958; he died in 1988 (census; draft card; obituary).');
  swapNote(p, /^Born 20 Jan 1918 at Milton, Oregon, and married William Upham/, 'Born 20 Jan 1918 at Milton (now Milton-Freewater), Umatilla County, Oregon (state birth record); married William Clifford Upham in Clackamas County on 21 Jun 1991 (Oregon marriage index); died at home at Gladstone on 11 Aug 2011, aged 93, and was buried beside Les at Desert Lawn Memorial Park, Kennewick, on 19 Aug (obituary; Find a Grave).');
  setMilestone(p, /Married Leslie Bernard/, 'Married Leslie Bernard Rinehart (m. 10 Sep 1935, Skagit County, Washington)');
  setMilestone(p, /Married William Clifford Upham/, 'Married William Clifford Upham (m. 21 Jun 1991, Clackamas County, Oregon)');
  setMilestone(p, /^Born Jan 1918/, 'Born 20 Jan 1918, Milton, Umatilla County, Oregon');
  p.milestones = p.milestones.filter(m => m !== 'Born Milton, Oregon');
});
edit('rhinehart_les', [ED, LESB, EM35, E1940, LESW2, LESD], p => {
  p.name = 'Leslie Bernard Rinehart';
  add(p.aliases, 'Les Rinehart');
  p.locations = p.locations.filter(l => l !== 'Washington');
  for (const l of ['Kahlotus, Franklin County, Washington']) add(p.locations, l);
  add(p.career, 'Farm labourer at Kahlotus (1940); with the Washington State Park Committee when he registered for the draft in October 1940.');
  swapNote(p, /^Born 27 May 1913 in Washington; died 9 Jul 1988/, 'Born 27 May 1913 at Lynden, Whatcom County, son of John A. Rinehart and Amelia Carlson (state birth certificate 8798); married Elaine Simons in Skagit County on 10 Sep 1935; died 9 Jul 1988 at Gladstone, Clackamas County, Oregon, aged 75, and was buried at Desert Lawn Memorial Park, Kennewick (Oregon death index; Tri-City Herald, 12 Jul 1988; Find a Grave). His Find a Grave memorial says he and Elaine had two children, Jerry and Janet (Holter), both living in 1988.');
  dropNote(p, /^Born at Lynden \(Ed Simons's tree\)\.$/);
  dropNote(p, /^Leslie Bernard Rinehart \(1913–1988\), per the Kulp-Ritchey-Dorsett/);
  note(p, '"Le Ley Rinehart", 27, in the 1940 census near Richland, in his father-in-law Ray Simons\'s household with Elaine and the children, and, as Lester, 27, a farm labourer on a rented farm at Kahlotus, Franklin County, in the same census; 5 ft 11 in, brown hair and blue eyes on his draft card (census; WWII draft card).');
  setMilestone(p, /Married Elaine/, 'Married Elaine Dereatha Simons (m. 10 Sep 1935, Skagit County, Washington)');
});
person('rinehart_john_a', 'John A. Rinehart', 'M', [LESB, EM35], p => {
  add(p.locations, 'Lynden, Whatcom County, Washington');
  note(p, 'Father of Leslie Bernard Rinehart, named on his son\'s 1913 birth certificate and 1935 marriage record; of Lynden (state birth record; county marriage record).');
});
person('carlson_amelia', 'Amelia Carlson (Rinehart)', 'F', [LESB, EM35], p => {
  add(p.locations, 'Lynden, Whatcom County, Washington');
  note(p, 'Mother of Leslie Bernard Rinehart, named as Amelia Carlson on his 1913 birth certificate and Amelia Rinehart on his 1935 marriage record (state birth record; county marriage record).');
});
wed('rinehart_john_a', 'carlson_amelia');
child('rhinehart_les', 'rinehart_john_a', 'carlson_amelia');
edit('upham_william', [UPH, EM91], p => {
  for (const l of ['River View Cemetery, Portland, Oregon']) add(p.locations, l);
  add(p.aliases, 'Bill Upham');
  swapNote(p, /^Born 8 Jul 1919 in Portland; died 5 Oct 2016, aged 97\./, 'Born 8 Jul 1919 at Portland, son of Cecil Henry Upham (1889–1949) and Julia Anne Johnson (1891–1980); a staff sergeant in the Army in WWII; married Marie Maxine Smith (1922–1968) in 1948, two daughters, Virginia Beth DuBois Rounds (1922–1988) in 1977, and Elaine Rinehart in Clackamas County on 21 Jun 1991; died 5 Oct 2016, aged 97, and was buried at River View Cemetery, Portland (Oregon birth record; Oregon marriage index; Find a Grave).');
  setMilestone(p, /Married Elaine/, 'Married Elaine (Simons) Rinehart (m. 21 Jun 1991, Clackamas County, Oregon)');
});
edit('rhinehart_jerry', [ED, E1940, JERD, JERM, DAVJ, FAGE], p => {
  for (const l of ['Kahlotus, Franklin County, Washington']) add(p.locations, l);
  add(p.career, 'Diesel mechanic, truck driver and landscape contractor (obituary).');
  swapNote(p, /^Born 15 Oct 1936 at Mount Vernon/, 'Born 15 Oct 1936 at Mount Vernon, Washington; three years old at Kahlotus in 1940; in the Tri-Cities from 1938, and registered for the draft at Pasco in the 1950s naming his mother, Mrs Elaine Rinehart (census; draft card). Married Claudine P. Johnson at Pasco on 3 Nov 1957, aged 21; their infant son David James died at Pasco on 13 Nov 1958, the grandson who predeceased Elaine; divorced in Franklin County on 12 Sep 1969. Married Linda R. Wilson in Kootenai County, Idaho, on 17 Nov 1973, and divorced her in Franklin County on 29 Aug 2005 (marriage and divorce records; death certificate). A retired diesel mechanic, truck driver and landscape contractor, he died at home in Pasco on 21 Jun 2016, aged 79, a veteran, and was buried at Desert Lawn Memorial Park, Kennewick (Washington death record; Tri-City Herald, 23 Jun 2016; Find a Grave).');
  add(p.milestones, 'Married Claudine P. Johnson (m. 3 Nov 1957, Pasco, Franklin County, Washington; div. 12 Sep 1969)');
  add(p.milestones, 'Married Linda R. Wilson (m. 17 Nov 1973, Kootenai County, Idaho; div. 29 Aug 2005)');
});
person('johnson_claudine_p', 'Claudine P. Johnson (Rinehart)', 'F', [JERM, DAVJ], p => {
  add(p.locations, 'Pasco, Franklin County, Washington');
  note(p, 'First wife of Jerry Allen Rinehart: married at Pasco 3 Nov 1957, divorced in Franklin County 12 Sep 1969; mother of David James, who died in infancy in 1958, and probably of Martin (marriage record; divorce index; death certificate).');
  add(p.milestones, 'Married Jerry Allen Rinehart (m. 3 Nov 1957, Pasco, Franklin County, Washington; div. 12 Sep 1969)');
});
person('rinehart_david_james', 'David James Rinehart', 'M', [DAVJ, FAGE], p => {
  refine(p, 'birth', '1958'); refine(p, 'death', '13 Nov 1958');
  add(p.locations, 'Pasco, Franklin County, Washington');
  note(p, 'Infant son of Jerry A. Rinehart and Claudine P. Johnson, died at Pasco on 13 Nov 1958 (Washington death certificate); the grandson who predeceased Elaine, per her 2011 obituary.');
});
edit('rinehart_linda', [JERM], p => {
  p.name = 'Linda R. Wilson (Rinehart)';
  swapNote(p, /^Wife of Jerry Rinehart\./, 'Second wife of Jerry Rinehart: married in Kootenai County, Idaho, on 17 Nov 1973 (Spokane Daily Chronicle, 20 Nov 1973), divorced in Franklin County on 29 Aug 2005 (Idaho marriage record; Washington divorce index); still named as his wife by Irma Zacher in 2011 [Family research emails, email 27].');
  add(p.milestones, 'Married Jerry Allen Rinehart (m. 17 Nov 1973, Kootenai County, Idaho; div. 29 Aug 2005)');
});
wed('rhinehart_jerry', 'johnson_claudine_p');
child('rinehart_david_james', 'rhinehart_jerry', 'johnson_claudine_p');
edit('rinehart_martin', [MARTM, FAGE], p => {
  p.name = 'Martin Allen Rinehart';
  p.birth = 'Nov 1963';
  for (const l of ['Pasco, Franklin County, Washington', 'Everson, Whatcom County, Washington']) add(p.locations, l);
  swapNote(p, /^Grandson of Elaine \(Simons\) Rinehart Upham/, 'Son of Jerry Rinehart, born at Pasco in November 1963, during Jerry\'s marriage to Claudine Johnson, so Inferred: her son; married Marta Johnston in Whatcom County on 27 Jul 1991, aged 27, and has lived at Everson, Whatcom County, since the 1990s (county marriage record; public-records index). The grandson Martin Rinehart of Elaine\'s 2011 obituary.');
  add(p.milestones, 'Married Marta Johnston (m. 27 Jul 1991, Whatcom County, Washington)');
});
child('rinehart_martin', 'rhinehart_jerry', 'johnson_claudine_p');
edit('rhinehart_janet', [ED, E1940, JANM, FAGE], p => {
  p.name = 'Janet Lee Rinehart (Holter)';
  p.birth = '30 Jun 1938';
  for (const a of ['Jan Holter', 'Janet Holter']) add(p.aliases, a);
  for (const l of ['Kahlotus, Franklin County, Washington', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  swapNote(p, /^Daughter of Les and Elaine \(Simons\) Rinehart; "Janet Lee" in the 1940 census\./, 'Daughter of Les and Elaine (Simons) Rinehart, born 30 Jun 1938 (Bellingham, by Ed Simons\'s tree); "Janet Lee", 2, at Kahlotus in 1940; married Leslie Duane Holter at Pasco on her nineteenth birthday, 30 Jun 1957 (census; county marriage record). Mother of Jana and Jeff; of Coeur d\'Alene, Idaho, in later years.');
  add(p.milestones, 'Married Leslie Duane Holter (m. 30 Jun 1957, Pasco, Franklin County, Washington)');
});
edit('holter_duane', [JANM, DUAN], p => {
  p.name = 'Leslie Duane Holter';
  p.birth = '27 Nov 1937';
  add(p.aliases, 'Duane Holter');
  for (const l of ['Algona, North Dakota', 'Pasco, Franklin County, Washington', 'Gladstone, Clackamas County, Oregon', "Coeur d'Alene, Kootenai County, Idaho"]) add(p.locations, l);
  swapNote(p, /^Husband of Janet \(Rinehart\) Holter\./, 'Born 27 Nov 1937 at Algona, North Dakota, son of Neil Holter, and baptised at Valley City on 5 May 1938; of Pasco when he married Janet Lee Rinehart there on 30 Jun 1957; later of Gladstone, Oregon, Spokane Valley, Sequim, Priest River and Coeur d\'Alene, Idaho (draft card; church register; marriage record; public-records indexes). UNPROVEN: a member tree gives his death as 31 May 2022; no record or obituary has been found. [Family research emails, email 27]');
  add(p.milestones, 'Married Janet Lee Rinehart (m. 30 Jun 1957, Pasco, Franklin County, Washington)');
});
edit('holter_jana', [JANA, FAGE], p => {
  p.name = 'Jana K. Holter (Marvin, Wells)';
  p.birth = 'Dec 1958';
  for (const l of ['Spokane, Washington', 'Priest River, Bonner County, Idaho', "Coeur d'Alene, Kootenai County, Idaho"]) add(p.locations, l);
  swapNote(p, /^Grandchild of Elaine \(Simons\) Rinehart Upham/, 'Daughter of Duane and Janet (Rinehart) Holter, born December 1958; at school in Spokane in 1975; married Ronald C. Marvin at Spokane on 26 Aug 1978 and divorced him in Spokane County on 19 Jun 1985; later used the name Wells, living at Oldtown, Priest River and Coeur d\'Alene, Idaho (yearbook; marriage and divorce indexes; public-records index). The granddaughter Jana Holter of Elaine\'s 2011 obituary.');
  add(p.milestones, 'Married Ronald C. Marvin (m. 26 Aug 1978, Spokane, Washington; div. 19 Jun 1985)');
});
edit('holter_jeff', [JEFF, FAGE], p => {
  p.name = 'Jeffrey Duane Holter';
  p.birth = '21 Feb 1960';
  add(p.aliases, 'Jeff Holter');
  for (const l of ['Oregon City, Clackamas County, Oregon', 'Spokane, Washington']) add(p.locations, l);
  swapNote(p, /^Grandchild of Elaine \(Simons\) Rinehart Upham/, 'Son of Duane and Janet (Rinehart) Holter, born 21 Feb 1960 at Oregon City; married Grace Catherine Wadlington in Clallam County on 31 Jul 1999, aged 39; of Spokane and Spokane Valley (marriage records; public-records index). The grandson Jeff Holter of Elaine\'s 2011 obituary.');
  add(p.milestones, 'Married Grace Catherine Wadlington (m. 31 Jul 1999, Clallam County, Washington)');
});
for (const k of ['holter_jana', 'holter_jeff']) child(k, 'holter_duane', 'rhinehart_janet');

// ---- Elmer and his wives ----------------------------------------------------
const ELSSA = 'Ancestry.com, U.S., Social Security Applications and Claims Index, 1936-2007 (Raymond Elmer Simons, born 17 Oct 1921 Blaine, Whatcom County; parents Raymond Z. Simons and Dradie E. Kulp; applied Nov 1940)';
const ELW2 = 'Ancestry.com, U.S., World War II Draft Cards Young Men, 1940-1947 (Raymond Elmer Simons, 20, registered 14 Feb 1942 at Pasco; employer Northern Pacific Railway; 5 ft 10 in, 165 lb, brown hair, blue eyes; next of kin his sister Elaine Rinehart); U.S., World War II Army Enlistment Records, 1938-1946 (enlisted 20 Jul 1944 at Spokane, private, locomotive fireman, four years of high school, service no. 39470405); Department of Veterans Affairs BIRLS Death File (discharged 13 Nov 1946)';
const ELM47 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Raymond E. Simons, 25, born Bellingham, and Wilma Hardy, 23, born Crawford, Nebraska; 30 Aug 1947, Franklin County; ref. CE311-2-0-24); U.S., Newspapers.com Marriage Index (Crawford Tribune, Nebraska, 26 Sep 1947: Mrs Wilma Hardy of Pasco, daughter of Harry L. Jones, married Raymond E. Simons)';
const EL1950 = 'Ancestry.com, 1950 United States Federal Census (Franklin County, Washington, ED 11-7: Raymond E. Simons, 28, railroad fireman, with Wilma, 25, born Nebraska)';
const ELDIV = 'Ancestry.com, Washington, U.S., Divorce Records, 1968-2017 (Raymond E. Simons and Wilma J. Simons, 14 May 1969, Franklin County, two children, wife filed)';
const ELM69 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 and Marriage Index, 1969-2017 (Raymond E. Simons, 48, born 17 Oct 1921, and Bette L. Barton, 10 Nov 1969, Pasco); U.S., Newspapers.com Marriage Index (Tri-City Herald, 16 Nov 1969)';
const ELD = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017 (Raymond Elmer Simons, 72, died 26 Apr 1994 Pasco; certificate 4-08852; parents Ray Z. Simons and Dradie Kulp; spouse Bette L. Jones); U.S., Newspapers.com Obituary Index (Tri-City Herald, 28 Apr 1994); Find a Grave, memorial 73189439 (Desert Lawn Memorial Park, Kennewick, Glendale block 2, lot 88, space 4; veteran)';
const WILB = 'Ancestry.com, Nebraska, U.S., Birth Index, 1912-2004 (Wilma K. Jones, 30 Mar 1924, Dawes County; father Harry Jones; delayed certificate 45150); U.S., Social Security Applications and Claims Index (Wilma Jones, born 30 Mar 1924 Chadron, Nebraska; parents Harry L. Jones and Theresa Blust; named Wilma Jones Sep 1941, Wilma Hardy Feb 1947, Wilma Simons Oct 1948); 1940 United States Federal Census (Wilma Jones, 16, niece of Clyde G. and Martha Shilton, Crawford, Dawes County)';
const WILD = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017 (Wilma K. Simons, also Jones, 65, died 9 Aug 1989 Pasco; certificate 9-22577; born 30 Mar 1924 Nebraska; parents Harry Jones and Theresa Blust; spouse none); U.S. Social Security Death Index (died 10 Aug 1989); U.S., Newspapers.com Obituary Index (Tri-City Herald, 12 Aug 1989); Find a Grave, memorial 8775322 (Wilma K. "Billie" Jones Simons, 30 Mar 1924 – 10 Aug 1989, Desert Lawn Memorial Park, Kennewick, Parkhurst section, "beloved mother and grandmother")';
const BETD = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017 (Beatrice Lee Simons, 73, born 1 Dec 1921 Dayton, Columbia County; parents Henry Jones and Minnie Julian; died 12 Feb 1995 Pasco; certificate 5-02182; spouse Raymond Elmer Simons); U.S., Newspapers.com Obituary Index (Tri-City Herald, 15 Feb 1995: Bette L. Simons, formerly of Tucannon; married Gerard Barton at Walla Walla in 1940; children Jari Ann, James, Gary, Ronnie and Maxine; siblings Doris Brown, Bill and Eugene Jones); Find a Grave, memorial 177413265 (Desert Lawn Memorial Park, Kennewick)';
const CARLM = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 and Marriage Index, 1969-2017 (Carl R. Simons and Patricia A. Sheedy, 26 Mar 1972, Pasco; Carl Simons, 30, born 18 May 1954, and Judith L. Hoey, born 27 Dec 1959, 9 Jun 1984, Pasco); Washington, U.S., Divorce Records, 1968-2017 (Carl R. and Patricia A. Simons, 7 Apr 1975, Franklin County); Ohio, U.S., Birth Index (Judith Hoey, 27 Dec 1957); U.S., Index to Public Records, 1994-2019 (Judith L. Simons, née Hoey, born Dec 1957, Urbana, Ohio 2013–20)';
const DEBR = 'Ancestry.com, U.S., Public Records Index, 1950-1993 and Index to Public Records, 1994-2019 (Debra Sue Simons, also Wooten, born 21 May 1956; Spokane; Pasco 1983–2018); Washington, U.S., Divorce Records, 1968-2017 (Debra S. Wooten, née Simons, from Patrick G. Wooten, 13 Jun 1998, Benton County, no children); U.S., Newspapers.com Obituary Index (Debra Sue Simons, 65, of Kennewick, born Seattle, died 16 Nov 2021; Tri-City Herald, 19 Nov 2021)';

edit('simons_raymond_elmer', [ED, ELSSA, ELW2, ELM47, EL1950, ELDIV, ELM69, ELD], p => {
  add(p.aliases, 'Elmer Simons');
  for (const l of ['Blaine, Whatcom County, Washington', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  add(p.career, 'Northern Pacific Railway: locomotive fireman (1942–50).');
  add(p.milestones, 'Military: enlisted in the Army at Spokane on 20 Jul 1944 as a private; sprained an ankle on a work detail in February 1945; discharged 13 Nov 1946.');
  swapNote(p, /^Married Wilma K\. Hardy on 30 Aug 1947/, 'Married Mrs Wilma K. Hardy, born Jones, of Pasco, in Franklin County on 30 Aug 1947; a railroad fireman in 1950; she divorced him on 14 May 1969, with two children, and on 10 Nov 1969 at Pasco he married Bette L. Barton, born Jones, a widow or divorcee of Tucannon (county marriage records; 1950 census; divorce index; Tri-City Herald, 16 Nov 1969).');
  swapNote(p, /^Born 17 Oct 1921 and died 26 Apr 1994 at Pasco/, 'Born 17 Oct 1921 at Blaine, Whatcom County (Social Security application; his death record and draft card say Bellingham); a Northern Pacific fireman at Pasco when he registered for the draft on 14 Feb 1942, naming his sister Elaine; served in the Army 1944–46. Died 26 Apr 1994 at Pasco, aged 72 (certificate 4-08852), and is buried at Desert Lawn Memorial Park, Kennewick, Glendale block 2 (Social Security index; draft card; enlistment record; Washington death record; Find a Grave).');
  setMilestone(p, /Married Wilma/, 'Married Wilma K. (Jones) Hardy (m. 30 Aug 1947, Franklin County, Washington; div. 14 May 1969)');
  setMilestone(p, /Married Beatrice/, 'Married Beatrice Lee "Bette" (Jones) Barton (m. 10 Nov 1969, Pasco, Franklin County, Washington)');
  p.milestones = p.milestones.filter(m => m !== 'Born 17 Oct 1921, Lynden, Whatcom Co, Washington');
  add(p.milestones, 'Born 17 Oct 1921, Blaine, Whatcom County, Washington');
});
rename('hardy_wilma', 'jones_wilma_k');
edit('jones_wilma_k', [ED, WILB, ELM47, EL1950, ELDIV, WILD], p => {
  p.name = 'Wilma K. Jones (Hardy, Simons)';
  p.birth = '30 Mar 1924'; p.death = '9 Aug 1989';
  for (const a of ['Billie Simons', 'Wilma K. Hardy', 'Wilma Simons']) add(p.aliases, a);
  for (const l of ['Crawford, Dawes County, Nebraska', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  swapNote(p, /^Born 30 Mar 1924 at Chadron, Nebraska; married Elmer Simons/, 'Born 30 Mar 1924 in Dawes County (Chadron), Nebraska, daughter of Harry L. Jones and Theresa Blust; at 16 living with her uncle and aunt Clyde and Martha Shilton at Crawford (birth index; Social Security records; 1940 census). Known as Billie. She was Mrs Hardy by February 1947, a first marriage of which no record has been found, and as Wilma Hardy, 23, married Elmer Simons in Franklin County on 30 Aug 1947. With him she adopted Carl Ray (1954) and Debra Sue (1956); she divorced him on 14 May 1969. Died at Pasco on 9 Aug 1989 (state death certificate 9-22577; the Social Security index and her stone say 10 Aug), aged 65, unmarried, and is buried at Desert Lawn Memorial Park, Kennewick, "beloved mother and grandmother" (marriage record; divorce index; death record; Find a Grave). Carl Ray\'s 2025 obituary names his parents as Wilma and Elmer.');
  setMilestone(p, /Married Raymond Elmer/, 'Married Raymond Elmer Simons (m. 30 Aug 1947, Franklin County, Washington; div. 14 May 1969)');
});
person('jones_harry_l', 'Harry L. Jones', 'M', [WILB, ELM47, WILD], p => {
  add(p.locations, 'Dawes County, Nebraska');
  note(p, 'Father of Wilma K. Jones, named on her delayed Nebraska birth certificate, her Social Security application, the 1947 Crawford Tribune wedding notice and her death record.');
});
person('blust_theresa', 'Theresa Blust (Jones)', 'F', [WILB, WILD], p => {
  add(p.locations, 'Dawes County, Nebraska');
  note(p, 'Mother of Wilma K. Jones, named on her Social Security application and her 1989 death record.');
});
wed('jones_harry_l', 'blust_theresa');
child('jones_wilma_k', 'jones_harry_l', 'blust_theresa');
edit('simons_betty', [ED, ELM69, BETD], p => {
  p.name = 'Beatrice Lee Jones (Barton, Simons)';
  p.birth = '1 Dec 1921'; p.death = '12 Feb 1995';
  for (const a of ['Bette Simons', 'Bette L. Barton']) add(p.aliases, a);
  for (const l of ['Dayton, Columbia County, Washington', 'Tucannon, Columbia County, Washington', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  swapNote(p, /^Beatrice Lee "Bette" Jones \(1921–1995\), earlier Mrs\. Barton/, 'Born 1 Dec 1921 at Dayton, Columbia County, daughter of Henry Jones and Minnie Julian; married Gerard Barton at Walla Walla in 1940 and had Jari Ann, James, Gary, Ronnie and Maxine; formerly of Tucannon. As Bette L. Barton she married Elmer Simons at Pasco on 10 Nov 1969. Died 12 Feb 1995 at Pasco, aged 73, and is buried at Desert Lawn Memorial Park, Kennewick (Washington death record; marriage records; Tri-City Herald, 15 Feb 1995; Find a Grave). Not related to Elmer\'s first wife, Wilma Jones.');
  setMilestone(p, /Married Raymond Elmer/, 'Married Raymond Elmer Simons (m. 10 Nov 1969, Pasco, Franklin County, Washington)');
  add(p.milestones, 'Married Gerard Barton (m. 1940, Walla Walla, Washington)');
});
edit('simons_carl_ray', [ED, CARLM, PUB], p => {
  for (const l of ['Yakima, Washington', 'Pasco, Franklin County, Washington', 'Richland, Benton County, Washington']) add(p.locations, l);
  add(p.education, 'Pasco High School, 1971 (yearbook, Ed Simons\'s tree).');
  note(p, 'Born 18 May 1954 at Yakima, by Ed Simons\'s tree. Probably him: a Carl R. Simons married Patricia Ann Sheedy at Pasco on 26 Mar 1972 (the index mistypes his birth year as 1958) and divorced her in Franklin County on 7 Apr 1975. He married Judith Lynn Hoey, born in Ohio on 27 Dec 1957 (the marriage record says 1959), at Pasco on 9 Jun 1984, aged 30; she is the Judy Simons of his 2025 obituary (county marriage records; divorce index; public-records index).');
  add(p.milestones, 'Married Patricia Ann Sheedy (m. 26 Mar 1972, Pasco, Franklin County, Washington; div. 7 Apr 1975)');
  add(p.milestones, 'Married Judith Lynn Hoey (m. 9 Jun 1984, Pasco, Franklin County, Washington)');
});
person('hoey_judith_lynn', 'Judith Lynn Hoey (Simons)', 'F', [ED, CARLM], p => {
  refine(p, 'birth', '27 Dec 1957');
  add(p.aliases, 'Judy Simons');
  for (const l of ['Ohio', 'Pasco, Franklin County, Washington', 'Urbana, Champaign County, Ohio']) add(p.locations, l);
  note(p, 'Born 27 Dec 1957 in Ohio (Ohio birth index; the 1984 marriage record says 1959); married Carl Ray Simons at Pasco on 9 Jun 1984; mother of Shawn Michael Simons, born 1988 (Ed Simons\'s tree); "his partner Judy Simons" in Carl\'s 2025 obituary; of Urbana, Ohio, 2013–20 (public-records index).');
  add(p.milestones, 'Married Carl Ray Simons (m. 9 Jun 1984, Pasco, Franklin County, Washington)');
});
wed('simons_carl_ray', 'hoey_judith_lynn');
edit('simons_shawn', [ED], p => {
  p.name = 'Shawn Michael Simons'; p.sex = 'M';
  refine(p, 'birth', '1988');
  swapNote(p, /^Child of Carl Ray Simons; grandchild of Elmer Simons\./, 'Son of Carl Ray Simons and Judith Lynn Hoey, born 1988 (Ed Simons\'s tree); grandson of Elmer Simons.');
});
child('simons_shawn', 'simons_carl_ray', 'hoey_judith_lynn');
edit('simons_debra_sue', [ED, DEBR], p => {
  p.name = 'Debra Sue Simons (Wooten)';
  p.birth = '21 May 1956'; p.death = '16 Nov 2021';
  add(p.aliases, 'Debra Wooten');
  for (const l of ['Seattle, Washington', 'Pasco, Franklin County, Washington', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  dropNote(p, /^Probably her: Debra Sue Simons applied to marry Michael D\. Miller/);
  swapNote(p, /^Her brother Carl Ray's 2025 obituary says she died before him\./, 'Born 21 May 1956 at Seattle (Ed Simons\'s tree; public-records index); married Patrick G. Wooten, and divorced him in Benton County on 13 Jun 1998, no children; of Pasco 1983–2018; died 16 Nov 2021, of Kennewick, aged 65 (divorce index; Tri-City Herald, 19 Nov 2021). A Debra Sue Simons applied to marry Michael D. Miller in Benton County on 14 Dec 2001, probably her. Her brother Carl Ray\'s 2025 obituary says she died before him.');
  add(p.milestones, 'Married Patrick G. Wooten (div. 13 Jun 1998, Benton County, Washington)');
});

// ---- Orvel and Irene --------------------------------------------------------
const ORB = 'FamilySearch, Washington County Birth Registers, 1873-1965 (Orval Keith Simons, parents Raymond Zell Simons and Dradie Kulp; ark 1:1:6C3G-GRZM); United States Social Security NUMIDENT (Orvel Keith Simons, born 30 Oct 1929 Blaine, Whatcom County; parents Raymond Z. Simons and Dradie E. Kulp; ark 1:1:6KW1-M6GJ)';
const ORC = 'FamilySearch, United States Census, 1930 (Delta, Whatcom County; ark 1:1:XCQF-YPM), 1940 (Richland precinct, Benton County; ark 1:1:K99X-7R3) and 1950 (Franklin County, with Ray Z., Dradie E. and Glen E. Simons; ark 1:1:6X1C-KCKS)';
const ORM = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Orvel Keith Simons, 22, born 30 Oct 1929, and Bessie Irene Cantrell, 8 Jul 1951, Pasco; Orvel K. Simons and Bessie Irene Simons, application 18 Aug 1969, married 23 Aug 1969, Franklin County); Idaho, U.S., Marriage Records, 1863-1974 (Orvel K. Simons and Norma Albertson, 5 May 1966, Kootenai County, certificate 5808); FamilySearch, Washington Divorce Index, 1969-2014 (from Norma J. Flemmer, 15 Aug 1969, Franklin County, no children; from Bessie I. Cantrell, 8 Feb 1977, Franklin County, two children) and Washington Marriage Index (Orvel K. Simons and Ruth Connor Bates, 12 Mar 1977, Franklin County)';
const ORD = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017 (Orvel Keith Simons, 49, died 21 Jul 1979 Spokane; certificate 16904; parents Ray Z. Simons and Dradie Culp; spouse Ruth Connor; residence Franklin County); FamilySearch, Washington County Death Registers (ark 1:1:6FTY-1BYW); Find a Grave, memorial 73189932 (Desert Lawn Memorial Park, Kennewick, Glendale block 2, lot 82, space 2)';
const IRB = 'FamilySearch, United States Census, 1940 (Bessie I. Cantrell, 7, born Tennessee, with parents Houston B. and Hallie E. Cantrell and sisters Nettie C. and Geneva H., Civil District 21, DeKalb County, Tennessee; ark 1:1:K44G-6PD) and 1950 (Bessie J. Cantrell, born 1933 Tennessee, in the Franklin County, Washington, household of her stepfather Ray Owens and mother Hallie E. Owens, with Nettie C. Cantrell and half-siblings Jackie J., Geneva H., Gloria E. and Ronnie R. Owens; ark 1:1:6X14-ZJYF)';
const IRD = 'Find a Grave, memorial 184321757 (Bessie Irene Cantrell Simons, 4 Nov 1932 Rock Island, Warren County, Tennessee – 10 Oct 2017 Richland; Desert Lawn Memorial Park, Kennewick), with the Tri-City Herald obituary; Ancestry.com, U.S., Newspapers.com Obituary Index (Tri-City Herald, 11 Oct 2017); Find a Grave, memorials 25111955 (Houston Brown Cantrell, 24 Jun 1915 – 24 Sep 1984, Dewberry Baptist Church Cemetery, Murray County, Georgia) and 78570887 (Hallie Evelyn Fleming Freeland, 8 Oct 1915 Tennessee – 21 Sep 1982 Yakima, Tahoma Cemetery)';
const JANB = 'Ancestry.com, U.S., Public Records Index, 1950-1993 (Janine S. Bensussen, born 13 Feb 1953; Kennewick 1985, Westminster, Colorado 1995, Pasco 1996, Denver 1998–2001 with Stanley J., Richland 2002); Washington, U.S., Marriage Records, 1854-2013 (licence 1 Sep 1983, Benton County) and Marriage Index, 1969-2017 (Janine C. Simons and Stanley J. Bensussen, 4 Sep 1983, King County); U.S., Index to Public Records, 1994-2019 (Michael T. Bensussen, born May 1986, and Simon D. Bensussen, born Sep 1989, Richland 2015–20)';
const LESM = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Leslie Orvel Simons, 21, born 2 Mar 1955, and Terri Lee Hickman, 2 May 1976, Pasco; Leslie O. Simons, 33, born Connell, and Lenore Elaine Peha, 16 Jul 1988, King County); Washington, U.S., Divorce Records, 1968-2017 (from Terry L. Simons, 5 Sep 1985, Benton County, no children, husband filed); U.S., Newspapers.com Marriage Index (1976, parent Orvel Simons, of Kennewick); Washington, U.S., Marriage Index, 1969-2017 (Leslie M. Simons and Paul J. Addis, 12 Nov 2016, King County); public-records indexes (Kennewick; Kent 1995; Everett 2020)';

edit('simons_orval_keith', [ED, ORB, ORC, ORM, ORD], p => {
  p.name = 'Orvel Keith Simons';
  for (const a of ['Orval Keith Simons', 'Orvel K. Simons']) add(p.aliases, a);
  p.locations = p.locations.filter(l => !/^Lynden, Whatcom County, Washington$/.test(l));
  for (const l of ['Blaine, Whatcom County, Washington', 'Richland, Benton County, Washington', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  dropNote(p, /^Open question: an Orvel K\. Simons married Ruth E\. Bates/);
  swapNote(p, /^Born 30 Oct 1929 and died 21 Jul 1979 at Spokane/, 'Born 30 Oct 1929 at Blaine, Whatcom County (Social Security record; the county register spells him Orval, every later record Orvel); with his parents at Delta in 1930, near Richland in 1940 and in Franklin County in 1950 (censuses). Married Bessie Irene Cantrell at Pasco on 8 Jul 1951; married Norma Albertson, born Flemmer, in Kootenai County, Idaho, on 5 May 1966 and divorced her in Franklin County on 15 Aug 1969; remarried Irene there on 23 Aug 1969 and was divorced from her, with two children, on 8 Feb 1977; married Ruth Connor Bates in Franklin County on 12 Mar 1977. Died 21 Jul 1979 at Spokane, aged 49, his widow Ruth Connor, and is buried at Desert Lawn Memorial Park, Kennewick, Glendale block 2 (marriage and divorce records; death record; Find a Grave).');
  p.milestones = p.milestones.filter(m => m !== 'Born 30 Oct 1929, Lynden, Whatcom Co, Washington');
  add(p.milestones, 'Born 30 Oct 1929, Blaine, Whatcom County, Washington');
  setMilestone(p, /Married Bessie Irene Cantrell/, 'Married Bessie Irene Cantrell (m. 8 Jul 1951, Pasco, Franklin County, Washington; again 23 Aug 1969; div. 8 Feb 1977)');
  add(p.milestones, 'Married Norma (Flemmer) Albertson (m. 5 May 1966, Kootenai County, Idaho; div. 15 Aug 1969)');
  add(p.milestones, 'Married Ruth (Connor) Bates (m. 12 Mar 1977, Franklin County, Washington)');
});
person('flemmer_norma_jean', 'Norma Jean Flemmer (Albertson, Simons, Knight)', 'F', [ORM, ORD], p => {
  refine(p, 'birth', '1934'); refine(p, 'death', '2022');
  note(p, 'Second wife of Orvel Keith Simons: as Norma Albertson she married him in Kootenai County, Idaho, on 5 May 1966; divorced, as Norma J. Flemmer, in Franklin County on 15 Aug 1969, no children (Idaho marriage record; divorce index). Later Mrs Knight, 1934–2022 (Find a Grave).');
  add(p.milestones, 'Married Orvel Keith Simons (m. 5 May 1966, Kootenai County, Idaho; div. 15 Aug 1969)');
});
person('connor_ruth_e', 'Ruth E. Connor (Bates, Simons)', 'F', [ORM, ORD], p => {
  note(p, 'Fourth wife of Orvel Keith Simons: as Ruth E. Bates she married him in Franklin County on 12 Mar 1977 and was his widow at his death in 1979, when the death record names her Ruth Connor (marriage index; death record).');
  add(p.milestones, 'Married Orvel Keith Simons (m. 12 Mar 1977, Franklin County, Washington)');
});
wed('simons_orval_keith', 'flemmer_norma_jean');
wed('simons_orval_keith', 'connor_ruth_e');
edit('simons_irene', [ED, IRB, ORM, IRD], p => {
  add(p.aliases, 'Irene Simons');
  for (const l of ['DeKalb County, Tennessee', 'Richland, Benton County, Washington']) add(p.locations, l);
  swapNote(p, /^Born Bessie Irene Cantrell on 4 Nov 1932/, 'Born Bessie Irene Cantrell on 4 Nov 1932 at Rock Island, Warren County, Tennessee, the eldest of the three daughters of Houston Brown Cantrell and Hallie Evelyn Fleming; seven years old with them in DeKalb County in 1940; the family moved to Washington in 1942, and in 1950 she was in Franklin County in the household of her mother and stepfather Ray Owens with her sister Nettie and four Owens half-siblings (censuses; obituary). She married her high-school sweetheart Orvel Keith Simons at Pasco on 8 Jul 1951, and again on 23 Aug 1969 after his second marriage; they divorced in 1977, and after his death in 1979 she raised their four children, Janine, Les, Rod and Billy. Known to her grandchildren as "Gam". She died 10 Oct 2017 at Richland, a long-time Pasco resident, aged 84, and is buried at Desert Lawn Memorial Park, Kennewick (marriage and divorce records; Tri-City Herald obituary; Find a Grave).');
  setMilestone(p, /Married Orvel Keith Simons/, 'Married Orvel Keith Simons (m. 8 Jul 1951, Pasco, Franklin County, Washington; again 23 Aug 1969; div. 8 Feb 1977)');
});
person('cantrell_houston_brown', 'Houston Brown Cantrell', 'M', [IRB, IRD], p => {
  refine(p, 'birth', '24 Jun 1915'); refine(p, 'death', '24 Sep 1984');
  for (const l of ['DeKalb County, Tennessee', 'Murray County, Georgia']) add(p.locations, l);
  note(p, 'Irene\'s father, born 24 Jun 1915, son of Henry Ezra Cantrell (1892–1974) and Minnie Lea Roller; married Hallie Fleming about 1931 and was with her and their daughters Bessie, Nettie and Geneva in DeKalb County, Tennessee, in 1940; separated from Hallie by 1950; died 24 Sep 1984 in Murray County, Georgia, and is buried at Dewberry Baptist Church Cemetery there (1940 census; Find a Grave; Georgia death index).');
  add(p.milestones, 'Married Hallie Evelyn Fleming (m. abt 1931, Tennessee)');
});
person('fleming_hallie_evelyn', 'Hallie Evelyn Fleming (Cantrell, Owens, Freeland)', 'F', [IRB, IRD], p => {
  refine(p, 'birth', '8 Oct 1915'); refine(p, 'death', '21 Sep 1982');
  for (const l of ['Tennessee', 'Franklin County, Washington', 'Yakima, Washington']) add(p.locations, l);
  note(p, 'Irene\'s mother, born 8 Oct 1915 in Tennessee, daughter of William Elihue Fleming (1883–1947) and Emma Jane DeLong (1887–1963); wife of Houston Cantrell in 1940, of Ray Owens in Franklin County, Washington, in 1950, with four Owens children, and from 1960 of John Freeland (1911–1983); died 21 Sep 1982 at Yakima and is buried at Tahoma Cemetery there (censuses; Find a Grave).');
  add(p.milestones, 'Married Houston Brown Cantrell (m. abt 1931, Tennessee)');
  add(p.milestones, 'Married Ray Owens (by 1950, Washington)');
  add(p.milestones, 'Married John Freeland (m. 1960)');
});
wed('cantrell_houston_brown', 'fleming_hallie_evelyn');
child('simons_irene', 'cantrell_houston_brown', 'fleming_hallie_evelyn');
edit('simons_janine', [ED, JANB, IRD], p => {
  p.name = 'Janine Christine Simons (Bensussen)';
  p.birth = '13 Feb 1953';
  for (const l of ['Pasco, Franklin County, Washington', 'Kennewick, Benton County, Washington', 'Denver, Colorado', 'Richland, Benton County, Washington']) add(p.locations, l);
  swapNote(p, /^She married Stanley James Bensussen on 4 Sep 1983 in Benton County\./, 'Born 13 Feb 1953 at Pasco (public-records index; Ed Simons\'s tree says 15 Feb), the eldest of Orvel and Irene\'s children. Married Stanley James Bensussen in King County on 4 Sep 1983, on a Benton County licence of 1 Sep; they lived in Colorado in the 1990s and at Richland from 2002 (county marriage record; state index; public-records index). Mother of Michael, born May 1986, and Simon, born September 1989.');
  setMilestone(p, /Married Stanley/, 'Married Stanley James Bensussen (m. 4 Sep 1983, King County, Washington)');
});
edit('stan_husband_of_janine_simons', [JANB], p => { setMilestone(p, /Married Janine/, 'Married Janine Christine Simons (m. 4 Sep 1983, King County, Washington)'); });
edit('bensussen_michael', [JANB], p => { p.name = 'Michael T. Bensussen'; p.birth = 'May 1986'; add(p.locations, 'Richland, Benton County, Washington'); });
edit('bensussen_simon', [JANB], p => { p.name = 'Simon D. Bensussen'; p.birth = 'Sep 1989'; add(p.locations, 'Richland, Benton County, Washington'); });
edit('simons_les', [ED, LESM, IRD], p => {
  p.name = 'Leslie Orvel Simons';
  p.birth = '2 Mar 1955';
  add(p.aliases, 'Les Simons');
  for (const l of ['Connell, Franklin County, Washington', 'Kennewick, Benton County, Washington', 'Everett, Snohomish County, Washington']) add(p.locations, l);
  swapNote(p, /^Leslie Orvel Simons married Terri Lee Hickman/, 'Born 2 Mar 1955 at Connell, Franklin County (Ed Simons\'s tree says 1954; his marriage records and the public-records index say 1955). Married Terri Lee Hickman at Pasco on 2 May 1976, aged 21, and divorced her in Benton County on 5 Sep 1985, no children; married Lenore Elaine Peha in King County on 16 Jul 1988. Of Kent in the 1990s and Everett by 2020; "big brother" Les of Kent in Rod\'s 2017 obituary (county marriage records; divorce index; public-records indexes).');
  setMilestone(p, /Married Terri/, 'Married Terri Lee Hickman (m. 2 May 1976, Pasco, Franklin County, Washington; div. 5 Sep 1985)');
  add(p.milestones, 'Married Lenore Elaine Peha (m. 16 Jul 1988, King County, Washington)');
});
edit('simons_lenore', [LESM], p => {
  p.name = 'Lenore Elaine Peha (Simons)';
  swapNote(p, /^Wife of Les Simons\. Maiden name not recorded\./, 'Married Leslie Orvel Simons in King County on 16 Jul 1988 (county marriage record); mother of Jessica and Leslie.');
  add(p.milestones, 'Married Leslie Orvel Simons (m. 16 Jul 1988, King County, Washington)');
});
edit('simons_leslie', [LESM, IRD], p => {
  p.name = 'Leslie M. Simons (Addis)';
  swapNote(p, /^Daughter of Les and Lenore Simons; married Paul Addis\./, 'Daughter of Les and Lenore Simons; married Paul J. Addis in King County on 12 Nov 2016 (state marriage index; her grandmother Irene\'s 2017 obituary).');
  add(p.milestones, 'Married Paul J. Addis (m. 12 Nov 2016, King County, Washington)');
});
person('hickman_terri_lee', 'Terri Lee Hickman (Simons)', 'F', [LESM], p => {
  note(p, 'First wife of Leslie Orvel Simons: married at Pasco 2 May 1976, divorced in Benton County 5 Sep 1985, no children (county marriage record; divorce index).');
  add(p.milestones, 'Married Leslie Orvel Simons (m. 2 May 1976, Pasco, Franklin County, Washington; div. 5 Sep 1985)');
});
wed('simons_les', 'hickman_terri_lee');

console.log('Simons siblings applied');
