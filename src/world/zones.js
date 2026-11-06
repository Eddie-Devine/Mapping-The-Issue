// The map of the world: every zone, its size, and which part of the assignment it holds.
import { PALETTE } from '../palette.js';

/**
 * Zone heights in pixels. Multiples of 16, the world's tile size.
 * The canopy, tangle, and graft treat theirs as a minimum, because their text
 * runs longer on phones. Nothing about time depends on those three.
 */
export const HEIGHTS = {
  canopy: 704,
  tangle: 704,
  graft: 608,
  branch: 1600,
  trunk: 2400,
  surface: 800,
  roots: 3808,
  taproot: 3504,
};

/**
 * The trunk's time scale: `height` is pixels above the trunk's base. Above the last entry the
 * year stays at 2026, which leaves room for the banner and branch picker where the trunk splits.
 * Rings are wider near the top because that is where most of the recent events cluster.
 */
export const TRUNK_SCALE = [
  { height: 0, year: 1806 },
  { height: 896, year: 1950 },
  { height: 1280, year: 2010 },
  { height: 1696, year: 2026 },
];

/**
 * Soil layers, from the ground down. Deeper means older.
 * `depth` is pixels below the ground and `year` is negative for BCE or years ago.
 * The year counter and the printed layer labels both read this table, so they always agree.
 * Each date comes from content/timeline.md or the zone's content file.
 */
export const STRATA = [
  { depth: 0, year: 2026, label: '2026', color: PALETTE.dirt },
  { depth: 448, year: 1900, label: '1900', color: PALETTE.barkDark },
  { depth: 896, year: 1700, label: '1700', color: PALETTE.clay },
  { depth: 1296, year: 500, label: '500 CE', color: PALETTE.barkDark },
  { depth: 2096, year: 1, label: '1 CE', color: PALETTE.clay },
  { depth: 2992, year: -500, label: '500 BCE', color: PALETTE.leather },
  { depth: 3808, year: -1500, label: '1500 BCE', color: PALETTE.clay },
  { depth: 4496, year: -50000, label: '50,000 YEARS AGO', color: PALETTE.leather },
  { depth: 5504, year: -2000000, label: '2 MILLION YEARS AGO', color: PALETTE.clay },
  { depth: 6000, year: -2600000, label: '2.6 MILLION YEARS AGO', color: PALETTE.leather },
  { depth: 6800, year: -3390000, label: '~3.4 MILLION YEARS AGO', color: PALETTE.soil },
];

/**
 * `entry` says where fast travel lands: climbing zones start at their bottom edge,
 * and everything else starts at its top edge.
 */
export const ZONES = [
  { id: 'canopy', name: 'The Canopy', role: 'Conclusion', entry: 'top', color: PALETTE.skyPeach },
  { id: 'tangle', name: 'The Tangle', role: 'Positions 1 & 2 vs. Position 3', entry: 'top', color: PALETTE.dusk },
  { id: 'graft', name: 'The Graft', role: 'Position 1 vs. Position 2', entry: 'top', color: PALETTE.olive },
  { id: 'branch-1', name: 'Branch 1: Body & Mind', role: 'Position 1', entry: 'bottom', color: PALETTE.granite },
  { id: 'branch-2', name: 'Branch 2: Ethics & Earth', role: 'Position 2', entry: 'bottom', color: PALETTE.forest },
  { id: 'branch-3', name: 'Branch 3: Meat & Might', role: 'Position 3', entry: 'bottom', color: PALETTE.ember },
  { id: 'trunk', name: 'The Trunk', role: 'Background: 1806 to 2026', entry: 'bottom', color: PALETTE.bark },
  { id: 'surface', name: 'The Surface', role: 'Intro: They Say, Thesis, Who Cares, So What', entry: 'ground', color: PALETTE.grass },
  { id: 'root-india', name: 'India Root', role: 'Background: ~1500 BCE to today', entry: 'top', color: PALETTE.saffron },
  { id: 'root-greece', name: 'Greece Root', role: 'Background: ~530 BCE to 1847', entry: 'top', color: PALETTE.aegean },
  { id: 'taproot', name: 'The Taproot', role: 'Background: human evolution', entry: 'top', color: PALETTE.clay },
];

export const zoneById = new Map(ZONES.map((zone) => [zone.id, zone]));
