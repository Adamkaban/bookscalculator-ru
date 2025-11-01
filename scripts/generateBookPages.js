#!/usr/bin/env node

/**
 * Скрипт для генерации страниц книг из JSON данных
 * Использование: node scripts/generateBookPages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к папке с JSON данными (корневая папка p-seo text)
const sourceDir = path.join(process.cwd(), 'p-seo text');
const targetDir = path.join(__dirname, '..', 'src', 'pages');

// Шаблон для генерации Astro-страницы
const astroTemplate = (bookData) => `---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import SimpleFooter from '../components/SimpleFooter.astro';
import SEOHead from '../components/SEOHead.astro';
import CTABanner from '../components/CTABanner.astro';
import QuoteBlock from '../components/QuoteBlock.astro';
import { getRelatedBooks, getBookUrl, getDifficultyLevel } from '../utils/bookData.js';

// Данные книги (в реальном проекте будут загружаться динамически)
const book = ${JSON.stringify(bookData, null, 2)};
const relatedBooks = getRelatedBooks(book.id);
const difficulty = getDifficultyLevel(book);
---

<BaseLayout>
  <SEOHead
    slot="head"
    title={book.seo.meta_title}
    description={book.seo.meta_description}
    keywords={book.seo.keywords.join(', ')}
  />

  <Header />

  <main>
    <div class="min-h-screen bg-white">
      <!-- Hero секция -->
      <section class="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {book.title} - {book.author}
            </h1>
            <p class="text-xl text-slate-600 mb-4">
              Подробная информация о книге, время чтения и практические советы
            </p>

            <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6 inline-block w-full max-w-md sm:max-w-none">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
                <div class="info-card bg-white rounded-lg p-4 border border-slate-200">
                  <div class="text-2xl mb-2">📖</div>
                  <div class="text-lg font-bold text-blue-600">{book.basic_info.pages}</div>
                  <div class="text-sm text-slate-600">страниц</div>
                </div>
                <div class="info-card bg-white rounded-lg p-4 border border-slate-200">
                  <div class="text-2xl mb-2">⏰</div>
                  <div class="text-lg font-bold text-green-600">{book.basic_info.reading_time}</div>
                  <div class="text-sm text-slate-600">время чтения</div>
                </div>
                <div class="info-card bg-white rounded-lg p-4 border border-slate-200">
                  <div class="text-2xl mb-2">📚</div>
                  <div class="text-lg font-bold text-purple-600">{book.basic_info.genre}</div>
                  <div class="text-sm text-slate-600">жанр</div>
                </div>
                <div class="info-card bg-white rounded-lg p-4 border border-slate-200">
                  <div class="text-2xl mb-2 difficulty-{difficulty.color === 'green' ? '🟢' : difficulty.color === 'blue' ? '🔵' : '🔴'}"></div>
                  <div class="text-lg font-bold text-orange-600">{difficulty.label}</div>
                  <div class="text-sm text-slate-600">сложность</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Основной контент -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="prose prose-lg prose-slate max-w-none">

              <h2>📊 Основная информация</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-blue-900 mb-4">Технические характеристики</h3>
                  <ul class="space-y-2 text-blue-800">
                    <li><strong>Количество страниц:</strong> {book.basic_info.pages}</li>
                    <li><strong>Количество слов:</strong> {book.basic_info.words.toLocaleString('ru-RU')}</li>
                    <li><strong>Рекомендуемый возраст:</strong> {book.basic_info.recommended_age}</li>
                    <li><strong>Год написания:</strong> {book.basic_info.year_written}</li>
                  </ul>
                </div>
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-green-900 mb-4">Время чтения</h3>
                  <ul class="space-y-2 text-green-800">
                    <li><strong>Среднее время:</strong> {book.basic_info.reading_time}</li>
                    <li><strong>Дней на чтение:</strong> {book.basic_info.reading_days}</li>
                    <li><strong>Скорость чтения:</strong> 250 слов/мин</li>
                  </ul>
                </div>
              </div>

              <h2>💡 Интересные факты</h2>
              <ul class="space-y-3 mb-8">
                {book.interesting_facts.map((fact, index) => (
                  <li class="flex items-start bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <span class="text-yellow-600 text-xl mr-3">{index + 1}.</span>
                    <span class="text-slate-700">{fact}</span>
                  </li>
                ))}
              </ul>

              <h2>🏛️ Исторический контекст</h2>
              <div class="bg-slate-50 border-l-4 border-slate-400 p-6 mb-8">
                <h3 class="text-slate-800 font-semibold mb-3">Период создания:</h3>
                <p class="text-slate-700 mb-4">{book.historical_context.creation_period}</p>
                <h3 class="text-slate-800 font-semibold mb-3">Историческая точность:</h3>
                <p class="text-slate-700">{book.historical_context.historical_accuracy}</p>
              </div>

              <h2>🎭 Особенности жанра</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-purple-900 mb-4">Сравнение с жанром</h3>
                  <p class="text-purple-800">{book.genre_features.genre_comparison}</p>
                </div>
                <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-indigo-900 mb-4">Структура произведения</h3>
                  <p class="text-indigo-800">{book.genre_features.structure_analysis}</p>
                </div>
              </div>

              <h2>📖 Советы по чтению</h2>

              <h3>Графики чтения:</h3>
              <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <h4 class="font-semibold text-green-900 mb-2">Быстрый режим</h4>
                  <p class="text-green-700 text-sm">{book.reading_tips.reading_schedules.speed}</p>
                </div>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <h4 class="font-semibold text-blue-900 mb-2">Стандартный режим</h4>
                  <p class="text-blue-700 text-sm">{book.reading_tips.reading_schedules.standard}</p>
                </div>
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <h4 class="font-semibold text-purple-900 mb-2">Комфортный режим</h4>
                  <p class="text-purple-700 text-sm">{book.reading_tips.reading_schedules.comfort}</p>
                </div>
              </div>

              <h3>Практические рекомендации:</h3>
              <ul class="space-y-2 mb-8">
                {book.reading_tips.practical_hacks.map((hack, index) => (
                  <li class="flex items-start">
                    <span class="text-blue-600 mr-2">•</span>
                    <span class="text-slate-700">{hack}</span>
                  </li>
                ))}
              </ul>

              <h2>🌟 Культурное значение</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-emerald-900 mb-4">Литературное влияние</h3>
                  <p class="text-emerald-800">{book.cultural_significance.literary_impact}</p>
                </div>
                <div class="bg-teal-50 border border-teal-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-teal-900 mb-4">Практическая ценность</h3>
                  <p class="text-teal-800">{book.cultural_significance.practical_value}</p>
                </div>
              </div>

              <h2>🔗 Связанные произведения</h2>
              <div class="grid md:grid-cols-2 gap-4 mb-8">
                {book.related_works.map((related, index) => (
                  <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h4 class="font-semibold text-slate-900 mb-2">{index + 1}. {related.split(' (')[0]}</h4>
                    <p class="text-slate-600 text-sm">{related}</p>
                  </div>
                ))}
              </div>

              <CTABanner />

              <h2>🎬 Современные адаптации</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-red-900 mb-4">Фильмы и сериалы</h3>
                  <p class="text-red-800">{book.modern_adaptations.films_series}</p>
                </div>
                <div class="bg-pink-50 border border-pink-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-pink-900 mb-4">Театр и опера</h3>
                  <p class="text-pink-800">{book.modern_adaptations.theater_opera}</p>
                </div>
              </div>

              <h2>📚 Другие книги для чтения</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {relatedBooks.map((relatedBook) => (
                  <a
                    href={getBookUrl(relatedBook)}
                    class="block bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                  >
                    <h3 class="font-semibold text-blue-900 mb-2">{relatedBook.title}</h3>
                    <p class="text-blue-700 text-sm mb-3">{relatedBook.author}</p>
                    <div class="text-xs text-blue-600">
                      <span>{relatedBook.basic_info.pages} стр • {relatedBook.basic_info.reading_time}</span>
                    </div>
                  </a>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <QuoteBlock />
  <SimpleFooter />

  <!-- Оптимизация производительности -->
  <script>
    // Ленивая загрузка изображений
    document.addEventListener('DOMContentLoaded', function() {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    });

    // Предзагрузка критических ресурсов
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'font';
    preloadLink.type = 'font/woff2';
    preloadLink.crossOrigin = '';
    document.head.appendChild(preloadLink);
  </script>
</BaseLayout>
`;

// Функция для обработки JSON файлов
function processBookFiles() {
  console.log('🚀 Начинаем генерацию страниц книг...');

  try {
    // Читаем все JSON файлы из папки p-seo text
    const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.json'));

    console.log(`📂 Найдено ${files.length} файлов с данными о книгах`);
    console.log(`📂 Папка: ${sourceDir}`);
    console.log(`📂 Файлы: ${files.join(', ')}`);

    let processedCount = 0;
    let errorCount = 0;

    files.forEach(file => {
      const filePath = path.join(sourceDir, file);

      try {
        // Читаем файл с явным указанием кодировки
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Проверяем, что файл не пустой
        if (!fileContent.trim()) {
          console.log(`⚠️ Пропускаем пустой файл: ${file}`);
          return;
        }

        const bookData = JSON.parse(fileContent);

        // Проверяем наличие обязательных полей
        if (!bookData.id || !bookData.title || !bookData.author || !bookData.slug) {
          console.log(`⚠️ Пропускаем файл с неполными данными: ${file}`);
          return;
        }

        const fileName = bookData.slug + '.astro';
        const outputPath = path.join(targetDir, fileName);

        // Генерируем Astro-страницу
        const astroContent = astroTemplate(bookData);

        // Записываем файл
        fs.writeFileSync(outputPath, astroContent, 'utf8');

        processedCount++;
        console.log(`✅ Сгенерирована страница: ${fileName} (${bookData.title})`);

      } catch (error) {
        errorCount++;
        console.error(`❌ Ошибка обработки файла ${file}:`, error.message);
      }
    });

    console.log('🎉 Генерация завершена!');
    console.log(`📊 Обработано файлов: ${processedCount}`);
    console.log(`❌ Ошибок: ${errorCount}`);

  } catch (error) {
    console.error('❌ Критическая ошибка при чтении папки:', error.message);
  }
}

// Запускаем обработку
processBookFiles();