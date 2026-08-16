---
title: "熊窝 v0.21.1：英雄头像 - 小写头像补全"
date: '2026-08-01'
updated: '2026-08-01'
description: 'macOS 大小写不敏感文件系统下，git add champions/[a-z]*.png 通配符未能命中与旧大写头像同 inode 的小写文件，导致 34 个全英雄头像未随 v0.21.0 提交。'
subcategory: [功能]
category: 熊窝
---

macOS 大小写不敏感文件系统下，git add champions/[a-z]*.png 通配符未能命中与旧大写头像同 inode 的小写文件，导致 34 个全英雄头像未随 v0.21.0 提交。本次显式 add 补全，git 索引内小写头像达 173 个（全量）。
