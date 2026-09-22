// Left-hand directory: branch filters and an alphabetical list of everyone.
import { lifespan, sortName } from './data.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export class Sidebar {
  constructor(container, D, onPick) {
    this.el = container; this.D = D; this.onPick = onPick;
    this.active = new Set();          // branch keys; empty = all
    this.focusId = null;
    this.render();
    this.el.addEventListener('click', e => {
      const pill = e.target.closest('.pill');
      if (pill) {
        const k = pill.dataset.branch;
        if (this.active.has(k)) this.active.delete(k); else this.active.add(k);
        this.render();
        return;
      }
      if (e.target.closest('.dir-dna')) { this.dnaOpen = !this.el.querySelector('.dir-dna').classList.contains('open'); this.render(); return; }
      const row = e.target.closest('.dir-row');
      if (row) this.onPick(row.dataset.id);
    });
  }

  setFocus(id) {
    this.focusId = id;
    this.el.querySelectorAll('.dir-row.current').forEach(r => r.classList.remove('current'));
    let row = this.el.querySelector(`.dir-row[data-id="${id}"]`);
    if (!row && this.D.person(id)?.dna_match && !this.active.size) {   // open the collapsed DNA section
      this.dnaOpen = true; this.render();
      row = this.el.querySelector(`.dir-row[data-id="${id}"]`);
    }
    if (row) { row.classList.add('current'); row.scrollIntoView({ block: 'nearest' }); }
  }

  render() {
    const D = this.D;
    // DNA-only matches are low priority: left out of counts and filters and
    // kept in a collapsed section at the bottom.
    const family = D.list.filter(p => !p.dna_match);
    const dna = D.list.filter(p => p.dna_match);
    const counts = {};
    for (const p of family) counts[p.branch] = (counts[p.branch] || 0) + 1;
    const pills = [...D.branches.values()].filter(b => counts[b.key]).map(b =>
      `<button class="pill${this.active.has(b.key) ? ' on' : ''}" data-branch="${b.key}" style="--branch:${b.color}"><i></i>${esc(b.label)}<span class="n">${counts[b.key]}</span></button>`).join('');

    const visible = family.filter(p => !this.active.size || this.active.has(p.branch));
    const connected = visible.filter(p => p.connected), loose = visible.filter(p => !p.connected);
    const row = p => `<div class="dir-row${p.id === this.focusId ? ' current' : ''}" data-id="${p.id}" style="--branch:${D.color(p)}"><i></i><span class="dir-name">${esc(displaySurnameFirst(p))}</span><span class="dir-dates">${esc(lifespan(p, { short: true }))}</span></div>`;

    // letter headings by surname
    let lastLetter = '', html = '';
    for (const p of connected) {
      const L = sortName(p)[0]?.toUpperCase() || '#';
      if (L !== lastLetter) { html += `<div class="dir-letter">${L}</div>`; lastLetter = L; }
      html += row(p);
    }
    if (loose.length) html += `<div class="dir-letter muted">Not yet connected (${loose.length})</div>` + loose.map(row).join('');
    if (dna.length && !this.active.size) {
      const open = this.dnaOpen || dna.some(p => p.id === this.focusId);
      html += `<button class="dir-dna${open ? ' open' : ''}" aria-expanded="${open}">DNA matches · low priority <span>${dna.length}</span></button>`;
      if (open) html += `<div class="dir-dna-list"><p class="dir-dna-note">From 23andMe match lists. Relationships are unconfirmed.</p>${dna.map(row).join('')}</div>`;
    }

    this.el.innerHTML = `
      <div class="pills">${pills}${this.active.size ? '<button class="pill clear" data-branch="__clear">clear</button>' : ''}</div>
      <div class="dir-count">${visible.length} people</div>
      <div class="dir">${html}</div>`;
    if (this.active.size) this.el.querySelector('.pill.clear').addEventListener('click', e => { e.stopPropagation(); this.active.clear(); this.render(); });
  }
}

/** "Adams, Alberta (Allen)" */
function displaySurnameFirst(p) {
  const name = p.name.trim();
  const m = name.match(/^(.*?)\s*(\(.*\))$/);
  const core = (m ? m[1] : name).trim(), paren = m ? ' ' + m[2] : '';
  const parts = core.split(/\s+/);
  const suffix = /^(Jr\.?|Sr\.?|I|II|III|IV|#\d+)$/.test(parts[parts.length - 1]) ? ' ' + parts.pop() : '';
  if (parts.length < 2) return core + paren;
  const last = parts.pop();
  return `${last}, ${parts.join(' ')}${suffix}${paren}`;
}
