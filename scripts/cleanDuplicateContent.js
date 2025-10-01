// Скрипт для очистки дублирующегося контента со страниц калькулятора слов
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');

// Функция для очистки дублирующегося контента с одной страницы
function cleanPage(pageName) {
  const filePath = path.join(pagesDir, pageName);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ Файл не найден: ${pageName}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Удаляем повторяющиеся блоки .table-row-link стилей
    content = content.replace(
      /(\.table-row-link \{\s*display: block;\s*text-decoration: none;\s*color: inherit;\s*transition: all 0\.2s ease;\s*\}\s*\.table-row-link:hover \{\s*transform: translateX\(4px\);\s*\}\s*)/g,
      ''
    );

    // Удаляем все повторяющиеся блоки кроме первого
    const tableRowLinkPattern = /\.table-row-link \{\s*display: block;\s*text-decoration: none;\s*color: inherit;\s*transition: all 0\.2s ease;\s*\}\s*\.table-row-link:hover \{\s*transform: translateX\(4px\);\s*\}/g;
    const matches = content.match(new RegExp(tableRowLinkPattern.source, 'g'));
    if (matches && matches.length > 1) {
      // Удаляем все повторяющиеся блоки кроме первого
      for (let i = 1; i < matches.length; i++) {
        content = content.replace(matches[i], '');
      }
    }

    // 2. Удаляем повторяющиеся секции навигации
    const navigationPattern = /<!-- Навигация между связанными страницами -->[\s\S]*?Посмотреть все расчеты →[\s\S]*?<\/section>/g;
    const navigationMatches = content.match(new RegExp(navigationPattern.source, 'g'));
    if (navigationMatches && navigationMatches.length > 1) {
      // Удаляем все повторяющиеся секции кроме первой
      for (let i = 1; i < navigationMatches.length; i++) {
        content = content.replace(navigationMatches[i], '');
      }
    }

    // 3. Удаляем дублирующиеся блоки информации "Быстрый расчет"
    const quickCalcPattern = /<div class="info-block">\s*<h3 class="text-lg font-semibold text-green-900 mb-3">⚡ Быстрый расчет<\/h3>[\s\S]*?<\/div>/g;
    const quickCalcMatches = content.match(new RegExp(quickCalcPattern.source, 'g'));
    if (quickCalcMatches && quickCalcMatches.length > 1) {
      // Удаляем все повторяющиеся блоки кроме первого
      for (let i = 1; i < quickCalcMatches.length; i++) {
        content = content.replace(quickCalcMatches[i], '');
      }
    }

    // 4. Очищаем пустые строки и лишние пробелы
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    content = content.replace(/}\s*\n\s*\.table-row-link/g, '}\n\n.table-row-link');

    // Записываем очищенный контент обратно в файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Очищена страница: ${pageName}`);
    return true;

  } catch (error) {
    console.error(`❌ Ошибка очистки ${pageName}:`, error.message);
    return false;
  }
}

// Основная функция
function main() {
  console.log('🧹 Начинаем очистку дублирующегося контента...\n');

  // Список всех страниц калькулятора слов (кроме уже очищенных вручную)
  const wordPages = [
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

  let successCount = 0;
  let failCount = 0;

  for (const page of wordPages) {
    if (cleanPage(page)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n📊 Результаты очистки:`);
  console.log(`✅ Успешно очищено: ${successCount} страниц`);
  console.log(`❌ Ошибок: ${failCount} страниц`);
  console.log(`🧹 Очистка завершена!`);
}

// Запускаем очистку
main();