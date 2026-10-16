/**
 * FloatingFoods.jsx — អាហារ emoji អណែលស្រាលៗនៅខាងក្រោយ (decorative)
 * • គោរព AnimationToggle (useAnimationsEnabled)
 * • កំណត់ចំនួន particle (≤16 លើទូរស័ព្ទ / ≤30 លើ desktop)
 * • aria-hidden, no-print
 */

import { useMemo } from "react";
import { useAnimationsEnabled } from "../motion";

const FOODS = ["🍚", "🍛", "🍜", "🍲", "🥢", "🍗", "🍡", "🥟", "🍤", "✨"];

function particleCount(density) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const cap = isMobile ? 16 : 30;
  return Math.max(0, Math.min(cap, Math.round(10 * density)));
}

export default function FloatingFoods({ density = 1, className = "" }) {
  const animationsOn = useAnimationsEnabled();

  const items = useMemo(() => {
    if (!animationsOn) return [];
    const count = particleCount(density);
    if (count === 0) return [];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: FOODS[i % FOODS.length],
      left: (i * (100 / count) + ((i * 37) % 11)) % 100,
      size: 0.9 + ((i * 7) % 9) / 10,
      duration: 12 + ((i * 13) % 10),
      delay: (i * 0.9) % 11,
    }));
  }, [animationsOn, density]);

  if (items.length === 0) return null;

  return (
    <div
      className={`no-print pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute"
          style={{
            left: `${it.left}%`,
            bottom: "-4vh",
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
