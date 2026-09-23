#!/usr/bin/env node
/**
 * 2026-09-23, at Brendan Adams's request: add an optional "sex" field ("F" or
 * "M") so "How are we related?" can say aunt or uncle. Re-runnable; never
 * overwrites a sex already set. In order of trust:
 *   1. being recorded as someone's mother or father
 *   2. a married surname in parentheses after the name (a wife's record)
 *   3. being the spouse of someone whose sex is known
 *   4. the first name, from the list below
 * Names that could be either (Frankie, Lynn, Sandy, Sam, …) and DNA-match
 * profiles are left blank. Also fixes Heather Zacher's record, which had her
 * father Kenneth in both parent slots.
 */
'use strict';
const fs = require('fs');
const { DIR, load, save } = require('./lib/records');

const F = 'Abigail Adela Adelia Agnes Alberta Alice Alina Amanda Amber Amy Ann Anna Anne Audrey Barbara Bernice Bertha Beryl Betty Beula Bonnie Brenda Camille Caroline Carrie Catherine Cecelia Charlotte Christiana Clara Cornelia Cunigunda Cynthia Daphne Dawn Debra Doris Dorothea Dorothy Dorthea Draden Dradie Edith Edna Elaine Eleanor Eliza Elizabeth Ellen Emeline Emily Emma Emogene Estella Esther Ethel Ettie Eunice Evaline Evarilda Faith Florence Frances Gabrielle Genevieve Gertrude Gladys Grace Grizzel Guinevere Hallie Hannah Harriet Harriett Heather Helen Honolulu Ida Irene Irmagene Isobel Jacobina Jamie Janet Janine Jean Jennie Jennifer Joan Judith Judy Juliaetta Kari Kate Katherine Kimberly Kippy Kris Lacie Laura Lauren Lauryn Lenore Lillian Linda Lois Lola Lona Louisa Louise Loula Mabel Magdalena Margaret Maria Marie Marjorie Mary Maxine Megan Melissa Michelle Minnie Mirabelle Missouri Muriel Myrtle Nancy Nell Nellie Nicole Pat Patricia Pauline Penny Phebe Rae Reda Reta Robin Rosella Rosemary Ruth Sarah Serena Serepta Serina Sharon Shelly Sigrid Sophia Susan Susanna Susannah Suzzanne Theresa Ursula Virginia Wendy Wilhelmina Zella Zona'.split(' ');
const M = 'Aaron Abraham Alexander Alfred Alton Andrew Anthony Anton Arthur Benjamin Bern Bob Boyd Brendan Brian Brooks Caleb Carl Charles Charlie Christian Christopher Chuck Clark Clay Clinton Craig Damian Dan Daniel David Delbert Dielman Dominick Donald Duane Ed Eddy Edward Eli Elmer Elvin Ephraim Ethan Francis Frank Fred Gabriel Garret Gavin Geoffrey George Gerald Glen Hallock Harold Harry Henry Homer Horatio Howard Hugh Isaac Ivo Jack Jacob James Jeff Jeffery Jerry John Jose Joseph Judson Kaleb Kenneth Kevin Lemon Leroy Les Lester Lewis Louis Marion Mark Marlan Mateo Melvin Michael Myron Nardin Nels Oden Orval Owen Peter Phillip Presley Ralph Randy Raymond Reeves Richard Robert Rodney Roger Rolla Roy Rudolph Rutherford Samuel Scott Spencer Stan Stephen Steve Ted Theodore Thomas Tom Tommy Ulysses Valentine Victor Wallace Walter Washington Wayne Willard William Wright'.split(' ');
const BY_NAME = new Map([...F.map(n => [n, 'F']), ...M.map(n => [n, 'M'])]);
BY_NAME.set('Willie', null);   // "Willie May" is a woman, "Uncle Willie" a man: decided per record below
const OVERRIDE = { adams_willie_may: 'F', frankie_adams: 'M', sam_adams: 'M', simons_lynn: 'M' };   // the last three per Brendan Adams

// Heather Zacher: her father Kenneth was in both parent slots
{ const h = load('zacher_heather'); if (h.relationships.mother === 'zacher_kenneth_donald' && h.relationships.father === 'zacher_kenneth_donald') { h.relationships.mother = ''; save(h); } }

const R = new Map(fs.readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => { const p = load(f.slice(0, -5)); return [p.id, p]; }));
const sex = new Map();
for (const p of R.values()) if (p.sex === 'F' || p.sex === 'M') sex.set(p.id, p.sex);
const clash = [];
const give = (id, s, why) => { if (!R.has(id) || !s) return; const cur = sex.get(id); if (cur && cur !== s) { clash.push(`${id}: ${cur} vs ${s} (${why})`); return; } if (!cur) sex.set(id, s); };

for (const p of R.values()) { const r = p.relationships || {}; give(r.mother, 'F', 'mother'); give(r.father, 'M', 'father'); }
for (const p of R.values()) if (!sex.has(p.id) && /\s\((?![#\d]|Jose2|fl\.|d\.)[A-Z][^()]*\)\s*$/.test(p.name)) give(p.id, 'F', 'married name');
for (let changed = true; changed;) {
  changed = false;
  for (const p of R.values()) for (const s of [p.relationships?.spouse, ...(p.relationships?._extra_spouses || [])].filter(Boolean)) {
    if (sex.has(p.id) && R.has(s) && !sex.has(s)) { give(s, sex.get(p.id) === 'F' ? 'M' : 'F', 'spouse'); changed = true; }
  }
}
const first = n => n.replace(/[“”"][^“”"]*[“”"]/g, ' ').replace(/^(Col\.|Dr\.|Rev\.|Mr\.|Mrs\.)\s*/, '').trim().split(/\s+/)[0];
for (const p of R.values()) {
  if (sex.has(p.id) || p.record_type === 'dna_match') continue;
  give(p.id, OVERRIDE[p.id] || BY_NAME.get(first(p.name)) || null, 'first name');
}
let written = 0;
for (const p of R.values()) { const s = sex.get(p.id); if (s && p.sex !== s) { p.sex = s; save(p); written++; } }
const blank = [...R.values()].filter(p => !sex.has(p.id) && p.record_type !== 'dna_match').map(p => p.name);
console.log(`sex set on ${written} records; ${sex.size} known; left blank (not DNA matches): ${blank.length}`);
if (blank.length) console.log('  ' + blank.join(' | '));
if (clash.length) console.log('conflicts:\n  ' + clash.join('\n  '));
