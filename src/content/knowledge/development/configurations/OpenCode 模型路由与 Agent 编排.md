---
title: OpenCode 模型路由与 Agent 编排
date: '2026-08-05'
updated: '2026-08-05'
category: 开发与实践
subcategory: 配置记录
description: 记录当前 OpenCode Go 的 Router Agent、任务子 Agent、模型映射、权限边界与用量观察策略。
slug: opencode-model-routing
---
## 会话索引
> codex的‘dev：opencodego-模型路由配置‘

## 一、当前方案

当前采用的是一层轻量的 Agent 编排，而不是在 OpenCode Go provider 外面再搭一个独立的模型网关：

```text
用户请求 → @router → route-* 子 Agent → 结果返回
```

`@router` 负责判断任务类型和委派，不直接修改文件，也不执行 shell 命令。真正的仓库探索、方案分析、代码修改和审查由不同的子 Agent 完成。

OpenCode 的 Agent 分为 primary agent 和 subagent；subagent 可以被主 Agent 通过 Task 工具调用，也可以由用户使用 `@` 直接调用。当前 Router 使用 `mode: all`，因此既可以作为入口使用，也可以被直接选择。[Agents 文档](https://opencode.ai/docs/agents/)

## 二、路由表

| 入口 | 模型 | 负责什么 | 权限边界 |
| --- | --- | --- | --- |
| `@router` | `opencode-go/deepseek-v4-flash` | 判断任务类型、委派子 Agent、汇总结果 | 禁止编辑和 Bash，只允许调用指定的 `route-*` Agent |
| `@route-explore` | `opencode-go/deepseek-v4-flash` | 搜索代码、定位文件、追踪真实执行路径、收集证据 | 只读，禁止编辑和 Bash |
| `@route-plan` | `opencode-go/glm-5.2` | 根因分析、架构设计、实施计划和风险判断 | 只读，禁止编辑和 Bash |
| `@route-build` | `opencode-go/deepseek-v4-flash` | 实际修改代码、内容和配置，运行必要验证 | 编辑和 Bash 允许 |
| `@route-review` | `opencode-go/deepseek-v4-pro` | 检查 diff、测试、构建、发布风险和敏感信息 | 禁止编辑，Bash 需要确认 |
| `@route-docs` | `opencode-go/qwen3.7-plus` | 中文 Markdown、文档、注释和结构化内容；涉及图片时使用模型原生视觉能力 | 编辑和 Bash 允许；默认不调用 `image-vision` skill |
| `@route-vision` | `opencode-go/qwen3.7-plus` | 使用模型原生视觉能力分析截图、界面布局、本地图片和 OCR，必要时处理图片并修改实现 | 编辑和 Bash 允许；默认不调用 `image-vision` skill |

默认模型是 `opencode-go/deepseek-v4-flash`。如果任务只是搜索、解释或实际改代码，优先使用 Flash；复杂规划使用 GLM 5.2；发布前审查才使用 DeepSeek V4 Pro；中文文档和视觉分析统一使用 Qwen3.7 Plus。

`route-docs` 和 `route-vision` 都具备 Qwen3.7 Plus 的原生视觉能力，不默认调用 `image-vision` skill。遇到需要图片理解或图片模态输入的任务，优先交给 `route-vision`；如果任务主体是文档处理，同时需要理解图片，则可以交给 `route-docs`。

## 三、典型工作流

### 1. 简单任务：单 Agent

```text
@router 帮我找出这个页面为什么没有数据
→ route-explore
```

```text
@router 把这个按钮改成统一的主题色
→ route-build
```

```text
@router 分析这张界面截图，找出布局问题和可能的 CSS 原因
→ route-vision
```

### 2. 复杂任务：分阶段委派

```text
@router 诊断并修复一个跨多个文件的功能问题
→ route-explore → route-plan → route-build
```

涉及发布、部署或高风险修改时，再显式增加：

```text
→ route-review
```

当前 Router 提示词要求优先使用最小必要序列，但复杂任务仍可能触发多个子 Agent。因此每个子 Agent 都会产生独立的输入、工具调用和输出，整体 token 用量是累加的，而不是只计算 Router 本身。

## 四、配置文件路径

### 全局默认配置

```text
~/.config/opencode/opencode.json
```

当前只增加了默认模型：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "opencode-go/deepseek-v4-flash",
  "mcp": {}
}
```

OpenCode 的全局用户配置使用 `~/.config/opencode/opencode.json`；全局 Agent 则放在同目录下的 `agents/` 文件夹。[Config 文档](https://opencode.ai/docs/config/)

### Agent 定义目录

```text
~/.config/opencode/agents/
├── router.md
├── route-explore.md
├── route-plan.md
├── route-build.md
├── route-review.md
├── route-docs.md
└── route-vision.md
```

每个 Markdown 文件的 frontmatter 保存 Agent 的模型、模式和权限，正文保存角色提示词。这样模型映射和权限边界不会混在一个很长的 JSON 配置里。

### 其他现存配置

```text
~/.config/opencode/opencode.jsonc
~/.opencode/opencode.json
```

`opencode.jsonc` 当前只保留 schema；`~/.opencode/opencode.json` 是另一个现存配置文件，目前只包含 MiniMax MCP。它与模型路由是两条独立链路，本次没有修改，也没有把任何 API key 写入知识库。

## 五、用量观察策略

暂时不进一步收紧 Router，先使用一段时间观察真实用量和效果。

重点观察：

- 一个普通请求是否经常触发两个以上子 Agent；
- `route-explore` 是否反复读取大量相同文件；
- `route-plan` 是否在简单任务中被不必要地调用；
- `route-review` 是否只在发布前或明确要求时使用；
- Go 的五小时、周和月度额度是否出现异常消耗。

如果用量明显增加，再将策略改成：

```text
默认只调用一个最合适的子 Agent
→ 启动第二个 Agent 前先征得确认
→ 只在复杂或高风险任务中运行完整流水线
```

这比一开始就引入更复杂的外部模型路由器更容易观察问题来源，也更容易回退。OpenCode Go 的额度按模型使用价值计算，低成本模型适合高频探索和实际修改，较高成本模型主要保留给复杂规划与发布审查。[OpenCode Go 文档](https://dev.opencode.ai/docs/go/)

## 六、当前验证状态

- `~/.config/opencode/opencode.json` 已通过 JSON 语法检查；
- 7 个 Agent 文件的 frontmatter、模型映射和权限均已检查；
- OpenCode CLI 的 `debug agent`、`providers` 和 `models` 命令仍受到本机 `opencode.log` 文件访问异常影响，尚未完成动态识别测试；
- 未通过真实 Go 请求做端到端测试，因此当前文章记录的是配置文件层面的已验证状态，不把动态模型目录识别当成已确认结果。
