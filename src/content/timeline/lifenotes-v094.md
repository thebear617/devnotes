---
title: '常识笔记 v0.9.4：内容 schema 迁移 date/updated 必填 + 新内容'
date: '2026-08-06'
tags: [常识笔记, 架构]
site: 常识笔记
slug: 'lifenotes-v094'
---

v0.9.3→v0.9.4 主要变更 = 内容 schema 迁移（date/updated 必填）补齐全站 frontmatter + 新增内容清单。本次版本汇集 07-31 至 08-06 的 12 个未推送提交，改动 45 个文件（+509/-8）。

## 内容 schema 迁移：date/updated 必填

- `src/content/config.ts`：`date` 由 `nullable().default(null)` 改为必填，新增必填 `updated` 字段
- 全站 33 篇文章补齐 frontmatter 的 `date`/`updated`：其中 32 篇仅 +1/+2 行纯字段补充，属 schema 迁移类；家常菜谱在内容更新时一并补齐
- 文章页渲染「发布于 X · 更新于 Y」（对齐 devnotes），`life/[slug].astro`、`[board]/[slug].astro`、`hotel/[slug].astro` 三个模板同步修改

## 新增内容

- 家常菜谱新增 7 道菜（分三批）：牛肉炒玉米、冬阴功；小炒黄牛肉 + 通用技巧章节；爆炒鱿鱼、肉末茄子、煎牛排、腐乳炒空心菜
- 西安地铁直达商场合集（含 2025 地铁线路图 `xian-metro-map-2025.png`）
- 引体向上速成训练方法
- 新家具甲醛除醛指南
- 南宁美食探店链接暂存

## 其他

- 固定本地开发端口（dev 脚本指定 4326）

## 验证

- `npm run build` 通过
