/**
 * Envelope.jsx — ស្រោមសំបុត្របិទជិត + ត្រាទិញ (first screen)
 * ចុច "បើកលិខិតអញ្ជើញ ✉️" → flap បើក (~1s) → App ប្តូរទៅ letter។
 * ប្រសិនបើ prefers-reduced-motion → រំលង animation ចុចភ្លាមៗ។
 */

import { useEffect, useState } from "react";
import { playEffect } from "../audio";
import useSecretTaps from "../hooks/useSecretTaps";
import { prefersReducedMotion, useAnimationsEnabled } from "../motion";
import FloatingFoods from "./FloatingFoods";
import { showToast } from "../toastBus";
import TummyMascot from "./TummyMascot";
import WaxSeal from "./WaxSeal";

const BURST_EMOJIS = ["🍜", "🍚", "🍛", "🥟", "🍤", "🍡"];

function FoodBurst() {
  const drops = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    left: (i * 37) % 100,
    size: 1.4 + (i % 5) * 0.3,
    duration: 2.4 + (i % 6) * 0.2,
    delay: (i % 8) * 0.12,
    emoji: BURST_EMOJIS[i % BURST_EMOJIS.length],
  }));
  return (
    <div className="no-print pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {drops.map((d) => (
        <span
          key={d.id}
          className="absolute -top-10"
          style={{
            left: `${d.left}%`,
            fontSize: `${d.size}rem`,
            animation: `emoji-fall ${d.duration}s linear ${d.delay}s 1`,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}

export default function Envelope({ onOpen, opening }) {
  const [brokenSeal, setBrokenSeal] = useState(false);
  const [burst, setBurst] = useState(false);
  const animationsOn = useAnimationsEnabled();

  const onSecretTap = useSecretTaps(5, () => {
    setBurst(true);
    playEffect("sparkle");
    showToast("រកឃើញអាថ៌កំបាំង! ចំណីឥតគិតថ្លៃមួយចាន 🍜 (សន្យាលេង)", {
      kind: "success",
      duration: 5000,
    });
    window.setTimeout(() => setBurst(false), 2800);
  });

  const handleSealTap = () => {
    playEffect("pop");
    onSecretTap();
  };

  useEffect(() => {
    if (opening && !prefersReducedMotion()) {
      const t = window.setTimeout(() => setBrokenSeal(true), 260);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [opening]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <FloatingFoods density={0.8} />
      {burst ? <FoodBurst /> : null}

      <p className="mb-3 text-center font-display text-lg text-ceremonial drop-shadow-sm">
        ព្រះរាជាណាចក្រកម្ពុជា
      </p>
      <p className="mb-8 text-center text-xs font-display tracking-wide text-ink-soft">
        ជាតិ សាសនា ព្រះមហាក្សត្រ
      </p>

      <div className="envelope-stage relative w-full max-w-md">
        {/* ស្រោមសំបុត្រ */}
        <div className="relative aspect-[1.62/1] w-full">
          {/* ខ្លួនស្រោម */}
          <div className="absolute inset-0 rounded-lg border-2 border-gold/80 bg-paper-dark shadow-[0_16px_36px_-10px_rgba(43,29,18,0.45)]">
            <div className="absolute inset-2 rounded border border-dashed border-paper-edge" />
          </div>

          {/* ទំព័រលិខិតខាងក្នុង (លេចមើលឃើញបន្តិច) */}
          <div className="absolute inset-x-6 top-5 bottom-8 rounded-sm border border-paper-edge bg-paper-light shadow-sm" />

          {/* flap នៅលើគ្នា — បើកដោយ rotateX */}
          <div
            className={`envelope-flap absolute inset-x-0 top-0 z-20 h-[52%] ${opening ? "is-open" : ""}`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background:
                "linear-gradient(180deg, #e9d9ae 0%, #dfc994 70%, #d3ba85 100%)",
              borderTop: "2px solid rgba(184,134,11,0.7)",
              borderLeft: "1px solid rgba(184,134,11,0.45)",
              borderRight: "1px solid rgba(184,134,11,0.45)",
            }}
            aria-hidden="true"
          />

          {/* រស្មីវិលនៅខាងក្រោយត្រា (sparkle rays) */}
          {animationsOn ? (
            <div
              className="pointer-events-none absolute left-1/2 top-[40%] z-20 -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <svg className="animate-ray-spin" width="230" height="230" viewBox="0 0 220 220">
                {Array.from({ length: 12 }).map((_, i) => (
                  <rect
                    key={i}
                    x="107.5"
                    y="10"
                    width="5"
                    height="38"
                    rx="2.5"
                    fill="#d9b44a"
                    opacity="0.45"
                    transform={`rotate(${i * 30} 110 110)`}
                  />
                ))}
              </svg>
            </div>
          ) : null}

          {/* ត្រាទិញនៅចំណុចកំពូល — ចុច ៥ ដង បើក easter egg */}
          <button
            type="button"
            onClick={handleSealTap}
            onDoubleClick={(e) => e.preventDefault()}
            aria-label="ត្រាទិញ — ចុចច្រើនដង បើចង់ដឹងអាថ៌កំបាំង"
            className="absolute left-1/2 top-[40%] z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full"
          >
            <span
              className={`block ${brokenSeal ? "animate-seal-break" : "animate-seal-press"}`}
            >
              <WaxSeal size={128} className="drop-shadow-md" />
            </span>
          </button>

          {/* ត្រាប្រៃសណីយ៍តូច (postage stamp) — បន្ថែមបែបផ្លូវការ 😄 */}
          <div
            className="absolute bottom-3 left-3 z-10 -rotate-6 rounded-sm border-2 border-dashed border-ceremonial/70 bg-paper-light p-1 shadow-sm"
            aria-hidden="true"
          >
            <div className="flex h-14 w-12 flex-col items-center justify-center rounded-sm border border-gold/60 bg-paper">
              <span className="text-xl leading-none">🍚</span>
              <span className="mt-0.5 text-[8px] leading-none font-semibold text-ceremonial">
                ញ៉ាំ
              </span>
            </div>
          </div>
        </div>
      </div>

      <h1 className="mt-10 text-center font-display text-2xl text-ink sm:text-3xl">
        លិខិតអញ្ជើញជាផ្លូវការ
      </h1>
      <p className="mt-2 mb-6 text-center text-sm text-ink-soft">
        មានលិខិតមួយប្រាប់អ្នក… សូមបើកស្រោមសំបុត្រ 👀
      </p>

      <TummyMascot mood={opening ? "excited" : "hungry"} size={124} bubble className="mb-6" />

      <button
        type="button"
        onClick={onOpen}
        disabled={opening}
        className="btn-wiggle min-h-12 rounded-full border-2 border-gold bg-ceremonial px-8 py-3 font-semibold text-paper-light shadow-lg transition-colors hover:bg-ceremonial-dark disabled:opacity-70"
      >
        បើកលិខិតអញ្ជើញ ✉️
      </button>
    </main>
  );
}
