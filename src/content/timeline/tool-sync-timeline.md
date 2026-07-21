---
title: '建立个人开发时间线自动同步系统'
date: '2026-07-20'
tags: [熊窝, 工具]
site: 熊窝
slug: 'tool-sync-timeline'
---

建立了个人开发时间线自动同步系统：脚本检测版本缺口 + Git hook 提醒 + Agent skill 按流程生成条目。

## 组件
- scripts/sync-timeline.py：遍历 6 个站点 git log，按完整版本号（major.minor.patch）检测时间线缺口，支持 --json 输出供 Agent 消费
- scripts/git-hooks/post-commit：每次 personal 仓库提交后自动检测版本缺口并打印提示
- ~/.agents/skills/sync-timeline/SKILL.md：Agent 工作流规则，按文件变更量自动选择精简或详细 body 风格

## 设计决策
- 比较逻辑从按 (major,minor) 分组改为按完整版本号比对所有已存在版本，不再遗漏中间版本（如 v0.3.1 → v0.4.2 之间的 v0.4.1）
- Git hook 只在 personal 仓库触发，不扩散到所有站点
- 条目正文由 Agent 根据 git diff 分析生成：≤10 文件精简摘要，>10 文件结构化 Markdown
- 新站点先列出所有版本让用户确认，再批量导入
- 脚本只改 data.js，不自动 commit / push

## 首次同步
运行 sync-timeline.py 后一次性补全 20 条缺失版本，覆盖全部 6 个站点，时间线从 33 条扩至 53 条。
