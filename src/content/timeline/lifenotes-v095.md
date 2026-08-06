---
title: '常识笔记 v0.9.5：脚注悬浮框与图片预览机制'
date: '2026-08-07'
tags: [常识笔记, 功能]
site: 常识笔记
slug: 'lifenotes-v095'
---

常识笔记 v0.9.5 把 devnotes 的「脚注式悬浮框 + 图片预览」机制完整移植过来，并新增一篇日常速查文章作为首个落地内容。

## 机制移植：脚注悬浮框 + 图片预览

- 构建期插件 `rehype-popover.mjs`：把正文 `[^id]` 替换成虚线按钮，脚注定义打包成 `<template>`，运行期按需注入悬浮面板。
- 构建期插件 `remark-footnote-indent.mjs`：兼容两格缩进脚注写法，避免与四格标准写法的解析冲突。
- 运行期抽成 `ArticlePopover.astro` 共享组件：悬浮面板定位、hover/点击钉住、图片固定高度预览框、全屏 lightbox；支持 Esc、遮罩点击、关闭按钮三途径关闭。
- 挂载到三个文章详情页模板（`life/[slug].astro`、`[board]/[slug].astro`、`hotel/[slug].astro`）。
- 样式适配 lifenotes 暖色系配色：青绿 → 暖橙，类名 `.blog-article-body` → `.article-body`。
- 未启用 devnotes 的 `rehype-table-wrap`——lifenotes 表格已有横向滚动样式，避免回归。

## 新增内容：日常速查对照表

- 新建《日常速查：尺寸、距离、时长与更多实用对照表》（slug: `daily-size-distance-cheatsheet`）。
- 收纳 11 张小红书实用对照表：煮蛋计时、电视观看距离、蛋糕尺寸人数、相框尺寸、袜筒高度、项链长度、裤长、花束大小、行李箱尺寸、自行车轮径身高、手势估尺寸。
- 正文每节一句话 + 中文脚注按钮（如「煮蛋时间」「电视距离」），点击弹出悬浮面板看图，再点开全屏预览；图片按语义命名存入 `public/images/daily-size-charts/`。
- 文章定位为持续追加的速查合集，后续可继续往里加新对照表。

## 验证

- `npm run build` 通过
