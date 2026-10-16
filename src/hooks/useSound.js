/**
 * useSound.js — hook ខ្លីៗ សម្រាប់ចាក់សំឡេងផ្ទៃ UI (គោរព mute តាមរយៈ audio.js)
 * ប្រើ: const play = useSound(); play("pop");
 */

import { useCallback } from "react";
import { playEffect } from "../audio";

export default function useSound() {
  return useCallback((kind = "pop") => {
    playEffect(kind);
  }, []);
}
