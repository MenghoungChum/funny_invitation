/**
 * Countdown.jsx — ការរាប់ថយក្រោយទៅថ្ងៃកម្មវិធី (CONFIG.event.dateISO)
 * • លេខជាភាសាខ្មែរ · គោរព AnimationToggle (pop-in)
 * • ប្រកាសតាម sr-only live region តែពេល "ថ្ងៃ/ម៉ោង" ប្តូរ (កុំរំខានរាល់វិនាទី)
 */

import { CONFIG } from "../config";
import useCountdown from "../hooks/useCountdown";

const KH_DIGITS = "០១២៣៤៥៦៧៨៩";

function toKhmer(value) {
  return String(value)
    .padStart(2, "0")
    .replace(/[0-9]/g, (d) => KH_DIGITS[Number(d)]);
}

function Unit({ value, label, delay }) {
  return (
    <div
      className="animate-pop-in flex min-w-[3.75rem] flex-col items-center rounded-lg border border-gold/50 bg-paper/80 px-2 py-2"
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <span className="font-display text-xl font-bold text-ceremonial-dark sm:text-2xl">
        {toKhmer(value)}
      </span>
      <span className="mt-0.5 text-[0.7rem] font-semibold text-ink-soft">{label}</span>
    </div>
  );
}

export default function Countdown({ className = "" }) {
  const { days, hours, minutes, seconds, done } = useCountdown(CONFIG.event.dateISO, {
    interval: 1000,
  });

  // ខ្សែអក្សរប្រកាសប្តូរតែពេល ថ្ងៃ/ម៉ោង ប្តូរ (មិនរំខានរាល់វិនាទី)
  const coarse = done
    ? "កម្មវិធីបានចាប់ផ្តើមហើយ!"
    : `នៅសល់ ${days} ថ្ងៃ និង ${hours} ម៉ោង មុនកម្មវិធី`;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Unit value={days} label="ថ្ងៃ" delay={0} />
        <Unit value={hours} label="ម៉ោង" delay={0.05} />
        <Unit value={minutes} label="នាទី" delay={0.1} />
        <Unit value={seconds} label="វិនាទី" delay={0.15} />
      </div>
      <p className="sr-only" aria-live="polite">
        {coarse}
      </p>
    </div>
  );
}
