---
title: "开发笔记 v0.15.2：沉浸式 Markdown 编辑器"
date: '2026-08-20'
updated: '2026-08-20'
description: '将本地 CMS Markdown 编辑切换为沉浸式双栏界面，隐藏后台 chrome，仅保留编辑与预览，并提供退出和保存操作。'
subcategory: [功能, 视觉]
category: 开发笔记
---

开发笔记 v0.15.2 聚焦本地 CMS 的沉浸式 Markdown 编辑体验：进入编辑后隐藏后台 chrome，让内容编辑和预览成为页面的主要界面，同时保留清晰的退出与保存入口。

## 沉浸式双栏编辑

- 编辑页面采用浅色主题左右双栏布局，左侧编辑 Markdown，右侧实时预览渲染结果。
- 左侧编辑区保留格式工具栏，减少常用 Markdown 操作的记忆成本。
- 隐藏原有后台 chrome，仅保留与当前编辑任务直接相关的界面。
- 右上角显示“已读取”状态，并提供退出按钮和保存按钮。

## UI 设计图留档

![沉浸式 Markdown 编辑器](/images/timeline/devnotes-v0152/immersive-editor.png)

截图保留原始尺寸和内容，未见敏感信息，因此未做裁剪或打码。
