/**
 * DeclineModal.jsx — "ច្បាស់ហើយមែនទេថាអត់ទៅ? 🥹"
 * • អត់ទៅមែនទេ 😭 → onConfirmDecline (crying screen)
 * • អូខេៗ ទៅក៏បាន 😂 → onChangeMind (បើក form ចូលរួម)
 * គ្មានទិន្នន័យអ្វីត្រូវបានផ្ញើ/រក្សាទុកនៅពេលបដិសេធ។
 */

import { playEffect } from "../audio";
import HeartBreak from "./HeartBreak";
import Modal from "./Modal";
import TummyMascot from "./TummyMascot";

export default function DeclineModal({ open, onConfirmDecline, onChangeMind, onClose }) {
  const handleDecline = () => {
    playEffect("heartbreak");
    onConfirmDecline();
  };

  const handleMind = () => {
    playEffect("success");
    onChangeMind();
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="decline-title">
      <div className="mb-2 flex items-end justify-center gap-3">
        <TummyMascot mood="sad" size={104} />
        <HeartBreak size={72} className="mb-2" />
      </div>
      <h2
        id="decline-title"
        className="mb-3 text-center font-display text-xl leading-relaxed text-ceremonial"
      >
        ច្បាស់ហើយមែនទេថាអត់ទៅ? 🥹
      </h2>
      <p className="mb-6 text-center text-sm leading-relaxed text-ink-soft">
        មិត្តទាំងអ្នកគ្នាកំពុងរង់ចាំអ្នក… សូមគិតម្តងទៀតបានទេ? 😅
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDecline}
          className="btn-wiggle min-h-12 flex-1 rounded-lg border-2 border-ceremonial-dark bg-ceremonial px-4 py-3 font-semibold text-paper-light transition-colors hover:bg-ceremonial-dark"
        >
          អត់ទៅមែនទេ 😭
        </button>
        <button
          type="button"
          onClick={handleMind}
          className="btn-wiggle min-h-12 flex-1 rounded-lg border-2 border-leaf-dark bg-leaf px-4 py-3 font-semibold text-paper-light transition-colors hover:bg-leaf-dark"
        >
          អូខេៗ ទៅក៏បាន 😂
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mx-auto mt-5 block min-h-11 rounded px-4 text-sm text-ink-soft underline decoration-gold/60 hover:text-ink"
      >
        ត្រឡប់ទៅលិខិតវិញ
      </button>
    </Modal>
  );
}
