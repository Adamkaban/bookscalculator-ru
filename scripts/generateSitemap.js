#!/usr/bin/env node

/**
 * Скрипт для генерации полного sitemap.xml с учетом всех страниц сайта
 * Использование: node scripts/generateSitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Базовые страницы сайта
const basePages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/o-proekte', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-chitat-stranic', priority: '0.9', changefreq: 'weekly' },
  { url: '/skolko-knig-mozhno-prochitat-za-god', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-knig-nado-chitat-v-den', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-slov-na-stranice', priority: '0.7', changefreq: 'monthly' },
  { url: '/klassicheskaya-literatura', priority: '0.9', changefreq: 'weekly' },
  { url: '/fakty-ob-izvestnyh-knigah', priority: '0.7', changefreq: 'monthly' },
];

// Страницы-калькуляторы для слов
const wordCalculatorPages = [
  { url: '/skolko-stranic-100-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-200-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-300-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-400-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-500-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-600-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-700-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-800-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-900-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-1000-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-1250-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-1500-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-2000-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-2500-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-3000-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-3500-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-4000-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-4500-slov', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-stranic-5000-slov', priority: '0.8', changefreq: 'monthly' },
];

// Популярные книги для включения в sitemap (основные)
const popularBooks = [
  { url: '/skolko-chitat-voyna-i-mir', priority: '0.9', changefreq: 'monthly' },
  { url: '/skolko-chitat-prestuplenie-i-nakazanie', priority: '0.9', changefreq: 'monthly' },
  { url: '/skolko-chitat-master-i-margarita', priority: '0.9', changefreq: 'monthly' },
  { url: '/skolko-chitat-anna-karenina', priority: '0.9', changefreq: 'monthly' },
  { url: '/skolko-chitat-evgeniy-onegin', priority: '0.9', changefreq: 'monthly' },
  { url: '/skolko-chitat-tihiy-don-sholokhov', priority: '0.9', changefreq: 'monthly' },
  { url: '/skolko-chitat-gore-ot-uma', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-chitat-revizor', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-chitat-mertvye-dushi', priority: '0.8', changefreq: 'monthly' },
  { url: '/skolko-chitat-idiot', priority: '0.8', changefreq: 'monthly' },
];

// Дополнительные страницы книг (берем из JSON файлов)
const additionalBookPages = [
  { url: '/skolko-chitat-12-podvigov-gerakla', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-451-gradus-po-farengeytu', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-a-zori-zdes-tihie', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-after-ball-tolstoy', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-alisa-v-strane-chudes', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-alye-parusa', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-asya-turgenev', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-baryshnya-krestyanka', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-bednaya-liza', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-belyy-klyik', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-boris-godunov-pushkin', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-chayka-chekhov', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-chudesnyy-doktor', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-demon-lermontov', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-detstvo-tolstoy', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-dikiy-pomeschik', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-don-kixot', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-dubrovskiy', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-dva-kapitana', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-eksponat-vasiliev', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-faust-gete', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-gamlet-shekspir', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-geroy-nashego-vremeni', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-gospodin-iz-san-francisko', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-granatovy-braslet', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-groza-ostrovsky', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-hobbit-tolkin', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-iliada-gomer', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-kapitanskaya-dochka', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-konek-gorbunok-ershov', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-levsha', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-makar-chudra', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-malenkiy-prints', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-matteo-falkone', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-maugli-kipling', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-mednyy-vsadnik', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-mumu-turgenev', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-na-dne-gorky', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-nad-propastyu-vo-rzhi', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-neizvestnyy-tsvetok', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-odisseya-gomer', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-olesya', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-pesn-o-veschem-olege', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-pikovaya-dama', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-portret-gogol', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-revizon', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-robinson-kruzo-defo', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-romeo-i-dzhulietta', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-sadko', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-shinel-gogol', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-sobachye-serdtse', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-starik-i-more', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-starukha-izergil', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-taras-bulba', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-tom-soyer-tven', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-uroki-frantsuzskogo', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-vishnevyy-sad', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-volshebnik-izumrudnogo-goroda', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-yushka', priority: '0.7', changefreq: 'monthly' },
  { url: '/skolko-chitat-zapiski-okhotnika', priority: '0.7', changefreq: 'monthly' },
];

// Объединяем все страницы
const allPages = [
  ...basePages,
  ...wordCalculatorPages,
  ...popularBooks,
  ...additionalBookPages
];

// Генерируем XML sitemap
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  allPages.forEach(page => {
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

// Записываем sitemap в файл
function writeSitemap() {
  try {
    const sitemap = generateSitemap();
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

    // Создаем папку public если она не существует
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, sitemap, 'utf8');
    console.log(`✅ Sitemap успешно сгенерирован: ${outputPath}`);
    console.log(`📊 Всего страниц в sitemap: ${allPages.length}`);

    // Показываем статистику по типам страниц
    const baseCount = basePages.length;
    const calculatorCount = wordCalculatorPages.length;
    const bookCount = popularBooks.length + additionalBookPages.length;

    console.log(`📈 Статистика:`);
    console.log(`   • Базовые страницы: ${baseCount}`);
    console.log(`   • Калькуляторы: ${calculatorCount}`);
    console.log(`   • Страницы книг: ${bookCount}`);

  } catch (error) {
    console.error('❌ Ошибка при генерации sitemap:', error.message);
    process.exit(1);
  }
}

// Запускаем генерацию
writeSitemap();