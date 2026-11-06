// The settings gear: sound, motion, keyboard shortcuts, climber color, the key legend, and Read Mode.
import { sfx } from '../audio/sfx.js';
import { motionAllowed } from '../world/motion.js';
import { settings } from '../world/settings.js';

const COLORS = [
  ['green', '🟢 GREEN'],
  ['orange', '🟠 ORANGE'],
  ['gold', '⭐ GOLD'],
];

export function createSettingsPanel({ showLegend }) {
  const wrap = document.createElement('div');
  wrap.className = 'settings';
  wrap.innerHTML = `
    <button class="pixel-btn hud-gear" type="button" aria-expanded="false" aria-controls="settings-panel" aria-label="Settings">⚙️</button>
    <section class="settings-panel on-dark" id="settings-panel" aria-labelledby="settings-title" hidden>
      <h2 id="settings-title">SETTINGS</h2>
      <button class="setting-toggle" type="button" data-setting="sound">🔊 SOUND <b></b></button>
      <button class="setting-toggle" type="button" data-setting="motion">✨ MOTION <b></b></button>
      <p class="setting-note motion-note"></p>
      <button class="setting-toggle" type="button" data-setting="shortcuts">⌨️ KEY SHORTCUTS <b></b></button>
      <div class="setting-colors" role="group" aria-label="Climber color">
        <p class="setting-label">🎨 CLIMBER</p>
        ${COLORS.map(([id, label]) => `<button class="setting-color" type="button" data-color="${id}" aria-pressed="false">${label}</button>`).join('')}
      </div>
      <button class="setting-toggle" type="button" data-legend>❓ SHOW THE KEYS</button>
      <a class="setting-toggle" href="read.html">📖 READ MODE</a>
    </section>
  `;

  const gear = wrap.querySelector('.hud-gear');
  const panel = wrap.querySelector('.settings-panel');

  function refresh() {
    const states = { sound: settings.get('sound'), motion: motionAllowed(), shortcuts: settings.get('shortcuts') };
    for (const [name, on] of Object.entries(states)) {
      const button = panel.querySelector(`[data-setting="${name}"]`);
      button.setAttribute('aria-pressed', String(on));
      button.querySelector('b').textContent = on ? 'ON' : 'OFF';
    }
    panel.querySelector('.motion-note').textContent = settings.get('motion')
      ? 'Your choice. It overrides your device setting.'
      : 'Following your device setting.';
    for (const button of panel.querySelectorAll('[data-color]')) {
      button.setAttribute('aria-pressed', String(button.dataset.color === settings.get('climber')));
      button.hidden = button.dataset.color === 'gold' && !settings.get('goldUnlocked');
    }
  }

  function setOpen(open, { returnFocus = false } = {}) {
    panel.hidden = !open;
    gear.setAttribute('aria-expanded', String(open));
    if (open) {
      refresh();
      panel.querySelector('button').focus({ preventScroll: true });
    } else if (returnFocus) {
      gear.focus({ preventScroll: true });
    }
  }

  gear.addEventListener('click', () => setOpen(panel.hidden));
  panel.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-setting]');
    const color = event.target.closest('[data-color]');
    if (toggle) {
      const name = toggle.dataset.setting;
      if (name === 'motion') settings.set('motion', motionAllowed() ? 'off' : 'on');
      else settings.set(name, !settings.get(name));
      if (name === 'sound' && settings.get('sound')) sfx.start();
    } else if (color) {
      settings.set('climber', color.dataset.color);
    } else if (event.target.closest('[data-legend]')) {
      setOpen(false);
      showLegend();
    }
    refresh();
  });
  document.addEventListener('click', (event) => {
    if (!panel.hidden && !wrap.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden && !document.querySelector('dialog[open]')) setOpen(false, { returnFocus: true });
  });
  settings.subscribe(refresh);
  refresh();
  return wrap;
}
