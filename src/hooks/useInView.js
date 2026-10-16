/**
 * useInView.js — តាមដានថា element ចូលក្នុង viewport ឬនៅ (IntersectionObserver)
 * ប្រើសម្រាប់ trigger animation ពេល scroll ដល់ (ឧ. Typewriter)។
 * ត្រឡប់ [ref, inView]។ បើគ្មាន IntersectionObserver → ចាត់ទុកថាឃើញភ្លាម។
 */

import { useEffect, useRef, useState } from "react";

export default function useInView({ threshold = 0.2, rootMargin = "0px", once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
