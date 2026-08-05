---
title: '熊窝 v0.24.1：路由表图标全面本地化，移除 Google favicon API 依赖'
date: '2026-08-05'
tags: [熊窝, 功能]
site: 熊窝
slug: 'personal-v0241'
---

把 personal 首页路由表的图标全部改为本地静态资源，彻底摆脱对第三方 favicon API 的运行时依赖。

## 本地图标替换

此前路由表里 16 个 URL 条目没有图标字段，渲染时会回退到 `www.google.com/s2/favicons` 动态抓取站点 favicon。该国外 API 在国内访问极不稳定，导致大量条目图标加载失败、显示破图。本次为这些条目各补一张本地图标（统一 256×256 PNG），存于 `public/assets/routes/`。

## 渲染兜底

`RouteGroupView.astro` 三处视图（分组卡片 / 列表 / 瀑布流）的图标渲染从「`item.icon || google favicon API`」改为「`item.icon ? 本地图 : 分类 emoji`」。即使未来新增条目忘记配图标，也只显示分类 emoji，不会再请求任何外部服务。

## 图标处理与维护脚本

图标做透明边裁剪并铺满 256×256 画布，避免不同站点 favicon 原始尺寸差异导致的显示不一致。新增 `scripts/download-route-icons.py`（抓取 favicon）与 `scripts/normalize-route-icons.py`（归一化）两个维护脚本。顺带把「猫猫」站点域名更新为 `cat.xdubear.cn`，版本升至 0.24.1。
