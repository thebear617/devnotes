---
title: '熊窝 v0.20.1：更新首页路由表'
date: '2026-07-31'
tags: [熊窝, 功能]
site: 熊窝
slug: 'personal-v0201'
---

本次小版本把首页从生活仪表盘切回路由表，并继续完善追踪看板的周/月视图与本地快照。

## 更新首页路由表

- 调整 `SiteSidebar` 顺序与地址：路由表成为首页 (`/index.html`)，生活仪表盘移到独立的 `/dashboard/` 路径。
- 用本地截图替换 Google favicon：为识笔笔记、开发笔记、猪窝、猫猫手册、科研笔记、租房对账表新增 6 张站点截图，`RouteGroupView` 改为优先读取 `item.icon`，回退才走 favicon 接口。
- 给个人站点分类补充透明插画的专属图标容器样式，提高插画在卡片、列表与瀑布流三种视图下的可读性。

## 完善追踪看板的本地快照与周视图

- 周视图新增 `WEEK SUMMARY`、`DAILY BREAKDOWN` 网格、`WEEKLY INSIGHTS` 与 `HABIT TREND` 面板，并加入上一周/下一周导航与导出周报按钮。
- 月视图重构为日历网格 + 侧栏 `WORK TYPE SUMMARY` / `HABIT TYPE SUMMARY`，并补上 `TREND INSIGHTS` 与番茄钟趋势面板。
- 新增「长期目标」视图：默认带 3 条财务目标，支持按状态（进行中/暂停/已完成/已归档）筛选，目标完成后归入历史区。
- `tracker-snapshot.json` 的 schema 升级到携带 `longTerm` 字段；同步接口只在 `dailyRecords` 或 `longTerm` 任一变化时才写入快照。