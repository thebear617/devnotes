---
title: "LifeNotes CMS：CSS 未套用导致编辑器组件宽度溢出"
date: "2026-08-14"
updated: "2026-08-14"
slug: "lifenotes-cms-css-not-applied-overflow"
category: "站点与应用"
subcategory: "UI/UX"
description: "CSS 规则写入代码不等于套用到目标组件：开发服务器输出里残留的 :global(...) 不会被浏览器解析，导致 box-sizing 未生效、textarea 按 width:100% 加 padding 溢出父容器。"
---

一次本地 CMS 编辑器排查记录，沉淀“规则写在代码里 ≠ 规则套到组件上”的完整排查顺序。

## ① 现象

LifeNotes 本地 CMS 的 Markdown 编辑区需要让文字离中间分割线留出间距。已给 `textarea#body` 设置右侧 `padding: 28px`，但长行文字仍然贴右边、甚至像被裁切，看起来间距没有生效。

## ② 排查

规则“写在代码里”不等于它“套用到了目标组件”上。按以下顺序检查：

- **选择器命中**：确认样式是否真的匹配目标元素。这次页面样式里存在 `:global(*)`、`:global(body)` 等写法。
- **实际输出**：开发服务器输出的 HTML/CSS 里，`:global(...)` 仍以原文本存在——浏览器不会把它当作普通 CSS 选择器解析。
- **计算结果**：因此 `box-sizing: border-box` 并没有真正应用到 `textarea`。

问题不在 `28px` 这个数值，而在 CSS 的这一层没有生效。

## ③ 根因

- 页面样式中 `:global(...)` 写法没有被编译为浏览器可识别的选择器，导致 `box-sizing: border-box` 未真正应用；
- `textarea` 的 `width: 100%` 加上左右 `padding` 后，实际占用宽度超过父容器；
- 右侧内边距被挤到边界之外，文字也就显得贴着中间边框。

更普遍的经验：**CSS 的存在、CSS 的解析、CSS 的命中、CSS 的计算结果，是四件不同的事。** 逐一确认，通常比反复试数值更快找到布局根因。

## ④ 解决方案

把全局规则改成当前页面可直接识别的选择器，并明确给编辑器组件设置盒模型与宽度约束：

```css
*, *::before, *::after {
  box-sizing: border-box;
}

textarea#body {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 15px 28px 15px 15px;
}
```

修复后，右侧 `28px` 才真正属于 `textarea` 自己的内容盒约束。

## ⑤ 类似问题：卡片宽度与内部组件没有绑定好

在“内容核心”“内容归类”等表单卡片中也有类似溢出：卡片分配好了宽度，内部 `input`/`select`/`textarea` 仍会溢出。典型原因：

- 父级用 grid/flex 分栏，子项保留默认 `min-width: auto`；
- 内部组件 `width: 100%` 却没有统一 `box-sizing: border-box`；
- padding/border 被额外加在 100% 宽度之外；
- 缺 `min-width: 0`、`max-width: 100%`，子项按内容最小宽度撑开。

这类问题不能只看卡片的 `grid-template-columns`，要一起约束卡片、grid/flex 子项与表单控件的盒模型：

```css
.field-card,
.field-label,
.field-label > input,
.field-label > select,
.field-label > textarea {
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}
```

父级是 grid 时，优先用 `minmax(0, 1fr)`，明确告诉浏览器这一列可以收缩到分配宽度，而不是被内容撑开。

## ⑥ 可复用排查顺序

遇到“CSS 改了但页面没变化”时按序检查：

1. **确认目标组件**：在 DOM 中找到实际显示异常的元素，不要只凭外层卡片或截图猜测；
2. **确认选择器命中**：检查选择器是否匹配，尤其注意 Astro、CSS Modules、CSS-in-JS 或预处理器语法是否真的被编译；
3. **确认实际输出**：看开发服务器返回的 HTML/CSS，若输出里仍有浏览器不认识的语法（如原样 `:global(...)`），说明规则没按预期进入浏览器；
4. **确认计算样式**：在 DevTools Computed 面板检查 `width`/`min-width`/`max-width`/`padding`/`border`/`box-sizing`/`overflow`，不要只看源码；
5. **确认父子约束**：同时检查卡片、grid/flex 子项和内部控件，避免父级限宽但子项被内容或默认最小宽度撑开；
6. **用真实内容验证**：短标题可能看不出问题，用长标题、长描述和长 Markdown 行测试边界。

## 验证

- 本地 CMS 编辑器内输入长行文字，右侧与分割线之间出现明确、稳定的间距；
- 卡片内长内容不再撑破表单字段；
- `npm run build` 通过。

## 参考来源

迁移自 LifeNotes（常识笔记站）的 `调试排错：CSS 未套用导致组件宽度溢出`，原文保留在 lifenotes 仓库的 git 历史中。
