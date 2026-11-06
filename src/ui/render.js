// Small helpers for turning content data into HTML. Content is already escaped by the build.
export const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** For HTML shown in Silkscreen, whose ampersand looks like a currency sign. */
export const pixelHtml = (html) => html.replace(/&amp;/g, '<span class="amp">&amp;</span>');

export const pixelText = (text) => pixelHtml(escapeHtml(text));

export const stripTags = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

export function renderTable({ head, rows }) {
  const hasRowHeaders = head[0] === '';
  const labelFor = (i) => stripTags(head[i]).replace(/"/g, '&quot;');
  const headCells = head
    .map((cell) => `<th scope="col">${pixelHtml(cell) || '<span class="visually-hidden">Question</span>'}</th>`)
    .join('');
  const bodyRows = rows
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
    .join('');
  return `<table class="stacking"><thead><tr>${headCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

export function renderBlocks(blocks) {
  return blocks
    .map((block) => {
      if (block.type === 'p') return `<p>${block.html}</p>`;
      if (block.type === 'table') return renderTable(block);
      return `<${block.type}>${block.items.map((item) => `<li>${item.html}</li>`).join('')}</${block.type}>`;
    })
    .join('');
}
