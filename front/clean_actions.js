const fs = require('fs');
const path = require('path');

const actionsDir = path.join(__dirname, 'src', 'app', 'actions');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove 'as any'
      content = content.replace(/get: \(getSelection \|\| \{\}\) as any, \/\/ internal any for strict Lesan type compatibility/g, 'get: getSelection || {},');
      
      // Remove @ts-ignore for finalGetSelection
      content = content.replace(/\/\/\s*@ts-ignore:\s*Internal cast for strict Lesan type compatibility\s*get:\s*finalGetSelection,/g, 'get: finalGetSelection,');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(actionsDir);
console.log("Cleaned up get selections");
