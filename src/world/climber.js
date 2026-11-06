// The visitor's avatar. It stays with the camera: standing on the grass at the Surface, climbing
// the trunk and branches, and descending the roots. It sits out at the Canopy, where the summit
// scene shows it resting on the top branch.
import { spriteCanvas } from '../sprites/engine.js';
import { CHALK, CLIMB, CLIMBER_COLORS, STAND, WALK } from '../sprites/climber.js';
import { onFrame, viewport } from './loop.js';
import { motionAllowed } from './motion.js';

const SIZE = 48;
const IDLE_AFTER_MS = 1200;

export function createClimber(camera) {
  const canvas = document.createElement('canvas');
  canvas.className = 'climber';
  canvas.width = 16;
  canvas.height = 16;
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const c = canvas.getContext('2d');

  let colors = CLIMBER_COLORS.green;
  let x = viewport.width / 2;
  let y = viewport.height * 0.6;
  let lastScroll = viewport.scrollY;
  let stillFor = IDLE_AFTER_MS;
  let elapsed = 0;
  let drawnKey = '';

  /** Where the climber belongs right now: a position, plus whether it's on foot or on a wall. */
  function target() {
    const { layout } = camera;
    const vw = viewport.width;
    const vh = viewport.height;
    const center = camera.center();
    const { zones, groundY } = layout;
    if (center < zones.canopy.bottom) return null;
    if (center >= zones.surface.top && center < groundY) {
      // Beside the trunk on the grass, clear of the signposts in the middle.
      return { x: Math.min(vw - SIZE - 8, vw / 2 + Math.max(96, vw * 0.12) + 16), y: Math.min(groundY - viewport.scrollY - SIZE, vh - SIZE), onFoot: true };
    }
    const wallY = vh * 0.58 - SIZE / 2;
    if (center >= zones.taproot.top) return { x: vw / 2 - SIZE / 2, y: wallY };
    if (center >= groundY) return { x: vw / 4 - SIZE / 2, y: wallY };
    if (center >= zones.trunk.top) return { x: vw / 2 - SIZE / 2, y: wallY };
    return { x: vw / 2 - SIZE / 2, y: wallY };
  }

  function draw(grid, flip) {
    const key = `${grid === CLIMB ? 'c' : grid === WALK ? 'w' : grid === CHALK ? 'h' : 's'}${flip}`;
    if (key === drawnKey) return;
    drawnKey = key;
    c.clearRect(0, 0, 16, 16);
    c.save();
    if (flip) {
      c.translate(16, 0);
      c.scale(-1, 1);
    }
    c.drawImage(spriteCanvas(grid, colors), 0, 0);
    c.restore();
  }

  onFrame((now, dt) => {
    const goal = target();
    canvas.hidden = !goal;
    if (!goal) return;

    const moved = viewport.scrollY !== lastScroll;
    lastScroll = viewport.scrollY;
    stillFor = moved ? 0 : stillFor + dt;
    elapsed += dt;

    if (motionAllowed()) {
      const ease = 1 - Math.exp(-dt / 90);
      x += (goal.x - x) * ease;
      // On the grass, the climber must stay planted on the ground as the world scrolls.
      y = goal.onFoot && Math.abs(goal.y - y) < 40 ? goal.y : y + (goal.y - y) * ease;
    } else {
      x = goal.x;
      y = goal.y;
    }
    canvas.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

    const idle = stillFor >= IDLE_AFTER_MS;
    const phase = Math.floor(viewport.scrollY / 28) % 2 === 0;
    const slow = Math.floor(elapsed / 500) % 4;
    if (goal.onFoot) {
      if (!idle) draw(phase ? WALK : STAND, false);
      else draw(motionAllowed() && slow === 3 ? CHALK : STAND, motionAllowed() && slow === 1);
    } else {
      draw(CLIMB, phase);
    }
  });

  return {
    setColor(name) {
      colors = CLIMBER_COLORS[name] ?? colors;
      drawnKey = '';
    },
  };
}
