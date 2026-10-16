/**
 * StickyRule.jsx — ក្រដាសចំណាំ (sticky note) សម្រាប់ក្រមបន្ថែម
 * មានកាស tape តូច + លំអៀងបន្តិច។ មាតិកាមិនមែន decorative (អាចអានបាន)។
 */

export default function StickyRule({ children, rotate = -3, tone = "#fdf3b6", className = "" }) {
  return (
    <div
      className={`relative inline-block max-w-xs ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span
        className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 -rotate-2 rounded-sm bg-amber-200/70 shadow-sm"
        aria-hidden="true"
      />
      <div
        className="rounded-sm px-4 py-3 text-sm font-semibold leading-relaxed text-ink shadow-md"
        style={{ backgroundColor: tone }}
        role="note"
      >
        {children}
      </div>
    </div>
  );
}
