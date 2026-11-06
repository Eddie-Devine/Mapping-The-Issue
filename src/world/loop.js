// The one shared requestAnimationFrame loop. Everything that animates registers here.
//
// The scroll position and window size are read once, at the start of each frame, and shared as
// `viewport`. If every task read them for itself, a task reading after another task had changed
// the page would force the browser to recalculate layout mid-frame, several times per frame.
const tasks = new Set();
let running = false;
let last = 0;

export const viewport = { scrollY: 0, width: 0, height: 0 };

function measure() {
  viewport.scrollY = window.scrollY;
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;
}
measure();
window.addEventListener('scroll', measure, { passive: true });
window.addEventListener('resize', measure, { passive: true });

function frame(now) {
  const dt = Math.min(now - last, 100);
  last = now;
  measure();
  for (const task of tasks) task(now, dt);
  if (tasks.size) requestAnimationFrame(frame);
  else running = false;
}

/** Runs `task(now, dt)` every frame. Returns a function that stops it. */
export function onFrame(task) {
  tasks.add(task);
  if (!running) {
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  return () => tasks.delete(task);
}
