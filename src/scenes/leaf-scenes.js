// Small scenes at the top of leaf dialogs, from each leaf's "Pixel scene" note in content/.
// Any number or word drawn here also appears in that leaf's text or scene note.
import { BISON, BISON_LOOK, COW, COW_LOOK, FISH, FISH_LOOK, PEACOCK, PEACOCK_LOOK, DEER, DEER_LOOK, OCTOPUS, OCTOPUS_LOOK, SHRIMP, SHRIMP_LOOK } from '../sprites/animals.js';
import { CLIMB, CLIMBER_COLORS, FIST_PUMP, HONNOLD_COLORS } from '../sprites/climber.js';
import { HOMININ, HOMININ_LOOK, YOGI, YOGI_LOOK } from '../sprites/people.js';
import { P, bubble, cycle, every, fill, fire, LOOKS, patrol, person, spr, tag, text, textWidth, wave, windLines } from './kit.js';

const backdrop = (color) => (c, { w, h }) => {
  fill(c, color, 0, 0, w, h);
};

const scene = (alt, color, draw, extra = {}) => ({ alt, h: 40, w: 180, still: 8, bg: backdrop(color), draw, ...extra });

const center = (w) => Math.round(w / 2);

function pyramid(c, cx, baseY, flipped, wobble = 0, glow = false) {
  const colors = [P.vineRed, P.vineGold, P.vineGreen, P.fossil];
  const rows = [8, 16, 24, 32];
  rows.forEach((width, i) => {
    const row = flipped ? 3 - i : i;
    const y = baseY - 28 + row * 7;
    fill(c, colors[flipped ? i : 3 - i], cx - width / 2 + (flipped ? wobble : 0), y, width, 6);
  });
  if (glow) fill(c, P.skyGlow, cx - 18 + wobble, baseY - 30, 36, 1);
}

const muscleFlex = (c, x, y, flex) => {
  person(c, LOOKS.strongman, x, y);
  const up = flex ? 2 : 0;
  fill(c, LOOKS.strongman.s, x - 3, y + 5 - up, 4, 3);
  fill(c, LOOKS.strongman.s, x + 9, y + 5 - up, 4, 3);
};

/** Wraps words to fit the scene's width, for the Ovid quote. */
function wrapped(string, maxChars) {
  const lines = [];
  let line = '';
  for (const word of string.split(' ')) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const lotus = (c, x, y, open) => {
  fill(c, P.vinePink, x - 2, y - 4, 4, 6);
  if (open) {
    fill(c, P.vinePink, x - 6, y - 2, 12, 3);
    fill(c, P.marble, x - 1, y - 3, 2, 3);
  }
  fill(c, P.banyan, x - 5, y + 2, 10, 1);
};

/** A line of light traveling down toward the roots, for leaves that call back to them. */
const rootGlow = (c, w, h, f, color, end) => {
  const x = center(w);
  fill(c, P.barkDark, x - 1, 0, 3, h);
  const lit = Math.min(h, (f % 48) * 2);
  fill(c, color, x, 0, 1, lit);
  if (lit >= h) end();
};

export const LEAF_SCENES = {
  'evo-6': () => scene('A split diorama: one half savanna with fruit trees, the other half tundra with reindeer. The same hominin walks between them and changes what it carries.', P.skyPeach, (c, { w, h, f }) => {
    const x = center(w);
    fill(c, P.gold, 0, h - 12, x, 12);
    fill(c, '#c8e0ee', x, 0, x, h);
    fill(c, P.marble, x, h - 12, x, 12);
    fill(c, P.bark, 14, h - 24, 2, 12);
    fill(c, P.olive, 8, h - 32, 14, 8);
    fill(c, P.vineRed, 12, h - 26, 2, 2);
    spr(c, DEER, { ...DEER_LOOK, b: P.granite, a: P.thorn }, w - 22, h - 22);
    const walker = patrol(f, { a: 26, b: w - 40, speed: 1, pause: 6 });
    spr(c, HOMININ, HOMININ_LOOK, walker.x, h - 19, walker.flip);
    const inFruit = walker.x < x;
    fill(c, inFruit ? P.vineRed : P.marble, walker.x + (walker.flip ? -2 : 11), h - 12, 3, inFruit ? 3 : 2);
  }),
  'ind-1': () => scene('A fire altar with rising smoke slowly fades, and a lotus blooms in its place.', P.terracotta, (c, { w, h, f }) => {
    const x = center(w);
    fill(c, P.fossil, 0, h - 6, w, 6);
    if (f % 80 < 40) {
      fill(c, P.marble, x - 10, h - 14, 20, 8);
      fire(c, x, h - 14, f);
      for (let i = 0; i < 5; i++) fill(c, P.granite, x + wave(f + i * 5, 12, 2), h - 26 - ((f + i * 4) % 14), 2, 2);
    } else {
      lotus(c, x, h - 12, f % 80 > 50);
    }
  }),
  'ind-7': () => scene('A pixel Chinese temple where a royal scroll unrolls and the monks’ bowls switch from meat to greens.', P.skyPeach, (c, { w, h, f }) => {
    const x = center(w);
    const after = f % 64 > 28;
    fill(c, P.vineRed, x - 26, 8, 52, 3);
    fill(c, P.vineRed, x - 22, 5, 44, 3);
    fill(c, P.marble, x - 20, 11, 40, h - 17);
    fill(c, P.grass, 0, h - 6, w, 6);
    fill(c, P.gold, x - 6, 13, 12, Math.min(16, (f % 64) / 2));
    for (const dx of [-44, 34]) {
      if (x + dx < 0) continue;
      person(c, LOOKS.buddhist, x + dx, h - 20, { robe: true });
      fill(c, after ? P.vineGreen : P.emberDeep, x + dx + 2, h - 22, 6, 2);
    }
  }),
  'grk-3': () => {
    const quote = 'Human beings, stop desecrating your bodies with impious foodstuffs';
    return scene('A pixel scroll unrolls as a quote from Ovid types out one letter at a time.', P.leather, (c, { w, h, f }) => {
      fill(c, P.marble, 6, 2, w - 12, h - 4);
      fill(c, P.fossil, 3, 1, w - 6, 3);
      fill(c, P.fossil, 3, h - 4, w - 6, 3);
      const shown = quote.slice(0, Math.min(quote.length, f % 110));
      wrapped(shown, Math.floor((w - 20) / 4)).forEach((line, i) => text(c, line, 10, 7 + i * 7, P.skyNight));
    }, { still: 90 });
  },
  'grk-5': () => scene('A stack of scrolls grows taller as a scribe writes.', P.pottery, (c, { w, h, f }) => {
    const x = center(w);
    fill(c, P.marble, 0, h - 5, w, 5);
    person(c, LOOKS.roman, x - 30, h - 21, { robe: true });
    fill(c, P.gold, x - 18, h - 16 + (f % 4 < 2 ? 1 : 0), 4, 1);
    const stack = (Math.floor(f / 8) % 7) + 1;
    for (let i = 0; i < stack; i++) {
      fill(c, P.marble, x + 2, h - 9 - i * 4, 20, 3);
      fill(c, P.fossil, x + 2, h - 9 - i * 4, 2, 3);
      fill(c, P.fossil, x + 20, h - 9 - i * 4, 2, 3);
    }
  }),
  'trk-g3': () => scene('A tiny pixel graham cracker pops out.', P.skyBlue, (c, { w, h, f }) => {
    const pop = Math.abs(wave(f, 16, 10));
    const x = center(w) - 9;
    const y = h - 20 - pop;
    fill(c, P.fossil, x, y, 18, 16);
    fill(c, P.bark, x + 8, y, 1, 16);
    fill(c, P.bark, x, y + 8, 18, 1);
    for (const dx of [3, 13]) for (const dy of [3, 11]) fill(c, P.bark, x + dx, y + dy, 2, 2);
  }),
  'b1-3': () => scene('A vine grows from this leaf across the gap toward Branch 2, while tiny solar panels glint on a rooftop below.', P.skyBlue, (c, { w, h, f }) => {
    fill(c, P.granite, 0, 0, 22, h);
    fill(c, P.forest, w - 22, 0, 22, h);
    const reach = 22 + Math.min(w - 44, (f % 64) * 3);
    for (let x = 22; x < reach; x++) fill(c, P.vineGreen, x, 10 + wave(x, 24, 3), 1, 2);
    const roof = center(w) - 14;
    fill(c, P.marble, roof, h - 10, 28, 10);
    fill(c, P.pottery, roof - 2, h - 13, 32, 3);
    for (let i = 0; i < 3; i++) fill(c, every(f + i * 3, 12, 2) ? P.skyGlow : P.aegean, roof + 1 + i * 9, h - 16, 8, 3);
  }),
  'b1-5': () => scene('A second climber in a different color waves from the top of a desert sandstone tower.', P.skyPeach, (c, { w, h, f }) => {
    const x = center(w) - 12;
    fill(c, P.pottery, 0, h - 5, w, 5);
    fill(c, P.pottery, x, 16, 24, h - 16);
    fill(c, P.terracotta, x + 4, 18, 3, h - 18);
    spr(c, every(f, 8, 4) ? CLIMB : FIST_PUMP, CLIMBER_COLORS.orange, x + 4, 1);
  }),
  'b1-9': () => scene('A pixel heart with a health bar that fills up, beside a hot dog with a hazard sign.', P.skyNight, (c, { w, h, f }) => {
    const x = center(w) - 40;
    fill(c, P.vineRed, x, 10, 7, 7);
    fill(c, P.vineRed, x + 9, 10, 7, 7);
    fill(c, P.vineRed, x, 14, 16, 7);
    fill(c, P.vineRed, x + 4, 21, 8, 4);
    fill(c, P.thorn, x + 20, 14, 26, 6);
    fill(c, P.vineGreen, x + 21, 15, Math.min(24, (f % 48) / 1.5), 4);
    const dog = x + 56;
    fill(c, P.fossil, dog, h - 16, 18, 8);
    fill(c, P.emberDeep, dog - 2, h - 14, 22, 4);
    fill(c, P.gold, dog + 2, h - 13, 14, 1);
    fill(c, P.gold, dog + 6, 4, 7, 7);
    fill(c, P.skyNight, dog + 9, 5, 1, 3);
    fill(c, P.skyNight, dog + 9, 9, 1, 1);
  }),
  'b2-7': () => scene('A glowing root line lights up from this leaf all the way down the trunk to the India and Greece roots.', P.forestDark, (c, { w, h, f }) => {
    rootGlow(c, w, h, f, P.skyGlow, () => {
      lotus(c, center(w) - 30, h - 10, true);
      fill(c, P.marble, center(w) + 22, h - 16, 4, 12);
      fill(c, P.marble, center(w) + 20, h - 18, 8, 2);
    });
  }),
  'b2-9': () => scene('The vine from Branch 1 arrives here and blooms.', P.forest, (c, { w, h, f }) => {
    const reach = Math.min(center(w), 8 + (f % 64) * 3);
    for (let x = 0; x < reach; x++) fill(c, P.vineGreen, x, 20 + wave(x, 24, 3), 1, 2);
    if (reach >= center(w)) {
      fill(c, P.vinePink, center(w) - 4, 15, 8, 8);
      fill(c, P.gold, center(w) - 1, 18, 2, 2);
    }
  }),
  'b3-5': () => scene('A glowing line connects this leaf down the trunk to the fossils of the Taproot.', P.ember, (c, { w, h, f }) => {
    rootGlow(c, w, h, f, P.skyGlow, () => {
      fill(c, P.fossil, center(w) - 24, h - 14, 10, 10);
      fill(c, P.soil, center(w) - 21, h - 11, 4, 4);
      fill(c, P.marble, center(w) + 12, h - 9, 14, 2);
    });
  }),
  'b3-7': () => {
    let looking = false;
    return scene('A pixel energy bar labeled Mood. A magnifying glass reveals a tiny cow-shaped dollar tag on the back of the study.', P.dusk, (c, { w, h }) => {
      const x = center(w);
      tag(c, 'MOOD', x - 28, 4);
      fill(c, P.thorn, x - 50, 15, 44, 6);
      fill(c, P.vineGold, x - 49, 16, 24, 4);
      fill(c, P.marble, x + 10, 6, 26, 28);
      for (let y = 10; y < 22; y += 4) fill(c, P.granite, x + 13, y, 20, 1);
      if (looking) {
        fill(c, P.fossil, x + 12, 16, 24, 20);
        fill(c, P.skyGlow, x + 14, 18, 20, 16);
        spr(c, COW, COW_LOOK, x + 16, 20);
        text(c, '$', x + 22, h - 10, P.vineRed);
        fill(c, P.bark, x + 36, 32, 8, 2);
      }
    }, { action: { label: '🔍 LOOK CLOSER', run: () => { looking = !looking; } } });
  },
  'evo-2': () => scene('A cartoon pixel brain inflates like a balloon while a pixel steak and a gut icon shrink beside it.', P.soil, (c, { w, f }) => {
    const t = (cycle(f, 48) < 0.5 ? cycle(f, 48) * 2 : 2 - cycle(f, 48) * 2);
    const r = 5 + Math.round(t * 10);
    fill(c, P.vinePink, center(w) - r, 20 - r, r * 2, r * 2);
    fill(c, P.thornRed, center(w), 20 - r, 1, r * 2);
    const s = 14 - Math.round(t * 8);
    fill(c, P.emberDeep, center(w) - 40, 20 - s / 2, s + 4, s);
    fill(c, P.marble, center(w) - 38, 20, 2, 2);
    const g = 12 - Math.round(t * 7);
    fill(c, P.pottery, center(w) + 30, 20 - g / 2, g, g);
  }),
  'evo-3': () => scene('A pixel archaeologist with a clipboard and tally counter finds that more digging means more bones found.', P.fossil, (c, { w, f }) => {
    person(c, LOOKS.crowdLight, 14, 18);
    fill(c, P.marble, 26, 24, 6, 7);
    const n = (Math.floor(f / 4) % 9) + 1;
    for (let i = 0; i < n; i++) fill(c, P.marble, 42 + i * 8, 28, 6, 2);
    tag(c, 'MORE DIGGING = MORE BONES!', center(w) + 10, 6, { color: P.skyGlow });
  }),
  'evo-5': () => scene('A giant pixel tooth with a magnifying glass revealing tiny green and tan grains.', P.skyNight, (c, { w, f }) => {
    const x = center(w) - 12;
    fill(c, P.marble, x, 6, 24, 18);
    fill(c, P.marble, x + 2, 24, 7, 10);
    fill(c, P.marble, x + 15, 24, 7, 10);
    const lx = x + 6 + wave(f, 32, 6);
    fill(c, P.bark, lx + 11, 22, 8, 2);
    fill(c, P.fossil, lx - 2, 8, 14, 14);
    fill(c, P.skyGlow, lx, 10, 10, 10);
    for (let i = 0; i < 6; i++) fill(c, i % 2 ? P.vineGreen : P.fossil, lx + 1 + i * 2 - (i % 3), 11 + (i * 3) % 8, 2, 2);
  }),
  'evo-8': () => scene('A herd of tiny pixel bison stampedes across the screen, thinning out as a year counter ticks forward to 1889.', P.fossil, (c, { w, f }) => {
    const t = Math.min(1, cycle(f, 96) * 1.3);
    const count = Math.max(1, Math.round(8 * (1 - t)));
    for (let i = 0; i < count; i++) spr(c, BISON, BISON_LOOK, (f * 2 + i * 41) % (w + 18) - 16, 12 + (i * 11) % 18, false);
    tag(c, t >= 1 ? '1889: 512 LEFT' : `YEAR ${1800 + Math.round(t * 89)}`, 30, 2);
  }),
  'ind-3': () => scene('A monk with an alms bowl, beside a three-panel sign reading Seen, Heard, Suspected, each crossed out.', P.gold, (c, { w, f }) => {
    const walker = patrol(f, { a: 4, b: 18, speed: 0.5, pause: 8 });
    person(c, LOOKS.buddhist, walker.x, 20, { robe: true, moving: walker.moving, f, flip: walker.flip });
    fill(c, P.bark, walker.x + 3, 29, 6, 2);
    const words = ['SEEN', 'HEARD', 'SUSPECTED'];
    let x = 36;
    for (const word of words) {
      const width = textWidth(word) + 4;
      if (x + width > w) break;
      tag(c, word, x + width / 2, 14);
      fill(c, P.vineRed, x, 17, width, 1);
      x += width + 3;
    }
  }),
  'ind-4': () => scene('A tall stone pillar topped with lions. Pixel peacocks and deer walk away from the palace kitchen, free.', P.skyPeach, (c, { w, h, f }) => {
    fill(c, P.grass, 0, h - 6, w, 6);
    fill(c, P.marble, 16, 8, 8, h - 14);
    fill(c, P.gold, 14, 2, 12, 6);
    fill(c, P.fossil, 16, 0, 3, 3);
    fill(c, P.fossil, 21, 0, 3, 3);
    spr(c, PEACOCK, PEACOCK_LOOK, 34 + ((f / 2) % Math.max(1, w - 60)), h - 18);
    spr(c, DEER, DEER_LOOK, 50 + ((f / 2) % Math.max(1, w - 74)), h - 17);
  }),
  'ind-6': () => scene('Three pixel food bowls glow different colors: calm blue-white, fiery red, and dark purple.', P.skyNight, (c, { w, f }) => {
    const glow = every(f, 8, 4) ? 1 : 0;
    [[P.water, -46], [P.vineRed, -8], [P.dusk, 30]].forEach(([color, dx]) => {
      const x = center(w) + dx;
      fill(c, color, x - glow, 12 - glow, 18 + glow * 2, 6);
      fill(c, P.marble, x, 18, 18, 3);
      fill(c, P.marble, x + 3, 21, 12, 3);
      fill(c, P.granite, x + 6, 24, 6, 2);
    });
  }),
  'ind-8': () => scene('A steamship sprite sails across a pixel ocean from India to America.', P.skyBlue, (c, { w, h, f }) => {
    fill(c, P.aegean, 0, h - 12, w, 12);
    for (let i = 0; i < 6; i++) fill(c, P.water, (i * 37 + f) % w, h - 10 + (i % 3) * 3, 6, 1);
    const x = (f / 2) % Math.max(1, w - 30);
    fill(c, P.skyNight, x, h - 18, 28, 7);
    fill(c, P.marble, x + 4, h - 24, 18, 6);
    fill(c, P.vineRed, x + 12, h - 32, 5, 8);
    fill(c, P.granite, x + 14 - (f % 6), h - 36 - (f % 6), 3, 2);
    person(c, LOOKS.buddhist, x + 5, h - 34, { robe: true });
  }),
  'ind-9': () => scene('A small figure in a white shawl speaks at a podium in a foggy London hall.', P.granite, (c, { w, h, f }) => {
    for (let i = 0; i < 6; i++) fill(c, '#b3bbc4', (i * 53 + f) % (w + 20) - 16, 4 + i * 5, 26, 2);
    person(c, LOOKS.jain, center(w) - 5, h - 26, { robe: true });
    fill(c, P.bark, center(w) + 5, h - 16, 12, 16);
    fill(c, P.barkDark, center(w) + 5, h - 16, 12, 2);
  }),
  'ind-11': () => scene('A radio microphone icon, with snow falling on a mountain monastery.', P.skyBlue, (c, { w, h, f }) => {
    fill(c, P.marble, 0, h - 8, w, 8);
    fill(c, P.pottery, center(w) + 8, h - 22, 24, 14);
    fill(c, P.vineRed, center(w) + 6, h - 25, 28, 3);
    fill(c, P.thorn, center(w) - 24, h - 28, 8, 12);
    fill(c, P.granite, center(w) - 22, h - 16, 4, 8);
    fill(c, P.thorn, center(w) - 27, h - 8, 14, 2);
    for (let i = 0; i < 16; i++) fill(c, '#ffffff', (i * 23) % w, (f + i * 7) % (h - 6), 1, 1);
  }),
  'grk-2': () => scene('A Roman writes at a desk by lamplight, then a letter flies away.', P.leather, (c, { w, h, f }) => {
    fill(c, P.barkDark, 8, h - 12, 44, 12);
    person(c, LOOKS.roman, 16, h - 28, { robe: true });
    if (every(f, 4, 2)) fill(c, P.gold, 50, h - 19, 2, 3);
    fill(c, P.marble, 28, h - 14, 10, 2);
    const t = f % 40;
    fill(c, P.marble, 40 + t * 3, h - 22 - t / 3, 6, 4);
  }),
  'grk-4': () => scene('A Greek figure stares down a pixel ox. The ox stares back. Then both shrug and walk away.', P.marble, (c, { w, h, f }) => {
    const t = f % 64;
    const leaving = t > 40 ? (t - 40) * 2 : 0;
    person(c, LOOKS.citizenBlue, center(w) - 30 - leaving, h - 18, { flip: leaving > 0, moving: leaving > 0, f });
    spr(c, COW, { ...COW_LOOK, w: P.barkLight }, center(w) + 6 + leaving, h - 12, leaving === 0);
    if (t > 12 && t <= 40) bubble(c, center(w) - 6, 6, '.');
  }),
  'trk-y1': () => scene('A pixel strongman in a leopard-print singlet flexes on a stage as an old-timey camera flash pops and Before and After cards flip.', P.emberDeep, (c, { w, h, f }) => {
    fill(c, P.barkLight, 0, h - 8, w, 8);
    muscleFlex(c, center(w) - 5, h - 24, every(f, 8, 4));
    if (every(f, 16, 2)) fill(c, '#ffffff', 10, 6, 6, 6);
    fill(c, P.thorn, 12, 12, 2, h - 20);
    tag(c, every(f, 24, 12) ? 'BEFORE' : 'AFTER', w - 22, 6, { color: P.skyNight, plate: P.marble });
  }),
  'trk-y4': () => scene('A muscular sprite flexes next to a giant pixel egg carton, which later swaps to a salad bowl.', P.dusk, (c, { w, h, f }) => {
    muscleFlex(c, center(w) - 24, h - 20, every(f, 8, 4));
    if (every(f, 64, 32)) {
      fill(c, P.fossil, center(w) + 6, h - 14, 28, 12);
      for (let i = 0; i < 8; i++) fill(c, P.marble, center(w) + 8 + (i % 4) * 6, h - 13 + (i >> 2) * 5, 4, 4);
    } else {
      fill(c, P.marble, center(w) + 6, h - 8, 28, 7);
      for (let i = 0; i < 6; i++) fill(c, P.vineGreen, center(w) + 8 + i * 4, h - 12 + (i % 2), 3, 4);
    }
  }),
  'trk-y5': () => scene('A shirtless pixel king with a crown chomps a red liver, and a BUSTED stamp slams down.', P.skyNight, (c, { w, h, f }) => {
    muscleFlex(c, center(w) - 5, h - 24, false);
    fill(c, P.gold, center(w) - 3, h - 27, 8, 3);
    fill(c, P.emberDeep, center(w) + 7, h - 18, 6, 4);
    if (every(f, 40, 20)) tag(c, 'BUSTED', center(w), 14, { color: P.marble, plate: P.vineRed });
  }),
  'trk-y7': () => scene('A pixel food pyramid flips upside down and lands balanced on its point, wobbling.', P.skyBlue, (c, { w, h, f }) => {
    const flipped = f % 64 > 16;
    pyramid(c, center(w), h - 3, flipped, flipped ? wave(f, 8, 2) : 0);
  }),
  'trk-g10': () => scene('A pixel stock chart rockets upward with a plant-burger riding it like a surfboard.', P.skyNight, (c, { w, h, f }) => {
    const t = cycle(f, 48);
    let x = 8;
    let y = h - 6;
    const end = Math.round(t * (w - 40));
    for (let i = 0; i < end; i += 2) {
      x = 8 + i;
      y = h - 6 - Math.round((i / (w - 40)) ** 3 * (h - 14));
      fill(c, P.vineGreen, x, y, 2, 2);
    }
    fill(c, P.bark, x - 3, y - 5, 8, 2);
    fill(c, P.vineGreen, x - 3, y - 3, 8, 1);
    tag(c, '+163%', w - 16, 2);
  }),
  'trk-r1': () => scene('A pixel steak flexes a tiny bicep. A sad pixel tofu block sits in the corner wearing a party hat.', P.dusk, (c, { w, h, f }) => {
    const x = center(w) - 18;
    fill(c, P.emberDeep, x, 12, 24, 14);
    fill(c, P.marble, x + 3, 15, 4, 2);
    fill(c, P.pottery, x + 10, 20, 8, 2);
    const up = every(f, 8, 4) ? 3 : 0;
    fill(c, P.emberDeep, x + 24, 12 - up, 6, 3);
    fill(c, P.emberDeep, x + 27, 7 - up, 3, 6);
    fill(c, P.marble, w - 26, h - 14, 16, 12);
    fill(c, P.vinePink, w - 20, h - 18, 4, 4);
    fill(c, P.gold, w - 19, h - 20, 2, 2);
  }),
  'trk-r3': () => {
    let cracked = false;
    return scene('A speech bubble reading Soy Boy cracks and crumbles when clicked, revealing a citation needed tag.', P.dusk, (c, { w, f }) => {
      if (!cracked) {
        tag(c, 'SOY BOY!', center(w), 14, { color: P.skyNight, plate: P.marble });
      } else {
        for (let i = 0; i < 6; i++) fill(c, P.marble, center(w) - 18 + i * 7, 26 + (i % 2) * 4 + (f % 4), 4, 2);
        tag(c, '[CITATION NEEDED]', center(w), 14);
      }
    }, { action: { label: '💥 CRACK IT', run: () => { cracked = !cracked; } }, still: 0 });
  },
  'b1-2': () => scene('A slider bar labeled Carnivore to Vegan, with a little climber icon sitting near the plants end but not at the very edge.', P.skyNight, (c, { w, h }) => {
    const left = 8;
    const right = w - 8;
    fill(c, P.marble, left, h - 12, right - left, 3);
    text(c, 'CARNIVORE', left, h - 8, P.skyPeach);
    text(c, 'VEGAN', right - 19, h - 8, P.vineGreen);
    spr(c, CLIMB, CLIMBER_COLORS.green, left + (right - left) * 0.78 - 8, h - 29);
  }),
  'b1-6': () => scene('A pixel skyscraper with a tiny climber and a red LIVE badge blinking in the corner. A wind gust blows at the top.', P.skyBlue, (c, { w, h, f }) => {
    const x = center(w) - 8;
    fill(c, P.thorn, x, 4, 16, h - 4);
    for (let y = 8; y < h; y += 5) fill(c, P.water, x + 2, y, 12, 2);
    fill(c, P.thorn, x + 6, 0, 4, 4);
    spr(c, CLIMB, HONNOLD_COLORS, x + 8, Math.max(2, h - 18 - (f % 48)), every(f, 4, 2));
    windLines(c, f, w, 16);
    if (every(f, 8, 5)) tag(c, 'LIVE', 12, 3, { color: P.marble, plate: P.vineRed });
  }),
  'b1-7': () => scene('A pixel nutrition label builds itself from beans, lentils, tofu, and nuts, with a Protein Complete banner.', P.marble, (c, { w, f }) => {
    const items = [P.bark, P.gold, P.skyNight, P.barkLight];
    const shown = Math.min(8, 1 + Math.floor((f % 64) / 6));
    for (let i = 0; i < shown; i++) fill(c, items[i % 4], center(w) - 24 + (i % 4) * 13, 20 + (i >> 2) * 8, 9, 6);
    if (shown >= 8) tag(c, 'PROTEIN COMPLETE', center(w), 6, { color: P.vineGreen });
  }),
  'b1-8': () => {
    let weeks = 0;
    return scene('Two identical pixel twins stand side by side. Fast-forward 8 weeks and one twin’s heart icon glows healthier green.', P.dusk, (c, { w, h }) => {
      const x = center(w);
      for (const [dx, look] of [[-26, LOOKS.crowdLight], [14, LOOKS.crowdLight]]) person(c, look, x + dx, h - 18);
      const heart = (hx, color) => {
        fill(c, color, hx, 8, 3, 3);
        fill(c, color, hx + 4, 8, 3, 3);
        fill(c, color, hx, 10, 7, 3);
        fill(c, color, hx + 2, 13, 3, 2);
      };
      heart(x - 24, weeks ? P.vineGreen : P.vineRed);
      heart(x + 16, P.vineRed);
      tag(c, weeks ? 'WEEK 8' : 'WEEK 0', x, 1);
    }, { action: { label: '⏩ FAST-FORWARD 8 WEEKS', run: () => { weeks = weeks ? 0 : 8; } } });
  },
  'b1-10': () => scene('A huge muscled sprite flexes, then pulls a pixel broccoli from behind his back like a magic trick.', P.dusk, (c, { w, h, f }) => {
    muscleFlex(c, center(w) - 5, h - 20, every(f, 8, 4));
    if (every(f, 48, 24)) {
      fill(c, P.vineGreen, center(w) + 13, h - 21, 8, 6);
      fill(c, P.forest, center(w) + 15, h - 15, 3, 5);
    }
  }),
  'b1-11': () => scene('Split screen: a yogi levitating in lotus pose on the left, a climber hanging motionless from one hand on the right, and a shared Focus meter pulsing between them.', P.granite, (c, { w, h, f }) => {
    const x = center(w);
    fill(c, P.terracotta, 0, 0, x, h);
    spr(c, YOGI, YOGI_LOOK, x - 34, 14 + wave(f, 24, 2));
    fill(c, P.thorn, x + 28, 2, 2, h - 2);
    spr(c, CLIMB, HONNOLD_COLORS, x + 20, 8);
    const pulse = 8 + wave(f, 16, 6);
    tag(c, 'FOCUS', x, 2);
    fill(c, P.skyNight, x - 3, 12, 6, 24);
    fill(c, P.vineGold, x - 2, 35 - pulse - 8, 4, pulse + 8);
  }),
  'b2-1': () => {
    let farmland = false;
    let shown = 0.18;
    return scene('An interactive bar chart: meat and dairy give 18 percent of calories but use 83 percent of farmland, and little cows fill the farmland bar.', P.skyNight, (c, { w, h }) => {
      const target = farmland ? 0.83 : 0.18;
      shown += (target - shown) * 0.35;
      const full = w - 16;
      tag(c, farmland ? 'FARMLAND: 83%' : 'CALORIES: 18%', center(w), 2);
      fill(c, P.thorn, 8, 14, full, 16);
      fill(c, P.pottery, 8, 14, full * shown, 16);
      text(c, 'MEAT AND DAIRY', 10, h - 7, P.marble);
      if (farmland) {
        for (let i = 0; i * 18 < full * shown - 16; i++) spr(c, COW, COW_LOOK, 9 + i * 18, 18);
      }
    }, { action: { label: '🔁 CALORIES / FARMLAND', run: () => { farmland = !farmland; } }, still: 0 });
  },
  'b2-3': () => scene('A pixel soybean pile splits into streams: a huge stream of 77 percent flows to animals, and a tiny trickle of 7 percent reaches a tofu block.', P.skyNight, (c, { w, f }) => {
    fill(c, P.gold, 8, 12, 18, 14);
    const flow = f % 4;
    for (let x = 26 + flow; x < w - 34; x += 4) fill(c, P.gold, x, 14, 3, 8);
    for (let x = 26 + flow; x < w - 34; x += 8) fill(c, P.gold, x, 30, 2, 1);
    fill(c, P.pottery, w - 32, 10, 24, 14);
    tag(c, '77%', w - 20, 2);
    fill(c, P.marble, w - 26, 26, 12, 8);
    tag(c, '7%', w - 42, 28);
  }),
  'b2-4': () => scene('A pixel dinner plate fills up: half vegetables and fruit, then grains, beans, nuts, and a tiny sliver of meat.', P.forestDark, (c, { w, f }) => {
    const x = center(w);
    fill(c, P.marble, x - 22, 4, 44, 32);
    fill(c, P.marble, x - 26, 8, 52, 24);
    const step = Math.floor((f % 64) / 12);
    if (step > 0) fill(c, P.vineGreen, x - 22, 8, 22, 24);
    if (step > 1) fill(c, P.gold, x + 1, 8, 20, 10);
    if (step > 2) fill(c, P.bark, x + 1, 19, 14, 8);
    if (step > 3) fill(c, P.barkLight, x + 1, 28, 12, 4);
    if (step > 4) fill(c, P.emberDeep, x + 15, 20, 3, 6);
  }),
  'b2-5': () => scene('A pixel fish in a pond with a thought bubble, while a shrimp and an octopus wave from the water.', P.water, (c, { w, h, f }) => {
    fill(c, P.aegean, 0, 20, w, h - 20);
    spr(c, FISH, FISH_LOOK, center(w) - 4, 22);
    bubble(c, center(w) + 6, 8, every(f, 24, 12) ? '?' : '!');
    spr(c, SHRIMP, SHRIMP_LOOK, 18, h - 7 + wave(f, 12, 1));
    spr(c, OCTOPUS, OCTOPUS_LOOK, w - 28, h - 10 + wave(f, 12, 1));
  }),
  'b2-6': () => scene('A pixel scale with a human on one side and a pig on the other, balanced at Suffering equals Suffering.', P.skyNight, (c, { w, h }) => {
    const x = center(w);
    fill(c, P.gold, x - 1, 10, 2, h - 12);
    fill(c, P.gold, x - 36, 16, 72, 2);
    fill(c, P.gold, x - 40, 30, 16, 2);
    fill(c, P.gold, x + 24, 30, 16, 2);
    person(c, LOOKS.crowdLight, x - 37, 15);
    fill(c, P.vinePink, x + 25, 22, 13, 8);
    fill(c, P.thornRed, x + 36, 25, 3, 3);
    tag(c, 'SUFFERING = SUFFERING', x, 1);
  }),
  'b2-T2': () => scene('A generic phone frame with no logo shows a red Account Banned stamp, as thorns grow around it.', P.thorn, (c, { w, h, f }) => {
    const x = center(w);
    fill(c, P.skyNight, x - 12, 2, 24, h - 4);
    fill(c, P.marble, x - 10, 5, 20, h - 10);
    const grow = Math.min(24, (f % 64) / 2);
    for (let i = 0; i < 6; i++) fill(c, P.thornRed, x - 16 - (i % 2) * 2, h - 4 - grow * ((i + 1) / 6), 6, 1);
    for (let i = 0; i < 6; i++) fill(c, P.thornRed, x + 10 + (i % 2) * 2, h - 4 - grow * ((i + 1) / 6), 6, 1);
    if (every(f, 32, 24)) tag(c, 'ACCOUNT BANNED', x, 16, { color: P.marble, plate: P.vineRed });
  }),
  'b2-T4': () => scene('Side by side: the megaphone figure with people walking away, and the climber with people walking toward him, curious.', P.thorn, (c, { w, h, f }) => {
    const x = center(w);
    fill(c, P.skyBlue, x, 0, x, h);
    person(c, LOOKS.megaphone, 8, h - 18);
    fill(c, P.marble, 18, h - 12, 4, 3);
    person(c, LOOKS.crowdGray, 26 + (f % 16), h - 18, { moving: true, f });
    spr(c, CLIMB, HONNOLD_COLORS, w - 20, h - 18);
    const walker = x + 20 - Math.round((f % 16) * -1);
    person(c, LOOKS.crowdLight, Math.min(walker, w - 34), h - 18, { moving: true, f });
  }),
  'b3-2': () => scene('A pixel calendar rips off days, each with a steak icon, beside a minus 12 pound counter.', P.ember, (c, { w, f }) => {
    const x = center(w) - 32;
    fill(c, P.marble, x, 6, 24, 28);
    fill(c, P.vineRed, x, 6, 24, 5);
    text(c, String((Math.floor(f / 3) % 31) + 1), x + 6, 14, P.skyNight);
    fill(c, P.emberDeep, x + 7, 22, 10, 7);
    if (f % 3 === 0) fill(c, P.marble, x + 26, 10 + (f % 12), 5, 4);
    tag(c, '-12 LB', x + 56, 16);
  }),
  'b3-3': () => scene('A fighting-game VS screen with two generic debaters whose health bars go back and forth.', P.dusk, (c, { w, h, f }) => {
    const x = center(w);
    const swing = wave(f, 32, 10);
    fill(c, P.thorn, 6, 3, x - 14, 4);
    fill(c, P.vineGold, 6, 3, x - 24 + swing, 4);
    fill(c, P.thorn, x + 8, 3, x - 14, 4);
    fill(c, P.vineGold, x + 8 + 10 + swing, 3, x - 24 - swing, 4);
    tag(c, 'VS', x, 1);
    person(c, LOOKS.fighterPlants, x - 30, h - 18);
    person(c, LOOKS.fighterMeat, x + 20, h - 18, { flip: true });
  }),
  'b3-4': () => {
    let leaning = -1;
    return scene('A pixel arm-wrestling table with a steak against a broccoli. Every click flips the result, and neither one wins permanently.', P.ember, (c, { w, h, f }) => {
      const x = center(w);
      fill(c, P.barkDark, x - 30, h - 12, 60, 4);
      fill(c, P.bark, x - 4, h - 8, 8, 8);
      const tilt = leaning * 6 + wave(f, 6, 1);
      fill(c, P.emberDeep, x - 40, h - 26, 20, 14);
      fill(c, P.marble, x - 37, h - 22, 3, 2);
      fill(c, P.vineGreen, x + 20, h - 28, 20, 12);
      fill(c, P.forest, x + 26, h - 16, 8, 4);
      fill(c, P.emberDeep, x - 20, h - 21, 20 + tilt, 3);
      fill(c, P.forest, x + tilt, h - 21, 20 - tilt, 3);
    }, { action: { label: '💪 ARM WRESTLE', run: () => { leaning = -leaning; } } });
  },
  'b3-6': () => scene('A pixel skeleton with a glowing hip joint, and a B12 pill bottle that bounces.', P.skyNight, (c, { w, h, f }) => {
    const x = center(w) - 18;
    fill(c, P.marble, x + 2, 2, 8, 7);
    fill(c, P.marble, x + 5, 9, 2, 13);
    for (let y = 11; y < 21; y += 3) fill(c, P.marble, x + 1, y, 10, 1);
    fill(c, every(f, 8, 4) ? P.saffron : P.vineRed, x, 21, 12, 4);
    fill(c, P.marble, x + 1, 25, 2, 12);
    fill(c, P.marble, x + 9, 25, 2, 12);
    const bottle = x + 34;
    const up = Math.abs(wave(f, 8, 5));
    fill(c, P.vineGold, bottle, h - 16 - up, 10, 14);
    fill(c, P.marble, bottle, h - 18 - up, 10, 3);
    text(c, 'B12', bottle - 1, h - 11 - up, P.skyNight);
  }),
  'b3-8': () => scene('A pixel cow happily munches grass on a hillside too steep and rocky for a tractor, while a tractor tries to drive up and slides back down.', P.skyBlue, (c, { w, h, f }) => {
    for (let x = 0; x < w; x++) {
      const y = Math.round(h - 4 - (x / w) * (h - 16));
      fill(c, P.grass, x, y, 1, h - y);
    }
    spr(c, COW, COW_LOOK, w - 30, 4);
    const t = f % 40;
    const x = t < 20 ? t * 2 : 40 - (t - 20) * 2;
    const y = h - 4 - (x / w) * (h - 16);
    fill(c, P.vineRed, x + 4, y - 11, 11, 6);
    fill(c, P.skyNight, x + 3, y - 5, 5, 5);
    fill(c, P.skyNight, x + 12, y - 4, 3, 3);
  }),
  'b3-9': () => scene('A pixel combine harvester rolls through wheat while tiny mice scatter. Then a question mark appears.', P.gold, (c, { w, h, f }) => {
    const t = f % 64;
    const x = t * 2 - 16;
    fill(c, P.vineRed, x, h - 18, 14, 10);
    fill(c, P.skyNight, x + 2, h - 6, 4, 4);
    fill(c, P.skyNight, x + 9, h - 6, 3, 3);
    for (let i = 0; i < 6; i++) {
      const home = (i * 31 + 20) % w;
      fill(c, P.thorn, home + (home - x > 0 && home - x < 20 ? 8 : 0), h - 4 - (i % 2) * 2, 2, 1);
    }
    if (t > 50) bubble(c, center(w), 8, '?');
  }),
  'b3-10': () => {
    let keyOff = false;
    return scene('A pixel wind-up toy fish with a big key on its back swims in circles. Click it, and the key falls off. The fish looks at you with a question mark.', P.water, (c, { w, h, f }) => {
      const x = keyOff ? center(w) - 4 : center(w) + wave(f, 32, 30) - 4;
      const y = keyOff ? 18 : 18 + wave(f + 8, 32, 6);
      spr(c, FISH, { ...FISH_LOOK, f: P.granite }, x, y);
      if (keyOff) {
        fill(c, P.gold, x + 2, h - 5, 7, 2);
        bubble(c, x + 8, y - 10, '?');
      } else {
        fill(c, P.gold, x + 3, y - 4, 2, 4);
        fill(c, P.gold, x + 1, y - 6, 6, 2);
      }
    }, { action: { label: '🔑 PULL THE KEY', run: () => { keyOff = !keyOff; } } });
  },
  'b3-11': () => scene('The flipped food pyramid from the trunk reappears here, glowing.', P.ember, (c, { w, h, f }) => {
    pyramid(c, center(w), h - 3, true, wave(f, 16, 1), every(f, 8, 4));
  }),
  'b3-12': () => scene('A cracked pixel crown falls from the branch and lands in a thorny patch.', P.emberDeep, (c, { w, h, f }) => {
    fill(c, P.barkDark, 0, 0, w, 4);
    for (let i = 0; i < 8; i++) fill(c, P.thornRed, center(w) - 24 + i * 6, h - 4 - (i % 2) * 2, 5, 1);
    const y = Math.min(h - 14, 4 + (f % 48));
    const x = center(w) - 6;
    fill(c, P.gold, x, y + 3, 12, 6);
    fill(c, P.gold, x, y, 2, 3);
    fill(c, P.gold, x + 5, y, 2, 3);
    fill(c, P.gold, x + 10, y, 2, 3);
    fill(c, P.skyNight, x + 6, y + 3, 1, 6);
  }),
};
