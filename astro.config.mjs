import { defineConfig } from 'astro/config';
import rehypeMark from './src/plugins/rehype-mark.mjs';

export default defineConfig({
  base: process.env.SITE_BASE || '/',
  markdown: {
    rehypePlugins: [rehypeMark],
  },
  build: {
    format: 'directory',
  },
  redirects: {
    '/': '/notes/',
  },
});
