// Decides where each leaf sits. Roots and trunk are placed by date, so a leaf's position on the tree
// matches its moment in time. Branches are spaced evenly, with the same layout on all three.
import { depthForYear, trunkHeightForYear } from './time.js';
import { HEIGHTS } from './zones.js';

const LEAF_SIZE = 48;
/** Leaves are at least this far apart. It's more than their height, so they can't overlap. */
const MIN_GAP = 56;

/**
 * The year that places each root and trunk leaf, from content/timeline.md or the leaf's own dates.
 * These only position leaves and are never displayed. Leaves with no date sit next to related leaves:
 * ind-6 by the Yoga Sutras, ind-10 by the modern leaves, grk-6 by Pythagoras, evo-6 between the
 * evolution leaves, and evo-7 and evo-8 (cultural and modern examples) at the top of the taproot.
 */
const LEAF_YEAR = {
  'evo-1': -3390000,
  'evo-3': -2600000,
  'evo-2': -2000000,
  'evo-4': -1800000,
  'evo-6': -1000000,
  'evo-5': -50000,
  'evo-7': -20000,
  'evo-8': -10000,
  'ind-1': -1000,
  'ind-2': -599,
  'ind-3': -450,
  'ind-4': -260,
  'ind-5': -200,
  'ind-6': -150,
  'ind-7': 520,
  'ind-8': 1920,
  'ind-9': 1931,
  'ind-10': 1990,
  'ind-11': 2020,
  'grk-1': -530,
  'grk-6': -400,
  'grk-2': -50,
  'grk-3': 8,
  'grk-4': 100,
  'grk-5': 270,
  'grk-7': 1800,
  'trk-g1': 1806,
  'trk-g2': 1809,
  'trk-g3': 1847,
  'trk-g4': 1906,
  'trk-g5': 1910,
  'trk-g6': 1944,
  'trk-g7': 1971,
  'trk-g8': 1975,
  'trk-g9': 2013,
  'trk-g10': 2019,
  'trk-g11': 2023,
  'trk-y1': 1894,
  'trk-y2': 1899,
  'trk-y3': 1951,
  'trk-y4': 1975,
  'trk-y5': 2022,
  'trk-y6': 2025,
  'trk-y7': 2026,
  'trk-p1': 1928,
  'trk-p2': 1968,
  'trk-p4': 1990,
  'trk-p3': 2023,
  'trk-r1': 2012,
  'trk-r2': 2013,
  'trk-r3': 2017,
  'trk-r4': 2024,
};

/** Percent across the zone. The ends leave room for a hero leaf's extra size at any screen width. */
const ZIGZAG = [18, 62, 38, 82];
const TRUNK_LANES = { green: 12.5, gold: 37.5, pink: 62.5, red: 87.5 };

/** Moves wanted positions apart until they fit between `min` and `max`, keeping their order. */
export function spread(wanted, min, max) {
  const out = [...wanted].sort((a, b) => a - b);
  for (let i = 0; i < out.length; i++) {
    out[i] = Math.max(out[i], i ? out[i - 1] + MIN_GAP : min);
  }
  for (let i = out.length - 1; i >= 0; i--) {
    out[i] = Math.min(out[i], i === out.length - 1 ? max : out[i + 1] - MIN_GAP);
  }
  return out;
}

function limits(zone) {
  const top = zone.querySelector('.zone-top');
  const bottom = zone.querySelector('.zone-bottom');
  return {
    min: top ? top.offsetTop + top.offsetHeight + 16 : 16,
    max: (bottom ? bottom.offsetTop : zone.offsetHeight) - LEAF_SIZE - 16,
  };
}

function setPosition(button, leftPercent, top) {
  button.style.left = `calc(${leftPercent}% - ${LEAF_SIZE / 2}px)`;
  button.style.top = `${top}px`;
  button.classList.toggle('label-left', leftPercent > 50);
}

/** Places a list of buttons, each with a wanted position, along a zigzag. */
function placeByWanted(buttons, wantedFor, zone) {
  const { min, max } = limits(zone);
  const ordered = [...buttons].sort((a, b) => wantedFor(a) - wantedFor(b));
  const tops = spread(ordered.map(wantedFor), min, max);
  ordered.forEach((button, i) => setPosition(button, ZIGZAG[i % ZIGZAG.length], tops[i]));
}

const fieldLeaves = (zone) => [...zone.querySelectorAll('.leaf-field .leaf-btn')];

function placeRoot(zone, depthOffset) {
  const wanted = (button) => depthForYear(LEAF_YEAR[button.dataset.leaf]) - depthOffset;
  placeByWanted(fieldLeaves(zone), wanted, zone);
}

function placeBranch(zone) {
  const buttons = fieldLeaves(zone);
  const { min, max } = limits(zone);
  // The first leaf, the branch's hero, is at the bottom where the climb arrives.
  const step = buttons.length > 1 ? (max - min) / (buttons.length - 1) : 0;
  buttons.forEach((button, i) => setPosition(button, ZIGZAG[i % ZIGZAG.length], max - step * i));
}

function placeTrunk(zone) {
  const { min } = limits(zone);
  const base = zone.offsetHeight;
  const max = base - LEAF_SIZE - 72;
  for (const [vine, lane] of Object.entries(TRUNK_LANES)) {
    const buttons = [...zone.querySelectorAll(`.leaf-btn.vine-${vine}`)];
    const wanted = (button) => base - trunkHeightForYear(LEAF_YEAR[button.dataset.leaf]) - LEAF_SIZE;
    const ordered = buttons.sort((a, b) => wanted(a) - wanted(b));
    const tops = spread(ordered.map(wanted), min, max);
    ordered.forEach((button, i) => setPosition(button, lane, tops[i]));
  }
}

/** Runs at startup and whenever text might have reflowed. */
export function placeLeaves() {
  placeRoot(document.getElementById('root-india'), 0);
  placeRoot(document.getElementById('root-greece'), 0);
  placeRoot(document.getElementById('taproot'), HEIGHTS.roots);
  placeTrunk(document.getElementById('trunk'));
  for (const id of ['branch-1', 'branch-2', 'branch-3']) placeBranch(document.getElementById(id));
}
