/**
 * AttendanceForm.jsx — ទម្រង់ចុះឈ្មោះចូលរួម (modal)
 * • name: 2–60 chars, Khmer/Latin + spaces + basic punctuation, strip control chars
 * • signature: canvas (SignaturePadField) — required
 * • EmailJS submit with in-flight lock, loading state, retry, cooldown + session limit
 */

import { useEffect, useRef, useState } from "react";
import { formatRegisteredAt, isEmailConfigured, sendRegistration } from "../email";
import Modal from "./Modal";
import SignaturePadField from "./SignaturePadField";

const MAX_ATTEMPTS_PER_SESSION = 3;
const COOLDOWN_MS = 30 * 1000;

const NAME_ALLOWED = /^[\u1780-\u17FFA-Za-z\s.'’,\-()៍៎៏័៑្]+$/u;

function stripControlChars(value) {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F]/g, "");
}

function readAttempts() {
  try {
    const n = Number(sessionStorage.getItem("funny-invitation-attempts"));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function writeAttempts(n) {
  try {
    sessionStorage.setItem("funny-invitation-attempts", String(n));
  } catch {
    /* ignore */
  }
}

function validateName(raw) {
  const cleaned = stripControlChars(raw).trim().replace(/\s+/g, " ");
  if (cleaned.length === 0) return { ok: false, message: "សូមបញ្ចូលឈ្មោះរបស់អ្នក" };
  if (cleaned.length < 2 || cleaned.length > 60) {
    return { ok: false, message: "ឈ្មោះត្រូវមានចន្លោះពី ២ ទៅ ៦០ តួអក្ខរ" };
  }
  if (!NAME_ALLOWED.test(cleaned)) {
    return { ok: false, message: "ឈ្មោះគួរប្រើតែអក្ខរាវិរុទ្ធ (ខ្មែរ/អង់គ្លេស) និងសញ្ញាធម្មតា" };
  }
  return { ok: true, value: cleaned };
}

export default function AttendanceForm({ open, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [signError, setSignError] = useState("");
  const [status, setStatus] = useState(null); // { kind: "error"|"info", message }
  const [sending, setSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const signatureRef = useRef(null);
  const inFlightRef = useRef(false);
  const nameInputRef = useRef(null);

  // focus ទៅ input ឈ្មោះ (Modal ចុច focus ទៅ element ដំបូងស្រាប់)
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => nameInputRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inFlightRef.current) return; // in-flight lock — ignore repeated clicks

    const nameResult = validateName(name);
    setNameError(nameResult.ok ? "" : nameResult.message);
    if (!nameResult.ok) {
      nameInputRef.current?.focus();
      return;
    }

    if (signatureRef.current?.isEmpty()) {
      setSignError("សូមគូរហត្ថលេខា");
      return;
    }
    setSignError("");

    const now = Date.now();
    if (now < cooldownUntil) {
      const secs = Math.ceil((cooldownUntil - now) / 1000);
      setStatus({
        kind: "info",
        message: `សូមរង់ចាំបន្តិច (${secs} វិនាទី) មុនផ្ញើម្តងទៀត។`,
      });
      return;
    }
    if (readAttempts() >= MAX_ATTEMPTS_PER_SESSION) {
      setStatus({
        kind: "info",
        message: `បានសាកល្បង ${MAX_ATTEMPTS_PER_SESSION} ដងក្នុងស៊ីស្ថាននេះហើយ។ សូមទាក់ទងអ្នករៀបចំដោយផ្ទាល់បើត្រូវការជំនួយ។ (នេះគ្រាន់តែការកំណត់ខាង client មិនមែនសន្តិសុខពិតទេ)`,
      });
      return;
    }

    if (!isEmailConfigured()) {
      console.warn(
        "[FunnyInvitation] EmailJS នៅមិនទាន់កំណត់ — សូមបំពេញ src/config.js (publicKey, serviceId, templateId, organizerEmail)"
      );
    }

    inFlightRef.current = true;
    setSending(true);
    setStatus(null);

    const compactSignature = signatureRef.current?.toCompactDataURL(300, 0.7) || null;

    const result = await sendRegistration({
      attendeeName: nameResult.value,
      signatureDataUrl: compactSignature,
    });

    inFlightRef.current = false;
    setSending(false);

    if (result.ok) {
      writeAttempts(readAttempts() + 1);
      setCooldownUntil(Date.now() + COOLDOWN_MS);
      // signature ពេញទំហំសម្រាប់ confirmation letter (session-only)
      const fullSignature = signatureRef.current?.toDataURL() || compactSignature;
      onSuccess({
        attendeeName: nameResult.value,
        signatureDataUrl: fullSignature,
        registeredAt: formatRegisteredAt(new Date()),
      });
      // reset
      setName("");
      signatureRef.current?.clear();
      return;
    }

    writeAttempts(readAttempts() + 1);
    setStatus({ kind: "error", message: result.message });
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="form-title" panelClassName="max-w-xl">
      <h2 id="form-title" className="mb-1 text-center font-display text-xl text-ceremonial">
        ទម្រង់ចុះឈ្មោះចូលរួម
      </h2>
      <p className="mb-5 text-center text-xs text-ink-soft">
        សូមបំពេញឈ្មោះ ហើយគូរហត្ថលេខាខ្លួនឯង ✍️
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="attendee-name" className="mb-1 block font-semibold text-ink">
            ឈ្មោះពេញ <span className="text-ceremonial" aria-hidden="true">*</span>
          </label>
          <input
            ref={nameInputRef}
            id="attendee-name"
            name="attendee_name"
            type="text"
            value={name}
            autoComplete="name"
            maxLength={60}
            aria-required="true"
            aria-invalid={nameError ? "true" : "false"}
            aria-describedby={nameError ? "attendee-name-error" : undefined}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            className={`min-h-12 w-full rounded-md border-2 bg-white px-3 py-2.5 text-ink placeholder:text-ink-soft/50 ${
              nameError ? "border-ceremonial" : "border-gold/60"
            } focus:border-gold`}
            placeholder="ឧ. ស្រី មុន្នីរ័ត្ន"
          />
          {nameError ? (
            <p id="attendee-name-error" role="alert" className="mt-1.5 text-sm font-medium text-ceremonial">
              {nameError}
            </p>
          ) : null}
        </div>

        <div className="mb-5">
          <SignaturePadField
            ref={signatureRef}
            error={signError}
            describedBy={signError ? "signature-error" : undefined}
          />
          {signError ? (
            <p id="signature-error" role="alert" className="sr-only">
              {signError}
            </p>
          ) : null}
        </div>

        <div aria-live="polite" className="min-h-0">
          {status ? (
            <p
              role="status"
              className={`mb-3 rounded-md border p-3 text-sm leading-relaxed ${
                status.kind === "error"
                  ? "border-ceremonial/60 bg-ceremonial/10 text-ceremonial-dark"
                  : "border-gold/60 bg-gold/10 text-ink-soft"
              }`}
            >
              {status.message}
              {status.kind === "error" ? (
                <span className="mt-1 block text-xs">
                  ចុច “បញ្ជាក់ការចូលរួម” ម្តងទៀតដើម្បី <strong>ព្យាយាមម្តងទៀត</strong>។
                </span>
              ) : null}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="min-h-12 rounded-lg border-2 border-ink-soft/40 px-5 py-2.5 font-semibold text-ink-soft transition-colors hover:bg-paper-dark disabled:opacity-50"
          >
            បិទ
          </button>
          <button
            type="submit"
            disabled={sending}
            className="btn-wiggle min-h-12 rounded-lg border-2 border-leaf-dark bg-leaf px-7 py-2.5 font-bold text-paper-light shadow-md transition-colors hover:bg-leaf-dark disabled:cursor-wait disabled:opacity-70"
          >
            {sending ? "កំពុងផ្ញើ..." : "បញ្ជាក់ការចូលរួម"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
