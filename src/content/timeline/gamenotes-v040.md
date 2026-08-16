---
title: "游戏笔记 v0.4.0：运行环境 - Astro 7 升级"
date: '2026-08-09'
updated: '2026-08-09'
description: '游戏笔记完成从 Astro 5 到 Astro 7.2.0 的运行环境升级。'
subcategory: [架构]
category: 游戏笔记
---

游戏笔记完成从 Astro 5 到 Astro 7.2.0 的运行环境升级。站点没有 Astro 内容集合，继续保留英雄联盟和无畏契约页面的现有静态数据与路由结构，版本号由 0.3.1 升至 0.4.0。

## 构建与校验

- Astro 依赖和锁文件同步升级，README 补充当前版本信息。
- 无畏契约地图回归校验通过：13 张地图、138 项检查全部通过。
- 生产构建通过，共生成 2 个页面。

构建仍提示 `public/valorant/index.html` 与 `src/pages/valorant/index.astro` 同名，Astro 跳过后者的重复输出；这是既有静态入口冲突，本次未改变页面产物。
