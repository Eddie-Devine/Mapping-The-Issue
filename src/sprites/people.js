// Everyone else in the world. One body shape, recolored into Greek citizens, monks, and passersby.
// Real people only ever appear as these generic figures with a name label (content/cast.md).
import { PALETTE as P } from '../palette.js';

const HEAD = ['...hhhh...', '..hhhhhh..', '..hsssks..', '..hsssss..', '...bbbb...'];
const ARMS_DOWN = ['..cccccc..', '.sccccccs.', '.sccccccs.', '..cCCCCc..', '..cccccc..', '..cccccc..'];
const ARM_UP = ['..cccccc.s', '.scccccc.s', '.sccccccs.', '..cCCCCc..', '..cccccc..', '..cccccc..'];
const LEGS = {
  stand: ['...l..l...', '...l..l...', '...f..f...'],
  stride: ['..l....l..', '.l......l.', '.f......f.'],
  robe: ['..cccccc..', '..cccccc..', '...f..f...'],
  robeStride: ['..cccccc..', '.cccccccc.', '..f....f..'],
};

const make = (arms, legs) => [...HEAD, ...arms, ...legs];

export const PERSON_STAND = make(ARMS_DOWN, LEGS.stand);
export const PERSON_WALK = make(ARMS_DOWN, LEGS.stride);
export const PERSON_ARM_UP = make(ARM_UP, LEGS.stand);
export const ROBE_STAND = make(ARMS_DOWN, LEGS.robe);
export const ROBE_WALK = make(ARMS_DOWN, LEGS.robeStride);
export const ROBE_ARM_UP = make(ARM_UP, LEGS.robe);

const SKIN = ['#f2c9a0', '#d9a06b', '#a0714f', '#7c5136'];
const dress = (c, C, { skin = 0, hair = P.leather, beard, legs } = {}) => ({
  h: hair, s: SKIN[skin], k: P.skyNight, b: beard ?? SKIN[skin], c, C, l: legs ?? SKIN[skin], f: P.leather,
});

export const LOOKS = {
  // Greek citizens in chitons.
  citizenWhite: dress(P.marble, P.aegean, { hair: P.barkDark }),
  citizenBlue: dress(P.aegean, P.marble, { skin: 1, hair: P.leather }),
  citizenRed: dress(P.pottery, P.gold, { skin: 1, hair: P.skyNight }),
  citizenOlive: dress(P.olive, P.marble, { hair: P.bark }),
  citizenGold: dress(P.gold, P.pottery, { skin: 2, hair: P.skyNight }),
  pythagoras: dress(P.marble, P.gold, { hair: P.granite, beard: P.granite }),
  roman: dress(P.marble, P.thornRed, { hair: P.barkDark }),
  // India.
  jain: dress('#ffffff', P.marble, { skin: 2, hair: P.skyNight }),
  buddhist: dress(P.saffron, P.terracotta, { skin: 2, hair: SKIN[2] }),
  sherpa: dress(P.vineRed, P.skyNight, { skin: 2, hair: P.skyNight, legs: P.skyNight }),
  villager: dress(P.banyan, P.gold, { skin: 2, hair: P.skyNight }),
  // Modern.
  crowdGray: dress(P.granite, P.thorn, { hair: P.thorn, legs: P.thorn }),
  crowdLight: dress(P.marble, P.granite, { skin: 1, hair: P.leather, legs: P.granite }),
  crowdDark: dress(P.thorn, P.skyNight, { skin: 2, hair: P.skyNight, legs: P.skyNight }),
  megaphone: dress(P.thornRed, P.thorn, { hair: P.gold, legs: P.thorn }),
  host: dress(P.leather, P.skyNight, { hair: P.skyNight, legs: P.skyNight }),
  guest: dress(P.dusk, P.skyNight, { skin: 1, hair: P.bark, legs: P.skyNight }),
  rancher: dress(P.ember, P.leather, { hair: P.leather, legs: P.aegean }),
  flapper: dress(P.vinePink, P.thornRed, { hair: P.skyNight, legs: SKIN[0] }),
  strongman: dress(P.gold, P.leather, { hair: P.skyNight, beard: P.skyNight, legs: SKIN[0] }),
  fighterPlants: dress(P.vineGreen, P.forestDark, { hair: P.forestDark, legs: P.forestDark }),
  fighterMeat: dress(P.ember, P.emberDeep, { skin: 1, hair: P.leather, legs: P.leather }),
  fur: dress(P.fossil, P.bark, { skin: 1, hair: P.fossil, legs: P.bark }),
};

/** Lotus pose: for the levitating yogi. */
export const YOGI = [
  '....hhhhhh....',
  '...hhhhhhhh...',
  '...hssssssh...',
  '...hskssksh...',
  '...hssssssh...',
  '.....ssss.....',
  '....cccccc....',
  '...sccccccs...',
  '..ss.cccc.ss..',
  '..s.cccccc.s..',
  '.lllllllllll..',
  'llllllllllllll',
  '.ffff....ffff.',
];
export const YOGI_LOOK = { h: P.skyNight, s: SKIN[2], k: P.skyNight, c: P.saffron, l: SKIN[2], f: SKIN[3] };

/** Crouching over a bone. */
export const HOMININ = [
  '...HHHH.....',
  '..HHHHHH....',
  '..HHsssH....',
  '..HHskss....',
  '...Hssss....',
  '..HHHHHHH...',
  '.HHHHHHHHss.',
  '.HHHHHHH..s.',
  '.HHHHHHH....',
  '..HHHHH.....',
  '..HHH.HH....',
  '.ssHH.Hss...',
];
export const HOMININ_LOOK = { H: P.bark, s: P.barkLight, k: P.skyNight };
export const HOMININ_FIRELIT = { H: P.dirt, s: P.skyPeach, k: P.skyNight };
