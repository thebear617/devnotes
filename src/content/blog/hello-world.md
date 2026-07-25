---
title: 你好，这是第一篇博客
date: '2026-07-19'
updated: '2026-07-25'
tags: [随想, 随笔]
secondaryTag: 随笔
description: Astro 改造后的第一篇博客文章
---

## 一、欢迎来到 Thebear 的 DevNotes 博客

这是 devnotes 从 Vue 3 迁移到 Astro 后的第一篇博客文章，
后续会在这里记录更多技术相关的博客文章。之前笔记中心的文章都是用 **HTML 字符串** 嵌在 JS 数据文件里写的，现在：

1. **纯 Markdown**：文章用Markdown语言编写，支持完整的 Markdown 语法
2. **内容集合**：通过 Astro Content Collections 管理，新建一篇文章只需要在 `src/content/blog/` 下新建一个 `.md` 文件
3. **MDX**： 可以用**MDX**=Markdown + JSX，让我在 .mdx 文件里直接写 React/Vue/Astro/Svelte 组件，把"文档"和"交互"合在一起。

---

## 二、使用demo

### 1.代码块

```js
const greeting = 'Hello, DevNotes!';
console.log(greeting);
```

### 2.引用

> Astro 的 Islands Architecture 让静态站点也可以按需加载交互 JS。

### 3.数学公式

行内公式：质能方程 $E = mc^2$，以及欧拉公式 $e^{i\pi} + 1 = 0$。

行间公式：

$$
\int_a^b f(x)\,dx = F(b) - F(a)
$$

带编号的矩阵：

$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
\begin{pmatrix}
x_1 \\ x_2
\end{pmatrix}
=
\begin{pmatrix}
x_1 + 2x_2 \\ 3x_1 + 4x_2
\end{pmatrix}
$$




