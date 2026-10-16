/**
 * audio.js — សំឡេងកំសាន្ត (funny sound)
 *
 * យើងសាកល្បងចាក់ assets/sounds/funny.mp3 ជាមុនសិន។
 * បើឯកសារអត់មាន / ចាក់មិនបាន / ត្រូវ browser block → ប្រើ Web Audio API
 * ធ្វើសំឡេង "sad trombone / womp womp" ជំនួស។
 * បើប្រព័ន្ធអត់គាំទ្រសំឡេងទាំងពីរ → ប្រាប់ត្រង់ៗ ដោយគ្មាន error។
 */

import { CONFIG } from "./config";

let muted = false;
let audioEl = null;
let mp3Broken = false;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = Boolean(value);
  try {
    localStorage.setItem("funny-invitation-muted", muted ? "1" : "0");
  } catch {
    /* localStorage អាចត្រូវបាន block — អត់ជាកង្វល់ */
  }
}

/** អានជម្រើស mute ពី memory (localStorage ជាជម្រើស) */
export function loadMutedPreference() {
  try {
    const stored = localStorage.getItem("funny-invitation-muted");
    if (stored !== null) muted = stored === "1";
  } catch {
    /* ignore */
  }
  return muted;
}

function getAudioEl() {
  if (mp3Broken) return null;
  if (!audioEl) {
    try {
      audioEl = new Audio(CONFIG.sound.file);
      audioEl.preload = "auto";
      audioEl.addEventListener("error", () => {
        mp3Broken = true;
      });
    } catch {
      mp3Broken = true;
      return null;
    }
  }
  return audioEl;
}

/** ចាក់សំឡេងកំសាន្ត — ស្ងាត់ៗ fallback ទៅ Web Audio ប្រសិនបើ mp3 អត់ដំណើរការ */
export function playFunnySound() {
  if (muted) return;
  const el = getAudioEl();
  if (el) {
    try {
      el.currentTime = 0;
      const p = el.play();
      if (p && typeof p.then === "function") {
        p.catch(() => {
          playSadTrombone();
        });
        return;
      }
      return;
    } catch {
      /* fall through to Web Audio */
    }
  }
  try {
    playSadTrombone();
  } catch {
    /* បើទាំងនេះបរាជ័យទៀត → គ្រាន់តែ skip សំឡេង ដោយគ្មាន error */
  }
}

/**
 * "womp womp" ពី Web Audio API — សំឡេងស្រពោនចុះ ៤ កាន់ បន្ទាប់ដោយ "womp" វែងមួយ។
 * ប្រើបានគ្រប់ browser ដែលគាំទ្រ AudioContext។
 */
function playSadTrombone() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  const start = ctx.currentTime + 0.02;
  const step = 0.26;
  // G4 → F4 → E♭4 → C4 (ចុះស្រពោន)
  const notes = [392.0, 349.23, 311.13, 261.63];

  notes.forEach((freq, i) => {
    const t = start + i * step;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freq * 0.93, t + step * 0.9);
    filter.type = "lowpass";
    filter.frequency.value = 1100;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + step * 0.95);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + step);
  });

  // "womp" ចុងក្រោយ — ស្រពោនចុះវែង
  const t = start + notes.length * step + 0.04;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(233.08, t);
  osc.frequency.exponentialRampToValueAtTime(98, t + 0.7);
  filter.type = "lowpass";
  filter.frequency.value = 900;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.22, t + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  osc.start(t);
  osc.stop(t + 0.8);

  window.setTimeout(() => {
    try {
      ctx.close();
    } catch {
      /* ignore */
    }
  }, 2500);
}

/* ---------------------- UI effect sounds (upgrade pack) ------------------- */

/** AudioContext រួមមួយ (lazy) — ជៀសវាងបង្កើត context ថ្មីរាល់សំឡេង */
let sharedCtx = null;

function getSharedCtx() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedCtx) {
    try {
      sharedCtx = new AudioCtx();
    } catch {
      return null;
    }
  }
  if (sharedCtx.state === "suspended" && typeof sharedCtx.resume === "function") {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

/** បង្កើត tone មួយ (oscillator + gain envelope) */
function blip(ctx, { type = "sine", from = 440, to = from, start = 0, dur = 0.12, gain = 0.15, filter = 0 }) {
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  if (to !== from) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t0 + dur);
  }
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + Math.min(0.02, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  let tail = osc;
  if (filter > 0) {
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = filter;
    osc.connect(f);
    tail = f;
  }
  tail.connect(g);
  g.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

const EFFECT_PLAYERS = {
  pop(ctx) {
    blip(ctx, { type: "sine", from: 320, to: 640, dur: 0.1, gain: 0.18 });
  },
  thud(ctx) {
    blip(ctx, { type: "triangle", from: 170, to: 60, dur: 0.22, gain: 0.26, filter: 900 });
  },
  ding(ctx) {
    blip(ctx, { type: "sine", from: 880, to: 880, dur: 0.36, gain: 0.14 });
    blip(ctx, { type: "sine", from: 1320, to: 1320, dur: 0.3, gain: 0.06, start: 0.02 });
  },
  sparkle(ctx) {
    [1046.5, 1318.5, 1568, 2093].forEach((f, i) =>
      blip(ctx, { type: "sine", from: f, to: f, dur: 0.12, gain: 0.09, start: i * 0.06 })
    );
  },
  gulp(ctx) {
    blip(ctx, { type: "sine", from: 340, to: 110, dur: 0.18, gain: 0.2, filter: 1200 });
  },
  success(ctx) {
    [523.25, 659.25, 783.99].forEach((f, i) =>
      blip(ctx, { type: "triangle", from: f, to: f, dur: 0.18, gain: 0.16, start: i * 0.11 })
    );
  },
  heartbreak(ctx) {
    blip(ctx, { type: "sawtooth", from: 420, to: 150, dur: 0.5, gain: 0.16, filter: 1400 });
  },
};

/**
 * ចាក់សំឡេងផ្ទៃ UI៖ "pop" · "thud" · "ding" · "sparkle" · "gulp" · "success" · "heartbreak"
 * គោរព mute។ បើគ្មាន Web Audio → ស្ងាត់ៗ ដោយគ្មាន error។
 */
export function playEffect(kind = "pop") {
  if (muted) return;
  const ctx = getSharedCtx();
  if (!ctx) return;
  const player = EFFECT_PLAYERS[kind] || EFFECT_PLAYERS.pop;
  try {
    player(ctx);
  } catch {
    /* skip សំឡេង ដោយគ្មាន error */
  }
}
