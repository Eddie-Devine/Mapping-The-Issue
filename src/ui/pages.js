// Splits content into dialog-box pages of about 60 words, always between sentences,
// so no wording changes and a citation never gets separated from its sentence.
const MAX_WORDS = 60;
const MIN_LAST_PAGE_WORDS = 15;
const MAX_MERGED_WORDS = 72;

/** Words that end in a period without ending a sentence. */
const NOT_A_SENTENCE_END = /(?:^|[\s("])(?:Dr|Mr|Mrs|Ms|St|vs|c|ca|Jan|Feb|Mar|Apr|Aug|Sept|Oct|Nov|Dec|al|No|Ven|U\.S|e\.g|i\.e|[A-Z])\.$/;
const STARTS_A_SENTENCE = /^["'“‘(*]?[A-Z0-9]/;
const SENTENCE_END = /[.?!]["'”’)]*(\s+)/g;

const escapeText = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const isChip = (node) => node?.nodeType === Node.ELEMENT_NODE && node.classList.contains('chip');

function parse(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
}

function countWords(html) {
  const fragment = parse(html);
  for (const chip of fragment.querySelectorAll('.chip')) chip.remove();
  return fragment.textContent.trim().split(/\s+/).filter(Boolean).length;
}

/** Splits inline HTML into sentences. Bold, italics, and chips are never cut in half. */
export function splitSentences(html) {
  const sentences = [];
  let current = '';
  const flush = () => {
    if (current.trim()) sentences.push(current.trim());
    current = '';
  };

  const nodes = [...parse(html).childNodes];
  nodes.forEach((node, index) => {
    if (node.nodeType !== Node.TEXT_NODE) {
      current += node.outerHTML;
      return;
    }
    const text = node.data;

    // A sentence can end inside bold text: **"The Bramble."** It's where...
    const previous = nodes[index - 1];
    if (previous && !isChip(previous) && /[.?!]["'”’)]*$/.test(previous.textContent) && /^\s+["'“‘(]?[A-Z]/.test(text)) {
      flush();
    }

    let last = 0;
    for (const match of text.matchAll(SENTENCE_END)) {
      const end = match.index + match[0].length;
      const upToPunctuation = current + text.slice(last, end).trimEnd();
      const plainSoFar = upToPunctuation.replace(/<[^>]+>/g, '');
      if (NOT_A_SENTENCE_END.test(plainSoFar)) continue;

      const rest = text.slice(end);
      const next = nodes[index + 1];
      const startsNew = rest ? STARTS_A_SENTENCE.test(rest) : Boolean(next) && !isChip(next);
      if (!startsNew) continue;

      current += escapeText(text.slice(last, end));
      last = end;
      flush();
    }
    current += escapeText(text.slice(last));
  });
  flush();
  return sentences;
}

/** Groups pieces into pages without going over the word limit, unless one piece alone is longer. */
function groupByWords(pieces, wordsOf) {
  const groups = [];
  let group = [];
  let words = 0;
  for (const piece of pieces) {
    const count = wordsOf(piece);
    if (group.length && words + count > MAX_WORDS) {
      groups.push(group);
      group = [];
      words = 0;
    }
    group.push(piece);
    words += count;
  }
  if (group.length) groups.push(group);

  // A last page of just a few words reads like a mistake, so it joins the page before it.
  if (groups.length > 1) {
    const total = (pieces2) => pieces2.reduce((sum, piece) => sum + wordsOf(piece), 0);
    const tail = groups[groups.length - 1];
    const before = groups[groups.length - 2];
    if (total(tail) < MIN_LAST_PAGE_WORDS && total(tail) + total(before) <= MAX_MERGED_WORDS) {
      before.push(...groups.pop());
    }
  }
  return groups;
}

/** Pages for a single stretch of inline HTML, such as a leaf's text. */
export function pagesFromHtml(html) {
  return groupByWords(splitSentences(html), countWords).map((group) => `<p>${group.join(' ')}</p>`);
}

/** Pages for a mix of paragraphs and lists, such as the signposts. */
export function pagesFromBlocks(blocks) {
  const pieces = [];
  for (const block of blocks) {
    if (block.type === 'p') {
      splitSentences(block.html).forEach((html) => pieces.push({ html, block }));
    } else {
      block.items.forEach((item) => pieces.push({ html: item.html, block, listType: block.type }));
    }
  }
  return groupByWords(pieces, (piece) => countWords(piece.html)).map((group) => {
    let out = '';
    let i = 0;
    while (i < group.length) {
      const { block, listType } = group[i];
      const run = [];
      while (i < group.length && group[i].block === block) run.push(group[i++].html);
      out += listType
        ? `<${listType}>${run.map((html) => `<li>${html}</li>`).join('')}</${listType}>`
        : `<p>${run.join(' ')}</p>`;
    }
    return out;
  });
}
