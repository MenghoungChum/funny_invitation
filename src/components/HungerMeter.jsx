/**
 * HungerMeter.jsx — របារវាស់ "កម្រិតឃ្លាន" កំសាន្ត
 * • បំពេញបន្តិចម្តងៗពេលចូល viewport (useInView) — CSS transition ធ្វើចលនា
 * • គោរព AnimationToggle — បិទចលនា ឬនៅក្រៅ viewport → បង្ហាញតម្លៃភ្លាម
 * • role="progressbar" ជាមួយ aria attributes (តម្លៃពិត)
 */

import useInView from "../hooks/useInView";
import { useAnimationsEnabled } from "../motion";

export default function HungerMeter({
  value = 92,
  label = "កម្រិតឃ្លានរបស់គណៈកម្មការ",
  className = "",
}) {
  const [ref, inView] = useInView({ once: true, threshold: 0.3 });
  const animationsOn = useAnimationsEnabled();
  const clamped = Math.max(0, Math.min(100, value));

  // គ្មាន state — គណនាក្នុង render, ទុក CSS transition ជាអ្នក animate
  const pct = Math.max(0, Math.min(100, animationsOn && !inView ? 0 : clamped));
  const color = pct > 75 ? "#9e1b1b" : pct > 45 ? "#b8860b" : "#1f7a3d";

  return (
    <div ref={ref} className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="font-display text-sm font-bold" style={{ color }}>
          {clamped}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={label}
        className="h-3.5 w-full overflow-hidden rounded-full border border-gold/50 bg-paper-dark"
      >
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <p className="mt-1 text-xs text-ink-soft">
        {clamped >= 90 ? "គណៈកម្មការនឹងផ្ទុះ! មកញ៉ាំលឿនៗ 🍚" : "កំពុងឃ្លានបន្តិចម្តងៗ… 😋"}
      </p>
    </div>
  );
}
