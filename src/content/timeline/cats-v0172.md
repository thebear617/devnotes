---
title: "猫猫 v0.17.2：侧边栏悬停展开与重构前 UI 留档"
date: '2026-09-15'
updated: '2026-09-15'
description: '桌面端侧边栏收口为默认折叠 + 悬停展开并移除内部收起按钮；同时把编年史、账目、知识、物资协作与首页五个模块重构前的 UI 图集中留档，作为下一次大重构的对照基线。'
category: 猫猫
subcategory: [功能, 视觉]
---

猫猫手册 v0.17.2 是视觉与逻辑大重构前的最后一次交互收口：桌面端侧边栏不再保留点击固定态，只留下默认折叠 + 悬停展开；同时把五个主要模块重构前的界面图集中留档，方便重构完成后对照改动幅度。

## 侧边栏交互收口

- 移除侧边栏内部的「收起侧边栏」按钮，样式与事件绑定一并清理，收起入口统一收敛到左侧手柄。
- 桌面端（≥720px）默认折叠；悬停左侧手柄或侧边栏本身即展开，鼠标离开 120ms 后自动收起，不再提供点击固定。
- 展开态下手柄 `opacity: 0` 且不接收指针事件，避免遮挡导航项左缘的点击区域。
- 补上键盘可达性：手柄聚焦与侧边栏内 `focusin` 会保持展开，`focusout` 后收起；`title` 与 `aria-label` 随状态在「展开侧边栏 / 侧边栏已展开」之间同步。
- 手柄在折叠态的描边与底色提高了对比度，避免在米黄色页面上难以发现；移动端抽屉导航、遮罩、✕ 按钮与断点切换逻辑保持不变。

## UI 设计图留档

以下六张图为重构前各模块的界面留底，包含 7 月 30 日四个模块的视图升级稿，以及 9 月 12 日首页数据与字段补齐的留档；只做集中归档，不逐图展开分析。

<div class="timeline-ui-archive">
  <img src="/images/timeline/cats-v0172/ui-01-chronicle.png" alt="猫猫编年史：时间线主视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-02-finance-price.png" alt="猫猫账目：价格参考视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-03-finance-ledger.png" alt="猫猫账目：账目公示视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-04-knowledge.png" alt="猫猫知识：主视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-05-operations.png" alt="物资协作：运营台主视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-06-home-fields.png" alt="猫猫首页：数据字段补齐留档（重构前）" loading="lazy" />
</div>
