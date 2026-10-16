/**
 * SpoonLoader.jsx — រូបស្លាបព្រាវិល (loading indicator)
 * ប្រើពេលកំពុងផ្ញើ (AttendanceForm)។ role="status" + label។
 */

export default function SpoonLoader({
  label = "កំពុងចម្អិន…",
  size = 22,
  showLabel = true,
  className = "",
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="status">
      <span className="animate-spin-slow inline-block" style={{ width: size, height: size }} aria-hidden="true">
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <ellipse cx="12" cy="6" rx="4.5" ry="5" fill="#d9b44a" stroke="#b8860b" strokeWidth="1.6" />
          <rect x="10.9" y="10" width="2.2" height="12" rx="1.1" fill="#b8860b" />
        </svg>
      </span>
      {showLabel ? <span className="text-sm font-semibold">{label}</span> : <span className="sr-only">{label}</span>}
    </span>
  );
}
