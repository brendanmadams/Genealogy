// The details panel for the focus person.
import { lifespan, byBirth, initials as initialsOf } from './data.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function gallery(D, p) {
  const list = D.mediaFor(p);
  if (!list.length) return '';
  const order = { photo: 0, album: 1, document: 2 };
  list.sort((a, b) => order[a.kind] - order[b.kind]);
  return `<div class="gallery">${list.map(m => {
    const first = m.files[0];
    const isPdf = /\.pdf$/i.test(first);
    const thumb = isPdf ? `<div class="thumb pdf">PDF</div>` : `<img class="thumb" src="${first}" alt="" loading="lazy" />`;
    const badge = m.kind === 'album' ? `<span class="count">${m.files.length} pages</span>` : '';
    return `<button class="media" data-media="${m.id}" title="${esc(m.title)}">${thumb}${badge}<span class="media-title">${esc(m.title)}</span></button>`;
  }).join('')}</div>`;
}

export function renderPanel(container, D, p) {
  const branch = D.branch(p);
  const chip = (q, extra = '') => {
    const span = lifespan(q, { short: true });
    return `<button class="chip" data-id="${q.id}" style="--branch:${D.color(q)}"><span class="chip-name">${esc(q.name)}</span>${span ? `<span class="chip-sub">${esc(span)}</span>` : ''}${extra ? `<span class="chip-sub">${esc(extra)}</span>` : ''}</button>`;
  };
  const section = (title, body) => body ? `<section class="sec"><h3>${title}</h3>${body}</section>` : '';
  const items = (arr, cls = '') => arr?.length ? `<ul class="${cls}">${arr.map(x => `<li>${esc(typeof x === 'string' ? x : (x.event || x.description || x.story || x.text || JSON.stringify(x)))}</li>`).join('')}</ul>` : '';
  const group = (label, arr) => arr?.length ? `<div class="fam-group"><div class="fam-label">${label}</div><div class="chips">${arr.join('')}</div></div>` : '';

  // family
  const parents = D.parents(p);
  const sibs = D.siblings(p);
  const partnerBlocks = D.partnerFamilies(p).map(f => {
    const partner = D.partnerIn(f, p);
    const kids = byBirth(f.children.map(id => D.person(id)).filter(Boolean));
    const head = partner ? chip(partner, f.marriage ? `m. ${f.marriage}` : '') : `<span class="muted">Other parent not recorded</span>`;
    return `<div class="fam-group"><div class="fam-label">${partner ? 'Spouse' : 'Children'}</div><div class="chips">${head}</div>${kids.length ? `<div class="fam-label sub">Children${partner ? ' together' : ''}</div><div class="chips">${kids.map(k => chip(k)).join('')}</div>` : ''}</div>`;
  }).join('');

  const born = p.birth?.text ? esc(p.birth.text) : '<span class="muted">unknown</span>';
  const died = p.death?.text ? esc(p.death.text) : (p.living ? '<span class="muted">living</span>' : '<span class="muted">—</span>');
  const lines = (p.lineages || []).filter(k => k !== p.branch).map(k => D.branches.get(k)?.label).filter(Boolean);

  container.innerHTML = `
    <header class="panel-head" style="--branch:${branch.color}">
      <div class="panel-photo" id="panel-photo"></div>
      <div class="panel-title">
        <h2>${esc(p.name)}</h2>
        <div class="panel-dates">${esc(lifespan(p)) || 'Dates unknown'}</div>
        <div class="badges">
          <span class="badge branch">${esc(branch.label)}${p.branch_by_marriage ? ' · by marriage' : ''}</span>
          ${lines.map(l => `<span class="badge line">${esc(l)}</span>`).join('')}
          ${p.dna_match ? '<span class="badge dna" title="Known only from a 23andMe match list; relationship unconfirmed">DNA match · low priority</span>' : (p.connected ? '' : '<span class="badge warn">not yet connected</span>')}
        </div>
        ${p.aliases?.length ? `<div class="aliases">Also: ${p.aliases.map(esc).join(', ')}</div>` : ''}
      </div>
      <button class="icon-btn" id="panel-close" title="Close" aria-label="Close details">✕</button>
    </header>
    <div class="panel-body">
      ${section('Vitals', `<dl class="vitals"><dt>Born</dt><dd>${born}</dd><dt>Died</dt><dd>${died}</dd>${p.locations?.length ? `<dt>Places</dt><dd>${p.locations.map(esc).join(' · ')}</dd>` : ''}</dl>`)}
      ${section('Family', group(p.adopted ? 'Adoptive parents' : 'Parents', parents.map(q => chip(q))) + partnerBlocks + group('Siblings', sibs.full.map(q => chip(q))) + group('Half siblings', sibs.half.map(q => chip(q))) || '<p class="muted">No relationships recorded yet.</p>')}
      ${section('Photos &amp; documents', gallery(D, p))}
      ${section('Milestones', items(p.milestones, 'timeline'))}
      ${section('Stories &amp; memories', items(p.notable_stories, 'stories'))}
      ${section('Character', p.personality?.length ? `<div class="traits">${p.personality.map(t => `<span class="trait">${esc(t)}</span>`).join('')}</div>` : '')}
      ${section('Roles', items(p.roles))}
      ${section('Career', items(p.career))}
      ${section('Education', items(p.education))}
      ${section('Childhood', items(p.childhood_experience))}
      ${section('Hard times', items(p.risk_events))}
      ${section('Research notes', items(p.notes, 'notes'))}
      ${section('Sources', items(p.sources, 'sources'))}
    </div>`;

  if (p.photo) {
    const img = new Image();
    img.alt = p.name;
    img.src = p.photo;
    container.querySelector('#panel-photo').replaceChildren(img);
  } else {
    container.querySelector('#panel-photo').innerHTML = `<span class="panel-initials">${esc(initialsOf(p))}</span>`;
  }
}
