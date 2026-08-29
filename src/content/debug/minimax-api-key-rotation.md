---
title: "MiniMax：API Key - 更换"
date: "2026-08-02"
updated: "2026-08-02"
slug: "minimax-api-key-rotation"
category: "开发工具"
subcategory: "Agent"
description: "MiniMax API Key 失效会同时影响 CC Switch、Hermes 和 MCP 配置，需要统一替换密钥并重启相关会话。"
---
## 适用场景

MiniMax API Key 过期 / 失效，导致 Hermes（飞书 & 终端）、CC Switch 报 401；OpenCode / Claude Code 里的 MiniMax MCP 也会请求超时（`MCP error -32001: Request timed out`）后断连。

## 需要替换的四个位置

1.  **CC Switch**：更新 API Key，保证 Cloud Code 正常生成代码。

2.  **Hermes config.yaml（2 处）**：`~/.hermes/config.yaml` 中 `title_gen.api_key`（~262 行）和 `custom_providers.api_key`（~632 行），把旧 key 替换为新 key。改完执行：

        hermes gateway restart   # 重启网关，飞书重新生效
        hermes                    # 开启新会话

3.  **Hermes .env**：替换 `MINIMAX_CN_API_KEY` 的值，然后：

        hermes model --refresh   # 刷新模型缓存，终端 Hermes 恢复正常

4.  **Claude Code 的 MiniMax MCP 配置**：`~/.claude.json` 中 `mcpServers.MiniMax.env.MINIMAX_API_KEY`，把旧 key 替换为新 key。改完需重启 Agent 会话（MCP 在会话启动时读取该 key），否则视觉 / 搜索等工具请求会超时断连。

## 验证清单

- CC Switch：能正常发起代码生成
- 飞书：给 Hermes 发消息，能收到正常回复（不再 401）
- 终端：`hermes` 启动后对话正常
- OpenCode / Claude Code：重新打开会话后，`mcp__MiniMax__understand_image` 等工具能正常调用
