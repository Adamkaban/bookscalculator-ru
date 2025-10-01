#!/usr/bin/env node

/**
 * Скрипт для генерации статических страниц калькулятора слов->страниц
 * Использование: node scripts/generatePagesCalculator.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Данные для генерации страниц
const wordsData = [
  { words: 100, pages: '0.2 страницы', isGreen: true },
  { words: 200, pages: '0.4 страницы', isGreen: true },
  { words: 300, pages: '0.6 страницы', isGreen: true },
  { words: 400, pages: '0.8 страницы', isGreen: false },
  { words: 500, pages: '1 страница', isGreen: false },
  { words: 600, pages: '1.2 страницы', isGreen: false },
  { words: 700, pages: '1.4 страницы', isGreen: false },
  { words: 800, pages: '1.6 страницы', isGreen: false },
  { words: 900, pages: '1.8 страницы', isGreen: false },
  { words: 1000, pages: '2 страницы', isGreen: false },
  { words: 1250, pages: '2.5 страницы', isGreen: false },
  { words: 1500, pages: '3 страницы', isGreen: false },
  { words: 2000, pages: '4 страницы', isGreen: false },
  { words: 2500, pages: '5 страниц', isGreen: false },
  { words: 3000, pages: '6 страниц', isGreen: false },
  { words: 3500, pages: '7 страниц', isGreen: false },
  { words: 4000, pages: '8 страниц', isGreen: false },
  { words: 4500, pages: '9 страниц', isGreen: false },
  { words: 5000, pages: '10 страниц', isGreen: false }
];

// Шаблон для генерации Astro-страницы
const astroTemplate = (words, pages) => `---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import SimpleFooter from '../components/SimpleFooter.astro';
import SEOHead from '../components/SEOHead.astro';
import QuoteBlock from '../components/QuoteBlock.astro';

const wordsToPagesData = [
  ${wordsData.map(item => `  { words: ${item.words}, pages: '${item.pages}', isGreen: ${item.isGreen} }`).join(',\n')}

];

const calculationParams = {
  font: "12 кегль Times New Roman",
  spacing: "полуторный интервал",
  wordsPerPage: "500 слов на страницу"
};
---

<BaseLayout>
  <SEOHead
    title="Сколько страниц ${words} слов? Калькулятор страниц"
    description="${words} слов = ${pages}. Рассчитайте, сколько страниц займут ваши тексты с помощью интерактивного калькулятора страниц для текста."
    keywords="сколько страниц ${words} слов, ${words} слов сколько страниц, калькулятор страниц для текста, расчет страниц"
  />

  <style>
    .typewriter-text {
      border-right: 3px solid #10b981;
      animation: blink 1s infinite;
      display: inline-block;
    }

    .typewriter-text.green {
      color: #10b981 !important;
      font-weight: 700;
    }

    @keyframes blink {
      0%, 50% { border-color: #10b981; }
      51%, 100% { border-color: transparent; }
    }

    .answer-text {
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      font-size: 1.5rem;
      font-weight: 600;
      color: #059669;
      margin-top: 1rem;
    }

    .answer-text.show {
      opacity: 1;
      transform: translateY(0);
    }

    .words-table {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .table-header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: white;
    }

    .table-row {
      transition: all 0.2s ease;
      cursor: pointer;
      border-bottom: 1px solid rgba(226, 232, 240, 0.3);
      padding: 0.75rem 1rem;
    }

    .table-row:hover {
      background: rgba(16, 185, 129, 0.05);
      transform: translateX(4px);
    }

    .table-row.clickable:active {
      transform: translateX(2px);
      background: rgba(16, 185, 129, 0.1);
    }

    .words-cell {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      font-weight: 600;
      color: #0369a1;
      padding: 0.75rem 0.5rem;
    }

    .pages-cell {
      background: rgba(255, 255, 255, 0.9);
      transition: all 0.2s ease;
      padding: 0.75rem 0.5rem;
    }

    @media (max-width: 768px) {
      .words-table {
        font-size: 0.875rem;
      }

      .table-row {
        padding: 0.5rem 0.75rem;
      }

      .words-cell {
        padding: 0.5rem 0.25rem;
      }

      .pages-cell {
        padding: 0.5rem 0.25rem;
      }

      .typewriter-text {
        border-right: none;
      }
    }

    .info-block {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #0ea5e9;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .params-block {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border: 1px solid #22c55e;
      border-radius: 8px;
      padding: 1rem;
    }
  </style>

  <Header />

  <main>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <!-- Hero секция с фиксированным заголовком для ${words} слов -->
      <section class="hero-section py-16">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Сколько страниц
              <span class="typewriter-text ${words <= 300 ? 'green' : ''}">${words} слов?</span>
            </h1>
            <!-- Контейнер для ответа -->
            <div class="answer-text show">Ответ: ${words} слов = ${pages}</div>
            <p class="text-xl md:text-2xl text-slate-600 mt-8">
              Нажмите на любую строку в таблице ниже, чтобы увидеть результат!
            </p>
          </div>
        </div>
      </section>

      <!-- Параметры расчета -->
      <section class="py-6">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="params-block text-center">
              <h3 class="text-lg font-semibold text-green-900 mb-3">📏 Параметры расчета</h3>
              <div class="grid md:grid-cols-3 gap-4 text-green-800">
                <div>
                  <div class="font-semibold">Шрифт</div>
                  <div class="text-sm">{calculationParams.font}</div>
                </div>
                <div>
                  <div class="font-semibold">Интервал</div>
                  <div class="text-sm">{calculationParams.spacing}</div>
                </div>
                <div>
                  <div class="font-semibold">Слов на странице</div>
                  <div class="text-sm">{calculationParams.wordsPerPage}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Интерактивная таблица -->
      <section class="py-12">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="words-table">
              <div class="table-header p-4">
                <div class="grid grid-cols-2 gap-4 text-center">
                  <div class="font-bold text-lg">Количество слов</div>
                  <div class="font-bold text-lg">Страниц</div>
                </div>
              </div>

              <div id="words-table-body">
                {wordsToPagesData.map((item, index) => (
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
                ))}
              </div>
            </div>

            <!-- Дополнительная информация -->
            <div class="mt-6 grid md:grid-cols-2 gap-4">
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
            </div>
          </div>
        </div>
      </section>

      <!-- Призыв к действию -->
      <section class="cta-section py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
              <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                🚀 Подсчитайте скорость чтения
              </h2>
              <p class="text-xl text-slate-600 mb-8">
                Теперь, когда вы знаете, сколько страниц займут ваши тексты, узнайте, за сколько времени вы сможете их прочитать!
              </p>

              <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="/" class="inline-block">
                  <button class="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105">
                    🚀 Калькулятор чтения книг
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <QuoteBlock />
  <SimpleFooter />

  <!-- SEO мета-теги для социальных сетей -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Сколько страниц ${words} слов? Калькулятор страниц">
  <meta property="og:description" content="${words} слов = ${pages}. Интерактивная таблица расчета количества страниц для текста.">
  <meta property="og:url" content="https://bookscalculator.ru/skolko-stranic-${words}-slov">
  <meta property="og:site_name" content="BooksCalculator.ru">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Сколько страниц ${words} слов? Калькулятор страниц">
  <meta name="twitter:description" content="${words} слов = ${pages}. Интерактивная таблица расчета количества страниц для текста">

  <!-- Структурированные данные Schema.org -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Сколько страниц ${words} слов? Калькулятор страниц",
      "description": "${words} слов = ${pages}. Интерактивная таблица для расчета количества страниц по количеству слов",
      "url": "https://bookscalculator.ru/skolko-stranic-${words}-slov",
      "applicationCategory": "Utility",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "RUB"
      }
    }
  </script>
</BaseLayout>

<script>
  // Обработчик кликов по строкам таблицы для страницы ${words} слов
  document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('.table-row.clickable');
    const answerContainer = document.getElementById('answer-container');

    tableRows.forEach(row => {
      row.addEventListener('click', function() {
        const words = this.dataset.words;
        const pages = this.dataset.pages;

        // Показываем ответ под заголовком
        answerContainer.textContent = \`Ответ: \${words} слов = \${pages}\`;
        answerContainer.classList.add('show');

        // Обновляем URL без перезагрузки страницы
        const newUrl = \`/skolko-stranic-\${words}-slov\`;
        window.history.replaceState({}, '', newUrl);

        // Добавляем визуальную обратную связь
        this.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        setTimeout(() => {
          this.style.backgroundColor = '';
        }, 300);
      });
    });

    console.log('📊 Words to Pages calculator (${words} words) loaded');
  });
</script>

<style>
  .hero-section {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }

  html {
    scroll-behavior: smooth;
  }

  .table-row {
    animation: fadeInUp 0.3s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 480px) {
    .words-table {
      margin: 0 -1rem;
      border-radius: 0;
    }

    .table-header,
    .table-row {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .answer-text {
      font-size: 1.25rem;
    }
  }
</style>
`;

// Функция для генерации всех страниц
function generateAllPages() {
  console.log('🚀 Начинаем генерацию статических страниц калькулятора...');

  const targetDir = path.join(__dirname, '..', 'src', 'pages');

  let processedCount = 0;
  let errorCount = 0;

  wordsData.forEach(({ words, pages }) => {
    try {
      const fileName = `skolko-stranic-${words}-slov.astro`;
      const outputPath = path.join(targetDir, fileName);

      // Генерируем контент страницы
      const astroContent = astroTemplate(words, pages);

      // Записываем файл
      fs.writeFileSync(outputPath, astroContent, 'utf8');

      processedCount++;
      console.log(`✅ Создана страница: ${fileName} (${words} слов = ${pages})`);

    } catch (error) {
      errorCount++;
      console.error(`❌ Ошибка создания страницы для ${words} слов:`, error.message);
    }
  });

  console.log('🎉 Генерация завершена!');
  console.log(`📊 Создано файлов: ${processedCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);

  if (processedCount > 0) {
    console.log('\n🎯 Созданные страницы:');
    wordsData.forEach(({ words }) => {
      console.log(`   📄 /skolko-stranic-${words}-slov → "Сколько страниц ${words} слов?"`);
    });
  }
}

// Запускаем генерацию
generateAllPages();