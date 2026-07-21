---
title: '常识笔记 v0.1.2：v0.1.2: 修复侧边栏导航项点击回跳总览'
date: '2026-07-10'
tags: [常识笔记, 功能]
site: 常识笔记
slug: 'lifenotes-v012'
---

- 根因：renderNav 生成的侧边栏导航 <a> 写死 href="#"，
  点击把 URL hash 清空 → hashchange → route() 解析为空 → 渲染总览仪表盘。
- 修复：叶子项与子项 href 改为真实页面 hash `#<currentBoard>/<pageId>`，
  点击由浏览器原生跳转，路由正确渲染对应内容页（保留中键新标签打开）。
- 顶栏「☰ 总览」(href="#") 与板块切换器(href="#<boardId>") 本就正确，未改动。
- V0.1.0：lifenotes 首个标注语义版本号的版本（覆盖全量迁移 + 本导航修复构成的初始可用站点）。
