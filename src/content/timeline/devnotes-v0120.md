---
title: '开发笔记 v0.12.0：升级 Astro 7 并提交第32周随笔'
date: '2026-08-09'
tags: [开发笔记, 架构, 内容]
site: 开发笔记
slug: 'devnotes-v0120'
---

开发笔记完成从 Astro 5 到 Astro 7.2.0 的升级，同时补充开发知识与第 32 周随笔内容。

## Content Layer 与 Markdown 管线迁移

- 将集合配置从 `src/content/config.ts` 迁移到 `src/content.config.ts`，为知识库和开发时间线接入 `glob` loader。
- 引入 `@astrojs/markdown-remark`，通过 `unified` 保留数学公式、脚注缩进、KaTeX、表格包裹和脚注悬浮框等既有 Markdown 处理能力。
- 详情页和知识库列表改用 `entry.data.slug || entry.id`，显式 slug 继续保持既有文章 URL 兼容。

## 知识与随笔沉淀

- 新增编程语言综述，补充开发资源合集和第 32 周随笔内容，并修正随笔文件末尾多余空行。
- 同步更新项目文档、依赖锁文件和版本元数据，版本号由 0.11.1 升至 0.12.0。

生产构建通过，共生成 158 个页面。
