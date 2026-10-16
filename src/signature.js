/**
 * signature.js — SignaturePad
 *
 * Canvas ហត្ថលេខាដែលប្រើ Pointer Events (mouse / touch / pen)។
 * • high-DPI (devicePixelRatio) + redraw ពី strokes ពេល window resize
 * • បន្ទាត់រលោក (quadratic curves, round caps)
 * • isEmpty() ផ្អែកលើ strokes ដែលបានគូរ មិនមែន pixel check ទេ
 * API: clear(), isEmpty(), toDataURL(), toCompactDataURL(maxWidth, quality), onChange
 */

export class SignaturePad {
  constructor(canvas, options = {}) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError("SignaturePad ត្រូវការ <canvas> element");
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.color = options.color || "#2b1d12";
    this.minWidth = options.minWidth ?? 1.4;
    this.maxWidth = options.maxWidth ?? 3.2;
    this.onChange = typeof options.onChange === "function" ? options.onChange : null;

    /** @type {Array<Array<{x:number,y:number}>>}  strokes ក្នុង CSS-space (logical) coordinates */
    this._strokes = [];
    this._current = null;
    this._drawing = false;

    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    this.canvas.addEventListener("pointerdown", this._onPointerDown);
    this.canvas.addEventListener("pointermove", this._onPointerMove);
    this.canvas.addEventListener("pointerup", this._onPointerUp);
    this.canvas.addEventListener("pointercancel", this._onPointerUp);
    // កុំឲ្យមាន "touch scrolling" ខណៈកំពុងគូរ (ក៏កំណត់ក្នុង CSS: touch-action: none)
    this.canvas.style.touchAction = "none";

    this.resize();
  }

  /* ---------------- geometry ---------------- */

  /** high-DPI resize ដោយរក្សាការគូរ (redraw ពី strokes ដែលបានរក្សាទុក) */
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const cssW = Math.max(1, Math.round(rect.width || this.canvas.clientWidth || 1));
    const cssH = Math.max(1, Math.round(rect.height || this.canvas.clientHeight || 1));
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    this._cssWidth = cssW;
    this._cssHeight = cssH;
    this._dpr = dpr;
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this._redraw();
  }

  _redraw() {
    const ctx = this.ctx;
    ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);
    ctx.clearRect(0, 0, this._cssWidth, this._cssHeight);
    for (const stroke of this._strokes) this._drawStroke(stroke);
    if (this._current) this._drawStroke(this._current);
  }

  _drawStroke(points) {
    if (!points || points.length === 0) return;
    const ctx = this.ctx;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (points.length === 1) {
      // ចំណុចតែមួយ (tap) → ចំណុចតូចមួយ
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, this.maxWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.lineWidth = (this.minWidth + this.maxWidth) / 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
      const p = points[i];
      const next = points[i + 1];
      const midX = (p.x + next.x) / 2;
      const midY = (p.y + next.y) / 2;
      ctx.quadraticCurveTo(p.x, p.y, midX, midY);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }

  _eventToLogical(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * this._cssWidth,
      y: ((e.clientY - rect.top) / rect.height) * this._cssHeight,
    };
  }

  /* ---------------- pointer events ---------------- */

  _onPointerDown(e) {
    if (typeof e.button === "number" && e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    try {
      this.canvas.setPointerCapture(e.pointerId);
    } catch {
      /* ប្រសិនបើ browser មិនគាំទ្រ — គ្រាន់តែគូរដោយផ្ទាល់ */
    }
    this._drawing = true;
    this._current = [this._eventToLogical(e)];
    this._redraw();
  }

  _onPointerMove(e) {
    if (!this._drawing || !this._current) return;
    e.preventDefault();
    const last = this._current[this._current.length - 1];
    // រំលងចំណុចស្ទួន/ស្ទះ (coalesced events ជួយបន្ទាត់រលោកជាង)
    const events = typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [e];
    for (const ev of events) {
      const p = this._eventToLogical(ev);
      const dx = p.x - last.x;
      const dy = p.y - last.y;
      if (dx * dx + dy * dy < 0.6) continue;
      this._current.push(p);
      last.x = p.x;
      last.y = p.y;
    }
    // គូរ segment ចុងក្រោយតែម្តង (incremental) — រក្សារលោកដោយគូរបន្តពី midpoints
    this._redraw();
  }

  _onPointerUp(e) {
    if (!this._drawing) return;
    e.preventDefault();
    this._drawing = false;
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (this._current && this._current.length > 0) {
      this._strokes.push(this._current);
    }
    this._current = null;
    this._redraw();
    this._emitChange();
  }

  _emitChange() {
    if (this.onChange) {
      try {
        this.onChange(this);
      } catch (err) {
        console.error("SignaturePad onChange error:", err);
      }
    }
  }

  /* ---------------- public API ---------------- */

  clear() {
    this._strokes = [];
    this._current = null;
    this._drawing = false;
    this._redraw();
    this._emitChange();
  }

  /** true ប្រសិនបើគ្មាន stroke ណាត្រូវបានគូរ (ផ្អែកលើ strokes មិនមែន pixels) */
  isEmpty() {
    return this._strokes.length === 0;
  }

  /** PNG ទំហំពេញ (DPR-scaled) សម្រាប់ confirmation letter */
  toDataURL(type = "image/png") {
    return this.canvas.toDataURL(type);
  }

  /** JPEG/PNG តូច សម្រាប់អ៊ីមែល (default 300px ទទឹង, quality 0.7) — background ពណ៌ស */
  toCompactDataURL(maxWidth = 300, quality = 0.7) {
    const srcW = this.canvas.width;
    const srcH = this.canvas.height;
    const scale = Math.min(1, maxWidth / srcW);
    const outW = Math.max(1, Math.round(srcW * scale));
    const outH = Math.max(1, Math.round(srcH * scale));
    const off = document.createElement("canvas");
    off.width = outW;
    off.height = outH;
    const octx = off.getContext("2d");
    octx.fillStyle = "#ffffff";
    octx.fillRect(0, 0, outW, outH);
    octx.drawImage(this.canvas, 0, 0, outW, outH);
    return off.toDataURL("image/jpeg", quality);
  }

  destroy() {
    this.canvas.removeEventListener("pointerdown", this._onPointerDown);
    this.canvas.removeEventListener("pointermove", this._onPointerMove);
    this.canvas.removeEventListener("pointerup", this._onPointerUp);
    this.canvas.removeEventListener("pointercancel", this._onPointerUp);
    this._strokes = [];
    this._current = null;
  }
}

export default SignaturePad;
