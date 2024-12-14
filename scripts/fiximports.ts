import * as fs from 'node:fs';
import * as path from 'node:path';

function fixImports(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace relative imports that lack .js (but only if .js is not already in the path)
      content = content.replace(/from '(\..*?)(?=')'/g, (match: string, p1: string) => {
        if (!p1.endsWith('.js')) {
          return `from '${p1}.js'`;
        }
        return match;
      });

      // Replace ../src/ with ./
      content = content.replace(/from '\.\.\/src\//g, "from './");

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

fixImports('dist'); // Adjust to your output directory