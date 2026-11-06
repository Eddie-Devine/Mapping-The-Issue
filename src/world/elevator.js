// The time-warp elevator: from the bottom of the taproot back up to 1806 at the base of the trunk.
// The camera really flies through the underground while a time-lapse plays over it: letterbox bars,
// streaks of soil rushing past, each era's name flashing as its layer goes by, and a bright landing.
import { sfx } from '../audio/sfx.js';
import { PALETTE as P } from '../palette.js';
import { onFrame, viewport } from './loop.js';
import { motionAllowed } from './motion.js';
import { STRATA, TRUNK_SCALE } from './zones.js';

const RIDE_MS = 4000;
const START_YEAR = TRUNK_SCALE[0].year;
const SCALE = 4;

export function createElevator({ camera, yearHud }) {
  const overlay = document.createElement('div');
  overlay.className = 'warp';
  overlay.hidden = true;
  overlay.innerHTML = `
    <canvas class="warp-canvas" aria-hidden="true"></canvas>
    <p class="warp-era" aria-hidden="true"></p>
    <p class="warp-year" aria-hidden="true"></p>
    <p class="warp-note" aria-hidden="true">PRESS ESC OR SCROLL TO STOP</p>
  `;
  document.body.append(overlay);
  const canvas = overlay.querySelector('canvas');
  const c = canvas.getContext('2d');
  const yearText = overlay.querySelector('.warp-year');
  const eraText = overlay.querySelector('.warp-era');

  const status = document.createElement('p');
  status.className = 'visually-hidden';
  status.setAttribute('role', 'status');
  document.body.append(status);

  let stopWatching = null;
  let stopDrawing = null;

  function stratumAt(depth) {
    let index = -1;
    STRATA.forEach((layer, i) => {
      if (depth >= layer.depth) index = i;
    });
    return index;
  }

  /** The time-lapse: soil streaks whose speed matches the camera's, plus era names flashing past. */
  function startDrawing() {
    const streaks = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), size: 1 + Math.floor(Math.random() * 2) }));
    let lastY = viewport.scrollY;
    let lastStratum = null;
    return onFrame(() => {
      const w = Math.ceil(viewport.width / SCALE);
      const h = Math.ceil(viewport.height / SCALE);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const speed = Math.abs(viewport.scrollY - lastY) / SCALE;
      lastY = viewport.scrollY;
      const depth = camera.center() - camera.layout.groundY;
      const index = depth >= 0 ? stratumAt(depth) : null;
      const color = index !== null && index >= 0 ? STRATA[index].color : P.skyPeach;

      c.clearRect(0, 0, w, h);
      for (const streak of streaks) {
        // Moving up through the ground means the soil streams downward past the camera.
        streak.y += (speed / h) * (0.6 + streak.size * 0.4);
        if (streak.y > 1) {
          streak.y -= 1;
          streak.x = Math.random();
        }
        const length = Math.max(2, Math.min(h / 3, speed * 1.5));
        c.fillStyle = streak.size > 1 ? P.fossil : color;
        c.fillRect(Math.round(streak.x * w), Math.round(streak.y * h - length), streak.size, Math.round(length));
      }

      if (index !== lastStratum) {
        lastStratum = index;
        const label = index === null ? 'THE SURFACE' : index >= 0 ? STRATA[index].label : '';
        if (label) {
          eraText.textContent = label;
          eraText.classList.remove('flash');
          void eraText.offsetWidth; // Restarts the flash animation.
          eraText.classList.add('flash');
        }
      }
    });
  }

  function finish() {
    overlay.hidden = true;
    overlay.classList.remove('landing');
    stopWatching?.();
    stopWatching = null;
    stopDrawing?.();
    stopDrawing = null;
  }

  function land() {
    sfx.land();
    overlay.classList.add('landing');
    document.getElementById('world').classList.add('shake');
    setTimeout(() => {
      document.getElementById('world').classList.remove('shake');
      finish();
    }, 700);
  }

  function ride() {
    if (stopWatching) return;
    status.textContent = `Time warp: climbing from deep time to ${START_YEAR}.`;
    yearHud.setCeiling(START_YEAR);
    // Landing one pixel above the trunk's base puts the camera exactly on 1806.
    const target = camera.layout.trunkBottom - 1 - window.innerHeight / 2;
    const arrive = () => {
      yearHud.setCeiling(null);
      status.textContent = `You've reached ${START_YEAR}. Scroll up to climb the trunk.`;
      camera.focusZone('trunk');
    };

    if (!motionAllowed()) {
      camera.flyTo(target, { onDone: arrive });
      return;
    }

    overlay.hidden = false;
    sfx.whoosh();
    stopWatching = yearHud.watch((text) => {
      yearText.textContent = text;
    });
    stopDrawing = startDrawing();
    camera.flyTo(target, {
      duration: RIDE_MS,
      onDone() {
        arrive();
        stopWatching?.();
        stopWatching = null;
        yearText.textContent = `YEAR: ${START_YEAR}`;
        land();
      },
      onCancel() {
        finish();
        yearHud.setCeiling(null);
        status.textContent = 'Time warp stopped.';
      },
    });
  }

  return { ride };
}
