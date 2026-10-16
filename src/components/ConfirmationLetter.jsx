/**
 * ConfirmationLetter.jsx — សារបញ្ជាក់ការចូលរួម (after EmailJS success)
 * • id="print-area" → print CSS បង្ហាញតែសារនេះ (A4)
 * • បោះពុម្ព (window.print) · ទាញយក PDF (html2pdf.js + print fallback) · ត្រឡប់
 * • confetti (reduced-motion aware)
 */

import { useRef } from "react";
import { CONFIG } from "../config";
import Confetti from "./Confetti";
import OrnamentalCorners from "./OrnamentalCorners";
import Stamp from "./Stamp";

export default function ConfirmationLetter({ data, onBack }) {
  const { event } = CONFIG;
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handlePdf = async () => {
    const el = printRef.current;
    const html2pdf = window.html2pdf;
    if (el && typeof html2pdf === "function") {
      try {
        await html2pdf()
          .set({
            margin: [10, 10, 10, 10],
            filename: `funny-invitation-${Date.now()}.pdf`,
            image: { type: "jpeg", quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: "#fbf6e9" },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          })
          .from(el)
          .save();
        return;
      } catch (err) {
        console.warn("[FunnyInvitation] html2pdf បរាជ័យ — ប្តូរទៅបោះពុម្ព (Save as PDF) ជំនួស:", err);
      }
    }
    // fallback: print dialog → "Save as PDF"
    window.print();
  };

  return (
    <main className="relative z-10 flex min-h-dvh flex-col items-center px-3 py-8 sm:px-6 sm:py-12">
      <Confetti />

      <article
        id="print-area"
        ref={printRef}
        className="paper-sheet official-border print-plain-shadow animate-letter-rise relative w-full max-w-2xl rounded-sm p-5 pb-10 sm:p-10"
        aria-labelledby="confirmation-title"
      >
        <OrnamentalCorners />

        <div className="pointer-events-none absolute -top-3 right-3 z-10">
          <Stamp text="អនុម័តដោយក្រពះ" size={104} delay={0.5} />
        </div>

        <header className="mb-6 border-b-2 border-double border-gold/60 pb-4 text-center">
          <p className="text-sm font-semibold tracking-wide text-ceremonial-dark">
            ព្រះរាជាណាចក្រកម្ពុជា
          </p>
          <p className="mt-1 text-xs tracking-widest text-ink-soft">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
        </header>

        <h1
          id="confirmation-title"
          className="mb-6 text-center font-display text-xl leading-relaxed text-ink sm:text-2xl"
        >
          សារបញ្ជាក់ការចូលរួម
        </h1>

        <p className="mb-6 rounded-md border border-leaf/60 bg-leaf/10 p-4 text-center text-[0.95rem] font-semibold leading-relaxed text-leaf-dark">
          សូមអបអរសាទរ! អ្នកបានចុះឈ្មោះចូលរួមដោយជោគជ័យ! 🎉
        </p>

        <dl className="mb-6 space-y-3 text-[0.95rem] leading-relaxed">
          <div className="flex flex-wrap gap-2 border-b border-dashed border-gold/40 pb-2">
            <dt className="w-32 shrink-0 font-semibold text-ceremonial-dark">កម្មវិធី៖</dt>
            <dd className="flex-1 text-ink">{event.title}</dd>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-dashed border-gold/40 pb-2">
            <dt className="w-32 shrink-0 font-semibold text-ceremonial-dark">ថ្ងៃ៖</dt>
            <dd className="flex-1 text-ink">{event.dateKhmer}</dd>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-dashed border-gold/40 pb-2">
            <dt className="w-32 shrink-0 font-semibold text-ceremonial-dark">ម៉ោង៖</dt>
            <dd className="flex-1 text-ink">{event.time}</dd>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-dashed border-gold/40 pb-2">
            <dt className="w-32 shrink-0 font-semibold text-ceremonial-dark">ទីតាំង៖</dt>
            <dd className="flex-1 text-ink">{event.location}</dd>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-dashed border-gold/40 pb-2">
            <dt className="w-32 shrink-0 font-semibold text-ceremonial-dark">អ្នករៀបចំ៖</dt>
            <dd className="flex-1 text-ink">{event.organizer}</dd>
          </div>
          <div className="flex flex-wrap gap-2 border-b border-dashed border-gold/40 pb-2">
            <dt className="w-32 shrink-0 font-semibold text-ceremonial-dark">ឈ្មោះចូលរួម៖</dt>
            <dd className="flex-1 font-semibold text-ink">{data.attendeeName}</dd>
          </div>
          <div className="flex flex-wrap gap-2">
            <dt className="w-32 shrink-0 font-semibold text-ceremonial-dark">ចុះឈ្មោះថ្ងៃ៖</dt>
            <dd className="flex-1 text-ink-soft">{data.registeredAt}</dd>
          </div>
        </dl>

        {/*ហត្ថលេខាខ្លួនឯង (session-only — អ៊ីមែល Gmail អាចមិនបង្ហាញរូប data: URI) */}
        <section className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-1 text-sm font-semibold text-ceremonial-dark">ហត្ថលេខាអ្នកចូលរួម៖</p>
            <div className="flex h-24 w-56 items-center justify-center overflow-hidden rounded-md border border-gold/60 bg-white">
              {data.signatureDataUrl ? (
                <img
                  src={data.signatureDataUrl}
                  alt={`ហត្ថលេខារបស់ ${data.attendeeName}`}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-ink-soft/60">គ្មានហត្ថលេខា</span>
              )}
            </div>
          </div>
          <div className="text-end">
            <p className="text-sm text-ink-soft">អ្នករៀបចំកម្មវិធី</p>
            <p className="font-serif text-lg font-semibold text-ink">{event.organizer}</p>
          </div>
        </section>

        <p className="text-center text-xs leading-relaxed text-ink-soft">
          សូមរក្សាលិខិតបញ្ជាក់នេះ ឬបោះពុម្ពទុក។ យើងរង់ចាំអ្នកថ្ងៃនោះ! 🍚😄
        </p>
      </article>

      {/* ប៊ូតុង — នៅក្រៅ #print-area ដើម្បីកុំឲ្យបោះពុម្ព/PDF ចាប់បាន (no-print) */}
      <section className="no-print mt-6 flex w-full max-w-2xl flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handlePrint}
          className="btn-wiggle min-h-12 rounded-lg border-2 border-gold bg-paper-light px-6 py-3 font-semibold text-ink shadow-md transition-colors hover:bg-paper-dark"
        >
          បោះពុម្ព 🖨️
        </button>
        <button
          type="button"
          onClick={handlePdf}
          className="btn-wiggle min-h-12 rounded-lg border-2 border-ceremonial-dark bg-ceremonial px-6 py-3 font-semibold text-paper-light shadow-md transition-colors hover:bg-ceremonial-dark"
        >
          ទាញយកជា PDF ⬇️
        </button>
        <button
          type="button"
          onClick={onBack}
          className="btn-wiggle min-h-12 rounded-lg border-2 border-leaf-dark bg-leaf px-6 py-3 font-semibold text-paper-light shadow-md transition-colors hover:bg-leaf-dark"
        >
          ត្រឡប់ទៅលិខិតអញ្ជើញ
        </button>
      </section>
    </main>
  );
}
