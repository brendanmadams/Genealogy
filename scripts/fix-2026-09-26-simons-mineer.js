#!/usr/bin/env node
/**
 * 2026-09-26, Nancy Ann Mineer (Simons), her Mineer and Worley families, and
 * her children with Howard Simons (Steve, Sharon, Lynn, Sandy and Judy), from
 * Ed Simons's Ancestry tree checked against censuses, draft cards, marriage,
 * divorce and death records. Re-runnable.
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

// ---- sources -------------------------------------------------------------
const ED = 'Ancestry.com, public member tree of Ed Simons (tree 189265374)';
const OBIT = 'Obituary of Nancy A. Simons, Tri-City Herald, 20 Nov 2012 (Legacy.com)';
const C1900 = 'FamilySearch, United States Census, 1900 (Magisterial District 6, Lewis County, Kentucky; "Mox" Mineer, b. Oct 1863, m. 1884, with Sarah E. and children Lettie M., Artie J., Nelson H., Mowdie F., George E., Gracie and Andrew T.; ark 1:1:M9HF-GXX; Ancestry roll 538, p. 5, ED 87)';
const C1910N = 'FamilySearch, United States Census, 1910 (Dix Township, Ford County, Illinois; Nelson H. Mineer, 12, b. Kentucky, with his mother Lizzie and siblings Gracie M., G. E., Amos E., Maudie, Robert Q., Andrew T., Littie M., John W. and Lawrence; ark 1:1:MKHC-G11)';
const C1910F = 'FamilySearch, United States Census, 1910 (Kerr Township, Champaign County, Illinois; Francis L. Worley, b. 1907, with parents Cecil O. and Bessie M. Worley; ark 1:1:MKH4-LGV)';
const WW1 = 'Ancestry.com, U.S., World War I Draft Registration Cards, 1917-1918 (Nelson Hobert Mineor, b. 9 Jun 1897 Kentucky, Ford County, Illinois; relative Lizzie Mineer)';
const C1940 = 'FamilySearch, United States Census, 1940 (Urbana Township, Champaign County, Illinois, ED 10-79, sheet 17B; Hobart Mineer, 43, b. Kentucky, with Frances, 32, Lyle, 12, Nancy Ann, 10, Dale, 9, and Marajen, 5, all born Illinois, same house in 1935; ark 1:1:KWWD-H8P)';
const WW2N = 'Ancestry.com, U.S., World War II Draft Cards Young Men, 1940-1947 (Nelson Hobart Mineer, 44, b. 9 Jun 1897 Burtonsville, Kentucky; registered 16 Feb 1942 at Urbana, Champaign County, Illinois; employer Corps of Engineers, Southwestern Proving Ground; next of kin Nancy Ann Mineer; 5 ft 5 in, 135 lb, brown hair and eyes; NARA St. Louis, RG 147, box 1228)';
const MARR47 = 'FamilySearch, Washington, County Marriages, 1855-2008 (Byron D. Simons, 21, and Nancy A. Mineer, 17, of Pekin, Illinois, mother Frances Mineer; licence 7 May 1947, married 10 May 1947, Pasco, Franklin County; arks 1:1:QPMP-D9PZ, QP9M-PX3S, QPMP-JTGC) and Ancestry.com, Washington, U.S., Marriage Records, 1854-2013';
const C1950N = 'FamilySearch, United States Census, 1950 (Richland, Benton County, Washington, ED 3-2; Nelson H. Mineer, 52, b. Illinois [sic], separated, carpenter, maintenance, with Dale A., 17, b. Illinois, and Gerald K., 1; ark 1:1:6X1C-YVP3)';
const C1950F = 'FamilySearch, United States Census, 1950 (Franklin County, Washington; Frances Mineer, 40, b. Illinois, divorced, farmer, head, with Marajan M., 14; ark 1:1:6X1Z-C1WV)';
const C1950S = 'FamilySearch, United States Census, 1950 (Kennewick, Benton County, Washington; Byron D. and Nancy A. Simons with Sharon D. and Steven H.; ark 1:1:6X12-28HQ)';
const MARR50 = 'FamilySearch, Washington, County Marriages, 1855-2008 (Nelson H. Mineer, b. 1897, and Cecil A. Roper; licence 23 Dec 1950, married 31 Dec 1950, Franklin County; arks 1:1:QPM5-RR7L, QPMT-Q6B7)';
const DEATH59 = 'Ancestry.com, Washington, U.S., Death Records, 1883-1960 and Select Death Index, 1907-1960 (Nelson Hobart Mineer, d. 11 Feb 1959 Richland, Benton County; parents Max Mineer and Sarah Elizabeth Dale); FamilySearch, Washington, County Death Registers (ark 1:1:6FJZ-MKJN); Newspapers.com obituary index (residence 1324 Haupt, Richland)';
const FAGN = 'Find a Grave, memorial 11087804 (Nelson Hobart Mineer, 9 Jun 1897 – 11 Feb 1959, Resthaven Cemetery, Richland; parents Maxwell Taylor and Sarah Elizabeth Mineer; spouse Frances Lenora; children Dale A. Mineer, Maragen Maxine Wright, Nancy Ann Simons), via the Ancestry.com Find a Grave index';
const FAGF = 'Find a Grave, memorial 280643628 (Frances Lenora Mineer, née Worley, 16 Jul 1907 Illinois – 10 Mar 1989 Kennewick, Desert Lawn Memorial Park, Kennewick), via the Ancestry.com Find a Grave index';
const DEATH89 = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017 (Frances L. Mineer, abt 1908, d. 10 Mar 1989 Kennewick, resident of Pasco, Franklin County); U.S. Social Security Death Index (16 Jul 1907 – Mar 1989); Newspapers.com obituary index (born Urbana, Illinois)';
const KYD = 'FamilySearch, Kentucky Deaths, 1911-1967 (Maxwell Taylor Mineer, b. 1863, d. 25 Feb 1955 Vanceburg, Lewis County; parents Jesse Mineer and Jane Drake; ark 1:1:NS73-92B) and Find a Grave index (28 Oct 1862 – 25 Feb 1955, Lewis County)';
const LYLE = 'FamilySearch: Washington, World War II Draft Registration Cards (Lyle H. Mineer, b. 1 Jul 1927 Champaign, Illinois, registered 2 Jul 1945 Richland; ark 1:1:QPCR-S2HV); U.S. World War II Army Enlistment Records (enlisted 20 Sep 1945 Spokane); Social Security Death Index (1 Jul 1927 – 20 Feb 2013). Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Lyle H. Mineer, b. 1 Jul 1927, and Dorothy E. Hadsel, 31 Dec 1955, Franklin County; Lyle Hobart Mineer and Linda Sue Gibb, Benton County) and Washington, U.S., Marriage Index, 1969-2017 (24 Sep 1983, Benton County); Washington, U.S., Death Records, 1907-2017 (Lyle H. Mineer, d. 20 Feb 2013, Benton County)';
const DALE = 'FamilySearch: United States Census, 1950 (Dale A. Mineer, 17, b. Illinois, with his father Nelson H., Richland; ark 1:1:6X1C-YVP9); Washington, County Death Registers, 1881-1979 (Dale A. Mineer, b. 1933, d. 10 Aug 1970, Grant County; ark 1:1:6F5M-786L); Social Security Death Index (5 Mar 1933 – Aug 1970, Benton County); BillionGraves index (Resthaven Cemetery, Richland). Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Dale A. Mineer, b. 5 Mar 1933, and M. Carolyn Fultz, 31 Dec 1953, Franklin County; Dale A. Mineer and Arlene I. Deery, licence 17 Sep 1968, married 12 Oct 1968, Franklin County)';
const MARAGEN = 'FamilySearch, United States Census, 1940 (Marajen Mineer, 5, Urbana Township; ark 1:1:KWWD-H8R) and 1950 (Marajan M. Mineer, 14, with her mother Frances, Franklin County, Washington); Ancestry.com, Find a Grave index (Maragen Maxine Wright, 27 Jun 1935 Urbana, Champaign County, Illinois – 2 Sep 2021 Kennewick), Newspapers.com obituary index, public-records indexes (Kennewick; Snohomish 1992–94; Reseda, California 1982) and Washington, U.S., Divorce Records, 1968-2017 (Maragen M. Wright, 11 Jan 1982, Franklin County)';
const HOWD = 'Ancestry.com, Oregon, U.S., Death Index, 1898-2008 (Byron Dan Simons, 47, b. Dec 1925, d. 8 Sep 1973 Union County; spouse Nancy; certificate 73-15406); Washington, U.S., Death Records, 1907-2017 (Byron D. Simons, 8 Sep 1973); U.S., Headstone Applications for Military Veterans, 1861-1985 and Department of Veterans Affairs BIRLS Death File (25 Dec 1925 – 8 Sep 1973); Find a Grave index (born Custer, Whatcom County; died Union County, Oregon)';
const HOWW2 = 'Ancestry.com, U.S., World War II Draft Cards Young Men, 1940-1947 (Byron Daniel Simons, b. 25 Dec 1925 "Auster" [Custer], Washington; residence Pasco, Franklin County; relative Ray Z. Simons)';
const NDEATH = 'Ancestry.com, Washington, U.S., Death Records, 1907-2017 (Nancy A. Simons, abt 1929, d. 17 Nov 2012, Benton County); U.S., Obituary Collection (Nancy A. Simons, born Urbana, Illinois, died 17 Nov 2012 Richland, of Kennewick); Find a Grave index (Nancy Ann Simons, 14 Oct 1929 – 17 Nov 2012)';
const YB46 = 'Ancestry.com, U.S., School Yearbooks, 1900-2016 (Nancy Mineer, Richland, Washington, 1946)';
const PUB = 'Ancestry.com, U.S., Public Records Index, 1950-1993 and U.S., Index to Public Records, 1994-2019';

// ---- Nancy ---------------------------------------------------------------
edit('simons_nancy', [ED, C1940, WW2N, MARR47, C1950S, NDEATH, YB46, FAGN], p => {
  p.name = 'Nancy Ann Mineer (Simons)';
  p.birth = '14 Oct 1929'; p.death = '17 Nov 2012';
  for (const a of ['Nancy A. Simons', 'Nancy Ann Simons', 'Nancy A. Mineer']) add(p.aliases, a);
  for (const l of ['Urbana, Champaign County, Illinois', 'Richland, Benton County, Washington']) add(p.locations, l);
  p.locations = p.locations.filter(l => l !== 'Illinois');
  swapNote(p, /^Wife of Howard/, 'Born 14 Oct 1929 in Illinois, the second of the four children of Nelson Hobart Mineer and Frances Lenora Worley; her obituary and death notices say Urbana, her 1947 marriage record Pekin, and Ed Simons\'s tree "plaria" (Peoria), all Illinois. She was ten in her parents\' household at Urbana Township, Champaign County, in 1940, and was the next of kin her father named when he registered for the draft at Urbana in February 1942 (1940 census; WWII draft card).');
  note(p, 'Her family came to the Tri-Cities in 1943 with the Hanford project; she was at Richland (Columbia) High School in 1946 (yearbook), and on 10 May 1947 at Pasco, aged 17, she married Byron D. "Howard" Simons, 21, the licence naming her mother Frances Mineer (county marriage records; obituary). She and Howard farmed raw land north of Pasco for ten years and moved to Kennewick in 1960; in April 1950 they were at Kennewick with Sharon and Steven (1950 census).');
  note(p, 'She died on 17 Nov 2012 at Richland, of Kennewick, aged 83 (Washington death record; obituary; Find a Grave).');
  add(p.milestones, 'Married Byron D. "Howard" Simons (m. 10 May 1947, Pasco, Franklin County, Washington)');
  p.milestones = p.milestones.filter(m => !/^Married Howard Simons$/.test(m));
});
// ---- Nelson and Frances ---------------------------------------------------
person('mineer_nelson_hobart', 'Nelson Hobart Mineer', 'M', [ED, C1900, C1910N, WW1, C1940, WW2N, C1950N, MARR50, DEATH59, FAGN], p => {
  refine(p, 'birth', '9 Jun 1897'); refine(p, 'death', '11 Feb 1959');
  for (const a of ['Hobart Mineer', 'Mickey Mineer']) add(p.aliases, a);
  for (const l of ['Burtonsville, Lewis County, Kentucky', 'Dix Township, Ford County, Illinois', 'Urbana, Champaign County, Illinois', 'Richland, Benton County, Washington']) add(p.locations, l);
  add(p.career, 'Carpenter, maintenance (1950); employed by the Corps of Engineers at the Southwestern Proving Ground when he registered for the draft in 1942.');
  note(p, 'Born 9 Jun 1897 at Burtonsville, Lewis County, Kentucky, the third of the children of Maxwell Taylor Mineer and Sarah Elizabeth "Lizzie" Dale; in his parents\' household in Magisterial District 6, Lewis County, in 1900 and, aged 12, in his mother\'s at Dix Township, Ford County, Illinois, in 1910; he registered for the WWI draft in Ford County, naming his mother Lizzie (censuses; draft card). Known in the family as Hobart, and as "Mickey" in Ed Simons\'s tree.');
  note(p, 'Married Frances Lenora Worley about 1926 (their son Lyle was born in July 1927); the family was at Urbana Township, Champaign County, in 1940, and he registered for the WWII draft at Urbana on 16 Feb 1942, aged 44, naming his daughter Nancy Ann, not his wife, as next of kin (1940 census; draft card). The family moved to Richland for the Hanford project in 1943 (Nancy\'s obituary).');
  note(p, 'By April 1950 he was separated, a maintenance carpenter at Richland with his son Dale, 17, and a one-year-old Gerald K. Mineer in the house; Frances was divorced and farming in Franklin County. He married Cecil A. Roper in Franklin County on 31 Dec 1950 (1950 census; county marriage record). He died at Richland on 11 Feb 1959, of 1324 Haupt Avenue, and is buried at Resthaven Cemetery, Richland (death record; Find a Grave).');
  add(p.milestones, 'Married Frances Lenora Worley (m. abt 1926, Illinois)');
  add(p.milestones, 'Married Cecil A. Roper (m. 31 Dec 1950, Franklin County, Washington)');
});
person('worley_frances_lenora', 'Frances Lenora Worley (Mineer)', 'F', [ED, C1910F, C1940, C1950F, DEATH89, FAGF], p => {
  refine(p, 'birth', '16 Jul 1907'); refine(p, 'death', '10 Mar 1989');
  for (const a of ['Frances L. Mineer', 'Frances Lenore Worley']) add(p.aliases, a);
  for (const l of ['Kerr Township, Champaign County, Illinois', 'Urbana, Champaign County, Illinois', 'Pasco, Franklin County, Washington', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  add(p.career, 'Farmer, Franklin County, Washington (1950).');
  note(p, 'Born 16 Jul 1907 in Illinois (Urbana, by her obituary), daughter of Cecil Oran Worley and Bessie May Parsons, with whom she was at Kerr Township, Champaign County, in 1910 (census; Social Security index). Married Nelson Hobart Mineer about 1926 and had Lyle, Nancy, Dale and Maragen; at Urbana Township in 1940.');
  note(p, 'Divorced by April 1950, when she was farming in Franklin County, Washington, with her daughter Marajen, 14 (1950 census). She died at Kennewick on 10 Mar 1989, a resident of Pasco, aged 81, and is buried at Desert Lawn Memorial Park, Kennewick (Washington death record; Find a Grave).');
  add(p.milestones, 'Married Nelson Hobart Mineer (m. abt 1926, Illinois)');
});
wed('mineer_nelson_hobart', 'worley_frances_lenora');
child('simons_nancy', 'mineer_nelson_hobart', 'worley_frances_lenora');
person('roper_cecil_a', 'Cecil A. Roper (Mineer)', 'F', [MARR50], p => {
  note(p, 'Second wife of Nelson Hobart Mineer; licence 23 Dec 1950, married 31 Dec 1950, Franklin County, Washington (county marriage record). Nothing else found.');
  add(p.milestones, 'Married Nelson Hobart Mineer (m. 31 Dec 1950, Franklin County, Washington)');
});
wed('mineer_nelson_hobart', 'roper_cecil_a');

// ---- Nancy's siblings -----------------------------------------------------
person('mineer_lyle_hobart', 'Lyle Hobart Mineer', 'M', [ED, C1940, LYLE, OBIT, PUB], p => {
  refine(p, 'birth', '1 Jul 1927'); refine(p, 'death', '20 Feb 2013');
  add(p.aliases, 'Lyle H. Mineer Sr.');
  for (const l of ['Champaign, Illinois', 'Urbana, Champaign County, Illinois', 'Richland, Benton County, Washington', 'Benton City, Benton County, Washington']) add(p.locations, l);
  note(p, 'Nancy\'s elder brother, born 1 Jul 1927 at Champaign, Illinois; twelve at Urbana Township in 1940; registered for the draft at Richland on 2 Jul 1945, the day after his eighteenth birthday, and enlisted in the Army at Spokane on 20 Sep 1945 (census; draft and enlistment records).');
  note(p, 'Married Dorothy E. Hadsel in Franklin County on 31 Dec 1955 (Ed Simons\'s tree calls her Dorothy Elizabeth "Betty" Kenoyer, presumably her maiden name), and later Linda Sue Gibb in Benton County, in 1983 by the state index (county marriage records; marriage index). Lived at Richland and Benton City; "Lyle Mineer of Richland" in his sister\'s 2012 obituary. He died on 20 Feb 2013, aged 85 (Washington death record; Social Security index). His son and grandson carry his name as Lyle H. Mineer Jr. and III.');
  add(p.milestones, 'Married Dorothy E. Hadsel (m. 31 Dec 1955, Franklin County, Washington)');
  add(p.milestones, 'Married Linda Sue Gibb (m. 24 Sep 1983, Benton County, Washington)');
});
person('mineer_dale_a', 'Dale A. Mineer', 'M', [ED, C1940, C1950N, DALE], p => {
  refine(p, 'birth', '5 Mar 1933'); refine(p, 'death', '10 Aug 1970');
  for (const l of ['Urbana, Champaign County, Illinois', 'Richland, Benton County, Washington', 'Grant County, Washington']) add(p.locations, l);
  note(p, 'Nancy\'s younger brother, born 5 Mar 1933 in Illinois; nine at Urbana Township in 1940 and seventeen in his father\'s household at Richland in 1950 (censuses; Social Security index). Married M. Carolyn Fultz in Franklin County on 31 Dec 1953 and Arlene I. Deery there on 12 Oct 1968 (county marriage records). He died on 10 Aug 1970 in Grant County, Washington, aged 37, and is buried at Resthaven Cemetery, Richland (county death register; BillionGraves).');
  add(p.milestones, 'Married M. Carolyn Fultz (m. 31 Dec 1953, Franklin County, Washington)');
  add(p.milestones, 'Married Arlene I. Deery (m. 12 Oct 1968, Franklin County, Washington)');
});
person('mineer_maragen_maxine', 'Maragen Maxine Mineer (Wright)', 'F', [C1940, C1950F, MARAGEN, FAGN], p => {
  refine(p, 'birth', '27 Jun 1935'); refine(p, 'death', '2 Sep 2021');
  for (const a of ['Marajen Mineer', 'Maragen M. Wright']) add(p.aliases, a);
  for (const l of ['Urbana, Champaign County, Illinois', 'Pasco, Franklin County, Washington', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  note(p, 'Nancy\'s younger sister, born 27 Jun 1935 at Urbana, Illinois (spelled Marajen in the censuses); five at Urbana Township in 1940 and fourteen with her divorced mother on the farm in Franklin County in 1950. As Maragen M. Wright she divorced in Franklin County on 11 Jan 1982 and lived at Reseda, California (1982), Snohomish (1992–94) and Kennewick, where she died on 2 Sep 2021, aged 86 (censuses; divorce index; public-records and obituary indexes; Find a Grave). Her husband Wright has not been identified.');
});
for (const s of ['mineer_lyle_hobart', 'mineer_dale_a', 'mineer_maragen_maxine']) child(s, 'mineer_nelson_hobart', 'worley_frances_lenora');

// ---- grandparents ---------------------------------------------------------
person('mineer_maxwell_taylor', 'Maxwell Taylor Mineer', 'M', [ED, C1900, KYD], p => {
  refine(p, 'birth', '28 Oct 1862'); refine(p, 'death', '25 Feb 1955');
  for (const a of ['Max Mineer', 'Mox Mineer']) add(p.aliases, a);
  for (const l of ['Esculapia, Lewis County, Kentucky', 'Vanceburg, Lewis County, Kentucky']) add(p.locations, l);
  note(p, 'Born 28 Oct 1862 in Lewis County, Kentucky (Esculapia, by Ed Simons\'s tree), son of Jesse Mineer and Jane Drake; married Sarah Elizabeth Dale in 1884 and in 1900 was farming in Magisterial District 6, Lewis County, with seven children (1900 census; Kentucky death certificate). By 1910 his wife and children were in Ford County, Illinois, while he is not found with them; he died at Vanceburg, Lewis County, on 25 Feb 1955, aged 92 (census; death record; Find a Grave).');
  add(p.milestones, 'Married Sarah Elizabeth Dale (m. 1884, Kentucky)');
});
person('dale_sarah_elizabeth', 'Sarah Elizabeth Dale (Mineer)', 'F', [ED, C1900, C1910N, DEATH59], p => {
  refine(p, 'birth', '10 Dec 1867'); refine(p, 'death', '10 Jul 1951');
  add(p.aliases, 'Lizzie Mineer');
  for (const l of ['Lewis County, Kentucky', 'Dix Township, Ford County, Illinois']) add(p.locations, l);
  note(p, 'Born 10 Dec 1867 in Lewis County, Kentucky, and married Maxwell Taylor Mineer in 1884; the mother of at least eleven children, seven of them with her in Lewis County in 1900 and nine with her, as Lizzie, at Dix Township, Ford County, Illinois, in 1910 (censuses). Named as Sarah Elizabeth Dale on her son Nelson\'s 1959 death record. Died 10 Jul 1951 (Ed Simons\'s tree). UNPROVEN: the tree gives her parents as George W. Dale (1848–1912, Epworth and Tollesboro, Lewis County) and Mary Frances Swartz (1847–1923, born Carlisle, Nicholas County, died Paxton, Illinois); no record has been checked.');
});
wed('mineer_maxwell_taylor', 'dale_sarah_elizabeth');
child('mineer_nelson_hobart', 'mineer_maxwell_taylor', 'dale_sarah_elizabeth');
person('worley_cecil_oran', 'Cecil Oran Worley', 'M', [ED, C1910F], p => {
  refine(p, 'birth', '23 Jan 1888'); refine(p, 'death', '16 Dec 1943');
  for (const l of ['St. Joseph, Champaign County, Illinois', 'Kerr Township, Champaign County, Illinois', 'Button, Ford County, Illinois']) add(p.locations, l);
  note(p, 'Frances\'s father; at Kerr Township, Champaign County, Illinois, in 1910 with his wife Bessie M. and daughter Francis L. (1910 census). Ed Simons\'s tree gives his birth as 23 Jan 1888 at St. Joseph, Champaign County, and death as 16 Dec 1943 at Button, Ford County, and his parents as Urias Grant Worley (1865–1930, born Tippecanoe, Indiana) and Lenora "Nora" Haley (1867–1940, of Champaign); UNPROVEN beyond the census.');
});
person('parsons_bessie_may', 'Bessie May Parsons (Worley)', 'F', [ED, C1910F], p => {
  refine(p, 'birth', '12 Apr 1887'); refine(p, 'death', '6 May 1974');
  for (const l of ['Monticello, Piatt County, Illinois', 'Kerr Township, Champaign County, Illinois', 'Gibson City, Ford County, Illinois']) add(p.locations, l);
  note(p, 'Frances\'s mother; at Kerr Township, Champaign County, in 1910 as Bessie M. Worley (1910 census). Ed Simons\'s tree gives her birth as 12 Apr 1887 at Monticello, Piatt County, and death as 6 May 1974 at Gibson City, Ford County, Illinois; UNPROVEN beyond the census.');
});
wed('worley_cecil_oran', 'parsons_bessie_may');
child('worley_frances_lenora', 'worley_cecil_oran', 'parsons_bessie_may');

// ---- Howard ---------------------------------------------------------------
edit('simons_howard', [MARR47, C1950S, HOWW2, HOWD], p => {
  p.name = 'Byron Daniel Simons';
  for (const a of ['Howard Simons', 'Byron D. Simons', 'Byron Daniel "Howard" Simons']) add(p.aliases, a);
  for (const l of ['Custer, Whatcom County, Washington', 'Pasco, Franklin County, Washington', 'Union County, Oregon']) add(p.locations, l);
  swapNote(p, /^Died 8 Sep 1973, as Byron D\. Simons/, 'Died 8 Sep 1973, aged 47: the Oregon death index records the death in Union County, Oregon (certificate 73-15406, spouse Nancy), Washington also indexed it, and Ed Simons\'s tree places it at Kennewick; a veteran, with a military headstone (Oregon and Washington death indexes; headstone application; Find a Grave).');
  note(p, 'His WWII draft card and Find a Grave give his birthplace as Custer, Whatcom County, rather than Lynden. Married Nancy Ann Mineer, 17, at Pasco on 10 May 1947 (licence 7 May), and was at Kennewick with her, Sharon and Steven in April 1950 (county marriage record; 1950 census).');
  p.milestones = p.milestones.map(m => m === 'Died Sep 1973' ? 'Died 8 Sep 1973, Union County, Oregon' : m);
  add(p.milestones, 'Married Nancy Ann Mineer (m. 10 May 1947, Pasco, Franklin County, Washington)');
});

// ---- Steve and his family -------------------------------------------------
// (filled in below from the record passes on each child)
// Judy
const JMAR = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Judith A. Simons, 22, born Washington, application 16 Nov 1979, married Steven L. Arbogast 21 Nov 1979, Kennewick; ref. cebenmarcert0014564) and Washington, U.S., Marriage Index, 1969-2017 (Judith A. Arbogast, née Simons, and Jeffrey F. Armatrout, 28 May 1983, Benton County)';
const JDIV = 'Ancestry.com, Washington, U.S., Divorce Records, 1968-2017 (Judith A. Arbogast, née Simons, from Steven L. Arbogast, 11 Dec 1980, Benton County, no children, husband filed; Judith A. Armatrout, née Simons, from Jeffrey F. Armatrout, 30 Aug 2002, Benton County, two children)';
const JPUB = 'Ancestry.com, U.S., Public Records Index, 1950-1993 and U.S., Index to Public Records, 1994-2019 (Judith A. Armatrout / Judith A. Doshier, born 26 Oct 1957: Kennewick 1992–94 and 1997–2018, Columbia, South Carolina 1986–2006, Barto, Pennsylvania, Richland 2019–20; 21804 S. Oak Street, Kennewick, shared with Douglas A. Doshier) and Phone and Address Directories, 1993-2002 (Judith and Jeffrey Armatrout, 4208 S. Neel Court, Kennewick, 1997–2002)';
const JNEWS = 'Ancestry.com, Washington, U.S., Newspapers.com Stories and Events Index (Judy Doshier, Tri-City Herald, 29 Jul 2008)';
const CHAD = 'Ancestry.com, California Birth Index, 1905-1995 (Chad Alan Armatrout, 2 Jul 1984, Santa Barbara County, mother\'s maiden name Simons); Washington, U.S., Marriage Index, 1969-2017 (Chad A. Armatrout and Jana R. Manis, 12 Sep 2010, Benton County); public-records indexes (Kennewick 2005–20)';
const RYAN = 'Ancestry.com, U.S., Public Records Index, 1950-1993 (Ryan Howard Armatrout, born 3 Jun 1986, at 4208 S. Neel Court, Kennewick) and Index to Public Records, 1994-2019 (Kennewick and Richland 2013–20); Washington, U.S., Marriage Index, 1969-2017 (Ryan H. Armatrout and Errika H. McPeak, 19 Mar 2011, Benton County)';
const DOUG = 'Ancestry.com, U.S., Public Records Index, 1950-1993 and Index to Public Records, 1994-2019 (Douglas Alan Doshier, born 19 Apr 1963; West Richland 1993–2006, 21804 S. Oak Street, Kennewick 2004–19, East Wenatchee 2019–20, Pasco 2020); Washington, U.S., Marriage Records, 1854-2013 and Marriage Index (Douglas Alan Doshier and Angela Mae Fisher, 4 Feb 1989, Benton County); Washington, U.S., Divorce Records, 1968-2017 (4 Mar 2004, Benton County, two children)';

edit('simons_judy', [ED, JMAR, JDIV, JPUB, JNEWS, CHAD], p => {
  p.name = 'Judith Ann Simons (Arbogast, Armatrout, Doshier)';
  p.birth = '26 Oct 1957';
  for (const a of ['Judy Simons', 'Judith Doshier', 'Judith A. Armatrout', 'Judith Simons-Armatrout']) add(p.aliases, a);
  for (const l of ['Pasco, Franklin County, Washington', 'Kennewick, Benton County, Washington', 'Columbia, South Carolina', 'Richland, Benton County, Washington']) add(p.locations, l);
  dropNote(p, /^Probably her: Judith A\. Simons married/);
  dropNote(p, /^Lead: Ryan Howard Armatrout/);
  note(p, 'Born 26 Oct 1957 at Pasco, the youngest of Howard and Nancy\'s five children (Ed Simons\'s tree; public-records index). Married Steven Lawrence Arbogast at Kennewick on 21 Nov 1979, aged 22, and divorced him in Benton County on 11 Dec 1980; married Jeffrey F. Armatrout in Benton County on 28 May 1983 and divorced him there on 30 Aug 2002, with two children (county marriage records; state marriage and divorce indexes).');
  note(p, 'With Jeffrey she lived in California (Chad was born in Santa Barbara County in 1984), Columbia, South Carolina, and Kennewick, at 4208 S. Neel Court from the 1990s. By July 2008 she was using the name Doshier, and she shared Douglas A. Doshier\'s Kennewick address; no marriage record has been found, though her mother\'s 2012 obituary calls them Judith and Doug Doshier (public-records and newspaper indexes; obituary).');
  add(p.milestones, 'Married Steven Lawrence Arbogast (m. 21 Nov 1979, Kennewick, Benton County, Washington; div. 11 Dec 1980)');
  add(p.milestones, 'Married Jeffrey F. Armatrout (m. 28 May 1983, Benton County, Washington; div. 30 Aug 2002)');
});
person('arbogast_steven_lawrence', 'Steven Lawrence Arbogast', 'M', [ED, JMAR, JDIV], p => {
  refine(p, 'birth', '15 Jul 1958');
  add(p.locations, 'Kennewick, Benton County, Washington');
  note(p, 'First husband of Judith Ann Simons: married at Kennewick 21 Nov 1979, divorced in Benton County 11 Dec 1980, no children (county marriage record; divorce index). Born 15 Jul 1958 (Ed Simons\'s tree; public-records index).');
  add(p.milestones, 'Married Judith Ann Simons (m. 21 Nov 1979, Kennewick, Benton County, Washington; div. 11 Dec 1980)');
});
person('armatrout_jeffrey_f', 'Jeffrey F. Armatrout', 'M', [ED, JMAR, JDIV, JPUB], p => {
  refine(p, 'birth', '11 Feb 1957');
  for (const l of ['Kennewick, Benton County, Washington', 'Columbia, South Carolina', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  note(p, 'Second husband of Judith Ann Simons: married in Benton County 28 May 1983, divorced there 30 Aug 2002, two children, Chad and Ryan (marriage and divorce indexes). Born 11 Feb 1957; in the 1975 Norfolk, Virginia, yearbook as Jeffrey Fred Armatrout; lived at Barto, Pennsylvania, Madison, Alabama, and Columbia, South Carolina, in the early 1990s, then Kennewick and Pasco; married again in Benton County in 2005 and 2012 (public-records, yearbook and marriage indexes).');
  add(p.milestones, 'Married Judith Ann Simons (m. 28 May 1983, Benton County, Washington; div. 30 Aug 2002)');
});
wed('simons_judy', 'arbogast_steven_lawrence');
wed('simons_judy', 'armatrout_jeffrey_f');
person('armatrout_chad_alan', 'Chad Alan Armatrout', 'M', [CHAD], p => {
  refine(p, 'birth', '2 Jul 1984');
  for (const l of ['Santa Barbara County, California', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  note(p, 'Born 2 Jul 1984 in Santa Barbara County, California, to Jeffrey Armatrout and Judith, née Simons (California birth index); of Kennewick, where he married Jana R. Manis on 12 Sep 2010 (marriage index).');
  add(p.milestones, 'Married Jana R. Manis (m. 12 Sep 2010, Benton County, Washington)');
});
person('armatrout_ryan_howard', 'Ryan Howard Armatrout', 'M', [RYAN, JDIV], p => {
  refine(p, 'birth', '3 Jun 1986');
  for (const l of ['Kennewick, Benton County, Washington', 'Richland, Benton County, Washington']) add(p.locations, l);
  note(p, 'Inferred: born 3 Jun 1986, probably at Columbia, South Carolina, where his parents then lived; the second of Judith and Jeffrey Armatrout\'s two children, listed at his mother\'s Kennewick address and named Howard for her father (public-records index; divorce record). Married Errika H. McPeak in Benton County on 19 Mar 2011 (marriage index).');
  add(p.milestones, 'Married Errika H. McPeak (m. 19 Mar 2011, Benton County, Washington)');
});
child('armatrout_chad_alan', 'armatrout_jeffrey_f', 'simons_judy');
child('armatrout_ryan_howard', 'armatrout_jeffrey_f', 'simons_judy');
edit('doshier_doug', [DOUG, OBIT, JPUB], p => {
  p.name = 'Douglas Alan Doshier';
  p.birth = '19 Apr 1963';
  add(p.aliases, 'Doug Doshier');
  for (const l of ['West Richland, Benton County, Washington', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  swapNote(p, /^Husband of Judith \(Simons\) Doshier/, 'Judith Simons\'s partner, "Doug" in her mother\'s 2012 obituary; born 19 Apr 1963; married Angela Mae Fisher in Benton County on 4 Feb 1989 and divorced her there on 4 Mar 2004, with two children; lived at West Richland and, from 2004, at the Kennewick address Judith also used, then East Wenatchee and Pasco (marriage and divorce indexes; public-records index). No record of a marriage to Judith has been found in the Washington index to 2017.');
  add(p.milestones, 'Married Angela Mae Fisher (m. 4 Feb 1989, Benton County, Washington; div. 4 Mar 2004)');
});
// Judy's DNA-match duplicate: fold it into her record
if (exists('doshier_judith')) {
  edit('simons_judy', ['adams_dna_linkage_v1'], p => {
    note(p, 'DNA: she shares 4.23% with Brendan Adams on 23andMe, a first cousin once removed, and 28.44% with her uncle Glen Simons, which fits.');
  });
  rename('doshier_judith', 'simons_judy');
}
// Lynn
const LPUB = 'Ancestry.com, U.S., Public Records Index, 1950-1993 (Lynn Allen Simons, born 13 May 1953; Vancouver, Washington 1993) and U.S., Index to Public Records, 1994-2019 (La Verne and Walnut, California 1995–2002; 3923 W. 2nd Avenue, Kennewick 2001–20); FamilySearch, United States Public Records (Kennewick 2000–08)';
const LYB = 'Ancestry.com, U.S., School Yearbooks, 1900-2016 (Lynn Simons, Kennewick High School, 1969 and 1970)';
edit('simons_lynn', [ED, LPUB, LYB], p => {
  p.name = 'Lynn Allen Simons';
  p.birth = '13 May 1953';
  add(p.aliases, 'Lynn Simons');
  for (const l of ['Richland, Benton County, Washington', 'Kennewick, Benton County, Washington', 'Vancouver, Clark County, Washington', 'La Verne, Los Angeles County, California']) add(p.locations, l);
  add(p.education, 'Kennewick High School (yearbooks 1969, 1970).');
  note(p, 'Born 13 May 1953 at Richland, the third of Howard and Nancy\'s five children (Ed Simons\'s tree; public-records index). At Kennewick High School in 1969–70; lived at Vancouver, Washington, in 1993 and at La Verne and Walnut, California, from 1995 to 2002, then back at Kennewick, next door to his sister Sandy on W. 2nd Avenue, from 2001 (yearbooks; public-records indexes). No marriage or children found in the Washington indexes.');
});

// Sandy
const SMAR = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Sandra Lee Simons, 23, born Pasco, and Marc George Warner, 25, born Richland; application 22 May 1979, Whatcom County, married 2 Jun 1979, recorded 8 Jun 1979, ref. nwwtcmcv79_416) and Washington, U.S., Marriage Index, 1969-2017 (2 Jun 1979, Benton County); U.S., Newspapers.com Marriage Index (Tri-City Herald, 8 Jul 1979: Sandra Lee Simons and Marc Warner of Bellingham, married 2 Jun 1979, Kennewick; Bellingham Herald, 1 Jun 1979)';
const SPUB = 'Ancestry.com, U.S., Public Records Index, 1950-1993 (Sandra L. Simons, born 6 Dec 1955, 3921 W. 2nd Avenue, Kennewick) and U.S., Index to Public Records, 1994-2019 (Sandra Lee and Marc G. Warner: Vancouver, Washington 1981–2000; Kennewick from 1990)';
const MARCW = 'FamilySearch, United States Public Records, 1970-2009 (Marc George Warner, born 1 Dec 1954; ark 1:1:2M8X-2WC) and United States Obituary Records, 2014-2023 (Bernadine "Bernie" Warner, 2 Jan 1921 – 22 Jan 2021, Kennewick; Tri-City Herald, 27 Jan 2021; survivors include Marc and Sandy Warner)';
edit('simons_sandy', [ED, SMAR, SPUB, OBIT], p => {
  p.name = 'Sandra Lee Simons (Warner)';
  p.birth = '6 Dec 1955';
  add(p.aliases, 'Sandra Lee Warner');
  for (const l of ['Pasco, Franklin County, Washington', 'Kennewick, Benton County, Washington', 'Vancouver, Clark County, Washington']) add(p.locations, l);
  note(p, 'Born 6 Dec 1955 at Pasco, the fourth of Howard and Nancy\'s five children (Ed Simons\'s tree; public-records index). Married Marc George Warner of Bellingham on 2 Jun 1979; the licence was taken out in Whatcom County on 22 May and the Tri-City Herald reported the wedding at Kennewick (county marriage records; marriage index; newspaper index). They lived at Vancouver, Washington, in the 1980s and 1990s and then at Kennewick, where they were in 2012 (public-records indexes; her mother\'s obituary).');
  add(p.milestones, 'Married Marc George Warner (m. 2 Jun 1979, Kennewick, Benton County, Washington)');
});
edit('warner_marc', [SMAR, SPUB, MARCW, OBIT], p => {
  p.name = 'Marc George Warner';
  p.birth = '1 Dec 1954';
  add(p.aliases, 'Marc Warner');
  for (const l of ['Richland, Benton County, Washington', 'Bellingham, Whatcom County, Washington', 'Vancouver, Clark County, Washington', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  swapNote(p, /^Husband of Sandy \(Simons\) Warner/, 'Born 1 Dec 1954 at Richland, son of Keith Warner and Bernadine "Bernie" Warner (1921–2021, of Kennewick); a motel manager at Bellingham when he married Sandra Lee Simons on 2 Jun 1979; of Vancouver, Washington, and then Kennewick (marriage records; public-records index; his mother\'s obituary).');
  add(p.milestones, 'Married Sandra Lee Simons (m. 2 Jun 1979, Kennewick, Benton County, Washington)');
});
// Steve
const SBIRTH = 'Ancestry.com, U.S., Newspapers.com Birth Index, 1800s-2005 (son born to Byron Simons, 24 Oct 1949, Tri-City Herald, 27 Oct 1949)';
const SM68 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Steven Simons, 18, born Richland, and Catherine Oldridge, 18, born Walla Walla, 11 Nov 1949; application 27 Sep 1968, married 4 Oct 1968, Kennewick, recorded Franklin County)';
const SD71 = 'Ancestry.com, Washington, U.S., Divorce Records, 1968-2017 (Steve H. Simons and Catherine A. Simons, née Oldridge, 14 May 1971, Franklin County, one child, wife filed)';
const SM77 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Steve H. Simons, 28, born Richland, and Penny M. Parker; application 23 Dec 1977, married 31 Dec 1977, Kennewick; ref. cebenmarcert0013847) and Washington, U.S., Marriage Index, 1969-2017; U.S., Newspapers.com Marriage Index (Tri-City Herald, 15 Jan 1978: Steve Howard Simons of Kennewick, carpenter, son of Nancy Simons, and Penny Marie Parker of Kennewick, daughter of Ray Parker)';
const SPUBS = 'Ancestry.com, U.S., Public Records Index, 1950-1993 and Index to Public Records, 1994-2019 (Steve H. Simons Sr., born 24 Oct 1949: 704 N. 43rd Way, Pasco, with Penny M. Simons; Issaquah 1987–2005; 4138 E. Sequim Bay Road, Sequim 2004–20)';
const CATH = 'Ancestry.com, U.S., Index to Public Records, 1994-2019 (Catherine A. Carlson, also Catherine A. Dundon, born Nov 1949; Kennewick 1976–97, Pasco 1997–2020) and Public Records Index, 1950-1993 (Catherine Dundon, Pasco)';
const RHON = 'Ancestry.com, U.S., Public Records Index, 1950-1993 (Rhonda J. Dundon, born 2 Feb 1969, Spokane) and Index to Public Records, 1994-2019 (Rhonda Jean Dundon / Rhonda J. Dickens, Spokane 2002–20); Nevada, U.S., Marriage Index, 1956-2005 (Rhonda Jean Dundon and Michael Robert Dickens, 20 Feb 2000, Clark County, book 229, p. D157949); Washington, U.S., Divorce Records, 1968-2017 (Rhonda J. Dickens, née Dundon, and Michael R. Dickens, 23 Nov 2005, Spokane County, two children, wife filed)';
const PENP = 'Ancestry.com, U.S., Public Records Index, 1950-1993 (Penny M. Simons, born 23 Mar 1958, Pasco); U.S., Newspapers.com Obituary Index (Ray V. Parker, born Ogden, Utah, died 5 Mar 2008, Tri-City Herald, 13 Mar 2008: parents John and Ruby Parker, children Ruby Keck and Penny Simons); Washington, U.S., Death Records, 1907-2017 (Ray V. Parker, 77, 5 Mar 2008, Benton County); Washington, U.S., Marriage Records, 1854-2013 (Ray Parker, 24, born 11 Oct 1930, and Iona Mullet, 13 May 1955, Kennewick)';

edit('simons_steve', [ED, SBIRTH, C1950S, SM68, SD71, SM77, SPUBS, OBIT], p => {
  p.name = 'Steven Howard Simons';
  p.birth = '24 Oct 1949';
  for (const a of ['Steve Simons', 'Steve H. Simons Sr.']) add(p.aliases, a);
  for (const l of ['Richland, Benton County, Washington', 'Kennewick, Benton County, Washington', 'Pasco, Franklin County, Washington', 'Issaquah, King County, Washington', 'Sequim, Clallam County, Washington']) add(p.locations, l);
  add(p.career, 'Carpenter (1978).');
  add(p.education, 'Kennewick High School, 1967 (yearbook, Ed Simons\'s tree).');
  note(p, 'Born 24 Oct 1949 at Richland, the second child and elder son of Howard and Nancy; his birth was announced in the Tri-City Herald on 27 Oct 1949, and he was at Kennewick with his parents and sister Sharon in April 1950 (birth index; 1950 census).');
  note(p, 'Married Catherine Ann Oldridge, both 18, at Kennewick on 4 Oct 1968; their daughter Rhonda Jean was born on 2 Feb 1969; Catherine filed for divorce in Franklin County, granted 14 May 1971 (county marriage record; divorce index). Married Penny Marie Parker at Kennewick on 31 Dec 1977, when he was a carpenter of Kennewick; they lived at Pasco, then Issaquah from 1987, and at Sequim from 2004 (marriage records; Tri-City Herald, 15 Jan 1978; public-records indexes).');
  p.milestones = p.milestones.map(m => m === 'Married Penny M. Parker (m. 31 Dec 1977)' ? 'Married Penny Marie Parker (m. 31 Dec 1977, Kennewick, Benton County, Washington)' : m);
  add(p.milestones, 'Married Catherine Ann Oldridge (m. 4 Oct 1968, Kennewick, Benton County, Washington; div. 14 May 1971)');
  add(p.milestones, 'Married Penny Marie Parker (m. 31 Dec 1977, Kennewick, Benton County, Washington)');
});
person('oldridge_catherine_ann', 'Catherine Ann Oldridge (Simons, Dundon, Carlson)', 'F', [ED, SM68, SD71, CATH], p => {
  refine(p, 'birth', '11 Nov 1949');
  for (const a of ['Catherine A. Dundon', 'Catherine A. Carlson', 'Kathy Dundon']) add(p.aliases, a);
  for (const l of ['Walla Walla, Washington', 'Kennewick, Benton County, Washington', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  note(p, 'Born 11 Nov 1949 at Walla Walla; a Kennewick High School student in 1968, when she married Steven Simons at Kennewick on 4 Oct, aged 18; mother of Rhonda Jean, born 1969; divorced 14 May 1971 (marriage record; yearbook; divorce index). She later used the surnames Dundon, by 1976, and Carlson, living at Kennewick and Pasco; the Dundon marriage is not in the Washington indexes (public-records index). Rhonda carried the Dundon name from childhood.');
  add(p.milestones, 'Married Steven Howard Simons (m. 4 Oct 1968, Kennewick, Benton County, Washington; div. 14 May 1971)');
});
wed('simons_steve', 'oldridge_catherine_ann');
// Rhonda: the DNA-match placeholder becomes her record
edit('dundon_rhonda', [ED, SD71, RHON], p => {
  p.name = 'Rhonda Jean Simons (Dundon, Dickens)';
  p.sex = 'F';
  p.birth = '2 Feb 1969';
  delete p.record_type; delete p.priority;
  for (const a of ['Rhonda Dundon', 'Rhonda Jean Dundon', 'Rhonda J. Dickens']) add(p.aliases, a);
  for (const l of ['Kennewick, Benton County, Washington', 'Spokane, Washington']) add(p.locations, l);
  dropNote(p, /^DNA match #6/); dropNote(p, /^CORRECTION 2026-09-22: Marked as a low-priority DNA match/);
  note(p, 'Daughter of Steven Howard Simons and Catherine Ann Oldridge, born 2 Feb 1969 (at Kennewick, by Ed Simons\'s tree), the one child of their marriage; raised under her mother\'s later surname Dundon, which she used until her marriage (divorce index; public-records index). Married Michael Robert Dickens at Las Vegas on 20 Feb 2000 and divorced him in Spokane County on 23 Nov 2005, with two children; of Spokane (Nevada marriage index; Washington divorce index).');
  note(p, 'DNA: she shares 2.67% with Brendan Adams on 23andMe, a second cousin, and 12.47% with her great-uncle Glen Simons, which fits.');
  add(p.milestones, 'Married Michael Robert Dickens (m. 20 Feb 2000, Las Vegas, Clark County, Nevada; div. 23 Nov 2005)');
});
child('dundon_rhonda', 'simons_steve', 'oldridge_catherine_ann');
person('dickens_michael_robert', 'Michael Robert Dickens', 'M', [ED, RHON], p => {
  refine(p, 'birth', '3 Dec 1965');
  add(p.locations, 'Spokane, Washington');
  note(p, 'Married Rhonda Jean Dundon at Las Vegas on 20 Feb 2000; divorced in Spokane County 23 Nov 2005, two children (Nevada marriage index; Washington divorce index). Born 3 Dec 1965; Ed Simons\'s tree names his parents as Robert Freeman Dickens and Tamara Lee McCallum and gives his middle name as Roberts.');
  add(p.milestones, 'Married Rhonda Jean Dundon (m. 20 Feb 2000, Las Vegas, Clark County, Nevada; div. 23 Nov 2005)');
});
wed('dundon_rhonda', 'dickens_michael_robert');
person('dickens_leif_jeann', 'Leif Jeann Dickens', '', [ED], p => {
  refine(p, 'birth', '27 Apr 2001');
  add(p.locations, 'Spokane, Washington');
  note(p, 'Elder child of Michael Dickens and Rhonda Jean Dundon, born 27 Apr 2001 at Spokane (Ed Simons\'s tree; the 2005 divorce index counts two children).');
});
person('dickens_samantha_grace', 'Samantha Grace Dickens', 'F', [ED], p => {
  refine(p, 'birth', '5 Dec 2003');
  add(p.locations, 'Spokane, Washington');
  note(p, 'Younger child of Michael Dickens and Rhonda Jean Dundon, born 5 Dec 2003 at Spokane (Ed Simons\'s tree; the 2005 divorce index counts two children).');
});
for (const k of ['dickens_leif_jeann', 'dickens_samantha_grace']) child(k, 'dickens_michael_robert', 'dundon_rhonda');
edit('simons_penny', [ED, SM77, PENP, SPUBS], p => {
  p.name = 'Penny Marie Parker (Simons)';
  p.birth = '23 Mar 1958';
  add(p.aliases, 'Penny M. Simons');
  for (const l of ['Kennewick, Benton County, Washington', 'Pasco, Franklin County, Washington', 'Issaquah, King County, Washington', 'Sequim, Clallam County, Washington']) add(p.locations, l);
  dropNote(p, /^Born Penny M\. Parker; she married Steve H\. Simons on 31 Dec 1977/);
  swapNote(p, /^Wife of Steve Simons\.$/, 'Born 23 Mar 1958 at Kennewick, daughter of Ray Vivian Parker and Iona Mullet; working at the Persian Palace, Kennewick, when she married Steve Howard Simons there on 31 Dec 1977 (Tri-City Herald, 15 Jan 1978; county marriage record; her father\'s 2008 obituary). With Steve at Pasco, Issaquah and Sequim (public-records indexes).');
  p.milestones = p.milestones.map(m => m === 'Married Steve H. Simons (m. 31 Dec 1977)' ? 'Married Steven Howard Simons (m. 31 Dec 1977, Kennewick, Benton County, Washington)' : m);
});
person('parker_ray_vivian', 'Ray Vivian Parker', 'M', [PENP], p => {
  refine(p, 'birth', '11 Oct 1930'); refine(p, 'death', '5 Mar 2008');
  for (const l of ['Ogden, Weber County, Utah', 'Kennewick, Benton County, Washington']) add(p.locations, l);
  note(p, 'Penny\'s father: born 11 Oct 1930 at Ogden, Utah, son of John and Ruby Parker; married Iona Mullet at Kennewick on 13 May 1955; died 5 Mar 2008 in Benton County, aged 77, survived by daughters Ruby Keck and Penny Simons (marriage record; death record; Tri-City Herald obituary, 13 Mar 2008).');
  add(p.milestones, 'Married Iona Mullet (m. 13 May 1955, Kennewick, Benton County, Washington)');
});
person('mullet_iona', 'Iona Mullet (Parker)', 'F', [PENP], p => {
  add(p.locations, 'Kennewick, Benton County, Washington');
  note(p, 'Married Ray Parker at Kennewick on 13 May 1955 (county marriage record); Inferred: Penny\'s mother, since Penny was born at Kennewick in 1958 and Ray\'s obituary names his wife by a garbled form of her name.');
  add(p.milestones, 'Married Ray Vivian Parker (m. 13 May 1955, Kennewick, Benton County, Washington)');
});
wed('parker_ray_vivian', 'mullet_iona');
child('simons_penny', 'parker_ray_vivian', 'mullet_iona');
// Sharon
const SHYB = 'Ancestry.com, U.S., School Yearbooks, 1900-2016 (Sharon Dee Simons, Kennewick High School, 1963–65; senior, gown committee, 1965)';
const SHM1 = 'Ancestry.com, Idaho, U.S., Marriage Records, 1863-1974 (Sharon Dee Simons and Karl D. Hofman, 22 Mar 1965, Nez Perce County, certificate 2299); U.S., Newspapers.com Marriage Index (Tri-City Herald, 25 Apr 1965: Sharon Simons, daughter of Howard Simons, married Karl Hofman at Lewiston); Washington, U.S., Divorce Records, 1968-2017 (Sharon D. Hofman, née Simons, from Karl D. Hofman, 19 Oct 1970, Clark County, one child, wife filed)';
const SHM2 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Sharon Dee Hofman, 27, born 20 Aug 1947, and Glenn Dean Ezelle, 10 May 1975, licence Franklin County) and Washington, U.S., Marriage Index, 1969-2017 (10 May 1975, Benton County); U.S., Newspapers.com Marriage Index (Tri-City Herald, 13 Apr 1975 engagement: Glenn Ezelle Jr., North Coast Electric, son of Glenn Ezelle and Jerry West; 1 Jun 1975 wedding: Sharon Hofman, daughter of B. H. Simons, of Pendleton, siblings Steve, Lynn and Sandra); U.S., Newspapers.com Birth Index (Glenn Dean Ezelle Jr., born Jul 1951, Encino, Van Nuys News, 9 Aug 1951)';
const SHM3 = 'Ancestry.com, Washington, U.S., Marriage Index, 1969-2017 (Sharon D. Hofman, née Simons, and Jas. G. Harris, 23 Jul 1994, Benton County)';
const SHM4 = 'Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 (Sharon D. Harris, 56, born 20 Aug 1947 Richland, and Alan R. Thompson, born 8 Sep 1947 Astoria, Oregon; application 13 May 2004, Clark County) and Washington, U.S., Marriage Index, 1969-2017 (22 May 2004, Clark County); U.S., Newspapers.com Marriage Index (The Columbian, 15 May 2004: Sharon D. Harris, 56, of Vancouver, and Alan R. Thompson of Camas)';
const SHPUB = 'Ancestry.com, U.S., Public Records Index, 1950-1993 (Sharon Ezelle, born 20 Aug 1947, Pasco; Sharon D. Hofman, Bend and Portland, Oregon, 1993) and U.S., Index to Public Records, 1994-2019 (Sharon D. Thompson, also Ezelle and Harris: Lake Oswego, Oregon 1982–2000; Vancouver 1999–2005; 24407 NE 14th Street, Camas 1991–2020; Alan R. Thompson, Camas 1991–2020)';
edit('simons_sharon', [ED, C1950S, SHYB, SHM1, SHM2, SHM3, SHM4, SHPUB, OBIT], p => {
  p.name = 'Sharon Dee Simons (Hofman, Ezelle, Harris, Thompson)';
  p.birth = '20 Aug 1947';
  for (const a of ['Sharon Hofman', 'Sharon Ezelle', 'Sharon Harris', 'Sharon D. Thompson']) add(p.aliases, a);
  for (const l of ['Richland, Benton County, Washington', 'Kennewick, Benton County, Washington', 'Pasco, Franklin County, Washington', 'Pendleton, Umatilla County, Oregon', 'Lake Oswego, Clackamas County, Oregon', 'Vancouver, Clark County, Washington']) add(p.locations, l);
  add(p.education, 'Kennewick High School, class of 1965 (yearbooks 1963–65).');
  dropNote(p, /^Unconfirmed: Sharon Simons uses the married surname Thompson/);
  dropNote(p, /^Unconfirmed: Sharon, apparently a Simons cousin/);
  dropNote(p, /^Lead: a Sharon L\. Simons married Forrest C\. Gill/);
  note(p, 'Born 20 Aug 1947 at Richland, the eldest of Howard and Nancy\'s five children; two years old with them at Kennewick in April 1950; at Kennewick High School 1963–65 (Ed Simons\'s tree; 1950 census; yearbooks).');
  note(p, 'Married four times: Karl D. Hofman, a Kennewick classmate, at Lewiston, Idaho, on 22 Mar 1965, divorced in Clark County on 19 Oct 1970 with one child; Glenn Dean Ezelle Jr. on 10 May 1975 at Kennewick, when she was living at Pendleton, Oregon; James G. Harris in Benton County on 23 Jul 1994; and Alan R. Thompson, born 8 Sep 1947 at Astoria, Oregon, in Clark County on 22 May 2004 (Idaho and Washington marriage records; divorce index; Tri-City Herald and Columbian notices). She lived at Lake Oswego, Oregon, from 1982 and at Camas, Washington, with Alan Thompson from 2004; "Sharon Thompson (Alan) of Camas" in her mother\'s 2012 obituary (public-records indexes). The Hofman child has not been identified.');
  note(p, 'She corresponded with John and Barbara Adams in 2011–13 as Sharon Thompson, calling Elaine Simons her aunt, and planned to visit Nancy in the Tri-Cities in 2011 [Family research emails, emails 34 and 43].');
  add(p.milestones, 'Married Karl D. Hofman (m. 22 Mar 1965, Lewiston, Nez Perce County, Idaho; div. 19 Oct 1970)');
  add(p.milestones, 'Married Glenn Dean Ezelle Jr. (m. 10 May 1975, Kennewick, Benton County, Washington)');
  add(p.milestones, 'Married James G. Harris (m. 23 Jul 1994, Benton County, Washington)');
  add(p.milestones, 'Married Alan R. Thompson (m. 22 May 2004, Clark County, Washington)');
});
person('hofman_karl_d', 'Karl D. Hofman', 'M', [ED, SHYB, SHM1], p => {
  refine(p, 'birth', 'abt 1947');
  for (const l of ['Kennewick, Benton County, Washington', 'Vancouver, Clark County, Washington']) add(p.locations, l);
  note(p, 'Sharon Simons\'s first husband and Kennewick High School classmate (yearbooks 1963–64); married at Lewiston, Idaho, 22 Mar 1965; divorced in Clark County 19 Oct 1970, one child; later of Vancouver, Washington (Idaho marriage record; divorce index; directories).');
  add(p.milestones, 'Married Sharon Dee Simons (m. 22 Mar 1965, Lewiston, Nez Perce County, Idaho; div. 19 Oct 1970)');
});
person('ezelle_glenn_dean_jr', 'Glenn Dean Ezelle Jr.', 'M', [ED, SHM2], p => {
  refine(p, 'birth', 'Jul 1951');
  for (const l of ['Encino, Los Angeles County, California', 'Pasco, Franklin County, Washington']) add(p.locations, l);
  add(p.career, 'North Coast Electric (1975).');
  note(p, 'Sharon Simons\'s second husband: born July 1951 at Encino, California, son of Glenn Dean Ezelle (1924–1980) and Jerry West; with North Coast Electric when they married at Kennewick on 10 May 1975; of Pasco (birth index; marriage records; Tri-City Herald). No divorce found in the Washington index; she was Sharon Hofman again by 1994.');
  add(p.milestones, 'Married Sharon Dee Simons (m. 10 May 1975, Kennewick, Benton County, Washington)');
});
person('harris_james_g', 'James G. Harris', 'M', [SHM3], p => {
  add(p.locations, 'Benton County, Washington');
  note(p, 'Sharon Simons\'s third husband, "Jas. G. Harris" in the state index; married in Benton County 23 Jul 1994 (marriage index). Not otherwise identified.');
  add(p.milestones, 'Married Sharon Dee Simons (m. 23 Jul 1994, Benton County, Washington)');
});
edit('thompson_alan', [SHM4, SHPUB, OBIT], p => {
  p.name = 'Alan R. Thompson';
  p.birth = '8 Sep 1947';
  add(p.aliases, 'Alan Thompson');
  for (const l of ['Astoria, Clatsop County, Oregon', 'Camas, Clark County, Washington']) add(p.locations, l);
  swapNote(p, /^Husband of Sharon \(Simons\) Thompson/, 'Born 8 Sep 1947 at Astoria, Oregon; of Camas, Washington, from 1991, where he married Sharon D. Harris, née Simons, on 22 May 2004 in Clark County (marriage record; The Columbian, 15 May 2004; public-records index); "Alan" in Nancy Simons\'s 2012 obituary.');
  add(p.milestones, 'Married Sharon Dee Simons (m. 22 May 2004, Clark County, Washington)');
});
for (const h of ['hofman_karl_d', 'ezelle_glenn_dean_jr', 'harris_james_g']) wed('simons_sharon', h);
// sibling order on the parents' records: eldest first
for (const id of ['simons_howard', 'simons_nancy']) edit(id, [], p => { p.relationships.children = ['simons_sharon', 'simons_steve', 'simons_lynn', 'simons_sandy', 'simons_judy']; });

console.log('Simons–Mineer applied');
