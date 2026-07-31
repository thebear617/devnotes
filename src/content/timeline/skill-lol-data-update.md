---
title: '新建 Agent Skill：lol-data-update（熊窝英雄联盟数据更新）'
date: '2026-08-01'
tags: [技能, 工具]
site: 技能
slug: 'skill-lol-data-update'
---

新增全局 Agent Skill `~/.claude/skills/lol-data-update/SKILL.md`，将熊窝英雄联盟板块的数据更新方法封装成可被发现、可自动触发的技能，供任意 Agent 在 skill 注册表中调用。

## 背景

熊窝英雄联盟板块（`/lol/`）在 v0.21.0 重构为 RESG 全英雄数据驱动的静态快照。英雄速查数据来自 RESG（海克斯大乱斗数据站）公开 API，是**静态数据快照**，游戏版本更新后需要重新拉取。更新流程此前只写在 `personal/README.md`，对 Agent 不够显式。

## 内容

- `name: lol-data-update` + `description`：触发场景（"更新英雄数据"/"刷新海克斯"/"游戏新版本重新拉数据"）
- 数据文件与生成脚本对应表：`lol-heroes.js` / `lol-augments.js`（由 `fetch-lol-all.py` 生成，勿手改）、`lol-nicknames.js`（由 `gen-nicknames.py` 生成）、`lol.js`（手工教学数据）
- 5 步更新流程：可选改 `VERSION` → `fetch-lol-all.py` → `gen-nicknames.py` → `npm run build` → `git push`
- 脚本可选参数（`--no-heads` / `--heros`）、RESG 数据源 API 清单、约束（勿手改生成文件、不自动 git 操作）、验证方式
- 标注本机 dev server 端口 4322 为 personal（避免与 4321 ReaNotes 混淆）

## 配套

- 与 `personal/README.md`「英雄联盟数据更新」章节内容互补：README 面向文档查阅，SKILL.md 面向 Agent 自动触发
- 配套生成脚本：`personal/scripts/fetch-lol-all.py`（拉英雄/海克斯/头像/胜率）、`gen-nicknames.py`（外号+拼音）
