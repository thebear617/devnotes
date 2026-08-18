---
title: "熊窝 v0.5.0：会员订阅 - Tab 新增"
date: '2026-07-09'
updated: '2026-07-09'
description: '30 条会员订阅记录按标签手风琴分组，含月均消费预览。'
subcategory: [功能]
category: 熊窝
---

30 条会员订阅记录按标签手风琴分组，含月均消费预览。同日完成支出单源编译改造：Obsidian 日记 #支出 表 → build-diary.py → expense-data.js，不再手改数据。

## 架构意义
- 支出数据实现「记在 Obsidian / 展示在网站」的单源模式
- 与日程编译共用 pre-commit hook 自动构建

## UI 设计图留档

截图根据熊窝 v0.5.0 commit a43fd1f 在本地重建，记录会员订阅 Tab 的早期表格形态。

![熊窝 v0.5.0 UI 重建截图](/images/timeline/personal-v050/ui-01.jpg)
