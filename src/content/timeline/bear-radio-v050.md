---
title: '熊电台 v0.5.0：适配 OpenCode 2.x 交互协议'
date: '2026-10-20'
updated: '2026-10-20'
description: '适配 OpenCode 2.x 的 API、会话数据库和交互事件，打通权限、问题与表单请求在 Gateway、前端和 macOS 宠物端的处理。'
category: APP
subcategory: [功能, 架构]
---

熊电台 v0.5.0 完成 OpenCode 2.x 适配。重点不只是更新请求地址，而是把新版会话、流式事件和需要用户介入的交互请求完整接入现有 Gateway 与绘画界面。

## OpenCode 2.x 会话与请求

- 适配带认证的 `/api` 传输、2.x prompt 请求格式和校验失败后的兼容重试。
- 增加会话空闲等待，避免工具调用产生中间消息后过早结束一轮请求。
- 读取并合并本地 `session_v2` 数据库中的会话，保留已有 OpenCode 会话历史。
- 完善取消、超时和鉴权错误处理，让 Gateway 能够返回明确的会话状态。

## 权限、问题与表单交互

- 将 OpenCode 2.x 的权限请求、问题和表单统一转换为 Gateway 的待处理交互。
- 服务端增加交互状态持久化、查询、SSE 推送和回答接口。
- 前端增加问题等待、选项提交和热更新状态处理，用户可以在绘画界面内完成所需确认。
- macOS 宠物端补充 OpenCode 路径、环境变量和重试加载逻辑。

## 验证

- `npm test`
- 50 项测试通过，覆盖 2.x API、prompt 回退、session_v2、权限、问题和表单路径。
