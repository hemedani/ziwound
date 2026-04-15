const fs = require('fs');

function fixFiles(file) {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('const reports = response?.list || [];')) {
    c = c.replace('const reports = response?.list || [];', `let reports: any[] = [];\n  if (response?.success) {\n    reports = response.body.list || [];\n  }`);
    fs.writeFileSync(file, c);
  }
}
fixFiles('src/app/admin/reports/page.tsx');

