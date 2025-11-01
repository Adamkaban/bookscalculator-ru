import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Основной домен сайта для canonical URL и sitemap
  site: 'https://bookscalculator.ru',

  // Важно: всегда использовать один формат URL (без trailing slash)
  // Это предотвращает дублирование страниц и проблемы с canonical
  trailingSlash: 'never',

  compressHTML: true,

  build: {
    inlineStylesheets: 'auto'
  },

  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Включаем все статические страницы
      filter: (page) => {
        // Исключаем только технические страницы, если они есть
        return !page.includes('/admin') && !page.includes('/api');
      },
      // Кастомные настройки для разных типов страниц
      serialize: (item) => {
        // Для главной страницы устанавливаем максимальный приоритет
        if (item.url.endsWith('/')) {
          return {
            ...item,
            priority: 1.0,
            changefreq: 'daily'
          };
        }

        // Для страниц-калькуляторов устанавливаем высокий приоритет
        if (item.url.includes('/skolko-') && (item.url.includes('-stranic') || item.url.includes('-slov') || item.url.includes('-слов'))) {
          return {
            ...item,
            priority: 0.9,
            changefreq: 'weekly'
          };
        }

        // Для страниц книг устанавливаем средний приоритет
        if (item.url.includes('/skolko-chitat-') && !item.url.includes('-stranic') && !item.url.includes('-slov') && !item.url.includes('-слов')) {
          return {
            ...item,
            priority: 0.8,
            changefreq: 'monthly'
          };
        }

        // Для остальных страниц используем настройки по умолчанию
        return item;
      }
    })
  ]
});