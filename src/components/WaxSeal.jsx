/**
 * WaxSeal.jsx — ត្រាទិញ (wax seal) គូរជា SVG សុទ្ធ (មិនប្រើរូបភាព PNG ទេ)
 * ប្រើជា favicon ផង: public/assets/images/invitation-seal.svg
 */

export default function WaxSeal({ size = 96, broken = false, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="ត្រាទិញលិខិតអញ្ជើញ"
    >
      <defs>
        <radialGradient id="waxGrad" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#d9453d" />
          <stop offset="45%" stopColor="#b02020" />
          <stop offset="100%" stopColor="#6f0f0f" />
        </radialGradient>
        <radialGradient id="waxSheen" cx="35%" cy="28%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* ស្នាម wax ជារង្វង់មូលភ្ជាប់ */}
      <g fill="url(#waxGrad)">
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const cx = 60 + Math.cos(angle) * 46;
          const cy = 60 + Math.sin(angle) * 46;
          return <circle key={i} cx={cx} cy={cy} r="13.5" />;
        })}
        <circle cx="60" cy="60" r="50" />
      </g>

      {/* ផ្ទៃរលោក */}
      <circle cx="60" cy="60" r="50" fill="url(#waxSheen)" />

      {/* រង្វង់ត្រាពីរជាន់ */}
      <circle cx="60" cy="60" r="43" fill="none" stroke="#5e0c0c" strokeWidth="2.4" opacity="0.75" />
      <circle cx="60" cy="60" r="37" fill="none" stroke="#f2d9a0" strokeWidth="1.2" opacity="0.55" />

      {/* កន្ត្រៃ + ស្លាបព្រា (ព្រមានអាហារ) គូរសាមញ្ញ */}
      <g stroke="#f7e3b2" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.95">
        {/* spoon */}
        <path d="M42 78 L56 46" />
        <ellipse cx="58" cy="41" rx="5.5" ry="8" transform="rotate(22 58 41)" fill="#f7e3b2" stroke="none" />
        {/* fork */}
        <path d="M78 78 L64 46" />
        <path d="M60 44 L68 38 M62.5 42 L70.5 36 M65 40 L73 34" strokeWidth="2.4" />
      </g>

      {/* bintang តូចៗ */}
      <g fill="#f2d9a0" opacity="0.85">
        <circle cx="36" cy="34" r="1.8" />
        <circle cx="84" cy="34" r="1.8" />
        <circle cx="60" cy="92" r="1.8" />
      </g>

      {broken ? (
        <path
          d="M30 22 L52 58 L44 96 M78 20 L70 56 L92 84"
          stroke="rgba(40,5,5,0.55)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}
