import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bookscalculator.ru',
  compressHTML: true,

  build: {
    inlineStylesheets: 'auto'
  },

  integrations: [tailwind(), sitemap()]
});