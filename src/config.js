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
  // កម្រងអនុសាវរីយ៍ — ដាក់ឯកសារក្នុង public/assets/images/memories/
  // (បង្ហាញពេលអ្នកបដិសេធមិនចូលរួម)
  memories: {
    title: "កម្រងអនុសាវរីយ៍",
    dir: "/assets/images/memories",
    photos: [
      "790589693_1595468779036817_6374375678876526321_n.jpg",
      "802241724_4600674783479549_1347221638130372648_n.jpg",
      "806234304_1767526991129625_7659123398679670173_n.jpg",
      "807083487_1606249344289305_7141343125548331858_n.jpg",
      "810556100_1024057107349321_8790130974737168505_n.jpg",
      "817117323_1832093864340598_5778368082656173849_n.jpg",
      "818583202_2465376347282396_8320179965726542153_n.jpg",
    ],
    videos: [
      "AQPFoTRqhY9uYhSaAC8OaxPrmFWim78z3cqC-U_uHk3YhfENtXLhVI1IXT1-gwZW_aWp0gOTtdtW6G4Nx8L3cOW4aR3Q692Szl_Kv8GXrw.mp4",
    ],
  },
};

/** ត្រឡប់ true ប្រសិនបើ EmailJS នៅមិនទាន់បានកំណត់ (តម្លៃ placeholder នៅសេសសល់) */
export function isPlaceholder(value) {
  return typeof value !== "string" || value.trim() === "" || value.includes("YOUR_");
}
