---
title: '开发笔记 v0.3.0：迁入个人开发时间线与同步工作流'
date: '2026-07-21'
tags: [开发笔记, 架构]
site: 开发笔记
slug: 'devnotes-v030'
---

DevNotes 正式承接个人开发时间线，形成从 Git 版本检测、Markdown 内容维护到静态详情页发布的完整链路。本次版本涉及 68 个文件，新增 1632 行、删除 7 行。

## 内容架构

- 新增 Astro `timeline` content collection
- 将熊窝中的 56 条历史记录迁为独立 Markdown 文件
- 以 `src/content/timeline/*.md` 作为时间线唯一数据源
- 页面自动按日期与版本号排序，无需维护 JavaScript 数组

## 页面体验

- 新增开发时间线侧栏入口、站点筛选与标题/标签搜索
- 每条记录使用 `/timeline/<slug>/` 独立详情路由
- 修复初版页面缺少 Layout 导致的 UTF-8 乱码和样式丢失
- 修复筛选状态变化但卡片仍显示的问题
- 支持根路径及 GitHub Pages `/devnotes/` 子路径部署

## 自动同步

- 将 `sync-timeline.py`、post-commit hook 和安装器迁入 DevNotes
- 提交后扫描六个站点的 `(major, minor)` 版本缺口
- 六个仓库共用同一提醒 hook，hook 只提示、不自动写入或提交
- 更新 `sync-timeline` skill，使其只写 DevNotes Markdown 条目
