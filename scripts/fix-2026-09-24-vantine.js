#!/usr/bin/env node
/**
 * 2026-09-24, Abraham Van Tine → Abraham Vantine, the spelling of the 1860
 * census (Clark Township, Chariton County, Missouri) and of his daughter Mary
 * Frances Vantine's record. The other spellings stay as aliases. Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const C1860 = 'Ancestry.com, 1860 United States Federal Census (Clark, Chariton County, Missouri; post office Keytesville)';
const a = load('van_tine_abraham');
for (const k of ['aliases', 'locations', 'sources', 'career']) a[k] = a[k] || [];
if (a.name === 'Abraham Van Tine') { add(a.aliases, 'Abraham Van Tine'); a.name = 'Abraham Vantine'; }
for (const x of ['Abraham VanTine', 'Abraham VanTyne']) add(a.aliases, x);
for (const l of ['New Jersey', 'Clark Township, Chariton County, Missouri']) add(a.locations, l);
add(a.career, 'Farmer (1860 census).');
add(a.sources, C1860);
note(a, 'In 1860 a farmer in Clark Township, Chariton County, Missouri (post office Keytesville), aged 45 and born in New Jersey, with Mary (42), Lucy (13), Ellen (7), Alletta (4) and Joseph (22). His daughter Mary Frances, about 16, had already left home; she married Ephraim Clark at 15.');
save(a);
const m = load('vantine_mary_frances');
m.aliases = m.aliases || [];
for (const x of ['Mary Frances Van Tine', 'Mary Frances VanTine', 'Mary Frances VanTyne']) add(m.aliases, x);
save(m);
console.log('Vantine applied');
