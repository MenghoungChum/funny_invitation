/**
 * InvitationLetter.jsx — លិខិតអញ្ជើញជាផ្លូវការ (official letter body)
 * ខ្លឹមសារទាំងអស់ពី config (time / location / organizer …) — កែក្នុង src/config.js
 */

import { useState } from "react";
import { playEffect } from "../audio";
import { CONFIG } from "../config";
import useInView from "../hooks/useInView";
import useSecretTaps from "../hooks/useSecretTaps";
import Countdown from "./Countdown";
import HungerMeter from "./HungerMeter";
import OrnamentalCorners from "./OrnamentalCorners";
import Stamp from "./Stamp";
import StickyRule from "./StickyRule";
import { showToast } from "../toastBus";
import TummyMascot from "./TummyMascot";
import Typewriter from "./Typewriter";
import WaxSeal from "./WaxSeal";

const RULES = [
  "ហាមយកលេស = ថាទៅរវល់ Date ជាមួយសង្សា 😆",
  'ហាមនិយាយថា "អត់ឃ្លានទេ" ព្រោះខ្ញុំមិនជឿ',
  "អ្នកមានសង្សាអាចហៅមកជាមួយបាន",
  "អ្នកថាមកហើយអត់មកវិញឆ្កែ",
];

const DECLINE_LABELS = ["អត់ទៅទេ 😭", "គិតម្តងទៀតណា 🥺", "ទៅវិញបានទេ? 😅"];

const BODY_TEXT =
  "ដោយហេតុថា <span class='font-display'>អ្នកស្រីធារី</span> ជិតទៅស្រុកហើយយើងខ្ញុំសូមផ្តើមគំនិតធ្វើអីញ៉ាំជុំគ្នា សម្រេចអញ្ជើញមិត្តទាំងអស់មកចូលរួមពិសាអាហារជុំគ្នា។ មិត្តគ្រប់រូបសូមចូលរួមដោយស្ម័គ្រចិត្ត ហើយសូមកុំប្រើលេសថារវល់ ឬអត់ឃ្លាន។";

export default function InvitationLetter({ onJoin, onDecline }) {
  const { event } = CONFIG;
  const [mascotMood, setMascotMood] = useState("hungry");
  const [declineIndex, setDeclineIndex] = useState(0);
  const [bodyRef, bodyInView] = useInView({ once: true, threshold: 0.1 });

  const onSecretTap = useSecretTaps(5, () => {
    playEffect("sparkle");
    showToast("រកឃើញអាថ៌កំបាំង! ចំណីឥតគិតថ្លៃមួយចាន 🍜 (សន្យាលេង)", {
      kind: "success",
      duration: 5000,
    });
  });

  const rotateDeclineLabel = () => setDeclineIndex((i) => (i + 1) % DECLINE_LABELS.length);

  return (
    <main className="relative z-10 flex min-h-dvh justify-center px-3 py-8 sm:px-6 sm:py-12">
      <article
        className="paper-sheet official-border animate-letter-rise relative w-full max-w-3xl rounded-sm p-5 pb-10 sm:p-10 sm:pb-12"
        aria-labelledby="letter-title"
      >
        <OrnamentalCorners />

        {/* ត្រាបន្ទាន់បំផុត — ជ្រុងស្តាំលើ */}
        <div className="pointer-events-none absolute -top-3 right-2 z-10 sm:right-6">
          <Stamp text="បន្ទាន់បំផុត!" size={118} delay={0.65} />
        </div>
        <div className="pointer-events-none absolute top-24 right-4 z-10 hidden sm:block">
          <Stamp text="អនុម័តដោយក្រពះ" size={92} delay={0.95} />
        </div>

        {/* ក្បាលលិខិត */}
        <header className="mb-7 border-b-2 border-double border-gold/60 pb-5 text-center">
          <p className="text-2xl font-display tracking-wide text-ceremonial-dark">
            ព្រះរាជាណាចក្រកម្ពុជា
          </p>
          <p className="mt-1 text-xl tracking-widest font-display text-ink-soft">
            ជាតិ សាសនា ព្រះមហាក្សត្រ
          </p>
          <p className="mt-1 text-lg text-ink-soft/80 font-display">
            កាណាត់ជួបថ្ងៃអាទិត្យ
          </p>
        </header>

        <h1
          id="letter-title"
          className="mb-3 text-center font-display text-2xl leading-relaxed text-ink sm:text-3xl"
        >
          លិខិតអញ្ជើញជាផ្លូវការ
        </h1>

        {/* រចនាដោយមាស — ornament divider */}
        <svg
          viewBox="0 0 220 14"
          className="mx-auto mb-6 h-3.5 w-52"
          aria-hidden="true"
          focusable="false"
        >
          <g stroke="#b8860b" strokeWidth="1.6" strokeLinecap="round" fill="none">
            <path d="M8 7 H88" />
            <path d="M132 7 H212" />
          </g>
          <path d="M110 1 l6 6 -6 6 -6 -6 z" fill="#9e1b1b" />
          <circle cx="96" cy="7" r="2" fill="#b8860b" />
          <circle cx="124" cy="7" r="2" fill="#b8860b" />
        </svg>

        <p className="mb-5 text-end text-sm font-semibold text-ink">លេខ៖ ០០៧/ញ៉ាំ/២០២៦</p>

        <p className="mb-4 font-serif text-[0.95rem] leading-loose text-ink">
          <strong className="text-ceremonial-dark">គោរពជូន៖</strong> មិត្តភក្តិជាទីស្រឡាញ់ទាំងអស់
        </p>

        <p className="mb-5 text-[0.95rem] leading-loose text-ink sm:leading-loose">
          <strong className="text-ceremonial-dark">កម្មវត្ថុ៖</strong>{" "}
          សូមអញ្ជើញមិត្តជាទីស្រឡាញ់មកចូលរួមពិសាអាហារជុំគ្នា។
        </p>

        <p ref={bodyRef} className="mb-6 text-[0.95rem] leading-loose text-ink">
          <Typewriter text={BODY_TEXT} start={bodyInView} />
        </p>

        {/* ព័ត៌មានកម្មវិធី */}
        <section
          className="mb-6 rounded-md border border-gold/50 bg-paper/80 p-4 sm:p-5"
          aria-label="ព័ត៌មានកម្មវិធី"
        >
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold text-ceremonial-dark">កម្មវិធី៖</dt>
              <dd className="text-ink">{event.title}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold text-ceremonial-dark">ថ្ងៃ៖</dt>
              <dd className="text-ink">{event.dateKhmer}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold text-ceremonial-dark">ម៉ោង៖</dt>
              <dd className="text-ink">{event.time}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold text-ceremonial-dark">ទីតាំង៖</dt>
              <dd className="text-ink">{event.location}</dd>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <dt className="shrink-0 font-semibold text-ceremonial-dark">អ្នករៀបចំ៖</dt>
              <dd className="text-ink">{event.organizer}</dd>
            </div>
          </dl>
        </section>

        {/* ការរាប់ថយក្រោយ + របារវាស់កម្រិតឃ្លាន */}
        <section className="mb-6" aria-labelledby="countdown-title">
          <h2
            id="countdown-title"
            className="mb-3 text-center font-serif text-lg font-semibold text-ink"
          >
            ការរាប់ថយក្រោយ ⏳
          </h2>
          <Countdown className="mb-5" />
          <HungerMeter value={92} />
        </section>

        {/* ក្រមកំសាន្ត */}
        <section className="mb-6" aria-labelledby="rules-title">
          <h2 id="rules-title" className="mb-3 font-serif text-lg font-semibold text-ink">
            សេចក្ដីប្រកាស 📜
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-[0.95rem] leading-loose text-ink">
            {RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
          <div className="mt-5 flex justify-center">
            <StickyRule rotate={-3}>
              ➕ ក្រមបន្ថែម៖ អ្នកមកយឺត ត្រូវលាងចាន! 🍽️😆
            </StickyRule>
          </div>
        </section>

        <p className="mb-8 rounded-md border border-dashed border-gold/70 bg-gold/10 p-3 text-[0.9rem] leading-relaxed text-ink-soft">
          <strong className="text-ink">សេចក្ដីកត់សម្គាល់៖</strong> ការចូលរួមគឺជា{" "}
          <strong className="text-leaf-dark">ស្ម័គ្រចិត្ត</strong> ទាំងស្រុង — មិត្តអាចជ្រើសរើសបានដោយសេរី។
          &nbsp;យើងគ្រាន់តែចង់ញ៉ាំជាមួយអ្នក ហើយយើងស្វាគមន៍មិត្តភក្តិគ្រប់រូប! 😄
        </p>

        {/* ប៊ូតុងសំខាន់ពីរ */}
        <div className="mb-4 flex justify-center">
          <TummyMascot mood={mascotMood} size={132} bubble />
        </div>
        <section className="mb-2 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onJoin}
            onMouseEnter={() => setMascotMood("excited")}
            onFocus={() => setMascotMood("excited")}
            onMouseLeave={() => setMascotMood("hungry")}
            onBlur={() => setMascotMood("hungry")}
            className="btn-wiggle min-h-12 rounded-lg border-2 border-leaf-dark bg-leaf px-8 py-3.5 text-base font-bold text-paper-light shadow-lg transition-colors hover:bg-leaf-dark"
          >
            ខ្ញុំចូលរួម 😂
          </button>
          <button
            type="button"
            onClick={onDecline}
            onMouseEnter={rotateDeclineLabel}
            onFocus={rotateDeclineLabel}
            className="btn-wiggle min-h-12 min-w-[11rem] rounded-lg border-2 border-ceremonial-dark bg-ceremonial px-8 py-3.5 text-center text-base font-bold text-paper-light shadow-lg transition-colors hover:bg-ceremonial-dark"
          >
            {DECLINE_LABELS[declineIndex]}
          </button>
        </section>

        {/* ប្រវត្តិហត្ថលេខាអ្នករៀបចំ */}
        <footer className="mt-10 flex flex-col items-end gap-1 border-t border-dashed border-gold/60 pt-6">
        <p className="text-sm text-black">ថ្ងៃ ២៥​ ខែ តុលា ឆ្នាំ ២០២៦</p>
          <p className="text-sm text-ink-soft">អ្នករៀបចំកម្មវិធី</p>
          <p className="font-serif text-lg font-semibold text-ink">{event.organizer}</p>
          <div className="mt-2 -rotate-6">
            <button
              type="button"
              onClick={onSecretTap}
              aria-label="ត្រាទិញ — ចុចច្រើនដង បើចង់ដឹងអាថ៌កំបាំង"
              className="cursor-pointer rounded-full"
            >
              <WaxSeal size={134} />
            </button>
          </div>
        </footer>
      </article>
    </main>
  );
}
