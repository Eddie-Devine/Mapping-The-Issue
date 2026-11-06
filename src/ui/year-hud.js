// The year counter in the top-left corner. It rolls toward the era under the middle of the screen.
import { onFrame } from '../world/loop.js';
import { motionAllowed } from '../world/motion.js';
import { formatEra, yearAt } from '../world/time.js';

/** How quickly the counter catches up. Lower is snappier. */
const ROLL_MS = 90;

export function createYearHud(camera) {
  const element = document.createElement('p');
  element.className = 'hud-year';
  document.body.append(element);

  let ceiling = null;
  let shown = null;
  let text = '';
  const watchers = new Set();

  onFrame((now, dt) => {
    let target = yearAt(camera.center(), camera.layout);
    if (ceiling !== null) target = Math.min(target, ceiling);

    if (shown === null || !motionAllowed()) shown = target;
    else {
      shown += (target - shown) * (1 - Math.exp(-dt / ROLL_MS));
      if (Math.abs(target - shown) < 0.5) shown = target;
    }

    const next = formatEra(shown);
    if (next !== text) {
      text = next;
      element.textContent = text;
      for (const watcher of watchers) watcher(text);
    }
  });

  return {
    /** Holds the counter at or below this year. The elevator stops it at 1806. */
    setCeiling(year) {
      ceiling = year;
    },
    /** Calls `watcher(text)` now and whenever the counter changes. Returns a function that stops it. */
    watch(watcher) {
      watchers.add(watcher);
      watcher(text);
      return () => watchers.delete(watcher);
    },
  };
}
