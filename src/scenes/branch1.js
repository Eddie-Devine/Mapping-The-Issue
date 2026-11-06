// Branch 1: Body & Mind. A granite cliff, with the signature free solo as its hero scene.
import { CHALK, CLIMB, FIST_PUMP, HONNOLD_COLORS } from '../sprites/climber.js';
import { HAWK_DOWN, HAWK_LOOK, HAWK_UP } from '../sprites/animals.js';
import { YOGI, YOGI_LOOK } from '../sprites/people.js';
import { P, bubble, every, fill, fire, flags, frame, LOOKS, patrol, person, pine, seeded, spr, tag, wave, windLines } from './kit.js';

const CLIMB_FRAMES = 128;
const LOOP = 176;
const TOP_Y = 12;

export const freeSolo = {
  alt: 'A tiny climber in a red jacket, labeled Alex Honnold, climbs a sheer granite wall hand over hand with no rope as a height counter ticks up to 3,000 feet. At the top he pumps a fist and leaves burst out. Two curious passersby watch from below.',
  h: 110,
  w: 120,
  still: 70,
  bg(c, { w, h }) {
    const random = seeded(101);
    fill(c, P.skyBlue, 0, 0, w, h);
    fill(c, P.granite, 0, 0, w - 12, h);
    fill(c, '#868f99', w - 14, 0, 2, h);
    for (let i = 0; i < 90; i++) {
      fill(c, random() < 0.5 ? '#868f99' : '#b3bbc4', random() * (w - 14), random() * h, 2 + random() * 6, 1);
    }
    // Long cracks running up the face.
    for (const start of [w * 0.2, w * 0.68]) {
      let x = start;
      for (let y = 0; y < h - 8; y++) {
        x += random() < 0.15 ? (random() < 0.5 ? -1 : 1) : 0;
        fill(c, P.thorn, x, y, 1, 1);
      }
    }
    fill(c, P.grass, 0, h - 8, w, 8);
    fill(c, P.forestDark, 0, h - 8, w, 1);
    pine(c, w - 8, h - 8, 14);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const t = f % LOOP;
    const progress = Math.min(t, CLIMB_FRAMES) / CLIMB_FRAMES;
    const atTop = t >= CLIMB_FRAMES;
    const x = Math.round(w * 0.42);
    const y = Math.round(h - 26 - (h - 26 - TOP_Y) * progress);

    // Curious passersby walk toward the wall to look up.
    const near = patrol(f, { a: w - 30, b: x + 16, speed: 1, pause: 60 });
    person(c, LOOKS.crowdGray, near.x, h - 24, { flip: near.flip, moving: near.moving, f });
    const near2 = patrol(f, { a: w - 16, b: x + 30, speed: 1, pause: 60, offset: 6 });
    person(c, LOOKS.crowdLight, near2.x, h - 24, { flip: near2.flip, moving: near2.moving, f });
    if (near.stopped && near.x < w / 2 + 20) bubble(c, near.x + 3, h - 34, '?');

    if (!atTop && f % 12 < 2) fill(c, P.marble, x - 1, y + 13, 3, 2); // Chalk dust off a hold.
    if (atTop) {
      spr(c, FIST_PUMP, HONNOLD_COLORS, x, y);
      const burst = t - CLIMB_FRAMES;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const leafX = x + 8 + Math.cos(angle) * burst * 2;
        const leafY = y + 4 + Math.sin(angle) * burst * 1.5 + burst * burst * 0.06;
        fill(c, i % 2 ? P.vineGreen : P.vineGold, leafX, leafY, 2, 2);
      }
    } else {
      spr(c, CLIMB, HONNOLD_COLORS, x, y, every(f, 6, 3));
    }

    const hawkX = Math.round(w * 0.55 + wave(f, 80, Math.min(30, w * 0.3)));
    const hawkY = 22 + wave(f + 20, 80, 8);
    spr(c, every(f, 4, 2) ? HAWK_UP : HAWK_DOWN, HAWK_LOOK, hawkX, hawkY);
    windLines(c, f, w, h - 16);

    tag(c, `${Math.round(progress * 300) * 10} FT`, 18, 4);
    tag(c, 'ALEX HONNOLD', x + 8, Math.min(y + 18, h - 20), { color: P.marble });
  },
};

export const yogiLedge = {
  alt: 'A yogi in lotus pose floats gently above a granite ledge while prayer flags flutter overhead.',
  h: 48,
  w: 110,
  still: 0,
  bg(c, { w, h }) {
    const random = seeded(55);
    fill(c, P.skyBlue, 0, 0, w, h);
    for (let i = 0; i < 12; i++) fill(c, '#aeb6bf', random() * w, 22 + random() * 10, 10, 2);
    fill(c, P.granite, 0, h - 10, w, 10);
    fill(c, '#868f99', 0, h - 10, w, 1);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    flags(c, 4, 6, w - 4, f);
    const hover = wave(f, 24, 2);
    fill(c, P.thornRed, w / 2 - 9, h - 12, 18, 2);
    spr(c, YOGI, YOGI_LOOK, w / 2 - 7, h - 28 + hover);
  },
};

export const vanCamp = {
  alt: 'A camper van parked under pine trees at night, with a camp stove flickering beside it and a spatula flipping peppers in a pan. Stars twinkle overhead.',
  h: 44,
  w: 110,
  still: 0,
  bg(c, { w, h }) {
    const random = seeded(77);
    fill(c, P.skyNight, 0, 0, w, h);
    pine(c, 8, h - 6, 24);
    pine(c, w - 14, h - 6, 28);
    pine(c, w - 30, h - 6, 20);
    fill(c, P.forestDark, 0, h - 6, w, 6);
    const vanX = 18;
    fill(c, P.marble, vanX, h - 24, 32, 14);
    fill(c, P.aegean, vanX, h - 17, 32, 3);
    fill(c, P.skyGlow, vanX + 24, h - 22, 6, 5);
    fill(c, P.skyNight, vanX + 4, h - 22, 14, 5);
    fill(c, P.skyNight, vanX + 4, h - 10, 6, 4);
    fill(c, P.skyNight, vanX + 22, h - 10, 6, 4);
    for (let i = 0; i < 16; i++) fill(c, P.marble, random() * w, random() * (h - 26), 1, 1);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const stove = Math.min(w - 26, 64);
    fill(c, P.granite, stove - 5, h - 8, 12, 3);
    fire(c, stove + 1, h - 8, f);
    fill(c, P.thorn, stove - 7, h - 12, 16, 2);
    const hop = every(f, 8, 2) ? 3 : 0;
    fill(c, P.vineRed, stove - 3, h - 14 - hop, 3, 2);
    fill(c, P.vineGreen, stove + 2, h - 14 - hop, 3, 2);
    spr(c, CHALK, HONNOLD_COLORS, stove + 10, h - 21);
  },
};
