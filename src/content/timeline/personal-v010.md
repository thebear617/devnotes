---
title: '熊窝 v0.1.0：上线，第一个 Vue 3 站点'
date: '2026-07-05'
tags: [熊窝, 站点]
site: 熊窝
slug: 'personal-v010'
---

个人主页上线。首次引入 Vue 3（自托管，不依赖 CDN），采用 SPA 单页架构：左侧 sidebar 切换功能 Tab。

## 架构突破
- 从此前的纯手写 DOM → Vue 响应式渲染
- 组件化：每个 Tab 独立组件，数据通过 props 注入
- 路由表、日历追踪、支出记录、Cookbook 四个 Tab 同期上线
