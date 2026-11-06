// The title screen from DESIGN.md §4: a MAPPING THE ISSUE logo built from pixel leaves over the
// Surface, with a blinking PRESS START. It shows once per visit. Scrolling, tapping, or any key
// starts the game too, so it never stands in anyone's way.
import intro from '../data/intro.json';
import { sfx } from '../audio/sfx.js';
import { mountScene } from '../scenes/runtime.js';
import { P, fill, text, textWidth } from '../scenes/kit.js';
import { escapeHtml } from './render.js';

const SEEN = 'roots-and-branches-title-seen';
const LINES = ['MAPPING', 'THE ISSUE'];
// Leaves 4 pixels apart touch, so each letter reads as one solid shape.
const CELL = 4;

/** One letter pixel becomes one tiny leaf. */
function leaf(c, x, y, color, shade) {
  fill(c, color, x + 1, y, 3, 1);
  fill(c, color, x, y + 1, 4, 2);
  fill(c, shade, x + 3, y + 1, 1, 2);
  fill(c, shade, x, y + 3, 3, 1);
}

/** Every lit pixel of the title in the 3x5 font, as grid cells. */
function titleCells() {
  const scratch = document.createElement('canvas');
  const width = Math.max(...LINES.map(textWidth));
  scratch.width = width;
  scratch.height = LINES.length * 6;
  const sc = scratch.getContext('2d');
  LINES.forEach((line, row) => text(sc, line, Math.floor((width - textWidth(line)) / 2), row * 6, '#000'));
  const data = sc.getImageData(0, 0, scratch.width, scratch.height).data;
  const cells = [];
  for (let y = 0; y < scratch.height; y++) {
    for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3]) cells.push({ x, y });
  }
  return { cells, width, height: scratch.height };
}

function logoScene(room) {
  const { cells, width, height } = titleCells();
  const w = width * CELL + 4;
  const h = height * CELL + 4;
  return {
    alt: 'The title Mapping The Issue, spelled out in tiny pixel leaves.',
    w,
    h,
    scale: Math.max(1, Math.min(4, Math.floor(room / w))),
    still: 999,
    draw(c, { f }) {
      cells.forEach((cell, i) => {
        // Leaves pop in one after another, then sway gently.
        // About three seconds for the whole logo to grow in.
        if (f < i / 6) return;
        const gold = cell.y >= 6 && cell.x >= textWidth('THE ');
        const sway = (Math.floor(f / 3) + cell.x) % 6 === 0 ? 1 : 0;
        leaf(c, 2 + cell.x * CELL, 2 + cell.y * CELL + sway, gold ? P.vineGold : i % 5 === 0 ? P.grassLight : P.vineGreen, gold ? P.dirt : P.forestDark);
      });
    },
  };
}

export function showTitleScreen({ onStart }) {
  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN) === '1';
  } catch {
    // Without storage, the title shows on every load. That's fine.
  }
  // A link to a specific zone should go straight there.
  if (seen || location.hash) return false;

  const screen = document.createElement('section');
  screen.className = 'title-screen';
  screen.setAttribute('aria-label', 'Title screen');
  screen.innerHTML = `
    <div class="title-inner">
      <div class="title-logo"></div>
      <p class="title-subtitle">${escapeHtml(intro.subtitle)}</p>
      <p class="title-byline">${escapeHtml(intro.byline)}</p>
      <button class="pixel-btn title-start" type="button">▶ PRESS START</button>
      <p class="title-hint">(or scroll / tap)</p>
    </div>
  `;
  document.body.append(screen);
  const room = Math.min(window.innerWidth - 32, 760);
  const logo = mountScene(screen.querySelector('.title-logo'), logoScene(room));
  const start = screen.querySelector('.title-start');
  start.focus({ preventScroll: true });

  let gone = false;
  function dismiss(event) {
    if (gone) return;
    gone = true;
    if (event?.type === 'click') sfx.start();
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {
      // Nothing to remember it in.
    }
    for (const [type, handler] of listeners) window.removeEventListener(type, handler);
    screen.classList.add('leaving');
    const remove = () => {
      logo.destroy();
      screen.remove();
    };
    if (document.documentElement.dataset.motion === 'off') remove();
    else setTimeout(remove, 400);
    onStart?.();
  }

  const listeners = [
    ['wheel', dismiss],
    ['touchmove', dismiss],
    ['keydown', (event) => {
      if (!['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(event.key)) dismiss(event);
    }],
  ];
  for (const [type, handler] of listeners) window.addEventListener(type, handler, { passive: true });
  screen.addEventListener('click', dismiss);
  return true;
}
