const fs = require('fs');
const path = require('path');

const localesPath = '/var/www/vinnavar-fullstack/vinnavar-frontend/public/locales';

const newTranslations = {
  en: {
    acc_settings: "Account Settings",
    saved_addresses: "Saved Addresses",
    payment_methods: "Payment Methods",
    complaints: "Complaints & Support",
    reviews_feedback: "Reviews & Feedback",
    notifications: "Notifications",
  },
  hi: {
    acc_settings: "खाता सेटिंग्स",
    saved_addresses: "सहेजे गए पते",
    payment_methods: "भुगतान विधियां",
    complaints: "शिकायतें और सहायता",
    reviews_feedback: "समीक्षा और प्रतिक्रिया",
    notifications: "सूचनाएं",
  },
  ta: {
    acc_settings: "கணக்கு அமைப்புகள்",
    saved_addresses: "சேமிக்கப்பட்ட முகவரிகள்",
    payment_methods: "கட்டண முறைகள்",
    complaints: "புகார்கள் மற்றும் ஆதரவு",
    reviews_feedback: "விமர்சனங்கள்",
    notifications: "அறிவிப்புகள்",
  },
  te: {
    acc_settings: "ఖాతా సెట్టింగులు",
    saved_addresses: "సేవ్ చేయబడిన చిరునామాలు",
    payment_methods: "చెల్లింపు పద్ధతులు",
    complaints: "ఫిర్యాదులు & మద్దతు",
    reviews_feedback: "సమీక్షలు",
    notifications: "నోటిఫికేషన్లు",
  },
  kn: {
    acc_settings: "ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    saved_addresses: "ಉಳಿಸಿದ ವಿಳಾಸಗಳು",
    payment_methods: "ಪಾವತಿ ವಿಧಾನಗಳು",
    complaints: "ದೂರುಗಳು ಮತ್ತು ಬೆಂಬಲ",
    reviews_feedback: "ವಿಮರ್ಶೆಗಳು",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
  },
  ml: {
    acc_settings: "അക്കൗണ്ട് ക്രമീകരണങ്ങൾ",
    saved_addresses: "സംരക്ഷിച്ച വിലാസങ്ങൾ",
    payment_methods: "പേയ്‌മെന്റ് രീതികൾ",
    complaints: "പരാതികളും പിന്തുണയും",
    reviews_feedback: "അവലോകനങ്ങൾ",
    notifications: "അറിയിപ്പുകൾ",
  },
  mr: {
    acc_settings: "खाते सेटिंग्ज",
    saved_addresses: "जतन केलेले पत्ते",
    payment_methods: "पैसे देण्याच्या पद्धती",
    complaints: "तक्रारी आणि समर्थन",
    reviews_feedback: "पुनरावलोकने",
    notifications: "अधिसूचना",
  },
  bn: {
    acc_settings: "অ্যাকাউন্ট সেটিংস",
    saved_addresses: "সংরক্ষিত ঠিকানা",
    payment_methods: "পেমেন্ট পদ্ধতি",
    complaints: "অভিযোগ এবং সমর্থন",
    reviews_feedback: "পর্যালোচনা",
    notifications: "বিজ্ঞপ্তি",
  },
  pa: {
    acc_settings: "ਖਾਤਾ ਸੈਟਿੰਗਾਂ",
    saved_addresses: "ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਪਤੇ",
    payment_methods: "ਭੁਗਤਾਨ ਵਿਧੀਆਂ",
    complaints: "ਸ਼ਿਕਾਇਤਾਂ ਅਤੇ ਸਹਾਇਤਾ",
    reviews_feedback: "ਸਮੀਖਿਆਵਾਂ",
    notifications: "ਸੂਚਨਾਵਾਂ",
  }
};

fs.readdirSync(localesPath).forEach(lang => {
  if (lang.length === 2 && fs.lstatSync(path.join(localesPath, lang)).isDirectory()) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updates = newTranslations[lang] || newTranslations['en'];
      const updatedData = { ...data, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json`);
    }
  }
});
