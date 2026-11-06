// The minimap: a tiny tree with a blinking dot. Click a zone to fly there.
import { PALETTE } from '../palette.js';
import { onFrame } from '../world/loop.js';
import { pixelText } from './render.js';
import { ZONES, zoneById } from '../world/zones.js';

/** One character per pixel, per DESIGN.md §7. Zones get similar sizes so each one is easy to tap. */
const GRID = [
  '.....cccccccc.....',
  '...cccccccccccc...',
  '..cccccccccccccc..',
  '..cccccccccccccc..',
  '...tttttttttttt...',
  '..tttttttttttttt..',
  '..tttttttttttttt..',
  '...tttttttttttt...',
  '.gggggggggggg.....',
  '.gggggggggggg..x..',
  '.gggggggggggg..x..',
  '.gggggggggggg..x..',
  '111111222222333333',
  '111111222222333333',
  '.11111222222.3333.',
  '..1111222222333...',
  '....11222222333...',
  '......222222......',
  '......kkkkkk......',
  '......kkkkkk......',
  '......kkkkkk......',
  '......kkkkkk......',
  '......kkkkkk......',
  '......kkkkkk......',
  '......kkkkkk......',
  '......kkkkkk......',
  'ssssssssssssssssss',
  'ssssssssssssssssss',
  'ssssssssssssssssss',
  'iiiiiiiiirrrrrrrrr',
  '.iiiiiiiirrrrrrrr.',
  '..iiiiiiirrrrrrr..',
  '...iiiiiirrrrrr...',
  '....iiiiirrrrr....',
  '.....iiiirrrr.....',
  '......iiirrr......',
  '......pppppp......',
  '......pppppp......',
  '......pppppp......',
  '......pppppp......',
  '......pppppp......',
  '......pppppp......',
];

const CHAR_TO_ZONE = {
  c: 'canopy',
  t: 'tangle',
  g: 'graft',
  1: 'branch-1',
  2: 'branch-2',
  3: 'branch-3',
  k: 'trunk',
  s: 'surface',
  i: 'root-india',
  r: 'root-greece',
  p: 'taproot',
};

const CELL = 6;
const WIDTH = GRID[0].length;
const HEIGHT = GRID.length;

/** The box each zone fills on the map, in grid cells. */
function zoneBoxes() {
  const boxes = {};
  GRID.forEach((row, y) => {
    [...row].forEach((char, x) => {
      const id = CHAR_TO_ZONE[char];
      if (!id) return;
      const box = (boxes[id] ??= { left: x, right: x + 1, top: y, bottom: y + 1 });
      box.left = Math.min(box.left, x);
      box.right = Math.max(box.right, x + 1);
      box.bottom = Math.max(box.bottom, y + 1);
    });
  });
  return boxes;
}

const label = ({ name, role }) => `${name}: ${role}`;

export function createMinimap({ camera }) {
  const boxes = zoneBoxes();
  const nav = document.createElement('nav');
  nav.className = 'minimap';
  nav.setAttribute('aria-label', 'Map of the tree');

  const zoneButtons = ZONES.map((zone) => {
    const box = boxes[zone.id];
    const style =
      `left:${box.left * CELL}px;top:${box.top * CELL}px;` +
      `width:${(box.right - box.left) * CELL}px;height:${(box.bottom - box.top) * CELL}px`;
    const text = label(zone).replace(/"/g, '&quot;');
    return `<button class="map-zone" type="button" data-fly="${zone.id}" style="${style}" data-label="${text}" aria-label="${text}"></button>`;
  }).join('');

  const listItems = ZONES.map(
    (zone) => `<li><button class="map-list-btn" type="button" data-fly="${zone.id}">
      <span class="map-swatch" style="background:${zone.color}"></span>
      <span>${pixelText(zone.name)}<small>${pixelText(zone.role)}</small></span>
    </button></li>`,
  ).join('');

  nav.innerHTML = `
    <button class="map-toggle pixel-btn" type="button" aria-expanded="false" aria-controls="map-list">🗺️ <span class="map-word">MAP</span></button>
    <div class="map-body">
      <div class="map-silhouette" style="width:${WIDTH * CELL}px;height:${HEIGHT * CELL}px">
        <canvas width="${WIDTH}" height="${HEIGHT}" aria-hidden="true"></canvas>
        ${zoneButtons}
        <span class="map-dot" aria-hidden="true"></span>
      </div>
      <ol class="map-list" id="map-list" hidden>${listItems}</ol>
    </div>
  `;
  document.body.append(nav);

  const toggle = nav.querySelector('.map-toggle');
  const list = nav.querySelector('.map-list');
  const dot = nav.querySelector('.map-dot');
  const context = nav.querySelector('canvas').getContext('2d');

  function draw(activeIds) {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    GRID.forEach((row, y) => {
      [...row].forEach((char, x) => {
        if (char === '.') return;
        const id = CHAR_TO_ZONE[char];
        if (char === 'x') context.fillStyle = PALETTE.ember;
        else context.fillStyle = activeIds.includes(id) ? PALETTE.skyGlow : zoneById.get(id).color;
        context.fillRect(x, y, 1, 1);
      });
    });
  }

  function setOpen(open, { returnFocus = false } = {}) {
    nav.classList.toggle('open', open);
    list.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) list.querySelector('button').focus({ preventScroll: true });
    else if (returnFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('[data-fly]')) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (nav.classList.contains('open') && !nav.contains(event.target) && !event.target.closest('[data-open-map]')) {
      setOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) setOpen(false, { returnFocus: true });
  });

  let activeKey = '';
  onFrame(() => {
    const active = camera.zonesAtCenter();
    const key = active.join();
    if (key !== activeKey) {
      activeKey = key;
      draw(active);
      for (const button of nav.querySelectorAll('[data-fly]')) {
        if (active.includes(button.dataset.fly)) button.setAttribute('aria-current', 'location');
        else button.removeAttribute('aria-current');
      }
    }
    if (!active.length) return;

    // Side-by-side zones share the dot: it sits between them, at the depth reached so far.
    const { top, bottom } = camera.layout.zones[active[0]];
    const progress = (camera.center() - top) / (bottom - top);
    const box = boxes[active[0]];
    const y = box.top + (box.bottom - box.top) * progress;
    const x = active.reduce((sum, id) => sum + (boxes[id].left + boxes[id].right) / 2, 0) / active.length;
    dot.style.transform = `translate(${Math.round(x * CELL) - 4}px, ${Math.round(y * CELL) - 4}px)`;
  });

  return {
    open: () => setOpen(true),
    toggle: () => setOpen(!nav.classList.contains('open'), { returnFocus: true }),
  };
}
