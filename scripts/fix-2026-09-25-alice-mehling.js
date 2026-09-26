#!/usr/bin/env node
/**
 * 2026-09-25, Rosemary (Van Gorden) Olson's sister Alice Jane Ellen Van
 * Gorden (Mehling), 1923–2008, her husband the author Harold Mehling and their
 * son Richard R. "Rod" Mehling. Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const blank = (id, name, sex) => ({ id, name, sex, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [], notes: [], aliases: [] });
const edit = (id, src, fn) => { const p = load(id); for (const k of ['notes', 'sources', 'locations', 'aliases', 'milestones', 'career', 'education']) p[k] = p[k] || []; fn(p); for (const s of [].concat(src)) add(p.sources, s); save(p); };
const person = (id, name, sex, src, fn) => { if (!exists(id)) save(blank(id, name, sex)); edit(id, src, fn); };
const refine = (p, k, v) => { if (!p[k] || /^(abt |about )?\d{4}$/i.test(String(p[k]).trim())) p[k] = v; };
const child = (kid, father, mother) => { edit(kid, [], p => { if (father) p.relationships.father = father; if (mother) p.relationships.mother = mother; }); for (const par of [father, mother].filter(Boolean)) edit(par, [], p => add(p.relationships.children, kid)); };
const wed = (a, b) => { for (const [x, y] of [[a, b], [b, a]]) edit(x, [], p => { const r = p.relationships; if (r.spouse === y || (r._extra_spouses || []).includes(y)) return; if (!r.spouse) r.spouse = y; else { r._extra_spouses = r._extra_spouses || []; add(r._extra_spouses, y); } }); };

const IAB = 'FamilySearch, Iowa Births and Stillbirths, 1921-1947 (Alice Jane Ellen Van Gorden, 16 Nov 1923, Emmetsburg, parents Harry Fletcher Van Gorden and Daisy L. Dick-Peddie; ark 1:1:QPZB-4CKR)';
const C1930 = 'FamilySearch, United States Census, 1930 (Emmetsburg, Palo Alto County, Iowa; Alice Jane Van Gorden, 6, with her mother Daisy and sister Rose Mary; ark 1:1:XMV8-9TM)';
const MAR = 'Ancestry.com, U.S., Newspapers.com Marriage Index (Mrs. Alice Van Gorden [Mehling]: of 10 Avenue Trudaine, Paris; researcher for Time magazine; edited for Vogue magazine; mother Daisy Van Gorden; spouse Harold Mehling; marriage in New York), citing the Globe-Gazette, Mason City, Iowa, 10 Feb 1948, p. 11';
const SHIP = 'Ancestry.com, New York Arriving Passenger and Crew Lists (Alice Van Gorden, 24, single, born 16 Nov 1923 Emmetsburg, Iowa, arrived New York from Cherbourg on the Mauretania, 24 May 1948; NARA T715 roll 7601)';
const C1950 = 'FamilySearch, United States Census, 1950 (Queens Village, Queens, New York; Harold Mehling, 27, born Illinois, journalist, newspaper, with Alice, 26, born Iowa, and Richard R., 1, born Iowa; ED 41-698; ark 1:1:6XYS-T6BP)';
const SSDI = 'FamilySearch, United States Social Security Death Index (Alice Mehling, 16 Nov 1923 – 26 Feb 2008, Essex County, New Jersey) and public-records indexes (Alice V. Mehling, Maplewood, New Jersey, 1974–2008)';
const OB04 = 'Obituary of Rosemary Emily Van Gorden Olson, Albuquerque Journal, 11 Dec 2004 (sister Alice Mehling of New York City)';
const HB = 'FamilySearch, Illinois, Cook County Birth Certificates (Harold Mehling, 22 Mar 1923 Chicago, parents Richard R. Mehling and Ida Heifetz; registered 10 Jul 1942); 1940 census, Belvedere, Los Angeles County; NUMIDENT and SSDI (died 3 Oct 2005, New York City)';
const BOOKS = 'Library and bookseller catalogues: Harold Mehling, The Scandalous Scamps: A Gallery of American Rogues (Holt, 1959), The Most of Everything: The Story of Miami Beach (1960), Assumption of Guilt';
const ROD = 'Public profiles (Ossining High School class of 1966; University of Wisconsin–Madison, history, 1973; teacher, Mandela International Magnet School, Santa Fe) and public-records index (Rod Mehling, born Aug 1948, Santa Fe 2004)';

person('vangorden_alice_jane', 'Alice Jane Ellen Van Gorden (Mehling)', 'F', [IAB, C1930, MAR, SHIP, C1950, SSDI, OB04], p => {
  refine(p, 'birth', '16 Nov 1923'); refine(p, 'death', '26 Feb 2008');
  for (const l of ['Emmetsburg, Palo Alto County, Iowa', '10 Avenue Trudaine, Paris', 'Queens Village, Queens, New York', 'Ossining, Westchester County, New York', 'Maplewood, Essex County, New Jersey']) add(p.locations, l);
  for (const a of ['Alice Mehling', 'Alice V. Mehling', 'Alice Van Gorden']) add(p.aliases, a);
  add(p.career, 'Researcher for Time magazine in Paris, and an editor at Vogue, by 1948.');
  note(p, 'Rosemary\'s younger sister, born 16 Nov 1923 at Emmetsburg, Iowa, the second daughter of Harry Fletcher Van Gorden and Daisy Dick-Peddie; six years old in 1930 in her widowed mother\'s household (Iowa birth register; 1930 census).');
  note(p, 'By early 1948 she was living at 10 Avenue Trudaine, Paris, a researcher for Time magazine who had also edited for Vogue, when the Mason City Globe-Gazette (10 Feb 1948) announced her marriage to Harold Mehling of New York; the index gives the wedding as 6 Oct 1948 in New York, which cannot be right for an announcement printed in February, so the date wants checking against the page. She sailed home from Cherbourg on the Mauretania, arriving in New York on 24 May 1948, entered as single (marriage index; passenger list).');
  note(p, 'In April 1950 she and Harold, a newspaper journalist, were at Queens Village with their son Richard R., one year old and born in Iowa; the family later lived at Ossining, New York, and from 1974 at Maplewood, New Jersey, where she died on 26 Feb 2008, aged 84 (1950 census; public-records and Social Security indexes). Her sister Rosemary\'s 2004 obituary names her as Alice Mehling of New York City.');
});
child('vangorden_alice_jane', 'vangorden_harry_fletcher', 'dickpeddie_daisy');
person('mehling_harold', 'Harold Mehling', 'M', [HB, C1950, MAR, BOOKS], p => {
  refine(p, 'birth', '22 Mar 1923'); refine(p, 'death', '3 Oct 2005');
  for (const l of ['Chicago, Illinois', 'Los Angeles, California', 'Queens Village, Queens, New York', 'New York City']) add(p.locations, l);
  add(p.career, 'Newspaper journalist (1950) and author: The Scandalous Scamps: A Gallery of American Rogues (1959), The Most of Everything: The Story of Miami Beach (1960), Assumption of Guilt, among others.');
  note(p, 'Born 22 Mar 1923 in Chicago, son of Richard R. Mehling and Ida (or Edith) Heifetz; in Los Angeles with his parents and siblings Myra and Eugene in 1940; married Alice Van Gorden of Emmetsburg, Iowa, then of Paris, in 1948; a journalist in Queens in 1950 and later a writer of popular non-fiction; died 3 Oct 2005 in New York City (Cook County birth certificate; censuses; marriage index; Social Security records; library catalogues).');
});
wed('vangorden_alice_jane', 'mehling_harold');
person('mehling_rod', 'Richard R. "Rod" Mehling', 'M', [C1950, ROD, OB04], p => {
  refine(p, 'birth', 'Aug 1948');
  for (const l of ['Iowa', 'Ossining, Westchester County, New York', 'Santa Fe, New Mexico']) add(p.locations, l);
  add(p.aliases, 'Rod Mehling');
  add(p.education, 'Ossining High School, 1966; University of Wisconsin–Madison, history, 1973.');
  add(p.career, 'Teacher, Mandela International Magnet School, Santa Fe.');
  note(p, 'Son of Harold Mehling and Alice Van Gorden, born in Iowa about August 1948 (one year old in Queens in April 1950; public-records index), and named Richard for his grandfather Richard R. Mehling; grew up at Ossining, New York; a long-time teacher in Santa Fe, where he was living by 2004, the year of his aunt Rosemary\'s death (1950 census; public profiles).');
});
child('mehling_rod', 'mehling_harold', 'vangorden_alice_jane');
console.log('Alice Mehling applied');
