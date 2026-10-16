/**
 * useCountdown.js — រាប់ថយក្រោយទៅពេលវេលាគោលដៅ (target = Date ឬ ISO string)
 * ត្រឡប់ { days, hours, minutes, seconds, total, done } ហើយ update រៀងរាល់ interval។
 * target តែមួយគត់ → គិតតម្លៃដំបូងក្នុង render មិន setState ក្នុង effect។
 */

import { useEffect, useMemo, useState } from "react";

function compute(targetMs) {
  if (!Number.isFinite(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, done: true };
  }
  const diff = Math.max(0, targetMs - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    total: diff,
    done: diff <= 0,
  };
}

export default function useCountdown(target, { interval = 1000 } = {}) {
  const targetMs = useMemo(() => {
    if (target instanceof Date) return target.getTime();
    return new Date(target).getTime();
  }, [target]);

  const [state, setState] = useState(() => compute(targetMs));
  // បើ target ប្តូរ → recalc ក្នុង render (មិន setState ក្នុង effect)
  const [prevTarget, setPrevTarget] = useState(targetMs);
  if (prevTarget !== targetMs) {
    setPrevTarget(targetMs);
    setState(compute(targetMs));
  }

  useEffect(() => {
    if (!Number.isFinite(targetMs)) return undefined;
    const id = window.setInterval(() => setState(compute(targetMs)), interval);
    return () => window.clearInterval(id);
  }, [targetMs, interval]);

  return state;
}
