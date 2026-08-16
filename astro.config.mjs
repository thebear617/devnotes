import { defineConfig } from 'astro/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import remarkFootnoteIndent from './src/plugins/remark-footnote-indent.mjs';
import rehypeKatex from 'rehype-katex';
import rehypeMark from './src/plugins/rehype-mark.mjs';
import rehypePopover from './src/plugins/rehype-popover.mjs';
import rehypeTableWrap from './src/plugins/rehype-table-wrap.mjs';
import footnoteReferenceWithLabel from './src/plugins/footnote-reference-with-label.mjs';
import localCms from './src/admin/local-cms.mjs';

export default defineConfig({
  base: process.env.SITE_BASE || '/',
  vite: { server: { strictPort: true }, plugins: [localCms()] },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkFootnoteIndent, remarkMath],
      rehypePlugins: [rehypeKatex, rehypeMark, rehypeTableWrap, rehypePopover],
      remarkRehype: {
      handlers: { footnoteReference: footnoteReferenceWithLabel },
      },
    }),
  },
  build: {
    format: 'directory',
  },
  integrations: [{
    name: 'remove-local-cms-from-static-output',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await fs.rm(path.join(dir.pathname, 'admin'), { recursive: true, force: true });
      },
    },
  }],
});
