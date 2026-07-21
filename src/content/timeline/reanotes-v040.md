---
title: '科研笔记 v0.4.0：v0.4.0 引入卡片 Markdown 正文渲染'
date: '2026-07-16'
tags: [科研笔记, 功能]
site: 科研笔记
slug: 'reanotes-v040'
---

- 新增 content/replearning/supervised/ 目录，存放 ImageNet 预训练范式与监督表示特性两篇正文
- 引入 marked.umd.js 作为客户端 Markdown 解析器（自托管）
- app.js 新增 loadMarkdownCards() 引擎，卡片支持 markdown 字段自动 fetch 渲染
- replearning.js 中两张卡片从内联 HTML 迁移为 markdown 引用
- 微调 CSS 卡片样式适配 markdown-card 状态
