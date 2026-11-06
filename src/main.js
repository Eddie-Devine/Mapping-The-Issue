// Boots the tree world.
import './styles/world.css';
import './styles/art.css';
import './styles/ui.css';
import './styles/polish.css';
import { sfx } from './audio/sfx.js';
import { mountWorldScenes } from './scenes/index.js';
import { installLeafSprites } from './sprites/leaf.js';
import { installTiles } from './sprites/tiles.js';
import { buildWorld } from './world/build.js';
import { createCamera } from './world/camera.js';
import { createClimber } from './world/climber.js';
import { createDust } from './world/dust.js';
import { createElevator } from './world/elevator.js';
import { motionAllowed } from './world/motion.js';
import { createParallax } from './world/parallax.js';
import { placeLeaves } from './world/placement.js';
import { progress } from './world/progress.js';
import { settings } from './world/settings.js';
import { createDialog } from './ui/dialog.js';
import { connectEasterEggs } from './ui/easter-eggs.js';
import { createLegend } from './ui/legend.js';
import { createSettingsPanel } from './ui/settings-panel.js';
import { showTitleScreen } from './ui/title-screen.js';
import { connectGraft } from './ui/graft.js';
import { connectLeaves, LEAF_IDS } from './ui/leaves.js';
import { createMinimap } from './ui/minimap.js';
import { connectPositionCards } from './ui/position-cards.js';
import { connectSignposts } from './ui/surface.js';
import { connectTangle } from './ui/tangle.js';
import { createTimeline } from './ui/timeline.js';
import { createYearHud } from './ui/year-hud.js';

// The page always opens at the Surface, not wherever a reload left it.
history.scrollRestoration = 'manual';

installLeafSprites();
installTiles();
const world = document.getElementById('world');
buildWorld(world);
placeLeaves();
mountWorldScenes();

// This all runs before the first paint, so the visitor never sees the page jump into place.
const camera = createCamera(world, placeLeaves);
camera.jumpToStart();

// For a link like #branch-2, the browser does its own jump when the page finishes loading,
// which lands in the wrong spot and drops keyboard focus. Put both back afterward.
if (location.hash) {
  window.addEventListener('load', () => requestAnimationFrame(camera.jumpToStart), { once: true });
}

const yearHud = createYearHud(camera);
const minimap = createMinimap({ camera });
const elevator = createElevator({ camera, yearHud });
const dialog = createDialog();
const leaves = connectLeaves({ dialog, camera });
const timeline = createTimeline({ camera, leaves });
connectSignposts({ dialog });
connectPositionCards({ dialog });
connectGraft({ dialog });
connectTangle();
const climber = createClimber(camera);
climber.setColor(settings.get('climber'));
settings.subscribe((name, value) => {
  if (name === 'climber') climber.setColor(value);
});
createParallax(camera);
createDust(camera);
connectEasterEggs();

/** The bottom bar: settings, timeline, and Read Mode in one row, so they never overlap. */
const legend = createLegend();
const bar = document.createElement('div');
bar.className = 'hud-bar';
bar.append(createSettingsPanel({ showLegend: () => legend.show() }), document.querySelector('.hud-time'), document.querySelector('.hud-read'));
document.body.append(bar);

// Collecting a leaf rings a chime (when sound is on).
progress.subscribe((id) => {
  if (LEAF_IDS.includes(id)) sfx.chime();
});

// The title screen shows once per visit; the key legend appears when the game starts.
const showedTitle = showTitleScreen({
  onStart() {
    camera.focusZone('surface');
    legend.firstVisit();
  },
});
if (!showedTitle) legend.firstVisit();

/** The leaf counter in the HUD, and the "You found" line at the canopy. */
const counter = document.createElement('p');
counter.className = 'hud-leaves';
document.body.append(counter);
const canopyCount = document.querySelector('.canopy-count');
function updateCounts() {
  const found = progress.count(LEAF_IDS);
  counter.textContent = `🍃 ${found} / ${LEAF_IDS.length}`;
  counter.setAttribute('title', 'Leaves collected');
  canopyCount.textContent = `You found ${found} / ${LEAF_IDS.length} leaves`;
}
progress.subscribe(updateCounts);
updateCounts();

/** Vine filter: shows or hides each trunk storyline. */
document.querySelector('.vine-filter').addEventListener('click', (event) => {
  const button = event.target.closest('[data-vine]');
  if (!button) return;
  const show = button.getAttribute('aria-pressed') !== 'true';
  button.setAttribute('aria-pressed', String(show));
  const { vine } = button.dataset;
  for (const leaf of document.querySelectorAll(`.leaf-btn.vine-${vine}`)) leaf.hidden = !show;
  document.querySelector(`.vine-line-${vine}`).hidden = !show;
});

/** Leaves sway only while their zone is near the screen. */
const onScreen = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) entry.target.classList.toggle('on-screen', entry.isIntersecting);
  },
  { rootMargin: '200px' },
);
for (const zone of document.querySelectorAll('.zone')) onScreen.observe(zone);

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-fly], [data-elevator], [data-open-map]');
  if (!button) return;
  if (button.dataset.fly) camera.travelTo(button.dataset.fly);
  else if ('elevator' in button.dataset) elevator.ride();
  else minimap.open();
});

/** ← → and A D step through the leaves near the middle of the screen. */
function stepLeaf(direction) {
  const candidates = camera
    .zonesAtCenter()
    .flatMap((id) => [...document.querySelectorAll(`#${id} .leaf-btn:not([hidden])`)]);
  if (!candidates.length) return;
  const current = candidates.indexOf(document.activeElement);
  let target;
  if (current >= 0) target = candidates[(current + direction + candidates.length) % candidates.length];
  else {
    const distance = (leaf) => Math.abs(leaf.getBoundingClientRect().top - window.innerHeight / 2);
    target = candidates.reduce((best, leaf) => (distance(leaf) < distance(best) ? leaf : best));
  }
  target.focus({ preventScroll: true });
  camera.centerOn(target);
}

/** Single-key shortcuts from DESIGN.md §5. ↑ ↓ already scroll natively. */
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  // Dialogs have their own keys, and the timeline slider needs its arrow keys.
  if (document.querySelector('dialog[open]') || event.target.matches('input')) return;
  const key = event.key.toLowerCase();
  // Single-letter shortcuts can be switched off in Settings (WCAG 2.1.4). Arrow keys always work.
  if (key.length === 1 && !settings.get('shortcuts')) return;
  const behavior = motionAllowed() ? 'smooth' : 'auto';
  switch (key) {
    case '?':
      legend.toggle();
      break;
    case 'w':
      window.scrollBy({ top: -160, behavior });
      break;
    case 's':
      window.scrollBy({ top: 160, behavior });
      break;
    case 'arrowleft':
    case 'a':
      event.preventDefault();
      stepLeaf(-1);
      break;
    case 'arrowright':
    case 'd':
      event.preventDefault();
      stepLeaf(1);
      break;
    // Holding one of these keys down shouldn't make things flicker open and shut.
    case 'm':
      if (!event.repeat) minimap.toggle();
      break;
    case 't':
      if (!event.repeat) timeline.toggle();
      break;
    case 'r':
      if (!event.repeat) location.href = 'read.html';
      break;
    default:
  }
});

// Text reflows once the web fonts arrive, which can change how much room the leaves have.
document.fonts?.ready.then(placeLeaves);
