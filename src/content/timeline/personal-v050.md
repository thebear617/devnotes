---
title: '熊窝 v0.5.0：新增会员订阅 Tab'
date: '2026-07-09'
tags: [熊窝, 功能]
site: 熊窝
slug: 'personal-v050'
---

30 条会员订阅记录按标签手风琴分组，含月均消费预览。同日完成支出单源编译改造：Obsidian 日记 #支出 表 → build-diary.py → expense-data.js，不再手改数据。

## 架构意义
- 支出数据实现「记在 Obsidian / 展示在网站」的单源模式
- 与日程编译共用 pre-commit hook 自动构建
