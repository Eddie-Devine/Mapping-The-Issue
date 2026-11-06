// RPG-style stats cards for the three positions. All three use the identical layout on purpose,
// so they can be compared fairly, side by side.
import zoneData from '../data/zones.json';
import { zoneById } from '../world/zones.js';
import { pixelText } from './render.js';

const BRANCHES = ['branch-1', 'branch-2', 'branch-3'];

const section = (label, inner) => `<details class="stat" open>
  <summary>${label}</summary>
  ${inner}
</details>`;

const list = (tag, items) => `<${tag}>${items.map((item) => `<li>${item.html}</li>`).join('')}</${tag}>`;

function card(id) {
  const { card: data } = zoneData[id];
  const zone = zoneById.get(id);
  return `<article class="stats-card stats-${id}">
    <h3>${pixelText(zone.role)}<small>${pixelText(zone.name)}</small></h3>
    ${section('CLAIM', `<p>${data.claim.html}</p>`)}
    ${section('REASONS', list('ol', data.reasons))}
    ${section('WARRANTS <span class="stat-note">(unstated assumptions)</span>', list('ul', data.warrants))}
    ${section("WHERE IT'S WEAK", list('ul', data.weak))}
  </article>`;
}

export const branchActionsMarkup = (id) => `<div class="branch-actions zone-bottom">
  <button class="pixel-btn" type="button" data-card="${id}">📊 POSITION CARD</button>
  <button class="pixel-btn" type="button" data-compare>⚖️ COMPARE ALL 3</button>
</div>`;

export function connectPositionCards({ dialog }) {
  document.addEventListener('click', (event) => {
    const cardButton = event.target.closest('[data-card]');
    if (cardButton) {
      const id = cardButton.dataset.card;
      dialog.open({
        titleHtml: `POSITION CARD`,
        pages: [`${card(id)}<p class="stats-compare-link"><button class="pixel-btn" type="button" data-compare>⚖️ COMPARE ALL 3</button></p>`],
        typed: false,
      });
    } else if (event.target.closest('[data-compare]')) {
      dialog.open({
        titleHtml: 'COMPARE ALL 3',
        pages: [`<div class="stats-compare">${BRANCHES.map(card).join('')}</div>`],
        typed: false,
        wide: true,
      });
    }
  });
}
