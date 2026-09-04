---
title: "image-vision：图片附件 - 查看与识别"
date: "2026-08-02"
updated: "2026-08-29 22:35"
category: "skill"
subcategory: ["功能"]
description: "历史记录：新增全局 Agent Skill ~/.config/opencode/skills/image-vision/SKILL.md，把\"纯文本模型看不了图片附件\"的问题封装成可自动触发的技能；其中的 MiniMax 视觉工具链当前已临时停用。"
---

新增全局 Agent Skill `~/.config/opencode/skills/image-vision/SKILL.md`，把"纯文本模型看不了图片附件"的问题封装成可自动触发的技能：一旦对话中出现图片输入，任何 Agent 都能按统一流程把图片落到固定路径，再用当时配置的视觉工具读取内容。

## 背景

当前主模型是纯文本模型，opencode 会在 `unsupportedParts()` 层把图片附件替换成 `ERROR: Cannot read "xxx.png" (this model does not support image input)`，模型拿不到图片本身。此前主会话靠上下文记住了 `clipimg` + `understand_image` 的用法，但其他 Agent 不知道这套流程，见到图片只能报错。

## 内容

- `name: image-vision` + `description`：前置中英文触发词（图片、截图、看图、image、screenshot、paste、剪贴板）+ "无法读取图片输入"错误场景，图片输入时自动加载
- 三步流程：定位图片来源 → 格式准备 → 调用当时配置的视觉工具
- 图片来源优先级：用户给的路径/URL → 粘贴附件（先跑 `clipimg`，失败则找临时目录最近的 `image*.png`）→ glob 查找
- 格式约束：当时的视觉工具只支持 JPEG/PNG/WebP，其他格式用 `sips` 转换
- 关键路径备忘：剪贴板脚本、固定图片路径、粘贴附件临时目录

## 配套

- 配套脚本 `~/.local/bin/clipimg`：macOS `osascript` 把剪贴板里的 PNG 截图存到固定路径 `/private/tmp/clipboard-image.png` 并输出路径
- 历史视觉工具：MiniMax `understand_image`（MCP，支持本地文件路径与 HTTP URL；当前已停用）

## 验证

粘贴截图实测通过：`clipimg` 正确落盘 948×556 PNG，当时的视觉工具完整描述了截图中的界面与文字内容。



## 后续状态（2026-08-29）

本文记录的 MiniMax 视觉工具链已临时停用；当前图片处理应使用 Agent 自带或其他可用的视觉/OCR能力。
