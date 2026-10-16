/**
 * SignaturePadField.jsx — React wrapper សម្រាប់ SignaturePad (src/signature.js)
 * បង្ហាញ canvas + ប៊ូតុងលុប + preview តូច (ផ្ទុកឡើងថ្មីៗនៅពេលសរសេរបញ្ចប់ stroke)។
 * forwardRef → parent ហៅ clear() / isEmpty() / toDataURL() / toCompactDataURL() បាន។
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SignaturePad } from "../signature";

const SignaturePadField = forwardRef(function SignaturePadField(
  { label = "ហត្ថលេខា", error, describedBy },
  ref
) {
  const canvasRef = useRef(null);
  const padRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [empty, setEmpty] = useState(true);

  useImperativeHandle(
    ref,
    () => ({
      clear() {
        padRef.current?.clear();
        setPreview(null);
        setEmpty(true);
      },
      isEmpty() {
        return padRef.current ? padRef.current.isEmpty() : true;
      },
      toDataURL(type) {
        return padRef.current ? padRef.current.toDataURL(type) : null;
      },
      toCompactDataURL(maxWidth, quality) {
        return padRef.current ? padRef.current.toCompactDataURL(maxWidth, quality) : null;
      },
    }),
    []
  );

  // បង្កើត pad ម្តងគត់; cleanup លុប listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const pad = new SignaturePad(canvas, {
      onChange: (instance) => {
        setEmpty(instance.isEmpty());
        // preview បន្តិចបន្តួច — update នៅ stroke end (onChange បានហៅពេល pointerup)
        if (!instance.isEmpty()) {
          setPreview(instance.toCompactDataURL(220, 0.7));
        } else {
          setPreview(null);
        }
      },
    });
    padRef.current = pad;
    return () => {
      pad.destroy();
      padRef.current = null;
    };
  }, []);

  // resize ពេល viewport ប្តូរ (ឧ. បង្វិលទូរស័ព្ទ) — រក្សាការគូរ
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof ResizeObserver === "undefined") {
      const onResize = () => padRef.current?.resize();
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
      };
    }
    const ro = new ResizeObserver(() => {
      padRef.current?.resize();
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor="signature-canvas" className="font-semibold text-ink">
          {label} <span className="text-ceremonial" aria-hidden="true">*</span>
        </label>
        <button
          type="button"
          onClick={() => padRef.current?.clear()}
          className="min-h-11 rounded border border-gold/60 bg-paper px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-paper-dark hover:text-ink"
        >
          លុបហត្ថលេខា
        </button>
      </div>

      <div
        className={`relative overflow-hidden rounded-md border-2 bg-white shadow-inner ${
          error ? "border-ceremonial" : "border-gold/60"
        }`}
      >
        <canvas
          id="signature-canvas"
          ref={canvasRef}
          className="block h-44 w-full cursor-crosshair touch-none select-none"
          aria-describedby={describedBy}
          role="img"
          aria-label="កន្ត្រៃសរសេរហត្ថលេខា — គូរដោយកណ្តុរ ម្រាមដៃ ឬ pen"
        />
        {empty ? (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-ink-soft/60">
            …សូមគូរហត្ថលេខានៅទីនេះ
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-14 w-28 items-center justify-center overflow-hidden rounded border border-dashed border-gold/50 bg-white/80">
          {preview ? (
            <img src={preview} alt="ស្លាយហត្ថលេខា" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-ink-soft/70">ស្លាយហត្ថលេខា</span>
          )}
        </div>
        <p className="text-xs leading-relaxed text-ink-soft">
          ស្លាយបង្ហាញផ្ទាល់ខ្លួន នឹងបន្តិចបន្តួចបន្ទាប់ពីគូរបញ្ចប់។
        </p>
      </div>

      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-ceremonial">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default SignaturePadField;
