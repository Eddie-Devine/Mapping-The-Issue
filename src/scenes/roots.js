// The Greece and India roots: "little Greek people walking around," a Jain monk sweeping ants out
// of his path, and a levitating yogi with a tiger lying down beside him.
import { DEER, DEER_LOOK, PEACOCK, PEACOCK_LOOK, SHEEP, SHEEP_LOOK, TIGER_LOOK, TIGER_REST, TIGER_WALK } from '../sprites/animals.js';
import { ROBE_ARM_UP, ROBE_STAND, YOGI, YOGI_LOOK } from '../sprites/people.js';
import { P, bubble, column, cycle, every, fill, flags, frame, LOOKS, patrol, person, roundTree, seeded, spr, tag, wave } from './kit.js';

const CITIZENS = [LOOKS.citizenBlue, LOOKS.citizenRed, LOOKS.citizenOlive, LOOKS.citizenGold, LOOKS.citizenWhite, LOOKS.citizenRed, LOOKS.citizenBlue, LOOKS.citizenOlive];

function amphora(c, x, y) {
  fill(c, P.pottery, x + 1, y, 3, 1);
  fill(c, P.pottery, x, y + 1, 5, 4);
  fill(c, P.skyNight, x, y + 3, 5, 1);
  fill(c, P.pottery, x + 1, y + 5, 3, 1);
}

export const agora = {
  alt: 'A sunny Greek agora with marble columns, olive trees, and a blue strip of the Aegean. Citizens in chitons stroll back and forth, stopping to argue with question marks and exclamation points over their heads. A bearded Pythagoras speaks from the steps to a small crowd while a ghostly soul floats out of a sheep.',
  h: 96,
  w: 240,
  still: 12,
  bg(c, { w, h }) {
    fill(c, '#a8d5ee', 0, 0, w, 34);
    fill(c, P.skyGlow, w - 26, 6, 8, 8);
    fill(c, P.aegean, 0, 26, w, 10);
    fill(c, P.water, 0, 29, w, 1);
    fill(c, P.marble, 0, 36, w, h - 36);
    const random = seeded(9);
    for (let i = 0; i < 80; i++) fill(c, '#e0d9cb', random() * w, 38 + random() * (h - 40), 3, 1);
    // A temple with steps.
    fill(c, P.marble, 2, 10, 54, 5);
    fill(c, P.pottery, 2, 15, 54, 2);
    for (let i = 0; i < 4; i++) column(c, 5 + i * 15, 17, 24);
    fill(c, '#e0d9cb', 0, 41, 58, 3);
    fill(c, '#d3cbbb', 0, 44, 62, 3);
    fill(c, '#c9c0af', 0, 47, 66, 3);
    roundTree(c, w - 14, 40, P.bark, P.olive, P.banyan, 7);
    if (w > 150) roundTree(c, Math.round(w * 0.5), 38, P.bark, P.olive, P.banyan, 6);
    // A market stall.
    const stall = Math.min(w - 46, Math.max(74, Math.round(w * 0.62)));
    fill(c, P.pottery, stall, 40, 26, 3);
    fill(c, P.marble, stall, 43, 26, 1);
    fill(c, P.bark, stall + 1, 43, 1, 12);
    fill(c, P.bark, stall + 24, 43, 1, 12);
    fill(c, P.bark, stall, 52, 26, 4);
    amphora(c, stall + 4, 46);
    amphora(c, stall + 12, 46);
    // The bean field Pythagoras is said to have avoided.
    if (w > 170) {
      fill(c, P.grassLight, w - 40, h - 14, 30, 10);
      for (let i = 0; i < 7; i++) fill(c, P.forest, w - 38 + i * 4, h - 13 + (i % 2) * 4, 2, 2);
    }
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    // A soul drifts out of a sheep and into a person, then back.
    spr(c, SHEEP, SHEEP_LOOK, 66, 60);
    const drift = cycle(f, 64);
    const soulT = drift < 0.5 ? drift * 2 : 2 - drift * 2;
    fill(c, '#ffffff', 72 - soulT * 30, 56 - Math.sin(soulT * Math.PI) * 12, 3, 3);

    // Pythagoras on the steps with two listeners, and a tiny right triangle floating as a wink to math.
    spr(c, every(f, 16, 8) ? ROBE_ARM_UP : ROBE_STAND, LOOKS.pythagoras, 22, 29);
    person(c, LOOKS.citizenWhite, 40, 48);
    person(c, LOOKS.citizenGold, 8, 48, {});
    fill(c, P.thorn, 34, 22, 1, 6);
    fill(c, P.thorn, 34, 27, 6, 1);
    for (let i = 0; i < 5; i++) fill(c, P.thorn, 35 + i, 22 + i, 1, 1);
    tag(c, 'PYTHAGORAS', 27, 19);

    // Citizens stroll, pause, and argue.
    const count = Math.min(CITIZENS.length, Math.max(3, Math.floor(w / 30)));
    for (let i = 0; i < count; i++) {
      const row = 54 + ((i * 7) % 3) * 9;
      const a = 62 + ((i * 41) % Math.max(1, w - 90));
      const b = Math.min(w - 12, a + 30 + ((i * 17) % 40));
      const walker = patrol(f, { a, b, speed: 1, pause: 10, offset: i * 23 });
      person(c, CITIZENS[i], walker.x, row, { flip: walker.flip, moving: walker.moving, f, robe: i % 3 === 0 });
      if (i % 3 === 1) amphora(c, walker.x + (walker.flip ? -3 : 8), row + 6);
      if (i % 4 === 2) fill(c, P.olive, walker.x + (walker.flip ? -2 : 9), row + 3, 3, 1);
      if (walker.stopped) bubble(c, walker.x + 2, row - 9, i % 2 ? '!' : '?');
    }

    // Someone circles the bean field rather than walking through it.
    if (w > 170) {
      const t = cycle(f, 120);
      const fieldX = w - 44;
      const onTop = t < 0.5;
      const x = fieldX + (onTop ? t * 2 : 2 - t * 2) * 30;
      person(c, LOOKS.citizenWhite, x, onTop ? h - 31 : h - 18, { flip: !onTop, moving: true, f, robe: true });
    }
  },
};

export const feast = {
  alt: 'A Greek festival feast table where a crowd cheers with drumsticks while one lone Pythagorean sits at the end with a bowl of greens.',
  h: 56,
  w: 200,
  still: 4,
  bg(c, { w, h }) {
    fill(c, P.pottery, 0, 0, w, h);
    fill(c, '#a84a2e', 0, 0, w, 18);
    for (let i = 0; i < 6; i++) column(c, 8 + i * Math.floor((w - 16) / 6), 2, 30);
    fill(c, P.marble, 0, 32, w, h - 32);
    fill(c, P.bark, 6, 36, w - 12, 5);
    fill(c, P.barkDark, 6, 41, w - 12, 2);
    frame(c, w, h);
  },
  draw(c, { w, f }) {
    const seats = Math.floor((w - 40) / 16);
    for (let i = 0; i < seats; i++) {
      const hop = every(f + i * 3, 8, 3) ? -2 : 0;
      person(c, CITIZENS[i % CITIZENS.length], 12 + i * 16, 20 + hop);
      fill(c, P.pottery, 20 + i * 16, 16 + hop, 3, 3);
      fill(c, P.marble, 21 + i * 16, 19 + hop, 1, 2);
    }
    spr(c, ROBE_STAND, LOOKS.pythagoras, w - 20, 20);
    fill(c, P.olive, w - 18, 33, 8, 2);
    fill(c, P.vineGreen, w - 17, 31, 6, 2);
  },
};

export const signSwap = {
  alt: 'A worker on a ladder takes down a shop sign reading Pythagorean and puts up one reading Vegetarian as confetti falls.',
  h: 44,
  w: 150,
  still: 40,
  bg(c, { w, h }) {
    fill(c, P.bark, 0, 0, w, h);
    fill(c, P.barkDark, 0, 26, w, 18);
    fill(c, P.barkLight, 14, 28, 22, 16);
    fill(c, P.skyPeach, 42, 30, 40, 9);
    frame(c, w, h);
  },
  draw(c, { w, f }) {
    const t = f % 64;
    const done = t > 28;
    const label = done ? 'VEGETARIAN' : 'PYTHAGOREAN';
    const drop = t > 16 && t <= 28 ? (t - 16) * 2 : 0;
    const width = label.length * 4 + 3;
    fill(c, P.skyNight, 8, 6 + drop, width, 9);
    fill(c, P.gold, 9, 7 + drop, width - 2, 7);
    tag(c, label, 8 + width / 2, 7 + drop, { color: P.skyNight, plate: P.gold });
    fill(c, P.barkLight, width + 14, 8, 2, 30);
    fill(c, P.barkLight, width + 20, 8, 2, 30);
    for (let i = 0; i < 5; i++) fill(c, P.barkLight, width + 14, 12 + i * 6, 8, 1);
    person(c, LOOKS.crowdLight, width + 13, 14, { moving: !done, f });
    if (done) {
      for (let i = 0; i < 12; i++) {
        fill(c, [P.vineRed, P.vineGold, P.vineGreen, P.water][i % 4], (i * 13 + 4) % (w - 4), ((t - 28) * 1.5 + i * 7) % 40, 2, 2);
      }
    }
  },
};

export const jainPath = {
  alt: 'Beside a river under a banyan tree, a white-robed Jain monk walks slowly, sweeping a small broom ahead of his feet while tiny ants scurry safely out of the way. A peacock and a deer wander freely nearby.',
  h: 72,
  w: 220,
  still: 30,
  bg(c, { w, h }) {
    fill(c, P.skyPeach, 0, 0, w, 20);
    fill(c, P.gold, 0, 16, w, 6);
    fill(c, P.water, 0, 22, w, 8);
    fill(c, P.marble, 8, 25, 12, 1);
    fill(c, P.marble, w - 50, 27, 14, 1);
    fill(c, P.grass, 0, 30, w, 14);
    fill(c, P.fossil, 0, 44, w, h - 44);
    const random = seeded(31);
    for (let i = 0; i < 50; i++) fill(c, '#b8935a', random() * w, 46 + random() * (h - 48), 2, 1);
    // A banyan tree with hanging roots.
    fill(c, P.bark, 16, 14, 8, 30);
    fill(c, P.banyan, 2, 2, 36, 12);
    fill(c, P.forestDark, 4, 12, 32, 3);
    for (const x of [6, 12, 28, 34]) fill(c, P.barkDark, x, 15, 1, 16 + (x % 5));
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const span = w - 60;
    const x = 34 + (f / 2) % span;
    const y = h - 26;
    spr(c, ROBE_STAND, LOOKS.jain, x, y);
    // The broom sweeps back and forth just ahead of his feet.
    const sweep = every(f, 4, 2) ? 2 : 0;
    fill(c, P.bark, x + 10, y + 7, 1, 7);
    fill(c, P.gold, x + 10 + sweep, y + 14, 4, 2);
    // Ants hurry off to the sides as he nears, then return once he has passed.
    for (let i = 0; i < 12; i++) {
      const home = 30 + (i * 19) % (w - 40);
      const row = h - 12 + (i % 3) * 2;
      const distance = home - (x + 12);
      const scatter = distance > -8 && distance < 14 ? (14 - Math.abs(distance)) * (i % 2 ? 1 : -1) * 0.7 : 0;
      fill(c, P.skyNight, home + (f + i) % 2, row + scatter, 2, 1);
    }
    const bird = patrol(f, { a: w - 62, b: w - 22, speed: 0.5, pause: 12 });
    spr(c, PEACOCK, PEACOCK_LOOK, bird.x, 30, bird.flip);
    const deer = patrol(f, { a: 44, b: Math.max(60, w - 90), speed: 0.5, pause: 20, offset: 30 });
    spr(c, DEER, DEER_LOOK, deer.x, 28, deer.flip);
  },
};

export const yogiTiger = {
  alt: 'In a warm stone chamber with a stupa and prayer flags, a yogi in lotus pose levitates a few pixels above a mat. A tiger walks up, sees him, and lies down peacefully beside him.',
  h: 72,
  w: 220,
  still: 80,
  bg(c, { w, h }) {
    fill(c, P.terracotta, 0, 0, w, h);
    fill(c, '#a03c24', 0, 0, w, 10);
    const random = seeded(61);
    for (let i = 0; i < 60; i++) fill(c, '#a03c24', random() * w, random() * (h - 16), 5, 1);
    // A stupa.
    const s = w - 36;
    fill(c, P.marble, s - 12, h - 24, 24, 8);
    fill(c, P.marble, s - 8, h - 32, 16, 8);
    fill(c, P.gold, s - 2, h - 42, 4, 10);
    fill(c, P.gold, s - 4, h - 44, 8, 2);
    fill(c, P.fossil, 0, h - 16, w, 16);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    flags(c, 4, 8, w - 4, f);
    const x = Math.round(w * 0.3);
    fill(c, P.dusk, x - 3, h - 18, 20, 3);
    spr(c, YOGI, YOGI_LOOK, x, h - 36 + wave(f, 24, 2));
    const t = f % 160;
    const restX = x + 18;
    if (t < 60) {
      const tigerX = w - 20 - ((w - 20 - restX) * t) / 60;
      spr(c, TIGER_WALK, TIGER_LOOK, tigerX, h - 26, true);
    } else {
      spr(c, TIGER_REST, TIGER_LOOK, restX, h - 24, true);
    }
  },
};

export const baseCamp = {
  alt: 'A snowy Everest base camp where colorful prayer flags flutter, juniper smoke curls up from a small stupa, and tiny climbers pile their ice axes around it.',
  h: 60,
  w: 220,
  still: 0,
  bg(c, { w, h }) {
    fill(c, '#a8d5ee', 0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      const peak = (w / 4) * i + 24;
      for (let y = 0; y < 34; y++) {
        fill(c, y < 12 ? P.marble : P.granite, peak - y, 6 + y, y * 2, 1);
      }
    }
    fill(c, P.marble, 0, 40, w, h - 40);
    fill(c, '#ffffff', 0, 40, w, 2);
    const s = Math.round(w / 2);
    fill(c, P.marble, s - 9, h - 22, 18, 7);
    fill(c, P.granite, s - 9, h - 16, 18, 1);
    fill(c, P.marble, s - 5, h - 28, 10, 6);
    fill(c, P.gold, s - 1, h - 33, 2, 5);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    flags(c, 4, 10, w - 4, f);
    const s = Math.round(w / 2);
    for (let i = 0; i < 6; i++) {
      fill(c, P.granite, s + 6 + wave(f + i * 6, 16, 2) + i / 2, h - 28 - ((f + i * 4) % 24), 2, 2);
    }
    for (const dx of [-16, 14]) {
      fill(c, P.thorn, s + dx, h - 16, 1, 7);
      fill(c, P.thorn, s + dx - 1, h - 16, 3, 1);
    }
    const a = patrol(f, { a: s - 60, b: s - 24, speed: 0.5, pause: 16 });
    person(c, LOOKS.sherpa, a.x, h - 21, { flip: a.flip, moving: a.moving, f });
    const b = patrol(f, { a: s + 50, b: s + 22, speed: 0.5, pause: 16, offset: 20 });
    person(c, LOOKS.sherpa, b.x, h - 21, { flip: b.flip, moving: b.moving, f });
  },
};
