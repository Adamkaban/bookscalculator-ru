#!/usr/bin/env node

/**
 * Скрипт для генерации полного sitemap.xml на основе всех существующих страниц
 * Анализирует файловую систему и создает sitemap без изменения кода страниц
 * Использование: node scripts/generateCompleteSitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Функция для преобразования имени файла в URL
function fileNameToUrl(fileName) {
  // Убираем расширение .astro
  const nameWithoutExt = fileName.replace('.astro', '');

  // Преобразуем имя файла в URL путь
  if (nameWithoutExt === 'index') {
    return '/';
  }

  return `/${nameWithoutExt}`;
}

// Функция для определения приоритета страницы
function getPagePriority(fileName, url) {
  // Главная страница - максимальный приоритет
  if (url === '/') {
    return { priority: '1.0', changefreq: 'daily' };
  }

  // Калькуляторы - высокий приоритет
  if (fileName.includes('skolko-stranic-') && fileName.includes('-slov')) {
    return { priority: '0.9', changefreq: 'weekly' };
  }

  // Основные калькуляторы - высокий приоритет
  if (fileName.includes('skolko-chitat-stranic') ||
      fileName.includes('skolko-slov-na-stranice') ||
      fileName.includes('skolko-knig-mozhno-prochitat') ||
      fileName.includes('skolko-knig-nado-chitat')) {
    return { priority: '0.9', changefreq: 'weekly' };
  }

  // Популярные книги - высокий приоритет
  const popularBooks = [
    'voyna-i-mir', 'prestuplenie-i-nakazanie', 'master-i-margarita',
    'anna-karenina', 'evgeniy-onegin', 'tihiy-don-sholokhov',
    'gore-ot-uma', 'revizor', 'mertvye-dushi', 'idiot'
  ];

  if (fileName.includes('skolko-chitat-')) {
    const bookSlug = fileName.replace('skolko-chitat-', '');
    if (popularBooks.some(book => bookSlug.includes(book))) {
      return { priority: '0.9', changefreq: 'monthly' };
    }
    return { priority: '0.8', changefreq: 'monthly' };
  }

  // Классическая литература и факты - средний приоритет
  if (fileName.includes('klassicheskaya-literatura') ||
      fileName.includes('fakty-ob-izvestnyh-knigah')) {
    return { priority: '0.8', changefreq: 'weekly' };
  }

  // О проекте - средний приоритет
  if (fileName.includes('o-proekte')) {
    return { priority: '0.7', changefreq: 'monthly' };
  }

  // Остальные страницы - стандартный приоритет
  return { priority: '0.6', changefreq: 'monthly' };
}

// Функция для анализа папки с страницами
function analyzePagesDirectory() {
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');

  try {
    // Читаем все файлы из папки pages
    const files = fs.readdirSync(pagesDir).filter(file => file.endsWith('.astro'));

    console.log(`📂 Найдено ${files.length} Astro файлов в папке pages`);

    const pages = [];

    files.forEach(file => {
      const url = fileNameToUrl(file);
      const { priority, changefreq } = getPagePriority(file, url);

      pages.push({
        url,
        file,
        priority,
        changefreq
      });
    });

    return pages;

  } catch (error) {
    console.error('❌ Ошибка при чтении папки pages:', error.message);
    return [];
  }
}

// Генерируем XML sitemap
function generateSitemap(pages) {
  const currentDate = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  pages.forEach(page => {
    sitemap += `  <url>
    <loc>https://bookscalculator.ru${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;

  return sitemap;
}

// Основная функция
function createCompleteSitemap() {
  console.log('🚀 Начинаем анализ всех существующих страниц...');

  // Анализируем папку с страницами
  const pages = analyzePagesDirectory();

  if (pages.length === 0) {
    console.error('❌ Не найдено страниц для sitemap');
    return;
  }

  console.log(`✅ Проанализировано ${pages.length} страниц`);

  // Категоризуем страницы для статистики
  const categories = {
    main: pages.filter(p => p.url === '/').length,
    calculators: pages.filter(p => p.file.includes('skolko-') && (p.file.includes('-stranic') || p.file.includes('-slov') || p.file.includes('skolko-knig-'))).length,
    books: pages.filter(p => p.file.includes('skolko-chitat-')).length,
    info: pages.filter(p => p.file.includes('klassicheskaya-literatura') || p.file.includes('fakty-ob-izvestnyh-knigah') || p.file.includes('o-proekte')).length,
    other: pages.filter(p => !p.file.includes('skolko-') && p.url !== '/' && !p.file.includes('klassicheskaya-literatura') && !p.file.includes('fakty-ob-izvestnyh-knigah') && !p.file.includes('o-proekte')).length
  };

  console.log('📊 Статистика по категориям:');
  console.log(`   • Главная: ${categories.main}`);
  console.log(`   • Калькуляторы: ${categories.calculators}`);
  console.log(`   • Страницы книг: ${categories.books}`);
  console.log(`   • Информационные: ${categories.info}`);
  console.log(`   • Другие: ${categories.other}`);

  // Генерируем sitemap
  const sitemap = generateSitemap(pages);

  // Записываем файл
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap-complete.xml');
  const publicDir = path.join(__dirname, '..', 'public');

  // Создаем папку public если она не существует
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sitemap, 'utf8');

  console.log(`✅ Полный sitemap успешно сгенерирован: ${outputPath}`);
  console.log(`📊 Всего страниц в sitemap: ${pages.length}`);

  // Показываем несколько примеров
  console.log('\n📋 Примеры страниц в sitemap:');
  pages.slice(0, 10).forEach(page => {
    console.log(`   ${page.url} (приоритет: ${page.priority})`);
  });

  if (pages.length > 10) {
    console.log(`   ... и еще ${pages.length - 10} страниц`);
  }
}

// Запускаем генерацию
createCompleteSitemap();