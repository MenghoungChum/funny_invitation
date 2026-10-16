/**
 * email.js — ការផ្ញើអ៊ីមែលតាម EmailJS (browser SDK)
 *
 * • ផ្ញើតែនៅពេលអ្នកប្រើប្រាស់ចុច "បញ្ជាក់ការចូលរួម" — មិនដែលផ្ញើនៅពេល load ទេ។
 * • មិនដែល throw ទៅ UI — return { ok, message, code? } ជានិច្ច។
 * • បើ signature ធំពេក (~40KB) → រំលង variable signature ដោយស្វ័យប្រវត្តិ ប៉ុន្តែឈ្មោះ+ព័ត៌មាន នៅផ្ញើដដែល។
 *
 * ⚠️ កំណត់: Gmail ជារឿយៗ "បដិសេធ" រូបភាព data: URI ក្នុង body អ៊ីមែល ដូច្នេះហត្ថលេខា
 * អាចមិនបង្ហាញក្នុង inbox — ហត្ថលេខានៅត្រូវបានរក្សាទុកក្នុង memory សម្រាប់ confirmation letter ក្នុង session នេះ។
 */

import { CONFIG, isPlaceholder } from "./config";

const TIMEOUT_MS = 15000;
const SIGNATURE_MAX_BYTES = 40 * 1024;

let initTried = false;

export function isEmailConfigured() {
  const { publicKey, serviceId, templateId, organizerEmail } = CONFIG.emailjs;
  return !(
    isPlaceholder(publicKey) ||
    isPlaceholder(serviceId) ||
    isPlaceholder(templateId) ||
    isPlaceholder(organizerEmail)
  );
}

/** កាលបរិច្ឆេទ/ម៉ោង ជាភាសាខ្មែរ — timezone Asia/Phnom_Penh */
export function formatRegisteredAt(date = new Date()) {
  const opts = {
    timeZone: "Asia/Phnom_Penh",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  try {
    return new Intl.DateTimeFormat("km-KH", opts).format(date) + " (ម៉ោងស្តង់ដារកម្ពុជា)";
  } catch {
    try {
      return new Intl.DateTimeFormat("en-GB", opts).format(date) + " (Asia/Phnom_Penh)";
    } catch {
      return date.toISOString();
    }
  }
}

function estimateBytes(dataUrl) {
  if (typeof dataUrl !== "string") return 0;
  const comma = dataUrl.indexOf(",");
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

function withTimeout(promise, ms, code) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = window.setTimeout(() => reject({ code, message: "timeout" }), ms);
  });
  // កុំឲ្យ timeout rejection ធ្វើ unhandled rejection នៅលើ promise ដើម
  promise.catch(() => {});
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timer));
}

function ensureInit(emailjs) {
  if (initTried) return;
  initTried = true;
  try {
    if (typeof emailjs.init === "function") {
      emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
    }
  } catch (err) {
    console.warn("[EmailJS] init បរាជ័យ:", err);
  }
}

function friendlyError(err) {
  const code = err?.code || err?.name || "";
  if (code === "timeout") {
    return "ការផ្ញើអ៊ីមែលចំណាយពេលយូរពេក។ សូមព្យាយាមម្តងទៀត។";
  }
  if (code === "offline") {
    return "ហ៊ានអ៊ីនធឺណិតមិនបាន។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។";
  }
  const status = err?.status;
  if (status === 400) {
    return "ប្រព័ន្ធអ៊ីមែលមិនត្រូវបានកំណត់យ៉ាងត្រឹមត្រូវ (Service ឬ Template ID)។ សូមជូនដំណឹងដល់អ្នករៀបចំ។";
  }
  if (status === 401 || status === 403) {
    return "សិទ្ធិអ៊ីមែលមិនត្រឹមត្រូវ ឬ domain មិនបានអនុញ្ញាត។ សូមជូនដំណឹងដល់អ្នករៀបចំ។";
  }
  if (status === 429) {
    return "ផ្ញើច្រើនពេកក្នុងរយៈពេលខ្លី។ សូមរង់ចាំបន្តិច ហើយព្យាយាមម្តងទៀត។";
  }
  if (typeof err?.text === "string" && err.text) {
    return "មិនអាចផ្ញើអ៊ីមែលបាន។ សូមព្យាយាមម្តងទៀត។";
  }
  return "មិនអាចផ្ញើអ៊ីមែលបាន។ សូមព្យាយាមម្តងទៀត ឬទាក់ទងអ្នករៀបចំដោយផ្ទាល់។";
}

/**
 * ផ្ញើការចុះឈ្មោះចូលរួម។
 * @returns {Promise<{ok: boolean, message: string, code?: string}>}
 */
export async function sendRegistration({ attendeeName, signatureDataUrl }) {
  if (!isEmailConfigured()) {
    console.warn(
      "[EmailJS] មិនទាន់កំណត់រចនាសម្ព័ន្ធ — សូមបំពេញ publicKey, serviceId, templateId និង organizerEmail ក្នុង src/config.js (តម្លៃដើមចាប់ផ្តើមដោយ YOUR_)"
    );
    return {
      ok: false,
      code: "not-configured",
      message: "ប្រព័ន្ធមិនទាន់រួចរាល់។ សូមជូនដំណឹងដល់អ្នករៀបចំ ឬព្យាយាមម្តងទៀត។",
    };
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return {
      ok: false,
      code: "offline",
      message: "ហ៊ានអ៊ីនធឺណិតមិនបាន។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។",
    };
  }

  const emailjs = window.emailjs;
  if (!emailjs || typeof emailjs.send !== "function") {
    return {
      ok: false,
      code: "sdk-missing",
      message: "ប្រព័ន្ធអ៊ីមែលមិនទាន់ផ្ទុកឡើង។ សូមព្យាយាមម្តងទៀត។",
    };
  }

  ensureInit(emailjs);

  const params = {
    event_title: CONFIG.event.title,
    attendee_name: attendeeName,
    event_date: CONFIG.event.dateKhmer,
    event_time: CONFIG.event.time,
    event_location: CONFIG.event.location,
    organizer_name: CONFIG.event.organizer,
    to_email: CONFIG.emailjs.organizerEmail,
    registered_at: formatRegisteredAt(),
  };

  if (signatureDataUrl) {
    const bytes = estimateBytes(signatureDataUrl);
    if (bytes <= SIGNATURE_MAX_BYTES) {
      params.signature_image = signatureDataUrl;
    } else {
      console.info(
        `[EmailJS]ហត្ថលេខាធំពេក (~${Math.round(bytes / 1024)}KB) — រំលង variable signature ប៉ុន្តែនៅផ្ញើឈ្មោះនិងព័ត៌មាន។`
      );
    }
  }

  try {
    const sendPromise = emailjs.send(
      CONFIG.emailjs.serviceId,
      CONFIG.emailjs.templateId,
      params,
      { publicKey: CONFIG.emailjs.publicKey }
    );
    const result = await withTimeout(sendPromise, TIMEOUT_MS, "timeout");
    return { ok: true, message: "ផ្ញើដោយជោគជ័យ!", data: result };
  } catch (err) {
    console.error("[EmailJS] ការផ្ញើបរាជ័យ:", err);
    return { ok: false, code: err?.code || "send-failed", message: friendlyError(err) };
  }
}
