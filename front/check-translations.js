const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const locales = ['ar', 'en', 'es', 'fa', 'nl', 'pt', 'ru', 'tr', 'zh'];

// Helper to flatten JSON object
function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && ob[i] !== null) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

const getKeys = (filePath) => {
  if (!fs.existsSync(filePath)) return new Set();
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return new Set(Object.keys(flattenObject(content)));
};

const enKeys = getKeys(path.join(messagesDir, 'en.json'));
const faKeys = getKeys(path.join(messagesDir, 'fa.json'));

const referenceKeys = new Set([...enKeys, ...faKeys]);

let hasMissing = false;

locales.forEach(locale => {
  const localeKeys = getKeys(path.join(messagesDir, `${locale}.json`));
  const missing = [];
  
  referenceKeys.forEach(key => {
    if (!localeKeys.has(key)) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    hasMissing = true;
    console.log(`\n❌ Missing keys in ${locale}.json:`);
    missing.forEach(k => console.log(`  - ${k}`));
  } else {
    console.log(`✅ ${locale}.json is complete.`);
  }
});

if (hasMissing) {
  console.log('\n⚠️ Some translations are missing!');
} else {
  console.log('\n🎉 All translations are up to date!');
}
