// Скрипт для исправления перелинковки между всеми страницами калькулятора слов
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Список всех страниц калькулятора слов
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

const pagesDir = path.join(__dirname, '../src/pages');

// Функция для обработки одной страницы
function processPage(pageName) {
  const filePath = path.join(pagesDir, pageName);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ Файл не найден: ${pageName}`);
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Заменяем таблицу на HTML ссылки
    content = content.replace(
      /<div id="words-table-body">\s*{wordsToPagesData\.map\(\(item, index\) => \(\s*<div[^}]*?<\/div>\s*<\/div>\s*\)\)}/g,
      `<div id="words-table-body">
                 {wordsToPagesData.map((item, index) => (
                   <a href={\`/skolko-stranic-\${item.words}-slov\`}
                      class="table-row-link">
                     <div
                       class="table-row grid grid-cols-2 gap-4 p-4 clickable"
                       data-words={item.words}
                       data-pages={item.pages}
                     >
                       <div class={\`words-cell text-center text-lg \${item.isGreen ? 'text-green-600 font-bold' : ''}\`}>
                         {item.words.toLocaleString('ru-RU')} слов
                       </div>
                       <div class="pages-cell text-center text-lg font-medium py-3">
                         {item.pages}
                       </div>
                     </div>
                   </a>
                 ))}`
    );

    // 2. Заменяем JavaScript код
    content = content.replace(
      /<script>\s*\/\/ Обработчик кликов по строкам таблицы для страницы \d+ слов[\s\S]*?<\/script>/g,
      `<script>
  // Инициализация страницы калькулятора
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Words to Pages calculator loaded');

    // Добавляем обработчик для подсветки строк при наведении
    const tableRowLinks = document.querySelectorAll('.table-row-link');
    tableRowLinks.forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.querySelector('.table-row').style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
      });

      link.addEventListener('mouseleave', function() {
        this.querySelector('.table-row').style.backgroundColor = '';
      });
    });
  });
</script>`
    );

    // 3. Добавляем стили для ссылок
    content = content.replace(
      /(\.table-row\.clickable:active \{\s*transform: translateX\(2px\);\s*background: rgba\(16, 185, 129, 0\.1\);\s*\})/g,
      `$1

    .table-row-link {
      display: block;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
    }

    .table-row-link:hover {
      transform: translateX(4px);
    }`
    );

    // 4. Добавляем блок популярных расчетов
    content = content.replace(
      /(<!-- Дополнительная информация -->[\s\S]*?)(<div class="mt-6 grid md:grid-cols-2 gap-4">[\s\S]*?<\/div>)/g,
      `$1<div class="mt-6 grid md:grid-cols-3 gap-4">
               <div class="info-block">
                 <h3 class="text-lg font-semibold text-blue-900 mb-3">📚 Стандартные объемы</h3>
                 <ul class="space-y-2 text-blue-800 text-sm">
                   <li>• Короткий рассказ: 100-500 слов</li>
                   <li>• Эссе: 500-1000 слов</li>
                   <li>• Повесть: 20.000-50.000 слов</li>
                   <li>• Роман: 60.000+ слов</li>
                 </ul>
               </div>

               <div class="info-block">
                 <h3 class="text-lg font-semibold text-green-900 mb-3">⚡ Быстрый расчет</h3>
                 <ul class="space-y-2 text-green-800 text-sm">
                   <li>• 100 слов ≈ 1 абзац текста</li>
                   <li>• 500 слов ≈ 1 страница книги</li>
                   <li>• 1000 слов ≈ 2 страницы книги</li>
                   <li>• 2500 слов ≈ 5 страниц книги</li>
                   <li>• 5000 слов ≈ 10 страниц книги</li>
                 </ul>
               </div>

               <div class="info-block">
                 <h3 class="text-lg font-semibold text-purple-900 mb-3">🔗 Популярные расчеты</h3>
                 <ul class="space-y-2 text-purple-800 text-sm">
                   <li><a href="/skolko-stranic-100-slov" class="hover:text-purple-600 underline">100 слов</a> - 0.2 страницы</li>
                   <li><a href="/skolko-stranic-200-slov" class="hover:text-purple-600 underline">200 слов</a> - 0.4 страницы</li>
                   <li><a href="/skolko-stranic-500-slov" class="hover:text-purple-600 underline">500 слов</a> - 1 страница</li>
                   <li><a href="/skolko-stranic-1000-slov" class="hover:text-purple-600 underline">1000 слов</a> - 2 страницы</li>
                   <li><a href="/skolko-stranic-5000-slov" class="hover:text-purple-600 underline">5000 слов</a> - 10 страниц</li>
                 </ul>
               </div>
             </div>`
    );

    // 5. Добавляем секцию навигации
    content = content.replace(
      /(\s+<\/section>)\s*(<!-- Призыв к действию -->)/g,
      `$1

       <!-- Навигация между связанными страницами -->
       <section class="py-8 bg-gradient-to-r from-purple-50 to-blue-50">
         <div class="container mx-auto px-4">
           <div class="max-w-4xl mx-auto">
             <h2 class="text-2xl font-bold text-center text-slate-900 mb-6">🔗 Другие расчеты страниц</h2>
             <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
               <a href="/skolko-stranic-100-slov" class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 text-center border border-purple-200">
                 <div class="text-2xl font-bold text-purple-600">100 слов</div>
                 <div class="text-sm text-slate-600">= 0.2 страницы</div>
               </a>
               <a href="/skolko-stranic-200-slov" class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 text-center border border-blue-200">
                 <div class="text-2xl font-bold text-blue-600">200 слов</div>
                 <div class="text-sm text-slate-600">= 0.4 страницы</div>
               </a>
               <a href="/skolko-stranic-500-slov" class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 text-center border border-green-200">
                 <div class="text-2xl font-bold text-green-600">500 слов</div>
                 <div class="text-sm text-slate-600">= 1 страница</div>
               </a>
             </div>
             <div class="text-center mt-6">
               <a href="/skolko-stranic-5000-slov" class="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200">
                 Посмотреть все расчеты →
               </a>
             </div>
           </div>
         </div>
       </section>

       <!-- Призыв к действию -->`
    );

    // Записываем изменения обратно в файл
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Обработана страница: ${pageName}`);
    return true;

  } catch (error) {
    console.error(`❌ Ошибка обработки ${pageName}:`, error.message);
    return false;
  }
}

// Основная функция
function main() {
  console.log('🚀 Начинаем обработку страниц калькулятора слов...\n');

  let successCount = 0;
  let failCount = 0;

  // Обрабатываем страницы, кроме уже обработанных (100, 200, 300 слов)
  const pagesToProcess = wordPages.filter(page =>
    !['skolko-stranic-100-slov.astro', 'skolko-stranic-200-slov.astro', 'skolko-stranic-300-slov.astro'].includes(page)
  );

  for (const page of pagesToProcess) {
    if (processPage(page)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n📊 Результаты:`);
  console.log(`✅ Успешно обработано: ${successCount} страниц`);
  console.log(`❌ Ошибок: ${failCount} страниц`);
  console.log(`🔗 Перелинковка завершена!`);
}

// Запускаем обработку
main();