---
title: '开发笔记 v0.6.0：博客二级标签体系与 KaTeX 公式支持'
date: '2026-07-25'
tags: [开发笔记, 功能]
site: 开发笔记
slug: 'devnotes-v060'
---

博客页引入「一级 + 二级」双标签筛选，并接入数学公式渲染。

## 双层标签体系

- 一级标签固定为 `编程 / 科研 / 随想`，直接按 frontmatter `tags` 中的字面值命中，不再走映射表。
- 新增 6 个二级标签：`综述 / 实践 / 入门 / 方法 / 会议 / 随笔`。
- 筛选栏拆为两行（分类、标签），支持一级 + 二级组合筛选；一篇文章可挂多个一级标签。
- 8 篇存量文章全部按新规则重新打标。
- schema 新增可选字段 `secondaryTag`，便于在详情页单独展示二级标签。

## KaTeX 公式渲染

- 接入 `remark-math` + `rehype-katex`，`astro.config.mjs` 中 KaTeX 在 rehype-mark 之前执行，避免 `==` 高亮误伤公式等号。
- 博客与提示词详情页 `import 'katex/dist/katex.min.css'`，字体由 Vite 打包走相对路径，不依赖 CDN。
- 支持 `$...$` 行内公式与 `$$...$$` 行间公式，已在《你好，这是第一篇博客》中补充 demo 样例。

## 排版与样式

- 调整 `.blog-article-body` 的 `font-size`、`line-height`，加大 h2/h3/h4 上下间距，正文段距由 0.5rem 提升到 0.75rem。
- 新增 `.blog-article-body hr` 与 `.blog-article-body h4` 规则，分割线前后留白与标题层级一致。

## 新增内容

- 新增博客《Agentic Work》：梳理 Vibe Coding / Vibe Working / Agentic Knowledge Work / Office Agents / Computer-Use Agent 的谱系，含 Karpathy 推文与 Collins 词典引用。
- 文章参考资料从隐藏的 reference link 改为可见的有序列表。