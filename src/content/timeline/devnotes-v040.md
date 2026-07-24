---
title: '开发笔记 v0.4.0：新增提示词库页，博客与列表支持搜索与标签筛选'
date: '2026-07-25'
tags: [开发笔记, 架构]
site: 开发笔记
slug: 'devnotes-v040'
---

DevNotes 新增第五个独立页面「提示词库」，并把博客/提示词库列表统一升级为可搜索 + 标签筛选的形态。同时把原交互式操作系统学习页改写为博客文章。

## 新增页面

- `src/pages/prompts/` 提示词库：列表 + 详情路由，与博客同构
- 新增 `prompts` content collection，schema 与 `blog` 对齐（title/date/updated?/tags/description?/slug?）
- 来源信息融入正文「参考资料」小节，不再作为独立字段

## 列表搜索与筛选

- 博客与提示词库列表页新增搜索框，匹配标题 + 描述 + 标签
- 新增标签筛选条（复用 `.filter-bar`），标签自动从 content collection 抽取
- 搜索与标签取交集；新增通用 `.list-search` 样式

## 内容改造

- 删除 `src/pages/os.astro` 与 `src/data/os.js`
- 原操作系统交互内容改写为 `src/content/blog/操作系统入门.md`，沿用博客四板块结构
- 清理 `global.css` 中 Operating system guide 专用样式段与响应式规则

## 导航调整

- 侧栏顺序调整：开发时间线置顶，笔记中心次之
- 新增侧栏入口 ✨ 提示词库，位于博客与 AI 排行榜之间