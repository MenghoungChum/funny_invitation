/**
 * CryingScreen.jsx — ផ្ទៃបដិសេធ (crying emoji rain + សារ)
 * "អូហូ! មិត្តសម្លាញ់ចិត្តដាច់ម្ល៉េះ! ក្រពះយើងខូចចិត្តហើយ! 💔"
 * មានប៊ូតុង "ត្រឡប់ទៅលិខិតវិញ" និង replay 🔁 (respect mute)។
 */

import { useMemo } from "react";
import { playFunnySound } from "../audio";
import { prefersReducedMotion } from "../motion";

function EmojiRain() {
  const drops = useMemo(() => {
    const count = 22;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: (i * (100 / count) + ((i * 37) % 9)) % 100,
      duration: 3.4 + ((i * 13) % 20) / 10,
      delay: ((i * 29) % 32) / 10,
      size: 1.3 + ((i * 7) % 12) / 10,
      emoji: i % 5 === 0 ? "😢" : i % 3 === 0 ? "💔" : "😭",
    }));
  }, []);

  if (prefersReducedMotion()) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {drops.map((d) => (
        <span
          key={d.id}
          className="absolute -top-10"
          style={{
            left: `${d.left}%`,
            fontSize: `${d.size}rem`,
            animation: `emoji-fall ${d.duration}s linear ${d.delay}s infinite`,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}

export default function CryingScreen({ onReturn }) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4">
      <EmojiRain />

      <section className="paper-sheet official-border animate-letter-rise relative z-10 mx-auto max-w-xl rounded-sm p-8 text-center sm:p-12">
        <p className="mb-4 text-6xl" aria-hidden="true">
          😭💔😭
        </p>
        <h1 className="mb-4 font-display text-xl leading-relaxed text-ceremonial sm:text-2xl">
          អូហូ! មិត្តសម្លាញ់ចិត្តដាច់ម្ល៉េះ! ក្រពះយើងខូចចិត្តហើយ! 💔
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-ink-soft">
          អត់ជាអីទេ… យើងនៅតែមិត្តភក្តិគ្នា! ប៉ុន្តែចង្ក្រាននៅរង់ចាំអ្នកណាមកញ៉ាំជំនួស 😋
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReturn}
            className="btn-wiggle min-h-12 rounded-lg border-2 border-gold bg-ceremonial px-6 py-3 font-semibold text-paper-light shadow-md transition-colors hover:bg-ceremonial-dark"
          >
            ត្រឡប់ទៅលិខិតវិញ
          </button>
          <button
            type="button"
            onClick={() => playFunnySound()}
            aria-label="លេងសំឡេងកំសាន្តម្តងទៀត"
            title="លេងសំឡេងម្តងទៀត"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold/70 bg-paper-light text-xl shadow transition-transform hover:scale-110 active:scale-95"
          >
            <span aria-hidden="true">🔁</span>
          </button>
        </div>
      </section>
    </main>
  );
}
