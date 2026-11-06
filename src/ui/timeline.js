// The Time Scrubber: a bar across the bottom of the screen, or a full-screen list on phones.
import chips from '../data/chips.json';
import timeline from '../data/timeline.json';
import { PALETTE } from '../palette.js';
import { onFrame } from '../world/loop.js';
import { yearAt } from '../world/time.js';
import { leafById } from './leaves.js';
import { stripTags } from './render.js';

const ZONE_COLORS = {
  taproot: PALETTE.fossil,
  'root-india': PALETTE.saffron,
  'root-greece': PALETTE.aegean,
  'trunk-green': PALETTE.vineGreen,
  'trunk-gold': PALETTE.vineGold,
  'trunk-pink': PALETTE.vinePink,
  'trunk-red': PALETTE.vineRed,
  'branch-1': PALETTE.granite,
  'branch-2': PALETTE.forest,
  'branch-3': PALETTE.ember,
};

/** A row's first zone sets its marker color, ignoring notes like "root-india (upper)". */
const colorFor = (row) => ZONE_COLORS[row.zones[0].split(' ')[0]] ?? PALETTE.marble;

const rowChips = (row) => row.sources.map((id) => chips[id]).join(' ');
const leafButtons = (row) =>
  row.leaves
    .map((id) => `<button class="timeline-leaf" type="button" data-timeline-leaf="${id}">${leafById.get(id).title}</button>`)
    .join('');

/** The list view only fits phones well, so narrow screens get it instead of the bar. */
const prefersList = () => window.matchMedia('(max-width: 640px)').matches;

export function createTimeline({ camera, leaves }) {
  const lastIndex = timeline.length - 1;

  const toggle = document.createElement('button');
  toggle.className = 'hud-time pixel-btn';
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '🕰️ <span class="hud-long">TIMELINE</span><span class="hud-short">TIME</span>';

  const bar = document.createElement('section');
  bar.className = 'timeline-bar on-dark';
  bar.setAttribute('aria-label', 'Timeline');
  bar.hidden = true;
  bar.innerHTML = `
    <div class="timeline-caption"></div>
    <div class="timeline-track">
      <div class="timeline-markers" aria-hidden="true">
        ${timeline
          .map((row, i) => `<span class="timeline-marker" data-index="${i}" style="left:${(i / lastIndex) * 100}%;background:${colorFor(row)}"></span>`)
          .join('')}
      </div>
      <input class="timeline-range" type="range" min="0" max="${lastIndex}" step="1" value="0" aria-label="Move through time">
    </div>
  `;

  const list = document.createElement('dialog');
  list.className = 'timeline-list on-dark';
  list.setAttribute('aria-labelledby', 'timeline-list-title');
  list.innerHTML = `
    <header class="rpg-head">
      <h2 class="rpg-title" id="timeline-list-title">🕰️ TIMELINE</h2>
      <button class="rpg-close" type="button" aria-label="Close">✕</button>
    </header>
    <ol class="timeline-rows">
      ${timeline
        .map(
          (row) => `<li style="--marker:${colorFor(row)}">
            <strong class="timeline-date">${row.date}</strong>
            <p>${row.event}</p>
            <p>${rowChips(row)}</p>
            <div class="timeline-leaves">${leafButtons(row)}</div>
          </li>`,
        )
        .join('')}
    </ol>
  `;

  document.body.append(toggle, bar, list);

  const range = bar.querySelector('.timeline-range');
  const caption = bar.querySelector('.timeline-caption');

  function showRow(index) {
    const row = timeline[index];
    range.value = index;
    range.setAttribute('aria-valuetext', `${row.date}: ${stripTags(row.event)}`);
    caption.innerHTML = `<p><strong class="timeline-date">${row.date}</strong> ${row.event} ${rowChips(row)}</p>
      <div class="timeline-leaves">${leafButtons(row)}</div>`;
  }

  /** Opens the bar at whichever event is closest to where the visitor already is. */
  function nearestRow() {
    const year = yearAt(camera.center(), camera.layout);
    let best = 0;
    timeline.forEach((row, i) => {
      if (Math.abs(row.sortYear - year) < Math.abs(timeline[best].sortYear - year)) best = i;
    });
    return best;
  }

  function setBarOpen(open) {
    bar.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) {
      showRow(nearestRow());
      range.focus({ preventScroll: true });
    }
  }

  function toggleTimeline() {
    if (prefersList()) {
      if (list.open) list.close();
      else list.showModal();
    } else setBarOpen(bar.hidden);
  }

  toggle.addEventListener('click', toggleTimeline);
  list.querySelector('.rpg-close').addEventListener('click', () => list.close());
  list.addEventListener('click', (event) => {
    if (event.target === list) list.close();
  });

  // Dragging only flies the camera, and quickly. Opening a leaf takes a deliberate click.
  let pendingScrub = null;
  range.addEventListener('input', () => {
    const index = Number(range.value);
    showRow(index);
    pendingScrub = index;
  });
  onFrame(() => {
    if (pendingScrub === null) return;
    const button = document.getElementById(`leaf-${timeline[pendingScrub].leaves[0]}`);
    pendingScrub = null;
    camera.centerOn(button, { duration: 350 });
  });

  bar.querySelector('.timeline-markers').addEventListener('click', (event) => {
    const marker = event.target.closest('.timeline-marker');
    if (!marker) return;
    const index = Number(marker.dataset.index);
    showRow(index);
    leaves.travelAndOpen(timeline[index].leaves[0]);
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-timeline-leaf]');
    if (!button) return;
    if (list.open) list.close();
    leaves.travelAndOpen(button.dataset.timelineLeaf);
  });

  document.addEventListener('keydown', (event) => {
    // With a dialog open, Esc belongs to the dialog, not the bar behind it.
    if (event.key === 'Escape' && !bar.hidden && !document.querySelector('dialog[open]')) {
      setBarOpen(false);
      toggle.focus({ preventScroll: true });
    }
  });

  return { toggle: toggleTimeline };
}
