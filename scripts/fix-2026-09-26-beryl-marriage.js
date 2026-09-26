#!/usr/bin/env node
/**
 * 2026-09-26, Beryl Simons and George Francis Adams Sr. married on 9 Jan 1942
 * at Pasco, on a Thurston County (Olympia) licence of 8 Jan 1942, not 2 Jul 1942
 * (Washington county marriage records). Re-runnable.
 */
'use strict';
const { load, save, note } = require('./lib/records');
const add = (a, v) => { if (v && !a.includes(v)) a.push(v); };
const SRC = 'FamilySearch, Washington, County Marriages, 1855-2008 (George F. Adams and Beryl Eva Simons; licence 8 Jan 1942, Thurston County; married 9 Jan 1942, Pasco, Franklin County; volume 18895; arks 1:1:FLNW-H43, QP9M-BQ3R); Ancestry.com, Washington, U.S., Marriage Records, 1854-2013 and Washington, U.S., Episcopal Diocese of Spokane Church Records, 1870-1970 (Beryl Eva Simons, 22, and George F. Adams, 9 Jan 1942, Episcopal Church of Our Saviour, Pasco; parents Raymond and Dradie Simons)';
const fix = (id, other, who) => {
  const p = load(id);
  p.milestones = p.milestones.filter(m => !/^Married George Francis Adams Sr\. \(m\. 2 Jul 1942|^Married George Francis Adams Sr\. \(2 July 1942|^Married Beryl (Eva )?Simons( Adams)? \((m\. )?2 Jul(y)? 1942/.test(m));
  add(p.milestones, `Married ${other} (m. 9 Jan 1942, Pasco, Franklin County, Washington; licence Thurston County, 8 Jan 1942)`);
  p.notes = p.notes.filter(n => !/^Marriage to Beryl Eva Simons: 2 July 1942/.test(n));
  note(p, `${who} took out the licence at Olympia on 8 Jan 1942, a month after Pearl Harbor, and married the next day at the Episcopal Church of Our Saviour in Pasco, where Beryl's parents lived; she was 22, and the church register names her parents Raymond and Dradie Simons (county marriage records; Episcopal Diocese of Spokane church records, vol. 2).`);
  add(p.sources, SRC);
  save(p);
};
fix('beryl_simons_adams', 'George Francis Adams Sr.', 'She and George');
fix('george_francis_adams_sr', 'Beryl Eva Simons', 'He and Beryl');
console.log('Beryl marriage applied');
