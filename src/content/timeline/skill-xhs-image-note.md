---
title: "xhs-image-note：小红书图集 - 笔记解析"
date: '2026-08-02'
updated: '2026-08-02'
description: '新增全局 Agent Skill ~/.claude/skills/xhs-image-note/，把小红书图集型笔记（正文很短、关键信息全在图片里）的解析流程封装成一条命令：抓 HTML → 提取标题/正文/图片 URL → 下载图片 → 拼图 → 交给 MiniMax 视觉工具读取。'
subcategory: [功能]
category: skill
---

新增全局 Agent Skill `~/.claude/skills/xhs-image-note/`，把小红书图集型笔记（正文很短、关键信息全在图片里）的解析流程封装成一条命令：抓 HTML → 提取标题/正文/图片 URL → 下载图片 → 拼图 → 交给 MiniMax 视觉工具读取。

## 背景

此前只有小红书**视频**转录链路（yt-dlp + mlx-whisper），图集型笔记一直没有可靠方案；用 `ai-agent-book` 拆解 Kimi K3 技术报告时遇到小红书图片帖，重走 2026-05-29 日记里记录的"图集解析链路"并把它固化成了可复用 skill。

## 内容

- 脚本 `scripts/fetch_xhs_note.py`：一条命令完成抓取、提取、下载、拼图
  - 正则提取 HTML 内嵌 unicode-escaped 图片 URL（`http:\u002F\u002Fsns-webpic[^"]+`），无需登录或 JS 渲染
  - 按文件名去重；URL 自带 `!h5_1080jpg` 后缀，下载前截断再重拼
  - `--grid` 用 PIL 拼 2 列网格图，支持 MiniMax 单次 OCR
  - 输出 `meta.json`（标题、正文、图片路径）与 `00.jpg`… 图片
- `SKILL.md`：触发条件、调用方式、OCR 步骤、四个常见坑

## 关键坑（已写入 SKILL.md）

- 裸 `/explore/<id>` 会被安全层 302 到 `/404/sec_...` 拦截 → 必须用带 `xsec_token`/`shareRedId` 的完整分享链接
- 图片 URL 已带 `!h5_1080jpg` 后缀，重复拼接会 403
- desc 用 `json.loads` 解码而非 `unicode_escape`（否则中文/emoji 乱码）
- MiniMax 大图拼图会超时（`MCP error -32001`）→ 拆组、降采样后分批读

## 验证

解析 Kimi K3 训练拆解笔记（小红书 6 图帖）实测通过：正确提取标题、正文与话题标签，6 张图全部下载成功，拼图 OCR 完整读出技术报告内容。
