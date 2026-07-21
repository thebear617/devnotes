---
title: '开发笔记 v0.2.0：Vue 3 → Astro 5 重构'
date: '2026-07-19'
tags: [开发笔记, 架构]
site: 开发笔记
slug: 'devnotes-v020'
---

迁移内容：
- 框架：Vue 3（164KB 运行时）→ Astro 5（零运行时）
- 交互：Vue 组件 → 原生 JS + CSS（~3KB）
- 样式：单一样式表整体迁移，设计 token 不变
- 数据：data-*.js 变更为 ES module，内容无损

架构变化：
- SPA 单页 tab 切换 → 多页路由（/notes /blog /pricing /os）
- 博客模块新增：Astro Content Collections，Markdown 编写
- 侧栏导航从 Vue v-show → <a> 标签独立页面

页面路由：
- /          → 重定向到 /notes/
- /notes/    → 笔记中心（筛选 + 卡片 + 详情展开）
- /blog/     → 博客列表（Markdown 驱动）
- /blog/[slug] → 博客详情
- /pricing/  → 价格矩阵
- /os/       → 操作系统学习指南（章节切换 + 手风琴）

部署：
- 本地：npm run dev
- 构建：npm run build，输出 dist/
- GitHub Pages：SITE_BASE=/devnotes/ npm run build
