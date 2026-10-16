/**
 * motion.js — ជំនួយការ animation ទាក់ទង prefers-reduced-motion
 *
 * បន្ថែម (upgrade): store ដែលអាច subscribe បាន — ជម្រើសអ្នកប្រើ (AnimationToggle)
 * ឬតាម OS preference។ React ប្រើ useSyncExternalStore ដើម្បី re-render ពេលប្តូរ។
 * ព្រមទាំង set data-attributes លើ <html> សម្រាប់ CSS (animations off / tab hidden)។
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "funny-invitation-animations";
const QUERY = "(prefers-reduced-motion: reduce)";

/** null = តាម OS · true = បង្ខំបើក · false = បង្ខំបិទ */
let userOverride = loadOverride();
let osReduced = detectOsReduced();
const listeners = new Set();

function loadOverride() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {
    /* localStorage អាចត្រូវបាន block — អត់ជាកង្វល់ */
  }
  return null;
}

function detectOsReduced() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(QUERY).matches
  );
}

function effectiveEnabled() {
  return userOverride === null ? !osReduced : userOverride;
}

function applyDom() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.animations = effectiveEnabled() ? "on" : "off";
}

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return effectiveEnabled();
}

function getServerSnapshot() {
  return true;
}

// តាមដានការផ្លាស់ប្តូរ OS preference
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const mql = window.matchMedia(QUERY);
  const onMediaChange = (event) => {
    osReduced = event.matches;
    applyDom();
    emit();
  };
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", onMediaChange);
  } else if (typeof mql.addListener === "function") {
    mql.addListener(onMediaChange);
  }
}

// ផ្អាក CSS animation ពេល tab លាក់ (data-visibility="hidden")
if (typeof document !== "undefined") {
  const syncVisibility = () => {
    document.documentElement.dataset.visibility = document.hidden ? "hidden" : "visible";
  };
  syncVisibility();
  document.addEventListener("visibilitychange", syncVisibility);
}

applyDom();

/** ត្រឡប់ true ប្រសិនបើគួរកាត់បន្ថយចលនា (imperative — សម្រាប់ event handlers) */
export function prefersReducedMotion() {
  return !effectiveEnabled();
}

/** តម្លៃបច្ចុប្បន្ន៖ តើចលនាត្រូវបានបើក? */
export function animationsEnabled() {
  return effectiveEnabled();
}

/** កំណត់ជម្រើសអ្នកប្រើ (បង្ខំបើក/បិទ) + persist */
export function setAnimationsEnabled(enabled) {
  userOverride = Boolean(enabled);
  try {
    localStorage.setItem(STORAGE_KEY, userOverride ? "on" : "off");
  } catch {
    /* ignore */
  }
  applyDom();
  emit();
}

/** លុបជម្រើសអ្នកប្រើ → ត្រឡប់ទៅតាម OS */
export function resetAnimationsPreference() {
  userOverride = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  applyDom();
  emit();
}

/** hook: ត្រឡប់ true ប្រសិនបើគួរកាត់បន្ថយចលនា (reactive) */
export function useReducedMotion() {
  return !useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** hook: ត្រឡប់ true ប្រសិនបើចលនាត្រូវបានបើក (reactive) */
export function useAnimationsEnabled() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
