// Opening leaves: the dialog text, and marking a leaf as collected.
import chips from '../data/chips.json';
import leaves from '../data/leaves.json';
import zoneData from '../data/zones.json';
import { LEAF_SCENES } from '../scenes/leaf-scenes.js';
import { progress } from '../world/progress.js';
import { zoneById } from '../world/zones.js';
import { pagesFromHtml } from './pages.js';
import { pixelHtml, pixelText } from './render.js';

export const leafById = new Map(leaves.map((leaf) => [leaf.id, leaf]));
export const LEAF_IDS = leaves.map((leaf) => leaf.id);

/** Which titled group each leaf belongs to, such as a trunk vine or the Bramble. */
const groupTitle = new Map();
for (const zone of Object.values(zoneData)) {
  for (const group of zone.groups) {
    if (group.title && group.title !== 'Evidence') {
      for (const id of group.leaves) groupTitle.set(id, group.title);
    }
  }
}

const CHIP_RUN = /(?:<a class="chip".*?<\/a>\s*)+/;

/**
 * Content often cites a whole passage once, at its end. When that passage spans several pages,
 * the earlier pages would show facts with no citation, so they repeat the citation that closes it.
 */
function carryCitationsBack(pages) {
  return pages.map((page, index) => {
    if (CHIP_RUN.test(page)) return page;
    const later = pages.slice(index + 1).find((other) => CHIP_RUN.test(other));
    if (!later) return page; // Analysis after the last citation has nothing to carry.
    return `${page}<p class="page-source">Source: ${later.match(CHIP_RUN)[0].trim()}</p>`;
  });
}

export function leafDialogContent(id) {
  const leaf = leafById.get(id);
  const pages = carryCitationsBack(pagesFromHtml(leaf.html));

  // Everything that belongs after the leaf's text goes on its final page.
  let ending = '';
  if (leaf.seeAlso) ending += `<p>${leaf.seeAlso}</p>`;
  if (leaf.supportLine) ending += `<p class="support-line"><em>${leaf.supportLine}</em></p>`;
  if (leaf.alsoCited.length) {
    ending += `<p class="also-cited">Also see: ${leaf.alsoCited.map((source) => chips[source]).join(' ')}</p>`;
  }
  pages[pages.length - 1] += ending;

  const zone = zoneById.get(leaf.zone).name;
  const group = groupTitle.get(id);
  return {
    kickerHtml: pixelText(zone) + (group ? ` · ${pixelText(group)}` : ''),
    titleHtml: pixelHtml(leaf.title),
    pages,
    scene: LEAF_SCENES[id]?.() ?? null,
  };
}

/** Wires every leaf button: shows collected leaves as collected, now and whenever one is opened. */
export function connectLeaves({ dialog, camera }) {
  const buttonFor = (id) => document.getElementById(`leaf-${id}`);

  function markCollected(id) {
    const button = buttonFor(id);
    if (!button) return;
    button.classList.add('collected');
    button.querySelector('.leaf-state').textContent = ' (collected)';
  }

  for (const id of LEAF_IDS) {
    if (progress.has(id)) markCollected(id);
  }
  progress.subscribe(markCollected);

  function open(id) {
    progress.add(id);
    dialog.open(leafDialogContent(id));
  }

  /** Flies to a leaf somewhere else in the world, opens it, and leaves focus on it afterward. */
  function travelAndOpen(id) {
    const button = buttonFor(id);
    button.hidden = false; // A vine filter may have hidden it.
    if (dialog.isOpen) dialog.close();
    button.focus({ preventScroll: true });
    camera.centerOn(button, { onDone: () => open(id) });
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-leaf]');
    if (!target) return;
    event.preventDefault();
    if (target.classList.contains('leaf-ref')) travelAndOpen(target.dataset.leaf);
    else open(target.dataset.leaf);
  });

  return { open, travelAndOpen };
}
