/**
 * Toast.jsx — ផ្ទៃបង្ហាញសារជូនដំណឹង (toast host)
 * bus នៅ src/toastBus.js: showToast(message, opts) ហៅបានពីគ្រប់កន្លែង។
 * <ToastHost /> mount ម្តងនៅ App។ ប្រើ aria-live="polite"។
 */

import { useEffect, useState } from "react";
import { getToasts, subscribeToasts } from "../toastBus";

const KIND_CLASS = {
  info: "border-gold/70 bg-paper-light/95 text-ink",
  success: "border-leaf bg-leaf/15 text-leaf-dark",
  sad: "border-ceremonial bg-ceremonial/15 text-ceremonial-dark",
};

export default function ToastHost() {
  const [items, setItems] = useState(getToasts);

  useEffect(() => {
    return subscribeToasts((next) => setItems([...next]));
  }, []);

  return (
    <div
      className="no-print pointer-events-none fixed inset-x-0 bottom-20 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-24"
      role="status"
      aria-live="polite"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={`animate-toast-in pointer-events-auto flex max-w-md items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold shadow-lg ${
            KIND_CLASS[t.kind] || KIND_CLASS.info
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
