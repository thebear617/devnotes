import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import remarkFootnoteIndent from './src/plugins/remark-footnote-indent.mjs';
import rehypeKatex from 'rehype-katex';
import rehypeMark from './src/plugins/rehype-mark.mjs';
import rehypePopover from './src/plugins/rehype-popover.mjs';
import rehypeTableWrap from './src/plugins/rehype-table-wrap.mjs';
import footnoteReferenceWithLabel from './src/plugins/footnote-reference-with-label.mjs';

export default defineConfig({
  base: process.env.SITE_BASE || '/',
  vite: { server: { strictPort: true } },
  markdown: {
    remarkPlugins: [remarkFootnoteIndent, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeMark, rehypeTableWrap, rehypePopover],
    remarkRehype: {
      handlers: { footnoteReference: footnoteReferenceWithLabel },
    },
  },
  build: {
    format: 'directory',
  },
});
