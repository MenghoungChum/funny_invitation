/**
 * App.jsx — state machine របស់ funny-invitation
 * envelope → letter → (decline modal → crying screen | attendance form) → confirmation
 */

import { useCallback, useState } from "react";
import { playEffect, playFunnySound } from "./audio";
import { prefersReducedMotion } from "./motion";
import { showToast } from "./toastBus";
import AnimationToggle from "./components/AnimationToggle";
import AttendanceForm from "./components/AttendanceForm";
import ConfirmationLetter from "./components/ConfirmationLetter";
import CryingScreen from "./components/CryingScreen";
import DeclineModal from "./components/DeclineModal";
import Envelope from "./components/Envelope";
import FloatingEmojis from "./components/FloatingEmojis";
import InvitationLetter from "./components/InvitationLetter";
import MuteToggle from "./components/MuteToggle";
import PointerTrail from "./components/PointerTrail";
import ToastHost from "./components/Toast";

const OPEN_DURATION_MS = 1000;

export default function App() {
  const [phase, setPhase] = useState("envelope"); // "envelope" | "letter" | "declined"
  const [opening, setOpening] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const openEnvelope = useCallback(() => {
    if (opening) return;
    if (prefersReducedMotion()) {
      setPhase("letter");
      return;
    }
    setOpening(true);
    window.setTimeout(() => {
      setPhase("letter");
      setOpening(false);
    }, OPEN_DURATION_MS);
  }, [opening]);

  const handleDecline = useCallback(() => {
    playFunnySound();
    setShowDeclineModal(true);
  }, []);

  const confirmDecline = useCallback(() => {
    setShowDeclineModal(false);
    setPhase("declined");
  }, []);

  const changeMind = useCallback(() => {
    setShowDeclineModal(false);
    setShowForm(true);
    playEffect("success");
    showToast("អរគុណដែលផ្លាស់ចិត្តទៅ! 🎉", { kind: "success" });
  }, []);

  const handleJoin = useCallback(() => {
    playEffect("pop");
    setShowForm(true);
  }, []);

  const handleRegistrationSuccess = useCallback((data) => {
    setShowForm(false);
    setConfirmation(data);
    playEffect("success");
    showToast("ចុះឈ្មោះជោគជ័យ! សូមអបអរសាទរ! 🎉", { kind: "success" });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  const backToInvitation = useCallback(() => {
    setConfirmation(null);
    setPhase("letter");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const returnFromDeclined = useCallback(() => {
    setPhase("letter");
  }, []);

  return (
    <div className="relative min-h-dvh">
      <a
        href="#main-content"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-ceremonial focus:px-4 focus:py-2 focus:text-paper-light"
      >
        ឆ្លងទៅមាតិកា
      </a>

      <MuteToggle />
      <AnimationToggle />
      <PointerTrail />
      <ToastHost />

      {phase === "letter" && !confirmation ? <FloatingEmojis /> : null}

      <div id="main-content">
        {phase === "envelope" ? <Envelope onOpen={openEnvelope} opening={opening} /> : null}

        {phase === "letter" && !confirmation ? (
          <InvitationLetter onJoin={handleJoin} onDecline={handleDecline} />
        ) : null}

        {phase === "declined" ? <CryingScreen onReturn={returnFromDeclined} /> : null}

        {confirmation ? (
          <ConfirmationLetter data={confirmation} onBack={backToInvitation} />
        ) : null}
      </div>

      <DeclineModal
        open={showDeclineModal}
        onConfirmDecline={confirmDecline}
        onChangeMind={changeMind}
        onClose={() => setShowDeclineModal(false)}
      />

      <AttendanceForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleRegistrationSuccess}
      />

      <footer className="no-print pb-8 text-center text-xs text-ink-soft/70">
        ធ្វើដោយក្តីស្រលាញ់ និងក្រពះឃ្លាន ❤️🍚
      </footer>
    </div>
  );
}
