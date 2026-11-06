// Builds the world's DOM. The scenes are mounted on top of this by src/scenes/index.js.
import canopy from '../data/canopy.json';
import intro from '../data/intro.json';
import leaves from '../data/leaves.json';
import zoneData from '../data/zones.json';
import { graftMarkup } from '../ui/graft.js';
import { branchActionsMarkup } from '../ui/position-cards.js';
import { escapeHtml, pixelHtml, pixelText, renderBlocks, stripTags } from '../ui/render.js';
import { signpostsMarkup } from '../ui/surface.js';
import { tangleMarkup } from '../ui/tangle.js';
import { trunkHeightForYear } from './time.js';
import { HEIGHTS, STRATA, zoneById } from './zones.js';

const leafById = new Map(leaves.map((leaf) => [leaf.id, leaf]));

function plate(id, extra = '') {
  const zone = zoneById.get(id);
  return `<div class="plate">
    <h2 id="${id}-title" tabindex="-1">${escapeHtml(zone.name)}</h2>
    <p class="plate-role">${pixelText(zone.role)}</p>
    ${extra}
  </div>`;
}

const callout = (blocks) => `<div class="world-callout on-dark">${renderBlocks(blocks)}</div>`;

/** What each leaf looks like: fossils deep down, lotus buds and scrolls in the roots, fruit for heroes. */
function leafKind(leaf, isHero) {
  if (isHero) return 'fruit';
  return { taproot: 'fossil', 'root-india': 'lotus', 'root-greece': 'scroll' }[leaf.zone] ?? 'leaf';
}

/** Distant background layers: a texture and how much slower than the world it moves. */
const BACKGROUNDS = {
  canopy: [['cloudsWarm', 0.25], ['cloudsNear', 0.12]],
  tangle: [['ridgeFar', 0.12]],
  'branch-1': [['peaksFar', 0.14]],
  'branch-2': [['canopyFar', 0.14]],
  'branch-3': [['ridgeFar', 0.14], ['ridgeNear', 0.07]],
  trunk: [['cloudsFar', 0.3], ['cloudsNear', 0.15]],
  surface: [['hillsFar', 0.12], ['pinesFar', 0.06]],
};

const backgroundLayers = (id) => {
  const layers = BACKGROUNDS[id];
  if (!layers) return '';
  const markup = layers.map(([tile, rate]) => `<div class="plx plx-${tile}" data-rate="${rate}"></div>`).join('');
  return `<div class="zone-bg" aria-hidden="true">${markup}</div>`;
};

/** The year each storyline vine starts, from its first event. */
const VINE_START = { green: 1806, gold: 1890, pink: 1928, red: 2012 };

function leafButton(id) {
  const leaf = leafById.get(id);
  const isHero = /hero leaf/.test(leaf.type ?? '');
  const classes = ['leaf-btn', `kind-${leafKind(leaf, isHero)}`, leaf.vine && `vine-${leaf.vine}`, isHero && 'hero']
    .filter(Boolean)
    .join(' ');
  return `<button id="leaf-${id}" class="${classes}" type="button" data-leaf="${id}">
    <span class="leaf-sprite" aria-hidden="true"></span>
    <span class="leaf-label">${leaf.title}<span class="leaf-state"></span></span>
  </button>`;
}

const leafField = (ids, extraClass = '') =>
  `<div class="leaf-field ${extraClass}">${ids.map(leafButton).join('')}</div>`;

const section = (id, height, inner, { extraClass = '', grows = false } = {}) =>
  `<section id="${id}" class="zone zone-${id} ${extraClass}" style="${grows ? 'min-height' : 'height'}:${height}px" aria-labelledby="${id}-title">
    ${backgroundLayers(id)}
    ${inner}
  </section>`;

function branch(id) {
  const { tagline, takeaway, groups } = zoneData[id];
  const evidence = groups.find((group) => !group.bramble);
  const bramble = groups.find((group) => group.bramble);
  const brambleMarkup = bramble
    ? `<div class="bramble-patch on-dark">
        <h3>${pixelHtml(escapeHtml(bramble.title))}</h3>
        <p>${bramble.intro}</p>
        <div class="bramble-scene"></div>
        <div class="bramble-leaves">${bramble.leaves.map(leafButton).join('')}</div>
      </div>`
    : '';
  return section(
    id,
    HEIGHTS.branch,
    `${plate(id)}
    <div class="zone-top">
      <p class="zone-tagline">"${escapeHtml(tagline)}"</p>
      ${callout(takeaway)}
      ${brambleMarkup}
    </div>
    ${leafField(evidence.leaves)}
    ${branchActionsMarkup(id)}`,
    { extraClass: 'branch' },
  );
}

function trunkRings() {
  const rings = [];
  for (let decade = 1810; decade <= 2020; decade += 10) {
    rings.push(`<span class="ring" style="bottom:${trunkHeightForYear(decade)}px">${decade}</span>`);
  }
  return `<div class="rings" aria-hidden="true">${rings.join('')}</div>`;
}

function vineFilter(groups) {
  const buttons = groups
    .map(
      (group) => `<button class="vine-toggle vine-${group.vine}" type="button" aria-pressed="true" data-vine="${group.vine}"
        aria-label="${escapeHtml(stripTags(group.title))}" title="${escapeHtml(stripTags(group.title))}">${group.vine.toUpperCase()}</button>`,
    )
    .join('');
  return `<div class="vine-filter" role="group" aria-label="Show or hide storylines">${buttons}</div>`;
}

function strata() {
  const total = HEIGHTS.roots + HEIGHTS.taproot;
  const layers = STRATA.map((layer, i) => {
    const next = STRATA[i + 1]?.depth ?? total;
    return `<div class="stratum" style="top:${layer.depth}px;height:${next - layer.depth}px;background-color:${layer.color}">
      <span class="stratum-label">${layer.label}</span>
    </div>`;
  });
  return `<div class="strata" aria-hidden="true">${layers.join('')}</div>`;
}

function root(id) {
  const { intro: lead, takeaway, groups } = zoneData[id];
  return section(
    id,
    HEIGHTS.roots,
    `${plate(id)}
    <div class="zone-top">${callout(lead)}</div>
    ${leafField(groups.flatMap((group) => group.leaves))}
    <div class="zone-bottom">${callout(takeaway)}</div>`,
    { extraClass: 'chamber' },
  );
}

export function buildWorld(world) {
  const branchPicker = ['branch-1', 'branch-2', 'branch-3']
    .map((id) => `<button class="pixel-btn" type="button" data-fly="${id}">${pixelText(zoneById.get(id).name)}</button>`)
    .join('');
  const trunk = zoneData.trunk;
  const { taproot } = zoneData;

  world.innerHTML = `
    ${section(
      'canopy',
      HEIGHTS.canopy,
      `${plate('canopy')}
      <div class="canopy-flow">
        <div class="world-callout on-dark">
          ${renderBlocks(canopy.blocks)}
          <p class="canopy-count"></p>
        </div>
        <p class="final-line final-line-big">${canopy.finalLine}</p>
        <div class="canopy-actions">
          <button class="pixel-btn" type="button" data-fly="surface">🔁 CLIMB AGAIN</button>
          <button class="pixel-btn" type="button" data-open-map>🗺️ OPEN THE FULL MAP</button>
          <a class="pixel-btn" href="works-cited.html" target="_blank" rel="noopener">📚 WORKS CITED</a>
        </div>
      </div>`,
      { grows: true },
    )}
    ${section('tangle', HEIGHTS.tangle, `${plate('tangle')}${tangleMarkup()}`, { grows: true })}

    <div class="crown" style="--graft-height:${HEIGHTS.graft}px;--branch-height:${HEIGHTS.branch}px">
      ${branch('branch-3')}
      ${section('graft', HEIGHTS.graft, `${plate('graft')}${graftMarkup()}`, { grows: true })}
      <div class="crown-stem" aria-hidden="true"></div>
      ${branch('branch-2')}
      ${branch('branch-1')}
    </div>

    ${section(
      'trunk',
      HEIGHTS.trunk,
      `<div class="trunk-body" aria-hidden="true">
        ${Object.entries(VINE_START)
          .map(([vine, year]) => `<span class="vine vine-line-${vine}" style="bottom:${trunkHeightForYear(year)}px"></span>`)
          .join('')}
      </div>
      ${trunkRings()}
      ${plate('trunk', vineFilter(trunk.groups))}
      <div class="zone-top trunk-top">
        ${callout(trunk.takeaway)}
        <nav class="branch-picker" aria-label="Choose a branch">${branchPicker}</nav>
      </div>
      ${leafField(trunk.groups.flatMap((group) => group.leaves), 'trunk-field')}
      <p class="climb-hint">▲ SCROLL UP TO CLIMB</p>`,
    )}

    <section id="surface" class="zone zone-surface" style="height:${HEIGHTS.surface}px" aria-labelledby="surface-title">
      ${backgroundLayers('surface')}
      <div class="trunk-foot" aria-hidden="true"></div>
      <div class="surface-stack">
        <div class="plate plate-title">
          <h1 id="surface-title" tabindex="-1">${escapeHtml(intro.title)}</h1>
          <p class="plate-tagline">${escapeHtml(intro.subtitle)}</p>
          <p class="plate-role">${escapeHtml(intro.byline)}</p>
        </div>
        ${signpostsMarkup()}
        <p class="dig-hint">READ THE SIGNS, OR JUST SCROLL DOWN ▼</p>
        <button class="pixel-btn dig-btn" type="button" data-fly="root-india" hidden>▼ DIG INTO THE ROOTS</button>
      </div>
      <div class="ground" aria-hidden="true"></div>
    </section>

    <div class="underground">
      ${strata()}
      <div class="roots" style="height:${HEIGHTS.roots}px">
        ${root('root-india')}
        ${root('root-greece')}
      </div>
      ${section(
        'taproot',
        HEIGHTS.taproot,
        `<div class="taproot-line" aria-hidden="true"></div>
        ${plate('taproot')}
        <div class="zone-top">${callout(taproot.intro)}</div>
        ${leafField(taproot.groups.flatMap((group) => group.leaves))}
        <div class="zone-bottom taproot-end">
          ${callout(taproot.takeaway)}
          <button class="pixel-btn grow-btn" type="button" data-elevator>▲ GROW!</button>
        </div>`,
      )}
    </div>
  `;
}
