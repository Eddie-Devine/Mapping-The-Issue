// Parses SOURCES.md (the master bibliography) into citation objects.
import { marked } from 'marked';

// A few chip labels read badly when derived automatically. Everything else is
// derived from the MLA entry itself. Keep this list short.
const CHIP_OVERRIDES = {
  'vegansociety-history': 'VEGAN SOCIETY',
  jre1393: 'JOE ROGAN EXPERIENCE #1393',
};

// MLA alphabetizes a title that starts with a numeral as if it were spelled out.
const SORT_OVERRIDES = {
  jre1393: 'thirteen ninety-three james wilks chris kresser',
};

const stripLinks = (md) => md.replace(/\[[^\]]*\]\([^)]*\)/g, '');

/** Removes titles, URLs, and volume/issue/page numbers so only real dates remain. */
function findYear(entry) {
  const facts = stripLinks(entry)
    .replace(/\*[^*]+\*/g, ' ')
    .replace(/"[^"]*"/g, ' ')
    .replace(/Accessed [^.]*\.[^.]*\./g, ' ')
    .replace(/\b(?:vol|no|pp)\.\s*[\d–-]+/g, ' ')
    .replace(/\barticle \d+/g, ' ');
  return facts.match(/\b(1\d{3}|20\d{2})\b/)?.[1] ?? null;
}

/** Splits "Author. Title..." and returns the author part, or null if the entry starts with its title. */
function findAuthor(entry) {
  if (/^["*]/.test(entry)) return null;
  return entry.match(/^(.+?)\.\s+["*]/)?.[1] ?? null;
}

function authorLabel(author) {
  const clean = author.replace(/,\s*(?:director|directors)$/, '');
  const firstSurname = clean.split(',')[0];
  if (/\bet al$/.test(clean)) return `${firstSurname} et al.`;
  const second = clean.match(/,\s*and\s+(.+)$/);
  if (second) return `${firstSurname} & ${second[1].trim().split(/\s+/).pop()}`;
  return firstSurname;
}

function findTitle(entry, author) {
  const rest = author ? entry.slice(entry.indexOf(author) + author.length + 1).trim() : entry;
  const quoted = rest.match(/^"(.+?)\.?"(?:\s|$)/);
  const italic = rest.match(/^\*(.+?)\*(?:[.,\s]|$)/);
  const title = quoted?.[1] ?? italic?.[1];
  if (!title) throw new Error(`SOURCES.md: could not find a title in entry: ${entry}`);
  // Remove italics markers only. A lone * is real text, as in "Veg*nism."
  return title.replace(/\*([^*]+)\*/g, '$1');
}

function shortTitle(title) {
  const head = title.split(':')[0];
  const words = head.split(/\s+/);
  return words.length <= 4 ? head : `${words.slice(0, 4).join(' ').replace(/[,;]$/, '')}…`;
}

function sortKey(id, entry) {
  if (SORT_OVERRIDES[id]) return SORT_OVERRIDES[id];
  return stripLinks(entry)
    .replace(/[*"]/g, '')
    .trim()
    .replace(/^(?:A|An|The)\s+/i, '');
}

export function parseSources(markdown) {
  // Only the numbered tables are real sources; the notes at the bottom are for the student.
  const body = markdown.split(/^## Research leads/m)[0];
  const tables = marked
    .lexer(body)
    .filter((t) => t.type === 'table' && t.header[0].text === 'ID');
  if (tables.length !== 7) {
    throw new Error(`SOURCES.md: expected 7 source tables, found ${tables.length}`);
  }

  const byId = new Map();
  for (const table of tables) {
    for (const row of table.rows) {
      const id = row[0].text.replace(/`/g, '').trim();
      const entry = row[1].text.trim();
      if (byId.has(id)) throw new Error(`SOURCES.md: duplicate source ID "${id}"`);

      const author = findAuthor(entry);
      const title = findTitle(entry, author);
      const year = findYear(entry);
      const name = CHIP_OVERRIDES[id] ?? (author ? authorLabel(author) : shortTitle(title));

      byId.set(id, {
        id,
        chip: [name.toUpperCase(), year].filter(Boolean).join(' '),
        title,
        year,
        mlaHtml: marked
          .parseInline(entry)
          .replace(/<a href=/g, '<a target="_blank" rel="noopener" href='),
        sortKey: sortKey(id, entry),
      });
    }
  }
  return byId;
}

/** MLA order: letter by letter, ignoring case, accents, and punctuation. */
export function alphabetize(sources) {
  const collator = new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true });
  return [...sources].sort((a, b) => collator.compare(a.sortKey, b.sortKey));
}
