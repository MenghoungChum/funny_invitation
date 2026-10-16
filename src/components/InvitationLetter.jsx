/**
 * InvitationLetter.jsx — លិខិតអញ្ជើញជាផ្លូវការ (official letter body)
 * ខ្លឹមសារទាំងអស់ពី config (time / location / organizer …) — កែក្នុង src/config.js
 */

import { CONFIG } from "../config";
import OrnamentalCorners from "./OrnamentalCorners";
import Stamp from "./Stamp";
import WaxSeal from "./WaxSeal";

const RULES = [
  "មកយឺត = អង្គុយមើលមិត្តភក្តិញ៉ាំសិន 😆",
  'ហាមនិយាយថា "អត់ឃ្លានទេ" ព្រោះក្រពះគណៈកម្មការមិនជឿ',
  "អ្នកណាមកមុន មានសិទ្ធិជ្រើសរើសកៅអីល្អជាងគេ",
];

export default function InvitationLetter({ onJoin, onDecline }) {
  const { event } = CONFIG;

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
          <p className="text-sm font-semibold tracking-wide text-ceremonial-dark">
            ព្រះរាជាណាចក្រកម្ពុជា
          </p>
          <p className="mt-1 text-xs tracking-widest text-ink-soft">
            ជាតិ សាសនា ព្រះមហាក្សត្រ
          </p>
          <p className="mt-1 text-[11px] text-ink-soft/80">
            គណៈកម្មការក្រពះឃ្លាន — សាខាញ៉ាំអាហារ
          </p>
        </header>

        <h1
          id="letter-title"
          className="mb-6 text-center font-display text-2xl leading-relaxed text-ink sm:text-3xl"
        >
          លិខិតអញ្ជើញជាផ្លូវការ
        </h1>

        <p className="mb-5 text-end text-sm font-semibold text-ink">លេខ៖ ០០៧/ញ៉ាំ/២០២៦</p>

        <p className="mb-5 text-[0.95rem] leading-loose text-ink sm:leading-loose">
          <strong className="text-ceremonial-dark">កម្មវត្ថុ៖</strong>{" "}
          សូមអញ្ជើញមិត្តជាទីស្រឡាញ់មកចូលរួមពិសាអាហារជុំគ្នា។
        </p>

        <p className="mb-6 text-[0.95rem] leading-loose text-ink">
          យោងតាមការប្រជុំបន្ទាន់របស់គណៈកម្មការក្រពះឃ្លាន សម្រេចអញ្ជើញមិត្តទាំងអស់មកចូលរួមពិសាអាហារជុំគ្នា។
          មិត្តគ្រប់រូបសូមចូលរួមដោយស្ម័គ្រចិត្ត ហើយសូមកុំប្រើលេសថារវល់ ឬអត់ឃ្លាន។
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

        {/* ក្រមកំសាន្ត */}
        <section className="mb-6" aria-labelledby="rules-title">
          <h2 id="rules-title" className="mb-3 font-serif text-lg font-semibold text-ink">
            សេចក្ដីប្រកាស (ក្រមកំសាន្ត) 📜
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-[0.95rem] leading-loose text-ink">
            {RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </section>

        <p className="mb-8 rounded-md border border-dashed border-gold/70 bg-gold/10 p-3 text-[0.9rem] leading-relaxed text-ink-soft">
          <strong className="text-ink">សេចក្ដីកត់សម្គាល់៖</strong> ការចូលរួមគឺជា{" "}
          <strong className="text-leaf-dark">ស្ម័គ្រចិត្ត</strong> ទាំងស្រុង — មិត្តអាចជ្រើសរើសបានដោយសេរី។
          &nbsp;យើងគ្រាន់តែចង់ញ៉ាំជាមួយអ្នក ហើយក្រពះយើងស្វាគមន៍មិត្តភក្តិគ្រប់រូប! 😄
        </p>

        {/* ប៊ូតុងសំខាន់ពីរ */}
        <section className="mb-2 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onJoin}
            className="btn-wiggle min-h-12 rounded-lg border-2 border-leaf-dark bg-leaf px-8 py-3.5 text-base font-bold text-paper-light shadow-lg transition-colors hover:bg-leaf-dark"
          >
            ខ្ញុំចូលរួម 😂
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="btn-wiggle min-h-12 rounded-lg border-2 border-ceremonial-dark bg-ceremonial px-8 py-3.5 text-base font-bold text-paper-light shadow-lg transition-colors hover:bg-ceremonial-dark"
          >
            អត់ទៅទេ 😭
          </button>
        </section>

        {/* ប្រវត្តិហត្ថលេខាអ្នករៀបចំ */}
        <footer className="mt-10 flex flex-col items-end gap-1 border-t border-dashed border-gold/60 pt-6">
          <p className="text-sm text-ink-soft">អ្នករៀបចំកម្មវិធី</p>
          <p className="font-serif text-lg font-semibold text-ink">{event.organizer}</p>
          <div className="mt-2 -rotate-6">
            <WaxSeal size={72} />
          </div>
        </footer>
      </article>
    </main>
  );
}
