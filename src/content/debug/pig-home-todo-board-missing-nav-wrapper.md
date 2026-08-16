---
title: "猪窝：看板 - 导航容器缺失导致样式失效"
date: "2026-07-27"
updated: "2026-07-27"
slug: "pig-todo-board-navigation-wrapper"
category: "站点与应用"
subcategory: "UI/UX"
description: "猪窝看板客户端重绘时缺少导航容器，导致 .todo-board-tabs 的间距样式无法匹配最终 DOM。"
---
<p>猪窝的每日看板页面上，胶囊分类按钮（🎬 视频 / 🔍 科研 / 💻 编程 / 🏠 生活）的间距一直调不上去，改 CSS <code>gap</code> 怎么刷新都没效果。</p>
<h2>① 现象</h2>
<p>改 <code>.todo-board-tabs { gap: 20px }</code> 后，页面加载第一帧能看到变化（红色调试边框闪现），但紧随其后的客户端渲染让间距<strong>回到默认状态</strong>。说明 CSS 本身没有生效于最终的 DOM 结构。</p>
<h2>② 根因</h2>
<p>Todo Board 页面使用 <strong>服务端渲染 HTML + 客户端 JS 全量替换</strong> 的模式：</p>
<ol>
  <li>Astro 服务端渲染了完整的 <code>&lt;nav class="todo-board-tabs"&gt;···&lt;/nav&gt;</code>，此时 CSS 生效；</li>
  <li>页面加载后 <code>todo-board.ts</code> 的 <code>refresh()</code> 执行，调用 <code>renderBoard()</code> 生成新 HTML 字符串替换 <code>#todoBoard</code> 的 innerHTML；</li>
  <li><code>renderTabs()</code> 只返回了 <code>&lt;button&gt;···&lt;/button&gt;</code> 的拼接，<strong>没有包裹 <code>&lt;nav class="todo-board-tabs"&gt;</code></strong>；</li>
  <li>选择器 <code>.todo-board-tabs { gap: ... }</code> 匹配不到任何元素，间隙始终是按钮的默认对齐间距。</li>
</ol>
<h2>③ 修复</h2>
<p>在 <code>renderTabs()</code> 的返回字符串外层加上 <code>&lt;nav class="todo-board-tabs" aria-label="看板分类"&gt;···&lt;/nav&gt;</code> 包裹。</p>
<pre><code>function renderTabs(): string {
  return `&lt;nav class="todo-board-tabs" aria-label="看板分类"&gt;${boards()
    .map(board =&gt; `&lt;button type="button" class="todo-board-tab${···}" data-tb-tab="${···}"&gt;···&lt;/button&gt;`)
    .join('')}&lt;/nav&gt;`;
}</code></pre>
<h2>④ 教训</h2>
<ul>
  <li>客户端 JS 全量替换 innerHTML 的模式下，<strong>所有结构标签都必须在模板字符串里显式写出</strong>，不能依赖服务端渲染的骨架；</li>
  <li>「CSS 改了半天没效果」有时不是 CSS 的问题，是目标元素在 DOM 里<strong>根本不存在</strong>；</li>
  <li>调试技巧：加一个醒目的 <code>border: 3px solid red</code>，如果它「闪现后消失」，说明 DOM 被脚本替换了。</li>
</ul>
