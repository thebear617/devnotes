---
title: '熊电台 v0.4.0：前端 UI 优化｜Codex 与 Claude Code 输出适配｜CodeBuddy 插件会话适配｜四个后端模型选择'
date: '2026-09-25'
updated: '2026-09-25'
description: '熊电台 v0.4.0 完成前端 UI 优化、Codex 与 Claude Code 输出适配、CodeBuddy VSCode 原生会话双向同步，以及 Claude Code、OpenCode、Codex、CodeBuddy 四个后端的模型选择。'
subcategory: [功能, 视觉, 架构]
category: APP
---

## 1. 前端 UI 优化

- 修复 Markdown 链接渲染：支持链接地址包含括号、尖括号格式，以及链接文字和地址被换行拆开的情况。
- 重做顶部栏与标签页布局：标题栏、会话标签合并为一行；新建入口改为线性图标并移动到右上角；重新调整关闭、最小化、标签页和新建按钮的对齐与点击区域；移除无意义的悬停气泡。
- 调整绘画页面整体布局：内容区约占 80% 宽度并保留两侧留白；移除内容区外层边框但保留输入框边框；输出气泡与输入框等宽，用户气泡右对齐且最大宽度约为内容区 70%。
- 重做滚动逻辑：消息气泡区域独立滚动，底部输入框固定；滚动条移动到应用最右侧，从顶部栏下方延伸到窗口底部。
- 重做初始空状态：使用透明背景的小熊编程插图，标题改为“今天想要做什么？”，根据顶部栏底部和输入框顶部动态计算垂直中心，并按比例放大插图和标题。
- 优化输出气泡元信息：在气泡外部显示模型、用时和积分；默认隐藏，悬停后固定位置渐显；CodeBuddy 额外显示积分。
- 增加 Markdown 复制按钮和复制完成勾选动效，并在输入区增加当前模型选择器，支持显示模型切换状态和失败回滚。
- 移除“几个本地会话”和低价值网关状态提示，保留必要的错误反馈。

## 2.1 Codex 与 Claude Code 输出适配

- Claude Code 默认只展示最终一轮回复，过滤中间过程和不需要展示的思考内容。
- Codex 按 agent message 和消息阶段处理流式输出，只展示最终回答阶段，忽略 commentary 阶段，兼容新旧消息格式。
- 过滤 `<oai-mem-citation>` 等协议元数据，避免内部引用、rollout ID 和系统标签进入用户气泡。
- 增加最终回复事件和持久化处理，避免流式内容与最终结果重复显示。

## 2.2 CodeBuddy VSCode 插件会话适配

- 读取 CodeBuddy VSCode 插件本地原生会话索引、消息文件、请求记录、`selectedModelId`、`modelMap`、chat mode、模型、积分、token 和用时。
- 支持发现、接入和恢复已有的 CodeBuddy 插件会话，保留原生 session ID，并同步原生会话标题和历史上下文。
- 发送新消息时复用原生会话历史，保持熊电台和 VSCode 插件使用同一条上下文链。
- 根据 chat mode 读取并同步实际模型路由，使 Gateway 当前模型、原生会话路由和回复展示模型保持一致。
- 通过 CodeBuddy 兼容 API 显式发送当前模型，解析 SSE 流式回复、实际模型和使用量信息。
- 增加模型错配保护：请求模型与上游实际返回模型不一致时直接报错，不再把降级模型伪装成用户选择的模型。
- 将熊电台发送的用户消息和助手回复写回 CodeBuddy 原生会话，同时写入模型、用时、积分、token 和请求索引，并更新全局模型路由。
- 实现同一原生会话的双向同步：VSCode 插件发送的消息可被熊电台读取，熊电台发送的消息在 VSCode 刷新后可见。
- 支持 CodeBuddy CLI 通过 ACP 切换模型，支持插件绘画会话选择模型，并保持会话状态、实际请求模型和回复显示模型一致。
- 补充 CodeBuddy 专属元信息展示和历史恢复能力，包括实际模型、回复用时、积分消耗及部分 token 使用情况。

## 2.3 四个后端模型选择

- Claude Code 使用可用模型目录和会话模型参数切换模型，下一轮请求使用新的模型。
- OpenCode 从本地服务读取 provider/model 目录，并在下一次 prompt 中显式传入所选模型。
- Codex 通过 app-server 的模型列表和原生 thread 参数切换模型。
- CodeBuddy CLI 通过 ACP 会话配置切换模型，CodeBuddy VSCode 插件会话通过直连请求显式指定模型。
- Gateway 统一暴露模型列表、默认模型、模型选择能力和切换结果，让四个后端共用绘画区的模型选择入口。

## 3. 验证与工程维护

- 增加 Codex、Claude Code、CodeBuddy CLI、CodeBuddy VSCode 插件直连、原生历史写回、模型错配和 Gateway 会话管理测试。
- 补充 CLI、Codex 和 CodeBuddy 的模拟服务夹具，覆盖流式消息、最终消息和模型选择路径。
- 更新 Bear Radio Node 包版本和 macOS App 版本至 0.4.0。

## UI 设计图留档

以下截图记录 v0.4.0 的主会话页、初始页和创建会话页。

<div class="timeline-ui-archive">
  <img src="/images/timeline/bear-radio-v040/ui-01-main.png" alt="熊电台 v0.4.0 主会话页" loading="lazy" />
  <img src="/images/timeline/bear-radio-v040/ui-02-empty.png" alt="熊电台 v0.4.0 初始页" loading="lazy" />
  <img src="/images/timeline/bear-radio-v040/ui-03-create-session.png" alt="熊电台 v0.4.0 创建会话页" loading="lazy" />
</div>
