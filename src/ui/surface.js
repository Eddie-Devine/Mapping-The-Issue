// The Surface's signposts, and the shovel that appears once they've all been read.
import intro from '../data/intro.json';
import { progress } from '../world/progress.js';
import { pagesFromBlocks } from './pages.js';
import { escapeHtml, pixelText } from './render.js';

const THEY_SAY = intro.theySay.map((sign) => ({
  id: sign.id,
  label: sign.heading,
  titleHtml: `THEY SAY ${escapeHtml(sign.heading)}`,
  blocks: sign.blocks,
}));

const OTHERS = [
  { id: 'sign-map', label: intro.map.heading, blocks: intro.map.blocks },
  { id: 'sign-who-cares', label: intro.whoCares.heading, blocks: intro.whoCares.blocks },
  { id: 'sign-so-what', label: intro.soWhat.heading, blocks: intro.soWhat.blocks },
].map((sign) => ({ ...sign, titleHtml: pixelText(sign.label) }));

const SIGNS = [...THEY_SAY, ...OTHERS];

const signButton = ({ id, label }) =>
  `<button class="sign-btn" type="button" id="${id}" data-sign="${id}">${pixelText(label)}<span class="leaf-state visually-hidden"></span></button>`;

export function signpostsMarkup() {
  return `<div class="signposts">
    <p class="signs-label">THEY SAY…</p>
    ${THEY_SAY.map(signButton).join('')}
    ${OTHERS.map(signButton).join('')}
  </div>`;
}

export function connectSignposts({ dialog }) {
  const dig = document.querySelector('.dig-btn');
  const hint = document.querySelector('.dig-hint');
  const signIds = SIGNS.map((sign) => sign.id);

  function refresh() {
    for (const id of signIds) {
      if (progress.has(id)) {
        const button = document.getElementById(id);
        button.classList.add('collected');
        button.querySelector('.leaf-state').textContent = ' (read)';
      }
    }
    // Nothing is locked: this only changes the prompt. The visitor can always just scroll down.
    const allRead = progress.count(signIds) === signIds.length;
    dig.hidden = !allRead;
    hint.hidden = allRead;
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-sign]');
    if (!button) return;
    const sign = SIGNS.find(({ id }) => id === button.dataset.sign);
    dialog.open({ titleHtml: sign.titleHtml, pages: pagesFromBlocks(sign.blocks) });
    progress.add(sign.id);
  });

  progress.subscribe(refresh);
  refresh();
}
