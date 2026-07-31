---
title: '熊窝 v0.21.1：补全 v0.21.0 遗漏的 34 个英雄小写头像'
date: '2026-08-01'
tags: [熊窝, 功能]
site: 熊窝
slug: 'personal-v0211'
---

macOS 大小写不敏感文件系统下，git add champions/[a-z]*.png 通配符未能命中与旧大写头像同 inode 的小写文件，导致 34 个全英雄头像未随 v0.21.0 提交。本次显式 add 补全，git 索引内小写头像达 173 个（全量）。
