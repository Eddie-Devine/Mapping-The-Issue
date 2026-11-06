// The Tangle: a retro fighting-game showdown with no winner.
import { sfx } from '../audio/sfx.js';
import tangle from '../data/tangle.json';
import { mountScene } from '../scenes/runtime.js';
import { sharedFire } from '../scenes/world-misc.js';
import { pixelHtml, renderBlocks, renderTable } from './render.js';

/** Both sides always take the same damage: this map doesn't pick a winner. */
const healthAt = (stage) => 100 - stage * 15;

const healthBars = (stage) => `<div class="vs-bars" aria-hidden="true">
  <span class="vs-name">🌿🌍 PLANTS</span>
  <span class="vs-bar"><i style="width:${healthAt(stage)}%"></i></span>
  <span class="vs-mark">VS</span>
  <span class="vs-bar vs-bar-right"><i style="width:${healthAt(stage)}%"></i></span>
  <span class="vs-name">🔥 MEAT</span>
</div>`;

function roundBody(round) {
  const [plants, meat] = round.table.rows[0];
  const [plantsHead, meatHead] = round.table.head;
  return `<div class="vs-columns">
    <section><h4>${pixelHtml(plantsHead)}</h4><p>${plants.html}</p></section>
    <section><h4>${pixelHtml(meatHead)}</h4><p>${meat.html}</p></section>
  </div>
  <div class="vs-why"><p>${round.why.html}</p></div>`;
}

const finalBody = () =>
  `${renderBlocks(tangle.final.blocks)}<div class="vs-final-scene"></div><p class="final-line">${tangle.final.closingLine}</p>`;

/** The whole showdown on one screen, for accessibility and grading. */
function tableView() {
  const rows = tangle.rounds.map((round) => [
    { html: `<strong>${round.n}: ${round.title}</strong>` },
    round.table.rows[0][0],
    round.table.rows[0][1],
    { html: round.why.html },
  ]);
  const head = ['Round', ...tangle.rounds[0].table.head, 'Why they disagree'];
  return `<h3 class="vs-title">${pixelHtml(tangle.commonGround.heading)}</h3>
    ${renderBlocks(tangle.commonGround.blocks)}
    ${renderTable({ head, rows })}
    <h3 class="vs-title">${pixelHtml(tangle.final.heading)}</h3>
    ${finalBody()}`;
}

export const tangleMarkup = () => `<div class="vs-splash">
  <p class="vs-splash-title"><span>🌿🌍 PLANTS</span> <b>VS</b> <span>🔥 MEAT</span></p>
  <div class="vs-scene"></div>
  <div class="vs-splash-actions">
    <button class="pixel-btn" type="button" data-tangle="start">▶ START THE SHOWDOWN</button>
    <button class="pixel-btn" type="button" data-tangle="table">VIEW AS TABLE</button>
  </div>
</div>`;

export function connectTangle() {
  const el = document.createElement('dialog');
  el.className = 'vs-dialog on-dark';
  el.setAttribute('aria-labelledby', 'vs-heading');
  el.innerHTML = `
    <div class="vs-top"></div>
    <div class="vs-content" tabindex="-1"></div>
    <footer class="vs-foot">
      <button class="pixel-btn vs-table-btn" type="button">VIEW AS TABLE</button>
      <span class="vs-foot-right">
        <button class="pixel-btn vs-back" type="button">◀ BACK</button>
        <button class="pixel-btn vs-next" type="button"></button>
      </span>
    </footer>
  `;
  document.body.append(el);

  const top = el.querySelector('.vs-top');
  const content = el.querySelector('.vs-content');
  const back = el.querySelector('.vs-back');
  const next = el.querySelector('.vs-next');
  const tableButton = el.querySelector('.vs-table-btn');

  const LAST_ROUND = tangle.rounds.length;
  const FINAL = LAST_ROUND + 1;
  let stage = 0;
  let showingTable = false;
  let finalScene = null;

  function render() {
    tableButton.textContent = showingTable ? 'BACK TO THE FIGHT' : 'VIEW AS TABLE';
    if (showingTable) {
      top.innerHTML = '<h2 class="vs-heading" id="vs-heading">THE TANGLE AS A TABLE</h2>';
      content.innerHTML = tableView();
      back.hidden = true;
      next.textContent = 'CLOSE';
    } else {
      back.hidden = stage === 0;
      if (stage === 0) {
        top.innerHTML = `${healthBars(0)}<h2 class="vs-heading" id="vs-heading">${pixelHtml(tangle.commonGround.heading)}</h2>`;
        content.innerHTML = renderBlocks(tangle.commonGround.blocks);
        next.textContent = 'ROUND 1 ▶';
      } else if (stage === FINAL) {
        top.innerHTML = `${healthBars(LAST_ROUND)}<h2 class="vs-heading" id="vs-heading">${pixelHtml(tangle.final.heading)}</h2>`;
        content.innerHTML = finalBody();
        next.textContent = 'CLOSE';
      } else {
        const round = tangle.rounds[stage - 1];
        top.innerHTML = `${healthBars(stage)}<h2 class="vs-heading" id="vs-heading">ROUND ${round.n}: ${pixelHtml(round.title)}</h2>`;
        content.innerHTML = roundBody(round);
        next.textContent = stage === LAST_ROUND ? 'FINAL ▶' : 'NEXT ROUND ▶';
      }
    }
    finalScene?.destroy();
    finalScene = null;
    const host = content.querySelector('.vs-final-scene');
    if (host) finalScene = mountScene(host, sharedFire);
    content.scrollTop = 0;
    content.focus({ preventScroll: true });
  }

  next.addEventListener('click', () => {
    if (showingTable || stage === FINAL) el.close();
    else {
      stage++;
      sfx.bell();
      render();
    }
  });
  back.addEventListener('click', () => {
    stage--;
    render();
  });
  tableButton.addEventListener('click', () => {
    showingTable = !showingTable;
    render();
  });
  el.addEventListener('click', (event) => {
    if (event.target === el) el.close();
  });

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tangle]');
    if (!button) return;
    stage = 0;
    showingTable = button.dataset.tangle === 'table';
    el.showModal();
    render();
  });
}
