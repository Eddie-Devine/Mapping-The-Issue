// Types text out letter by letter. All the text stays in the page the whole time, just transparent,
// so the box doesn't jump as it fills and screen readers can read it right away.
import { onFrame } from '../world/loop.js';

const CHARS_PER_MS = 0.09;

/** `onChar` is called as letters appear, for the typing blip. */
export function typeOut(root, { onDone, onChar } = {}) {
  const segments = [];

  (function collect(parent) {
    for (const node of [...parent.childNodes]) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!node.data) continue;
        const untyped = document.createElement('span');
        untyped.className = 'untyped';
        untyped.textContent = node.data;
        node.after(untyped);
        const full = node.data;
        node.data = '';
        segments.push({ node, untyped, full, done: 0 });
      } else if (node.matches('a')) {
        // Links and citation chips appear whole when the text reaches them.
        node.classList.add('untyped');
        segments.push({ link: node });
      } else {
        collect(node);
      }
    }
  })(root);

  let index = 0;
  let budget = 0;
  let stop = null;

  function settle(segment) {
    if (segment.link) segment.link.classList.remove('untyped');
    else if (segment.untyped) {
      segment.node.data = segment.full;
      segment.untyped.remove();
      segment.untyped = null;
    }
  }

  function finish() {
    if (!stop) return;
    stop();
    stop = null;
    segments.forEach(settle);
    root.normalize();
    onDone?.();
  }

  stop = onFrame((now, dt) => {
    budget += dt * CHARS_PER_MS;
    while (budget >= 1 && index < segments.length) {
      const segment = segments[index];
      if (segment.link) {
        settle(segment);
        index++;
        continue;
      }
      const take = Math.min(Math.floor(budget), segment.full.length - segment.done);
      if (take > 0) onChar?.();
      segment.done += take;
      budget -= take;
      segment.node.data = segment.full.slice(0, segment.done);
      segment.untyped.textContent = segment.full.slice(segment.done);
      if (segment.done === segment.full.length) {
        settle(segment);
        index++;
      }
    }
    if (index === segments.length) finish();
  });

  return { finish, isRunning: () => Boolean(stop) };
}
