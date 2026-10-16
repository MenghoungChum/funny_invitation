/**
 * OrnamentalCorners.jsx — ម៉ោនសោរតុចំនុះ (decorative corners, pure SVG/CSS)
 * បិទភ្ជាប់នៅជ្រុងក្រដាស ៤ ជ្រុង — តុបតែងសុទ្ធ គ្មានរូបភាព។
 */

function CornerFlourish({ className = "" }) {
  return (
    <svg
      viewBox="0 0 56 56"
      width="56"
      height="56"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round">
        <path d="M4 52 V20 Q4 4 20 4 H52" />
        <path d="M10 52 V24 Q10 10 24 10 H52" strokeWidth="1.2" opacity="0.7" />
      </g>
      <path d="M18 18 l4 -5 4 5 -4 5 z" fill="#9e1b1b" />
      <circle cx="30" cy="14" r="1.6" fill="#b8860b" />
      <circle cx="14" cy="30" r="1.6" fill="#b8860b" />
    </svg>
  );
}

export default function OrnamentalCorners() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <CornerFlourish className="absolute -top-1 -left-1" />
      <CornerFlourish className="absolute -top-1 -right-1 -scale-x-100" />
      <CornerFlourish className="absolute -bottom-1 -left-1 -scale-y-100" />
      <CornerFlourish className="absolute -bottom-1 -right-1 -scale-100" />
    </div>
  );
}
