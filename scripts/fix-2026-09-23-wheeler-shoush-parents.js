#!/usr/bin/env node
/**
 * 2026-09-23, at Brendan Adams's request. Re-runnable.
 *  1. D. A. and Reppa (Serepta Mary Grinnell) Wheeler as Melvin Wheeler's
 *     parents, with their six older children. Sources, all in Bill Allen's
 *     document: the typed key to the "Wheeler Family, Christmas 1894, Ireton,
 *     Iowa" photo (p. 102: "Children of D.A and Reppa are Edna, Nell, Delbert,
 *     Judson, Alfred and Mabel. Melvin not yet born."), the "Mr. and Mrs.
 *     D. A. Wheeler" clipping (p. 103: born in Wisconsin 1853-1861, settled
 *     in Sioux Co. fall of 1881), and the 1944 wedding notice, which calls
 *     Mrs. Reppa Wheeler of Redwood Falls, Minn., the bride's grandmother.
 *  2. William Shoush and Susanna Willoughby Shoush as Anna Elizabeth Shoush's
 *     parents. Their photos sit on the Allen photo pages (p. 111) but the
 *     document does not state the relationship; noted as inferred.
 */
'use strict';
const { exists, load, save, note } = require('./lib/records');
const DOC = 'Descendants of Jose Pierre Adams, compiled by William W. "Bill" Allen (2 April 2011 edition)';
const add = (a, v) => { if (!a.includes(v)) a.push(v); };
const blank = (id, name) => ({ id, name, birth: '', death: '', personality: [], roles: [], childhood_experience: [], notable_stories: [], risk_events: [], milestones: [], education: [], career: [], relationships: { mother: '', father: '', siblings: [], spouse: '', children: [] }, locations: [], sources: [DOC], notes: [], aliases: [] });
const ensure = (id, name, extra = {}) => { if (!exists(id)) save({ ...blank(id, name), ...extra }); return load(id); };

// ── 1. Wheeler ─────────────────────────────────────────────────────────────
const KIDS = [['wheeler_edna', 'Edna Wheeler'], ['wheeler_nell', 'Nell Wheeler'], ['wheeler_delbert', 'Delbert Wheeler'], ['wheeler_judson', 'Judson Wheeler'], ['wheeler_alfred', 'Alfred Wheeler'], ['wheeler_mabel', 'Mabel Wheeler']];
const PHOTO_KEY = 'Named as a child of D. A. and Reppa Wheeler in the key to the "Wheeler Family, Christmas 1894, Ireton, Iowa" photo in Bill Allen’s document (page 102); born before Christmas 1894.';

const da = ensure('wheeler_d_a', 'D. A. Wheeler', {
  birth: '1853',
  locations: ['Wisconsin', 'Sioux County, Iowa', 'Ireton, Sioux County, Iowa'],
  milestones: ['Born 1853, Wisconsin', 'Settled in Sioux County, Iowa, fall of 1881'],
  notes: ['A newspaper clipping in Bill Allen’s document (page 103) captions "Mr. and Mrs. D. A. Wheeler … Born in Wisconsin 1853-1861. Settled in Sioux Co. fall of 1881." The years are read as his birth (1853) and hers (1861). His given names are not recorded.'],
});
const reppa = ensure('grinnell_serepta_mary', 'Serepta Mary Grinnell (Wheeler)', {
  birth: '1861',
  aliases: ['Reppa Wheeler', 'Reppa Grinnell', 'Mrs. D. A. Wheeler'],
  locations: ['Wisconsin', 'Sioux County, Iowa', 'Ireton, Sioux County, Iowa', 'Redwood Falls, Minnesota'],
  milestones: ['Born 1861, Wisconsin', 'Living at Redwood Falls, Minnesota, in May 1944, when she attended her granddaughter Dorothy Ann Wheeler’s wedding'],
  notes: ['Known as Reppa. Named "Serepta Mary (Grinnell) Wheeler" under her photo on page 108 of Bill Allen’s document; the 1944 wedding notice calls her the bride’s grandmother, "Mrs. Reppa Wheeler, now residing at Redwood Falls, Minn."',
    'A group photo on page 103 includes "Reppa Grinnell (probably Wheeler by this time)" with Grinnell relatives, among them Bart, Esther, Anson and perhaps Frank (Francis) and Willis Grinnell, and Alice Grinnell, probably married to Roy Wheeler by then. Willard Grinnell and Mary Hanks Grinnell appear on the same page, perhaps her parents; not confirmed.'],
});
da.relationships.spouse = reppa.id; reppa.relationships.spouse = da.id;
add(da.milestones, 'Married Serepta Mary "Reppa" Grinnell'); add(reppa.milestones, 'Married D. A. Wheeler');
for (const [id, name] of KIDS) {
  const k = ensure(id, name, { locations: ['Ireton, Sioux County, Iowa'], notes: [PHOTO_KEY] });
  k.relationships.father = da.id; k.relationships.mother = reppa.id; save(k);
  add(da.relationships.children, id); add(reppa.relationships.children, id);
}
{
  const mel = load('wheeler_melvin');
  mel.relationships.father = da.id; mel.relationships.mother = reppa.id;
  add(mel.sources, DOC);
  note(mel, 'CORRECTION 2026-09-23: Parents set to D. A. Wheeler and Serepta Mary "Reppa" (Grinnell) Wheeler. The key to the 1894 Wheeler family photo lists their six children and adds "Melvin not yet born"; the 1944 wedding notice names Mrs. Reppa Wheeler as his daughter Dorothy Ann’s grandmother; and Bill Allen captions Melvin "My Grandpa Wheeler".');
  save(mel);
  add(da.relationships.children, 'wheeler_melvin'); add(reppa.relationships.children, 'wheeler_melvin');
}
save(da); save(reppa);

// ── 2. Shoush ──────────────────────────────────────────────────────────────
const INFER = 'Parent of Anna Elizabeth Shoush (Anthony): inferred, not stated. Bill Allen’s document shows photos captioned "William Shoush" and "Susanna Willoughby Shoush" together on its Allen family photo pages (page 111); Anna is the only Shoush in the family.';
const wm = ensure('shoush_william', 'William Shoush', { notes: [INFER] });
const su = ensure('willoughby_susanna', 'Susanna Willoughby (Shoush)', { aliases: ['Susanna Shoush'], notes: [INFER] });
wm.relationships.spouse = su.id; su.relationships.spouse = wm.id;
add(wm.relationships.children, 'shoush_anna_elizabeth'); add(su.relationships.children, 'shoush_anna_elizabeth');
save(wm); save(su);
{
  const a = load('shoush_anna_elizabeth');
  a.relationships.father = wm.id; a.relationships.mother = su.id;
  add(a.sources, DOC);
  note(a, 'CORRECTION 2026-09-23: Parents set to William Shoush and Susanna Willoughby Shoush, inferred from their photos on page 111 of Bill Allen’s document (the relationship is not stated there). Decision by Brendan Adams.');
  save(a);
}
// ── 3. Grinnell (added at Brendan's request, also inferred) ───────────────
const GINF = 'Parent of Serepta Mary "Reppa" Grinnell (Wheeler): inferred, not stated. Bill Allen’s document shows photos captioned "Willard Grinnell" and "Mary Hanks Grinnell" on the same page as Reppa’s photo and the Grinnell family group (page 103).';
const wg = ensure('grinnell_willard', 'Willard Grinnell', { notes: [GINF] });
const mh = ensure('hanks_mary', 'Mary Hanks (Grinnell)', { aliases: ['Mary Hanks Grinnell', 'Mary Grinnell'], notes: [GINF] });
wg.relationships.spouse = mh.id; mh.relationships.spouse = wg.id;
add(wg.relationships.children, 'grinnell_serepta_mary'); add(mh.relationships.children, 'grinnell_serepta_mary');
save(wg); save(mh);
{
  const r = load('grinnell_serepta_mary');
  r.relationships.father = wg.id; r.relationships.mother = mh.id;
  note(r, 'CORRECTION 2026-09-23: Parents set to Willard Grinnell and Mary Hanks Grinnell, inferred from their photos on page 103 of Bill Allen’s document (the relationship is not stated there). Decision by Brendan Adams.');
  save(r);
}
console.log('Wheeler parents and six children, and Shoush and Grinnell parents, linked');
