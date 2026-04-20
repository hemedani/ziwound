const fs = require('fs');
const path = require('path');

const locales = ['ar', 'en', 'es', 'fa', 'nl', 'pt', 'ru', 'tr', 'zh'];
const messagesDir = path.join(__dirname, 'messages');

const translations = {
  admin: {
    language: {
      en: "Language",
      fa: "زبان",
      ar: "اللغة",
      es: "Idioma",
      nl: "Taal",
      pt: "Idioma",
      ru: "Язык",
      tr: "Dil",
      zh: "语言"
    },
    allLanguages: {
      en: "All Languages",
      fa: "همه زبان‌ها",
      ar: "كل اللغات",
      es: "Todos los idiomas",
      nl: "Alle talen",
      pt: "Todos os idiomas",
      ru: "Все языки",
      tr: "Tüm Diller",
      zh: "所有语言"
    },
    languagePlaceholder: {
      en: "Select a language",
      fa: "یک زبان انتخاب کنید",
      ar: "اختر لغة",
      es: "Seleccione un idioma",
      nl: "Selecteer een taal",
      pt: "Selecione um idioma",
      ru: "Выберите язык",
      tr: "Bir dil seçin",
      zh: "选择一种语言"
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  for (const [namespace, keys] of Object.entries(translations)) {
    if (!content[namespace]) content[namespace] = {};
    
    for (const [key, localizedStrings] of Object.entries(keys)) {
      if (!content[namespace][key]) {
        content[namespace][key] = localizedStrings[locale] || localizedStrings.en;
      }
    }
    
    content[namespace] = Object.keys(content[namespace]).sort().reduce((acc, key) => {
      acc[key] = content[namespace][key];
      return acc;
    }, {});
  }

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf-8');
});

console.log("Language translations added!");
