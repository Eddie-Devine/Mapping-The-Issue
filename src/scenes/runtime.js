// Runs animated scenes. Each scene is one small canvas in the page, so it scrolls natively with the
// world and never lags behind it. A scene only ticks while it's on screen, at the 8 fps pixel-art
// cadence from DESIGN.md §4. With reduced motion, it draws one still frame instead.
import { onFrame } from '../world/loop.js';
import { motionAllowed, onMotionChange } from '../world/motion.js';

const FRAME_MS = 125;
const running = new Map();

const visibility = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) running.get(entry.target)?.setVisible(entry.isIntersecting);
  },
  { rootMargin: '64px' },
);

// Turning motion on or off in Settings restarts or freezes every scene on the spot.
onMotionChange(() => {
  for (const scene of running.values()) scene.motionChanged();
});

const resizing = new ResizeObserver((entries) => {
  for (const entry of entries) {
    for (const scene of running.values()) if (scene.host === entry.target) scene.fit();
  }
});

/**
 * Puts a scene into `host`.
 * A scene is { alt, h, w?, scale?, bg?(c, size), draw(c, size), still? }: `h` and `w` are native pixels,
 * and `size` is { w, h, f } where f counts frames from the moment the scene first came on screen.
 */
export function mountScene(host, scene) {
  const canvas = document.createElement('canvas');
  canvas.className = 'scene-canvas';
  if (scene.alt) {
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', scene.alt);
  } else {
    canvas.setAttribute('aria-hidden', 'true');
  }
  host.append(canvas);
  const c = canvas.getContext('2d');
  const scale = scene.scale ?? 3;

  let f = 0;
  let waited = 0;
  let stop = null;
  let background = null;
  let size = { w: 0, h: scene.h, f: 0 };

  function render() {
    size.f = motionAllowed() ? f : (scene.still ?? 0);
    c.clearRect(0, 0, size.w, size.h);
    if (background) c.drawImage(background, 0, 0);
    scene.draw(c, size);
  }

  function fit() {
    const room = Math.floor(host.clientWidth / scale);
    const w = Math.max(16, Math.min(scene.w ?? room, room));
    if (w === size.w) return;
    size = { w, h: scene.h, f };
    canvas.width = w;
    canvas.height = scene.h;
    canvas.style.width = `${w * scale}px`;
    canvas.style.height = `${scene.h * scale}px`;
    c.imageSmoothingEnabled = false;
    if (scene.bg) {
      background = document.createElement('canvas');
      background.width = w;
      background.height = scene.h;
      const bc = background.getContext('2d');
      bc.imageSmoothingEnabled = false;
      scene.bg(bc, size);
    }
    render();
  }

  let visibleNow = false;

  function setVisible(visible) {
    visibleNow = visible;
    if (visible && !stop && motionAllowed()) {
      stop = onFrame((now, dt) => {
        waited += dt;
        if (waited < FRAME_MS) return;
        waited %= FRAME_MS;
        f++;
        render();
      });
    } else if (!visible && stop) {
      stop();
      stop = null;
    }
  }

  function motionChanged() {
    if (!motionAllowed() && stop) {
      stop();
      stop = null;
    }
    render();
    setVisible(visibleNow);
  }

  running.set(canvas, { host, fit, setVisible, motionChanged });
  fit();
  visibility.observe(canvas);
  resizing.observe(host);

  return {
    /** For scenes with a button: redraws right away, even with reduced motion. */
    refresh: render,
    destroy() {
      stop?.();
      visibility.unobserve(canvas);
      running.delete(canvas);
      if (![...running.values()].some((other) => other.host === host)) resizing.unobserve(host);
      canvas.remove();
    },
  };
}
