// Tiny chiptune sound effects made in code with the Web Audio API, so there are no audio files.
// Everything is silent unless the visitor turns sound on in Settings.
import { settings } from '../world/settings.js';

let context = null;

/** Browsers only allow audio after the visitor has interacted, so it starts on first use. */
function audio() {
  if (!settings.get('sound')) return null;
  try {
    context ??= new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume();
    return context;
  } catch {
    return null;
  }
}

/** One short note: a square, triangle, or sine wave that fades out. */
function note(ctx, { frequency, start = 0, length = 0.1, type = 'square', volume = 0.06, slideTo }) {
  const time = ctx.currentTime + start;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, time);
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, time + length);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(time);
  oscillator.stop(time + length + 0.02);
}

/** White noise swept through a filter: the elevator's rush of air. */
function noise(ctx, { length, from, to, volume }) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * length), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.4;
  filter.frequency.setValueAtTime(from, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + length);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + length * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + length);
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start();
}

export const sfx = {
  /** A soft tick as dialog text types out. */
  blip() {
    const ctx = audio();
    if (ctx) note(ctx, { frequency: 880 + Math.random() * 120, length: 0.03, volume: 0.025 });
  },
  /** Collecting a leaf: two bright notes. */
  chime() {
    const ctx = audio();
    if (!ctx) return;
    note(ctx, { frequency: 988, length: 0.12, type: 'triangle', volume: 0.08 });
    note(ctx, { frequency: 1319, start: 0.09, length: 0.25, type: 'triangle', volume: 0.08 });
  },
  /** The time-warp elevator taking off. */
  whoosh() {
    const ctx = audio();
    if (!ctx) return;
    noise(ctx, { length: 3.6, from: 200, to: 3200, volume: 0.12 });
    note(ctx, { frequency: 110, slideTo: 440, length: 3.4, type: 'triangle', volume: 0.05 });
  },
  /** Landing at 1806. */
  land() {
    const ctx = audio();
    if (!ctx) return;
    note(ctx, { frequency: 523, length: 0.12, volume: 0.05 });
    note(ctx, { frequency: 659, start: 0.1, length: 0.12, volume: 0.05 });
    note(ctx, { frequency: 784, start: 0.2, length: 0.3, volume: 0.05 });
  },
  /** The VS screen's round bell. */
  bell() {
    const ctx = audio();
    if (!ctx) return;
    for (const [frequency, volume] of [[1046, 0.07], [2093, 0.03], [3136, 0.015]]) {
      note(ctx, { frequency, length: 0.9, type: 'sine', volume });
    }
  },
  /** PRESS START, and turning sound on: a little rising jingle. */
  start() {
    const ctx = audio();
    if (!ctx) return;
    [523, 659, 784, 1046].forEach((frequency, i) => note(ctx, { frequency, start: i * 0.07, length: 0.1, volume: 0.05 }));
  },
};
