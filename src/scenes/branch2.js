// Branch 2: Ethics & Earth. A lush forest with a globe-fruit, a sentience pond, and the Bramble.
import { BIRD_DOWN, BIRD_LOOK, BIRD_UP, BUTTERFLY_OPEN, BUTTERFLY_SHUT, butterflyLook, COW, COW_LOOK, DEER, DEER_LOOK, FISH, FISH_LOOK, OCTOPUS, OCTOPUS_LOOK, SHRIMP, SHRIMP_LOOK } from '../sprites/animals.js';
import { P, every, fill, frame, LOOKS, patrol, person, seeded, spr, tag, wave } from './kit.js';

export const forest = {
  alt: 'A lush forest canopy where a big globe-shaped fruit hangs from a branch. Below it a little pond holds a fish, a shrimp, and an octopus, with a deer at the edge while butterflies and birds drift past.',
  h: 110,
  w: 120,
  still: 6,
  bg(c, { w, h }) {
    const random = seeded(71);
    fill(c, P.forest, 0, 0, w, h);
    fill(c, P.forestDark, 0, 0, w, 16);
    for (let i = 0; i < 140; i++) fill(c, random() < 0.5 ? P.grass : P.forestDark, random() * w, random() * 62, 3, 2);
    fill(c, P.barkDark, 0, 18, w, 3);
    fill(c, P.grass, 0, 66, w, h - 66);
    for (let i = 0; i < 30; i++) fill(c, P.grassLight, random() * w, 68 + random() * (h - 70), 1, 2);
    // The pond.
    fill(c, P.forestDark, 8, h - 40, w - 16, 34);
    fill(c, P.water, 10, h - 38, w - 20, 30);
    fill(c, P.aegean, 10, h - 26, w - 20, 18);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    // The globe-fruit, with continents that slowly turn.
    const cx = Math.round(w / 2);
    const cy = 38;
    fill(c, P.forestDark, cx, 20, 1, 6);
    fill(c, P.water, cx - 10, cy - 12, 20, 24);
    fill(c, P.water, cx - 12, cy - 10, 24, 20);
    c.save();
    c.beginPath();
    c.rect(cx - 12, cy - 12, 24, 24);
    c.clip();
    const spin = (f / 2) % 32;
    for (const [dx, dy, lw, lh] of [[0, -8, 10, 7], [14, -2, 8, 9], [-2, 4, 7, 6], [24, 6, 6, 4]]) {
      fill(c, P.vineGreen, cx - 12 + ((dx + spin) % 32) - 4, cy + dy, lw, lh);
    }
    c.restore();
    fill(c, P.forestDark, cx - 11, cy - 13, 3, 2);
    fill(c, P.forestDark, cx + 9, cy - 13, 3, 2);
    fill(c, P.forestDark, cx - 13, cy - 10, 2, 2);
    fill(c, P.forestDark, cx + 12, cy - 10, 2, 2);
    fill(c, P.forestDark, cx - 11, cy + 11, 3, 2);
    fill(c, P.forestDark, cx + 9, cy + 11, 3, 2);

    const fish = patrol(f, { a: 14, b: w - 26, speed: 0.75, pause: 4 });
    spr(c, FISH, FISH_LOOK, fish.x, h - 30 + wave(f, 12, 1), fish.flip);
    const shrimp = patrol(f, { a: w - 30, b: 20, speed: 0.25, pause: 8, offset: 12 });
    spr(c, SHRIMP, SHRIMP_LOOK, shrimp.x, h - 15, shrimp.flip);
    spr(c, OCTOPUS, OCTOPUS_LOOK, Math.round(w * 0.3), h - 22 + wave(f, 20, 2));
    spr(c, DEER, DEER_LOOK, 6, h - 54);
    for (let i = 0; i < 3; i++) {
      const x = ((f / 2 + i * 37) % (w + 8)) - 4;
      spr(c, every(f + i, 2, 1) ? BUTTERFLY_OPEN : BUTTERFLY_SHUT, butterflyLook([P.skyPeach, P.vinePink, P.gold][i]), x, 50 + wave(f + i * 9, 18, 5) + i * 4);
    }
    for (let i = 0; i < 2; i++) {
      spr(c, every(f, 4, 2) ? BIRD_UP : BIRD_DOWN, BIRD_LOOK, ((f + i * 53) % (w + 10)) - 5, 6 + i * 4);
    }
  },
};

export const pasture = {
  alt: 'A cow grazes peacefully and puffs little gray clouds that drift up, while a deer walks past.',
  h: 44,
  w: 110,
  still: 8,
  bg(c, { w, h }) {
    fill(c, P.skyBlue, 0, 0, w, 20);
    fill(c, P.grass, 0, 20, w, h - 20);
    const random = seeded(83);
    for (let i = 0; i < 24; i++) fill(c, P.grassLight, random() * w, 22 + random() * (h - 24), 1, 2);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const x = 12;
    spr(c, COW, COW_LOOK, x, h - 18);
    for (let i = 0; i < 4; i++) {
      const rise = (f + i * 7) % 28;
      fill(c, P.granite, x - 2 - rise / 4, h - 16 - rise, 3 + (rise >> 3), 2);
    }
    const deer = patrol(f, { a: 40, b: Math.max(44, w - 16), speed: 0.5, pause: 12 });
    spr(c, DEER, DEER_LOOK, deer.x, h - 19, deer.flip);
  },
};

const BLAST_EVERY = 32;
const NPCS = [LOOKS.crowdGray, LOOKS.crowdLight, LOOKS.crowdDark];

/**
 * The research as a game mechanic: each megaphone blast pushes one more undecided person away.
 * They shake their heads and walk off toward Branch 3, and the approval meter falls.
 * The clock starts when the Bramble scrolls into view, so visitors see it from the first blast.
 */
export const bramble = {
  alt: 'A generic figure labeled That Vegan Teacher stands in a tangle of thorns holding a megaphone. Each blast of sound waves pushes a nearby undecided person away: they shake their heads and walk off, and an approval meter falls.',
  h: 50,
  w: 160,
  still: 40,
  bg(c, { w, h }) {
    fill(c, P.thorn, 0, 0, w, h);
    const random = seeded(29);
    fill(c, P.thornRed, 0, h - 8, w, 8);
    for (let i = 0; i < 26; i++) {
      const x = random() * 44;
      const y = 6 + random() * (h - 12);
      fill(c, P.skyNight, x, y, 8, 1);
      fill(c, P.thornRed, x + 3, y - 2, 1, 2);
      fill(c, P.thornRed, x + 6, y + 1, 1, 2);
    }
    frame(c, w, h, P.thornRed);
  },
  draw(c, { w, h, f }) {
    const round = NPCS.length + 2;
    const t = f % (round * BLAST_EVERY);
    const blasts = Math.floor(t / BLAST_EVERY);
    const sinceBlast = t % BLAST_EVERY;
    const figureX = 18;
    const floor = h - 22;
    person(c, LOOKS.megaphone, figureX, floor);
    // The megaphone.
    fill(c, P.marble, figureX + 10, floor + 6, 3, 2);
    fill(c, P.marble, figureX + 13, floor + 5, 2, 4);
    fill(c, P.marble, figureX + 15, floor + 4, 2, 6);
    if (sinceBlast < 14) {
      for (let i = 0; i < 3; i++) {
        const reach = sinceBlast * 5 - i * 8;
        if (reach < 0) continue;
        const height = 4 + Math.floor(reach / 5);
        fill(c, P.skyGlow, figureX + 18 + reach, floor + 7 - height, 1, height * 2);
      }
    }
    NPCS.forEach((look, i) => {
      const home = 74 + i * 22;
      const hit = i * BLAST_EVERY + 6;
      const since = t - hit;
      if (since < 0) {
        person(c, look, Math.min(home, w - 12), floor, { flip: true });
      } else if (since < 8) {
        person(c, look, Math.min(home, w - 12), floor, { flip: every(f, 2, 1) }); // Shaking their head.
      } else {
        person(c, look, Math.min(home, w - 12) + (since - 8) * 1.5, floor, { moving: true, f });
      }
    });
    // The approval meter drops with every blast.
    const level = Math.max(0, 1 - blasts / NPCS.length);
    const meterW = Math.min(46, w - 60);
    const meterX = w - meterW - 6;
    tag(c, 'APPROVAL', meterX + 16, 4, { color: P.marble });
    fill(c, P.skyNight, meterX, 13, meterW, 4);
    fill(c, P.vineGreen, meterX + 1, 14, (meterW - 2) * level, 2);
    tag(c, 'THAT VEGAN TEACHER', 40, h - 9, { color: P.marble });
  },
};
