---
title: '熊窝 v0.7.0：新增个人开发时间线同步脚本 sync-timeline.py'
date: '2026-07-10'
tags: [熊窝, 功能]
site: 熊窝
slug: 'personal-v070'
---

- scripts/sync-timeline.py：对比各仓库 main 带版本号 commit 与时间轴
  data.js 已记录的最高大版本，自动把「高于时间轴」的大版本补进时间轴
- 基准 = 时间轴 data.js 自身（不依赖外部 state 账本），patch/历史缺口不回填
- 提供 --status / --dry-run（不写文件）与安全默认（只改 data.js，不 commit/push）
- index.html 版本 meta 同步 v0.6.0 → v0.7.0
