---
title: "MiniMax：API Key - 更换"
date: "2026-08-02"
updated: "2026-08-29"
slug: "minimax-api-key-rotation"
category: "开发工具"
subcategory: "Agent"
description: "历史记录：MiniMax API Key 失效时的排障位置；当前 MiniMax MCP 已临时停用。"
---

**当前状态（2026-08-29）：** 由于决定不再续订MiniMax Plus，MiniMax MCP 已临时停用，不再按本文步骤为 MCP 替换或重新启用 API Key。Hermes、CC Switch 等普通 MiniMax API/模型配置仍需按各自实际使用情况单独判断。

## 适用场景

MiniMax API Key 过期 / 失效，导致 Hermes（飞书 & 终端）、CC Switch 报 401；OpenCode / Claude Code 里的 MiniMax MCP 也会请求超时（`MCP error -32001: Request timed out`）后断连。

## 需要替换的四个位置

1.  **CC Switch**：更新 API Key，保证 Cloud Code 正常生成代码。

2.  **Hermes config.yaml（2 处）**：`~/.hermes/config.yaml` 中 `title_gen.api_key`（~262 行）和 `custom_providers.api_key`（~632 行），把旧 key 替换为新 key。改完执行：

        hermes gateway restart   # 重启网关，飞书重新生效
        hermes                    # 开启新会话

3.  **Hermes .env**：替换 `MINIMAX_CN_API_KEY` 的值，然后：

        hermes model --refresh   # 刷新模型缓存，终端 Hermes 恢复正常

4.  **Claude Code 的 MiniMax MCP 配置（历史位置）**：当前已临时停用，不再替换或启用该条目；如未来恢复服务，再按当时的配置重新评估。

## 验证清单

- CC Switch：能正常发起代码生成
- 飞书：给 Hermes 发消息，能收到正常回复（不再 401）
- 终端：`hermes` 启动后对话正常
- OpenCode / Claude Code：确认 MiniMax MCP 未加载，不再以 MiniMax MCP 工具调用作为当前验证项

