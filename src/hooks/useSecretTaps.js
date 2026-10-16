/**
 * useSecretTaps.js — រាប់ការចុចលើ element ដើម្បីបើក easter egg (ចុច count ដង)
 * ប្រើ: const onTap = useSecretTaps(5, () => { ... }); <button onClick={onTap}>
 * បើកតែម្តងគត់ (unlock once) ក្នុងមួយ lifecycle។
 */

import { useCallback, useEffect, useRef } from "react";

export default function useSecretTaps(count, onUnlock) {
  const tapsRef = useRef(0);
  const unlockedRef = useRef(false);
  const callbackRef = useRef(onUnlock);

  useEffect(() => {
    callbackRef.current = onUnlock;
  }, [onUnlock]);

  return useCallback(() => {
    if (unlockedRef.current) return;
    tapsRef.current += 1;
    if (tapsRef.current >= count) {
      unlockedRef.current = true;
      callbackRef.current?.();
    }
  }, [count]);
}
