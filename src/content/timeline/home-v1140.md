---
title: "猪窝 v1.14.0：日程与财务三页整合为「日程和财务」聚合页"
date: '2026-09-09'
updated: '2026-09-09'
description: '猪窝把原本分散的三个独立页面「每日追踪 / 收支记录 / 会员订阅」合并为同一个「日程和财务」页面下的三个视图，用顶部胶囊切换条（图标按钮 + Hover 文字浮签）切换；本次只做聚合，三个视图的内容与交互保持原样，作为进一步打通视图前的留档。'
category: 猪窝
subcategory: [架构, 功能]
---

猪窝 v1.14.0 把「每日追踪 / 收支记录 / 会员订阅」三个平级侧边栏入口收敛成一个「日程和财务」入口 `/schedule-finance/`，页面内用顶部胶囊切换条在三个视图间切换。本次属于**聚合而非重构**：三个视图各自的模块、数据源与交互逻辑完全保留（每日追踪的农历日历 + 收支/睡眠看板、收支记录的分类卡片 + 趋势图 + 占比图 + TOP 榜、会员订阅的到期统计与列表），先统一入口与导航，为后续真正打通视图留出干净基线。

## 多视图切换

- 视图配置收敛为 `src/lib/tabs.ts` 的 `SCHEDULE_FINANCE_VIEWS`（含 id / 图标 / 名称 / 页面标题），**顺序即切换条顺序**，新增视图只改这一处。
- 切换条仿熊窝 `FloatingNav` 的胶囊形态：白底半透明 + `backdrop-filter: blur(14px)` + 圆角 999px，三个图标按钮（📅 / 💰 / 💳），Hover 或键盘聚焦时下方浮出文字小浮签，移动端隐藏浮签。切换条**左对齐、不吸顶**（中途试过 sticky 吸顶，因会遮挡内容而取消）。
- 当前视图写入 URL `?view=daily-tracker|expense-records|membership`（默认 `daily-tracker`），同时同步 `document.title`，可直接分享/收藏到某个视图；浏览器前进后退由 `popstate` 接回。

## 状态与渲染策略

- 三个视图在首屏一次性全部渲染进 DOM，切换只改 `hidden` + `active` 类，不再重复渲染，切换瞬间完成。
- 三个视图**共享同一个 `CalendarState`**（年 / 月 / 选中日），切换视图不重置：在每日追踪翻到 8 月后切到收支记录，看到的同样是 8 月。各视图内部的翻页、折线选中日等局部状态也各自保留。
- `src/scripts/page.ts` 的 `refresh()` 拆出 `renderView(view)`，新增 `applyScheduleView()` 统一处理「切视图 → 同步 DOM / URL / 标题 / aria」。

## 兼容与作用域调整

- `/daily-tracker/`、`/expense-records/`、`/membership/` 三个旧路由改为 meta refresh 跳转页，分别重定向到 `/schedule-finance/?view=…`；`/utility-tracking/` 同步改跳新地址。
- 页面级 CSS 作用域从 `body[data-page="daily-tracker"|"expense-records"|"membership"]` 收敛为 `body[data-page="schedule-finance"]`（三处 `app-shell` 宽 1100px 合并成一条），会员视图的暖色 palette 改由 JS 同步的 `body[data-view="membership"]` 触发，切到会员视图时才生效。

## 发布验证

- Home 版本由 `1.13.0` 升至 `1.14.0`。
- `npm run build` 成功构建 21 个页面；`git diff --check` 通过。
- 发布提交：`e8e4d4c diary: 9/9 记录…`、`0b49fcb feat: 每日追踪/收支记录/会员订阅整合为「日程和财务」聚合页`、`29d98b6 chore: 发布 v1.14.0`，位于 `thebear617/pig-home` 的 `main`。

## UI 设计图留档

以下为整合前三个视图的原貌留档（每日追踪、收支记录两屏、会员订阅），即本次聚合保留下来的基线状态。

<div class="timeline-ui-archive">
  <img src="/images/timeline/home-v1140/ui-01.png" alt="猪窝整合前·每日追踪视图" loading="lazy" />
  <img src="/images/timeline/home-v1140/ui-02.png" alt="猪窝整合前·收支记录视图（上半）" loading="lazy" />
  <img src="/images/timeline/home-v1140/ui-03.png" alt="猪窝整合前·收支记录视图（下半）" loading="lazy" />
  <img src="/images/timeline/home-v1140/ui-04.png" alt="猪窝整合前·会员订阅视图" loading="lazy" />
</div>
