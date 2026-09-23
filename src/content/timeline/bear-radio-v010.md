---
title: 'Bear Radio v0.1.0：首个本地多 Agent macOS 应用'
date: '2026-09-22'
updated: '2026-09-22'
description: 'Bear Radio v0.1.0 将本地 Agent Gateway、原生插件会话与 macOS 桌面浮窗整合为一个可持续使用的本地多 Agent 应用。'
subcategory: [功能, 架构, 视觉]
category: APP
---

Bear Radio v0.1.0 是本地多 Agent macOS 应用的首个可用版本。它保留 Agent Gateway 作为内部服务层，同时把多个原生 Agent 会话统一带入一个可全局唤醒的桌面客户端。

## 本地 Agent 会话接入

- 通过统一 Gateway 接入 OpenCode、Claude Code、Codex 和 CodeBuddy 会话。
- 支持发现、恢复和继续已有的本地插件会话，尽量复用原生 session/thread ID。
- DevNotes、LifeNotes 网页入口与独立桌面端共用同一套本地服务。

## 桌面客户端与交互

- 提供原生 macOS Bear Radio 浮窗，支持全局快捷键、窗口拖拽、缩放和红黄绿窗口控制。
- 支持普通窗口层级与“始终置顶”之间切换，不再强制占据所有应用前面。
- 输入框支持附件、暂停当前回复，以及在 Agent 处理期间继续输入并排队发送。

## 版本边界

- 本版本建立了桌面客户端、Gateway 和本地 Agent Adapter 的基本产品边界。
- 后续 `0.1.x` 用于稳定性和交互修复；新的会话持久化、适配器能力或产品化设置进入 `0.2.0`。
