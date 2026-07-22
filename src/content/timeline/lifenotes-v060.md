---
title: '常识笔记 v0.6.0：迁移至 Astro 并完成全领域内容路由'
date: '2026-07-22'
tags: [常识笔记, 架构]
site: 常识笔记
slug: 'lifenotes-v060'
---

常识笔记完成从 Python 编译脚本驱动的纯静态站点到 Astro 5 的架构迁移，正式内容改由 Astro Content Collections 管理，开发、构建和部署链路统一到 Node.js 与 GitHub Actions。

## 内容迁移

- 将 AI产业、汽车、动植物、金融-经济、美食、宠物六个领域的 25 条记录拆分为独立 Markdown 文件
- 将既有生活、手机、酒店内容接入统一的内容集合与详情页路由
- 保留历史资料与视频转写 inbox，将正式发布内容与原始资料分开

## 站点架构

- 新增 Astro 布局、首页、领域页、详情页、内容 schema 和统一领域导航配置
- 支持本地根路径与 GitHub Pages `/lifenotes/` 子路径构建
- 生成 11 个领域入口和 42 个详情页，共 54 个静态页面
- 为历史、社会等暂时没有正式记录的领域保留可访问的空状态页面

## 构建与部署

- 移除旧版 `build-notes.py`、Python 构建依赖、根目录 `index.html`、旧版 CSS/JS 数据产物和兼容层
- 新增 `npm run dev`、`npm run build`、`npm run preview` 以及锁定依赖的 `package-lock.json`
- 新增 GitHub Actions：以 `SITE_BASE=/lifenotes/` 构建 `dist/` 并发布到 GitHub Pages
- 更新 README、AGENTS 和 CLAUDE 项目文档，明确 Astro 内容源、开发命令和部署方式
