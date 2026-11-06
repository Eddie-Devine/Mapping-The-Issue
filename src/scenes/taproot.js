// The Taproot: deep time, firelight, and the oldest evidence in the debate.
import { AUK, AUK_LOOK } from '../sprites/animals.js';
import { HOMININ, HOMININ_FIRELIT, HOMININ_LOOK } from '../sprites/people.js';
import { P, bubble, every, fill, fire, frame, LOOKS, person, seeded, spr, tag, wave } from './kit.js';

export const campfire = {
  alt: 'Three early humans sit around a flickering campfire in a dark cave, roasting a bone and a root tuber on sticks as firelight pulses on the wall.',
  h: 84,
  w: 200,
  still: 2,
  bg(c, { w, h }) {
    fill(c, P.soil, 0, 0, w, h);
    const random = seeded(17);
    for (let i = 0; i < 70; i++) fill(c, P.leather, random() * w, random() * h, 4, 1);
    fill(c, P.leather, 0, h - 20, w, 20);
    fill(c, P.clay, 0, h - 20, w, 2);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const x = Math.round(w / 2);
    const y = h - 14;
    // Firelight pulses on the cave wall in stepped rings.
    const pulse = every(f, 6, 3) ? 2 : 0;
    for (const [radius, color] of [[38 + pulse, P.leather], [28 + pulse, P.clay], [18 + pulse, P.dirt]]) {
      fill(c, color, x - radius, y - radius * 0.9, radius * 2, radius * 0.9);
      fill(c, color, x - radius * 0.7, y - radius * 1.2, radius * 1.4, radius * 0.4);
    }
    fire(c, x, y, f);
    spr(c, HOMININ, HOMININ_FIRELIT, x - 34, y - 12);
    spr(c, HOMININ, HOMININ_FIRELIT, x + 22, y - 12, true);
    spr(c, HOMININ, HOMININ_FIRELIT, x - 6, y - 26);
    // A bone and a tuber roast on sticks.
    fill(c, P.bark, x - 22, y - 9, 16, 1);
    fill(c, P.marble, x - 8, y - 11, 5, 2);
    fill(c, P.bark, x + 6, y - 9, 16, 1);
    fill(c, P.pottery, x + 4, y - 11, 5, 3);
    if (every(f, 3, 1)) fill(c, P.saffron, x + wave(f, 9, 6), y - 14 - (f % 7), 1, 1);
  },
};

export const dikika = {
  alt: 'A tiny hunched hominin crouches over a bone, tapping it with a rock while dust puffs up. A question mark floats above the bone because the evidence is debated.',
  h: 56,
  w: 150,
  still: 2,
  bg(c, { w, h }) {
    fill(c, P.skyPeach, 0, 0, w, 24);
    fill(c, P.gold, 0, 18, w, 6);
    fill(c, P.fossil, 0, 24, w, h - 24);
    const random = seeded(23);
    for (let i = 0; i < 30; i++) fill(c, '#b8935a', random() * w, 26 + random() * (h - 28), 3, 1);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const x = Math.round(w / 2) - 16;
    spr(c, HOMININ, HOMININ_LOOK, x, h - 22);
    const up = every(f, 4, 2);
    fill(c, P.thorn, x + 12, h - 16 - (up ? 3 : 0), 3, 3);
    fill(c, P.marble, x + 14, h - 11, 12, 2);
    fill(c, P.marble, x + 13, h - 12, 2, 4);
    fill(c, P.marble, x + 25, h - 12, 2, 4);
    if (!up) {
      fill(c, P.marble, x + 11, h - 14, 2, 1);
      fill(c, P.marble, x + 16, h - 15, 2, 1);
    }
    bubble(c, x + 22, h - 26, '?');
  },
};

export const kiviaq = {
  alt: 'In a snowy landscape, a figure in fur clothing stacks stones over a seal-shaped mound while little auks fly past.',
  h: 56,
  w: 170,
  still: 8,
  bg(c, { w, h }) {
    fill(c, '#c8e0ee', 0, 0, w, 30);
    fill(c, P.marble, 0, 30, w, h - 30);
    fill(c, '#ffffff', 0, 30, w, 2);
    const random = seeded(39);
    for (let i = 0; i < 10; i++) fill(c, P.granite, random() * w, 34 + random() * (h - 36), 5, 1);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const x = Math.round(w / 2);
    fill(c, P.barkDark, x - 8, h - 14, 22, 8);
    fill(c, P.barkDark, x - 12, h - 10, 4, 4);
    const stones = Math.min(7, Math.floor((f % 64) / 8) + 1);
    for (let i = 0; i < stones; i++) {
      fill(c, i % 2 ? P.granite : P.thorn, x - 7 + (i % 4) * 5, h - 15 - Math.floor(i / 4) * 3, 5, 3);
    }
    person(c, LOOKS.fur, x - 24, h - 21, { moving: every(f, 8, 4), f });
    for (let i = 0; i < 3; i++) {
      spr(c, AUK, AUK_LOOK, ((f + i * 30) * 2) % (w + 10) - 6, 6 + i * 6 + wave(f + i * 5, 12, 1));
    }
  },
};
