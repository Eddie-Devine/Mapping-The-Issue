// The remaining zones: the meadow, the trunk's knothole scenes, the Tangle, and the Canopy.
import { SIT, CLIMBER_COLORS } from '../sprites/climber.js';
import { BIRD_DOWN, BIRD_LOOK, BIRD_UP, BUTTERFLY_OPEN, BUTTERFLY_SHUT, butterflyLook } from '../sprites/animals.js';
import { P, every, fill, fire, frame, LOOKS, patrol, person, seeded, spr, tag, text, wave } from './kit.js';

export const meadow = {
  h: 34,
  still: 0,
  draw(c, { w, h, f }) {
    const random = seeded(19);
    const tufts = Math.floor(w / 7);
    for (let i = 0; i < tufts; i++) {
      const x = random() * w;
      const lean = (f + i) % 8 < 4 ? 1 : 0;
      fill(c, P.grass, x, h - 4, 1, 4);
      fill(c, P.grassLight, x + lean, h - 6, 1, 2);
      if (i % 9 === 0) fill(c, [P.vinePink, P.gold, P.marble][i % 3], x + lean - 1, h - 8, 3, 2);
    }
    for (const [i, look] of [LOOKS.crowdGray, LOOKS.crowdLight, LOOKS.crowdDark].entries()) {
      const walker = patrol(f, { a: 10 + i * 40, b: Math.min(w - 12, 60 + i * 50), speed: 0.5, pause: 24, offset: i * 40 });
      person(c, look, walker.x, h - 16, { flip: walker.flip, moving: walker.moving, f });
    }
    const x = ((f + 40) % (w + 10)) - 5;
    spr(c, every(f, 2, 1) ? BUTTERFLY_OPEN : BUTTERFLY_SHUT, butterflyLook(P.skyPeach), x, 10 + wave(f, 18, 4));
  },
};

// ---------- Knotholes in the trunk's bark ----------
const knotBg = (color) => (c, { w, h }) => {
  fill(c, P.barkDark, 0, 0, w, h);
  fill(c, color, 3, 3, w - 6, h - 6);
  frame(c, w, h, P.leather);
};

export const sandowStage = {
  alt: 'A strongman in a leopard-print singlet flexes on an old stage while a camera flash pops and before and after cards flip.',
  h: 44,
  w: 64,
  still: 6,
  bg: knotBg(P.emberDeep),
  draw(c, { w, h, f }) {
    fill(c, P.barkLight, 3, h - 10, w - 6, 7);
    const flex = every(f, 8, 4);
    person(c, LOOKS.strongman, 26, h - 26);
    fill(c, LOOKS.strongman.s, flex ? 22 : 24, h - 22, 3, 3);
    fill(c, LOOKS.strongman.s, flex ? 37 : 35, h - 22, 3, 3);
    if (every(f, 16, 2)) fill(c, '#ffffff', 5, 5, 6, 6);
    fill(c, P.thorn, 7, 11, 2, 12);
    tag(c, every(f, 24, 12) ? 'BEFORE' : 'AFTER', 49, 6, { color: P.skyNight, plate: P.marble });
  },
};

export const candyShop = {
  alt: 'A 1920s flapper stands beside a candy jar in a shop, with a big NO sign blocking the candy.',
  h: 44,
  w: 64,
  still: 4,
  bg: knotBg(P.vinePink),
  draw(c, { h, f }) {
    fill(c, P.bark, 3, h - 12, 58, 9);
    person(c, LOOKS.flapper, 12, h - 28, { moving: every(f, 16, 2), f });
    fill(c, P.marble, 36, h - 28, 14, 16);
    fill(c, P.thorn, 37, h - 30, 12, 2);
    for (let i = 0; i < 9; i++) fill(c, [P.vineRed, P.gold, P.water][i % 3], 38 + (i % 3) * 4, h - 26 + Math.floor(i / 3) * 4, 3, 3);
    if (every(f, 12, 8)) tag(c, 'NO', 43, h - 22, { color: P.marble, plate: P.vineRed });
  },
};

export const billboard = {
  alt: 'A 1960s billboard with a generic stylish figure, the slogan You have come a long way, baby, and a cigarette drawn extra long and thin.',
  h: 44,
  w: 64,
  still: 0,
  bg: knotBg(P.skyBlue),
  draw(c, { h, f }) {
    fill(c, P.thorn, 14, h - 12, 2, 9);
    fill(c, P.thorn, 48, h - 12, 2, 9);
    fill(c, P.skyNight, 5, 5, 54, 27);
    fill(c, P.marble, 6, 6, 52, 25);
    person(c, LOOKS.flapper, 7, 15);
    text(c, "YOU'VE COME", 18, 8, P.thornRed);
    text(c, 'A LONG WAY,', 18, 14, P.thornRed);
    text(c, 'BABY', 18, 20, P.thornRed);
    fill(c, P.thorn, 18, 27, 34, 1);
    if (every(f, 8, 4)) fill(c, P.saffron, 52, 26, 1, 2);
  },
};

export const phoneFeed = {
  alt: 'A phone screen scrolls an endless feed of protein shakes, chicken breasts, and flexing arms.',
  h: 44,
  w: 64,
  still: 4,
  bg: knotBg(P.dusk),
  draw(c, { h, f }) {
    fill(c, P.skyNight, 22, 4, 20, h - 8);
    c.save();
    c.beginPath();
    c.rect(24, 6, 16, h - 12);
    c.clip();
    fill(c, P.marble, 24, 6, 16, h - 12);
    const scroll = f % 36;
    for (let i = -1; i < 4; i++) {
      const y = 6 + i * 12 + 12 - scroll / 3 * 1;
      const kind = (i + 8) % 3;
      if (kind === 0) {
        fill(c, P.water, 28, y + 2, 7, 8);
        fill(c, P.marble, 30, y + 1, 3, 1);
      } else if (kind === 1) {
        fill(c, P.skyPeach, 27, y + 3, 10, 5);
        fill(c, P.fossil, 29, y + 4, 5, 2);
      } else {
        fill(c, P.barkLight, 27, y + 6, 9, 3);
        fill(c, P.barkLight, 33, y + 2, 4, 5);
        fill(c, P.bark, 31, y + 3, 3, 3);
      }
    }
    c.restore();
  },
};

// ---------- Tangle ----------
export const vsFighters = {
  alt: 'Two fighters square off on a tangled branch while undecided people sit in the audience below.',
  h: 42,
  w: 170,
  still: 0,
  draw(c, { w, h, f }) {
    const hop = every(f, 4, 2) ? -1 : 0;
    fill(c, P.barkDark, 2, 22, w - 4, 4);
    person(c, LOOKS.fighterPlants, w / 2 - 34, 7 + hop);
    person(c, LOOKS.fighterMeat, w / 2 + 24, 7 - hop, { flip: true });
    const audience = [LOOKS.crowdGray, LOOKS.crowdLight, LOOKS.crowdDark];
    const seats = Math.floor((w - 12) / 14);
    for (let i = 0; i < seats; i++) {
      person(c, audience[i % 3], 8 + i * 14, 27 + (every(f + i * 2, 12, 2) ? -1 : 0));
    }
  },
};

/** The Tangle's closing image: both fighters sitting down together, sharing a campfire. */
export const sharedFire = {
  alt: 'Both fighters sit down on the tangled branch, sharing a campfire. One roasts a pepper, the other a steak, as fireflies rise.',
  h: 40,
  w: 150,
  still: 6,
  bg(c, { w, h }) {
    fill(c, P.dusk, 0, 0, w, 14);
    fill(c, P.emberDeep, 0, 14, w, 12);
    fill(c, P.barkDark, 0, 26, w, h - 26);
    fill(c, P.bark, 0, 26, w, 2);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const x = Math.round(w / 2);
    fire(c, x, 30, f);
    person(c, LOOKS.fighterPlants, x - 28, 14);
    person(c, LOOKS.fighterMeat, x + 18, 14, { flip: true });
    fill(c, P.bark, x - 18, 21, 15, 1);
    fill(c, P.vineGreen, x - 5, 20, 4, 2);
    fill(c, P.bark, x + 3, 21, 15, 1);
    fill(c, P.emberDeep, x + 1, 19, 5, 3);
    for (let i = 0; i < 7; i++) {
      const rise = (f + i * 9) % 30;
      if (every(f + i, 4, 3)) fill(c, P.gold, x - 40 + i * 13 + wave(f + i * 4, 14, 2), 30 - rise, 1, 1);
    }
  },
};

// ---------- Canopy ----------
export const summit = {
  alt: 'Above the clouds at sunrise, the climber sits on the highest branch looking out over the whole map. Fireflies drift and birds pass by.',
  h: 56,
  still: 0,
  draw(c, { w, h, f }) {
    const x = Math.round(w * 0.62);
    fill(c, P.barkDark, x - 30, h - 16, 62, 4);
    fill(c, P.bark, x - 30, h - 16, 62, 1);
    fill(c, P.barkDark, x + 28, h - 12, 4, 12);
    for (const [dx, dy] of [[-30, -19], [-24, -20], [24, -20], [28, -19], [-34, -17], [33, -17]]) fill(c, P.vineGreen, x + dx, h + dy, 3, 2);
    spr(c, SIT, CLIMBER_COLORS.green, x - 8, h - 30);
    for (let i = 0; i < 2; i++) {
      spr(c, every(f, 4, 2) ? BIRD_UP : BIRD_DOWN, BIRD_LOOK, w - ((f + i * 67) % (w + 10)), 6 + i * 6);
    }
    for (let i = 0; i < 10; i++) {
      if (!every(f + i * 3, 8, 5)) continue;
      fill(c, P.skyGlow, (i * 47 + wave(f + i * 7, 40, 8)) % w, (i * 13) % (h - 8) + wave(f + i * 5, 30, 3), 1, 1);
    }
  },
};

export const STRATA_PROPS = [
  { depth: 620, left: 88, draw: shard },
  { depth: 1180, left: 7, draw: coin },
  { depth: 1740, left: 92, draw: shard },
  { depth: 2240, left: 6, draw: coin },
  { depth: 3500, left: 90, draw: shard },
  { depth: 4180, left: 8, draw: ammonite },
  { depth: 4800, left: 88, draw: arrowhead },
  { depth: 5280, left: 10, draw: ammonite },
  { depth: 5880, left: 90, draw: arrowhead },
  { depth: 6500, left: 7, draw: ammonite },
];

function shard(c) {
  fill(c, P.pottery, 2, 3, 9, 4);
  fill(c, P.pottery, 4, 1, 5, 2);
  fill(c, P.skyNight, 3, 5, 7, 1);
}
function coin(c) {
  fill(c, P.gold, 3, 1, 6, 8);
  fill(c, P.gold, 1, 3, 10, 4);
  fill(c, P.fossil, 5, 3, 2, 4);
}
function ammonite(c) {
  fill(c, P.fossil, 2, 0, 8, 10);
  fill(c, P.fossil, 0, 2, 12, 6);
  fill(c, P.soil, 3, 2, 6, 6);
  fill(c, P.fossil, 4, 3, 4, 4);
  fill(c, P.soil, 5, 4, 2, 2);
}
function arrowhead(c) {
  for (let i = 0; i < 8; i++) fill(c, P.thorn, 6 - Math.floor(i / 2), i + 1, 1 + i - (i % 2), 1);
  fill(c, P.bark, 5, 9, 2, 2);
}
