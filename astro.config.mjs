// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://banksman.app',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // The CMS and share images are not pages.
      filter: (page) => !page.includes('/admin/') && !page.includes('/og/'),
    }),
  ],
});
