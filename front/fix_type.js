const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/types/declarations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. add to documentSchema
content = content.replace('export type documentSchema = {', 'export type documentSchema = {\n  language?: string;');

// 2. inject language?: any into set and get inside document block
const docStart = content.lastIndexOf('    document: {');
if (docStart !== -1) {
  const docEnd = content.indexOf('    blogPost: {', docStart);
  let docSection = content.substring(docStart, docEnd);

  docSection = docSection.replace(/description\?: string;/g, 'description?: string;\n          language?: string;');
  docSection = docSection.replace(/description\?: \(0 \| 1\);/g, 'description?: (0 | 1);\n          language?: (0 | 1);');
  
  // also add for get gets and update since they might not have description?
  // Actually, let's just add it before `createdAt?: Date;` and `createdAt?: (0 | 1);` which are mostly present
  docSection = docSection.replace(/createdAt\?: Date;/g, 'createdAt?: Date;\n          language?: string;');
  docSection = docSection.replace(/createdAt\?: \(0 \| 1\);/g, 'createdAt?: (0 | 1);\n          language?: (0 | 1);');

  content = content.substring(0, docStart) + docSection + content.substring(docEnd);
}

fs.writeFileSync(filePath, content, 'utf-8');
