/**
 * Envelope.jsx — ស្រោមសំបុត្របិទជិត + ត្រាទិញ (first screen)
 * ចុច "បើកលិខិតអញ្ជើញ ✉️" → flap បើក (~1s) → App ប្តូរទៅ letter។
 * ប្រសិនបើ prefers-reduced-motion → រំលង animation ចុចភ្លាមៗ។
 */

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../motion";
import WaxSeal from "./WaxSeal";

export default function Envelope({ onOpen, opening }) {
  const [brokenSeal, setBrokenSeal] = useState(false);

  useEffect(() => {
    if (opening && !prefersReducedMotion()) {
      const t = window.setTimeout(() => setBrokenSeal(true), 260);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [opening]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <p className="mb-3 text-center font-display text-lg text-ceremonial drop-shadow-sm">
        ព្រះរាជាណាចក្រកម្ពុជា
      </p>
      <p className="mb-8 text-center text-xs tracking-wide text-ink-soft">
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

          {/* ត្រាទិញនៅចំណុចកំពូល */}
          <div
            className={`absolute left-1/2 top-[40%] z-30 -translate-x-1/2 -translate-y-1/2 ${
              opening && !brokenSeal ? "" : ""
            } ${brokenSeal ? "animate-seal-break" : "animate-seal-press"}`}
          >
            <WaxSeal size={84} broken={brokenSeal} className="drop-shadow-md" />
          </div>
        </div>
      </div>

      <h1 className="mt-10 text-center font-display text-2xl text-ink sm:text-3xl">
        លិខិតអញ្ជើញជាផ្លូវការ
      </h1>
      <p className="mt-2 mb-8 text-center text-sm text-ink-soft">
        មានលិខិតមួយប្រាប់អ្នក… សូមបើកស្រោមសំបុត្រ 👀
      </p>

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
