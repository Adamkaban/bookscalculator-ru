import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Найти все файлы страниц калькулятора страниц
const pagesDir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(pagesDir)
  .filter(file => file.startsWith('skolko-stranic-') && file.endsWith('.astro'))
  .map(file => path.join(pagesDir, file));

console.log(`Найдено ${files.length} файлов для исправления`);

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);

  // Исправить og:url
  let modified = content.replace(
    /<meta property="og:url" content="https:\/\/bookscalculator\.ru\/[^"]*">/g,
    `<meta property="og:url" content={canonicalURL}>`
  );

  // Исправить Schema.org URL
  modified = modified.replace(
    /"url": "https:\/\/bookscalculator\.ru\/[^"]*"/g,
    `"url": canonicalURL`
  );

  if (modified !== content) {
    fs.writeFileSync(filePath, modified, 'utf8');
    console.log(`✅ Исправлен: ${fileName}`);
  } else {
    console.log(`⏭️  Пропущен: ${fileName}`);
  }
});

console.log('Готово!');