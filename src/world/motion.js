// Whether animation is allowed. It follows the device's reduced-motion setting unless the visitor
// picks otherwise in Settings. The answer is mirrored onto <html data-motion> for the stylesheets.
import { settings } from './settings.js';

const query = window.matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set();

export function motionAllowed() {
  const choice = settings.get('motion');
  return choice ? choice === 'on' : !query.matches;
}

function update() {
  document.documentElement.dataset.motion = motionAllowed() ? 'on' : 'off';
  for (const listener of listeners) listener(motionAllowed());
}

/** Calls `listener(allowed)` whenever the answer might have changed. */
export function onMotionChange(listener) {
  listeners.add(listener);
}

query.addEventListener('change', update);
settings.subscribe((name) => {
  if (name === 'motion') update();
});
update();
