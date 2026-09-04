---
title: "MiniMax：MCP - SDK 版本不兼容"
date: "2026-07-29"
updated: "2026-08-29 22:37"
slug: "minimax-mcp-sdk-version-compatibility"
category: "开发工具"
subcategory: "Agent"
description: "历史记录：MiniMax MCP 使用旧版 SDK 导入路径时的兼容性排障；当前 MCP 已临时停用。"
---

**当前状态（2026-08-29）：** 由于决定不再续订MiniMax Plus，MiniMax MCP 已临时停用。本文中的命令和兼容性约束仅保留作历史排障记录，当前不要据此重新启用服务。

**症状：**OpenCode 的 MCP 状态显示 `Connection closed (-320000)`；终端直接运行服务则报 `ModuleNotFoundError: No module named 'mcp.server.fastmcp'`。

**根因：**MCP Python SDK 的稳定版 2.0.0 于 2026-07-28 发布。MiniMax 的 `minimax-coding-plan-mcp` 0.0.4 仍使用 MCP 1.x 的旧导入路径，却只声明 `mcp[cli]>=1.6.0`、没有 `<2` 上限。`uvx` 新建或刷新运行环境时便自动解析到 2.x，导致 MCP 进程在启动阶段退出；OpenCode 只把这个子进程退出概括为连接关闭。

**修复：**在 OpenCode 的 MCP 配置中，将 `command` 改为：

    ["uvx", "--with", "mcp<2", "minimax-coding-plan-mcp", "-y"]

这会把临时运行环境固定在兼容的 MCP 1.x。终端直接启动时还需要自行提供 `MINIMAX_API_KEY` 与 `MINIMAX_API_HOST`；由 OpenCode 启动时，则会自动注入配置中的 `environment`。

**长期处理：**等待 MiniMax MCP 包适配 MCP SDK 2.x，或由其维护者把依赖约束修正为类似 `mcp>=1.6,<2`；在此之前保留本地的 `mcp<2` 兼容约束。

## 参考资料

- [MCP Python SDK：v2 迁移说明与 `<2` 约束建议](https://github.com/modelcontextprotocol/python-sdk)
- [MiniMax Coding Plan MCP（PyPI）](https://pypi.org/project/minimax-coding-plan-mcp/)

