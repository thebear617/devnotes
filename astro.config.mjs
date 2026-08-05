import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeMark from './src/plugins/rehype-mark.mjs';
import rehypePopover from './src/plugins/rehype-popover.mjs';
import rehypeTableWrap from './src/plugins/rehype-table-wrap.mjs';

export default defineConfig({
  base: process.env.SITE_BASE || '/',
  vite: { server: { strictPort: true } },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeMark, rehypeTableWrap, rehypePopover],
  },
  build: {
    format: 'directory',
  },
  redirects: {
    '/': '/notes/',
    '/blog/': '/knowledge/',
    '/prompts/': '/knowledge/',
    '/knowledge/personal-blog-setup/': '/knowledge/personal-blog-building-guide/',
    '/blog/personal-blog-setup/': '/knowledge/personal-blog-building-guide/',
    '/knowledge/how-to-stop-model-laziness/': '/knowledge/awesome-tricks/',
    '/prompts/how-to-stop-model-laziness/': '/knowledge/awesome-tricks/',
    '/knowledge/操作系统入门/': '/knowledge/operating-systems-introduction/',
    '/blog/操作系统入门/': '/knowledge/operating-systems-introduction/',
    '/knowledge/全栈详解/': '/knowledge/traditional-full-stack-development/',
    '/blog/全栈详解/': '/knowledge/traditional-full-stack-development/',
    '/knowledge/full-stack-development/': '/knowledge/traditional-full-stack-development/',
    '/blog/full-stack-development/': '/knowledge/traditional-full-stack-development/',
    '/knowledge/产品形态与技术栈/': '/knowledge/traditional-full-stack-development/',
    '/blog/产品形态与技术栈/': '/knowledge/traditional-full-stack-development/',
    '/knowledge/product-stack/': '/knowledge/traditional-full-stack-development/',
    '/blog/product-stack/': '/knowledge/traditional-full-stack-development/',
    '/knowledge/论文阅读心得/': '/knowledge/paper-reading/',
    '/blog/论文阅读心得/': '/knowledge/paper-reading/',
    '/knowledge/小组会-世界模型/': '/knowledge/world-models/',
    '/blog/小组会-世界模型/': '/knowledge/world-models/',
  },
});
