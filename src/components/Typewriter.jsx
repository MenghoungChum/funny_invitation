/**
 * Typewriter.jsx — វាយអក្សរខ្មែរបន្តិចម្តងៗ
 * • បំបែកជា grapheme ដោយ Intl.Segmenter (កុំកាត់ព្យញ្ជនៈ+សញ្ញាចេញពីគ្នា)
 * • គាំទ្រ inline markup សាមញ្ញ៖ <span class="...">…</span> (មិនបង្ហាញ tag ជាអក្សរ)
 * • គោរព AnimationToggle — បើបិទ (ឬមិនទាន់ start) បង្ហាញពេញ
 * • អ្នកអានអេក្រង់អានអត្ថបទពេញ (sr-only) មិនមែនអក្សរកំពុងវាយ
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useAnimationsEnabled } from "../motion";

function segment(text) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    try {
      const seg = new Intl.Segmenter("km", { granularity: "grapheme" });
      return Array.from(seg.segment(text), (s) => s.segment);
    } catch {
      /* fall through */
    }
  }
  return Array.from(text);
}

/**
 * បំបែកអត្ថបទមាន <span class="…"> ទៅជា parts { text, className } ។
 * គាំទ្រតែ span ជាន់តែមួយ (គ្រប់គ្រាន់សម្រាប់លិខិតនេះ) — មិនប្រើ dangerouslySetInnerHTML។
 */
function parseRichText(input) {
  const source = typeof input === "string" ? input : String(input ?? "");
  const parts = [];
  const re = /<span\b([^>]*)>([\s\S]*?)<\/span>/gi;
  let last = 0;
  let m;
  while ((m = re.exec(source))) {
    if (m.index > last) parts.push({ text: source.slice(last, m.index), className: undefined });
    const cls = /class\s*=\s*(['"])(.*?)\1/i.exec(m[1]);
    parts.push({ text: m[2], className: cls ? cls[2] : undefined });
    last = re.lastIndex;
  }
  if (last < source.length) parts.push({ text: source.slice(last), className: undefined });
  return parts.filter((p) => p.text.length > 0);
}

export default function Typewriter({
  text = "",
  speed = 26,
  start = true,
  onDone,
  className = "",
}) {
  const animationsOn = useAnimationsEnabled();
  const animate = animationsOn && start;

  const segments = useMemo(() => {
    const out = [];
    for (const part of parseRichText(text)) {
      for (const g of segment(part.text)) out.push({ g, className: part.className });
    }
    return out;
  }, [text]);

  const full = segments.length;
  const plainText = useMemo(() => segments.map((s) => s.g).join(""), [segments]);

  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  const [count, setCount] = useState(() => (animate ? 0 : full));
  // បើ start / text / animation toggle ប្តូរ → reset ក្នុង render (មិន setState ក្នុង effect)
  const [runKey, setRunKey] = useState(`${animate}|${text}`);
  const nextKey = `${animate}|${text}`;
  if (runKey !== nextKey) {
    setRunKey(nextKey);
    setCount(animate ? 0 : full);
  }

  useEffect(() => {
    if (!animate) return undefined;
    const step = Math.max(1, Math.ceil(full / 140));
    let i = 0;
    const id = window.setInterval(() => {
      i += step;
      if (i >= full) {
        setCount(full);
        window.clearInterval(id);
        doneRef.current?.();
      } else {
        setCount(i);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [animate, full, speed]);

  const typing = animate && count < full;

  // ដាក់ grapheme ដែលបង្ហាញជា run តាម className តែមួយ (រក្សា style)
  const nodes = [];
  let i = 0;
  while (i < count) {
    const cls = segments[i].className;
    let j = i;
    let str = "";
    while (j < count && segments[j].className === cls) {
      str += segments[j].g;
      j += 1;
    }
    nodes.push(
      cls ? (
        <span key={i} className={cls}>
          {str}
        </span>
      ) : (
        <span key={i}>{str}</span>
      )
    );
    i = j;
  }

  return (
    <span className={className}>
      <span className="sr-only">{plainText}</span>
      <span aria-hidden="true">
        {nodes}
        {typing ? <span className="animate-pulse text-ceremonial">▌</span> : null}
      </span>
    </span>
  );
}
