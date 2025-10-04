#!/usr/bin/env node

/**
 * Скрипт для исправления дублированных мета-тегов на страницах книг
 * Удаляет дублированные мета-теги, которые повторяются после компонента SEOHead
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Паттерн для поиска файлов страниц книг
const pattern = 'src/pages/skolko-chitat-*.astro';

async function fixDuplicateMetaTags() {
  console.log('🔍 Начинаем поиск страниц с дублированными мета-тегами...');

  try {
    const files = await glob(pattern);

    console.log(`📄 Найдено ${files.length} файлов для проверки`);

    let fixedCount = 0;

    for (const file of files) {
      const filePath = path.join(process.cwd(), file);

      try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;

        // Паттерн для поиска дублированных мета-тегов в конце файла
        const duplicateMetaPattern = /[\s]*<!-- Мета-теги для мобильной оптимизации -->[\s\S]*?<\/script>[\s]*<\/BaseLayout>/;

        // Проверяем, есть ли дублированные мета-теги
        if (content.includes('import SEOHead from \'../components/SEOHead.astro\'') &&
            content.includes('<!-- Мета-теги для мобильной оптимизации -->')) {

          // Удаляем дублированные мета-теги
          content = content.replace(duplicateMetaPattern, '\n\n</BaseLayout>');

          if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            fixedCount++;
            console.log(`✅ Исправлено: ${file}`);
          }
        }

      } catch (error) {
        console.error(`❌ Ошибка при обработке файла ${file}:`, error.message);
      }
    }

    console.log(`\n🎉 Готово! Исправлено ${fixedCount} файлов`);
    console.log('📋 Рекомендуется проверить сайт после изменений');

  } catch (error) {
    console.error('❌ Ошибка при выполнении скрипта:', error.message);
    process.exit(1);
  }
}

// Запускаем скрипт
fixDuplicateMetaTags();