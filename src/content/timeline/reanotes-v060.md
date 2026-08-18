---
title: "科研笔记 v0.6.0：站点架构 - Astro 迁移与四板块阅读"
date: '2026-07-31'
updated: '2026-07-31'
description: 'ReaNotes 在 v0.6.0 完成从 VuePress 2 到 Astro 5 的框架迁移，并将原本以树状文档为中心的阅读方式收束为四个板块的博客式入口。'
subcategory: [架构]
category: 科研笔记
---

ReaNotes 在 v0.6.0 完成从 VuePress 2 到 Astro 5 的框架迁移，并将原本以树状文档为中心的阅读方式收束为四个板块的博客式入口。Markdown 仍是唯一正文源，原有文章地址保留静态重定向。

## 构建与部署统一

- 移除 VuePress、Theme Hope、Vue、MathJax 与旧主题配置，改由 Astro 内容集合读取 `docs/` 中的 Markdown，并使用 KaTeX 渲染公式。
- 包管理从 pnpm 统一到 npm；本地使用 `npm run dev`，GitHub Pages 与 Vercel 使用 `npm ci`、`npm run build` 发布 `dist-astro/`。
- 保留 RSS、sitemap、robots、404 与 GitHub Pages 子路径构建；原 VuePress `.html` 地址继续生成静态跳转页。

## 四板块博客化

- 侧栏改为中英文站点标题与图标化的四个板块入口，桌面端固定、移动端抽屉展开；正文宽度收至右栏的 80%。
- 板块首页提供 LifeNotes 风格搜索框和筛选按钮，文章卡展示标题、摘要、创建日期、Category、Subcategory 和标签。
- “深度学习项目”收敛为从问题定义、数据、建模、训练、评估到线上反馈的实践综述；“深度学习研究”收敛为从研究问题、创新、验证到泛化边界的研究综述。
- 为公开文章补齐描述、创建日期、分类与子分类元数据；项目与研究原有细分链接统一跳转至各自的综述博客。

## UI 设计图留档

以下截图按提交 `4e3bd87` 复原，展示 Astro 迁移后的固定侧栏、搜索筛选工具栏与文章卡片列表。

![科研笔记 v0.6.0 UI 重建截图](/images/timeline/reanotes-v060/ui-01.jpg)
