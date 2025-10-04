import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://bookscalculator.ru',
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
        if (item.url === 'https://bookscalculator.ru/') {
          return {
            ...item,
            priority: 1.0,
            changefreq: 'daily'
          };
        }

        // Для страниц-калькуляторов устанавливаем высокий приоритет
        if (item.url.includes('/skolko-') && (item.url.includes('-stranic') || item.url.includes('-slov'))) {
          return {
            ...item,
            priority: 0.9,
            changefreq: 'weekly'
          };
        }

        // Для страниц книг устанавливаем средний приоритет
        if (item.url.includes('/skolko-chitat-')) {
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