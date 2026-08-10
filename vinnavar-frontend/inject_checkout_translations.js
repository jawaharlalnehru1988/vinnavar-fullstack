const fs = require('fs');
const path = require('path');

const localesPath = '/var/www/vinnavar-fullstack/vinnavar-frontend/public/locales';

const checkoutTranslations = {
  en: {
    initializing_checkout: "Initializing Secure Checkout...",
    trusted_gateway: "Trusted Razorpay Gateway",
    secure_checkout: "🛍️ Secure Checkout",
    checkout_desc: "100% Pure Organic Staples. Delivered directly to your home across India.",
    edit_cart: "← Edit Shopping Cart",
    shipping_delivery_addr: "Shipping & Delivery Address",
    full_name: "Full Name *",
    name_placeholder: "e.g. Lokesh Rajan",
    mobile_phone: "Mobile Phone Number *",
    phone_placeholder: "+91 9876543210",
    email_optional: "Email Address (Optional)",
    email_placeholder: "you@example.com",
    gstin_optional: "User GSTIN (Optional)",
    street_addr: "House / Flat / Street Address *",
    city_town: "City / Town",
    state_label: "State",
    pincode: "Pincode *",
    billing_addr: "Billing Address",
    billing_same_as_shipping: "Billing Address is same as Shipping Address",
    billing_full_name: "Billing Full Name *",
    billing_phone: "Billing Phone Number *",
    billing_street: "Billing Address *",
    payment_method: "Payment Method",
    razorpay_title: "Razorpay Payment Gateway (UPI, Cards, NetBanking)",
    razorpay_desc: "Pay securely via GPay, PhonePe, Paytm, Credit/Debit Cards, & NetBanking.",
    instant_safe: "Instant & 100% Safe",
    order_summary: "Order Summary",
    cart_empty_checkout: "Your cart is empty.",
    browse_products: "Browse Products",
    base_price_subtotal: "Base Price (Subtotal)",
    weight_based: "Weight Based",
    total_payable: "Total Payable",
    processing_payment: "Processing Secure Payment...",
    pay_via_razorpay: "🔒 Pay ₹{{amount}} via Razorpay",
    encrypted_verified: "🛡️ 100% Encrypted & Verified by Razorpay"
  },
  hi: {
    initializing_checkout: "सुरक्षित चेकआउट प्रारंभ किया जा रहा है...",
    trusted_gateway: "विश्वसनीय रेज़रपे गेटवे",
    secure_checkout: "🛍️ सुरक्षित चेकआउट",
    checkout_desc: "100% शुद्ध जैविक मुख्य खाद्य पदार्थ। पूरे भारत में सीधे आपके घर पर वितरित।",
    edit_cart: "← शॉपिंग कार्ट संपादित करें",
    shipping_delivery_addr: "शिपिंग और डिलीवरी का पता",
    full_name: "पूरा नाम *",
    name_placeholder: "उदा. लोकेश राजन",
    mobile_phone: "मोबाइल फोन नंबर *",
    phone_placeholder: "+91 9876543210",
    email_optional: "ईमेल पता (वैकल्पिक)",
    email_placeholder: "you@example.com",
    gstin_optional: "उपयोगकर्ता GSTIN (वैकल्पिक)",
    street_addr: "मकान / फ्लैट / सड़क का पता *",
    city_town: "शहर / कस्बा",
    state_label: "राज्य",
    pincode: "पिनकोड *",
    billing_addr: "बिलिंग का पता",
    billing_same_as_shipping: "बिलिंग पता शिपिंग पते के समान है",
    billing_full_name: "बिलिंग पूरा नाम *",
    billing_phone: "बिलिंग फोन नंबर *",
    billing_street: "बिलिंग का पता *",
    payment_method: "भुगतान विधि",
    razorpay_title: "रेज़रपे भुगतान गेटवे (UPI, कार्ड, नेटबैंकिंग)",
    razorpay_desc: "GPay, PhonePe, Paytm, क्रेडिट/डेबिट कार्ड और नेटबैंकिंग के माध्यम से सुरक्षित रूप से भुगतान करें।",
    instant_safe: "त्वरित और 100% सुरक्षित",
    order_summary: "ऑर्डर का सारांश",
    cart_empty_checkout: "आपकी कार्ट खाली है।",
    browse_products: "उत्पाद ब्राउज़ करें",
    base_price_subtotal: "आधार मूल्य (उप-योग)",
    weight_based: "वजन आधारित",
    total_payable: "कुल देय",
    processing_payment: "सुरक्षित भुगतान संसाधित किया जा रहा है...",
    pay_via_razorpay: "🔒 रेज़रपे के माध्यम से ₹{{amount}} का भुगतान करें",
    encrypted_verified: "🛡️ 100% एन्क्रिप्टेड और रेज़रपे द्वारा सत्यापित"
  }
};

fs.readdirSync(localesPath).forEach(lang => {
  if (lang.length === 2 && fs.lstatSync(path.join(localesPath, lang)).isDirectory()) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updates = checkoutTranslations[lang] || checkoutTranslations['en'];
      const updatedData = { ...data, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json for ShopCheckOut.jsx`);
    }
  }
});
