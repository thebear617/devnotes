---
title: "科研笔记 v0.4.0：卡片正文 - Markdown 渲染"
date: '2026-07-16'
updated: '2026-07-16'
description: '本次更新聚焦v0.4.0 引入卡片 Markdown 正文渲染。'
subcategory: [功能]
category: 科研笔记
---

- 新增 content/replearning/supervised/ 目录，存放 ImageNet 预训练范式与监督表示特性两篇正文
- 引入 marked.umd.js 作为客户端 Markdown 解析器（自托管）
- app.js 新增 loadMarkdownCards() 引擎，卡片支持 markdown 字段自动 fetch 渲染
- replearning.js 中两张卡片从内联 HTML 迁移为 markdown 引用
- 微调 CSS 卡片样式适配 markdown-card 状态

## UI 设计图留档

以下截图按提交 `709d188` 复原，展示表征学习板块在卡片正文 Markdown 化后的内容入口。

![科研笔记 v0.4.0 UI 重建截图](/images/timeline/reanotes-v040/ui-01.jpg)
