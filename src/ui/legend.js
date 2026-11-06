// The key legend from DESIGN.md §5. It appears once, on a first visit with a mouse and keyboard,
// and steps aside as soon as the visitor starts exploring. Settings and the ? key bring it back.
import { settings } from '../world/settings.js';

const KEYS = [
  ['↑ ↓ / W S', 'Move through the tree'],
  ['← → / A D', 'Step between leaves'],
  ['Enter / Space', 'Open or advance a leaf'],
  ['Esc', 'Close'],
  ['M', 'Map'],
  ['T', 'Timeline'],
  ['R', 'Read Mode'],
];

export function createLegend() {
  const legend = document.createElement('aside');
  legend.className = 'key-legend on-dark';
  legend.setAttribute('aria-labelledby', 'legend-title');
  legend.hidden = true;
  legend.innerHTML = `
    <h2 id="legend-title">KEYS</h2>
    <button class="rpg-close legend-close" type="button" aria-label="Close the key legend">✕</button>
    <dl>${KEYS.map(([key, what]) => `<dt>${key}</dt><dd>${what}</dd>`).join('')}</dl>
  `;
  document.body.append(legend);

  const hide = () => {
    legend.hidden = true;
  };
  legend.querySelector('.legend-close').addEventListener('click', hide);

  function show({ temporary = false } = {}) {
    legend.hidden = false;
    if (!temporary) return;
    // Once the visitor starts scrolling, they've got it.
    const away = () => {
      hide();
      window.removeEventListener('scroll', away);
    };
    setTimeout(() => window.addEventListener('scroll', away, { passive: true }), 1500);
  }

  return {
    show,
    hide,
    toggle: () => (legend.hidden ? show() : hide()),
    /** Called when the game starts: shows the legend once, for keyboard and mouse visitors. */
    firstVisit() {
      if (settings.get('legendSeen') || !window.matchMedia('(pointer: fine)').matches) return;
      settings.set('legendSeen', true);
      show({ temporary: true });
    },
  };
}
