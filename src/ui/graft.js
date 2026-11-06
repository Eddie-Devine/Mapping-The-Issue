// The Graft: where Branches 1 and 2 grow together, and why they split.
import graft from '../data/graft.json';
import { pagesFromBlocks } from './pages.js';
import { pixelText, renderBlocks, renderTable, stripTags } from './render.js';

const table = graft.divergence.find((block) => block.type === 'table');
const signpostLabel = (s) => `SIGNPOST ${s.n}: ${s.question}`;

/** One side of the comparison table, as a list: "Who benefits? Me: my health, performance, focus." */
const sideItems = (column) => ({
  type: 'ul',
  items: table.rows.map((row) => ({ html: `${row[0].html} ${row[column].html}` })),
});

export function graftMarkup() {
  return `<div class="graft-flow">
    <div class="world-callout on-dark">${renderBlocks(graft.takeaway)}</div>
    <div class="venn">
      <button class="venn-leaf venn-left" type="button" data-graft="b1">${pixelText(stripTags(table.head[1]))}</button>
      <button class="venn-leaf venn-right" type="button" data-graft="b2">${pixelText(stripTags(table.head[2]))}</button>
      <button class="venn-middle" type="button" data-graft="shared">WHERE THEY GROW TOGETHER</button>
    </div>
    <button class="pixel-btn" type="button" data-graft="split">WHERE THEY SPLIT</button>
    <div class="graft-signs">
      <p class="signs-label">WHY DO THEY SPLIT?</p>
      ${graft.signposts.map((s) => `<button class="sign-btn" type="button" data-graft="sign-${s.n}">${pixelText(s.question)}</button>`).join('')}
    </div>
  </div>`;
}

export function connectGraft({ dialog }) {
  const views = {
    shared: () => ({ titleHtml: 'WHERE THEY GROW TOGETHER', pages: pagesFromBlocks(graft.intersection) }),
    split: () => ({ titleHtml: 'WHERE THEY SPLIT', pages: [renderTable(table)], typed: false, wide: true }),
    b1: () => ({ titleHtml: pixelText(stripTags(table.head[1])), pages: pagesFromBlocks([sideItems(1)]) }),
    b2: () => ({ titleHtml: pixelText(stripTags(table.head[2])), pages: pagesFromBlocks([sideItems(2)]) }),
  };
  for (const s of graft.signposts) {
    views[`sign-${s.n}`] = () => ({
      kickerHtml: 'WHY DO THEY SPLIT?',
      titleHtml: pixelText(signpostLabel(s)),
      pages: pagesFromBlocks(s.blocks),
    });
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-graft]');
    if (button) dialog.open({ kickerHtml: 'THE GRAFT', ...views[button.dataset.graft]() });
  });
}
