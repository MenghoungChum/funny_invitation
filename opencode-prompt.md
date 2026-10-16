You are a senior frontend engineer. Build a complete, working, responsive static website called **funny-invitation** inside the current working directory. Create every file on disk with full code (no placeholders like "add your code here", no pseudocode). When finished, run a quick sanity check (e.g. `node --check` on each JS file) and print a short summary of what you created.

## 1. Resolved decisions (follow these, they override any ambiguity)

- Stack: react js and tailwind css, frontend only**. No custom server, no database.
- Allowed CDN libraries only: **EmailJS browser SDK** and (optionally) **html2pdf.js** for PDF download. Pin versions. If the PDF library fails to load, fall back to `window.print()` ("Save as PDF" in the print dialog).
- Khmer Unicode must render correctly: load **Noto Sans Khmer** (and optionally **Noto Serif Khmer** / **Moul** for headings) from Google Fonts, with sensible fallbacks.
- Event date is fixed: **Sunday, 25 October 2026 (2026-10-25)**. Display it in Khmer: "ថ្ងៃអាទិត្យ ទី២៥ ខែតុលា ឆ្នាំ២០២៦".

## 2. Project structure


Do not reference files that don't exist without a fallback:
- `funny.mp3`: you cannot create a real mp3. Generate the sound with the **Web Audio API** as a built-in fallback (e.g. a short "sad trombone" / "womp womp" made from oscillators). The code should first try `assets/sounds/funny.mp3`; if it is missing or playback is blocked, silently use the Web Audio fallback; if that also fails, just skip the sound without errors. Add a `README.md` note explaining how to drop in their own licensed mp3.
- `invitation-seal.png`: create `assets/images/invitation-seal.svg` instead (a red wax seal drawn in SVG) and use that. No missing-image icons anywhere.

## 3. Visual design

Elegant Cambodian official-document look with a playful twist:
- Warm cream/ivory paper background with subtle texture (CSS gradients/noise, no heavy images).
- Red, gold, and dark brown accents. Decorative double border with ornamental corners (pure CSS/SVG).
- Official layout: header ("ព្រះរាជាណាចក្រកម្ពុជា / ជាតិ សាសនា ព្រះមហាក្សត្រ" style header is optional and must stay tasteful), title, document number, subject line ( កម្មវត្ថុ), body, event details, rules, signature block.
- A tilted red round stamp: "បន្ទាន់បំផុត!" with a second smaller stamp "អនុម័តដោយក្រពះ" (stamp-in animation when the letter appears).
- Smooth, tasteful animations only (envelope open, letter slide-up, button hover wiggle, floating emojis). Keep it light and fast.
- Responsive: desktop, tablet, small mobile (320px). No horizontal scroll.
- Respect `prefers-reduced-motion` (disable/shorten animations).
- Visible focus states, good contrast, large tap targets (≥44px).

## 4. Screens and content (Khmer primary)

### 4.1 Envelope screen (first screen)
A sealed envelope with the wax seal and a button "បើកលិខិតអញ្ជើញ ✉️". On click: flap-open animation (~1s), then reveal the letter. Skip animation if reduced-motion.

### 4.2 Invitation letter
- Title: **លិខិតអញ្ជើញជាផ្លូវការ**
- Number: **លេខ៖ ០០៧/ញ៉ាំ/២០២៦**
- Subject: **កម្មវត្ថុ៖ សូមអញ្ជើញមិត្តជាទីស្រឡាញ់មកចូលរួមពិសាអាហារជុំគ្នា។**
- Body: "យោងតាមការប្រជុំបន្ទាន់របស់គណៈកម្មការក្រពះឃ្លាន សម្រេចអញ្ជើញមិត្តទាំងអស់មកចូលរួមពិសាអាហារជុំគ្នា។ មិត្តគ្រប់រូបសូមចូលរួមដោយស្ម័គ្រចិត្ត ហើយសូមកុំប្រើលេសថារវល់ ឬអត់ឃ្លាន។"
- Event details (read from config): date (fixed), time, location, organizer.
- A few friendly funny rules, e.g.:
  1. មកយឺត = អង្គុយមើលមិត្តភក្តិញ៉ាំសិន 😆
  2. ហាមនិយាយថា "អត់ឃ្លានទេ" ព្រោះក្រពះគណៈកម្មការមិនជឿ
  3. អ្នកណាមកមុន មានសិទ្ធិជ្រើសរើសកៅអីល្អជាងគេ
- A visible note that attendance is **voluntary** (ស្ម័គ្រចិត្ត). Humor must be friendly; never threatening or coercive.
- At the bottom two prominent buttons: **ខ្ញុំចូលរួម 😂** (primary, green/gold) and **អត់ទៅទេ 😭** (secondary, red). Distinct but harmonious.
- A small mute/unmute toggle (🔊/🔇) fixed in a corner, remembering the choice in memory (localStorage optional inside try/catch).

## 5. Interaction flows

### 5.1 "អត់ទៅទេ 😭"
1. Play the funny sound (respect mute).
2. Open an accessible modal: **"ច្បាស់ហើយមែនទេថាអត់ទៅ? 🥹"** with two buttons:
   - **អត់ទៅមែនទេ 😭**
   - **អូខេៗ ទៅក៏បាន 😂**
3. If "អត់ទៅមែនទេ 😭": show a crying emoji rain animation (😭😭😭) and the message **"អូហូ! មិត្តសម្លាញ់ចិត្តដាច់ម្ល៉េះ! ក្រពះយើងខូចចិត្តហើយ! 💔"**, plus a button "ត្រឡប់ទៅលិខិតវិញ" that returns to the invitation. Add a replay-sound button (🔁) in this state.
4. If "អូខេៗ ទៅក៏បាន 😂": close the modal and open the attendance form.
- Modal requirements: `role="dialog"`, `aria-modal="true"`, focus moves into modal and is trapped, ESC closes (returns to invitation), focus returns to the triggering button, backdrop click closes.
- Tone: playful, never aggressive. No data is sent or stored when someone declines.

### 5.2 "ខ្ញុំចូលរួម 😂" → Attendance form (modal or section)
Fields:
1. **ឈ្មោះពេញ** — required, trimmed, 2–60 characters, Khmer/Latin letters, spaces and basic punctuation allowed. Reject empty/whitespace-only and strip control characters.
2. **ហត្ថលេខា** — required **canvas** handwritten signature (NOT a text input).
3. Button **"លុបហត្ថលេខា"** to clear.
4. A live **signature preview** (small image, updated on stroke end).
5. Submit button: **"បញ្ជាក់ការចូលរួម"**.

Signature pad (`js/signature.js`), exported as a small class/module:
- Pointer Events (`pointerdown/move/up/cancel`) with `setPointerCapture`; works for mouse, touch, pen.
- CSS `touch-action: none` on the canvas to prevent scroll while drawing.
- High-DPI: scale by `devicePixelRatio`; resize on window resize/orientation change without losing the drawing (redraw from stored strokes or snapshot).
- Smooth lines (quadratic curves), round caps, dark ink on transparent or white background.
- API: `clear()`, `isEmpty()`, `toDataURL()` (full-res PNG), `toCompactDataURL(maxWidth, quality)` (downscaled JPEG/PNG for email), events/callback `onChange`.
- "Empty" detection must be based on strokes drawn (not just pixel check on blank).

### 5.3 Submission
1. Validate name + signature; show inline accessible error messages (`aria-live`) in Khmer, e.g. "សូមបញ្ចូលឈ្មោះរបស់អ្នក", "សូមគូរហត្ថលេខា".
2. Disable the submit button and show a loading state ("កំពុងផ្ញើ...") while sending; ignore repeated clicks (in-flight lock).
3. Send via EmailJS (`js/email.js`). Only send on explicit submit — never on page load or open.
4. **Show success only after EmailJS resolves successfully.** On failure show a clear Khmer error with a "ព្យាយាមម្តងទៀត" retry; never claim the email was sent if it failed. Handle: not configured (placeholders still present → show a friendly developer-facing message in console and a user-facing "ប្រព័ន្ធមិនទាន់រួចរាល់"), offline (`navigator.onLine`), timeout (~15s), and EmailJS error codes/text.
5. Optional simple client-side cooldown (e.g. block resubmission for 30s after success, and limit to 3 attempts per session) to reduce accidental spam. Explain it is not real security.
6. On success: show a **confirmation letter** (same paper style) containing: event title, date, time, location, attendee full name, attendee's handwritten signature image, registration timestamp, and the message **"សូមអបអរសាទរ! អ្នកបានចុះឈ្មោះចូលរួមដោយជោគជ័យ! 🎉"** with a light confetti animation (CSS/canvas, reduced-motion aware).
7. Buttons on the confirmation: **បោះពុម្ព** (`window.print()`), **ទាញយកជា PDF** (html2pdf.js, with print fallback), **ត្រឡប់ទៅលិខិតអញ្ជើញ**.
8. Print CSS (`@media print`): hide buttons, mute toggle, modals, envelope, background effects; show only the confirmation letter, A4, black/cream-friendly colors, `print-color-adjust: exact` for borders/stamp, avoid page breaks inside the letter.
9. Escape all user-provided text when inserting into the DOM (use `textContent`, never `innerHTML` with user input).

## 6. `js/config.js` (single source of truth)

Export a config object with clearly commented placeholders:

```js
export const CONFIG = {
  event: {
    title: "ពិសាអាហារជុំគ្នា",
    dateISO: "2026-10-25",
    dateKhmer: "ថ្ងៃអាទិត្យ ទី២៥ ខែតុលា ឆ្នាំ២០២៦",
    time: "YOUR_EVENT_TIME",        // e.g. "ម៉ោង ៦:០០ ល្ងាច"
    location: "YOUR_VENUE",         // e.g. "ភោជនីយដ្ឋាន ..."
    organizer: "YOUR_NAME"
  },
  emailjs: {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID",
    organizerEmail: "YOUR_GMAIL@gmail.com"   // placeholder; also set as "To Email" in the template
  },
  sound: { file: "assets/sounds/funny.mp3" }
};
```

Rules: never include a Gmail password, EmailJS **private** key, or any secret. Only the public key. Detect unconfigured placeholders (values starting with `YOUR_`) and handle gracefully.

## 7. EmailJS integration (`js/email.js`)

- Load SDK from a pinned CDN `<script>` in `index.html` and call `emailjs.init({ publicKey })`.
- `emailjs.send(serviceId, templateId, params)` with params:
  `event_title, attendee_name, event_date, event_time, event_location, organizer_name, to_email, registered_at` (Khmer-friendly formatted timestamp, timezone Asia/Phnom_Penh), `signature_image` (compact data URL, optional).
- Keep the total request small: EmailJS limits variable payload size (~50KB), so downscale the signature (e.g. 300px wide JPEG/PNG, quality ~0.7) and **skip the signature variable automatically if it exceeds ~40KB**, still sending the name and details.
- Note: Gmail typically blocks `data:` URI images in `<img>` tags inside email bodies, so the signature may not display. Document this limitation clearly. If the signature cannot reliably be emailed, the email contains name + registration details, and the signature is kept in memory for the confirmation letter during the current session only.
- Return a result object `{ ok: boolean, message: string }`; never throw to the UI.

## 8. Accessibility & quality

- Semantic HTML (`header`, `main`, `section`, `form`, `label`, `button`, `dialog`-like roles), `lang="km"`, proper `<title>` and meta viewport.
- All controls keyboard operable; labels for inputs; `aria-live` regions for errors/status; accessible names for emoji-only buttons (mute toggle).
- No console errors on load. Readable, commented, modular JS (separate invitation logic, signature logic, email logic). No unnecessary dependencies.
- Graceful audio: handle autoplay policy (play only inside click handlers), missing file, and decode errors.

## 9. Documentation to generate (`README.md`)

Write a Khmer-first (with short English hints) README containing:
1. **How to run locally**: open with a static server (`python3 -m http.server 8000` or `npx serve`), note ES modules need a server (not `file://`) — OR avoid modules and use plain scripts so double-click works; pick one and state it.
2. **EmailJS setup, step by step**:
   - Create an account at emailjs.com.
   - Email Services → Add New Service → Gmail → connect the organizer's Gmail → copy **Service ID**.
   - Email Templates → Create template. Subject example: `ការចុះឈ្មោះថ្មី៖ {{attendee_name}} - {{event_title}}`. Body uses `{{attendee_name}}, {{event_title}}, {{event_date}}, {{event_time}}, {{event_location}}, {{registered_at}}`. Set **To Email** to the organizer's Gmail (or `{{to_email}}`). Copy **Template ID**.
   - Account → General → copy the **Public Key**.
   - Put the three IDs and the Gmail into `js/config.js`.
   - Security: in the EmailJS dashboard restrict allowed domains/origins where available, enable reCAPTCHA if offered, set a monthly/daily limit, never use or expose the private key in frontend code.
3. **Replace the sound**: drop a licensed `funny.mp3` into `assets/sounds/`; mention keeping it short (<3s) and that the Web Audio fallback is used otherwise.
4. **Edit invitation details**: time, venue, organizer in `config.js`; body text in `index.html`.
5. **Testing checklist**: envelope opens; "អត់ទៅទេ" → modal → decline again → crying animation → return; "អត់ទៅទេ" → "អូខេៗ ទៅក៏បាន" → form opens; mute/replay; empty name and empty signature validation; sign with mouse on desktop; sign with finger on a phone (and rotate the phone); clear signature; submit with placeholders (expect friendly not-configured message); submit with real config (expect email in Gmail + confirmation letter); simulate offline; double-click submit (only one email); print preview hides UI; PDF download.
6. **Deployment**: GitHub Pages (push repo, Settings → Pages → deploy from branch), Netlify (drag-and-drop the folder), Vercel (`vercel` CLI or import repo; framework "Other", no build command).
7. **Frontend-only limitations** (state honestly): the EmailJS public key is visible to everyone, so anyone can technically send emails with it; client-side validation and cooldown are not real protection; free-plan quotas apply; no database means no attendee list apart from emails; signature images may not appear in Gmail; the session-only signature is lost on refresh. Mention that a trusted backend would be needed for strong anti-abuse guarantees.

## 10. Final output requirements

- Create all files listed, with complete working code.
- At the end, print the folder tree and the exact commands to run the project locally.
- Do not skip any feature above. Keep humor friendly, attendance voluntary, and the UI fast and polished.
