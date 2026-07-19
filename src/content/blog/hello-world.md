---
title: 你好，这是第一篇博客
date: '2026-07-19'
tags: [杂谈]
description: Astro 改造后的第一篇博客文章
---

## 欢迎来到 DevNotes 博客

这是 devnotes 从 Vue 3 迁移到 Astro 后的第一篇博客文章。

### 和之前的区别

之前笔记中心的文章都是用 **HTML 字符串** 嵌在 JS 数据文件里写的，现在：

- 博客文章用 **纯 Markdown** 编写，支持完整的 Markdown 语法
- 通过 Astro Content Collections 管理
- 新建一篇文章只需要在 `src/content/blog/` 下新建一个 `.md` 文件

### 写代码很方便

```js
const greeting = 'Hello, DevNotes!';
console.log(greeting);
```

### 引用

> Astro 的 Islands Architecture 让静态站点也可以按需加载交互 JS。

后续会在这里记录更多技术相关的博客文章。
