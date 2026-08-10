const fs = require('fs');
const path = require('path');

const localesPath = '/var/www/vinnavar-fullstack/vinnavar-frontend/public/locales';

const slidingCartTranslations = {
  en: {
    sliding_cart_title: "Shop Cart",
    sliding_cart_unique_products: "{{count}} Unique Products ({{total}} Items Total)",
    sliding_cart_free_delivery_label: "Free Delivery:",
    sliding_cart_free_delivery_desc: "All prices inclusive of shipping & taxes!",
    sliding_cart_empty_title: "Your Organic Cart is empty",
    sliding_cart_empty_desc: "Add your favorite traditional rice & organic staples.",
    sliding_cart_shop_products: "Shop Products",
    sliding_cart_remove: "Remove",
    sliding_cart_total_amount: "Total Amount:",
    sliding_cart_view_full: "View Full Cart",
    sliding_cart_proceed_checkout: "Proceed to Checkout",
    sliding_cart_guarantees: "Store Guarantees & Policies",
    sliding_cart_refund: "Refund Policy",
    sliding_cart_privacy: "Privacy Policy",
    sliding_cart_terms: "Terms & Conditions",
    sliding_cart_btn_label: "Cart"
  },
  hi: {
    sliding_cart_title: "शॉपिंग कार्ट",
    sliding_cart_unique_products: "{{count}} अद्वितीय उत्पाद ({{total}} कुल आइटम)",
    sliding_cart_free_delivery_label: "मुफ़्त डिलीवरी:",
    sliding_cart_free_delivery_desc: "सभी मूल्यों में शिपिंग और कर शामिल हैं!",
    sliding_cart_empty_title: "आपका जैविक कार्ट खाली है",
    sliding_cart_empty_desc: "अपने पसंदीदा पारंपरिक चावल और जैविक उत्पाद जोड़ें।",
    sliding_cart_shop_products: "उत्पाद खरीदें",
    sliding_cart_remove: "हटाएं",
    sliding_cart_total_amount: "कुल राशि:",
    sliding_cart_view_full: "पूरा कार्ट देखें",
    sliding_cart_proceed_checkout: "चेकआउट के लिए आगे बढ़ें",
    sliding_cart_guarantees: "स्टोर गारंटी और नीतियां",
    sliding_cart_refund: "रिफंड नीति",
    sliding_cart_privacy: "गोपनीयता नीति",
    sliding_cart_terms: "नियम और शर्तें",
    sliding_cart_btn_label: "कार्ट"
  },
  ta: {
    sliding_cart_title: "கடை வண்டி",
    sliding_cart_unique_products: "{{count}} தனித்துவ பொருட்கள் ({{total}} மொத்த பொருட்கள்)",
    sliding_cart_free_delivery_label: "இலவச டெலிவரி:",
    sliding_cart_free_delivery_desc: "அனைத்து விலைகளிலும் ஷிப்பிங் மற்றும் வரிகள் உள்ளடங்கியது!",
    sliding_cart_empty_title: "உங்கள் இயற்கை வண்டி காலியாக உள்ளது",
    sliding_cart_empty_desc: "உங்கள் விருப்பமான பாரம்பரிய அரிசி மற்றும் இயற்கை உணவுப் பொருட்களைச் சேர்க்கவும்.",
    sliding_cart_shop_products: "பொருட்களை வாங்கவும்",
    sliding_cart_remove: "நீக்கு",
    sliding_cart_total_amount: "மொத்த தொகை:",
    sliding_cart_view_full: "முழு வண்டியை காண்க",
    sliding_cart_proceed_checkout: "செக்அவுட்டுக்கு செல்ல",
    sliding_cart_guarantees: "கடை உத்தரவாதங்கள் மற்றும் கொள்கைகள்",
    sliding_cart_refund: "பணத்திரும்பப்பெறும் கொள்கை",
    sliding_cart_privacy: "தனியுரிமைக் கொள்கை",
    sliding_cart_terms: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
    sliding_cart_btn_label: "வண்டி"
  },
  te: {
    sliding_cart_title: "షాపింగ్ కార్ట్",
    sliding_cart_unique_products: "{{count}} ప్రత్యేక ఉత్పత్తులు ({{total}} మొత్తం అంశాలు)",
    sliding_cart_free_delivery_label: "ఉచిత డెలివరీ:",
    sliding_cart_free_delivery_desc: "షిప్పింగ్ మరియు పన్నులతో సహా అన్ని ధరలు!",
    sliding_cart_empty_title: "మీ ఆర్గానిక్ కార్ట్ ఖాళీగా ఉంది",
    sliding_cart_empty_desc: "మీ ఇష్టమైన సంప్రదాయ బియ్యం మరియు ఆర్గానిక్ ఉత్పత్తులను జోడించండి.",
    sliding_cart_shop_products: "ఉత్పత్తులను కొనండి",
    sliding_cart_remove: "తొలగించు",
    sliding_cart_total_amount: "మొత్తం:",
    sliding_cart_view_full: "పూర్తి కార్ట్ చూడండి",
    sliding_cart_proceed_checkout: "చెక్‌అవుట్‌కు వెళ్ళండి",
    sliding_cart_guarantees: "స్టోర్ హామీలు మరియు విధానాలు",
    sliding_cart_refund: "రీఫండ్ పాలసీ",
    sliding_cart_privacy: "గోప్యతా విధానం",
    sliding_cart_terms: "నిబంధనలు మరియు షరతులు",
    sliding_cart_btn_label: "కార్ట్"
  },
  kn: {
    sliding_cart_title: "ಶಾಪಿಂಗ್ ಕಾರ್ಟ್",
    sliding_cart_unique_products: "{{count}} ಅನನ್ಯ ಉತ್ಪನ್ನಗಳು ({{total}} ಒಟ್ಟು ಐಟಂಗಳು)",
    sliding_cart_free_delivery_label: "ಉಚಿತ ಡೆಲಿವರಿ:",
    sliding_cart_free_delivery_desc: "ಎಲ್ಲಾ ಬೆಲೆಗಳಲ್ಲಿ ಶಿಪ್ಪಿಂಗ್ ಮತ್ತು ತೆರಿಗೆಗಳು ಸೇರಿವೆ!",
    sliding_cart_empty_title: "ನಿಮ್ಮ ಸಾವಯವ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
    sliding_cart_empty_desc: "ನಿಮ್ಮ ಮೆಚ್ಚಿನ ಸಾಂಪ್ರದಾಯಿಕ ಅಕ್ಕಿ ಮತ್ತು ಸಾವಯವ ಉತ್ಪನ್ನಗಳನ್ನು ಸೇರಿಸಿ.",
    sliding_cart_shop_products: "ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ",
    sliding_cart_remove: "ತೆಗೆದುಹಾಕಿ",
    sliding_cart_total_amount: "ಒಟ್ಟು ಮೊತ್ತ:",
    sliding_cart_view_full: "ಪೂರ್ಣ ಕಾರ್ಟ್ ವೀಕ್ಷಿಸಿ",
    sliding_cart_proceed_checkout: "ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ",
    sliding_cart_guarantees: "ಸ್ಟೋರ್ ಖಾತ್ರಿಗಳು ಮತ್ತು ನೀತಿಗಳು",
    sliding_cart_refund: "ಮರುಪಾವತಿ ನೀತಿ",
    sliding_cart_privacy: "ಗೌಪ್ಯತಾ ನೀತಿ",
    sliding_cart_terms: "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು",
    sliding_cart_btn_label: "ಕಾರ್ಟ್"
  },
  ml: {
    sliding_cart_title: "ഷോപ്പിംഗ് കാർട്ട്",
    sliding_cart_unique_products: "{{count}} അദ്വിതീയ ഉൽപ്പന്നങ്ങൾ ({{total}} ആകെ ഇനങ്ങൾ)",
    sliding_cart_free_delivery_label: "സൗജന്യ ഡെലിവറി:",
    sliding_cart_free_delivery_desc: "എല്ലാ വിലകളിലും ഷിപ്പിംഗും നികുതിയും ഉൾപ്പെടുന്നു!",
    sliding_cart_empty_title: "നിങ്ങളുടെ ജൈവ കാർട്ട് ശൂന്യമാണ്",
    sliding_cart_empty_desc: "നിങ്ങളുടെ പ്രിയപ്പെട്ട പരമ്പരാഗത അരിയും ജൈവ ഉൽപ്പന്നങ്ങളും ചേർക്കുക.",
    sliding_cart_shop_products: "ഉൽപ്പന്നങ്ങൾ വാങ്ങുക",
    sliding_cart_remove: "നീക്കം ചെയ്യുക",
    sliding_cart_total_amount: "ആകെ തുക:",
    sliding_cart_view_full: "മുഴുവൻ കാർട്ട് കാണുക",
    sliding_cart_proceed_checkout: "ചെക്ക്ഔട്ടിലേക്ക് തുടരുക",
    sliding_cart_guarantees: "സ്റ്റോർ ഗ്യാരന്റികളും നയങ്ങളും",
    sliding_cart_refund: "റീഫണ്ട് നയം",
    sliding_cart_privacy: "സ്വകാര്യതാ നയം",
    sliding_cart_terms: "നിബന്ധനകളും വ്യവസ്ഥകളും",
    sliding_cart_btn_label: "കാർട്ട്"
  },
  bn: {
    sliding_cart_title: "শপিং কার্ট",
    sliding_cart_unique_products: "{{count}} টি অনন্য পণ্য ({{total}} টি মোট আইটেম)",
    sliding_cart_free_delivery_label: "বিনামূল্যে ডেলিভারি:",
    sliding_cart_free_delivery_desc: "সমস্ত মূল্যে শিপিং এবং কর অন্তর্ভুক্ত!",
    sliding_cart_empty_title: "আপনার জৈব কার্ট খালি",
    sliding_cart_empty_desc: "আপনার প্রিয় ঐতিহ্যবাহী চাল ও জৈব পণ্য যোগ করুন।",
    sliding_cart_shop_products: "পণ্য কিনুন",
    sliding_cart_remove: "সরান",
    sliding_cart_total_amount: "মোট পরিমাণ:",
    sliding_cart_view_full: "সম্পূর্ণ কার্ট দেখুন",
    sliding_cart_proceed_checkout: "চেকআউটে এগিয়ে যান",
    sliding_cart_guarantees: "স্টোর গ্যারান্টি ও নীতিমালা",
    sliding_cart_refund: "ফেরত নীতি",
    sliding_cart_privacy: "গোপনীয়তা নীতি",
    sliding_cart_terms: "শর্তাবলী",
    sliding_cart_btn_label: "কার্ট"
  },
  mr: {
    sliding_cart_title: "शॉपिंग कार्ट",
    sliding_cart_unique_products: "{{count}} अद्वितीय उत्पादने ({{total}} एकूण वस्तू)",
    sliding_cart_free_delivery_label: "मोफत डिलिव्हरी:",
    sliding_cart_free_delivery_desc: "सर्व किमतींमध्ये शिपिंग आणि कर समाविष्ट!",
    sliding_cart_empty_title: "तुमचे सेंद्रिय कार्ट रिकामे आहे",
    sliding_cart_empty_desc: "तुमचे आवडते पारंपरिक तांदूळ आणि सेंद्रिय उत्पादने जोडा.",
    sliding_cart_shop_products: "उत्पादने खरेदी करा",
    sliding_cart_remove: "काढा",
    sliding_cart_total_amount: "एकूण रक्कम:",
    sliding_cart_view_full: "संपूर्ण कार्ट पहा",
    sliding_cart_proceed_checkout: "चेकआउटसाठी पुढे जा",
    sliding_cart_guarantees: "स्टोर हमी आणि धोरणे",
    sliding_cart_refund: "परतावा धोरण",
    sliding_cart_privacy: "गोपनीयता धोरण",
    sliding_cart_terms: "अटी आणि शर्ती",
    sliding_cart_btn_label: "कार्ट"
  },
  pa: {
    sliding_cart_title: "ਸ਼ਾਪਿੰਗ ਕਾਰਟ",
    sliding_cart_unique_products: "{{count}} ਵਿਲੱਖਣ ਉਤਪਾਦ ({{total}} ਕੁੱਲ ਆਈਟਮ)",
    sliding_cart_free_delivery_label: "ਮੁਫ਼ਤ ਡਿਲੀਵਰੀ:",
    sliding_cart_free_delivery_desc: "ਸਾਰੀਆਂ ਕੀਮਤਾਂ ਵਿੱਚ ਸ਼ਿਪਿੰਗ ਅਤੇ ਟੈਕਸ ਸ਼ਾਮਲ ਹਨ!",
    sliding_cart_empty_title: "ਤੁਹਾਡਾ ਜੈਵਿਕ ਕਾਰਟ ਖਾਲੀ ਹੈ",
    sliding_cart_empty_desc: "ਆਪਣੇ ਮਨਪਸੰਦ ਰਵਾਇਤੀ ਚੌਲ ਅਤੇ ਜੈਵਿਕ ਉਤਪਾਦ ਸ਼ਾਮਲ ਕਰੋ।",
    sliding_cart_shop_products: "ਉਤਪਾਦ ਖਰੀਦੋ",
    sliding_cart_remove: "ਹਟਾਓ",
    sliding_cart_total_amount: "ਕੁੱਲ ਰਕਮ:",
    sliding_cart_view_full: "ਪੂਰਾ ਕਾਰਟ ਦੇਖੋ",
    sliding_cart_proceed_checkout: "ਚੈਕਆਊਟ ਲਈ ਅੱਗੇ ਵਧੋ",
    sliding_cart_guarantees: "ਸਟੋਰ ਗਾਰੰਟੀਆਂ ਅਤੇ ਨੀਤੀਆਂ",
    sliding_cart_refund: "ਰਿਫੰਡ ਨੀਤੀ",
    sliding_cart_privacy: "ਗੋਪਨੀਯਤਾ ਨੀਤੀ",
    sliding_cart_terms: "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ",
    sliding_cart_btn_label: "ਕਾਰਟ"
  }
};

fs.readdirSync(localesPath).forEach(lang => {
  if (lang.length === 2 && fs.lstatSync(path.join(localesPath, lang)).isDirectory()) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updates = slidingCartTranslations[lang] || slidingCartTranslations['en'];
      const updatedData = { ...data, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json for sliding cart panel`);
    }
  }
});
