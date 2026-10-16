/**
 * motion.js — ជំនួយការ animation ទាក់ទង prefers-reduced-motion
 */

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
