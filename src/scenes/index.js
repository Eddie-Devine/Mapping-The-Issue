// Places every world scene. Scenes sit below labels, text, and leaves, so they never block anything.
import { trunkHeightForYear } from '../world/time.js';
import { HEIGHTS } from '../world/zones.js';
import { freeSolo, vanCamp, yogiLedge } from './branch1.js';
import { bramble, forest, pasture } from './branch2.js';
import { grill, ranch, treehouse } from './branch3.js';
import { agora, baseCamp, feast, jainPath, signSwap, yogiTiger } from './roots.js';
import { mountScene } from './runtime.js';
import { campfire, dikika, kiviaq } from './taproot.js';
import { billboard, candyShop, meadow, phoneFeed, sandowStage, STRATA_PROPS, summit, vsFighters } from './world-misc.js';

/**
 * `top` and `bottom` are pixels within the host. On phones, both roots fill the whole width,
 * so root scenes take turns: `phoneTop` keeps them from landing on top of each other.
 */
const PLACEMENTS = [
  { host: 'branch-1', scene: freeSolo, bottom: 300 },
  { host: 'branch-1', scene: yogiLedge, bottom: 660 },
  { host: 'branch-1', scene: vanCamp, bottom: 140 },
  { host: 'branch-2', scene: forest, bottom: 300 },
  { host: 'branch-2', scene: pasture, bottom: 140 },
  { host: 'branch-3', scene: treehouse, bottom: 300 },
  { host: 'branch-3', scene: ranch, bottom: 660 },
  { host: 'branch-3', scene: grill, bottom: 140 },

  { host: 'roots', col: 'left', scene: baseCamp, top: 560, phoneTop: 900 },
  { host: 'roots', col: 'right', scene: signSwap, top: 600, phoneTop: 1120 },
  { host: 'roots', col: 'right', scene: feast, top: 2300, phoneTop: 1900 },
  { host: 'roots', col: 'left', scene: yogiTiger, top: 2260, phoneTop: 2180 },
  { host: 'roots', col: 'left', scene: jainPath, top: 2860, phoneTop: 2440 },
  { host: 'roots', col: 'right', scene: agora, top: 2800, phoneTop: 2700 },

  { host: 'taproot', scene: kiviaq, top: 620 },
  { host: 'taproot', scene: campfire, top: 1620 },
  { host: 'taproot', scene: dikika, top: 2560 },

  { host: 'surface', scene: meadow, bottom: 48 },
  { host: 'canopy', scene: summit, top: 0 },
];

const KNOTS = [
  { scene: sandowStage, year: 1894 },
  { scene: candyShop, year: 1928 },
  { scene: billboard, year: 1968 },
  { scene: phoneFeed, year: 2022 },
];

function slotFor(hostElement, { top, bottom, phoneTop, col }) {
  const slot = document.createElement('div');
  slot.className = `scene-slot${col ? ` slot-${col}` : ''}`;
  if (top !== undefined) {
    slot.style.setProperty('--top', `${top}px`);
    slot.style.setProperty('--phone-top', `${phoneTop ?? top}px`);
  }
  if (bottom !== undefined) slot.style.bottom = `${bottom}px`;
  hostElement.append(slot);
  return slot;
}

function drawProps() {
  const strata = document.querySelector('.strata');
  for (const { depth, left, draw } of STRATA_PROPS) {
    const canvas = document.createElement('canvas');
    canvas.width = 12;
    canvas.height = 12;
    canvas.className = 'strata-prop';
    canvas.style.top = `${depth}px`;
    canvas.style.left = `${left}%`;
    draw(canvas.getContext('2d'));
    strata.append(canvas);
  }
}

export function mountWorldScenes() {
  for (const placement of PLACEMENTS) {
    const host = placement.host === 'roots' ? document.querySelector('.roots') : document.getElementById(placement.host);
    mountScene(slotFor(host, placement), placement.scene);
  }
  const trunk = document.getElementById('trunk');
  for (const { scene, year } of KNOTS) {
    const top = HEIGHTS.trunk - trunkHeightForYear(year) - scene.h * 3 + 24;
    const slot = slotFor(trunk, { top });
    slot.classList.add('slot-knot');
    mountScene(slot, scene);
  }
  mountScene(document.querySelector('.bramble-scene'), bramble);
  mountScene(document.querySelector('.vs-scene'), vsFighters);
  drawProps();
}
