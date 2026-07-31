---
title: '新建 Agent Skill：share-scraper（AI 分享页爬取存档）'
date: '2026-08-01'
tags: [skill, 工具]
site: skill
slug: 'skill-share-scraper'
---

新增全局 Agent Skill `~/.claude/skills/share-scraper/`，把 AI 助手的公开分享页（Claude / ChatGPT 分享链接）抓取成干净 Markdown，用于存档、转笔记或二次处理。

## 能力

- 已跑通 Claude 分享页（`claude.ai/share/<uuid>`）与 ChatGPT 分享页（`chatgpt.com/share/...`）
- 基于 Python + Playwright，直接用本机 Google Chrome（`channel="chrome"`，真实指纹，比 Playwright 自带 Chromium 更抗反爬）
- DOM 抽取规则、已知反爬陷阱（Cloudflare Turnstile）与手动过一次的方案均已写入 SKILL.md

## 结构

`~/.claude/skills/share-scraper/`：
- `SKILL.md`：适用场景、前置条件、调用方式、DOM 抽取规则、已知坑
- `scraper.py`：主爬取脚本
- `sites.py`：站点适配（Claude / ChatGPT）
- `stealth.py`：浏览器反检测辅助
- `markdown_export.py`：导出 Markdown
- `requirements.txt`：仅需 `playwright`，无需 `playwright-stealth`

## 说明

- 前置条件：本机已装 Google Chrome；不执行 `playwright install chromium`（默认源在大陆极慢/超时），直接用系统 Chrome
- 无 Chrome 环境可设 `--channel ""` 并走 npmmirror 镜像安装
- 不适用：需登录态页面、非分享页会话 URL、实时对话
