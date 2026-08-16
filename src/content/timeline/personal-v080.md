---
title: "熊窝 v0.8.0：站点架构 - 日历与记账迁移"
date: '2026-07-11'
updated: '2026-07-11'
description: '移除日历/记账两个 Tab 及其构建管线（build-diary.py 等），相关能力已整体迁移至 home「每日追踪」。'
subcategory: [架构]
category: 熊窝
---

熊窝回归纯个人主页定位。移除日历/记账两个 Tab 及其构建管线（build-diary.py 等），相关能力已整体迁移至 home「每日追踪」。

## 架构
- 删除 calendar/expense 两 Tab 与对应 JS 数据文件
- 日记数据改由 home 编译，personal 不再持有
