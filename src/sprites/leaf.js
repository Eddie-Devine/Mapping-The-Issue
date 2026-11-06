// What the visitor clicks: leaves on the tree, fossils in the taproot, lotus buds in the India root,
// scrolls in the Greece root, and glowing fruit for each branch's hero. Each comes fresh and collected.
import { PALETTE as P } from '../palette.js';
import { toDataUrl } from './engine.js';

const LEAF = [
  '................',
  '..........KKKKK.',
  '........KKGGGGK.',
  '......KKGGLLGGK.',
  '.....KGGGLLGGGK.',
  '....KGGGLLGGDGK.',
  '...KGGGLLGGDGGK.',
  '...KGGLLGGDGGK..',
  '..KGGLLGGDGGGK..',
  '..KGGLGGDGGGK...',
  '..KGGGGDGGGK....',
  '..KGGGDGGKK.....',
  '...KGDGKK.......',
  '...DKKK.........',
  '..D.............',
  '................',
];

const FOSSIL = [
  '................',
  '.....KKKKKK.....',
  '...KKGGGGGGKK...',
  '..KGGLLLLLLGGK..',
  '..KGLDDDDDDLGK..',
  '.KGLDLLLLLLDLGK.',
  '.KGLDLDDDDLDLGK.',
  '.KGLDLDGGDLDLGK.',
  '.KGLDLDGDDLDLGK.',
  '.KGLDLDDDDLDLGK.',
  '.KGLDLLLLLLDLGK.',
  '..KGLDDDDDDLGK..',
  '..KGGLLLLLLGGK..',
  '...KKGGGGGGKK...',
  '.....KKKKKK.....',
  '................',
];

const SCROLL = [
  '................',
  '.KKKKKKKKKKKKKK.',
  'KDLLLLLLLLLLLLDK',
  'KDLLLLLLLLLLLLDK',
  '.KKGGGGGGGGGGKK.',
  '..KGDDDDDDDGGK..',
  '..KGGGGGGGGGGK..',
  '..KGDDDDDDGGGK..',
  '..KGGGGGGGGGGK..',
  '..KGDDDDDDDGGK..',
  '..KGGGGGGGGGGK..',
  '.KKGGGGGGGGGGKK.',
  'KDLLLLLLLLLLLLDK',
  'KDLLLLLLLLLLLLDK',
  '.KKKKKKKKKKKKKK.',
  '................',
];

const LOTUS = [
  '................',
  '.......KK.......',
  '......KGGK......',
  '...K..KGLK..K...',
  '..KGK.KGLK.KGK..',
  '..KGGKKGLKKGGK..',
  '...KGGKGLKGGK...',
  '.K.KGGLGLLGGK.K.',
  'KGKKGGLGLLGGKKGK',
  'KGGGKGGLLGGKGGGK',
  '.KGGGGGLLGGGGGK.',
  '..KKGGGGGGGGKK..',
  '....KKKKKKKK....',
  '.....DDDDDD.....',
  '......DDDD......',
  '................',
];

const FRUIT = [
  '.......DD.......',
  '......DLDK......',
  '....KKKDKKKK....',
  '..KKBBBBGGGGKK..',
  '.KBBBGGGBBBGGGK.',
  '.KBBGGGGGBBBGGK.',
  'KBBBBGGGBBBBBBGK',
  'KBBBBBGGBBBBBBBK',
  'KLBBBBBBBBGGBBBK',
  'KLLBBBBBBGGGGBBK',
  'KBLBBBBBBBGGBBBK',
  '.KBBGGBBBBBBBBK.',
  '.KBGGGGBBBBBBBK.',
  '..KKGGBBBBBBKK..',
  '....KKKKKKKK....',
  '................',
];

const FRESH = {
  leaf: { K: P.forestDark, G: P.vineGreen, L: P.grassLight, D: P.forestDark },
  fossil: { K: P.soil, G: P.fossil, L: P.skyGlow, D: P.bark },
  scroll: { K: P.leather, G: P.marble, L: P.fossil, D: P.granite },
  lotus: { K: P.thornRed, G: P.vinePink, L: P.marble, D: P.banyan },
  fruit: { K: P.skyNight, B: P.water, G: P.vineGreen, L: '#ffffff', D: P.forestDark },
};
const COLLECTED = {
  leaf: { K: P.leather, G: P.vineGold, L: P.skyGlow, D: P.dirt },
  fossil: { K: P.soil, G: P.granite, L: P.marble, D: P.thorn },
  scroll: { K: P.leather, G: P.vineGold, L: P.skyGlow, D: P.bark },
  lotus: { K: P.leather, G: P.vineGold, L: P.skyGlow, D: P.dirt },
  fruit: { K: P.skyNight, B: P.vineGold, G: P.ember, L: P.skyGlow, D: P.dirt },
};
const GRIDS = { leaf: LEAF, fossil: FOSSIL, scroll: SCROLL, lotus: LOTUS, fruit: FRUIT };

/** Draws each kind once and shares it with the stylesheet. */
export function installLeafSprites() {
  const root = document.documentElement.style;
  for (const [kind, grid] of Object.entries(GRIDS)) {
    root.setProperty(`--sprite-${kind}`, `url(${toDataUrl(grid, FRESH[kind])})`);
    root.setProperty(`--sprite-${kind}-done`, `url(${toDataUrl(grid, COLLECTED[kind])})`);
  }
}
