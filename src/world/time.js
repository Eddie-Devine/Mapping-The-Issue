// Converts between positions in the world and years, and a year into the text the HUD shows.
import { STRATA, TRUNK_SCALE } from './zones.js';

const lerp = (a, b, t) => a + (b - a) * t;

/** Reads a table of [position, year] pairs in either direction, holding steady past its ends. */
function interpolate(table, value, from, to) {
  if (value <= table[0][from]) return table[0][to];
  for (let i = 1; i < table.length; i++) {
    if (value < table[i][from]) {
      const above = table[i - 1];
      const below = table[i];
      return lerp(above[to], below[to], (value - above[from]) / (below[from] - above[from]));
    }
  }
  return table[table.length - 1][to];
}

const TRUNK_TOP_YEAR = TRUNK_SCALE[TRUNK_SCALE.length - 1].year;

/** Pixels above the trunk's base for a year. */
export const trunkHeightForYear = (year) => interpolate(TRUNK_SCALE, year, 'year', 'height');

/** Pixels below the ground for a year. STRATA runs newest first, so it reads backward here. */
export const depthForYear = (year) => interpolate([...STRATA].reverse(), year, 'year', 'depth');

/**
 * The year at a world position. Time runs two ways from the ground:
 * going down it falls from today into deep time, and going up the trunk it rises from 1806 to today.
 * Above the trunk, everything is the present.
 */
export function yearAt(y, { trunkTop, trunkBottom, groundY }) {
  if (y < trunkTop) return TRUNK_TOP_YEAR;
  if (y < trunkBottom) return interpolate(TRUNK_SCALE, trunkBottom - y, 'height', 'year');
  if (y < groundY) return TRUNK_TOP_YEAR;
  return interpolate(STRATA, y - groundY, 'depth', 'year');
}

const roundTo = (value, step) => Math.round(value / step) * step;
// One shared formatter: toLocaleString builds a new one on every call, which is slow every frame.
const numbers = new Intl.NumberFormat('en-US');
const withCommas = (value) => numbers.format(value);

/** Formats a year the way DESIGN.md §3 shows it: YEAR: 1847, ~500 BCE, 3,390,000 YEARS AGO. */
export function formatEra(year) {
  if (year <= -10000) {
    const ago = -year;
    const step = ago >= 1000000 ? 10000 : ago >= 100000 ? 1000 : 100;
    return `${withCommas(roundTo(ago, step))} YEARS AGO`;
  }
  if (year < 1500) {
    const rounded = roundTo(year, 10);
    if (rounded === 0) return '~1 CE';
    return rounded < 0 ? `~${withCommas(-rounded)} BCE` : `~${withCommas(rounded)} CE`;
  }
  return `YEAR: ${Math.round(year)}`;
}
