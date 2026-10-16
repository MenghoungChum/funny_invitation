/**
 * Confetti.jsx — confetti ស្រាលៗ canvas
 * ប្រើនៅពេល confirmation letter បង្ហាញ — ឈប់ដោយខ្លួនឯងក្រោយ ~5វិនាទី។
 * គោរព AnimationToggle · កំណត់ particle (≤40 desktop / ≤20 mobile) · ផ្អាកពេល tab លាក់។
 */

import { useEffect, useRef } from "react";
import { useAnimationsEnabled } from "../motion";

const COLORS = ["#9e1b1b", "#b8860b", "#d9b44a", "#1f7a3d", "#f7efdb"];

function particleCount() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  return isMobile ? 20 : 40;
}

export default function Confetti() {
  const canvasRef = useRef(null);
  const animationsOn = useAnimationsEnabled();

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

    const onVisibility = () => {
      hidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const particles = Array.from({ length: particleCount() }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.6,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      vy: 1.6 + Math.random() * 2.6,
      vx: -0.9 + Math.random() * 1.8,
      rot: Math.random() * Math.PI,
      vr: -0.12 + Math.random() * 0.24,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const start = performance.now();
    const DURATION = 5000;

    const tick = (now) => {
      if (stopped) return;
      const elapsed = now - start;
      if (!hidden) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          if (p.y > window.innerHeight + 20) {
            p.y = -20;
            p.x = Math.random() * window.innerWidth;
          }
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }
      if (elapsed < DURATION) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [animationsOn]);

  if (!animationsOn) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}
