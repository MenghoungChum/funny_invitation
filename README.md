# 🍚 funny-invitation — លិខិតអញ្ជើញជាផ្លូវការ (style ផ្លូវការខ្មែរ បែបកំសាន្ត)

វែបសាយតែមួយទំព័រ (static) សម្រាប់អញ្ជើញមិត្តភក្តិមកពិសាអាហារជុំគ្នា — ប្រើ **React + Tailwind CSS** (Vite)។
*English: a single-page funny invitation site (Khmer official-letter style) built with React + Tailwind.*

---

## ✨ មុខងារកំសាន្តបន្ថែម (fun extras)

- **ប៊ូតុង 🎬/🚫 (ជ្រុងខាងឆ្វេងក្រោម)** — បិទ/បើក **ចលនាទាំងអស់**។ តម្លៃដើមយកតាម OS (`prefers-reduced-motion`) ហើយចងចាំជម្រើសក្នុង `localStorage`។ ចលនាទាំងអស់ក៏ **ផ្អាកស្វ័យប្រវត្តិ** ពេល tab លាក់។
- **តួក្រពះ (mascot)** — អារម្មណ៍ `idle/hungry/excited/sad/crying/party` ជាមួយ caption ខ្មែរប្តូររៀងរាល់ ~៥វិនាទី។
- **ការរាប់ថយក្រោយ (Countdown)** — គិតទៅថ្ងៃកម្មវិធីជាលេខខ្មែរ។
- **ក្រដាសចំណាំ (StickyRule)** + **Typewriter** វាយអក្សរខ្មែរបន្តិចម្តងៗ (ប្រើ `Intl.Segmenter` — មិនកាត់ព្យញ្ជនៈ+សញ្ញា)។
- **Toast**, **ដានព្រួញកណ្តុរ (PointerTrail)**, **បេះដូងប្រេះ (HeartBreak)**, **ស្លាបព្រាវិល (SpoonLoader)**។
- **Easter egg 🥚** — ចុចលើ **ត្រាទិញ** ៥ ដង (នៅ Envelope ឬជើងលិខិត) → ភ្លៀងអាហារ + toast "រកឃើញអាថ៌កំបាំង!"។
- **កម្រងអនុសាវរីយ៍ (Memories)** — ពេលអ្នកបដិសេធមិនចូលរួម ផ្ទៃយំនឹងបង្ហាញសារ + ប៊ូតុង **"មើលកម្រងអនុសាវរីយ៍ 📸"** ដើម្បីមើលរូបភាព/វីដេអូ (មាន lightbox + ព្រួញ ← →)។ ដាក់ឯកសារក្នុង `public/assets/images/memories/` ហើយបញ្ជីឈ្មោះក្នុង `src/config.js → memories`។
- សំឡេង UI បន្ថែម (pop/thud/ding/sparkle/success/heartbreak) គោរព **🔇 mute** ដូចដើម។
- ចំនួន particle ត្រូវបានកំណត់ (≤៤០ desktop / ≤២០ ទូរស័ព្ទ) ដើម្បីឲ្យរលូន។

---

## 1. របៀបដំណើរការក្នុងម៉ាស៊ីន (Run locally)

> គម្រោងប្រើ **ES modules + Vite** → ត្រូវការ dev server (មិនដំណើរការដោយ double-click `index.html` ទេ)។

```bash
npm install       # ដំឡើង dependencies
npm run dev       # dev server (HMR) → http://localhost:5173
```

សម្រាប់ production build:

```bash
npm run build     # បង្កើត dist/
npm run preview   # មើល dist/ ក្នុងម៉ាស៊ីនតែម្តង
```

---

## 2. របៀបកំណត់ EmailJS (ជំហានជាជំហាន / step by step)

គម្រោងផ្ញើអ៊ីមែលតាម [EmailJS](https://www.emailjs.com/) **ពី browser ដោយផ្ទាល់** — គ្មាន server គ្មាន database។

1. បង្កើតគណនីឥតគិតថ្លៃនៅ **emailjs.com**។
2. **Email Services → Add New Service → Gmail** → ភ្ជាប់ Gmail របស់អ្នករៀបចំ → ចម្លង **Service ID**។
3. **Email Templates → Create template**។
   - Subject ឧ: `ការចុះឈ្មោះថ្មី៖ {{attendee_name}} - {{event_title}}`
   - Body ប្រើ variable: `{{attendee_name}}`, `{{event_title}}`, `{{event_date}}`, `{{event_time}}`, `{{event_location}}`, `{{organizer_name}}`, `{{registered_at}}` (រួមទាំង `{{signature_image}}` បើចង់ — សូមមើយកំណត់សម្គាល់ខាងក្រោម)។
   - ក្នុង **To Email** ដាក់ Gmail របស់អ្នករៀបចំ ឬ `{{to_email}}` → ចម្លង **Template ID**។
4. **Account → General** → ចម្លង **Public Key**។
5. ដាក់តម្លៃទាំងបួនទៅក្នុង `src/config.js`:

```js
emailjs: {
  publicKey: "...",        // Public Key
  serviceId: "...",        // Service ID
  templateId: "...",       // Template ID
  organizerEmail: "...",   // Gmail របស់អ្នករៀបចំ
}
```

6. **សន្តិសុខ (សំខាន់!)**:
   - ក្នុង dashboard EmailJS → ** restrict allowed domains/origins** ឲ្យតែ domain របស់អ្នក។
   - បើមាន reCAPTCHA → បើក។ កំណត់ daily/monthly limit ឲ្យតិច។
   - **កុំដាក់ EmailJS private key ឬ Gmail password ក្នុង frontend ជាដាច់ខាត** — ប្រើតែ Public Key ប៉ុណ្ណោះ។

⚠️ **កំណត់សម្គាល់រូបភាពហត្ថលេខា**: Gmail ជារឿយៗ **មិនបង្ហាញ** រូបភាព `data:` URI ក្នុង body អ៊ីមែលទេ ដូច្នេះហត្ថលេខាអាចមិនប្រាប់ឃើញក្នុង inbox។ អ៊ីមែលនៅផ្ញើឈ្មោះ + ព័ត៌មានកម្មវិធីដដែល ហើយហត្ថលេខាត្រូវបានរក្សាទុកក្នុង browser (session) សម្រាប់ confirmation letter ប៉ុណ្ណោះ។ ក្នុង EmailJS template ប្រើ `<img src="{{signature_image}}" width="300">` បើចង់សាកល្បង (សាកជាមួយ Outlook/Apple Mail បានកាន់តែប្រសើរ)។

---

## 3. របៀបជំនួសសំឡេងកំសាន្ត (Replace the sound)

- ដាក់ឯកសារ `funny.mp3` (ប្រើប្រាស់បានដោយស្របច្បាប់) នៅ: **`public/assets/sounds/funny.mp3`**
- រក្សាវែងត្រឹម **ក្រោម ៣ វិនាទី**។
- បើឯកសារអត់មាន ឬចាក់មិនបាន → គេហទំព័រ **ប្រើសំឡេង "womp womp" ពី Web Audio API ជំនួសស្ងាត់ៗ** (មិនមាន error)។

---

## 4. របៀបកែព័ត៌មានកម្មវិធី (Edit invitation details)

- **ម៉ោង / ទីតាំង / អ្នករៀបចំ / កម្មវិធី** → `src/config.js` (ផ្នែក `event`)
- **កម្រងអនុសាវរីយ៍** → ដាក់រូប/វីដេអូក្នុង `public/assets/images/memories/` រួចបញ្ជីឈ្មោះឯកសារក្នុង `src/config.js` (ផ្នែក `memories.photos` / `memories.videos`)
- **ខ្លឹមសារលិខិត (កម្មវត្ថុ, body, ក្រមកំសាន្ត)** → `src/components/InvitationLetter.jsx`
- **កាលបរិច្ឆេទ** — ថ្ងៃជាក់លាក់: `ថ្ងៃអាទិត្យ ទី២៥ ខែតុលា ឆ្នាំ២០២៦` ក្នុង `src/config.js` (`dateKhmer` / `dateISO`)

---

## 5. បញ្ជីសាកល្បង (Testing checklist)

- [ ] បើកទំព័រ → envelope បង្ហាញ + ត្រាទិញ → ចុច "បើកលិខិតអញ្ជើញ ✉️" → flap បើក → លិខិតលេចឡើង
- [ ] ចុច "អត់ទៅទេ 😭" → សំឡេងកំសាន្ត + modal "ច្បាស់ហើយមែនទេថាអត់ទៅ? 🥹"
  - [ ] ចុច "អត់ទៅមែនទេ 😭" → ភ្លើងទឹកភ្នែក 😭 rain + សារ + ប៊ូតុងមើលកម្រងអនុសាវរីយ៍ + "ត្រឡប់ទៅលិខិតវិញ" + 🔁 replay
  - [ ] ចុច "មើលកម្រងអនុសាវរីយ៍ 📸" → gallery បើក · ចុចរូប → lightbox · ← → ប្តូររូប · ESC/បិទ
  - [ ] ចុច "អូខេៗ ទៅក៏បាន 😂" → modal បិទ → ទម្រង់ចូលរួមបើក
- [ ] Modal: ESC បិទ · Tab នៅក្នុង modal · focus ត្រឡប់ទៅប៊ូតុងដែលបានចុច · ចុច backdrop បិទ
- [ ] 🔇 / 🔊 ប្តូរសំឡេង · ចងចាំក្រោយ refresh
- [ ] ឈ្មោះទទេ → "សូមបញ្ចូលឈ្មោះរបស់អ្នក" · ហត្ថលេខាទទេ → "សូមគូរហត្ថលេខា"
- [ ] គូរហត្ថលេខាដោយ **កណ្តុរ** (desktop) និង **ម្រាមដៃ** (ទូរស័ព្ទ) · បង្វិលទូរស័ព្ទ → ហត្ថលេខានៅស្ថិត
- [ ] "លុបហត្ថលេខា" → canvas ស្អាត · preview ប្តូរ
- [ ] Submit ជាមួយ config ដែលនៅមិនទាន់កំណត់ (YOUR_...) → សារ "ប្រព័ន្ធមិនទាន់រួចរាល់" (console ប្រាប់ developer)
- [ ] Submit ជាមួយ config ពិត → email ចូល Gmail + confirmation letter + confetti
- [ ] ក្តារចុច offline (DevTools) → សារ offline ស្អាត
- [ ] ចុច submit ២ ដងជាប់គ្នា → អ៊ីមែលចេញតែម្តង (in-flight lock)
- [ ] បោះពុម្ព (Ctrl+P) → មើលឃើញតែ confirmation letter (A4) · PDF download ដំណើរការ (fallback: print)
- [ ] ប្តូរ `prefers-reduced-motion` (OS setting) → animation ត្រូវបានរំលង
- [ ] 🎬/🚫 toggle → ចលនាទាំងអស់ឈប់/ត្រឡប់វិញ (ចងចាំក្រោយ refresh)
- [ ] ចុចត្រាទិញ ៥ ដង → Easter egg (ភ្លៀងអាហារ + toast)
- [ ] Countdown ដើរ · Typewriter វាយ body

---

## 6. Deployment

- **GitHub Pages**: push repo → Settings → Pages → Source: deploy from branch (`main` / `dist` ប្រសិនបើ deploy build output)
- **Netlify**: អូស folder `dist/` (បន្ទាប់ពី `npm run build`) ទៅ app.netlify.com/drop — ឬ connect repo (Build command: `npm run build`, Publish directory: `dist`)
- **Vercel**: `npm i -g vercel` → `vercel` → framework: **Other** (Vite auto-detected), no build override → deploy

---

## 7. កំណត់សម្គាល់ — frontend-only (Frontend-only limitations)

ស្មោះត្រង់នឹងអ្វីដែលគម្រោងនេះ **មិនអាចធ្វើបាន**:

- **EmailJS Public Key មើលឃើញដោយអ្នកគ្រប់គ្នា** (វានៅក្នុង browser) — អ្នកណាក៏អាចប្រើ key នោះផ្ញើអ៊ីមែលបានដែរ។ ដូចនេះ **restrict allowed domains + reCAPTCHA + quota limit** ក្នុង EmailJS dashboard ជាការការពារចាំបាច់។
- ** validation និង cooldown ខាង client មិនមែនសន្តិសុខពិតទេ** — អ្នកចេះ code អាចរំលងបាន។ ការការពារពិតប្រាកដត្រូវការ backend ដែលទុកចិត្តបាន។
- **គ្មាន database** → គ្មានបញ្ជីអ្នកចូលរួម ក្រៅពីអ៊ីមែលដែលមកដល់ inbox អ្នករៀបចំ។
- **រូបហត្ថលេខាអាចមិនបង្ហាញក្នុង Gmail** (ដូចបានរៀបរាប់ខាងលើ)។
- **ហត្ថលេខាក្នុង browser បាត់បង់ពេល refresh** (session-only)។
- **EmailJS free plan** មានកំណត់ (ចំនួនអ៊ីមែល/ខែ) — អាចអស់ពាក់កណ្តាលខែ។
- ប្រសិនបើត្រូវការការការពារ anti-abuse ដែលរឹងមាំ ត្រូវបន្ថែម backend (ឧ. serverless function + rate limit + reCAPTCHA server-side)។

---

## 8. រចនាសម្ព័ន្ធឯកសារ (Project structure)

```
funny_invitation/
├── index.html                      # lang="km", Google Fonts, EmailJS + html2pdf (CDN pinned)
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       ├── images/
│       │   ├── invitation-seal.svg   # ត្រាទិញ SVG (favicon ផង)
│       │   ├── paper.jpg             # វាយនភាពក្រដាស
│       │   ├── sign.png              # ហត្ថលេខាអ្នករៀបចំ
│       │   └── memories/             # រូប/វីដេអូកម្រងអនុសាវរីយ៍
│       └── sounds/                   # ដាក់ funny.mp3 នេះ (optional)
└── src/
    ├── main.jsx
    ├── App.jsx                     # state machine: envelope → letter → form → confirmation
    ├── config.js                   # ⭐ កែព័ត៌មានកម្មវិធី + EmailJS នៅទីនេះ
    ├── motion.js                   # store ចលនា (OS + ជម្រើសអ្នកប្រើ) + useReducedMotion
    ├── toastBus.js                 # module bus សម្រាប់ toast
    ├── audio.js                    # mp3 + Web Audio fallback + UI effect sounds
    ├── email.js                    # EmailJS send + timeout + error handling
    ├── signature.js                # SignaturePad class (pointer events, high-DPI)
    ├── index.css                   # Tailwind v4 theme + animations + print CSS
    ├── hooks/
    │   ├── useInView.js
    │   ├── useCountdown.js
    │   ├── useSound.js
    │   └── useSecretTaps.js
    └── components/
        ├── Envelope.jsx
        ├── WaxSeal.jsx
        ├── OrnamentalCorners.jsx
        ├── Stamp.jsx
        ├── InvitationLetter.jsx
        ├── MuteToggle.jsx
        ├── AnimationToggle.jsx     # 🎬/🚫 បិទ/បើកចលនា
        ├── TummyMascot.jsx         # តួក្រពះ (មានអារម្មណ៍)
        ├── FloatingFoods.jsx
        ├── Countdown.jsx
        ├── StickyRule.jsx
        ├── Typewriter.jsx
        ├── Toast.jsx
        ├── HeartBreak.jsx
        ├── Memories.jsx            # កម្រងអនុសាវរីយ៍ (gallery + lightbox)
        ├── SpoonLoader.jsx
        ├── PointerTrail.jsx
        ├── Modal.jsx               # accessible dialog (focus trap, ESC, backdrop)
        ├── DeclineModal.jsx
        ├── CryingScreen.jsx
        ├── FloatingEmojis.jsx
        ├── SignaturePadField.jsx
        ├── AttendanceForm.jsx
        ├── ConfirmationLetter.jsx
        └── Confetti.jsx
```
