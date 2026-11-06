// Branch 3: Meat & Might. Sunset hunting grounds. Drawn with the same care and size as the other
// branches: it is not the villain branch.
import { COW, COW_LOOK, ELK, ELK_LOOK } from '../sprites/animals.js';
import { P, every, fill, fire, frame, LOOKS, patrol, person, pine, seeded, spr, tag, wave } from './kit.js';

export const treehouse = {
  alt: 'A podcast studio built into the tree like a treehouse. Two generic figures sit at a desk with big microphones, the host labeled Joe Rogan wearing headphones, under a blinking On Air light. A bow hangs on the wall, and outside the window an elk silhouette crosses a ridge at sunset.',
  h: 110,
  w: 120,
  still: 40,
  bg(c, { w, h }) {
    fill(c, P.dusk, 0, 0, w, 18);
    fill(c, P.emberDeep, 0, 18, w, 12);
    fill(c, P.ember, 0, 30, w, 14);
    // The branch and the cabin it holds up.
    fill(c, P.barkDark, 0, h - 18, w, 18);
    fill(c, P.bark, 0, h - 18, w, 3);
    const roof = 14;
    for (let i = 0; i < 12; i++) fill(c, P.leather, 4 - 0 + 12 - i, roof + i, w - 8 - (12 - i) * 2, 1);
    fill(c, P.barkDark, 4, 26, w - 8, h - 44);
    const random = seeded(3);
    for (let y = 28; y < h - 20; y += 6) fill(c, P.leather, 4, y, w - 8, 1);
    for (let i = 0; i < 16; i++) fill(c, P.leather, 4 + random() * (w - 12), 28 + random() * (h - 50), 1, 5);
    // The window looking out at the ridge.
    const winX = 10;
    const winW = w - 20;
    fill(c, P.skyNight, winX - 1, 33, winW + 2, 26);
    fill(c, P.dusk, winX, 34, winW, 8);
    fill(c, P.ember, winX, 42, winW, 8);
    fill(c, P.saffron, winX, 50, winW, 8);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const winX = 10;
    const winW = w - 20;
    // The elk walks across the ridge, clipped to the window.
    c.save();
    c.beginPath();
    c.rect(winX, 34, winW, 24);
    c.clip();
    const elkX = winX + ((f / 2) % (winW + 24)) - 20;
    for (let x = winX; x < winX + winW; x++) {
      fill(c, P.leather, x, 52 + wave(x * 2, 90, 2), 1, 8);
    }
    spr(c, ELK, ELK_LOOK, elkX, 40);
    c.restore();
    fill(c, P.skyNight, w / 2, 34, 1, 24);

    // A desk, two big microphones, two speakers taking turns.
    const deskY = h - 32;
    const talkingHost = every(f, 32, 16);
    const hostX = w - 24;
    person(c, LOOKS.guest, 14, deskY - 13 - (!talkingHost && every(f, 2, 1) ? 1 : 0));
    person(c, LOOKS.host, hostX, deskY - 13 - (talkingHost && every(f, 2, 1) ? 1 : 0), { flip: true });
    // The host's headphones.
    fill(c, P.skyNight, hostX - 1, deskY - 12, 12, 1);
    fill(c, P.skyNight, hostX - 1, deskY - 11, 2, 3);
    fill(c, P.skyNight, hostX + 9, deskY - 11, 2, 3);
    fill(c, P.bark, 8, deskY, w - 16, 5);
    fill(c, P.barkLight, 8, deskY, w - 16, 1);
    fill(c, P.barkDark, 12, deskY + 5, 3, 9);
    fill(c, P.barkDark, w - 15, deskY + 5, 3, 9);
    for (const x of [28, w - 30]) {
      fill(c, P.thorn, x, deskY - 9, 1, 9);
      fill(c, P.granite, x - 1, deskY - 13, 3, 5);
    }
    // A bow on the wall.
    const bowX = Math.round(w / 2) - 2;
    for (let i = 0; i < 11; i++) fill(c, P.fossil, bowX + Math.round(Math.sin((i / 10) * Math.PI) * 3), deskY - 14 + i, 1, 1);
    fill(c, P.marble, bowX, deskY - 14, 1, 11);
    // The ON AIR light blinks.
    const lit = every(f, 8, 5);
    tag(c, 'ON AIR', w / 2, 22, { color: lit ? P.marble : P.thorn, plate: lit ? P.vineRed : P.skyNight });
    tag(c, 'JOE ROGAN', w - 22, h - 16, { color: P.marble });
  },
};

export const ranch = {
  alt: 'A hillside pasture at sunset with cattle grazing on land too steep to plow, an elk on the ridge, and a combine harvester rolling through a wheat field.',
  h: 48,
  w: 110,
  still: 10,
  bg(c, { w, h }) {
    fill(c, P.emberDeep, 0, 0, w, 14);
    fill(c, P.ember, 0, 14, w, 10);
    for (let x = 0; x < w; x++) {
      const top = 20 + Math.round(Math.sin(x / 13) * 4);
      fill(c, P.olive, x, top, 1, h - top);
    }
    fill(c, P.gold, Math.round(w * 0.5), h - 15, w, 15);
    for (let x = Math.round(w * 0.5); x < w; x += 3) fill(c, P.saffron, x, h - 15, 1, 4);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    spr(c, ELK, ELK_LOOK, w - 22, 4);
    const cow = patrol(f, { a: 4, b: 26, speed: 0.25, pause: 24 });
    spr(c, COW, COW_LOOK, cow.x, h - 22, cow.flip);
    const x = Math.round(w * 0.5) + ((f / 2) % Math.max(1, w * 0.5 - 12));
    fill(c, P.vineRed, x, h - 18, 12, 8);
    fill(c, P.skyNight, x + 7, h - 17, 4, 3);
    fill(c, P.gold, x - 3, h - 12, 3, 4);
    fill(c, P.skyNight, x + 1, h - 10, 4, 4);
    fill(c, P.skyNight, x + 8, h - 10, 3, 3);
  },
};

export const grill = {
  alt: 'A campfire grill outside a log cabin at dusk, with a figure turning steaks and vegetables over the flames.',
  h: 44,
  w: 110,
  still: 2,
  bg(c, { w, h }) {
    fill(c, P.dusk, 0, 0, w, h);
    fill(c, P.emberDeep, 0, 20, w, 8);
    pine(c, 6, h - 8, 22, P.skyNight);
    pine(c, w - 10, h - 8, 26, P.skyNight);
    fill(c, P.leather, 12, 14, 26, h - 22);
    for (let y = 16; y < h - 8; y += 4) fill(c, P.barkDark, 12, y, 26, 1);
    fill(c, P.emberDeep, 10, 10, 30, 4);
    fill(c, P.skyGlow, 20, 20, 8, 7);
    fill(c, P.leather, 0, h - 8, w, 8);
    frame(c, w, h);
  },
  draw(c, { w, h, f }) {
    const x = Math.min(w - 30, 62);
    fire(c, x, h - 8, f);
    fill(c, P.thorn, x - 9, h - 13, 18, 1);
    fill(c, P.emberDeep, x - 7, h - 15, 6, 2);
    fill(c, P.vineGreen, x + 1, h - 15, 3, 2);
    person(c, LOOKS.rancher, x + 11, h - 22, { flip: true, moving: every(f, 8, 2), f });
  },
};
