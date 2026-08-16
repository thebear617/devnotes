---
title: "常识笔记 v0.8.0：站点导航 - 侧栏、搜索与两级筛选"
date: '2026-07-28'
updated: '2026-07-28'
description: '常识笔记 v0.8.0 重做整体导航与列表交互：删除总览首页，根路径直接重定向到 AI 产业板块；顶部横向领域切换条改为 home 同款左侧深紫蓝侧栏，移动端抽屉式展开，配色沿用原有暖橙体系。'
subcategory: [架构]
category: 常识笔记
---

常识笔记 v0.8.0 重做整体导航与列表交互：删除总览首页，根路径直接重定向到 AI 产业板块；顶部横向领域切换条改为 home 同款左侧深紫蓝侧栏，移动端抽屉式展开，配色沿用原有暖橙体系。各列表页接入全新 ListExplorer 组件，提供搜索框、一级 category 标签与二级 tags 标签两层筛选，停用原侧栏的 topic 筛选机制，内容宽度统一对齐到 1120px。

## 主要改动

- 删除 `index.astro` 总览页，改为 301 重定向到 `/ai/`；Layout 移除「⌂ 总览」入口。
- 新增 `ListExplorer.astro` 通用组件：搜索框 + 一级分类标签（单选互斥）+ 二级 tags 标签 + 空状态，内联客户端脚本。
- 四类列表页（通用 `[board]` 与 `life/phone/hotel`）统一改为调用 ListExplorer，不再向 Layout 传 `topicFilter`。
- Layout 重写为 home 同款侧栏结构：toggle / backdrop / close / 抽屉脚本，领域导航全部迁入侧栏。
- `global.css` 删除旧 `top-bar/board-switcher/site-shell/site-sidebar` 系统，新增 `sidebar/app-shell/list-search/filter-bar` 样式，沿用原配色变量；补移动端 ≤720px 抽屉媒体查询。
- 收紧侧栏品牌区与导航项的 padding、字号，整体竖向留白减少约一半。
- 同步更新 AGENTS.md / README 中的 skill 路径。
- 跟随提交：新增宠物记录《猫乱尿的五种原因》。