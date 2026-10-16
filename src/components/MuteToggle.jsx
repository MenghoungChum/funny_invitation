/**
 * MuteToggle.jsx — ប៊ូតុងបិទ/បើកសំឡេង 🔊 / 🔇 (fixed corner)
 * ចងចាំជម្រើសក្នុង localStorage (តាមរយៈ audio.js)។
 */

import { useState } from "react";
import { isMuted, loadMutedPreference, setMuted } from "../audio";

export default function MuteToggle() {
  const [muted, setMutedState] = useState(() => loadMutedPreference());

  const toggle = () => {
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={muted}
      aria-label={muted ? "បើកសំឡេងកំសាន្ត" : "បិទសំឡេងកំសាន្ត"}
      title={muted ? "បើកសំឡេង" : "បិទសំឡេង"}
      className="no-print fixed right-3 bottom-3 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold/70 bg-paper-light/95 text-xl shadow-lg transition-transform hover:scale-110 active:scale-95 sm:right-5 sm:bottom-5"
    >
      <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
    </button>
  );
}
