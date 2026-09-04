---
title: "猫猫 v0.15.0：知识科普本地 CMS 后台"
date: '2026-08-31'
updated: "2026-08-31 23:34"
description: '猫猫手册新增仅开发环境可用的知识科普本地 CMS 后台，暖棕色系 UI，支持自动保存与前台同渲染预览；同步精简内容 schema 并统一全部科普文章标题格式。'
category: 猫猫
subcategory: [功能, 架构]
---

猫猫手册 v0.15.0 把 lifenotes / devnotes 同款的本地 CMS 复刻到了知识科普板块：开发服务器内打开 `/cat-knowledge/admin/` 即可在浏览器里直接编辑 `src/content/science/` 下的科普文章，构建产物会自动剔除后台页面。

## CMS 能力

- 文章增删改查走 Vite 中间件本地 API：900ms 防抖自动保存、标题改名自动重命名文件、删除进系统废纸篓（可恢复）。
- 预览使用与前台完全一致的 markdown 渲染逻辑（前台自写渲染器的 node 版），并注入源码行号，支持编辑器与预览双向定位。
- 分类 → 二级主题级联下拉，配合搜索、排序与发布状态筛选；另有沉浸式编辑、撤销重做与未保存草稿恢复。
- dev 单实例锁防止重复启动；`dev:verify` 隔离验收模式下自动保存只写入临时副本，不污染真实文章。

## Schema 精简与文章迁移

- science collection 移除 `tags` 字段，`updated` 与 `slug` 改为必填；前台同步摘除标签云、筛选标签区与文章角标。
- 全部科普文章标题统一为「二级主题：核心内容」格式（文件名跟随重命名），逐篇补齐英文 slug，`updated` 与发布日期对齐。
- 分类字典清理维护说明组，科普目录 README.md 移除。

## UI 设计图留档

<div class="timeline-ui-archive">
  <img src="/images/timeline/cats-v0150/cms-ui-v1.png" alt="猫猫 v0.15.0 知识科普本地 CMS 后台" loading="lazy">
</div>
