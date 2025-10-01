#!/usr/bin/env node

/**
 * Скрипт для обновления навигации в статических страницах калькулятора
 * Заменяет window.location.href на window.history.replaceState для SPA поведения
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Список файлов для обновления
const filesToUpdate = [
  'skolko-stranic-100-slov.astro',
  'skolko-stranic-200-slov.astro',
  'skolko-stranic-300-slov.astro',
  'skolko-stranic-400-slov.astro',
  'skolko-stranic-500-slov.astro',
  'skolko-stranic-600-slov.astro',
  'skolko-stranic-700-slov.astro',
  'skolko-stranic-800-slov.astro',
  'skolko-stranic-900-slov.astro',
  'skolko-stranic-1000-slov.astro',
  'skolko-stranic-1250-slov.astro',
  'skolko-stranic-1500-slov.astro',
  'skolko-stranic-2000-slov.astro',
  'skolko-stranic-2500-slov.astro',
  'skolko-stranic-3000-slov.astro',
  'skolko-stranic-3500-slov.astro',
  'skolko-stranic-4000-slov.astro',
  'skolko-stranic-4500-slov.astro',
  'skolko-stranic-5000-slov.astro'
];

const targetDir = path.join(__dirname, '..', 'src', 'pages');

console.log('🚀 Начинаем обновление навигации в статических страницах...');

let processedCount = 0;
let errorCount = 0;

filesToUpdate.forEach(fileName => {
  const filePath = path.join(targetDir, fileName);

  try {
    // Читаем файл
    let content = fs.readFileSync(filePath, 'utf8');

    // Заменяем навигацию
    const oldNavigation = '        // Перенаправляем на статическую страницу\n        window.location.href = `/skolko-stranic-${words}-slov`;';
    const newNavigation = '        // Обновляем URL без перезагрузки страницы\n        const newUrl = `/skolko-stranic-${words}-slov`;\n        window.history.replaceState({}, \'\', newUrl);';

    if (content.includes(oldNavigation)) {
      content = content.replace(oldNavigation, newNavigation);
      fs.writeFileSync(filePath, content, 'utf8');
      processedCount++;
      console.log(`✅ Обновлена навигация: ${fileName}`);
    } else {
      console.log(`⚠️ Пропущен (уже обновлен): ${fileName}`);
    }

  } catch (error) {
    errorCount++;
    console.error(`❌ Ошибка обновления ${fileName}:`, error.message);
  }
});

console.log('🎉 Обновление завершено!');
console.log(`📊 Обновлено файлов: ${processedCount}`);
console.log(`❌ Ошибок: ${errorCount}`);

if (processedCount > 0) {
  console.log('\n🎯 Все статические страницы теперь используют SPA-навигацию!');
}