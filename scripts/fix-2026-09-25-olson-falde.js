#!/usr/bin/env node
/**
 * 2026-09-25, Megan (Falde) Adams's family: the Olsons of Humboldt and Palo
 * Alto Counties, Iowa, the Van Gordens and Dick-Peddies of Emmetsburg, the
 * Faldes of Union County, South Dakota, and Hawarden, Iowa, and the Kelleys
 * and Schafers of Hawarden. From FamilySearch records, Find a Grave and the
 * obituaries of Thomas O. Olson (2025), Rosemary (Van Gorden) Olson (2004),
 * Mary (Kelley) Falde Oden (2018) and Roger Falde (1992). Rosemary's maiden
 * name was Van Gorden; Dick-Peddie was her mother's. Re-runnable.
 */
'use strict';
const { exists, load, save, note, rename } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); for (const k of ['notes', 'sources', 'locations', 'aliases', 'milestones', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };
const child = (kid, father, mother) => { edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; }); for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid)); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };

rename('dickpeddie_rosemary', 'vangorden_rosemary');
rename('olson_unknown_father', 'olson_ole_k');

// ── sources ─────────────────────────────────────────────────────────────────
const OB25 = 'Obituary of Thomas O. "Tom" Olson, Albuquerque Journal, 1 Feb 2025 (indexed by GenealogyBank via FamilySearch); Find a Grave, memorial 283628648 (Thomas Orlando Olson, TEC 5 US Army, World War II, Santa Fe National Cemetery, section 18 site 928)';
const OB04 = 'Obituary of Rosemary Emily Van Gorden Olson, Albuquerque Journal, 11 Dec 2004; Find a Grave index (Santa Fe National Cemetery); FamilySearch NUMIDENT (Rosemary Emilie Vangorden, born 5 Apr 1925 Emmetsburg, parents Harry F. Vangorden and Daisy L. Dick Peddie; ark 1:1:6K7Y-SPJ3)';
const OB18 = 'Obituary of Mary (Kelley) Falde Oden, Sioux City Journal, Dec 2018, and Find a Grave, memorial 195276916 (Grace Hill Cemetery, Hawarden, map 3 block 905 lot 4)';
const OB92 = 'Find a Grave, memorial 58761677 (Roger N. Falde, Grace Hill Cemetery, Hawarden, sec 3:905-4), with his 1992 obituary; FamilySearch NUMIDENT (Roger Norman Falde, born 19 Sep 1925 Hawarden, parents Conrad Falde and Gertrude Whalen; SSDI death 21 Sep 1992)';
const IAB = 'FamilySearch, Iowa Births and Stillbirths, 1921-1947 (Thomas Orlando Olsen, 10 Nov 1924, Garfield Township, Kossuth County, parents Thomas Olsen and Clara Rouning; ark 1:1:QPVC-3K39) and ELCA church records, Rutland, Iowa (baptism 21 Dec 1924; confirmation 3 Dec 1939)';
const IAM22 = 'FamilySearch, Iowa County Marriages, 1838-1934 (Thomas Mikal Olson, 27, born Humboldt, and Clara Bertine Rouning, 24, born Brookings County, S.D., Graettinger, Palo Alto County, 31 Mar 1922; his parents Ole K. Nelson and Kristi Nilson Kallestad, hers Andrew O. Rouning and Sarah Wald; ark 1:1:XJKH-SL9)';
const WW1 = 'FamilySearch, United States World War I Draft Registration Cards (Thomas Mikel Olson, born 25 Jun 1894 Humboldt, Kossuth County, ark 1:1:7TCY-F4W2); Veterans Administration Master Index (service from 6 Nov 1918); Iowa World War I Bonus Applications';
const C1950 = 'FamilySearch, United States Census, 1950 (Emmetsburg, Palo Alto County, Iowa; Thomas M. Olsen, 55, born Iowa, with Clara B. and Carroll; ark 1:1:6F3K-RC8N)';
const FAGTM = 'Find a Grave, memorial 97722038 (Thomas Mikel Olson, 25 Jun 1894 – 8 Jun 1991, Union Cemetery, Ottosen, Humboldt County) and 98630699 (Clara B. Ronning Olson, 8 Feb 1898 – 22 Jun 1970)';
const IAM23 = 'FamilySearch, Iowa County Marriages, 1838-1934 (Harry Fletcher Van Gordon, born 1894 Mahaska County, parents Cole R. Van Gordon and Elba Jane Lunt, and Jane Daisy Clara Lockhart Dick-Peddie, born 1894 Emmetsburg, parents William Dick-Peddie and Alice Barber McGrarty, Emmetsburg, 18 Jan 1923; ark 1:1:XJKH-3XK)';
const FAGHV = 'Find a Grave, memorial 76008221 (Harry Fletcher Van Gorden, 25 May 1893 – 9 Mar 1930, Evergreen Cemetery, Emmetsburg)';
const C1900DP = 'FamilySearch, United States Census, 1900 (Emmetsburg Township, Palo Alto County, Iowa; William Dick-Peddie, 41, born Scotland Mar 1859, married 14 years, with Alice B., 40, born Kentucky, and children Rose M., Daisy J. C., William S. and John W.; ark 1:1:M9L7-VQM)';
const IAM19 = 'FamilySearch, Iowa County Marriages, 1838-1934 (Conrad N. Falde and Gertrude Lillian Whalen, born 1900 Beresford, S.D., parents Harvey Whalen and Jessie McAninch, Hawarden, 17 Nov 1919; ark 1:1:XJZN-NX1)';
const C1910F = 'FamilySearch, United States Census, 1910 (Virginia Township, Union County, South Dakota; Minik Falde, 37, born Iowa to Norwegian parents, with Berthine M., 34, Belle D., 12, Conrad N., 10, and his mother Bertha Falde, 71, born Norway; ark 1:1:MPXR-L2Z)';
const FAGF = 'Find a Grave, memorials 126466623 (Conrad N. Falde, 12 Nov 1899 – 15 Jan 1993, Grace Hill Cemetery, Hawarden), 126466658 (Gertrude Lillian Whalen Falde, 8 May 1900 – Jan 1982) and 229300345 (Meinik Falde, 5 Feb 1873 Allamakee County – 27 Feb 1945 Kenmore, Washington, Acacia Memorial Park, Lake Forest Park)';
const FAGK = 'Find a Grave, memorials 127597135 (William Joseph Kelley, 7 Jan 1905 New York – 2 Jun 1955 Hawarden, with obituary) and 43013218 (Lucile Schafer Kelley Schimming, 13 Jan 1907 Akron, Iowa – 5 Mar 1967 Sioux City, with obituary), Grace Hill Cemetery, Hawarden';
const BA = 'Brendan Adams (personal knowledge), 2026';

// ── Umpa ────────────────────────────────────────────────────────────────────
edit('olson_tom_umpa', [OB25, OB04, IAB, C1950], p => {
  p.name = 'Thomas Orlando "Umpa" Olson';
  refine(p, 'death', '17 Jan 2025');
  for (const l of ['Garfield Township, Kossuth County, Iowa', 'Ottosen, Humboldt County, Iowa', 'Rutland, Humboldt County, Iowa', 'Emmetsburg, Palo Alto County, Iowa', 'Albuquerque, New Mexico', 'Aurora, Colorado', 'Santa Fe National Cemetery, Santa Fe, New Mexico']) add(p.locations, l);
  for (const a of ['Tom O. Olson', 'Thomas Orlando Olsen']) add(p.aliases, a);
  add(p.career, 'Technician Fifth Grade, U.S. Army, World War II (combat veteran).');
  add(p.career, 'Attorney in New Mexico, in water law, Native American law and federal contracts, representing Pueblos and Tribes; retired 1990, inactive status thereafter.');
  note(p, 'Born 10 Nov 1924 in Garfield Township, Kossuth County, Iowa (the Ottosen neighbourhood), son of Thomas Mikel Olson and Clara Bertine Ronning; baptised at Rutland on 21 Dec 1924 and confirmed there on 3 Dec 1939 (Iowa birth register; Lutheran church records). Married his high-school sweetheart Rosemary Van Gorden of Emmetsburg (Brendan Adams gives 6 Apr 1945; her 2004 obituary and Find a Grave say 1946).');
  note(p, 'Celebrated his 100th birthday on 10 Nov 2024 with more than a hundred family and friends, and died peacefully at his home in Aurora, Colorado, on 17 Jan 2025 with his children present, "a sound inquisitive mind, a clear memory, a sunny disposition, and a warm, caring heart" to the end; buried at Santa Fe National Cemetery, section 18, site 928, beside Rosemary (Albuquerque Journal, 1 Feb 2025; Find a Grave). His obituary names his children Tom, Kristine Falde and Sigrid, his brother Carroll, grandchildren Brendan Falde, Megan Falde Adams, Nels Olson, Kari Olson Roesgen and Thomas M. "Tommy" Olson, and great-grandchildren Garrett and Owen Adams, Mirabelle Olson and Eddy Roesgen.');
});

// ── Rosemary ────────────────────────────────────────────────────────────────
edit('vangorden_rosemary', [OB04, IAM23, FAGHV], p => {
  p.name = 'Rosemary Emily Van Gorden (Olson)';
  refine(p, 'death', '7 Dec 2004');
  for (const l of ['Emmetsburg, Palo Alto County, Iowa', 'New York City (Manhattan Project)', 'Wright-Patterson Air Base, Dayton, Ohio', 'Albuquerque, New Mexico', 'Santa Fe National Cemetery, Santa Fe, New Mexico']) add(p.locations, l);
  for (const a of ['Rosemary Dick-Peddie', 'Rosemary Emilie Vangorden', 'Rose Mary Van Gorden']) add(p.aliases, a);
  add(p.education, 'University of Iowa and University of Minnesota; wartime degree in electrical engineering.');
  add(p.career, 'Worked on the Manhattan Project in New York City, then on the first jet aircraft at Wright-Patterson Air Base, Dayton, Ohio.');
  note(p, 'Her maiden name was Van Gorden; Dick-Peddie, the name remembered in the family, was her mother\'s. Born 5 Apr 1925 at Emmetsburg, Iowa, daughter of Harry Fletcher Van Gorden and Daisy (Dick-Peddie) Van Gorden (Social Security application; Iowa birth register). Her father died when she was four. Her sister Alice Jane Ellen Van Gorden (Mehling) lived in New York City.');
  note(p, 'Died 7 Dec 2004; a memorial celebration was held at St. Mark\'s on the Mesa Episcopal Church, Albuquerque, on 11 Dec 2004; buried at Santa Fe National Cemetery. Her obituary names her husband Tom, children Thomas W. Olson and wife Bonnie of Santa Fe, Kristine Falde of Thousand Oaks and Sigrid Olson and friend Chris Wood of Albuquerque, grandchildren Brendan Falde, Megan Falde Adams and husband Brendan Adams, Nels, Kari and Thomas M. Olson, great-grandchild Garret Q. Adams, and her sister Alice Mehling (Albuquerque Journal, 11 Dec 2004).');
});
person('vangorden_harry_fletcher', 'Harry Fletcher Van Gorden', 'M', [IAM23, FAGHV, OB04], p => {
  refine(p, 'birth', '25 May 1893'); refine(p, 'death', '9 Mar 1930');
  for (const l of ['New Sharon, Mahaska County, Iowa', 'Emmetsburg, Palo Alto County, Iowa', 'Fort Dodge, Webster County, Iowa', 'Evergreen Cemetery, Emmetsburg']) add(p.locations, l);
  add(p.aliases, 'Harry F. Van Gordon');
  note(p, 'Born 25 May 1893 at New Sharon, Mahaska County, Iowa, son of Cole Rosecrane Van Gorden and Elba Jane Lunt; married Daisy Dick-Peddie at Emmetsburg on 18 Jan 1923; father of Rosemary (1925) and Alice Jane Ellen; died 9 Mar 1930 at Fort Dodge, aged 36, and was buried at Evergreen Cemetery, Emmetsburg (marriage record; Find a Grave, which names his grandparents Philo Fletcher Van Gorden and Emily M. Rosekrans).');
});
person('dickpeddie_daisy', 'Daisy Clara Jane Lockhart Dick-Peddie (Van Gorden)', 'F', [IAM23, C1900DP, FAGHV, OB04], p => {
  refine(p, 'birth', 'Oct 1892'); refine(p, 'death', '1950');
  add(p.locations, 'Emmetsburg, Palo Alto County, Iowa');
  for (const a of ['Daisy L. Dick-Peddie', 'Jane Daisy Clara Lockhart Dick-Peddie']) add(p.aliases, a);
  note(p, 'Born Oct 1892 at Emmetsburg, daughter of William Dick-Peddie, a Scot, and Alice Barber McGroarty (1900 census; Iowa birth register, as Daisy Clara Jane Locket Dick Peddie); married Harry Fletcher Van Gorden on 18 Jan 1923; widowed in 1930 with two small daughters; died 1950 (Find a Grave, via her husband\'s memorial). Her surname is the one the family remembered for Rosemary.');
});
wed('vangorden_harry_fletcher', 'dickpeddie_daisy');
child('vangorden_rosemary', 'vangorden_harry_fletcher', 'dickpeddie_daisy');
person('dickpeddie_william', 'William Dick-Peddie', 'M', [C1900DP, IAM23], p => {
  refine(p, 'birth', 'Mar 1859');
  for (const l of ['Scotland', 'Emmetsburg, Palo Alto County, Iowa']) add(p.locations, l);
  note(p, 'Born Mar 1859 in Scotland to Scottish parents; married Alice B. McGroarty about 1886; in Emmetsburg Township in 1900 with Rose M. (13), Daisy J. C. (8), William S. (4) and John W. (2) (1900 census). The double surname Dick-Peddie is Scottish, best known from the Edinburgh architects.');
});
person('mcgroarty_alice_barber', 'Alice Barber McGroarty (Dick-Peddie)', 'F', [C1900DP, IAM23], p => {
  refine(p, 'birth', 'abt 1860');
  for (const l of ['Kentucky', 'Emmetsburg, Palo Alto County, Iowa']) add(p.locations, l);
  add(p.aliases, 'Alice B. Dick-Peddie');
  note(p, 'Born about 1860 in Kentucky; wife of William Dick-Peddie and mother of Daisy (1900 census; her name from Daisy\'s 1923 marriage record, spelled McGrarty and McGroty in the indexes).');
});
wed('dickpeddie_william', 'mcgroarty_alice_barber');
child('dickpeddie_daisy', 'dickpeddie_william', 'mcgroarty_alice_barber');
person('vangorden_cole_rosecrane', 'Cole Rosecrane Van Gorden', 'M', [IAM23, FAGHV], p => {
  refine(p, 'birth', '1868'); refine(p, 'death', '1940');
  add(p.locations, 'Mahaska County, Iowa');
  add(p.aliases, 'C. R. Van Gorden');
  note(p, 'Father of Harry Fletcher Van Gorden; 1868–1940, son of Philo Fletcher Van Gorden and Emily M. Rosekrans (Find a Grave; UNPROVEN beyond the marriage record that names him).');
});
person('lunt_elba_jane', 'Elba Jane Lunt (Van Gorden)', 'F', [IAM23, FAGHV], p => {
  refine(p, 'birth', '1873');
  note(p, 'Mother of Harry Fletcher Van Gorden, named on his 1923 marriage record; born 1873 and still living in 1958 (Find a Grave; UNPROVEN beyond the marriage record).');
});
wed('vangorden_cole_rosecrane', 'lunt_elba_jane');
child('vangorden_harry_fletcher', 'vangorden_cole_rosecrane', 'lunt_elba_jane');

// ── Umpa's parents and grandparents ─────────────────────────────────────────
edit('olson_thomas_mikkel_elder', [IAM22, WW1, C1950, FAGTM, OB25], p => {
  p.name = 'Thomas Mikel Olson';
  refine(p, 'birth', '25 Jun 1894'); refine(p, 'death', '8 Jun 1991');
  for (const l of ['Humboldt County, Iowa', 'Graettinger, Palo Alto County, Iowa', 'Emmetsburg, Palo Alto County, Iowa', 'Union Cemetery, Ottosen, Humboldt County, Iowa']) add(p.locations, l);
  for (const a of ['Thomas M. Olsen', 'Thomas Mikal Olson']) add(p.aliases, a);
  add(p.career, 'U.S. Army, from 6 Nov 1918 (World War I).');
  note(p, 'Born 25 Jun 1894 in Humboldt County, Iowa, son of Ole K. Olson (Nelson) and Kristi Kallestad, Norwegian immigrants; registered for the draft in Kossuth County in 1917–18 and served from 6 Nov 1918; married Clara Bertine Ronning at Graettinger on 31 Mar 1922; farming in Kossuth County in 1925 and living at Emmetsburg by 1950; died 8 Jun 1991 at Emmetsburg, aged 96, and was buried at Union Cemetery, Ottosen (marriage record; draft and veterans\' records; censuses; Find a Grave).');
});
edit('olson_clara', [IAM22, FAGTM, C1950], p => {
  p.name = 'Clara Bertine Ronning (Olson)';
  refine(p, 'birth', '8 Feb 1898'); refine(p, 'death', '22 Jun 1970');
  for (const l of ['Hendricks, Lincoln County, Minnesota', 'Brookings County, South Dakota', 'Emmetsburg, Palo Alto County, Iowa', 'Union Cemetery, Ottosen, Humboldt County, Iowa']) add(p.locations, l);
  for (const a of ['Clara Rouning', 'Clara B. Olsen']) add(p.aliases, a);
  note(p, 'Born 8 Feb 1898 at Hendricks, Minnesota (Find a Grave; the 1922 marriage record says Brookings County, South Dakota, just across the line), daughter of Andrew O. Ronning and Sigrid "Sarah" Wold; married Thomas Mikel Olson at Graettinger on 31 Mar 1922; died 22 Jun 1970 at Emmetsburg. Her siblings were Jeanette (Monson), Aubrey and Orcella (Ellis), and half-siblings Olai and Ida (Digre).');
});
person('olson_ole_k', 'Ole K. Olson', 'M', [IAM22, FAGTM], p => {
  p.name = 'Ole K. Olson'; p.sex = 'M';
  refine(p, 'birth', '1863'); refine(p, 'death', '1932');
  for (const l of ['Norway', 'Humboldt County, Iowa']) add(p.locations, l);
  add(p.aliases, 'Ole K. Nelson');
  p.notes = p.notes.filter(n => !/^Placeholder for the father/.test(n));
  note(p, 'Father of Thomas Mikel and Nels John Olson. Named Ole K. Nelson on his son\'s 1922 marriage record and Ole K. Olson on Find a Grave, 1863–1932: in the Norwegian way the children took Olson from his given name. Husband of Kristi Kallestad; their children, per Find a Grave, were Ole Andrew (1888–1951), Martha Elisabeth (Lillevik, 1890–1965), Nels John (1892–1978), Thomas Mikel (1894–1991), Bertha Sofia (Kallestad, 1897–1979), Rasmus Martin (1899–1965), Oskar Kristoffer (1904–1919), Klara M. (1906–1993) and Oliva Anetta (Lenz, 1912–1999).');
});
person('kallestad_kristi', 'Kristi Nilsdatter Kallestad (Olson)', 'F', [IAM22, FAGTM], p => {
  refine(p, 'birth', '1865'); refine(p, 'death', '1943');
  for (const l of ['Norway', 'Humboldt County, Iowa']) add(p.locations, l);
  add(p.aliases, 'Kristie Kallestad Olson');
  note(p, 'Mother of Thomas Mikel Olson, named Krist Nilson Kallestad on his 1922 marriage record; 1865–1943 (Find a Grave). Kallestad is a Norwegian farm name.');
});
wed('olson_ole_k', 'kallestad_kristi');
child('olson_thomas_mikkel_elder', 'olson_ole_k', 'kallestad_kristi');
edit('olson_nels_elder', FAGTM, p => { p.name = 'Nels John Olson'; refine(p, 'birth', '1892'); refine(p, 'death', '1978'); add(p.locations, 'Humboldt County, Iowa'); note(p, 'Nels John Olson, 1892–1978, son of Ole K. and Kristi (Kallestad) Olson (Find a Grave).'); });
child('olson_nels_elder', 'olson_ole_k', 'kallestad_kristi');
person('ronning_andrew_o', 'Andrew O. Ronning', 'M', [IAM22, FAGTM], p => {
  refine(p, 'birth', '1865'); refine(p, 'death', '1948');
  for (const l of ['Norway', 'Brookings County, South Dakota', 'Hendricks, Lincoln County, Minnesota']) add(p.locations, l);
  for (const a of ['Andrew O. Rouning', 'Andres O. Ronning']) add(p.aliases, a);
  note(p, 'Father of Clara (Olson); born 1865 in Norway, in Brookings County, Dakota Territory, in 1880 with his parents Ole A. and Elizabeth Ronning; died 1948 (marriage record; 1880 census; Find a Grave).');
});
person('wold_sigrid_sarah', 'Sigrid "Sarah" Wold (Ronning)', 'F', [IAM22, FAGTM], p => {
  refine(p, 'birth', '1877'); refine(p, 'death', '1961');
  add(p.aliases, 'Sarah Wald');
  note(p, 'Mother of Clara (Olson), named Sarah Wald on Clara\'s 1922 marriage record; 1877–1961 (Find a Grave), Andrew Ronning\'s second wife.');
});
wed('ronning_andrew_o', 'wold_sigrid_sarah');
child('olson_clara', 'ronning_andrew_o', 'wold_sigrid_sarah');
edit('olson_carroll', [OB25, FAGTM, C1950], p => { p.name = 'Carroll Ronnie Olson'; refine(p, 'birth', '1933'); refine(p, 'death', '2015'); add(p.locations, 'Emmetsburg, Palo Alto County, Iowa'); note(p, 'Carroll Ronnie Olson, 1933–2015, at home in Emmetsburg in 1950 (Iowa delayed birth record; 1950 census; Find a Grave).'); });

// ── the Faldes ──────────────────────────────────────────────────────────────
edit('falde_roger', [OB92, OB18], p => {
  p.name = 'Roger Norman Falde';
  for (const l of ['Virginia Township, Union County, South Dakota', 'Hawarden, Sioux County, Iowa', 'Grace Hill Cemetery, Hawarden']) add(p.locations, l);
  add(p.aliases, 'Roger N. Falde');
  add(p.career, 'Farmed the family land west of Hawarden for twenty years; ran the "Jolly Rogers" restaurant, 1970–1976; worked at Hass Hillcrest Care Center for his last twelve years.');
  note(p, 'Born 19 Sep 1925, in Virginia Township, Union County, South Dakota, by his obituary, at Hawarden by his Social Security application, son of Conrad N. Falde and Gertrude Whalen; finished high school in 1943; married Mary Kelley (his obituary says 17 Jun 1946, hers 1948); farmed west of Hawarden, lived briefly in California in 1965, then kept the Jolly Rogers restaurant; died 21 Sep 1992 at Hawarden Community Hospital, two days after his 67th birthday, and was buried at Grace Hill Cemetery.');
});
edit('falde_mary', [OB18], p => {
  p.name = 'Mary M. Kelley (Falde, Oden)';
  for (const l of ['Hawarden, Sioux County, Iowa', 'Chatsworth, Sioux County, Iowa', 'Apache Junction, Arizona', 'Grace Hill Cemetery, Hawarden']) add(p.locations, l);
  add(p.aliases, 'Mary Falde Oden');
  add(p.career, 'Taught school at Chatsworth; office manager at West Sioux High School until 1993; kept gift shops, Yei-Bichai\'s and, from 1974, Mary\'s Quilts and More.');
  note(p, 'Born 17 Jun 1927 at Hawarden, the second of the seven children of William Joseph Kelley and Lucile Schafer, and raised at Chatsworth; Hawarden High School 1944; married Roger Falde; the family farmed in South Dakota, moved to California in 1965 and returned to Hawarden a year later. After Roger\'s death she married an old friend, LaMoine "Bugs" Oden, at Sedona, Arizona, on 29 May 1999, and lived at Apache Junction until his death in 2016; returned to Iowa in April 2016 and died at Hawarden on 10 Dec 2018, aged 91 (Sioux City Journal; Find a Grave).');
});
edit('oden_bugs', OB18, p => { p.name = 'LaMoine Frank "Bugs" Oden'; add(p.locations, 'Apache Junction, Arizona'); note(p, 'LaMoine Frank Oden, 1925–2016; married Mary (Kelley) Falde at Sedona on 29 May 1999 (Find a Grave, memorial 190745116).'); });
person('falde_conrad', 'Conrad N. Falde', 'M', [IAM19, C1910F, FAGF, OB92], p => {
  refine(p, 'birth', '12 Nov 1899'); refine(p, 'death', '15 Jan 1993');
  for (const l of ['Virginia Township, Union County, South Dakota', 'Hawarden, Sioux County, Iowa', 'Grace Hill Cemetery, Hawarden']) add(p.locations, l);
  note(p, 'Born 12 Nov 1899 in South Dakota, son of Meinik Falde and Berthine Engebretson; at school in Virginia Township, Union County, in 1913–14; married Gertrude Lillian Whalen at Hawarden on 17 Nov 1919; farming in Virginia Township in 1930 and 1940 with Gertrude and Roger; died 15 Jan 1993 at Hawarden and was buried at Grace Hill (marriage record; censuses; SSDI; Find a Grave). His sister was Belle Delia Falde (Thompson, 1897–1970).');
});
person('whalen_gertrude_lillian', 'Gertrude Lillian Whalen (Falde)', 'F', [IAM19, FAGF, OB92], p => {
  refine(p, 'birth', '8 May 1900'); refine(p, 'death', 'Jan 1982');
  for (const l of ['Beresford, Union County, South Dakota', 'Hawarden, Sioux County, Iowa', 'Grace Hill Cemetery, Hawarden']) add(p.locations, l);
  note(p, 'Born 8 May 1900 at Beresford, South Dakota, daughter of Harley (Harvey) Andrew Whalen and Jessie McAninch; married Conrad Falde at Hawarden on 17 Nov 1919; died Jan 1982 at Hawarden (marriage record; SSDI; Find a Grave).');
});
wed('falde_conrad', 'whalen_gertrude_lillian');
child('falde_roger', 'falde_conrad', 'whalen_gertrude_lillian');
person('falde_meinik', 'Meinik Falde', 'M', [C1910F, FAGF], p => {
  refine(p, 'birth', '5 Feb 1873'); refine(p, 'death', '27 Feb 1945');
  for (const l of ['Allamakee County, Iowa', 'Virginia Township, Union County, South Dakota', 'Kenmore, King County, Washington', 'Acacia Memorial Park, Lake Forest Park, Washington']) add(p.locations, l);
  add(p.aliases, 'Minik Falde');
  note(p, 'Born 5 Feb 1873 in Allamakee County, Iowa, son of Nels Falde (1833–1890) and Berthe Johnson (born 1839), both from Norway; a farmer in Virginia Township, Union County, South Dakota, where his widowed mother, 71, lived with him in 1910; died 27 Feb 1945 at Kenmore, Washington, and was buried at Acacia Memorial Park, Lake Forest Park (1910 census; Find a Grave, which names his brothers Johan, 1859–1913, and Cornelius, 1866–1941).');
});
person('engebretson_berthine_marie', 'Berthine Marie Engebretson (Falde)', 'F', [C1910F, FAGF], p => {
  refine(p, 'birth', '1875'); refine(p, 'death', '1955');
  add(p.locations, 'Virginia Township, Union County, South Dakota');
  note(p, 'Born 1875 in South Dakota; wife of Meinik Falde and mother of Belle Delia and Conrad (1910 census; Find a Grave).');
});
wed('falde_meinik', 'engebretson_berthine_marie');
child('falde_conrad', 'falde_meinik', 'engebretson_berthine_marie');
person('whalen_harley_andrew', 'Harley Andrew Whalen', 'M', [IAM19, FAGF], p => { refine(p, 'birth', '1878'); refine(p, 'death', '1911'); add(p.locations, 'Beresford, Union County, South Dakota'); add(p.aliases, 'Harvey Whalen'); note(p, 'Father of Gertrude (Falde), named Harvey Whalen on her 1919 marriage record; 1878–1911 (Find a Grave).'); });
person('mcaninch_jessie', 'Jessie McAninch (Whalen)', 'F', [IAM19, FAGF], p => { refine(p, 'birth', '1880'); refine(p, 'death', '1969'); note(p, 'Mother of Gertrude (Falde); 1880–1969 (marriage record; Find a Grave).'); });
wed('whalen_harley_andrew', 'mcaninch_jessie');
child('whalen_gertrude_lillian', 'whalen_harley_andrew', 'mcaninch_jessie');

// ── the Kelleys and Schafers ────────────────────────────────────────────────
person('kelley_william_joseph', 'William Joseph Kelley', 'M', [FAGK, OB18], p => {
  refine(p, 'birth', '7 Jan 1905'); refine(p, 'death', '2 Jun 1955');
  for (const l of ['New York City', 'Hawarden, Sioux County, Iowa', 'Chatsworth, Sioux County, Iowa', 'Grace Hill Cemetery, Hawarden']) add(p.locations, l);
  add(p.education, 'Trinity High School; Creighton University.');
  add(p.career, 'First National Bank, Hawarden, until 1930; general merchandise store and postmaster at Chatsworth; city assessor of Hawarden from 1947.');
  note(p, 'Born 7 Jan 1905 in New York City, the elder son of Michael Joseph Kelley and Delia; married Lucile Schafer in 1924; kept a store and the post office at Chatsworth from 1930, returned to Hawarden in 1947 as city assessor; a fourth-degree Knight of Columbus; died 2 Jun 1955 at Hawarden, aged 50 (obituary on Find a Grave). His brother was Thomas Paul Kelley (1911–1970).');
});
person('schafer_lucile', 'Lucile Schafer (Kelley, Schimming)', 'F', [FAGK, OB18], p => {
  refine(p, 'birth', '13 Jan 1907'); refine(p, 'death', '5 Mar 1967');
  for (const l of ['Akron, Plymouth County, Iowa', 'Chatsworth, Sioux County, Iowa', 'Hawarden, Sioux County, Iowa', 'Grace Hill Cemetery, Hawarden']) add(p.locations, l);
  add(p.career, 'Practical nurse at Hawarden Hospital.');
  note(p, 'Born 13 Jan 1907 at Akron, Iowa, daughter of George Hulbert Schafer and Margaret Maria Burnight; married William Joseph Kelley in 1924 and, widowed, Otto Schimming (1911–1963) in 1961; a member of St. Mary\'s Guild and the Royal Neighbors; died 5 Mar 1967 at St. Joseph Hospital, Sioux City, leaving twenty grandchildren (obituary on Find a Grave). Her sister was Frances Aloysius Schafer (Easton, 1913–2006).');
});
wed('kelley_william_joseph', 'schafer_lucile');
child('falde_mary', 'kelley_william_joseph', 'schafer_lucile');
edit('falde_mary', [], p => note(p, 'Her brothers and sisters: Kathleen Lucille "Keke" (O\'Connor, 1925–2006), Jerome William (1929–1967), Patrick George (1931–1998), William James "Bill" (1936–2005), Patricia Marie (Blake, 1940–2000) and Michael, who survived her (Find a Grave; her obituary).'));
person('kelley_michael_joseph', 'Michael Joseph "Mike" Kelley', 'M', [FAGK], p => { refine(p, 'birth', '1863'); refine(p, 'death', '1944'); add(p.locations, 'Hawarden, Sioux County, Iowa'); note(p, 'Father of William Joseph Kelley; 1863–1944 (Find a Grave).'); });
person('kelley_delia', 'Delia (Kelley)', 'F', [FAGK], p => { refine(p, 'birth', '1869'); refine(p, 'death', '1954'); note(p, 'Mother of William Joseph Kelley; 1869–1954; her birth surname is not yet recorded (Find a Grave).'); });
wed('kelley_michael_joseph', 'kelley_delia');
child('kelley_william_joseph', 'kelley_michael_joseph', 'kelley_delia');
person('schafer_george_hulbert', 'George Hulbert Schafer', 'M', [FAGK], p => { refine(p, 'birth', '1877'); refine(p, 'death', '1949'); add(p.locations, 'Akron, Plymouth County, Iowa'); note(p, 'Father of Lucile (Kelley); 1877–1949 (Find a Grave).'); });
person('burnight_margaret_maria', 'Margaret Maria Burnight (Schafer)', 'F', [FAGK], p => { refine(p, 'birth', '1879'); refine(p, 'death', '1960'); note(p, 'Mother of Lucile (Kelley); 1879–1960 (Find a Grave).'); });
wed('schafer_george_hulbert', 'burnight_margaret_maria');
child('schafer_lucile', 'schafer_george_hulbert', 'burnight_margaret_maria');

// ── the living generations, from the obituaries ─────────────────────────────
edit('olson_kris', [OB25, OB04], p => { add(p.aliases, 'Kristine Falde'); note(p, 'Kristine in her parents\' obituaries, of Thousand Oaks, California, in 2004.'); });
edit('olson_tom', [OB25, OB04], p => { add(p.aliases, 'Thomas W. Olson'); add(p.locations, 'Santa Fe, New Mexico'); note(p, 'Thomas W. Olson of Santa Fe, with his wife Bonnie, in his mother\'s 2004 obituary.'); });
edit('olson_sigrid', [OB25, OB04], p => { add(p.locations, 'Albuquerque, New Mexico'); note(p, 'Of Albuquerque, with her friend Chris Wood, in her mother\'s 2004 obituary.'); });
edit('falde_randy', OB18, p => { add(p.locations, 'Alcester, Union County, South Dakota'); note(p, 'Of Alcester, South Dakota, in his mother\'s 2018 obituary; his sister Robin of Chatsworth.'); });
edit('falde_robin', OB18, p => { add(p.locations, 'Chatsworth, Sioux County, Iowa'); note(p, 'Of Chatsworth, Iowa, in her mother\'s 2018 obituary.'); });
edit('falde_brendan', [OB25, OB18], p => { add(p.locations, 'Aurora, Colorado'); note(p, 'Of Aurora, Colorado, in his grandmother Mary\'s 2018 obituary; his grandfather Umpa\'s 2025 obituary names him among those who died before him.'); });
for (const id of ['rosgen_john', 'olson_kari', 'olson_eddy_orlando']) edit(id, OB25, p => { add(p.aliases, p.name.replace(/Rosgen/, 'Roesgen')); note(p, 'The surname is spelled Roesgen in Umpa\'s 2025 obituary.'); });
console.log('Olson / Falde applied');
