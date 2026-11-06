// Repeating background textures, generated once at startup and shared with the stylesheet.
import { PALETTE as P } from '../palette.js';

function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function paint(width, height, painter) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const c = canvas.getContext('2d');
  painter(c, width, height);
  return canvas.toDataURL();
}

/** A solid color with scattered specks: rock, soil, leaves. */
const speckled = (size, base, specks, density, seed) =>
  paint(size, size, (c) => {
    const random = seeded(seed);
    c.fillStyle = base;
    c.fillRect(0, 0, size, size);
    for (const color of specks) {
      c.fillStyle = color;
      const count = Math.floor(size * size * density);
      for (let i = 0; i < count; i++) {
        const w = random() < 0.3 ? 2 : 1;
        c.fillRect(Math.floor(random() * size), Math.floor(random() * size), w, 1);
      }
    }
  });

/** A hill or forest line along the bottom of a strip, transparent above it. Repeats sideways. */
const ridge = (width, height, color, seed, { teeth = 0, rough = 1 } = {}) =>
  paint(width, height, (c) => {
    const random = seeded(seed);
    const a = 1 + Math.floor(random() * 2);
    const b = 3 + Math.floor(random() * 2);
    const phase = random() * 6;
    c.fillStyle = color;
    for (let x = 0; x < width; x++) {
      const angle = (x / width) * Math.PI * 2;
      let top = height * (0.45 + 0.25 * Math.sin(angle * a + phase) + 0.12 * rough * Math.sin(angle * b + phase * 2));
      if (teeth) top += Math.abs((x % teeth) - teeth / 2) * 1.6 - teeth / 2;
      const y = Math.max(0, Math.round(top));
      c.fillRect(x, y, 1, height - y);
    }
  });

/** Scattered blocky clouds on a transparent tile. */
const clouds = (width, height, color, shade, seed, count) =>
  paint(width, height, (c) => {
    const random = seeded(seed);
    for (let i = 0; i < count; i++) {
      const x = Math.floor(random() * (width - 50));
      const y = Math.floor(random() * (height - 16));
      const w = 18 + Math.floor(random() * 30);
      c.fillStyle = shade;
      c.fillRect(x + 2, y + 6, w, 4);
      c.fillStyle = color;
      c.fillRect(x, y + 3, w, 5);
      c.fillRect(x + 4, y, Math.floor(w * 0.6), 4);
    }
  });

const bark = () =>
  paint(64, 64, (c) => {
    const random = seeded(7);
    c.fillStyle = P.bark;
    c.fillRect(0, 0, 64, 64);
    for (let x = 0; x < 64; x += 4 + Math.floor(random() * 5)) {
      c.fillStyle = random() < 0.6 ? P.barkDark : P.barkLight;
      let y = Math.floor(random() * 64);
      for (let i = 0; i < 26; i++) {
        c.fillRect(x + (i % 7 === 0 ? 1 : 0), (y + i) % 64, 1, 1);
      }
      y += 30;
      for (let i = 0; i < 10; i++) c.fillRect(x + 1, (y + i) % 64, 1, 1);
    }
  });

const planks = (a, b) =>
  paint(48, 16, (c) => {
    c.fillStyle = a;
    c.fillRect(0, 0, 48, 16);
    c.fillStyle = b;
    c.fillRect(0, 7, 48, 1);
    c.fillRect(0, 15, 48, 1);
    c.fillRect(11, 0, 1, 7);
    c.fillRect(35, 8, 1, 7);
  });

/** A wavy line that repeats upward: one storyline vine. Each vine has its own phase, so they weave. */
const vine = (color, shade, phase) =>
  paint(40, 96, (c) => {
    for (let y = 0; y < 96; y++) {
      const x = Math.round(20 + 14 * Math.sin((y / 96) * Math.PI * 2 + phase));
      c.fillStyle = shade;
      c.fillRect(x - 2, y, 1, 1);
      c.fillStyle = color;
      c.fillRect(x - 1, y, 3, 1);
      if (y % 24 === 8) c.fillRect(x + 2, y - 1, 2, 2);
    }
  });

export function installTiles() {
  const tiles = {
    bark: bark(),
    granite: speckled(64, P.granite, ['#868f99', '#b3bbc4', P.thorn], 0.05, 11),
    soil: speckled(48, 'transparent', [P.soil, P.barkLight], 0.012, 5),
    forest: speckled(48, P.forest, [P.forestDark, P.grass], 0.08, 21),
    forestDark: speckled(48, P.forestDark, [P.banyan, P.forest], 0.06, 22),
    ember: speckled(48, P.ember, [P.emberDeep, P.saffron], 0.05, 31),
    emberDark: speckled(48, P.emberDeep, [P.leather, P.ember], 0.05, 32),
    plankL: planks(P.granite, P.thorn),
    plankR: planks(P.forest, P.forestDark),
    knots: speckled(48, P.emberDeep, [P.leather, P.dusk], 0.05, 41),
    hillsFar: ridge(256, 64, P.dusk, 3, { rough: 1 }),
    hillsNear: ridge(256, 48, P.forest, 8, { rough: 1.4 }),
    pinesFar: ridge(192, 56, P.banyan, 12, { teeth: 12 }),
    peaksFar: ridge(256, 80, '#aeb6bf', 17, { teeth: 40, rough: 0.4 }),
    canopyFar: ridge(192, 64, P.forestDark, 23, { teeth: 16 }),
    ridgeFar: ridge(256, 60, P.dusk, 29, { rough: 0.8 }),
    ridgeNear: ridge(256, 48, P.leather, 31, { rough: 1.2 }),
    banyanFar: ridge(192, 72, P.terracotta, 37, { teeth: 24 }),
    seaFar: ridge(256, 44, P.aegean, 41, { rough: 0.4 }),
    cloudsFar: clouds(256, 200, P.marble, P.granite, 43, 5),
    cloudsNear: clouds(256, 256, '#ffffff', P.marble, 47, 4),
    cloudsWarm: clouds(256, 180, P.skyGlow, P.skyPeach, 53, 6),
    vineGreen: vine(P.vineGreen, P.forestDark, 0),
    vineGold: vine(P.vineGold, P.dirt, 1.6),
    vinePink: vine(P.vinePink, P.thornRed, 3.2),
    vineRed: vine(P.vineRed, P.emberDeep, 4.8),
  };
  const root = document.documentElement.style;
  for (const [name, url] of Object.entries(tiles)) root.setProperty(`--tile-${name}`, `url(${url})`);
}
