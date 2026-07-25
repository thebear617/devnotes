---
title: '熊窝 v0.14.0：每日看板迁移至猪窝'
date: '2026-07-25'
tags: [熊窝, 架构]
site: 熊窝
slug: 'personal-v0140'
---

熊窝 v0.14.0 移除每日看板功能，将其完整迁移至猪窝 home 站。

## 移除内容

- 删除 `js/components/TodoBoard.js`（Vue 3 看板组件）和 `js/todo-data.js`（看板数据层）
- 移除 app.js 中 TodoBoard 组件注册与「每日看板」Tab 入口
- 清理 index.html 中的 `<script>` 标签与 `<todo-board>` 模板
- 从 style.css 删除全部 TodoBoard 样式（360 行）

## 迁移说明

看板功能已迁移至猪窝 home 站 v1.2.0，使用 Astro + 原生 JS 重写。熊窝的侧边栏 Tab 从 5 个减至 4 个，页面更精简。
