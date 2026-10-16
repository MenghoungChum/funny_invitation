/**
 * FloatingEmojis.jsx — emoji អណែលស្រាលៗ ខាងក្រោយលិខិត (decoration only)
 * aria-hidden — គ្រាន់តែតុបតែង។
 */

import { useMemo } from "react";
import { prefersReducedMotion } from "../motion";

const EMOJIS = ["🍚", "🍛", "🍜", "😄", "😋", "✨", "🥢", "🍲"];

export default function FloatingEmojis() {
  const items = useMemo(() => {
    if (prefersReducedMotion()) return [];
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[i % EMOJIS.length],
      left: 4 + ((i * 17) % 92),
      bottom: -4 + ((i * 23) % 40),
      duration: 11 + ((i * 31) % 9),
      delay: (i * 1.4) % 10,
      size: 1.2 + ((i * 5) % 10) / 10,
    }));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute"
          style={{
            left: `${it.left}%`,
            bottom: `${it.bottom}vh`,
            fontSize: `${it.size}rem`,
            animation: `float-up ${it.duration}s linear ${it.delay}s infinite`,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}
