/**
 * toastBus.js — module-level bus សម្រាប់ toast (មិនពាក់ព័ន្ធ React)
 * ញែកចេញពី Toast.jsx ដើម្បីរក្សា Fast Refresh (component file គួរ export តែ component)។
 */

let counter = 0;
let toasts = [];
const listeners = new Set();

function emit() {
  for (const listener of listeners) listener(toasts);
}

export function showToast(message, options = {}) {
  const id = (counter += 1);
  const duration = options.duration ?? 3600;
  const toast = { id, message, kind: options.kind || "info" };
  toasts = [...toasts, toast].slice(-4);
  emit();
  if (duration > 0) {
    window.setTimeout(() => dismissToast(id), duration);
  }
  return id;
}

export function dismissToast(id) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function subscribeToasts(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts() {
  return toasts;
}
