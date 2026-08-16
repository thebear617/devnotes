---
title: "MiniMax：MCP - SDK 版本不兼容"
date: "2026-07-29"
updated: "2026-07-29"
slug: "minimax-mcp-sdk-version-compatibility"
category: "开发工具"
subcategory: "Agent"
description: "MiniMax MCP 仍使用旧版 SDK 导入路径时，需要暂时将运行环境锁定在 mcp<2。"
---
<p><strong>症状：</strong>OpenCode 的 MCP 状态显示 <code>Connection closed (-320000)</code>；终端直接运行服务则报 <code>ModuleNotFoundError: No module named 'mcp.server.fastmcp'</code>。</p>
<p><strong>根因：</strong>MCP Python SDK 的稳定版 2.0.0 于 2026-07-28 发布。MiniMax 的 <code>minimax-coding-plan-mcp</code> 0.0.4 仍使用 MCP 1.x 的旧导入路径，却只声明 <code>mcp[cli]&gt;=1.6.0</code>、没有 <code>&lt;2</code> 上限。<code>uvx</code> 新建或刷新运行环境时便自动解析到 2.x，导致 MCP 进程在启动阶段退出；OpenCode 只把这个子进程退出概括为连接关闭。</p>
<p><strong>修复：</strong>在 OpenCode 的 MCP 配置中，将 <code>command</code> 改为：</p>
<pre><code>["uvx", "--with", "mcp&lt;2", "minimax-coding-plan-mcp", "-y"]</code></pre>
<p>这会把临时运行环境固定在兼容的 MCP 1.x。终端直接启动时还需要自行提供 <code>MINIMAX_API_KEY</code> 与 <code>MINIMAX_API_HOST</code>；由 OpenCode 启动时，则会自动注入配置中的 <code>environment</code>。</p>
<p><strong>长期处理：</strong>等待 MiniMax MCP 包适配 MCP SDK 2.x，或由其维护者把依赖约束修正为类似 <code>mcp&gt;=1.6,&lt;2</code>；在此之前保留本地的 <code>mcp&lt;2</code> 兼容约束。</p>

## 参考资料

- [MCP Python SDK：v2 迁移说明与 &lt;2 约束建议](https://github.com/modelcontextprotocol/python-sdk)
- [MiniMax Coding Plan MCP（PyPI）](https://pypi.org/project/minimax-coding-plan-mcp/)
