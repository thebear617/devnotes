---
title: "聊天站 v0.6.0：AI 网关 - 模型路由与联网接口"
date: '2026-08-16'
updated: '2026-08-16'
description: 'ChatNotes v0.6.0 增加统一 AI 网关与模型路由：接入聊天、MiniMax 和预览接口，补齐 DeepSeek/MiniMax CLI、联网检索及流式响应的契约和实现文档。'
categories: [架构]
site: 聊天站
---

ChatNotes v0.6.0 增加统一 AI 网关与模型路由：接入聊天、MiniMax 和预览接口，补齐 DeepSeek/MiniMax CLI、联网检索及流式响应的契约和实现文档。

## 网关与模型路由

- 增加 `/api/ai/chat`、`/api/ai/minimax` 和 `/api/ai/preview` 路由，统一浏览器端的 AI 请求边界和错误处理。
- 补齐 DeepSeek、MiniMax 的模型调用封装、提示词、联网搜索和流式输出逻辑，支持本地 CLI 与开发环境启动脚本。
- 增加 ChatNotes Agent Bridge，整理网关、模型适配和开发服务器之间的调用关系，降低前端直接依赖具体模型实现的耦合。
- 更新 README、设计文档和实现文档，明确运行方式、环境变量、网关接口及测试契约。

## 发布验证

- ChatNotes 发布提交：`a43ec4f feat(v0.6.0): 增加 AI 网关与模型路由`。
- ChatNotes 已创建标签 `v0.6.0`，并已推送到 `origin/main`。
- `npm run lint`、`npm run test:unit`（148 个测试）和 `npm run build` 均通过；构建保留 vinext 对动态 API 路由的既有分类提示，不影响构建完成。
