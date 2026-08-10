const fs = require('fs');
const path = require('path');

const localesPath = '/var/www/vinnavar-fullstack/vinnavar-frontend/public/locales';

const blogCategoryTranslations = {
  en: {
    category_articles: "Category Articles",
    discover_curated: "Discover our curated organic articles and recipes for {{category}}.",
    all_label: "All",
    no_articles_in_cat: "No articles found in {{category}}",
    check_back_soon: "Check back soon or explore other blog categories!",
    back_to_all: "Back to All Blogs ➔"
  },
  hi: {
    category_articles: "श्रेणी लेख",
    discover_curated: "{{category}} के लिए हमारे क्यूरेट किए गए जैविक लेख और व्यंजनों की खोज करें।",
    all_label: "सभी",
    no_articles_in_cat: "{{category}} में कोई लेख नहीं मिला",
    check_back_soon: "जल्द ही वापस देखें या अन्य ब्लॉग श्रेणियों का पता लगाएं!",
    back_to_all: "सभी ब्लॉग पर वापस जाएं ➔"
  }
};

fs.readdirSync(localesPath).forEach(lang => {
  if (lang.length === 2 && fs.lstatSync(path.join(localesPath, lang)).isDirectory()) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updates = blogCategoryTranslations[lang] || blogCategoryTranslations['en'];
      const updatedData = { ...data, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json for BlogCategory.jsx`);
    }
  }
});
