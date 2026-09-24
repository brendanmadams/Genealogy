// App shell: routing, focus state, search, landing page.
import { loadFamily, lifespan, byBirth, displayName } from './data.js';
import { layoutFocus } from './layout.js';
import { layoutPedigree } from './pedigree.js';
import { layoutDescendants } from './descendants.js';
import { Renderer } from './render.js';
import { renderPanel } from './panel.js';
import { Sidebar } from './sidebar.js';
import { Viewer } from './viewer.js';
import { Suggest, suggestEnabled } from './suggest.js';
import { Ask } from './ask.js';

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const RECENT_KEY = 'familytree.recent';
const store = {
  get() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; } },
  push(id) { try { const r = [id, ...this.get().filter(x => x !== id)].slice(0, 8); localStorage.setItem(RECENT_KEY, JSON.stringify(r)); } catch { /* private mode etc. */ } },
};

// who the viewer is, for "How are we related?" (this browser only)
const ME_KEY = 'familytree.me';
const me = {
  get() { try { const id = localStorage.getItem(ME_KEY); return id && D.person(id) ? id : null; } catch { return null; } },
  set(id) { try { id ? localStorage.setItem(ME_KEY, id) : localStorage.removeItem(ME_KEY); } catch { /* private mode etc. */ } },
};
let compareId = null;   // someone picked in the panel's compare box

let D, renderer, sidebar, viewer, suggest, ask, focusId = null;

async function main() {
  try { D = await loadFamily(); }
  catch (e) {
    $('#landing').innerHTML = `<div class="landing-card"><h2>Could not load the family data</h2><p>${esc(e.message)}</p><p class="muted">If you opened this file directly, serve the folder instead (for example <code>npx serve .</code>) — browsers block data loading from <code>file://</code>.</p></div>`;
    return;
  }
  renderer = new Renderer($('#svg'), D, focus);
  sidebar = new Sidebar($('#dir'), D, focus);
  viewer = new Viewer(D, focus);
  suggest = new Suggest(D);
  ask = new Ask(D, { getView: () => ({ focusId, view, gens: gens[view] }), getMe: () => me.get(), onPick: id => focus(id), onSuggest: id => suggest.open(id ? D.person(id) : null) });
  wireHeader();
  wirePanel();
  window.addEventListener('hashchange', route);
  window.addEventListener('resize', () => renderer.fit(false));
  route();
  // card names are measured; redraw once the web font has loaded
  document.fonts?.ready?.then(() => { if (focusId) showPerson(focusId); });
}

// ── Routing: #/p/<id>  |  #/p/<id>/(ancestors|descendants)[/<generations|all>] ─
let view = 'family';
const gens = { ancestors: 4, descendants: 3 };   // remembered per chart type

function route() {
  const m = location.hash.match(/^#\/p\/([\w-]+)(?:\/(ancestors|descendants)(?:\/(\d+|all))?)?/);
  const id = m && D.person(m[1]) ? m[1] : null;
  if (!id) return showLanding();
  view = m[2] || 'family';
  if (m[2] && m[3]) gens[view] = m[3] === 'all' ? 99 : Math.max(1, Math.min(99, Number(m[3])));
  showPerson(id);
}
function hashFor(id, v = view, g = gens[v]) {
  if (v === 'family') return `#/p/${id}`;
  return `#/p/${id}/${v}/${g >= 99 ? 'all' : g}`;
}

const CHARTS = {
  ancestors: { layout: layoutPedigree, title: 'Ancestors of', noun: 'ancestor', empty: 'No parents are recorded for this person yet.' },
  descendants: { layout: layoutDescendants, title: 'Descendants of', noun: 'descendant', empty: 'No children are recorded for this person yet.' },
};
function focus(id, v = view) {
  if (!D.person(id)) return;
  const h = hashFor(id, v);
  if (location.hash !== h) location.hash = h;   // triggers route()
  else showPerson(id);
}

function showPerson(id) {
  focusId = id;
  const p = D.person(id);
  $('#landing').hidden = true;
  $('#svg').classList.remove('hidden');
  $('#view-bar').hidden = false;
  $('#tab-family').setAttribute('aria-selected', view === 'family');
  $('#tab-ancestors').setAttribute('aria-selected', view === 'ancestors');
  $('#tab-descendants').setAttribute('aria-selected', view === 'descendants');
  document.body.dataset.view = view;
  const chart = CHARTS[view];
  if (chart) {
    const g = gens[view];
    const L = chart.layout(D, p, g);
    const max = L.depth, shown = Math.min(g, max);
    $('#gen-ctl').hidden = false;
    $('#gen-count').textContent = shown || 0;
    $('#gen-max').textContent = max ? `(${max})` : '';
    $('#gen-less').disabled = shown <= 1;
    $('#gen-more').disabled = g >= max;
    $('#gen-all').disabled = g >= max;
    $('#print-title').innerHTML = max
      ? `<h1>${chart.title} ${esc(displayName(p))}</h1><p>${esc(lifespan(p))}${lifespan(p) ? ' · ' : ''}${L.count} ${chart.noun}${L.count === 1 ? '' : 's'} in ${L.shownDepth} generation${L.shownDepth === 1 ? '' : 's'} · printed ${new Date().toLocaleDateString()}</p>`
      : '';
    if (!max) L.emptyMessage = chart.empty;
    renderer.draw(L);
  } else {
    $('#gen-ctl').hidden = true;
    renderer.draw(layoutFocus(D, p));
  }
  renderPanelFor(p);
  // On wide screens the details panel opens automatically; wait for its column
  // to finish opening before fitting the tree into the remaining space.
  // (The ancestor and descendant charts are wide, so they leave the panel as the user set it.)
  const opening = view === 'family' && !document.body.classList.contains('has-panel') && !matchMedia('(max-width: 900px)').matches;
  if (opening) document.body.classList.add('has-panel');
  setTimeout(() => renderer.fit(true), opening ? 280 : 0);
  sidebar.setFocus(id);
  store.push(id);
  document.title = `${displayName(p)} · Family Tree`;
}

function showLanding() {
  focusId = null;
  $('#view-bar').hidden = true;
  document.body.classList.remove('has-panel');
  $('#svg').classList.add('hidden');
  sidebar.setFocus(null);
  document.title = 'Adams · McKeldin Family Tree';
  const recent = store.get().map(id => D.person(id)).filter(Boolean);
  const chip = p => `<button class="chip" data-id="${p.id}" style="--branch:${D.color(p)}"><span class="chip-name">${esc(displayName(p))}</span>${lifespan(p, { short: true }) ? `<span class="chip-sub">${esc(lifespan(p, { short: true }))}</span>` : ''}</button>`;
  const lines = [...D.branches.values()].filter(b => b.roots?.length).map(b => {
    const roots = byBirth(b.roots.map(id => D.person(id)).filter(Boolean));
    const first = roots[0];
    return `<div class="line" style="--branch:${b.color}"><div class="line-name"><i></i>${esc(b.label)}</div><div class="chips">${roots.map(chip).join('')}</div>${first ? `<a class="line-desc" href="${hashFor(first.id, 'descendants', 99)}">All descendants →</a>` : ''}</div>`;
  }).join('');
  $('#landing').innerHTML = `
    <div class="landing-card">
      <h1>Adams · McKeldin Family Tree</h1>
      <p class="lede">${D.meta.family_members ?? D.meta.people} people across ${D.meta.families} families. Pick anyone to see their parents, grandparents, brothers and sisters, spouses, children and grandchildren. Click any card to move through the family, or switch to <strong>Ancestors</strong> or <strong>Descendants</strong> for printable charts.</p>
      <div class="landing-search"><input id="landing-search" type="search" placeholder="Search for a name, place or year…" autocomplete="off" /><div class="dropdown" id="landing-results"></div></div>
      ${recent.length ? `<h3>Recently viewed</h3><div class="chips">${recent.map(chip).join('')}</div>` : ''}
      <h3>Start from the earliest known ancestors</h3>
      <div class="lines">${lines}</div>
      ${suggestEnabled() ? `<p class="landing-suggest">Know someone who’s missing, or spotted a mistake? <button class="link-btn" id="landing-suggest">Suggest an addition or correction</button></p>` : ''}
    </div>`;
  $('#landing').hidden = false;
  wireSearch($('#landing-search'), $('#landing-results'));
  $('#landing-suggest')?.addEventListener('click', () => suggest.open(null, { kind: 'relative' }));
  $('#landing-search').focus();
}

// ── Header / search ─────────────────────────────────────────────────────────
function wireHeader() {
  wireSearch($('#search'), $('#search-results'));
  $('#ask-form').addEventListener('submit', e => { e.preventDefault(); const q = $('#ask').value.trim(); if (q) { ask.ask(q); $('#ask').value = ''; $('#ask').blur(); } });
  $('#btn-ask').addEventListener('click', () => ask.openEmpty());
  $('#btn-home').addEventListener('click', () => { location.hash = ''; });
  wireTheme();
  $('#btn-fit').addEventListener('click', () => renderer.fit(true));
  $('#zoom-in').addEventListener('click', () => renderer.zoomBy(1.3));
  $('#zoom-out').addEventListener('click', () => renderer.zoomBy(1 / 1.3));
  $('#btn-dir').addEventListener('click', () => document.body.classList.toggle('dir-open'));
  // chart type and generations
  $('#tab-family').addEventListener('click', () => focusId && focus(focusId, 'family'));
  $('#tab-ancestors').addEventListener('click', () => focusId && focus(focusId, 'ancestors'));
  $('#tab-descendants').addEventListener('click', () => focusId && focus(focusId, 'descendants'));
  const setGen = g => { gens[view] = g; location.hash = hashFor(focusId, view, g); };
  $('#gen-less').addEventListener('click', () => setGen(Math.max(1, Number($('#gen-count').textContent) - 1)));
  $('#gen-more').addEventListener('click', () => setGen(Math.min(99, Number($('#gen-count').textContent) + 1)));
  $('#gen-all').addEventListener('click', () => setGen(99));
  $('#btn-print').addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => renderer.printMode(true));
  window.addEventListener('afterprint', () => renderer.printMode(false));
  $('#btn-panel').addEventListener('click', () => { document.body.classList.toggle('has-panel'); setTimeout(() => renderer.fit(true), 280); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { document.body.classList.remove('dir-open'); closeDropdowns(); }
    if (e.key === '/' && !/input|textarea/i.test(document.activeElement?.tagName)) { e.preventDefault(); $('#search').focus(); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) closeDropdowns(); });
  // chips anywhere (panel, landing) focus a person
  document.addEventListener('click', e => {
    const c = e.target.closest('.chip[data-id]');
    if (c) focus(c.dataset.id);
  });
}
function closeDropdowns() { document.querySelectorAll('.dropdown.show').forEach(d => d.classList.remove('show')); }

function wireSearch(input, drop, onPick = focus) {
  let sel = -1, hits = [];
  const render = () => {
    drop.innerHTML = hits.map((p, i) => `<div class="hit${i === sel ? ' sel' : ''}" data-id="${p.id}" style="--branch:${D.color(p)}"><i></i><div><div class="hit-name">${esc(displayName(p))}</div><div class="hit-sub">${esc([p.dna_match ? 'DNA match · low priority' : '', lifespan(p), p.locations?.[0]].filter(Boolean).join(' · '))}</div></div></div>`).join('')
      || `<div class="hit none">No one found</div>`;
    drop.classList.add('show');
  };
  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) { drop.classList.remove('show'); return; }
    hits = D.search(q); sel = hits.length ? 0 : -1; render();
  });
  input.addEventListener('keydown', e => {
    if (!drop.classList.contains('show')) return;
    if (e.key === 'ArrowDown') { sel = Math.min(hits.length - 1, sel + 1); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); render(); e.preventDefault(); }
    else if (e.key === 'Enter' && hits[sel]) { pick(hits[sel].id); }
  });
  drop.addEventListener('click', e => { const h = e.target.closest('.hit[data-id]'); if (h) pick(h.dataset.id); });
  const pick = id => { input.value = ''; drop.classList.remove('show'); onPick(id); };
}

// ── Panel ───────────────────────────────────────────────────────────────────
// ── Light / dark (dark unless this browser chose light) ─────────────────────
const THEME_KEY = 'familytree.theme';
function wireTheme() {
  const btn = $('#btn-theme');
  const show = () => {
    const light = document.documentElement.dataset.theme === 'light';
    btn.textContent = light ? '☾' : '☀';
    btn.title = btn.ariaLabel = light ? 'Switch to dark mode' : 'Switch to light mode';
  };
  btn.addEventListener('click', () => {
    const light = document.documentElement.dataset.theme !== 'light';
    if (light) document.documentElement.dataset.theme = 'light'; else delete document.documentElement.dataset.theme;
    try { localStorage.setItem(THEME_KEY, light ? 'light' : 'dark'); } catch { /* private mode etc. */ }
    show();
  });
  show();
}

function renderPanelFor(p) {
  if (compareId && !D.person(compareId)) compareId = null;
  renderPanel($('#panel'), D, p, { me: me.get(), other: compareId !== p.id ? compareId : null });
  const input = $('#rel-input');
  if (input) wireSearch(input, $('#rel-results'), id => { compareId = id; renderPanelFor(p); });
}
function wirePanel() {
  $('#panel').addEventListener('click', e => {
    if (e.target.closest('#panel-close')) { document.body.classList.remove('has-panel'); setTimeout(() => renderer.fit(true), 280); }
    const p = focusId && D.person(focusId);
    if (p && e.target.closest('#rel-me')) { me.set(p.id); compareId = null; renderPanelFor(p); }
    if (p && e.target.closest('#rel-forget')) { me.set(null); renderPanelFor(p); }
    if (p && e.target.closest('#rel-clear')) { compareId = null; renderPanelFor(p); }
    const m = e.target.closest('.media[data-media]');
    if (m) viewer.open(m.dataset.media);
    if (p && e.target.closest('#panel-suggest')) suggest.open(p);
  });
}

main();
