export type Locale = "en" | "kn" | "hi";

export const locales: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "kn", label: "KN" },
  { id: "hi", label: "HI" },
];

const en = {
  nav: { home: "Home", ledger: "Ledger", map: "Map", gigpay: "GigPay", welfare: "ShramSetu" },
  dashboard: {
    greeting: "Namaste",
    todayEarnings: "Today's Earnings",
    kept: "100% Kept • Zero Commission",
    trips: "trips",
    driving: "h driving",
    uploadScreenshot: "Upload Screenshot",
    ocrParser: "OCR multi-app parser",
    viewLedger: "View full ledger",
    smartRouting: "Smart Routing",
    online: "ONLINE",
    offline: "OFFLINE",
  },
  ledger: {
    title: "Driver Ledger",
    subtitle: "Your earnings graph — owned by you",
    thisWeek: "This week",
    allTime: "All time",
    byPlatform: "By platform",
    export: "Export CSV",
    addEarnings: "Add earnings",
    noEntries: "No earnings yet. Upload a screenshot to start.",
    entries: "entries",
  },
  ocr: {
    title: "Screenshot OCR",
    upload: "Tap to upload screenshot",
    parse: "Upload & Parse",
    confirm: "Confirm & save to ledger",
    review: "Review before saving",
  },
  common: { powered: "POWERED BY GIGAI BHARAT" },
} as const;

const kn: typeof en = {
  nav: { home: "ಮನೆ", ledger: "ಲೆಡ್ಜರ್", map: "ನಕ್ಷೆ", gigpay: "ಗಿಗ್‌ಪೇ", welfare: "ಸುರಕ್ಷೆ" },
  dashboard: {
    greeting: "ನಮಸ್ಕಾರ",
    todayEarnings: "ಇಂದಿನ ಆದಾಯ",
    kept: "ಶೇ ೧೦೦ ನಿಮ್ಮದು • ಕಮಿಷನ್ ಇಲ್ಲ",
    trips: "ಪ್ರವಾಸಗಳು",
    driving: "ಗಂಟೆ ಡ್ರೈವ್",
    uploadScreenshot: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್",
    ocrParser: "ಬಹು-ಅಪ್ಲಿ OCR",
    viewLedger: "ಪೂರ್ಣ ಲೆಡ್ಜರ್ ನೋಡಿ",
    smartRouting: "ಸ್ಮಾರ್ಟ್ ರೂಟಿಂಗ್",
    online: "ಆನ್‌ಲೈನ್",
    offline: "ಆಫ್‌ಲೈನ್",
  },
  ledger: {
    title: "ಚಾಲಕ ಲೆಡ್ಜರ್",
    subtitle: "ನಿಮ್ಮ ಆದಾಯ ಗ್ರಾಫ್ — ನಿಮ್ಮದು",
    thisWeek: "ಈ ವಾರ",
    allTime: "ಒಟ್ಟು",
    byPlatform: "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರಕಾರ",
    export: "CSV ರಫ್ತು",
    addEarnings: "ಆದಾಯ ಸೇರಿಸಿ",
    noEntries: "ಇನ್ನೂ ಆದಾಯ ಇಲ್ಲ. ಪ್ರಾರಂಭಿಸಲು ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    entries: "ನಮೂದುಗಳು",
  },
  ocr: {
    title: "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ OCR",
    upload: "ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    parse: "ಅಪ್‌ಲೋಡ್ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ",
    confirm: "ಲೆಡ್ಜರ್‌ಗೆ ಉಳಿಸಿ",
    review: "ಉಳಿಸುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ",
  },
  common: { powered: "GIGAI BHARAT ನಿಂದ" },
};

const hi: typeof en = {
  nav: { home: "होम", ledger: "लेजर", map: "मानचित्र", gigpay: "गिगपे", welfare: "कल्याण" },
  dashboard: {
    greeting: "नमस्ते",
    todayEarnings: "आज की कमाई",
    kept: "100% आपकी • कोई कमीशन नहीं",
    trips: "ट्रिप",
    driving: "घंटे ड्राइविंग",
    uploadScreenshot: "स्क्रीनशॉट अपलोड",
    ocrParser: "मल्टी-ऐप OCR",
    viewLedger: "पूरा लेजर देखें",
    smartRouting: "स्मार्ट रूटिंग",
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
  },
  ledger: {
    title: "ड्राइवर लेजर",
    subtitle: "आपका कमाई ग्राफ — आपका डेटा",
    thisWeek: "इस सप्ताह",
    allTime: "कुल",
    byPlatform: "प्लेटफॉर्म के अनुसार",
    export: "CSV निर्यात",
    addEarnings: "कमाई जोड़ें",
    noEntries: "अभी कोई कमाई नहीं। शुरू करने के लिए स्क्रीनशॉट अपलोड करें।",
    entries: "प्रविष्टियाँ",
  },
  ocr: {
    title: "स्क्रीनशॉट OCR",
    upload: "अपलोड के लिए टैप करें",
    parse: "अपलोड और विश्लेषण",
    confirm: "लेजर में सहेजें",
    review: "सहेजने से पहले जांचें",
  },
  common: { powered: "GIGAI BHARAT द्वारा" },
};

export const messages = { en, kn, hi } as const;
export type Messages = typeof en;
