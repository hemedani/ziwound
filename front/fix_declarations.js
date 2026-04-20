const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/types/declarations.ts');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace('export type documentSchema = {', 'export type documentSchema = {\n  language?: string;');

// find the exact lines
content = content.replace('documentFiles?: string[];', 'documentFiles?: string[];\n          language?: string;');
content = content.replace('description?: (0 | 1);', 'description?: (0 | 1);\n          language?: (0 | 1);');
content = content.replace('reportId?: string;', 'reportId?: string;\n          language?: string;');

fs.writeFileSync(filePath, content, 'utf-8');
