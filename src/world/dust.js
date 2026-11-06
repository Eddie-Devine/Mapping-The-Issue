// Falling dirt specks when the visitor scrolls fast underground (DESIGN.md §4).
import { PALETTE as P } from '../palette.js';
import { onFrame, viewport } from './loop.js';
import { motionAllowed } from './motion.js';

const FAST = 30;
const SCALE = 3;

export function createDust(camera) {
  const canvas = document.createElement('canvas');
  canvas.className = 'dust';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const c = canvas.getContext('2d');

  let specks = [];
  let last = viewport.scrollY;
  let dirty = false;

  onFrame(() => {
    const speed = Math.abs(viewport.scrollY - last);
    last = viewport.scrollY;
    const underground = camera.center() > camera.layout.groundY;
    if (motionAllowed() && underground && speed > FAST && specks.length < 40) {
      for (let i = 0; i < 4; i++) {
        specks.push({ x: Math.random(), y: Math.random() * 0.3, fall: 0.008 + Math.random() * 0.012, color: Math.random() < 0.5 ? P.fossil : P.clay });
      }
    }
    if (!specks.length) {
      if (dirty) {
        c.clearRect(0, 0, canvas.width, canvas.height);
        dirty = false;
      }
      return;
    }
    const w = Math.ceil(viewport.width / SCALE);
    const h = Math.ceil(viewport.height / SCALE);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    c.clearRect(0, 0, w, h);
    dirty = true;
    specks = specks.filter((speck) => speck.y < 1);
    for (const speck of specks) {
      speck.y += speck.fall;
      c.fillStyle = speck.color;
      c.fillRect(Math.round(speck.x * w), Math.round(speck.y * h), 1, 1);
    }
  });
}
