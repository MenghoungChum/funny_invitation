/**
 * HeartBreak.jsx — បេះដូងប្រេះពីរកំណាត់ (decorative, aria-hidden)
 * ពីរចំណុចបេះដូងញែកចេញពីគ្នាដោយ animation។ បើបិទចលនា → បង្ហាញស្ថានភាពប្រេះភ្លាម។
 */

import { useAnimationsEnabled } from "../motion";

const LEFT = "M50 88 C20 64 8 46 8 32 C8 18 20 10 32 10 C40 10 46 15 50 22 Z";
const RIGHT = "M50 88 C80 64 92 46 92 32 C92 18 80 10 68 10 C60 10 54 15 50 22 Z";

export default function HeartBreak({ size = 96, className = "" }) {
  const animationsOn = useAnimationsEnabled();

  const halfStyle = (side) => {
    const origin = "50px 44px";
    if (animationsOn) {
      return {
        animation: `heart-break-${side} 0.8s ease 0.55s both`,
        transformOrigin: origin,
      };
    }
    const dx = side === "left" ? -9 : 9;
    const deg = side === "left" ? -22 : 22;
    return {
      transform: `translate(${dx}px, 11px) rotate(${deg}deg)`,
      transformOrigin: origin,
    };
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
        <g className={animationsOn ? "animate-heart-pulse" : ""} style={{ transformOrigin: "50px 44px" }}>
          <path d={LEFT} fill="#9e1b1b" stroke="#7a1212" strokeWidth="2" style={halfStyle("left")} />
          <path d={RIGHT} fill="#9e1b1b" stroke="#7a1212" strokeWidth="2" style={halfStyle("right")} />
        </g>
      </svg>
    </div>
  );
}
