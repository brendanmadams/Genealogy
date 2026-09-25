// "Suggest a correction or addition": a form that sends a suggestion to the
// submissions Worker (worker/), which files it for review in a private repo.
// Nothing appears on the site until it is reviewed.
// The form starts "about" the person it was opened from, but that can be
// changed to anyone else, or to no one in particular. "A missing relative"
// asks for the new person's name and how they fit in.
import { displayName, lifespan } from './data.js';
import { SUGGEST } from './config.js';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const suggestEnabled = () => Boolean(SUGGEST.endpoint && SUGGEST.turnstileSiteKey);

const RELATIONS = [
  ['parent', 'Their parent (father or mother)'],
  ['child', 'Their child (son or daughter)'],
  ['sibling', 'Their brother or sister'],
  ['spouse', 'Their husband, wife or partner'],
  ['other', 'Some other relation, or not sure'],
];

let turnstileLoading = null;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  turnstileLoading ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = () => resolve(window.turnstile);
    s.onerror = () => { turnstileLoading = null; reject(new Error('spam check failed to load')); };
    document.head.appendChild(s);
  });
  return turnstileLoading;
}

export class Suggest {
  constructor(D) {
    this.D = D;
    this.el = document.createElement('div');
    this.el.id = 'suggest';
    this.el.hidden = true;
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-labelledby', 'sg-title');
    document.body.appendChild(this.el);
    this.el.addEventListener('click', e => {
      if (e.target === this.el || e.target.closest('.sg-close')) return this.close();
      if (e.target.closest('.sg-change')) return this.showPicker(true);
      if (e.target.closest('.sg-none')) { this.setPerson(null); return this.showPicker(false); }
      const hit = e.target.closest('[data-pick]');
      if (hit) { this.setPerson(this.D.person(hit.dataset.pick)); this.showPicker(false); }
    });
    this.el.addEventListener('submit', e => { e.preventDefault(); this.send(); });
    this.el.addEventListener('input', e => { if (e.target.classList.contains('sg-find')) this.findPeople(e.target.value); });
    this.el.addEventListener('change', e => {
      if (e.target.name === 'files') this.el.querySelector('.sg-permission').hidden = !e.target.files.length;
      if (['kind', 'new_status'].includes(e.target.name)) this.refresh();
    });
    document.addEventListener('keydown', e => {
      if (!this.el.hidden && e.key === 'Escape') { e.stopPropagation(); this.close(); }
    }, true);
  }

  /** p: the person the suggestion is about (or null); kind: the starting choice. */
  open(p = null, { kind } = {}) {
    this.el.innerHTML = `
      <form class="sg-frame" novalidate>
        <button type="button" class="icon-btn sg-close" aria-label="Close">✕</button>
        <h2 id="sg-title">Suggest a correction or addition</h2>
        <p class="muted sg-intro">Your suggestion goes to Brendan for review. Nothing is published until it has been checked, and your name and email are never shown on the site.</p>

        <div class="sg-about-row">
          <span class="sg-about-label">About</span>
          <span class="sg-about-who"></span>
          <button type="button" class="link-btn sg-change">Change</button>
        </div>
        <div class="sg-picker search" hidden>
          <input class="sg-find" type="search" placeholder="Search for a person…" autocomplete="off" aria-label="Search for the person this is about" />
          <div class="dropdown sg-results"></div>
          <button type="button" class="link-btn sg-none">Not about one person, or not sure</button>
        </div>

        <label>What kind of suggestion?
          <select name="kind">
            <option value="correction">Something here is wrong</option>
            <option value="addition">New information (dates, places, stories)</option>
            <option value="relative">A missing relative</option>
            <option value="media">A photo or document</option>
            <option value="other">Something else</option>
          </select>
        </label>

        <fieldset class="sg-relative" hidden>
          <legend>The missing relative</legend>
          <label>Their name <span class="req">required</span>
            <input name="new_name" maxlength="150" placeholder="Full name, including maiden name if you know it" />
          </label>
          <label class="sg-rel-select">How are they related to <span class="sg-rel-who"></span>?
            <select name="new_relation">${RELATIONS.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</select>
          </label>
          <div class="sg-radios" role="radiogroup" aria-label="Are they living?">
            <span class="sg-radios-label">Are they living?</span>
            <label class="sg-check"><input type="radio" name="new_status" value="died" /> No, they have died</label>
            <label class="sg-check"><input type="radio" name="new_status" value="living" /> Yes</label>
            <label class="sg-check"><input type="radio" name="new_status" value="unsure" checked /> Not sure</label>
          </div>
          <div class="sg-dates">
            <label>Born <span class="muted">(year or date, roughly is fine)</span> <input name="new_born" maxlength="60" /></label>
            <label>Died <input name="new_died" maxlength="60" /></label>
            <label>Where they lived <input name="new_place" maxlength="200" /></label>
          </div>
        </fieldset>

        <label><span class="sg-details-label">What should change?</span> <span class="req sg-details-req">required</span>
          <textarea name="details" rows="4" maxlength="5000"></textarea>
        </label>
        <label>How do you know?
          <textarea name="source" rows="2" maxlength="2000" placeholder="A certificate, obituary, family Bible, your own memory…"></textarea>
        </label>
        <p class="muted sg-note">Please leave out addresses and health details.</p>

        <label>Photos or documents <span class="muted">(optional, up to 3; JPEG, PNG, WebP, GIF or PDF, 8 MB each)</span>
          <input type="file" name="files" multiple accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" />
        </label>
        <label class="sg-check sg-permission" hidden><input type="checkbox" name="permission" value="yes" /> I took these myself or have permission to share them.</label>

        <fieldset>
          <legend>About you <span class="muted">(optional, in case there are questions)</span></legend>
          <label>Your name <input name="name" maxlength="120" autocomplete="name" /></label>
          <label>Your email <input name="email" type="email" maxlength="200" autocomplete="email" /></label>
          <label><span class="sg-you-label">How are you related to them?</span> <input name="relation" maxlength="200" placeholder="e.g. granddaughter" /></label>
        </fieldset>

        <input class="sg-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <input type="hidden" name="person_id" />
        <input type="hidden" name="person_name" />
        <div class="sg-turnstile"></div>
        <p class="sg-status" role="status" aria-live="polite"></p>
        <div class="sg-actions">
          <button type="button" class="link-btn sg-close">Cancel</button>
          <button type="submit" class="sg-send">Send suggestion</button>
        </div>
      </form>`;
    const form = this.el.querySelector('form');
    if (kind) form.kind.value = kind;
    this.setPerson(p);
    this.el.hidden = false;
    form.kind.focus();
    this.widget = null;
    loadTurnstile()
      .then(ts => { if (!this.el.hidden) this.widget = ts.render(this.el.querySelector('.sg-turnstile'), { sitekey: SUGGEST.turnstileSiteKey, theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark', 'error-callback': () => { this.status('The spam check ran into a problem. Please reload the page and try again.', true); return true; } }); })
      .catch(() => this.status('The spam check could not load. Please check your connection and try again.', true));
  }

  setPerson(p) {
    this.person = p || null;
    const form = this.el.querySelector('form');
    if (!form) return;
    form.person_id.value = p ? p.id : '';
    form.person_name.value = p ? displayName(p) : '';
    this.el.querySelector('.sg-about-who').innerHTML = p
      ? `<span class="chip" style="--branch:${this.D.color(p)}"><span class="chip-name">${esc(displayName(p))}</span>${lifespan(p, { short: true }) ? `<span class="chip-sub">${esc(lifespan(p, { short: true }))}</span>` : ''}</span>`
      : '<span class="muted">No one in particular</span>';
    this.refresh();
  }

  showPicker(on) {
    const pk = this.el.querySelector('.sg-picker');
    pk.hidden = !on;
    this.el.querySelector('.sg-change').hidden = on;
    if (on) { const i = pk.querySelector('.sg-find'); i.value = ''; this.findPeople(''); i.focus(); }
  }

  findPeople(q) {
    const drop = this.el.querySelector('.sg-results');
    const hits = q.trim() ? this.D.search(q, 8) : [];
    drop.innerHTML = hits.map(p => `<div class="hit" data-pick="${p.id}"><i style="--branch:${this.D.color(p)}"></i><div><div class="hit-name">${esc(displayName(p))}</div><div class="hit-sub">${esc(lifespan(p) || '')}</div></div></div>`).join('')
      || (q.trim() ? '<div class="hit none">No one by that name. Choose "Not about one person" below and describe them.</div>' : '');
    drop.classList.toggle('show', Boolean(drop.innerHTML));
  }

  /** Show the fields that fit the kind of suggestion, the person and the living status. */
  refresh() {
    const form = this.el.querySelector('form');
    if (!form) return;
    const relative = form.kind.value === 'relative';
    const nm = this.person ? displayName(this.person) : null;
    this.el.querySelector('.sg-relative').hidden = !relative;
    this.el.querySelector('.sg-rel-select').hidden = !this.person;
    if (nm) this.el.querySelector('.sg-rel-who').textContent = nm;
    this.el.querySelector('.sg-details-label').textContent = relative
      ? (this.person ? 'Anything else about them?' : 'How do they fit into the family?')
      : 'What should change?';
    this.el.querySelector('.sg-details-req').textContent = relative && this.person ? 'optional' : 'required';
    form.details.placeholder = relative
      ? (this.person ? 'e.g. She was the youngest; she married a Mr. Jones in Seattle.' : 'e.g. Daughter of Ellen Ball McPhail, born in Lynden about 1885.')
      : 'e.g. She was born on 3 May 1921 in Everett, not 1920.';
    this.el.querySelector('.sg-you-label').textContent = relative ? 'How are you related to the missing relative?' : nm ? `How are you related to ${nm}?` : 'How are you related to the family?';
  }

  close() {
    if (this.widget != null && window.turnstile) try { window.turnstile.remove(this.widget); } catch {}
    this.widget = null;
    this.el.hidden = true;
    this.el.replaceChildren();
  }

  status(text, bad = false) {
    const s = this.el.querySelector('.sg-status');
    if (s) { s.textContent = text; s.classList.toggle('bad', bad); }
  }

  async send() {
    const form = this.el.querySelector('form');
    const data = new FormData(form);
    const relative = data.get('kind') === 'relative';
    const files = form.elements.files.files;
    if (relative) {
      if (String(data.get('new_name')).trim().length < 2) return this.status('Please give the missing relative’s name.', true);
      if (!this.person && String(data.get('details')).trim().length < 10) return this.status('Please say how they fit into the family.', true);
      if (!this.person) data.delete('new_relation');
    } else {
      ['new_name', 'new_relation', 'new_status', 'new_born', 'new_died', 'new_place'].forEach(k => data.delete(k));
      if (String(data.get('details')).trim().length < 10) return this.status('Please describe the change in a sentence or two.', true);
    }
    if (files.length > 3) return this.status('Please attach at most 3 files.', true);
    if ([...files].some(f => f.size > 8 * 1024 * 1024)) return this.status('Each file must be 8 MB or smaller.', true);
    if (files.length && !data.get('permission')) return this.status('Please confirm you have the right to share the attached files.', true);
    if (!data.get('cf-turnstile-response')) return this.status('Please wait for the spam check to finish, then send again.', true);

    const btn = form.querySelector('.sg-send');
    btn.disabled = true;
    this.status('Sending…');
    try {
      const res = await fetch(SUGGEST.endpoint, { method: 'POST', body: data });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || 'The suggestion could not be sent.');
      const about = relative ? `about <strong>${esc(String(data.get('new_name')).trim())}</strong>` : this.person ? `about <strong>${esc(displayName(this.person))}</strong>` : '';
      form.innerHTML = `
        <button type="button" class="icon-btn sg-close" aria-label="Close">✕</button>
        <h2 id="sg-title">Thank you</h2>
        <p>Your suggestion ${about} has been received and will be reviewed before anything changes on the site.</p>
        ${out.ref ? `<p class="muted">Reference: ${esc(out.ref)}</p>` : ''}
        <div class="sg-actions"><button type="button" class="sg-send sg-close">Close</button></div>`;
    } catch (err) {
      btn.disabled = false;
      this.status(err.message, true);
      if (this.widget != null && window.turnstile) window.turnstile.reset(this.widget);
    }
  }
}
