/**
 * Modal.jsx — dialog ដែលចេះប្រើបាន (accessible modal dialog)
 * • role="dialog" aria-modal="true"
 * • focus ចូលក្នុង modal ហើយត្រូវបាន trap (Tab / Shift+Tab)
 * • ESC បិទ · ចុច backdrop បិទ · focus ត្រឡប់ទៅប៊ូតុងដែលបានចុច
 */

import { useCallback, useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
  panelClassName = "",
}) {
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  const focusables = useCallback(() => {
    if (!panelRef.current) return [];
    return Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );
  }, []);

  // focus ចូល modal ពេលបើក + រក្សាទុក element ដែលបានចុចមុន
  useEffect(() => {
    if (!open) return undefined;
    previousFocusRef.current = document.activeElement;
    const timer = window.setTimeout(() => {
      const f = focusables();
      if (f.length > 0) f[0].focus();
      else if (panelRef.current) panelRef.current.focus();
    }, 10);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus();
      }
    };
  }, [open, focusables]);

  // keyboard: ESC បិទ · Tab trap
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) {
        e.preventDefault();
        return;
      }
      const first = f[0];
      const last = f[f.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !panelRef.current?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !panelRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose, focusables]);

  if (!open) return null;

  return (
    <div
      className="no-print animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`animate-modal-in paper-sheet official-border relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-sm p-6 sm:p-8 ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
