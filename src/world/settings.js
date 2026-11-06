// The visitor's settings. Saved in this browser when storage is allowed, and fine without it.
const KEY = 'roots-and-branches-settings';

const DEFAULTS = {
  sound: false, // DESIGN.md §8: sound is always off until the visitor turns it on.
  motion: null, // null follows the device's reduced-motion setting; 'on' or 'off' overrides it.
  shortcuts: true,
  climber: 'green',
  goldUnlocked: false,
  legendSeen: false,
};

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return { ...DEFAULTS };
  }
}

const values = load();
const listeners = new Set();

export const settings = {
  get: (name) => values[name],
  set(name, value) {
    if (values[name] === value) return;
    values[name] = value;
    try {
      localStorage.setItem(KEY, JSON.stringify(values));
    } catch {
      // The setting lasts until the page closes.
    }
    for (const listener of listeners) listener(name, value);
  },
  subscribe(listener) {
    listeners.add(listener);
  },
};
