---
title: '猫猫 v0.18.0：完成小猫书落地页与详情页视图重构'
date: '2026-10-06'
updated: '2026-10-06'
description: '完成猫猫素材、猫猫档案与猫猫灵感在桌面端和移动端的视图重构，统一瀑布流、详情抽屉、响应式断点和图片预览交互。'
category: 猫猫
subcategory: [架构, 视觉, 功能]
---

猫猫手册 v0.18.0 完成小猫书落地页与猫猫档案详情页的整体视图收口：桌面端保留 PC 大屏体验，移动端以小猫书为主入口，并统一素材、档案、灵感三类视图的响应式表现。

## 落地页与瀑布流

- 重构桌面端与移动端的瀑布流布局，移动端稳定为双列视图，桌面端保持大屏素材浏览密度。
- 统一搜索栏、视图切换栏和筛选胶囊的边界、背景和留白，移除多余的外扩阴影与移动端不适用的入口。
- 素材筛选文案收束为「全部 / 明信片 / 未分类」，移动端隐藏不适合触屏操作的本地新增入口。
- 猫猫灵感图片预览保留外链、旋转、下载等必要操作，并隐藏移动端本地编辑与删除按钮。

## 猫猫档案详情页

- 桌面端完成图片区与文字区的分层布局，图片使用弧线蒙版，右侧统一承载故事档案、关系和基础信息。
- 移动端详情改为底部弹窗，顶部栏、4:3 图片容器、关系卡片和故事档案统一对齐宽度。
- 关系区域默认展示两条记录；不足时使用「待补充 / 未知」占位卡片，超过两条时支持横向浏览。
- 故事档案按内容长度处理显示，移动端滚动条默认隐藏，实际滚动时显示并在停止后自动隐藏。
- 详情页封面、卡片标题、区域与状态信息、作者文案和空故事提示统一口径。

## 数据与资源

- 更新猫咪档案、关系和素材数据，补充明确的家庭关系、好友关系及占位关系展示。
- 全量替换来财素材，并清理不再使用的灵感旧图资源。
- 优化素材缩略图与原图的加载关系，保留图片预览和下载时的原图能力。

## UI 设计图留档

![PC 端猫猫档案落地页](/images/timeline/cats-v0180/pc-archive-landing.png)
![PC 端猫猫档案详情页](/images/timeline/cats-v0180/pc-archive-detail.png)
![PC 端猫猫素材落地页](/images/timeline/cats-v0180/pc-material-landing.png)
![移动端猫猫档案落地页](/images/timeline/cats-v0180/mobile-archive-landing.png)
![移动端猫猫档案详情页](/images/timeline/cats-v0180/mobile-archive-detail.png)
![移动端猫猫灵感落地页](/images/timeline/cats-v0180/mobile-inspiration-landing.png)
![移动端猫猫素材落地页](/images/timeline/cats-v0180/mobile-material-landing.png)
![移动端猫猫素材详情页](/images/timeline/cats-v0180/mobile-material-detail.png)

## 验证

- `npm run materials:validate`
- `npm run build:local`
- `node --check src/scripts/app/directory.js`
- `node --check src/scripts/app/gallery.js`
- `git diff --check`
