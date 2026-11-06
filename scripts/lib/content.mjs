// Parses content/*.md into structured data. The markdown files are the source of truth.
//
// This parser is deliberately strict: if a file contains something it doesn't
// recognize, the build stops. That way no content is silently dropped from the
// site, and no note meant for the builder is silently shown on it.
import { marked } from 'marked';

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Silkscreen's ampersand looks like a currency sign, so that one character uses a clearer font. */
export const pixelText = (html) => html.replace(/&amp;/g, '<span class="amp">&amp;</span>');

/** Lines that describe the build rather than the debate. Never shown on the site. */
const BUILDER_LINES = [
  /^\*\*Where it lives on the tree:\*\*/,
  /^\*\*Assignment requirements? (?:this file )?cover/,
  /^\*\(These leaves sit on a thin root/,
  /^Three wooden pixel signposts stand/,
];

/** Removes notes-to-the-builder blockquotes and lines. */
function stripBuilderNotes(markdown) {
  const out = [];
  const lines = markdown.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('>')) {
      const group = [];
      while (i < lines.length && lines[i].startsWith('>')) group.push(lines[i++]);
      i--;
      if (!/^>\s*\*\*(?:Framing note for |For )Claude Code/.test(group[0])) out.push(...group);
      continue;
    }
    if (!BUILDER_LINES.some((re) => re.test(lines[i]))) out.push(lines[i]);
  }
  return out.join('\n');
}

/** Splits a file on its "## " headings. */
function splitSections(markdown) {
  const parts = stripBuilderNotes(markdown).split(/^## /m);
  const sections = parts.slice(1).map((part) => {
    const newline = part.indexOf('\n');
    return { title: part.slice(0, newline).trim(), body: part.slice(newline + 1).trim() };
  });
  return { preamble: parts[0], sections: sections.filter((s) => !/for Claude Code/.test(s.title)) };
}

/** Splits a section on its "### " headings. */
function splitSubsections(body) {
  const parts = body.split(/^### /m);
  return {
    lead: parts[0].replace(/^---\s*$/gm, '').trim(),
    subs: parts.slice(1).map((part) => {
      const newline = part.indexOf('\n');
      return {
        title: part.slice(0, newline).trim(),
        body: part.slice(newline + 1).replace(/^---\s*$/gm, '').trim(),
      };
    }),
  };
}

export function createParser(sources) {
  const errors = [];
  const leafRefs = new Set();
  const leaves = [];
  const leafIds = new Set();
  const textRecords = []; // Every displayed text with its location, for the uncited-text report.

  function chip(source) {
    const label = `[${source.chip}]`;
    return (
      `<a class="chip" href="works-cited.html#src-${source.id}" target="_blank" rel="noopener" ` +
      `data-title="${escapeAttr(source.title)}" ` +
      `aria-label="${escapeAttr(`${label} ${source.title}. Opens Works Cited in a new tab.`)}">` +
      `${pixelText(escapeAttr(label))}</a>`
    );
  }

  /** Converts one piece of inline markdown into HTML with citation chips. */
  function rich(md, where, { report = true } = {}) {
    const cites = [];
    const withTokens = md.replace(/\[src:([^\]]+)\]/g, (_, id) => {
      if (!sources.has(id)) errors.push(`${where}: unknown citation [src:${id}]`);
      cites.push(id);
      return `CITETOKEN${cites.length - 1}X`;
    });
    const html = marked
      .parseInline(withTokens)
      .replace(/\bLEAF ([a-z0-9]+-[A-Za-z0-9]+)/g, (_, id) => {
        leafRefs.add(`${id}|${where}`);
        return `<a class="leaf-ref" href="#leaf-${id}" data-leaf="${id}">LEAF ${id}</a>`;
      })
      .replace(/CITETOKEN(\d+)X/g, (_, i) => {
        const source = sources.get(cites[Number(i)]);
        return source ? chip(source) : '';
      });
    if (report) textRecords.push({ where, md, cites });
    return { html, cites: [...new Set(cites)] };
  }

  /** Converts block markdown into paragraphs, lists, and tables. */
  function blocks(md, where, { splitLines = false } = {}) {
    const out = [];
    for (const token of marked.lexer(md)) {
      if (token.type === 'space' || token.type === 'hr') continue;
      if (token.type === 'paragraph') {
        // Lines inside a callout are separate paragraphs, not one wrapped paragraph.
        const lines = splitLines ? token.text.split('\n') : [token.text.replace(/\n/g, ' ')];
        for (const line of lines) out.push({ type: 'p', ...rich(line.trim(), where) });
      } else if (token.type === 'list') {
        out.push({
          type: token.ordered ? 'ol' : 'ul',
          items: token.items.map((item) => rich(item.text.replace(/\n/g, ' ').trim(), where)),
        });
      } else if (token.type === 'table') {
        out.push({
          type: 'table',
          head: token.header.map((cell) => rich(cell.text, where, { report: false }).html),
          rows: token.rows.map((row) =>
            row.map((cell, c) => rich(cell.text, where, { report: c > 0 || row.length === 2 })),
          ),
        });
      } else if (token.type === 'blockquote') {
        out.push(...blocks(token.text, where, { splitLines: true }));
      } else {
        errors.push(`${where}: unexpected markdown block "${token.type}": ${token.raw.slice(0, 60)}`);
      }
    }
    return out;
  }

  function parseLeaf(heading, body, zone, extra = {}) {
    const match = heading.match(/^(?:(\S+)\s+)?LEAF\s+(\S+)\s+—\s+(.+)$/u);
    const [, icon, id, title] = match;
    const where = `Leaf ${id}`;
    const fields = {};
    for (const line of body.split('\n').filter((l) => l.trim())) {
      const field = line.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
      if (!field) {
        errors.push(`${where}: unexpected line: ${line.slice(0, 70)}`);
        continue;
      }
      fields[field[1]] = field[2];
    }
    const known = ['Type', 'Text', 'Pixel scene', 'Sources', 'Accuracy note', 'Note for Claude Code', 'Link'];
    for (const name of Object.keys(fields)) {
      if (!known.includes(name)) errors.push(`${where}: unknown field "${name}"`);
    }
    if (!fields.Text) errors.push(`${where}: missing Text`);
    if (!fields.Sources) errors.push(`${where}: missing Sources`);
    if (leafIds.has(id)) errors.push(`${where}: duplicate leaf ID`);
    leafIds.add(id);

    const text = rich(fields.Text ?? '', where);
    const listed = [...(fields.Sources ?? '').matchAll(/\[src:([^\]]+)\]/g)].map((m) => m[1]);
    for (const sourceId of listed) {
      if (!sources.has(sourceId)) errors.push(`${where}: unknown citation [src:${sourceId}]`);
    }

    // The only builder note with reader-facing text is the support line on trk-p3.
    const support = fields['Note for Claude Code']?.match(/add one small line under it: \*"(.+?)"\*/)?.[1];

    const leaf = {
      id,
      icon: icon ?? null,
      title: rich(title, where, { report: false }).html,
      zone,
      type: fields.Type ?? null,
      html: text.html,
      cites: text.cites,
      // Sources listed for the leaf but not tagged in its text still get a chip.
      alsoCited: listed.filter((s) => !text.cites.includes(s)),
      seeAlso: fields.Link ? rich(fields.Link, where).html : null,
      supportLine: support ?? null,
      scene: fields['Pixel scene'] ?? null,
      ...extra,
    };
    leaves.push(leaf);
    return id;
  }

  function parseLeafGroup(section, zone, extra = {}) {
    const { lead, subs } = splitSubsections(section.body);
    if (lead) errors.push(`${zone} / ${section.title}: unexpected text before the first leaf: ${lead.slice(0, 70)}`);
    return subs.map((sub) => {
      if (!/LEAF\s/.test(sub.title)) errors.push(`${zone}: expected a leaf, found "${sub.title}"`);
      return parseLeaf(sub.title, sub.body, zone, extra);
    });
  }

  function parseCard(section, zone) {
    const where = `${zone} position card`;
    const tokens = marked.lexer(section.body).filter((t) => !['space', 'hr'].includes(t.type));
    const card = { zone, claim: null, reasons: null, warrants: null, weak: null };
    const items = (list) => list.items.map((item) => rich(item.text.replace(/\n/g, ' ').trim(), where));
    for (let i = 0; i < tokens.length; i++) {
      const raw = tokens[i].type === 'paragraph' ? tokens[i].text : '';
      const claim = raw.match(/^\*\*CLAIM:\*\*\s*(.+)$/s);
      if (claim) card.claim = rich(claim[1].replace(/\n/g, ' '), where);
      else if (/^\*\*REASONS\*\*$/.test(raw)) card.reasons = items(tokens[++i]);
      else if (/^\*\*WARRANTS/.test(raw)) card.warrants = items(tokens[++i]);
      else if (/^\*\*WHERE THIS POSITION IS WEAK/.test(raw)) card.weak = items(tokens[++i]);
      else errors.push(`${where}: unexpected block: ${tokens[i].raw.slice(0, 70)}`);
    }
    for (const key of ['claim', 'reasons', 'warrants', 'weak']) {
      if (!card[key]) errors.push(`${where}: missing ${key}`);
    }
    return card;
  }

  const fileTitle = (preamble) => preamble.match(/^# (?:\d+ — )?(.+)$/m)[1].trim();

  function parseIntro(markdown) {
    const { sections } = splitSections(markdown);
    const find = (re) => {
      const section = sections.find((s) => re.test(s.title));
      if (!section) errors.push(`01-intro: missing section ${re}`);
      return section;
    };
    const titleScreen = {};
    for (const m of find(/^Title screen/).body.matchAll(/^- \*\*(.+?):\*\*\s*(.+)$/gm)) {
      titleScreen[m[1].toLowerCase()] = m[2].replace(/`/g, '');
    }
    const theySay = splitSubsections(find(/THEY SAY/).body).subs.map((sub) => {
      const m = sub.title.match(/^Sign ([A-C]) — "(.+)"$/);
      return { id: `sign-${m[1].toLowerCase()}`, heading: m[2], blocks: blocks(sub.body, `Sign ${m[1]}`) };
    });
    return {
      ...titleScreen,
      theySay,
      map: { heading: 'THE MAP', blocks: blocks(find(/THE MAP/).body, 'The Map') },
      whoCares: { heading: 'WHO CARES?', blocks: blocks(find(/WHO CARES/).body, 'Who Cares') },
      soWhat: { heading: 'SO WHAT?', blocks: blocks(find(/SO WHAT/).body, 'So What') },
    };
  }

  /** Roots, trunk, and branches all share this structure. */
  function parseZone(markdown, zone) {
    const { preamble, sections } = splitSections(markdown);
    const result = {
      id: zone,
      title: fileTitle(preamble),
      tagline: null,
      intro: null,
      card: null,
      groups: [],
      takeaway: null,
    };
    const tagline = preamble.match(/^### "(.+)"$/m);
    if (tagline) result.tagline = tagline[1];
    const thorn = preamble.match(/^\*\*Thorn offshoot:\*\*\s*(.+)$/m);

    for (const section of sections) {
      if (/^Layer intro/.test(section.title)) {
        // In the roots files, the main leaves follow the intro with no heading of their own.
        const { lead, subs } = splitSubsections(section.body);
        result.intro = blocks(lead, `${zone} intro`, { splitLines: true });
        if (subs.length) {
          result.groups.push({
            title: null,
            vine: null,
            bramble: false,
            leaves: subs.map((sub) => parseLeaf(sub.title, sub.body, zone)),
          });
        }
      } else if (/takeaway/i.test(section.title)) {
        result.takeaway = blocks(section.body, `${zone} takeaway`, { splitLines: true });
      } else if (section.title === 'POSITION CARD') {
        result.card = parseCard(section, zone);
      } else {
        const bramble = /THE BRAMBLE/.test(section.title);
        const vine = section.title.match(/\b(GREEN|GOLD|PINK|RED) VINE\b/)?.[1].toLowerCase() ?? null;
        const extra = { ...(bramble && { bramble: true }), ...(vine && { vine }) };
        const group = {
          title:
            section.title === 'LEAVES ON THIS BRANCH'
              ? 'Evidence'
              : section.title.replace(/\s*\(shallow root[^)]*\)$/, ''),
          vine,
          bramble,
          leaves: parseLeafGroup(section, zone, extra),
        };
        if (bramble) {
          if (!thorn) errors.push(`${zone}: missing Thorn offshoot description`);
          else group.intro = rich(thorn[1].replace(/\s*See LEAF b2-T below\.\s*$/, ''), `${zone} Bramble`).html;
        }
        result.groups.push(group);
      }
    }
    return result;
  }

  function parseGraft(markdown) {
    const { preamble, sections } = splitSections(markdown);
    const find = (re) => sections.find((s) => re.test(s.title));
    return {
      title: fileTitle(preamble),
      intersection: blocks(find(/GROW TOGETHER/).body, 'Graft intersection'),
      divergence: blocks(find(/WHERE THEY SPLIT/).body, 'Graft divergence'),
      signposts: splitSubsections(find(/WHY DO THEY SPLIT/).body).subs.map((sub) => {
        const m = sub.title.match(/^Signpost (\d) — (.+)$/);
        return { n: Number(m[1]), question: m[2], blocks: blocks(sub.body, `Graft signpost ${m[1]}`) };
      }),
      takeaway: blocks(find(/takeaway/i).body, 'Graft takeaway', { splitLines: true }),
    };
  }

  function parseTangle(markdown) {
    const { preamble, sections } = splitSections(markdown);
    const common = sections.find((s) => /COMMON GROUND/.test(s.title));
    const final = sections.find((s) => /^FINAL SCREEN/.test(s.title));
    const sceneLine = final.body.match(/^\*\*Pixel scene for the final screen:\*\*.*$/m)?.[0];
    const closing = sceneLine?.match(/Text fades in: \*\*"(.+?)"\*\*/)?.[1];
    if (!closing) errors.push('10-crossroads: missing final-screen closing line');

    return {
      title: fileTitle(preamble),
      commonGround: { heading: 'THE COMMON GROUND', blocks: blocks(common.body, 'Tangle common ground') },
      rounds: sections
        .filter((s) => /^ROUND \d/.test(s.title))
        .map((s) => {
          const m = s.title.match(/^ROUND (\d) — (.+)$/);
          const parts = blocks(s.body, `Tangle round ${m[1]}`);
          const table = parts.find((b) => b.type === 'table');
          const why = parts.find((b) => b.type === 'p');
          if (!table || !why || parts.length !== 2) errors.push(`Tangle round ${m[1]}: expected one table and one explanation`);
          return { n: Number(m[1]), title: m[2], table, why };
        }),
      final: {
        heading: final.title.match(/"(.+)"/)[1],
        blocks: blocks(final.body.replace(sceneLine, ''), 'Tangle final', { splitLines: true }),
        closingLine: closing,
        scene: sceneLine.replace(/^\*\*Pixel scene for the final screen:\*\*\s*/, ''),
      },
    };
  }

  function parseCanopy(markdown) {
    const { preamble, sections } = splitSections(markdown);
    const body = sections.find((s) => s.title === 'Text').body;
    const finalLine = body.match(/^\*\*Final line[^*]*\*\*\s*`(.+)`\s*$/m);
    if (!finalLine) errors.push('11-canopy: missing final line');
    return {
      title: fileTitle(preamble),
      blocks: blocks(body.replace(finalLine[0], ''), 'Canopy', { splitLines: true }),
      finalLine: finalLine[1],
    };
  }

  function parseTimeline(markdown) {
    const table = marked.lexer(stripBuilderNotes(markdown)).find((t) => t.type === 'table');
    return table.rows.map((row, i) => {
      const [sortYear, date, event, zone, leaf, src] = row.map((cell) => cell.text.trim());
      const where = `Timeline row ${i + 1} (${date})`;
      if (!Number.isFinite(Number(sortYear))) errors.push(`${where}: sortYear is not a number`);
      const ids = src.split(',').map((s) => s.trim());
      for (const id of ids) {
        if (!sources.has(id)) errors.push(`${where}: unknown source "${id}"`);
      }
      return {
        sortYear: Number(sortYear),
        date,
        event: rich(event, where, { report: false }).html,
        zones: zone.split('/').map((z) => z.trim()),
        leaves: leaf.split(',').map((l) => l.trim()),
        sources: ids,
      };
    });
  }

  /** Runs the checks that need every file to be parsed first, then stops the build on any problem. */
  function finish(timeline) {
    for (const ref of leafRefs) {
      const [id, where] = ref.split('|');
      if (!leafIds.has(id)) errors.push(`${where}: refers to LEAF ${id}, which doesn't exist`);
    }
    timeline.forEach((row, i) => {
      for (const id of row.leaves) {
        if (!leafIds.has(id)) errors.push(`Timeline row ${i + 1}: unknown leaf "${id}"`);
      }
      if (i > 0 && row.sortYear < timeline[i - 1].sortYear) {
        errors.push(`Timeline row ${i + 1}: out of order`);
      }
    });
    const support = leaves.find((l) => l.id === 'trk-p3')?.supportLine;
    if (!support) errors.push('Leaf trk-p3: the required support line is missing');
    if (errors.length) {
      throw new Error(`Content build failed:\n  - ${errors.join('\n  - ')}`);
    }
  }

  return {
    parseIntro,
    parseZone,
    parseGraft,
    parseTangle,
    parseCanopy,
    parseTimeline,
    finish,
    leaves,
    textRecords,
    sourceChip: (id) => chip(sources.get(id)),
  };
}
