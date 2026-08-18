---
title: "猪窝 v1.8.0：内容集合 - Astro 7 迁移"
date: '2026-08-09'
updated: '2026-08-09'
description: '猪窝完成从 Astro 5 到 Astro 7.2.0 的升级，并将内容集合迁移到 Astro Content Layer，保留现有内容结构和页面兼容性。'
subcategory: [架构]
category: 猪窝
---

猪窝完成从 Astro 5 到 Astro 7.2.0 的升级，并将内容集合迁移到 Astro Content Layer，保留现有内容结构和页面兼容性。

## Content Layer 迁移

- 新增 `src/content.config.ts`，为做饭心得、生活备忘录、入住清单、美食地点、旅行、西安 walk 和吵架复盘集合接入 `glob` loader 与 schema。
- 删除旧的 `src/content/config.ts`，更新备忘录与入住清单详情路由，使用 Astro 7 的 collection entry `id`。
- 同步更新 README、AGENTS、CHANGELOG、依赖锁文件和部署配置，版本号由 1.7.0 升至 1.8.0。

## 美食地图数据维护

- 清理尚未实际到访的美食地点，补充雷记雪花牛烧烤长兴店、南铁夜市和水街夜市记录。
- 保留美食地图的城市、坐标和评价数据结构，完成 Astro 7 迁移后的静态构建验证。

## UI 设计图留档

以下截图根据猪窝 v1.8.0 commit `7e2ad21` 在本地打开「美食地图」路由重建，用于记录 Astro 7 与 Content Layer 迁移后的页面状态。

![猪窝 v1.8.0 UI 重建截图](/images/timeline/home-v180/ui-01.jpg)
