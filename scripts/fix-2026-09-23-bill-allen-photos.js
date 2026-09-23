#!/usr/bin/env node
/**
 * 2026-09-23, at Brendan Adams's request. Re-runnable.
 * Adds the photos from pages 96-111 of Bill Allen's document to
 * data/media.json, with square portraits for the single-person photos.
 * The photos themselves are cut by scripts/cut-bill-allen-photos-2026-09-23.ps1
 * from scripts/photos-2026-09-23-bill-allen.json; run that first.
 *
 * Jose Pierre (II) gets his portrait from his page-96 photograph instead of
 * the small crop of the Adams brothers photo.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { exists } = require('./lib/records');
const ROOT = path.resolve(__dirname, '..');
const MJ = path.join(ROOT, 'data', 'media.json');
const SPEC = JSON.parse(fs.readFileSync(path.join(__dirname, 'photos-2026-09-23-bill-allen.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(MJ, 'utf8'));
const SRC = path.resolve(ROOT, media.source_dir);

// width of a baseline or progressive JPEG, from its SOF marker
function jpegWidth(file) {
  const b = fs.readFileSync(file);
  for (let i = 2; i < b.length;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return b.readUInt16BE(i + 7);
    i += 2 + len;
  }
  throw new Error('no SOF in ' + file);
}

let added = 0, portraits = 0;
for (const ph of SPEC.photos) {
  const file = `${ph.file}_AdamsFamilyDoc_p${String(ph.page).padStart(3, '0')}.jpg`;
  const full = path.join(SRC, file);
  if (!fs.existsSync(full)) { console.warn('missing photo, run the cut script:', file); continue; }
  const people = ph.people.filter(id => exists(id) || console.warn('missing record', id));
  const s = jpegWidth(full) / (ph.box[2] - ph.box[0]);
  const faces = ph.faces || (ph.face ? [ph.face] : []);
  const item = {
    id: ph.id, kind: ph.kind || 'photo', file, title: ph.title,
    caption: [ph.caption, `From the photo pages of Bill Allen’s family document (page ${ph.page}).`].filter(Boolean).join(' '),
    source: `Descendants of Jose Pierre Adams, compiled by Bill Allen (2011), page ${ph.page}.`,
    people,
  };
  if (faces.length) item.portraits = faces.map(([person, x, y, size]) => ({ person, crop: [Math.round((x - ph.box[0]) * s), Math.round((y - ph.box[1]) * s), Math.round(size * s)] }));
  const i = media.items.findIndex(m => m.id === ph.id);
  if (i >= 0) media.items[i] = item; else { media.items.push(item); added++; }
  portraits += faces.length;
}

// one portrait source per person: drop older portraits for anyone who now has a new one
const fresh = new Set(SPEC.photos.flatMap(ph => (ph.faces || (ph.face ? [ph.face] : [])).map(f => f[0])));
const newIds = new Set(SPEC.photos.map(ph => ph.id));
for (const m of media.items) {
  if (newIds.has(m.id) || !m.portraits) continue;
  m.portraits = m.portraits.filter(p => !fresh.has(p.person));
  if (!m.portraits.length) delete m.portraits;
}

fs.writeFileSync(MJ, JSON.stringify(media, null, 2) + '\n');
console.log(`${added} photos added (${SPEC.photos.length} in the list), ${portraits} portraits`);
