import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMark from './src/plugins/rehype-mark.mjs';

export default defineConfig({
  base: process.env.SITE_BASE || '/',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeMark],
  },
  build: {
    format: 'directory',
  },
  redirects: {
    '/': '/notes/',
  },
});
