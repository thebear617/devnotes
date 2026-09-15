---
title: "猫猫 v0.17.2：财务公示 Tab、侧边栏收口与重构前 UI 留档"
date: '2026-09-15'
updated: '2026-09-15'
description: '「财务公示」Tab 落地账目公示与价格参考两个视图；桌面端侧边栏收口为默认折叠 + 悬停展开；同时集中留档五个模块重构前的 UI 图，作为下一次大重构的对照基线。'
category: 猫猫
subcategory: [功能, 视觉]
---

猫猫手册 v0.17.2 汇总了这一轮的三件事：新落地的「财务公示」Tab、桌面端侧边栏的交互收口，以及五个模块重构前的 UI 图留档——后者作为下一次视觉与逻辑大重构的对照基线。

## 财务公示 Tab

- 新增「财务公示」Tab，内含「账目公示」与「价格参考」两个可切换视图。
- 数据链路脚本化：`scripts/generate-finance-data.mjs` 生成 `src/data/finance-snapshot.js`，`scripts/validate-finance-data.mjs` 负责校验，审计结果落在 `data/finance-audit.json`。
- 账目详情保留公开凭证、来源表与行号标注、关联猫咪等着重公开的字段，并支持在两个视图间切换浏览。
- 价格参考视图沿用采购台外壳，与账目公示共用同一 Tab 入口。
- 过程文档随仓库归档：`docs/财务公示Stage0冻结记录.md`、`docs/财务公示UI分阶段实现计划.md`（Stage 0-7）。
- 样式独立为 `src/styles/finance.css`。

## 侧边栏交互收口

- 移除侧边栏内部的「收起侧边栏」按钮，样式与事件绑定一并清理，收起入口统一收敛到左侧手柄。
- 桌面端（≥720px）默认折叠；悬停左侧手柄或侧边栏本身即展开，鼠标离开 120ms 后自动收起，不再提供点击固定。
- 展开态下手柄 `opacity: 0` 且不接收指针事件，避免遮挡导航项左缘的点击区域。
- 补上键盘可达性：手柄聚焦与侧边栏内 `focusin` 会保持展开，`focusout` 后收起；`title` 与 `aria-label` 随状态在「展开侧边栏 / 侧边栏已展开」之间同步。
- 手柄在折叠态的描边与底色提高了对比度，避免在米黄色页面上难以发现；移动端抽屉导航、遮罩、✕ 按钮与断点切换逻辑保持不变。

## UI 设计图留档

以下六张图为重构前各模块的界面留底，包含 7 月 30 日四个模块的视图升级稿，以及 9 月 12 日首页数据与字段补齐的留档；其中账目两张对应本版本财务公示 Tab 的价格参考与账目公示视图。只做集中归档，不逐图展开分析。

<div class="timeline-ui-archive">
  <img src="/images/timeline/cats-v0172/ui-01-chronicle.png" alt="猫猫编年史：时间线主视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-02-finance-price.png" alt="猫猫账目：价格参考视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-03-finance-ledger.png" alt="猫猫账目：账目公示视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-04-knowledge.png" alt="猫猫知识：主视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-05-operations.png" alt="物资协作：运营台主视图（重构前）" loading="lazy" />
  <img src="/images/timeline/cats-v0172/ui-06-home-fields.png" alt="猫猫首页：数据字段补齐留档（重构前）" loading="lazy" />
</div>
