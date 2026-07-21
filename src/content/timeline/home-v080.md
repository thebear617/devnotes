---
title: '猪窝 v0.8.0：生活备忘录与物资采购 Tab 改造'
date: '2026-07-10'
tags: [猪窝, 架构]
site: 猪窝
slug: 'home-v080'
---

生活备忘录与物资采购 Tab 由清单式重构为仿美食日历的胶囊双视图：📋 生活备忘 / 🛒 物资采购，各视图内按区域手风琴卡片展开。
- 区域卡片正文统一经 renderMarkdown 渲染（与做饭心得卡片同款 cookbook-md 样式）
- 移除「后续待办事项」板块；卫生间采购项删除「按压式洗衣液（网上买）」
- 顶栏 Tab 改名「生活备忘录及物资采购」→「生活备忘录与物资采购」，并调整顺序
- data.js 结构：follow-up 重构为 memo-supplies，数据拆 lifeMemo / procurement
- setupFoodViews 通用化（胶囊切换 + 手风琴展开对美食日历与本 Tab 共用）
