#!/usr/bin/env node
/** 2026-09-25, Roesgen is the family's spelling (Brendan Adams); Umpa and Rosemary married in 1946 (her obituary; Find a Grave). Re-runnable. */
'use strict';
const { load, save, rename } = require('./lib/records');
rename('rosgen_john', 'roesgen_john');
rename('olson_eddy_orlando', 'roesgen_eddy_orlando');
const fix = (id, fn) => { const p = load(id); fn(p); save(p); };
const clean = p => {
  p.notes = (p.notes || []).filter(n => !/spelled Roesgen in Umpa/.test(n));
  p.aliases = (p.aliases || []).filter(a => !/Roesgen/.test(a) && !/Rosgen/.test(a));
  p.milestones = (p.milestones || []).map(m => m.replace(/Rosgen/g, 'Roesgen'));
};
fix('roesgen_john', p => { p.name = 'John Roesgen'; clean(p); });
fix('olson_kari', p => { p.name = 'Kari Olson (Roesgen)'; clean(p); });
fix('roesgen_eddy_orlando', p => { p.name = 'Eddy Orlando Roesgen'; clean(p); });
fix('olson_tom_umpa', p => {
  p.milestones = p.milestones.map(m => m === 'Married Rosemary Dick-Peddie (m. 6 Apr 1945)' ? 'Married Rosemary Van Gorden (m. 1946)' : m);
  p.notes = p.notes.map(n => n.replace('Married his high-school sweetheart Rosemary Van Gorden of Emmetsburg (Brendan Adams gives 6 Apr 1945; her 2004 obituary and Find a Grave say 1946).', 'Married his high-school sweetheart Rosemary Van Gorden of Emmetsburg in 1946.'));
});
fix('vangorden_rosemary', p => { p.milestones = p.milestones.map(m => m === 'Married Thomas Orlando “Umpa” Olson (m. 6 Apr 1945)' ? 'Married Thomas Orlando “Umpa” Olson (m. 1946)' : m); });
console.log('Roesgen / 1946 applied');
