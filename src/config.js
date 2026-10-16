/**
 * funny-invitation — ប្រភពតែមួយនៃការកំណត់រចនាសម្ព័ន្ធ (single source of truth)
 *
 * ចង់កែព័ត៌មានកម្មវិធី? កែត្រង់នេះ។
 * Want to edit event details? Edit here.
 *
 * សូមកុំដាក់សារធាតុសម្ងាត់ (password, private key...) ក្នុងឯកសារនេះជាដាច់ខាត។
 * Never put secrets here — the EmailJS PUBLIC key only.
 */

export const CONFIG = {
  event: {
    title: "ពិសាអាហារជុំគ្នា",
    dateISO: "2026-10-25",
    dateKhmer: "ថ្ងៃអាទិត្យ ទី២៥ ខែតុលា ឆ្នាំ២០២៦",
    // ឧ. "ម៉ោង ៦:០០ ល្ងាច" — កែតាមត្រូវការរបស់អ្នក
    time: "ម៉ោង ៦:០០ ល្ងាច",
    // ឧ. "ភោជនីយដ្ឋាន សុខាភោជនា" — កែតាមត្រូវការ
    location: "ភោជនីយដ្ឋាន ផ្ទះម៉ាក់មីង",
    // ឈ្មោះអ្នករៀបចំ
    organizer: "ជុំ ម៉េងហ៊ួង",
  },
  emailjs: {
    // ⚠️ ដាក់តម្លៃពិតៗរបស់អ្នក (Public Key ពី dashboard EmailJS)
    publicKey: "JFyf4Gm9MNDW9L8_J",
    serviceId: "service_hjyh6hd",
    templateId: "template_mtautmv",
    // Gmail របស់អ្នករៀបចំ — ក៏ដាក់ក្នុង "To Email" នៅក្នុង template ដែរ
    organizerEmail: "menghoung262006@gmail.com",
  },
  sound: { file: "assets/sounds/funny.mp3" },
};

/** ត្រឡប់ true ប្រសិនបើ EmailJS នៅមិនទាន់បានកំណត់ (តម្លៃ placeholder នៅសេសសល់) */
export function isPlaceholder(value) {
  return typeof value !== "string" || value.trim() === "" || value.includes("YOUR_");
}
