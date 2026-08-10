const fs = require('fs');
const path = require('path');

const localesPath = '/var/www/vinnavar-fullstack/vinnavar-frontend/public/locales';

const wishlistTranslations = {
  en: {
    saved_favorites: "Saved Favorites",
    my_wishlist: "My Wishlist",
    wishlist_one_item: "There is 1 saved organic product in your wishlist.",
    wishlist_multi_items: "There are {{count}} saved organic products in your wishlist.",
    clear_wishlist: "Clear Wishlist",
    wishlist_empty_title: "Your Wishlist is Empty",
    wishlist_empty_desc: "Save your favorite traditional organic rice, cold-pressed oils, and spices here for quick access later!",
    explore_products: "Explore Products",
    th_product: "Product",
    th_variant: "Variant / Unit",
    th_price: "Price",
    th_stock: "Stock Status",
    th_action: "Action",
    th_remove: "Remove",
    in_stock: "In Stock",
    out_of_stock: "Out of Stock",
    standard_pack: "Standard Pack"
  },
  hi: {
    saved_favorites: "सहेजे गए पसंदीदा",
    my_wishlist: "मेरी विशलिस्ट",
    wishlist_one_item: "आपकी विशलिस्ट में 1 जैविक उत्पाद सहेजा गया है।",
    wishlist_multi_items: "आपकी विशलिस्ट में {{count}} जैविक उत्पाद सहेजे गए हैं।",
    clear_wishlist: "विशलिस्ट साफ़ करें",
    wishlist_empty_title: "आपकी विशलिस्ट खाली है",
    wishlist_empty_desc: "बाद में त्वरित पहुंच के लिए अपने पसंदीदा पारंपरिक जैविक चावल, कोल्ड-प्रेस्ड तेल और मसालों को यहाँ सहेजें!",
    explore_products: "उत्पाद खोजें",
    th_product: "उत्पाद",
    th_variant: "प्रकार / इकाई",
    th_price: "मूल्य",
    th_stock: "स्टॉक स्थिति",
    th_action: "कार्रवाई",
    th_remove: "हटाएं",
    in_stock: "स्टॉक में",
    out_of_stock: "स्टॉक ख़त्म",
    standard_pack: "मानक पैक"
  }
};

fs.readdirSync(localesPath).forEach(lang => {
  if (lang.length === 2 && fs.lstatSync(path.join(localesPath, lang)).isDirectory()) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updates = wishlistTranslations[lang] || wishlistTranslations['en'];
      const updatedData = { ...data, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json for ShopWishList.jsx`);
    }
  }
});
