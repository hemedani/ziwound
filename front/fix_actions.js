const fs = require('fs');
const path = require('path');

const actionsDir = path.join(__dirname, 'src', 'app', 'actions');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'auth') { // Skip the old auth folder for now
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Add DeepPartial import
      if (!content.includes('DeepPartial')) {
        content = content.replace('import { ReqType }', 'import { ReqType, DeepPartial }');
      }
      
      // Fix the signature to use DeepPartial and remove 'as any'
      content = content.replace(/getSelection: (ReqType\[.*?\]) = \{\} as any/, 'getSelection?: DeepPartial<$1>');
      
      // Fix the get parameter in the payload
      content = content.replace(/get: getSelection,/, 'get: (getSelection || {}) as any, // internal any for strict Lesan type compatibility');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(actionsDir);
console.log("Fixed 'any' in generated files.");
