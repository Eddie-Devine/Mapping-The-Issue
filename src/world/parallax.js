// Moves the distant background layers a little slower than the world. Off on phones and with reduced
// motion, because smooth beats clever: scrolling itself must never stutter.
import { onFrame, viewport } from './loop.js';
import { motionAllowed } from './motion.js';

const WIDE_ENOUGH = window.matchMedia('(min-width: 641px)');

export function createParallax(camera) {
  const layers = [...document.querySelectorAll('.plx[data-rate]')].map((element) => ({
    element,
    rate: Number(element.dataset.rate),
    zone: element.closest('.zone').id,
    offset: null,
  }));

  let lastScroll = null;
  onFrame(() => {
    if (viewport.scrollY === lastScroll) return;
    lastScroll = viewport.scrollY;
    const active = WIDE_ENOUGH.matches && motionAllowed();
    const center = camera.center();
    const reach = viewport.height;
    for (const layer of layers) {
      const { top, bottom } = camera.layout.zones[layer.zone];
      if (center < top - reach || center > bottom + reach) continue;
      const offset = active ? Math.round((center - (top + bottom) / 2) * layer.rate) : 0;
      if (offset === layer.offset) continue;
      layer.offset = offset;
      layer.element.style.transform = `translateY(${offset}px)`;
    }
  });
}
