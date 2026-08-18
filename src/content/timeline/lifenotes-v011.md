---
title: "常识笔记 v0.1.1：内容领域 - 迁移至 9 个领域"
date: '2026-07-09'
updated: '2026-07-09'
description: '本次更新聚焦全量迁移至 9 领域。'
subcategory: [架构]
category: 常识笔记
---

- PILOT_DOMAINS 设为 None，编译除「无畏契约」外全部 9 个领域
- 新增板块：宠物 / 生活 / 社会 / 金融-经济 / 动植物 / 历史
- 各域仅编译「领域地图」「QA」（转录 / 术语表 / 来源池 不编译）
- 历史 / 社会 源无上述页面，编译为空板块，附友好空状态提示
- 修复 app.js eyebrow 残留 commonnotes → lifenotes
- 空板块新增 home-empty 提示样式

## UI 设计图留档

以下截图按提交 `584be4d` 复原，记录全量迁移到 9 个领域后的首页。

![常识笔记 v0.1.1 UI 重建截图](/images/timeline/lifenotes-v011/ui-01.jpg)
