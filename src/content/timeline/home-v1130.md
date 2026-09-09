---
title: "猪窝 v1.13.0：厨房工作台一体化（四视图合一 Dashboard）"
date: '2026-09-09'
updated: '2026-09-09'
description: '猪窝把 v1.12.0 的四视图厨房工作台（做菜记录 / 菜谱 / 食材存放 / 价格速查）合并为单页多模块 Dashboard：一屏同时呈现做菜日历主模块、高频菜品与厨师排行、菜谱速查、食材甘特图、存放周期参考与价格速查，并统一 Hover = 预览 / Click = 操作 / 单一 Drawer 的交互体系与暖米色视觉。'
category: 猪窝
subcategory: [架构, 功能]
---

猪窝 v1.13.0 不再用四个 Tab 切换四个工作台，而是把「做菜记录 / 菜谱 / 食材存放 / 价格速查」整合成一个真正的厨房工作台：打开页面即看到状态，Hover 看摘要，点击看详情或操作，详情统一收进 Drawer / 移动端 Bottom Sheet。数据源保持不变（`food-records.ts` / `food-pantry.ts` / `food-prices.ts` / `content/cooking-tips`），重构主要发生在页面结构、客户端逻辑与视觉层。

## 单页 Dashboard 信息架构

- 顶部导航三段式：Logo + 标题 | 全局搜索（菜谱 / 做菜记录里的菜 / 食材 / 价格）| 今日心情短句 + 头像；下方为情绪 Hero 横幅。
- 第一层（左 6 / 中 3 / 右 3，等高）：
  - 左：本月 KPI 四卡（做饭天数 / 花费 / 均费 / 用时）+ 做菜日历主模块（农历、有记录圆点、今天、选中态，月份切换 + 日期 Hover 摘要）。
  - 中：高频菜品 + 厨师排行并列（2×1 上排），下方「菜谱大全」分类宫格；点击分类在主卡内联展开该分类菜谱。
  - 右：选中日期的做菜详情（早 / 午 / 晚 / 夜宵分组、花费 / 用时 / 菜品数统计、「今日亮点」心得便签、编辑入口）。
- 第二层（5 / 4 / 3，固定等高并贴合第一层下方）：食材存放甘特图 | 存放周期参考 | 价格速查。

## 核心交互统一

- Hover = 轻量预览（日历日期摘要、KPI 解释、高频菜最近记录、菜谱 Hover 卡含食材摘要与前几步做法、甘特条保鲜信息、价格备注）。
- Click = 深入查看或操作；同一时间只允许一个 Drawer；Escape / 点遮罩关闭。
- 所有 Hover 均有 Click / Tap 替代；移动端 Drawer 自动转 Bottom Sheet。
- 菜谱详情 Drawer 支持「复制为 Markdown」，可把结构化菜谱还原为源文档格式直接维护。

## 数据与编辑约定

- 做菜记录、菜谱、价格仍以源码文件为真源：改 `home/src/data/*.ts` 与 `content/cooking-tips/*.md` 后构建即可，Drawer 内提供数据文件指引与 JSON / Markdown 复制入口。
- 食材存放的「改入库日期 / 存放方式 / 标记吃完 / 删除」以本机 localStorage 补丁（`pig.kitchen.pantry.v1`）实现，不动数据源文件；亮点笔记存 `pig.kitchen.daynote.<date>`。

## 工程实现

- 新组件 `src/components/tabs/KitchenDashboard.astro` 承载骨架与数据注入（构建期把菜谱 md 解析成 sections / blocks，注入 `window.__kitchenData`）。
- 客户端逻辑按职责拆分到 `src/scripts/kitchen/*`（index / calendar / day / recipes / pantry / prices / stats / search / ui / data）。
- 旧四视图组件 `FoodRecords.astro` 删除；`page.ts` 移除全部 food 专属分支（其余页面分支保留）。
- 样式以 `k-*` 前缀 + `body[data-page="food-records"]` 暖色 token 追加在 `global.css`；桌面 / 平板 / 移动三档响应式。

## 发布验证

- Home 版本由 `1.12.0` 升至 `1.13.0`。
- `npm run build` 成功构建 20 个页面；`git diff --check` 通过。
- 发布提交：`b0aed9e feat: 厨房工作台一体化重构…`、`c909e40 chore: 发布 v1.13.0`，位于 `thebear617/pig-home` 的 `main`。
- 浏览器级交互目检由用户本地进行，随后按截图微调布局细节。

## UI 设计图留档

以下为厨房工作台一体化 Dashboard 的实机 UI 留档（顶部三段导航 + KPI 入左栏 + 日历主模块 + 2×1 中列 + 右侧日期详情 + 第二行三卡）。

<div class="timeline-ui-archive">
  <img src="/images/timeline/home-v1130/ui-01.png" alt="猪窝 v1.13.0 厨房工作台一体化 Dashboard" loading="lazy" />
</div>
