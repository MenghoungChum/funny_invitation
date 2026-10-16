/**
 * AnimationToggle.jsx — ប៊ូតុងបិទ/បើកចលនា 🎬 / 🚫 (fixed corner)
 * តម្លៃដើមយកតាម OS (prefers-reduced-motion)។ ចងចាំជម្រើសក្នុង localStorage។
 */

import { setAnimationsEnabled, useAnimationsEnabled } from "../motion";

export default function AnimationToggle() {
  const enabled = useAnimationsEnabled();

  return (
    <button
      type="button"
      onClick={() => setAnimationsEnabled(!enabled)}
      aria-pressed={enabled}
      aria-label={enabled ? "បិទចលនាចល័ត" : "បើកចលនាចល័ត"}
      title={enabled ? "បិទចលនា" : "បើកចលនា"}
      className="no-print fixed left-3 bottom-3 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold/70 bg-paper-light/95 text-xl shadow-lg transition-transform hover:scale-110 active:scale-95 sm:left-5 sm:bottom-5"
    >
      <span aria-hidden="true">{enabled ? "🎬" : "🚫"}</span>
    </button>
  );
}
