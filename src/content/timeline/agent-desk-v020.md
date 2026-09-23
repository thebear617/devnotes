---
title: 'Agent Desk v0.2.0：悬浮窗标签化改版、UI 热更新通道与 Codex 会话增强'
date: '2026-09-23'
updated: '2026-09-23'
description: 'Agent Desk v0.2.0 将悬浮窗改为浏览器式标签交互并打通 UI 热更新链路，接入会话标题随原生侧改名自动同步。'
subcategory: [功能, 架构, 视觉]
category: APP
---

悬浮窗完成标签化改版，并打通「改文件即生效」的 UI 热更新链路。

**桌面 UI**
- 会话条改浏览器标签式：扁平内容自适应标签、竖线分隔、小 × 关闭、悬停浮层显示会话详情
- 标签标题前显示后端品牌图标（Claude / OpenAI / OpenCode 内联 SVG + CodeBuddy App 图标 base64，零外部请求）
- 标签区 / 消息区 / 输入框由大容器包裹，统一淡绿底色，去除多余分割线
- 消息气泡删除「你 / Agent」标签；输入框高度基线固定不再跳变；附件 / 发送按钮缩小

**桌面壳**
- 状态栏菜单与应用菜单栏新增「刷新页面」，支持 ⌘R 快捷刷新

**网关**
- 新增 `/v1/dev-reload` SSE：监听 desktop UI 文件变动推送刷新，页面自动 reload（watch error 静默降级）
- 接入会话标题随原生侧改名自动同步（15s 节流重读原生标题，持久化到 sessions.json）

**Codex 适配**
- 历史从 rollout JSONL 读取并过滤环境注入；恢复会话仅使用原生 threadId，避免生成副本
- macOS 存在 ChatGPT.app 自带 Codex CLI 时优先使用，可用 `AGENT_GATEWAY_CODEX_COMMAND` 覆盖

关键文件：`desktop/agent-chat.mjs`、`desktop/macos/AgentDeskPet.swift`、`src/server.mjs`、`src/adapters/codex.mjs`。

## UI 设计图留档

![悬浮窗标签化改版主视图](/images/timeline/agent-desk-v020/ui-01-main.png)

主视图全景：浏览器式标签栏（后端品牌图标 + 竖线分隔 + 小 × 关闭）、大容器统一淡绿底色、精简后的输入框（20px 附件 / 发送按钮），右上角为 Gateway 在线状态。
