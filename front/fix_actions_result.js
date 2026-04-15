const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const target = 'if (result.success) return result.body;\n  return null;';
      const replacement = 'return result;';
      if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      } else if (content.includes('if (result.success) { return result.body; }')) {
         content = content.replace('if (result.success) { return result.body; }\n  return null;', replacement);
         fs.writeFileSync(fullPath, content);
         console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('src/app/actions');
