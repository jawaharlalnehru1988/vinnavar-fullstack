const fs = require('fs');
const path = require('path');

const localesPath = '/var/www/vinnavar-fullstack/vinnavar-frontend/public/locales';

const shopTranslations = {
  en: {
    categories: "Categories",
    all_categories: "All Categories",
    search_catalog: "Search Catalog",
    farm_fresh: "Farm Fresh Guaranteed",
    pure_organic: "100% Pure Organic",
    cert_grains_oils: "Certified Grains & Cold-Pressed Oils",
    shop_all_items: "Shop All Items",
    catalog_view: "Catalog View",
    all_organic_products: "All Organic Products",
    browse_complete_range: "Browse our complete range of certified organic grains, cold-pressed oils, and healthy natural staples.",
    showing: "Showing",
    organic_products_count: "organic products",
    sort_featured: "Sort by: Featured",
    price_low_high: "Price: Low to High",
    price_high_low: "Price: High to Low",
    featured_badge: "Featured",
    weight: "WEIGHT:"
  },
  hi: {
    categories: "श्रेणियां",
    all_categories: "सभी श्रेणियां",
    search_catalog: "कैटलॉग खोजें",
    farm_fresh: "फार्म फ्रेश गारंटी",
    pure_organic: "100% शुद्ध जैविक",
    cert_grains_oils: "प्रमाणित अनाज और कोल्ड-प्रेस्ड तेल",
    shop_all_items: "सभी आइटम खरीदें",
    catalog_view: "कैटलॉग दृश्य",
    all_organic_products: "सभी जैविक उत्पाद",
    browse_complete_range: "प्रमाणित जैविक अनाज, कोल्ड-प्रेस्ड तेल और स्वस्थ प्राकृतिक स्टेपल की हमारी पूरी श्रृंखला ब्राउज़ करें।",
    showing: "दिखा रहा है",
    organic_products_count: "जैविक उत्पाद",
    sort_featured: "क्रमबद्ध करें: विशेष",
    price_low_high: "कीमत: कम से ज्यादा",
    price_high_low: "कीमत: ज्यादा से कम",
    featured_badge: "विशेष",
    weight: "वजन:"
  }
};

// Fallback to English for other languages for now, as the user only mentioned Hindi. 
// Ideally we would translate to all, but English fallback is safe.
fs.readdirSync(localesPath).forEach(lang => {
  if (lang.length === 2 && fs.lstatSync(path.join(localesPath, lang)).isDirectory()) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updates = shopTranslations[lang] || shopTranslations['en'];
      const updatedData = { ...data, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json for Shop.jsx strings`);
    }
  }
});
