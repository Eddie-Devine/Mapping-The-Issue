// The camera is the browser's own scroll position. This file measures the world and flies the camera around it.
import { onFrame, viewport } from './loop.js';
import { motionAllowed } from './motion.js';
import { ZONES } from './zones.js';

/** How far above the ground line the bottom of the screen sits at the Surface, so soil peeks in. */
const SOIL_PEEK = 96;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function createCamera(world, onResize) {
  let layout = null;
  let stopFlight = null;

  function measure() {
    const zones = {};
    for (const { id } of ZONES) {
      const rect = document.getElementById(id).getBoundingClientRect();
      zones[id] = {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left,
        right: rect.right,
      };
    }
    layout = {
      zones,
      trunkTop: zones.trunk.top,
      trunkBottom: zones.trunk.bottom,
      groundY: zones.surface.bottom,
      height: document.documentElement.scrollHeight,
    };
  }

  // Uses the frame's shared measurements, so calling it never forces a layout mid-frame.
  const center = () => viewport.scrollY + viewport.height / 2;
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
  const clamp = (y) => Math.max(0, Math.min(y, maxScroll()));

  /** Outside the animation loop, the shared measurements can be a frame old, so read them fresh. */
  const freshCenter = () => window.scrollY + window.innerHeight / 2;

  /** The zones under the middle of the screen. Side-by-side zones can both match. */
  function zonesAtCenter({ fresh = false } = {}) {
    const y = fresh ? freshCenter() : center();
    return ZONES.filter(({ id }) => y >= layout.zones[id].top && y < layout.zones[id].bottom).map(({ id }) => id);
  }

  /** Where fast travel to a zone should put the top of the screen. */
  function entryPoint(id) {
    const { top, bottom } = layout.zones[id];
    const { entry } = ZONES.find((zone) => zone.id === id);
    if (entry === 'ground') return clamp(layout.groundY + SOIL_PEEK - window.innerHeight);
    if (entry === 'bottom') return clamp(bottom - window.innerHeight);
    return clamp(top);
  }

  function cancelFlight() {
    if (stopFlight) stopFlight(false);
  }

  /**
   * Flies to a scroll position. The visitor can always take over: any wheel, touch, or
   * scroll key cancels the flight, so nothing ever traps them.
   */
  function flyTo(target, { duration, onDone, onCancel } = {}) {
    cancelFlight();
    const from = window.scrollY;
    const to = clamp(target);
    if (!motionAllowed()) {
      window.scrollTo(0, to);
      onDone?.();
      return;
    }
    const time = duration ?? Math.min(1800, 500 + Math.abs(to - from) / 4);
    const start = performance.now();
    const stopTask = onFrame((now) => {
      const t = Math.min((now - start) / time, 1);
      window.scrollTo(0, from + (to - from) * easeInOut(t));
      if (t === 1) stopFlight(true);
    });
    const interrupt = () => stopFlight(false);
    const onKey = (event) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Escape', ' ', 'w', 's', 'W', 'S'].includes(event.key)) {
        interrupt();
      }
    };
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', onKey);
    stopFlight = (finished) => {
      stopTask();
      stopFlight = null;
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('keydown', onKey);
      if (finished) onDone?.();
      else onCancel?.();
    };
  }

  /** Flies so that an element ends up in the middle of the screen. */
  function centerOn(element, options) {
    const rect = element.getBoundingClientRect();
    flyTo(rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2, options);
  }

  /** Moves keyboard and screen-reader focus to a zone without moving the camera. */
  function focusZone(id) {
    document.getElementById(`${id}-title`)?.focus({ preventScroll: true });
  }

  function travelTo(id) {
    flyTo(entryPoint(id), { onDone: () => focusZone(id) });
  }

  /** Starts at the Surface, or at the zone named in the URL (for example #branch-2). */
  function jumpToStart() {
    const hashed = location.hash.slice(1);
    const id = layout.zones[hashed] ? hashed : 'surface';
    window.scrollTo(0, entryPoint(id));
    focusZone(id);
  }

  measure();

  // The world changes size when the phone layout restacks the branches, and when web fonts arrive
  // and reflow the text in the upper zones. Keep the visitor at the same spot in the same zone.
  let measuredWidth = world.clientWidth;
  let measuredHeight = world.offsetHeight;
  new ResizeObserver(() => {
    if (world.clientWidth === measuredWidth && world.offsetHeight === measuredHeight) return;
    measuredWidth = world.clientWidth;
    measuredHeight = world.offsetHeight;
    onResize?.();
    const [id] = zonesAtCenter({ fresh: true });
    const old = id && layout.zones[id];
    const progress = old ? (freshCenter() - old.top) / (old.bottom - old.top) : 0;
    measure();
    if (id) {
      const zone = layout.zones[id];
      window.scrollTo(0, clamp(zone.top + progress * (zone.bottom - zone.top) - window.innerHeight / 2));
    }
  }).observe(world);

  return {
    get layout() {
      return layout;
    },
    center,
    zonesAtCenter,
    flyTo,
    cancelFlight,
    travelTo,
    centerOn,
    focusZone,
    jumpToStart,
  };
}
