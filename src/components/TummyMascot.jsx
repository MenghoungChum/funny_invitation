/**
 * TummyMascot.jsx — តួក្រពះ (mascot) ដែលមានអារម្មណ៍ផ្សេងៗ
 * mood: "idle" | "hungry" | "excited" | "sad" | "crying" | "party"
 * • បង្ហាញ caption ខ្មែរប្តូររៀងរាល់ ~5s (ពេលចលនាបើក)
 * • រូបភាព aria-hidden — ប្រកាសអារម្មណ៍តាម sr-only live region (ប្តូរ mood តែម្តង)
 */

import { useEffect, useRef, useState } from "react";
import { useAnimationsEnabled } from "../motion";

const INK = "#2b1d12";

const CAPTIONS = {
  idle: ["ក្រពះនៅស្ងប់ស្ងាត់… 🍚", "រង់ចាំអ្នកណាមកញ៉ាំ…", "ឃ្លានបន្តិចៗ 😋"],
  hungry: ["ក្រពះញូវហើយ! 🍜", "ឃ្លានខ្លាំងណាស់… មកញ៉ាំអីចុះ!", "សំឡេងក្រពះរោទ៍ ឮអត់? 😅"],
  excited: ["អឺយ! អ្នកចូលរួមហើយ! 🎉", "រីករាយណាស់! ត្រៀមចានរួចហើយ!", "មកៗ កន្លែងទំនេរច្រើន! 😄"],
  sad: ["អូ… អត់ទៅមែនទេ? 🥺", "ក្រពះខូចចិត្តបន្តិច…", "គិតម្តងទៀតបានទេ?"],
  crying: ["អូហូ! ក្រពះយំហើយ 😭", "ទឹកភ្នែកស្រក់… ស្រក់!", "ចង្ក្រាននៅរង់ចាំ…"],
  party: ["ចូលរួមជោគជ័យ! អបអរ! 🎉", "ស្វាគមន៍! ចានរបស់អ្នករួចរាល់!", "ញ៉ាំឲ្យឆ្ងាញ់ណា! 🍚😄"],
};

const VALID_MOODS = new Set(["idle", "hungry", "excited", "sad", "crying", "party"]);

function face(mood) {
  const isHappy = mood === "excited" || mood === "party";
  const isSad = mood === "sad" || mood === "crying";
  const openMouth = mood === "hungry" || mood === "crying";
  return { isHappy, isSad, openMouth };
}

export default function TummyMascot({
  mood = "idle",
  size = 140,
  caption,
  bubble = false,
  className = "",
}) {
  const safeMood = VALID_MOODS.has(mood) ? mood : "idle";
  const animationsOn = useAnimationsEnabled();
  const captions = CAPTIONS[safeMood];
  const [index, setIndex] = useState(0);
  const [announcement, setAnnouncement] = useState(captions[0]);
  const prevMood = useRef(safeMood);

  // ប្តូរ mood → reset caption + ប្រកាសតែម្តង
  useEffect(() => {
    if (prevMood.current !== safeMood) {
      prevMood.current = safeMood;
      setIndex(0);
      setAnnouncement(CAPTIONS[safeMood][0]);
    }
  }, [safeMood]);

  useEffect(() => {
    if (!animationsOn || caption) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % captions.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [animationsOn, caption, captions.length]);

  const text = caption || captions[index % captions.length];
  const { isHappy, isSad, openMouth } = face(safeMood);

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {bubble ? (
        <div
          className="mb-1 max-w-[15rem] rounded-2xl rounded-bl-sm border-2 border-gold/60 bg-paper-light px-3 py-1.5 text-center text-xs font-semibold leading-relaxed text-ink shadow-md"
          aria-hidden="true"
        >
          {text}
        </div>
      ) : null}

      <div className={animationsOn ? "animate-bounce-soft" : ""}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          aria-hidden="true"
          focusable="false"
          className="select-none drop-shadow-sm"
        >
          {/* ខ្លួនក្រពះ */}
          <ellipse cx="60" cy="70" rx="42" ry="39" fill="#fbf6e9" stroke="#b8860b" strokeWidth="3" />
          <path
            d="M28 60 q6 -22 32 -24"
            fill="none"
            stroke="#d9b44a"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* ស្នាមរលកក្រពះ */}
          <path
            d="M40 90 q20 10 40 0"
            fill="none"
            stroke="#e3d2a8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* ថ្ពាល់ */}
          {mood === "hungry" || isHappy ? (
            <>
              <circle cx="33" cy="74" r="6" fill="#f0a9a9" opacity="0.6" />
              <circle cx="87" cy="74" r="6" fill="#f0a9a9" opacity="0.6" />
            </>
          ) : null}

          {/* ភ្នែក */}
          {isHappy ? (
            <>
              <path d="M39 62 q7 -9 14 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
              <path d="M67 62 q7 -9 14 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            </>
          ) : isSad ? (
            <>
              <path d="M39 57 q7 8 14 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
              <path d="M67 57 q7 8 14 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="46" cy="60" r={mood === "hungry" ? 6 : 5} fill={INK} />
              <circle cx="74" cy="60" r={mood === "hungry" ? 6 : 5} fill={INK} />
              <circle cx="47.6" cy="58.4" r="1.6" fill="#ffffff" />
              <circle cx="75.6" cy="58.4" r="1.6" fill="#ffffff" />
            </>
          )}

          {/* ទឹកភ្នែក */}
          {isSad ? (
            <>
              <ellipse cx="42" cy="72" rx="3" ry="4.5" fill="#5aa9e6" />
              {mood === "crying" ? <ellipse cx="78" cy="72" rx="3" ry="4.5" fill="#5aa9e6" /> : null}
            </>
          ) : null}

          {/* មាត់ */}
          {openMouth ? (
            <ellipse
              cx="60"
              cy="82"
              rx={mood === "crying" ? 10 : 8}
              ry={mood === "crying" ? 12 : 10}
              fill={INK}
            />
          ) : isHappy ? (
            <>
              <path d="M48 76 q12 14 24 0 z" fill={INK} />
              {mood === "party" ? <path d="M56 85 q4 5 8 0 z" fill="#c0392b" /> : null}
            </>
          ) : isSad ? (
            <path d="M52 83 q8 -6 16 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          ) : (
            <path d="M52 78 q8 7 16 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          )}

          {/* ផ្កាយពេលអបអរ */}
          {mood === "party" ? (
            <>
              <path d="M18 34 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="#d9b44a" />
              <path d="M102 40 l1.6 5 5 1.6 -5 1.6 -1.6 5 -1.6 -5 -5 -1.6 5 -1.6 z" fill="#9e1b1b" />
            </>
          ) : null}
        </svg>
      </div>

      <span className="sr-only" aria-live="polite">
        {`សត្វក្រពះ៖ ${announcement}`}
      </span>
    </div>
  );
}
