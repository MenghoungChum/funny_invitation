/**
 * Memories.jsx — កម្រងអនុសាវរីយ៍ (memory gallery)
 * បង្ហាញរូបភាព/វីដេអូពី public/assets/images/memories/ (បញ្ជីក្នុង src/config.js → memories)
 * • overlay ផ្ទាល់ខ្លួន (role="dialog" aria-modal) + focus trap + ESC + backdrop
 * • ចុចរូប → lightbox ធំ (បន្ទាប់/មុន ដោយប៊ូតុង ឬព្រួញ ← →)
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { CONFIG } from "../config";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function visibleFocusables(root) {
  if (!root) return [];
  return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

export default function Memories({ open, onClose }) {
  const memories = CONFIG.memories || {};
  const dir = memories.dir || "/assets/images/memories";
  const title = memories.title || "កម្រងអនុសាវរីយ៍";

  const items = useMemo(() => {
    const photos = (memories.photos || []).map((f) => ({ type: "image", src: `${dir}/${f}` }));
    const videos = (memories.videos || []).map((f) => ({ type: "video", src: `${dir}/${f}` }));
    return [...photos, ...videos];
  }, [memories.photos, memories.videos, dir]);

  const [index, setIndex] = useState(-1);
  const active = index >= 0 && index < items.length ? items[index] : null;

  const panelRef = useRef(null);
  const lightboxRef = useRef(null);
  const previousFocusRef = useRef(null);

  const closeLightbox = () => setIndex(-1);
  const handleClose = () => {
    setIndex(-1);
    onClose();
  };
  const step = (d) => setIndex((i) => (i + d + items.length) % items.length);

  // បើក/បិទ — lock scroll, focus, ត្រឡប់ focus វិញ
  useEffect(() => {
    if (!open) return undefined;
    previousFocusRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      const f = visibleFocusables(panelRef.current);
      if (f.length > 0) f[0].focus();
      else panelRef.current?.focus();
    }, 10);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [open]);

  // ពេលបើក lightbox → focus ចូល
  useEffect(() => {
    if (open && index >= 0) {
      const el = lightboxRef.current?.querySelector(FOCUSABLE);
      if (el) el.focus();
    }
  }, [index, open]);

  // keyboard: ESC · Tab trap · ←/→
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIndex(-1);
        if (index < 0) onClose();
        return;
      }
      if (index >= 0 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        const d = e.key === "ArrowRight" ? 1 : -1;
        setIndex((i) => (i + d + items.length) % items.length);
        return;
      }
      if (e.key !== "Tab") return;
      const root = index >= 0 ? lightboxRef.current : panelRef.current;
      const f = visibleFocusables(root);
      if (f.length === 0) {
        e.preventDefault();
        return;
      }
      const first = f[0];
      const last = f[f.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey) {
        if (activeEl === first || !root?.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !root?.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, index, items.length, onClose]);

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-ink/75 p-3 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="memories-title"
        tabIndex={-1}
        className="paper-sheet official-border relative flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-sm"
      >
        <header className="flex items-center justify-between gap-3 border-b border-gold/40 px-4 py-3 sm:px-6">
          <h2
            id="memories-title"
            className="font-display text-lg text-ceremonial-dark sm:text-xl"
          >
            {title} 📸
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="បិទកម្រងអនុសាវរីយ៍"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-paper-light text-lg text-ink transition-colors hover:bg-gold/20"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          <p className="mb-4 text-center text-xs leading-relaxed text-ink-soft">
            សូមចងចាំពេលវេលាល្អៗជាមួយគ្នា 💛 ចុចលើរូបដើម្បីមើលធំ
          </p>

          {items.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-soft">
              មិនទាន់មានរូបភាពអនុសាវរីយ៍ទេ… 🥲
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {items.map((it, i) => (
                <li key={it.src}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={
                      it.type === "video" ? `មើលវីដេអូទី ${i + 1}` : `មើលរូបទី ${i + 1}`
                    }
                    className="group relative block aspect-square w-full overflow-hidden rounded-md border border-gold/50 bg-paper-dark shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ceremonial"
                  >
                    {it.type === "image" ? (
                      <img
                        src={it.src}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <video
                        src={it.src}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      />
                    )}
                    {it.type === "video" ? (
                      <span
                        className="absolute inset-0 flex items-center justify-center bg-ink/25 text-4xl"
                        aria-hidden="true"
                      >
                        ▶️
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {active ? (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`រូបទី ${index + 1} ក្នុងចំណោម ${items.length}`}
          className="fixed inset-0 z-[80] flex flex-col bg-ink/95 p-3 sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="បិទរូប"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-paper-light/40 text-lg text-paper-light transition-colors hover:bg-paper-light/15"
            >
              <span aria-hidden="true">✕</span>
            </button>
            <span className="font-display text-sm text-paper-light/90">
              {index + 1} / {items.length}
            </span>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="រូបមុន"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper-light/40 text-2xl text-paper-light transition-colors hover:bg-paper-light/15"
            >
              <span aria-hidden="true">‹</span>
            </button>

            {active.type === "image" ? (
              <img
                src={active.src}
                alt=""
                className="max-h-[76dvh] max-w-full rounded-md object-contain shadow-2xl"
              />
            ) : (
              <video
                src={active.src}
                className="max-h-[76dvh] max-w-full rounded-md object-contain shadow-2xl"
                controls
                autoPlay
                playsInline
              />
            )}

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="រូបបន្ទាប់"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper-light/40 text-2xl text-paper-light transition-colors hover:bg-paper-light/15"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
