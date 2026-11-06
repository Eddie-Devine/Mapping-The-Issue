// Remembers which leaves and signposts the visitor has opened. Storage can be blocked (private
// browsing, for example), so every access is guarded and the site works fine without it.
const KEY = 'roots-and-branches-progress';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(saved)) return saved;
  } catch {
    // Blocked or corrupt storage just means starting fresh.
  }
  return [];
}

const opened = new Set(load());
const listeners = new Set();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...opened]));
  } catch {
    // Progress lasts until the page closes.
  }
}

export const progress = {
  has: (id) => opened.has(id),
  add(id) {
    if (opened.has(id)) return;
    opened.add(id);
    save();
    for (const listener of listeners) listener(id);
  },
  /** Counts how many of the given IDs have been opened. */
  count: (ids) => ids.filter((id) => opened.has(id)).length,
  /** Calls `listener(id)` whenever something new is opened. */
  subscribe(listener) {
    listeners.add(listener);
  },
};
