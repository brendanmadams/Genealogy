#!/usr/bin/env node
/** 2026-09-25, the Maryland Hall of Records' 1968 reply to G. H. S. King on "Lanternam". Re-runnable. */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const p = load('ball_john_stafford');
note(p, 'The "Lanternam" thread has been pulled once already. King asked the Maryland Hall of Records in February 1968; the archivist replied (8 Mar 1968) that the rent rolls show the tract surveyed for William Boarman on 10 Apr 1671 and passing from John Ball to Richard Edelen on 9 Mar 1714, that William Boarman\'s will of 1708 left it to his son John Baptist Boarman (65 acres to Thomas Hagan; Edward Benson then living on it), that no deed or Provincial Court record shows how John and Winifred Ball acquired it, and that no will of a William Williams was on record before 1714. So the land came to the Balls between 1708 and 1714 by some route the indexes do not show, most likely through Winifred; the Charles County court and church records of those years, unindexed, are what remain.');
add(p.sources, 'Maryland Hall of Records, Annapolis, to George H. S. King, 8 Mar 1968 (in the King Papers; FamilySearch image 3:1:33SQ-GPXC-65P)');
save(p);
console.log('Lanternam note applied');
