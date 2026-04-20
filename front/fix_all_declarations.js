const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/types/declarations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const docIndex = content.indexOf('    document: {');
if (docIndex !== -1) {
    const endDocIndex = content.indexOf('    report: {', docIndex);
    let docSection = content.substring(docIndex, endDocIndex);
    
    docSection = docSection.replace(/description\?: string;/g, 'description?: string;\n          language?: string;');
    docSection = docSection.replace(/description\?: \(0 \| 1\);/g, 'description?: (0 | 1);\n          language?: (0 | 1);');
    
    content = content.substring(0, docIndex) + docSection + content.substring(endDocIndex);
}

fs.writeFileSync(filePath, content, 'utf-8');
