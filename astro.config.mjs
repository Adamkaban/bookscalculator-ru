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
    })
  ]
});