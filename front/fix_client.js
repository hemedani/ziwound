const fs = require('fs');

function fix(file) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(/if \(res\) \{/g, 'if (res?.success) {');
  c = c.replace(/const res = await update/g, 'const res = await update');
  fs.writeFileSync(file, c);
}

fix('src/app/admin/reports/reports-table.tsx');
fix('src/app/admin/users/users-table.tsx');
