// Renders the static pages (Read Mode and Works Cited) from the parsed data.
// Both pages work with no JavaScript, so they stay fast, printable, and easy to grade.
import { pixelText } from './content.mjs';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Press+Start+2P&family=Silkscreen&display=swap';

const shell = ({ title, description, body, bodyClass }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="/src/styles/read-mode.css">
</head>
<body class="${bodyClass}">
${body}
</body>
</html>
`;

const hero = (heading, subtitle = '', extra = '') => `<header class="hero">
  <div class="hero-inner">
    ${heading}
    ${subtitle}
    ${extra}
  </div>
  <div class="hero-grass" aria-hidden="true"></div>
</header>`;

function renderTable(block) {
  const head = block.head
    .map((cell) => `<th scope="col">${pixelText(cell) || '<span class="visually-hidden">Question</span>'}</th>`)
    .join('');
  const labelFor = (i) => block.head[i].replace(/<[^>]+>/g, '').replace(/"/g, '&quot;');
  const hasRowHeaders = block.head[0] === '';
  const rows = block.rows
    .map((row) => {
      const cells = row
        .map((cell, i) =>
          hasRowHeaders && i === 0
            ? `<th scope="row">${cell.html}</th>`
            : `<td data-label="${labelFor(i)}">${cell.html}</td>`,
        )
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('\n');
  return `<div class="table-wrap"><table class="stacking"><thead><tr>${head}</tr></thead><tbody>\n${rows}\n</tbody></table></div>`;
}

function renderBlocks(blocks) {
  return blocks
    .map((block) => {
      if (block.type === 'p') return `<p>${block.html}</p>`;
      if (block.type === 'table') return renderTable(block);
      const items = block.items.map((item) => `<li>${item.html}</li>`).join('\n');
      return `<${block.type}>\n${items}\n</${block.type}>`;
    })
    .join('\n');
}

const callout = (blocks, kind) => `<div class="callout callout-${kind}">\n${renderBlocks(blocks)}\n</div>`;

function renderCard(card) {
  const list = (tag, items) =>
    `<${tag}>\n${items.map((item) => `<li>${item.html}</li>`).join('\n')}\n</${tag}>`;
  return `<section class="position-card" aria-labelledby="card-${card.zone}">
<h3 id="card-${card.zone}">Position Card</h3>
<h4>Claim</h4>
<p>${card.claim.html}</p>
<h4>Reasons</h4>
${list('ol', card.reasons)}
<h4>Warrants <span class="heading-note">(unstated assumptions)</span></h4>
${list('ul', card.warrants)}
<h4>Where it's weak</h4>
${list('ul', card.weak)}
</section>`;
}

export function createPages({ data, leafChip }) {
  const leafById = new Map(data.leaves.map((leaf) => [leaf.id, leaf]));

  function renderLeaf(id, level) {
    const leaf = leafById.get(id);
    const also = leaf.alsoCited.length
      ? `<p class="also-cited">Also see: ${leaf.alsoCited.map(leafChip).join(' ')}</p>`
      : '';
    return `<article class="leaf" id="leaf-${leaf.id}">
<h${level}>${leaf.title}</h${level}>
<p>${leaf.html}</p>
${leaf.seeAlso ? `<p>${leaf.seeAlso}</p>` : ''}
${leaf.supportLine ? `<p class="support-line"><em>${leaf.supportLine}</em></p>` : ''}
${also}
</article>`;
  }

  /** Renders a zone's groups. A titled group adds one heading level above its leaves. */
  function renderGroups(zone, baseLevel) {
    return zone.groups
      .map((group) => {
        const leaves = (level) => group.leaves.map((id) => renderLeaf(id, level)).join('\n');
        if (!group.title) return leaves(baseLevel);
        const classes = ['leaf-group', group.vine && `vine-${group.vine}`, group.bramble && 'bramble']
          .filter(Boolean)
          .join(' ');
        return `<section class="${classes}">
<h${baseLevel}>${group.title}</h${baseLevel}>
${group.intro ? `<p>${group.intro}</p>` : ''}
${leaves(baseLevel + 1)}
</section>`;
      })
      .join('\n');
  }

  function renderRootOrTrunk(zone) {
    return `<section class="zone zone-${zone.id}" id="${zone.id}">
<h3>${zone.title}</h3>
${zone.intro ? callout(zone.intro, 'intro') : ''}
${renderGroups(zone, 4)}
${callout(zone.takeaway, 'takeaway')}
</section>`;
  }

  function renderBranch(zone, position) {
    return `<section class="part zone-${zone.id}" id="${zone.id}" aria-labelledby="${zone.id}-title">
<p class="eyebrow">Position ${position}</p>
<h2 id="${zone.id}-title">${zone.title}</h2>
<p class="tagline">"${zone.tagline}"</p>
${renderCard(zone.card)}
${renderGroups(zone, 3)}
${callout(zone.takeaway, 'takeaway')}
</section>`;
  }

  function renderIntro() {
    const { intro } = data;
    const signs = intro.theySay
      .map((sign) => `<section id="${sign.id}"><h4>${sign.heading}</h4>\n${renderBlocks(sign.blocks)}</section>`)
      .join('\n');
    return `<section class="part zone-surface" id="intro" aria-labelledby="intro-title">
<h2 id="intro-title">Introduction</h2>
<h3 id="they-say">They say…</h3>
${signs}
<h3 id="thesis">${intro.map.heading}</h3>
${callout(intro.map.blocks, 'intro')}
<h3 id="who-cares">${intro.whoCares.heading}</h3>
${renderBlocks(intro.whoCares.blocks)}
<h3 id="so-what">${intro.soWhat.heading}</h3>
${renderBlocks(intro.soWhat.blocks)}
</section>`;
  }

  function renderGraft() {
    const { graft } = data;
    const signposts = graft.signposts
      .map((s) => `<h4>Signpost ${s.n}: ${s.question}</h4>\n${renderBlocks(s.blocks)}`)
      .join('\n');
    return `<section class="part zone-graft" id="graft" aria-labelledby="graft-title">
<p class="eyebrow">Position 1 vs. Position 2</p>
<h2 id="graft-title">${graft.title}</h2>
<h3>Where they grow together <span class="heading-note">(intersection)</span></h3>
${renderBlocks(graft.intersection)}
<h3>Where they split <span class="heading-note">(divergence)</span></h3>
${renderBlocks(graft.divergence)}
<h3>Why do they split?</h3>
${signposts}
${callout(graft.takeaway, 'takeaway')}
</section>`;
  }

  function renderTangle() {
    const { tangle } = data;
    const rounds = tangle.rounds
      .map(
        (round) => `<section class="round">
<h3>Round ${round.n}: ${round.title}</h3>
${renderTable(round.table)}
<p>${round.why.html}</p>
</section>`,
      )
      .join('\n');
    return `<section class="part zone-tangle" id="tangle" aria-labelledby="tangle-title">
<p class="eyebrow">${pixelText('Positions 1 &amp; 2 vs. Position 3')}</p>
<h2 id="tangle-title">${tangle.title}</h2>
<h3>${tangle.commonGround.heading}</h3>
${renderBlocks(tangle.commonGround.blocks)}
${rounds}
<h3>${tangle.final.heading}</h3>
${callout(tangle.final.blocks, 'takeaway')}
<p class="final-line">${tangle.final.closingLine}</p>
</section>`;
  }

  function renderCanopy() {
    const { canopy } = data;
    return `<section class="part zone-canopy" id="canopy" aria-labelledby="canopy-title">
<p class="eyebrow">Conclusion</p>
<h2 id="canopy-title">${canopy.title}</h2>
${renderBlocks(canopy.blocks)}
<p class="final-line final-line-big">${canopy.finalLine}</p>
<p class="to-works-cited"><a href="works-cited.html">Works Cited</a></p>
</section>`;
  }

  function renderTimeline() {
    const rows = data.timeline
      .map((row) => {
        const chips = row.sources.map(leafChip).join(' ');
        const links = row.leaves
          .map((id) => `<a href="#leaf-${id}">${leafById.get(id).title}</a>`)
          .join('<br>');
        return `<tr><th scope="row">${row.date}</th><td data-label="Event">${row.event}<br>${chips}</td><td data-label="Read more">${links}</td></tr>`;
      })
      .join('\n');
    return `<section class="part zone-timeline" id="timeline" aria-labelledby="timeline-title">
<p class="eyebrow">Appendix</p>
<h2 id="timeline-title">Timeline</h2>
<div class="table-wrap"><table class="stacking timeline-table">
<thead><tr><th scope="col">Date</th><th scope="col">Event</th><th scope="col">Read more</th></tr></thead>
<tbody>
${rows}
</tbody></table></div>
</section>`;
  }

  function readPage() {
    const { intro, zones } = data;
    const toc = [
      ['intro', 'Introduction', 'They say, thesis, who cares, so what'],
      ['background', 'Background', 'The roots and the trunk'],
      ['branch-1', 'Position 1', 'Body & Mind'],
      ['branch-2', 'Position 2', 'Ethics & Earth'],
      ['graft', 'Position 1 vs. Position 2', 'The Graft'],
      ['branch-3', 'Position 3', 'Meat & Might'],
      ['tangle', 'Positions 1 & 2 vs. Position 3', 'The Tangle'],
      ['canopy', 'Conclusion', 'The Canopy'],
      ['timeline', 'Appendix', 'Timeline'],
    ]
      .map(
        ([id, label, note]) =>
          `<li><a href="#${id}">${label.replace(/&/g, '&amp;')}</a> <span class="toc-note">${note.replace(/&/g, '&amp;')}</span></li>`,
      )
      .join('\n');

    const body = `<a class="skip-link" href="#main">Skip to the article</a>
${hero(
  `<h1>${intro.title.replace(/&(?!amp;)/g, '&amp;')}</h1>`,
  `<p class="subtitle">${intro.subtitle}</p>`,
  `<p class="byline">${intro.byline}</p>
    <nav class="top-links" aria-label="Site"><a href="index.html">Back to the tree 🌳</a> <a href="works-cited.html">Works Cited 📚</a></nav>`,
)}
<nav class="toc" aria-labelledby="toc-title">
<h2 id="toc-title">Contents</h2>
<ol>
${toc}
</ol>
</nav>
<main id="main">
${renderIntro()}
<section class="part" id="background" aria-labelledby="background-title">
<h2 id="background-title">Background</h2>
${renderRootOrTrunk(zones.taproot)}
${renderRootOrTrunk(zones['root-india'])}
${renderRootOrTrunk(zones['root-greece'])}
${renderRootOrTrunk(zones.trunk)}
</section>
${renderBranch(zones['branch-1'], 1)}
${renderBranch(zones['branch-2'], 2)}
${renderGraft()}
${renderBranch(zones['branch-3'], 3)}
${renderTangle()}
${renderCanopy()}
${renderTimeline()}
</main>
<footer class="page-footer">
<a href="index.html">Back to the tree 🌳</a> <a href="works-cited.html">Works Cited 📚</a>
</footer>`;

    return shell({
      title: 'Read Mode | Roots &amp; Branches',
      description: 'The full text of Roots &amp; Branches, a map of the vegetarian debate, as a clean, printable article.',
      body,
      bodyClass: 'read-mode',
    });
  }

  function worksCitedPage() {
    const entries = data.sources
      .map((source) => `<p class="entry" id="src-${source.id}">${source.mlaHtml}</p>`)
      .join('\n');
    const body = `<a class="skip-link" href="#main">Skip to the list</a>
${hero(
  '<h1>Works Cited</h1>',
  '',
  '<nav class="top-links" aria-label="Site"><a href="index.html">Back to the tree 🌳</a> <a href="read.html">Read Mode 📖</a></nav>',
)}
<main id="main" class="works-cited">
${entries}
</main>`;
    return shell({
      title: 'Works Cited | Roots &amp; Branches',
      description: 'Works Cited (MLA 9) for Roots &amp; Branches, a map of the vegetarian debate.',
      body,
      bodyClass: 'works-cited-page',
    });
  }

  return { readPage, worksCitedPage };
}
