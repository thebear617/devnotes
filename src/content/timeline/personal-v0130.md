---
title: '熊窝 v0.13.0：个人开发时间线迁移至 DevNotes'
date: '2026-07-21'
tags: [熊窝, 架构]
site: 熊窝
slug: 'personal-v0130'
---

熊窝完成一次职责收缩：个人开发时间线从 personal 迁移到 DevNotes，旧入口、重复数据和本地同步实现全部移除。本次版本涉及 11 个文件，新增 200 行、删除 1530 行。

## 时间线迁移

- 删除侧边栏中的「个人开发时间线」Tab
- 删除 Cookbook 时间线列表、详情 Vue 组件及相关状态
- 删除 `cookbookEntries` 重复数据和专用筛选、时间线、详情样式
- 在 README 中明确时间线已由 DevNotes 承接

## 工作流清理

- 删除 personal 内的 `sync-timeline.py`、hook 模板和安装器
- 删除已失效的 `bear-sync` skill
- 时间线同步工具与六仓库 post-commit hook 改由 `devnotes/scripts/` 统一维护

## 每日看板

- 增加完成情况统计条和进度展示
- 优化分类 Tab、三列状态布局及任务卡片视觉
- 更新任务数据与 TodoBoard 缓存版本
