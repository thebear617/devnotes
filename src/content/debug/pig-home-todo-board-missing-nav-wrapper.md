---
title: "猪窝：看板 - 导航容器缺失导致样式失效"
date: "2026-07-27"
updated: "2026-07-27"
slug: "pig-todo-board-navigation-wrapper"
category: "站点与应用"
subcategory: "UI/UX"
description: "猪窝看板客户端重绘时缺少导航容器，导致 .todo-board-tabs 的间距样式无法匹配最终 DOM。"
---
猪窝的每日看板页面上，胶囊分类按钮（🎬 视频 / 🔍 科研 / 💻 编程 / 🏠 生活）的间距一直调不上去，改 CSS `gap` 怎么刷新都没效果。

## ① 现象

改 `.todo-board-tabs { gap: 20px }` 后，页面加载第一帧能看到变化（红色调试边框闪现），但紧随其后的客户端渲染让间距**回到默认状态**。说明 CSS 本身没有生效于最终的 DOM 结构。

## ② 根因

Todo Board 页面使用 **服务端渲染 HTML + 客户端 JS 全量替换** 的模式：

1.  Astro 服务端渲染了完整的 `<nav class="todo-board-tabs">···</nav>`，此时 CSS 生效；
2.  页面加载后 `todo-board.ts` 的 `refresh()` 执行，调用 `renderBoard()` 生成新 HTML 字符串替换 `#todoBoard` 的 innerHTML；
3.  `renderTabs()` 只返回了 `<button>···</button>` 的拼接，**没有包裹 `<nav class="todo-board-tabs">`**；
4.  选择器 `.todo-board-tabs { gap: ... }` 匹配不到任何元素，间隙始终是按钮的默认对齐间距。

## ③ 修复

在 `renderTabs()` 的返回字符串外层加上 `<nav class="todo-board-tabs" aria-label="看板分类">···</nav>` 包裹。

    function renderTabs(): string {
      return `<nav class="todo-board-tabs" aria-label="看板分类">${boards()
        .map(board => `<button type="button" class="todo-board-tab${···}" data-tb-tab="${···}">···</button>`)
        .join('')}</nav>`;
    }

## ④ 教训

- 客户端 JS 全量替换 innerHTML 的模式下，**所有结构标签都必须在模板字符串里显式写出**，不能依赖服务端渲染的骨架；
- 「CSS 改了半天没效果」有时不是 CSS 的问题，是目标元素在 DOM 里**根本不存在**；
- 调试技巧：加一个醒目的 `border: 3px solid red`，如果它「闪现后消失」，说明 DOM 被脚本替换了。
