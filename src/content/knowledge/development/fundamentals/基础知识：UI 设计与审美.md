---
title: 基础知识：UI 设计与审美
date: '2026-08-18'
category: 开发与实践
subcategory: 基础知识
description: UI 设计与审美相关的经验积累。
slug: ui-design-aesthetics
---

## 一、视觉层面的取舍

### 1. 减少不必要的框线

卡片画布中的框线不宜过多，可以优先考虑减少标题下方的分割线、“思考完成”区域的外框线，以及已折叠卡片的边框。如果文字、留白、背景色或卡片层级已经能够表达结构，额外的框线就可以去掉，避免画面显得过于零碎。这个判断可以回溯到 ChatNotes v0.4.0 的阅读区与卡片视觉重构。[^chatnotes-v040-frames]

### 2. 用视觉元素替代文字标签

顶部留白处不一定要直接放置“工作区视图”这类说明文字，可以改为使用一张复制的卡片作为视觉元素，并进行适当旋转或错位处理，让它像一张叠放在画布上的卡片。这样既能填补留白，也能强化卡片画布本身的视觉主题。这对应 ChatNotes v0.4.0 中移除“工作区视图”文字、引入叠层卡片伪元素的改动。[^chatnotes-v040-stack]

## 二、界面调试技巧

### 1. 先调整颜色，再调整位置

制作叠层式界面时，可以先使用红色、蓝色等明显区分的颜色标记不同层级，先确认各个层级的关系和视觉效果，再继续调整具体位置、旋转角度和间距。这样更容易观察叠层结构，也能减少在位置调整阶段反复猜测的问题。这条经验是根据 ChatNotes v0.4.0 的叠层实现回溯出的调试方法，并非该提交信息中的原文。[^chatnotes-v040-debug]

[^chatnotes-v040-frames]: 来源：[ChatNotes v0.4.0：重构阅读区与卡片视觉](https://github.com/thebear617/chatnotes/commit/ca7e03ce85e032936076a35239a716755afa7d0c)。对应 `app/globals.css` 中阅读区标题、未展开卡片和已完成思考区域的边框调整。

[^chatnotes-v040-stack]: 来源：[ChatNotes v0.4.0：重构阅读区与卡片视觉](https://github.com/thebear617/chatnotes/commit/ca7e03ce85e032936076a35239a716755afa7d0c)。对应 `WorkspaceShell.tsx` 中移除“工作区视图”标签，以及 `app/globals.css` 中新增的 `.conversation-reading-card-stack::before` 与 `.conversation-reading-card-stack::after`。

[^chatnotes-v040-debug]: 来源：[ChatNotes v0.4.0：重构阅读区与卡片视觉](https://github.com/thebear617/chatnotes/commit/ca7e03ce85e032936076a35239a716755afa7d0c)。代码中通过叠层伪元素的背景色、透明度和旋转角度共同调试视觉层级，因此可抽象出“先调颜色，再调位置”的工作顺序。
