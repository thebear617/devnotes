---
title: '常识笔记 v0.10.0：升级 Astro 7 并迁移内容集合'
date: '2026-08-09'
tags: [常识笔记, 架构, 内容]
site: 常识笔记
slug: 'lifenotes-v0100'
---

常识笔记完成从 Astro 5 到 Astro 7.2.0 的升级，并将生活、服务业、AI、汽车、动植物、金融和历史七个内容集合迁移到 Astro Content Layer。此次版本同时收束了内容命名、脚注阅读体验和近期常识资料整理。

## Content Layer 与路由迁移

- 将集合配置从 `src/content/config.ts` 迁移到 `src/content.config.ts`，为七个领域接入 `glob` loader，并保留 `date`、`updated` 等 frontmatter schema 约束。
- 引入 `@astrojs/markdown-remark`，通过 `unified` 保留脚注缩进和脚注悬浮框处理能力。
- 列表与详情路由改用 `entry.data.slug || entry.id`，显式 slug 继续维持既有文章地址；版本号由 0.9.5 升至 0.10.0。

## 内容与阅读体验

- 统一正式内容文件命名，补充猫咪价格速查表、金融术语串讲和日常尺寸对照表等内容。
- 移植脚注悬浮框与图片预览组件，补充尺寸速查图资源，并同步更新相关样式和文档。

构建通过，共生成 49 个页面；显式 slug 与文件路径 fallback 路由均已验证。
