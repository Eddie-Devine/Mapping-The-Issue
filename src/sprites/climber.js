// The Climber: the visitor's avatar, plus the red-jacket recolor used for Alex Honnold's free solo.
// A generic figure with a helmet and chalk bag, not a likeness of anyone.
import { PALETTE as P } from '../palette.js';

const look = (jacket, shade) => ({
  H: P.skyGlow, h: P.fossil, J: jacket, j: shade, s: '#f2c9a0', K: P.skyNight, B: P.marble, T: P.leather, W: '#ffffff',
});

export const CLIMBER_COLORS = {
  green: look(P.grass, P.forestDark),
  orange: look(P.ember, P.emberDeep),
  // A secret: unlocked by an Easter egg.
  gold: { ...look(P.vineGold, P.dirt), H: P.skyGlow, h: P.gold },
};
export const HONNOLD_COLORS = { ...look(P.vineRed, P.emberDeep), H: P.marble, h: P.granite };

/** Seen from behind on the wall: right hand reaching up. Flip it for the other hand. */
export const CLIMB = [
  '...........ss...',
  '...........ss...',
  '.....HHHH..JJ...',
  '....HHHHHH.JJ...',
  '....HhHHHHJJ....',
  '.....HHHHJJ.....',
  '...JJJJJJJJ.....',
  '..JJJJJJJJJ.....',
  '.ss.JjJJJjB.....',
  '.ss.JjJJJjB.....',
  '....TTTTTT......',
  '....TTT.TTT.....',
  '...TTT...TT.....',
  '...TT....TT.....',
  '..KKK.....TT....',
  '..........KK....',
];

/** Facing right, feet on the ground. */
export const STAND = [
  '.....HHHH.......',
  '....HHHHHH......',
  '....HHHhHHH.....',
  '.....sssss......',
  '.....ssKsK......',
  '.....sssss......',
  '....JJJJJJ......',
  '...JJJJJJJJ.....',
  '...JjJJJJjJ.....',
  '...ssJJJJss.....',
  '...B.JJJJ.......',
  '.....TTTT.......',
  '.....TT.TT......',
  '.....TT.TT......',
  '.....TT.TT......',
  '....KKK.KKK.....',
];

export const WALK = [...STAND.slice(0, 12), '.....TTTT.......', '....TT..TT......', '...TT....TT.....', '...KK....KKK....'];

/** Chalking up: hands together in front. */
export const CHALK = [...STAND.slice(0, 7), '...JJJJJJJJ.....', '...JjJJJJjJ.....', '....JsssJ.W.....', '...B.JJJJ...W...', ...STAND.slice(11)];

/** Fist in the air at the top of the wall. */
export const FIST_PUMP = [
  '...........ss...',
  '...........ss...',
  '.....HHHH..JJ...',
  '....HHHHHH.JJ...',
  '....HHHhHHJJ....',
  '.....sssssJ.....',
  '.....ssKsK......',
  '.....sssss......',
  '....JJJJJJJ.....',
  '...sJJJJJJ......',
  '...sJjJJjJ......',
  '.....TTTT.......',
  '.....TT.TT......',
  '.....TT.TT......',
  '.....TT.TT......',
  '....KKK.KKK.....',
];

/** Sitting on a branch, looking out: the canopy's closing image. */
export const SIT = [
  '.....HHHH.......',
  '....HHHHHH......',
  '....HHHhHHH.....',
  '.....sssss......',
  '.....ssKsK......',
  '.....sssss......',
  '....JJJJJJ......',
  '...JJJJJJJJ.....',
  '...JjJJJJjs.....',
  '...JJJJJJss.....',
  '....TTTTTTTT....',
  '....TTTTTTTT....',
  '..........TT....',
  '..........TT....',
  '.........KKK....',
];
