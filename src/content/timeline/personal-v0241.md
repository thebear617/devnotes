---
title: "熊窝 v0.24.1–v0.24.2：路由表与生活仪表盘 - 图标本地化与追踪调整"
date: '2026-08-09'
updated: '2026-08-09'
description: '把 personal 首页路由表的图标全部改为本地静态资源，彻底摆脱对第三方 favicon API 的运行时依赖。'
subcategory: [功能]
category: 熊窝
---

把 personal 首页路由表的图标全部改为本地静态资源，彻底摆脱对第三方 favicon API 的运行时依赖。

## 本地图标替换

此前路由表里 16 个 URL 条目没有图标字段，渲染时会回退到 `www.google.com/s2/favicons` 动态抓取站点 favicon。该国外 API 在国内访问极不稳定，导致大量条目图标加载失败、显示破图。本次为这些条目各补一张本地图标（统一 256×256 PNG），存于 `public/assets/routes/`。

## 渲染兜底

`RouteGroupView.astro` 三处视图（分组卡片 / 列表 / 瀑布流）的图标渲染从「`item.icon || google favicon API`」改为「`item.icon ? 本地图 : 分类 emoji`」。即使未来新增条目忘记配图标，也只显示分类 emoji，不会再请求任何外部服务。

## 图标处理与维护脚本

图标做透明边裁剪并铺满 256×256 画布，避免不同站点 favicon 原始尺寸差异导致的显示不一致。新增 `scripts/download-route-icons.py`（抓取 favicon）与 `scripts/normalize-route-icons.py`（归一化）两个维护脚本。顺带把「猫猫」站点域名更新为 `cat.xdubear.cn`，版本升至 0.24.1。

## v0.24.2 后续调整

8 月 9 日，生活仪表盘在同一 0.24 主线下完成一轮小范围追踪看板调整，并发布 v0.24.2。

- 完善追踪看板的布局、分页与周/月统计展示
- 将 `Blog writing` 替换为 `Term walkthrough`，目标从每日 5 篇改为每日覆盖 20 个术语
- 新增 `Read 100 pages`，每日阅读目标为 100 页
- 保留旧快照数据，但不把旧博客篇数迁移为术语数，避免统计口径混淆

## UI 设计图留档

截图根据熊窝 v0.24.1 commit 70f7e6b 在本地重建，作为 v0.24 主线路由表视觉的代表快照。

![熊窝 v0.24.1 UI 重建截图](/images/timeline/personal-v0241/ui-01.jpg)
