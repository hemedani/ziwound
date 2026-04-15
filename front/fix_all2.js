const fs = require('fs');

function fixFiles(file) {
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('const categories = categoriesResponse?.list || [];')) {
    c = c.replace('const categories = categoriesResponse?.list || [];', `let categories: any[] = [];\n  if (categoriesResponse?.success) {\n    categories = categoriesResponse.body.list || [];\n  }`);
    fs.writeFileSync(file, c);
  }
}
fixFiles('src/app/admin/reports/page.tsx');

