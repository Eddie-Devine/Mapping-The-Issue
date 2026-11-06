// Shared drawing tools for scenes.
import { PALETTE as P } from '../palette.js';
import { spr } from '../sprites/engine.js';
import { LOOKS, PERSON_STAND, PERSON_WALK, ROBE_STAND, ROBE_WALK } from '../sprites/people.js';

export { P, spr, LOOKS };

export const fill = (c, color, x, y, w, h) => {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), w, h);
};

/** A 3x5 pixel font. Each digit is one row of the glyph, read as three bits. */
const GLYPHS = {
  A: '25755', B: '65656', C: '34443', D: '65556', E: '74647', F: '74644', G: '34553', H: '55755', I: '72227',
  J: '11152', K: '55655', L: '44447', M: '57755', N: '75555', O: '25552', P: '65644', Q: '25563', R: '65655',
  S: '34216', T: '72222', U: '55557', V: '55552', W: '55775', X: '55255', Y: '55222', Z: '71247',
  0: '75557', 1: '26227', 2: '61247', 3: '61216', 4: '55711', 5: '74616', 6: '34757', 7: '71222', 8: '75757', 9: '75711',
  '!': '22202', '?': '61202', '.': '00002', ',': '00024', ':': '02020', '-': '00700', '+': '02720', '/': '11244',
  "'": '22000', '=': '07070', '&': '25253', '%': '51245', $: '36362', '[': '64446', ']': '31113', ' ': '00000',
};

export const textWidth = (text) => text.length * 4 - 1;

export function text(c, string, x, y, color = P.marble) {
  c.fillStyle = color;
  let cursor = Math.round(x);
  for (const char of string.toUpperCase()) {
    const glyph = GLYPHS[char] ?? GLYPHS[' '];
    for (let row = 0; row < 5; row++) {
      const bits = Number(glyph[row]);
      for (let col = 0; col < 3; col++) {
        if (bits & (4 >> col)) c.fillRect(cursor + col, Math.round(y) + row, 1, 1);
      }
    }
    cursor += 4;
  }
}

/** A name tag or caption: dark plate, light text, kept inside the scene. */
export function tag(c, string, centerX, y, { color = P.skyGlow, plate = P.skyNight } = {}) {
  const width = textWidth(string) + 4;
  const x = Math.max(0, Math.min(c.canvas.width - width, Math.round(centerX - width / 2)));
  fill(c, plate, x, y, width, 8);
  text(c, string, x + 2, y + 1, color);
}

export const cycle = (f, period) => (f % period) / period;
export const wave = (f, period, amp) => Math.round(Math.sin(cycle(f, period) * Math.PI * 2) * amp);
export const every = (f, period, on) => f % period < on;

/** Walks back and forth between a and b, pausing at each end. */
export function patrol(f, { a, b, speed = 1, pause = 0, offset = 0 }) {
  const walk = Math.max(1, Math.round(Math.abs(b - a) / speed));
  const period = 2 * (walk + pause);
  const t = (f + offset) % period;
  const dir = b >= a ? 1 : -1;
  if (t < walk) return { x: a + dir * t * speed, flip: dir < 0, moving: true, stopped: false };
  if (t < walk + pause) return { x: b, flip: dir < 0, moving: false, stopped: true };
  if (t < 2 * walk + pause) return { x: b - dir * (t - walk - pause) * speed, flip: dir > 0, moving: true, stopped: false };
  return { x: a, flip: dir > 0, moving: false, stopped: true };
}

/** Draws a person at the given spot, stepping when `moving`. */
export function person(c, look, x, y, { flip = false, moving = false, f = 0, robe = false } = {}) {
  const step = moving && f % 2 === 0;
  const grid = robe ? (step ? ROBE_WALK : ROBE_STAND) : step ? PERSON_WALK : PERSON_STAND;
  spr(c, grid, look, x, y, flip);
}

export function bubble(c, x, y, char, color = P.skyNight) {
  fill(c, P.marble, x, y, 7, 7);
  fill(c, P.marble, x + 2, y + 7, 2, 1);
  text(c, char, x + 2, y + 1, color);
}

export function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** A two-color flickering fire. */
export function fire(c, x, y, f) {
  const a = f % 2 === 0;
  fill(c, P.vineRed, x - 5, y - 4, 10, 4);
  fill(c, P.vineRed, x - 3 + (a ? 0 : 1), y - 8, 6, 4);
  fill(c, P.saffron, x - 3, y - 3, 6, 3);
  fill(c, P.saffron, x - 2 + (a ? 1 : 0), y - 6, 3, 3);
  fill(c, P.skyGlow, x - 1, y - 2, 2, 2);
  fill(c, P.vineRed, x + (a ? -1 : 1), y - 10, 1, 2);
  fill(c, P.leather, x - 7, y, 14, 2);
}

export function column(c, x, y, h) {
  fill(c, P.marble, x - 1, y, 8, 2);
  fill(c, P.marble, x, y + 2, 6, h - 4);
  fill(c, P.granite, x + 1, y + 2, 1, h - 4);
  fill(c, P.granite, x + 4, y + 2, 1, h - 4);
  fill(c, P.marble, x - 1, y + h - 2, 8, 2);
}

export function roundTree(c, x, y, trunk = P.bark, leaf = P.olive, dark = P.banyan, size = 8) {
  fill(c, trunk, x - 1, y - size, 3, size);
  fill(c, dark, x - size, y - size - 6, size * 2, 7);
  fill(c, leaf, x - size + 1, y - size - 9, size * 2 - 2, 7);
  fill(c, leaf, x - size + 3, y - size - 12, size * 2 - 6, 3);
}

export function pine(c, x, y, h = 18, color = P.banyan) {
  fill(c, P.leather, x, y - 3, 2, 3);
  for (let i = 0; i < h - 3; i++) {
    const half = 1 + Math.floor(i / 3);
    fill(c, color, x + 1 - half, y - h + i, half * 2, 1);
  }
}

/** A string of prayer flags that flutter. */
export function flags(c, x1, y1, x2, f) {
  const colors = [P.aegean, P.marble, P.vineRed, P.vineGreen, P.gold];
  const count = Math.floor((x2 - x1) / 5);
  fill(c, P.thorn, x1, y1, x2 - x1, 1);
  for (let i = 0; i < count; i++) {
    const sag = (i + f) % 3 === 0 ? 1 : 0;
    fill(c, colors[i % 5], x1 + i * 5 + 1, y1 + 1 + sag, 3, 4 - sag);
  }
}

/** Pointed lines of wind sweeping past. */
export function windLines(c, f, w, h, color = P.marble, count = 4) {
  for (let i = 0; i < count; i++) {
    const x = (f * 7 + i * 53) % (w + 20) - 12;
    fill(c, color, x, ((i * 37 + 11) % Math.max(1, h - 10)) + 3, 8 + (i % 3) * 3, 1);
  }
}

/** A diorama frame: a stepped dark border, so each scene reads as a chamber or window. */
export function frame(c, w, h, color = P.skyNight) {
  fill(c, color, 2, 0, w - 4, 2);
  fill(c, color, 2, h - 2, w - 4, 2);
  fill(c, color, 0, 2, 2, h - 4);
  fill(c, color, w - 2, 2, 2, h - 4);
  c.clearRect(0, 0, 2, 2);
  c.clearRect(w - 2, 0, 2, 2);
  c.clearRect(0, h - 2, 2, 2);
  c.clearRect(w - 2, h - 2, 2, 2);
}
