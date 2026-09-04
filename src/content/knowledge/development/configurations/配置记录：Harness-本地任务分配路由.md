---
title: "配置记录：Harness-本地任务分配路由"
date: '2026-08-16'
updated: '2026-08-16'
category: 开发
subcategory: 配置记录
description: 记录本地 harness 的任务分配路由。
slug: local-harness-task-routing
---
## 会话索引
> VSCode 插件 CodeBuddy 的 '猪窝：追加新日程、收支、水电'，会话 ID：4f0c7dcae2f549d598e580e111d375b6

## 一、当前方案

本机当前按任务类型把工作分派到不同 harness，而非全部交给一个工具。该决策于 2026-08-16 敲定。

核心分工：
- **简单数据的追加** → VSCode 插件里的 CodeBuddy，在已搭好的框架内追加结构化数据（日程/收支/水电、猫猫照片、美食地图记录）
- **复杂模态数据的处理与写入** → VSCode 插件里的 OpenCode，负责处理整理音频、视频、小红书多图等多模态笔记；它对命令行和模型路由的工作做得比较好
- **带视觉的开发和 UI 还原** → CodeBuddy IDE、OpenCode IDE、ChatGPT IDE，尤其 ChatGPT IDE 视觉验收最好
- **Claude Code** → 目前基本搁置，用不到什么；后期可能在这个聊天站接本地服务路由

## 二、路由表

| 工具 | 负责什么 | 状态 |
| --- | --- | --- |
| VSCode 插件 CodeBuddy | 简单数据追加：① 管理日程、收支、水电 ② 追加猫猫照片 ③ 追加美食地图记录 | 主力 |
| VSCode 插件 OpenCode | 复杂模态数据处理与写入：音频、视频、小红书多图等多模态笔记（命令行和模型路由做得较好） | 主力 |
| CodeBuddy IDE | 带视觉的开发和 UI 还原 | 主力 |
| OpenCode IDE | 带视觉的开发和 UI 还原 | 主力 |
| ChatGPT IDE | 带视觉的开发和 UI 还原（视觉验收做得很好） | 主力 |
| Claude Code | 目前搁置；后期可能在聊天站接本地服务路由 | 搁置 |

## 三、当前验证状态

1. 已验证 CodeBuddy IDE 和 ChatGPT IDE 都具有浏览器视觉验收的功能。
