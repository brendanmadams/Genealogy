#!/usr/bin/env node
/**
 * 2026-09-24, Elaine Simons's first husband and children spelled Rinehart,
 * as in the 1940 census, Find a Grave, Irma's emails, William Upham's
 * obituary and the Ancestry trees; "Rhinehart" stays as an alias. Les's full
 * name and dates, and Elaine's birth date, from the "Kulp-Ritchey-Dorsett
 * Family Tree" on Ancestry.com. Record ids keep the old spelling. Re-runnable.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const TREE = 'Ancestry.com, public member tree "Kulp-Ritchey-Dorsett Family Tree"';

for (const id of ['rhinehart_les', 'rhinehart_jerry', 'rhinehart_janet', 'rhinehart_debbie', 'simons_elaine_deretha']) {
  if (!exists(id)) continue;
  const p = load(id);
  p.aliases = p.aliases || [];
  if (/Rhinehart/.test(p.name)) { add(p.aliases, p.name); p.name = p.name.replace(/Rhinehart/g, 'Rinehart'); }
  p.aliases = p.aliases.filter(a => a !== p.name);
  for (const k of ['notes', 'milestones']) p[k] = (p[k] || []).map(t => t.replace(/married Les Rhinehart\./, 'married Les Rinehart.'));
  p.notes = p.notes.filter((t, i, a) => a.indexOf(t) === i && !/^The emails spell the surname Rinehart\. \[Family research emails, email 27\]$|^Open question: Elaine Deretha Simons's husband at her 2011 death was William \(Bill\) Upham/.test(t));
  save(p);
}

const les = load('rhinehart_les');
if (['Les Rinehart', 'Les Rhinehart'].includes(les.name)) { add(les.aliases, les.name); les.name = 'Leslie Bernard “Les” Rinehart'; }
add(les.aliases, 'Le Ley Rinehart');
if (!les.birth) les.birth = '1913';
if (!les.death) les.death = '1988';
add(les.sources, TREE);
note(les, 'Leslie Bernard Rinehart (1913–1988), per the Kulp-Ritchey-Dorsett Family Tree on Ancestry. "Le Ley Rinehart", 27, in the 1940 census, living with Elaine and their children Jerry and Janet Lee in his father-in-law Ray Simons\'s household near Richland.');
save(les);

const el = load('simons_elaine_deretha');
if (el.name === 'Elaine Deretha Simons (Rinehart)') el.name = 'Elaine Deretha Simons (Rinehart, Upham)';
add(el.aliases, 'Elaine Upham');
if (el.birth === 'Jan 1918') el.birth = '20 Jan 1918';
add(el.sources, TREE);
note(el, 'Born 20 Jan 1918 at Milton, Oregon, and married William Upham on 21 Jun 1991 in Clackamas County; died 11 Aug 2011 at Gladstone, Oregon (Kulp-Ritchey-Dorsett Family Tree on Ancestry).');
save(el);
console.log('Rinehart spelling applied');
