const fs = require('fs');
const path = require('path');

const localesPath = '/var/www/vinnavar-fullstack/vinnavar-frontend/public/locales';

const cartTranslations = {
  en: {
    shopping_bag: "Shopping Bag",
    my_cart: "My Organic Cart",
    cart_one_item: "You have 1 pure organic item ready for checkout.",
    cart_multi_items: "You have {{count}} pure organic item(s) ready for checkout.",
    cart_empty_msg: "Your shopping cart is currently empty.",
    clear_cart_btn: "Clear Cart",
    cart_empty_title: "Your Cart is Empty",
    cart_empty_desc: "Explore our certified organic grains, traditional rice varieties, and cold-pressed oils.",
    explore_catalog: "Explore Organic Catalog",
    free_delivery: "Free Delivery Unlocked! Inclusive of shipping charges & all GST taxes.",
    checkout_now: "Checkout Now",
    unit: "unit",
    remove_btn: "Remove",
    continue_shopping: "Continue Shopping",
    your_order: "YOUR ORDER",
    product_col: "PRODUCT",
    subtotal_col: "SUBTOTAL",
    subtotal_label: "Subtotal",
    shipment: "Shipment",
    weight_shipping: "Weight Based Shipping ({{weight}} kg):",
    tax_gst: "Tax (GST)",
    round_off: "Round Off",
    total: "Total",
    proceed_to_checkout: "Proceed to Checkout",
    safe_checkout: "Safe & Secure Checkout • 100% Organic Guarantee",
    refund_policy: "Refund Policy",
    privacy_policy: "Privacy Policy",
    terms_conditions: "Terms & Conditions",
    close_btn: "Close"
  },
  hi: {
    shopping_bag: "शॉपिंग बैग",
    my_cart: "मेरा जैविक कार्ट",
    cart_one_item: "आपके पास चेकआउट के लिए 1 शुद्ध जैविक वस्तु है।",
    cart_multi_items: "आपके पास चेकआउट के लिए {{count}} शुद्ध जैविक वस्तुएं हैं।",
    cart_empty_msg: "आपकी शॉपिंग कार्ट अभी खाली है।",
    clear_cart_btn: "कार्ट साफ़ करें",
    cart_empty_title: "आपकी कार्ट खाली है",
    cart_empty_desc: "हमारे प्रमाणित जैविक अनाज, पारंपरिक चावल की किस्मों और कोल्ड-प्रेस्ड तेलों का अन्वेषण करें।",
    explore_catalog: "जैविक कैटलॉग देखें",
    free_delivery: "मुफ़्त डिलीवरी! शिपिंग शुल्क और सभी GST कर शामिल हैं।",
    checkout_now: "अभी चेकआउट करें",
    unit: "इकाई",
    remove_btn: "हटाएं",
    continue_shopping: "खरीदारी जारी रखें",
    your_order: "आपका ऑर्डर",
    product_col: "उत्पाद",
    subtotal_col: "उप-योग",
    subtotal_label: "उप-योग",
    shipment: "शिपमेंट",
    weight_shipping: "वजन आधारित शिपिंग ({{weight}} किलो):",
    tax_gst: "कर (GST)",
    round_off: "राउंड ऑफ",
    total: "कुल",
    proceed_to_checkout: "चेकआउट के लिए आगे बढ़ें",
    safe_checkout: "सुरक्षित चेकआउट • 100% जैविक गारंटी",
    refund_policy: "रिफंड नीति",
    privacy_policy: "गोपनीयता नीति",
    terms_conditions: "नियम और शर्तें",
    close_btn: "बंद करें"
  }
};

fs.readdirSync(localesPath).forEach(lang => {
  if (lang.length === 2 && fs.lstatSync(path.join(localesPath, lang)).isDirectory()) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updates = cartTranslations[lang] || cartTranslations['en'];
      const updatedData = { ...data, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json for ShopCart.jsx`);
    }
  }
});
