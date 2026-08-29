---
title: "猪窝：美食地图 - 区域列表分页显示异常"
date: "2026-08-15"
updated: "2026-08-15"
slug: "pig-food-map-region-pagination"
category: "站点与应用"
subcategory: "UI/UX"
description: "区域分页显示超出每页数量，是隐藏状态被列表的 display:block 覆盖所致，需要使用带优先级的隐藏类。"
---
记录区域列表分页显示异常的排查与修复过程。

## 现象

区域列表本应每页显示 4 条，但实际一页显示了 5 条。

## 初步判断与排查

- 首先检查区域分页的切片范围与页码计算，确认分页逻辑仍按每页 4 条处理。
- 随后检查分页切换时对非当前页条目的隐藏方式，发现区域分页只设置了 `hidden` 属性。
- 对照页面样式后确认，问题并非分页数据数量错误，而是被标记隐藏的条目仍然参与布局显示。

## 根因

区域分页仅设置 `hidden`，没有复用已有的 `is-directory-hidden` 状态；同时，页面中以下选择器的优先级更高：

    body[data-page="food-map"] .foodmap-list-item {
      display: block;
    }

它覆盖了 `.foodmap-list-item[hidden]` 的 `display: none`，导致分页范围之外的条目仍显示在列表中。

## 修复

- 区域分页复用已有的 `is-directory-hidden` 类名，明确标记当前页之外的条目。
- 该状态原本已有 `display: none !important` 规则，本次让区域分页复用它，避免被区域列表的通用 `display: block` 覆盖。
- 同步设置 `aria-hidden`，让视觉隐藏状态与辅助技术语义保持一致。

## 验证

- `npm run build`：构建通过。
- `git diff --check`：检查通过，无空白字符错误。
