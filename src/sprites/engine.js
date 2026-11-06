// Draws text-grid sprites (DESIGN.md §7): one character per pixel, plus a color for each character.
// A character with no color is transparent, so one grid can be recolored into many characters.
const cache = new WeakMap();

function render(grid, colors) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(...grid.map((row) => row.length));
  canvas.height = grid.length;
  const context = canvas.getContext('2d');
  grid.forEach((row, y) => {
    [...row].forEach((char, x) => {
      const color = colors[char];
      if (!color) return;
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    });
  });
  return canvas;
}

/** The sprite as a canvas, drawn once and then reused. */
export function spriteCanvas(grid, colors) {
  let byColors = cache.get(grid);
  if (!byColors) cache.set(grid, (byColors = new Map()));
  const key = JSON.stringify(colors);
  if (!byColors.has(key)) byColors.set(key, render(grid, colors));
  return byColors.get(key);
}

/** Draws a sprite with its top-left corner at x, y. */
export function spr(c, grid, colors, x, y, flip = false) {
  const image = spriteCanvas(grid, colors);
  const px = Math.round(x);
  const py = Math.round(y);
  if (!flip) {
    c.drawImage(image, px, py);
    return;
  }
  c.save();
  c.translate(px + image.width, py);
  c.scale(-1, 1);
  c.drawImage(image, 0, 0);
  c.restore();
}

export const toDataUrl = (grid, colors) => spriteCanvas(grid, colors).toDataURL();
