---
title: "常识笔记 v0.9.0：内容库 - 分页筛选与板块重组"
date: '2026-07-29'
updated: '2026-07-29'
description: '常识笔记 v0.9.0 对列表交互与板块结构做一次系统梳理：列表页补齐分页与两级分类筛选、侧栏补上选中高亮，并合并多个内容相近的小板块，为每个领域补上 hero 标题与子标题。'
subcategory: [架构]
category: 常识笔记
---

常识笔记 v0.9.0 对列表交互与板块结构做一次系统梳理：列表页补齐分页与两级分类筛选、侧栏补上选中高亮，并合并多个内容相近的小板块，为每个领域补上 hero 标题与子标题。

## 列表分页与筛选重构

- `ListExplorer.astro` 接入与开发笔记知识库同构的分页：`pageSize=8`，上一页 / 下一页 + 数字按钮，筛选或搜索变化时自动回到第一页并平滑滚回列表顶；不足一页时分页自动隐藏。
- 二级筛选从「标签 tags」改为「子分类 subcategory」：单值字符串，与知识库一致的「分类 + 子分类」两口子。卡片字段、`data-*` 属性、搜索 haystack、筛选 UI 标签全部同步。
- `content/config.ts` 新增 `subcategory` 字段；删除 `tags` 字段及其在 4 个详情页与 `global.css` 中的渲染和样式；批量清理 45 个 md frontmatter 中的 `tags:` 行。
- 搜索框 placeholder 由「搜索标题、描述或标签」改为「搜索标题、描述或子分类」。

## 侧栏选中高亮

- Layout 侧栏项原本已挂 `active` class 与 `aria-current`，但缺样式。`global.css` 新增 `.sidebar-item.active`（半透明 `#f6b17a` 背景 + 白字 + 加粗）与 hover 态，列表页与详情页均能保持对应领域高亮。

## 板块大重组

合并原则一致：内容少且主题相邻的板块并入同维度邻域，`category` 升为板块下的一级分类、原值降为 `subcategory`。

- **宠物 → 动植物**：3 篇宠物记录迁入 `biology/`，`category` 设「宠物」，原值（猫健康学 / 猫行为学）降为 `subcategory`；水葫芦保持 `category: 植物`。删除 pet 板块与 collection。
- **手机 → 数码出行**：2 篇手机记录迁入 `auto/`，`category` 设「手机」、原值（使用技巧）降为 `subcategory`；汽车 4 篇 `category` 统一设「汽车」。auto 板块改名「数码出行」，icon 不变；删除 phone 板块、collection 与 `src/pages/phone/` 独立页，手机详情改走 `[board]` 动态路由。
- **历史 + 社会 → 社会人文**：删除空板块 society，history 改名「社会人文」，新增 history collection 与路由分支，补历史 / 社会 / 政治占位条目各 1 篇。
- **美食 → 生活美食**：9 篇美食迁入 `life/`，`category` 设「美食」、原值降为 `subcategory`；生活 14 篇 `category` 设「生活」、原值降为 `subcategory`。清理 6 篇 life 条目里残留的 `topic:` 字段（曾覆盖新 category 导致「厨房指南」混入一级分类）。改名「生活美食」，icon 🧺→🍚。修复 `life/[slug]` 对 null date 的渲染（既有 bug，被无日期的美食条目触发）。
- **酒店 → 服务业**：华住篇 `category` 由「连锁酒店」规范为「服务业」、原值降为 `subcategory`。板块改名「服务业」，icon 🏨→🧳，desc 扩为「酒店 / 餐饮连锁 / 物流 / 零售等服务业科普」，后续上述门类内容可直接落入。
- **金融-经济 → 金融经济**：去掉板块名连字符；「巴萨效应」篇规范为两级结构 `category: 金融经济` + `subcategory: 宏观经济学`。

## Hero 标题与副标题

- `boards.js` 为每个板块新增 `subtitle` 字段（点列式，如「历史 · 社会 · 政治」），`[board]/index.astro` 统一渲染 `view-title` + `view-sub`，5 个走动态路由的板块自动就位。
- `life`、`hotel` 独立页各自补 hero；`global.css` 新增 `.view-title` / `.view-sub` 样式。各详情页 title 与返回链接文案同步更新。

## 路由与构建清理

- 删除 `food` / `pet` / `phone` / `society` 对应的 collection、路由分支与独立页面目录；`[board]` 的排除名单与 `formalBoardIds` 同步更新。
- 静态页面数 52 → 51；`npm run build` 全程无 warning。

## 验证

- `npm run build` 通过。
- 七个板块 `/ai/ /biology/ /history/ /auto/ /life/ /hotel/ /finance/` 均显示 hero + 正确的「分类 / 子分类」两级筛选，侧栏当前页高亮。

## UI 设计图留档

以下截图按提交 `1862aca` 复原，记录板块重组后的列表、分页与两级筛选工具栏。

![常识笔记 v0.9.0 UI 重建截图](/images/timeline/lifenotes-v090/ui-01.jpg)
