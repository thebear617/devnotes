---
title: "科研笔记 v0.8.0：内容集合 - Astro 7 迁移"
date: '2026-08-09'
updated: '2026-08-09'
description: '科研笔记完成从 Astro 5.18.2 到 Astro 7.2.0 的升级，继续以 docs/ 中的 Markdown 作为唯一内容源，并适配 Astro 7 的 Content Layer 与 Markdown 处理管线。'
subcategory: [架构]
category: 科研笔记
---

科研笔记完成从 Astro 5.18.2 到 Astro 7.2.0 的升级，继续以 `docs/` 中的 Markdown 作为唯一内容源，并适配 Astro 7 的 Content Layer 与 Markdown 处理管线。

## Astro 7 适配

- 引入 `@astrojs/markdown-remark`，通过 `unified` 保留数学公式、信息容器和 KaTeX 渲染能力。
- 将内容 schema 的 Zod 导入从 `astro:content` 调整为 `astro/zod`，保留现有四个内容集合与 `glob` loader。
- 同步更新依赖锁文件、项目 README 和版本元数据，版本号由 0.7.0 升至 0.8.0。

## 构建验证

- 现有板块、论文译文、RSS、sitemap 和静态文章路由保持可用。
- ReaNotes lint 通过，Astro 构建生成 16 个页面。
