/**
 * Stamp.jsx — ត្រាក្រហមបញ្ឆោះ (tilted red round stamp)
 * ឧ. "បន្ទាន់បំផុត!" និង "អនុម័តដោយក្រពះ" — stamp-in animation ពេលលិខិតបង្ហាញខ្លួន។
 */

export default function Stamp({ text, size = 132, delay = 0.6, className = "" }) {
  const r = 50;
  return (
    <div
      className={`animate-stamp-in select-none ${className}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{ mixBlendMode: "multiply", opacity: 0.9 }}
      >
        <g transform="rotate(-14 60 60)">
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#9e1b1b"
            strokeWidth="5"
          />
          <circle
            cx="60"
            cy="60"
            r={r - 8}
            fill="none"
            stroke="#9e1b1b"
            strokeWidth="1.8"
            strokeDasharray="5 4"
          />
          <circle cx="60" cy="60" r={r - 16} fill="none" stroke="#9e1b1b" strokeWidth="2.6" />
          <foreignObject x="18" y="38" width="84" height="44">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                color: "#9e1b1b",
                fontFamily: '"Moul", "Noto Serif Khmer", serif',
                fontSize: text && text.length > 10 ? "11px" : "15px",
                lineHeight: 1.35,
                letterSpacing: "0.5px",
              }}
            >
              {text}
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}
