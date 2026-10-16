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
