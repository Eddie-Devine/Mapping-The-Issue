// The ambient animals from content/cast.md.
import { PALETTE as P } from '../palette.js';

export const SHEEP = ['..wwwwww....', '.wwwwwwwwkk.', 'wwwwwwwwwkkk', 'wwwwwwwwwkk.', '.wwwwwwww...', '.k.k..k.k...', '.k.k..k.k...'];
export const SHEEP_LOOK = { w: '#cfc7b6', k: P.skyNight };

export const COW = [
  '............hh..',
  '.bbbbwwwbbbbbbb.',
  'bbwwwwwbbbbbbkb.',
  'bwwwbbbbwwwbbbbp',
  'bwwbbbbbbwwwbbbp',
  'bbbbbbbwwwwbbb..',
  '.bbbbbbbbbbbb...',
  '.bb.bb...bb.bb..',
  '.bb.bb...bb.bb..',
];
export const COW_LOOK = { b: P.leather, w: P.marble, h: P.fossil, k: P.skyNight, p: P.vinePink };

export const DEER = [
  '.......a.a..',
  '.......aaa..',
  '.......bbbb.',
  '.......bkbbn',
  '.......bbb..',
  '.bbbbbbbbb..',
  'bbwbbwbbbb..',
  'bbbbbbbbb...',
  '.b.b...b.b..',
  '.b.b...b.b..',
  '.k.k...k.k..',
];
export const DEER_LOOK = { a: P.fossil, b: P.barkLight, w: P.marble, k: P.skyNight, n: P.skyNight };

export const PEACOCK = [
  '..gbg.........',
  '.gbybg........',
  'gbygybg....t..',
  'bygbgyb....bb.',
  'gybgbygb...bk.',
  'bgygbygbg..bbo',
  'gybgbygbgb.bb.',
  'bgbybgbgbbbbb.',
  '.gbgbgbbbbbb..',
  '.....bbbbb....',
  '......o.o.....',
  '......o.o.....',
];
export const PEACOCK_LOOK = { g: P.forest, b: P.aegean, y: P.gold, t: P.vineGreen, k: P.skyNight, o: P.saffron };

export const TIGER_WALK = [
  '...............oo..',
  '..............ooooo',
  '.k.ooKoKoKoKoooakok',
  'k.oooKoKoKoKoooooow',
  '..oooKoKoKoKooooow.',
  '..ooooooooooooooo..',
  '..oo.oo.....oo.oo..',
  '..oo.oo.....oo.oo..',
];
export const TIGER_REST = [
  '...............oo...',
  '..............ooooo.',
  '.....ooKoKoKoooakok.',
  'k...oooKoKoKoooooow.',
  '.kkoooooooooooooow..',
  '...oooooooooooooooww',
];
export const TIGER_LOOK = { o: P.saffron, K: P.skyNight, k: P.skyNight, a: '#ffffff', w: P.marble };

export const BISON = [
  '.....kkkkk......',
  '...kkkkkkkkkk...',
  '.bbkkkkkkkkkkkk.',
  'bbbbkkkkkkkkkwkk',
  'bbbbbkkkkkkkkkkk',
  'bbbbbbkkkkkkkkk.',
  '.bbbbbbbbbkkkk..',
  '.bb.bb...kk.kk..',
  '.bb.bb...kk.kk..',
];
export const BISON_LOOK = { b: P.bark, k: P.leather, w: P.marble };

export const ELK = [
  'a.a.a...........',
  '.aaa.a..........',
  '..aaa...........',
  '...kkk..........',
  '...kkkk.........',
  '...kk...........',
  '...kkk..........',
  '...kkkkkkkkkkk..',
  '....kkkkkkkkkkk.',
  '....kkkkkkkkkkk.',
  '....kk.kk...kkk.',
  '....k...k...k.k.',
  '....k...k...k.k.',
];
export const ELK_LOOK = { a: P.skyNight, k: P.skyNight };

export const FISH = ['.ffff..f', 'fkffffff', 'ffffff.f', '.ffff...'];
export const FISH_LOOK = { f: P.vinePink, k: P.skyNight };
export const SHRIMP = ['..sss...', '.sssss.a', 'skssssaa', '.ss.ss.a', '.s..s...'];
export const SHRIMP_LOOK = { s: P.pottery, k: P.skyNight, a: P.vinePink };
export const OCTOPUS = ['..ooooo..', '.ooooooo.', '.okoooko.', '.ooooooo.', '..ooooo..', '.o.o.o.o.', 'o..o.o..o'];
export const OCTOPUS_LOOK = { o: P.dusk, k: '#ffffff' };

export const HAWK_UP = ['ww.......ww', '.wwb...bww.', '..wwbbbww..', '....bbbk...', '.....bb....'];
export const HAWK_DOWN = ['...........', '...bbbbb...', 'wwwwbbbwwww', '.www.bk.www', '.....bb....'];
export const HAWK_LOOK = { w: P.leather, b: P.bark, k: P.skyNight };

export const BIRD_UP = ['k...k', '.k.k.', '..k..'];
export const BIRD_DOWN = ['.....', '.kkk.', 'k.k.k'];
export const BIRD_LOOK = { k: P.skyNight };

export const BUTTERFLY_OPEN = ['ww.ww', 'wwkww', '.wkw.', 'w.k.w'];
export const BUTTERFLY_SHUT = ['.w.w.', '.wkw.', '..k..', '..k..'];
export const butterflyLook = (w) => ({ w, k: P.skyNight });

export const AUK = ['.kkk..', 'kkkwk.', 'kkwww.', '.www..'];
export const AUK_LOOK = { k: P.skyNight, w: P.marble };
