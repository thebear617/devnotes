---
title: '常识笔记 v0.1.0：站点上线'
date: '2026-07-09'
tags: [常识笔记, 站点]
site: 常识笔记
slug: 'lifenotes-v010'
---

把 Obsidian「知识观察型笔记」编译为多领域常识站。复用科研笔记引擎，品牌色暖橙 #c2410c。

## 编译管线
- build-notes.py 处理 Obsidian 语法（callout、wiki 内链、表格）→ JS 数据文件
- 试点 3 领域（美食/AI/汽车），同日全量迁移至 9 领域
- 仅编译「领域地图 + QA」两页，排除转录/术语表
