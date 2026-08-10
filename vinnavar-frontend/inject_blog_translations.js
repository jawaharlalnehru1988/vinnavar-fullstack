const fs = require('fs');
const path = require('path');

const localesPath = '/var/www/vinnavar-fullstack/vinnavar-frontend/public/locales';

const blogTranslations = {
  en: {
    organic_living_recipes: "Organic Living & Recipes",
    journal_title: "Vinnavar Organic Journal",
    journal_desc: "Explore healthy organic recipes, natural lifestyle guides, and traditional farming wisdom.",
    all_articles: "All Articles",
    read_full_article: "Read Full Article",
    no_articles_found: "No articles found",
    no_articles_desc: "There are currently no articles in this category.",
    read_article: "Read Article"
  },
  hi: {
    organic_living_recipes: "जैविक जीवन और व्यंजन",
    journal_title: "विन्नवर ऑर्गेनिक जर्नल",
    journal_desc: "स्वस्थ जैविक व्यंजनों, प्राकृतिक जीवन शैली गाइड और पारंपरिक कृषि ज्ञान का अन्वेषण करें।",
    all_articles: "सभी लेख",
    read_full_article: "पूरा लेख पढ़ें",
    no_articles_found: "कोई लेख नहीं मिला",
    no_articles_desc: "वर्तमान में इस श्रेणी में कोई लेख नहीं है।",
    read_article: "लेख पढ़ें"
  }
};

fs.readdirSync(localesPath).forEach(lang => {
  if (lang.length === 2 && fs.lstatSync(path.join(localesPath, lang)).isDirectory()) {
    const filePath = path.join(localesPath, lang, 'translation.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const updates = blogTranslations[lang] || blogTranslations['en'];
      const updatedData = { ...data, ...updates };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      console.log(`Updated ${lang}/translation.json for Blog.jsx`);
    }
  }
});
