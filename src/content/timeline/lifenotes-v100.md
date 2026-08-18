---
title: "常识笔记 v1.0.0：本地 CMS - 编辑与文章管理体验"
date: '2026-08-14'
updated: '2026-08-14'
description: '常识笔记发布 v1.0.0，补齐本地开发 CMS，并围绕文章编辑、内容安全和管理界面完成一轮体验升级。'
subcategory: [功能]
category: 常识笔记
---

常识笔记发布 v1.0.0，补齐本地开发 CMS，并围绕文章编辑、内容安全和管理界面完成一轮体验升级。

## 本地开发 CMS

- 新增 `/admin/` 本地管理页面：支持编辑已有文章、新建文章、Markdown 预览与保存，保存内容直接写入 `src/content/`。
- CMS 中按内容核心、内容归类、文件与发布分组编辑器字段，并通过响应式布局适配窄屏设备。
- 保存前校验必填标题、`date`/`updated` 日期格式、`format` 与 `visible` 字段；文章路径限制在允许的 `src/content` 领域目录内，避免越界写入。
- CMS 仅通过 Astro dev server 提供，生产构建会移除 `/admin`，不向静态站点发布管理入口。

## 内容与版本

- 引入 `src/content.config.ts` 内容集合配置，统一 Markdown 内容的读取与 frontmatter schema 约束。
- 同步升级项目版本号至 `v1.0.0`，发布提交为 `95bb161d`。

## UI 稿

后台 UI 采用文章库与编辑表单的两栏布局，包含文章管理、元数据填写和 Markdown 实时预览，整体以橙红色为强调色。

![LifeNotes 本地 CMS 后台 UI 稿](/images/timeline/lifenotes-v100/ui-01.png)

## 交互态 UI 留档

补充 AI 内容列表打开筛选面板，以及选中“开发者工具”后的状态，记录分类筛选从展开到收束的反馈。

<div class="timeline-ui-archive">
  <img src="/images/timeline/lifenotes-v100/ui-02.png" alt="常识笔记 v1.0.0 AI 列表筛选面板" loading="lazy" />
  <img src="/images/timeline/lifenotes-v100/ui-03.png" alt="常识笔记 v1.0.0 开发者工具筛选状态" loading="lazy" />
</div>
