/**
 * App.jsx — state machine របស់ funny-invitation
 * envelope → letter → (decline modal → crying screen | attendance form) → confirmation
 */

import { useCallback, useState } from "react";
import { playFunnySound } from "./audio";
import { prefersReducedMotion } from "./motion";
import AttendanceForm from "./components/AttendanceForm";
import ConfirmationLetter from "./components/ConfirmationLetter";
import CryingScreen from "./components/CryingScreen";
import DeclineModal from "./components/DeclineModal";
import Envelope from "./components/Envelope";
import FloatingEmojis from "./components/FloatingEmojis";
import InvitationLetter from "./components/InvitationLetter";
import MuteToggle from "./components/MuteToggle";

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
  }, []);

  const handleJoin = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleRegistrationSuccess = useCallback((data) => {
    setShowForm(false);
    setConfirmation(data);
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
    </div>
  );
}
