/**
 * PointerTrail.jsx — ដានអាហារ/ផ្កាយតាមព្រួញកណ្តុរ (canvas)
 * • បើកតែពេល AnimationToggle បើក និងមិនមែន touch
 * • កំណត់ particle ≤ 24 · ផ្អាកពេល tab លាក់ · cleanup ពេល unmount
 */

import { useEffect, useRef } from "react";
import { useAnimationsEnabled } from "../motion";

const TRAIL = ["✨", "🍚", "🌟", "🥢", "🍡"];

export default function PointerTrail() {
  const animationsOn = useAnimationsEnabled();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!animationsOn) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let raf = 0;
    let stopped = false;
    let hidden = document.hidden;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = [];
    const MAX = 24;
    let lastX = null;
    let lastY = null;

    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      const dx = lastX === null ? 999 : e.clientX - lastX;
      const dy = lastY === null ? 999 : e.clientY - lastY;
      if (dx * dx + dy * dy < 64) return;
      lastX = e.clientX;
      lastY = e.clientY;
      dots.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        size: 12 + Math.random() * 8,
        emoji: TRAIL[Math.floor(Math.random() * TRAIL.length)],
      });
      if (dots.length > MAX) dots.splice(0, dots.length - MAX);
    };
    window.addEventListener("pointermove", onMove);

    const onVisibility = () => {
      hidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      if (stopped) return;
      if (!hidden) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = dots.length - 1; i >= 0; i -= 1) {
          const d = dots[i];
          d.life -= 0.035;
          d.y -= 0.6;
          if (d.life <= 0) {
            dots.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = Math.max(0, d.life);
          ctx.font = `${d.size}px serif`;
          ctx.fillText(d.emoji, d.x, d.y);
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [animationsOn]);

  if (!animationsOn) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
