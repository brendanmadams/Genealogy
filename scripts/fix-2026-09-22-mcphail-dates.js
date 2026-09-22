#!/usr/bin/env node
/**
 * Mary Emily McPhail's birth and marriage dates from the 1943 family record
 * book (media item kulp-record-book, page 14). Re-runnable.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const DIR = path.resolve(__dirname, '..', 'data', 'people');
const TAG = 'CORRECTION 2026-09-22:';
const SRC = 'Family record book, Christmas 1943 (Kulp/McPhail), page 14';
const load = id => JSON.parse(fs.readFileSync(path.join(DIR, id + '.json'), 'utf8'));
const save = (id, p) => fs.writeFileSync(path.join(DIR, id + '.json'), JSON.stringify(p, null, 2) + '\n');
const addNote = (p, t) => { p.notes = p.notes || []; if (!p.notes.includes(t)) p.notes.push(t); };
const addSource = p => { p.sources = p.sources || []; if (!p.sources.includes(SRC)) p.sources.push(SRC); };

const OLD_M = 'Married John Jacob Kulp (m. 1897)';
const NEW_M = 'Married John Jacob Kulp (m. 15 Aug 1897, Lynden, WA)';

const me = load('mcphail_mary_emily');
me.birth = '14 Feb 1878';
me.milestones = (me.milestones || []).map(m => (m === OLD_M ? NEW_M : m));
if (!me.milestones.includes(NEW_M)) me.milestones.unshift(NEW_M);
if (!me.locations.includes('Lynden, WA')) me.locations.push('Lynden, WA');
addNote(me, `${TAG} Birth refined from 1878 to 14 Feb 1878 (a Thursday) and marriage dated 15 Aug 1897 at Lynden, WA, from the 1943 family record book, which lists her among the five children of John Belle McPhail and Ellen R. Ball (m. 9 Jul 1872).`);
addSource(me);
save('mcphail_mary_emily', me);

const jj = load('kulp_john_jacob');
const OLD_J = 'Married Mary Emily Valentine McPhail (m. 1897)';
const NEW_J = 'Married Mary Emily Valentine McPhail (m. 15 Aug 1897, Lynden, WA)';
jj.milestones = (jj.milestones || []).map(m => (m === OLD_J ? NEW_J : m));
addNote(jj, `${TAG} Marriage dated 15 Aug 1897 at Lynden, WA, from the 1943 family record book.`);
addSource(jj);
save('kulp_john_jacob', jj);
console.log('updated mcphail_mary_emily, kulp_john_jacob');
