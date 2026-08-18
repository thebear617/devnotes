---
title: "猫猫 v0.10.0：内容集合 - Astro 7 迁移"
date: '2026-08-09'
updated: '2026-08-09'
description: '猫猫手册完成从 Astro 5 到 Astro 7.2.0 的升级，并将科普文章集合适配到 Astro 7 的 Content Layer；猫只档案仍由 js/*.js 作为唯一事实源。'
subcategory: [架构, 内容]
category: 猫猫
---

猫猫手册完成从 Astro 5 到 Astro 7.2.0 的升级，并将科普文章集合适配到 Astro 7 的 Content Layer；猫只档案仍由 `js/*.js` 作为唯一事实源。

## 科普内容集合迁移

- 为 `science` 集合接入 `glob` loader，schema 改用 `astro/zod`，继续支持标题、分类、标签、草稿和发布日期字段。
- 首页知识库路由改用 `entry.data.slug || entry.id`，显式 slug 可用于后续文章改名时保持地址兼容。
- 版本号由 0.9.0 升至 0.10.0，依赖锁文件同步升级到 Astro 7。

## 猫只档案维护

- 补充和替换水手、赫兹、大头、漂亮橘等猫咪照片，统一照片墙卡片高度并保持缩略图与原图目录结构。

构建通过，科普文章数据已正常注入猫猫手册首页。

## UI 设计图留档

以下截图根据猫猫手册 v0.10.0 commit `b02dd41` 在本地重建，用于记录 Astro 7 Content Layer 迁移后的页面状态。

![猫猫手册 v0.10.0 UI 重建截图](/images/timeline/cats-v0100/ui-01.jpg)
