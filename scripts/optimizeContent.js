#!/usr/bin/env node

/**
 * Скрипт для оптимизации контента и проверки дублирования
 * Использование: node scripts/optimizeContent.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');

// Функция для анализа контента страницы
function analyzePage(pageName) {
  const filePath = path.join(pagesDir, pageName);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ Файл не найден: ${pageName}`);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Анализируем структуру контента
    const analysis = {
      fileName: pageName,
      hasDuplicateMeta: content.includes('og:type') && content.includes('twitter:card'),
      hasInlineStyles: content.includes('<style>') && content.length > 10000,
      hasLongTitle: content.match(/<title>([^<]{100,})/),
      hasCanonical: content.includes('rel="canonical"'),
      lineCount: content.split('\n').length,
      wordCount: content.split(/\s+/).length,
      hasTechnicalMeta: content.includes('noindex') || content.includes('nofollow'),
      hasSchemaMarkup: content.includes('application/ld+json'),
      hasOpenGraph: content.includes('property="og:'),
      hasTwitterCards: content.includes('name="twitter:')
    };

    return analysis;
  } catch (error) {
    console.error(`❌ Ошибка анализа ${pageName}:`, error.message);
    return null;
  }
}

// Функция для оптимизации страницы
function optimizePage(pageName) {
  const filePath = path.join(pagesDir, pageName);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ Файл не найден: ${pageName}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let optimized = false;

    // 1. Удаляем дублирующиеся мета-теги (если они есть)
    if (content.includes('og:type') && content.includes('twitter:card')) {
      // Удаляем дублирующиеся мета-теги в конце файла
      const metaSectionPattern = /<!-- Мета-теги для мобильной оптимизации -->[\s\S]*?<\/script>/g;
      const matches = content.match(metaSectionPattern);

      if (matches && matches.length > 1) {
        // Удаляем все дублирующиеся секции кроме первой
        for (let i = 1; i < matches.length; i++) {
          content = content.replace(matches[i], '');
        }
        optimized = true;
        console.log(`  ✅ Удалены дублирующиеся мета-теги`);
      }
    }

    // 2. Оптимизируем длинные заголовки
    const titleMatch = content.match(/<title>([^<]{100,})/);
    if (titleMatch) {
      const longTitle = titleMatch[1];
      const shortTitle = longTitle.substring(0, 60) + '...';
      content = content.replace(longTitle, shortTitle);
      optimized = true;
      console.log(`  ✅ Укорочен длинный заголовок`);
    }

    // 3. Добавляем канонический URL если отсутствует
    if (!content.includes('rel="canonical"')) {
      // Находим закрывающий тег head
      const headClosePattern = /<\/head>/;
      const canonicalURL = `https://bookscalculator.ru${pageName.replace('.astro', '').replace('index', '')}`;

      const canonicalLink = `  <link rel="canonical" href="${canonicalURL}" />\n`;

      if (headClosePattern.test(content)) {
        content = content.replace(headClosePattern, canonicalLink + '</head>');
        optimized = true;
        console.log(`  ✅ Добавлен канонический URL`);
      }
    }

    // 4. Очищаем лишние пустые строки
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    if (content.includes('\n\n\n')) {
      optimized = true;
      console.log(`  ✅ Удалены лишние пустые строки`);
    }

    // Сохраняем оптимизированный контент
    if (optimized) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Оптимизирована страница: ${pageName}`);
    } else {
      console.log(`ℹ️ Страница не требует оптимизации: ${pageName}`);
    }

    return optimized;

  } catch (error) {
    console.error(`❌ Ошибка оптимизации ${pageName}:`, error.message);
    return false;
  }
}

// Основная функция
function main() {
  console.log('🔍 Начинаем анализ и оптимизацию контента...\n');

  // Получаем список всех Astro файлов
  const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.astro'));

  console.log(`📂 Найдено ${files.length} страниц для анализа\n`);

  // Анализируем все страницы
  const analysisResults = [];
  for (const file of files) {
    const analysis = analyzePage(file);
    if (analysis) {
      analysisResults.push(analysis);
    }
  }

  // Выводим статистику
  console.log('📊 Статистика по страницам:');
  console.log(`Всего страниц: ${analysisResults.length}`);
  console.log(`С дублирующимися мета-тегами: ${analysisResults.filter(a => a.hasDuplicateMeta).length}`);
  console.log(`С очень длинными заголовками: ${analysisResults.filter(a => a.hasLongTitle).length}`);
  console.log(`Без канонических URL: ${analysisResults.filter(a => !a.hasCanonical).length}`);
  console.log(`Технические страницы: ${analysisResults.filter(a => a.hasTechnicalMeta).length}`);
  console.log(`С Schema разметкой: ${analysisResults.filter(a => a.hasSchemaMarkup).length}`);
  console.log(`С Open Graph: ${analysisResults.filter(a => a.hasOpenGraph).length}`);

  console.log('\n🔧 Начинаем оптимизацию...\n');

  // Оптимизируем страницы
  let optimizedCount = 0;
  let errorCount = 0;

  for (const file of files) {
    console.log(`\n📄 Обрабатываем: ${file}`);
    if (optimizePage(file)) {
      optimizedCount++;
    } else {
      errorCount++;
    }
  }

  console.log(`\n📊 Результаты оптимизации:`);
  console.log(`✅ Успешно оптимизировано: ${optimizedCount} страниц`);
  console.log(`❌ Ошибок: ${errorCount} страниц`);
  console.log(`🔧 Оптимизация завершена!`);
}

// Запускаем оптимизацию
main();