---
title: 基础知识：Markdown
date: '2026-08-04'
updated: '2026-08-04'
slug: markdown-fundamentals
category: 开发与实践
subcategory: 基础知识
description: Markdown语法样式、主题说明
---

# 语法
可以。最准确的理解是：Markdown 不是一个单一语法，而是一组“方言”和扩展的集合。

## 1. 核心语法

这些属于 CommonMark 等核心规范，跨工具兼容性最好。[CommonMark 规范](https://spec.commonmark.org/0.31.2/)

| 类型 | 写法 |
|---|---|
| 段落 | 直接写文字，空行分段 |
| 标题 | `# 一级标题` |
| 斜体 | `*文字*`、`_文字_` |
| 加粗 | `**文字**`、`__文字__` |
| 行内代码 | `` `code` `` |
| 代码块 | 三个反引号 |
| 无序列表 | `- 项目`、`* 项目` |
| 有序列表 | `1. 项目` |
| 引用 | `> 引用内容` |
| 链接 | `[文字](https://example.com)` |
| 图片 | `![说明](image.png)` |
| 分割线 | `---`、`***` |
| 转义 | `\*`、`\#` |
| 原始 HTML | `<span>文字</span>` |

例如：

```md
# 标题

这是 **加粗**、*斜体* 和 `代码`。

> 这是一段引用。

- 项目一
- 项目二

[访问网站](https://example.com)
```

## 2. 常见扩展语法

这些不是最初 Markdown 核心规范的一部分，但已经被 GitHub、Astro、Obsidian、Typora 等大量工具支持。[GFM 规范](https://github.github.com/gfm/)

| 类型 | 写法 | 说明 |
|---|---|---|
| 表格 | `| A | B |` | GFM 扩展 |
| 删除线 | `~~文字~~` | GFM 扩展 |
| 任务列表 | `- [ ] 待办` | GFM 扩展 |
| 自动链接 | `https://example.com` | 不写 `< >` 也能识别 |
| 脚注 | `[^1]`、`[^1]: 内容` | GitHub / remark-gfm 等支持 |
| Emoji | `:smile:` | 工具扩展 |
| 数学公式 | `$x^2$`、`$$...$$` | 通常由 KaTeX/MathJax 扩展 |
| YAML Frontmatter | `---` 包裹的元数据 | Astro、Jekyll 等使用 |

GitHub 官方文档也把脚注作为扩展功能来支持；`remark-gfm` 则明确包含表格、脚注、删除线、任务列表等扩展。[GitHub 脚注文档](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#footnotes)、[remark-gfm](https://github.com/remarkjs/remark-gfm)

## 3. 各种工具自己的扩展

这一层就不再是统一标准了，具体取决于工具：

```md
==高亮==
```

```md
> [!note]
> 这是一个提示框
```

```md
[[另一篇笔记]]
```

```md
```mermaid
graph TD
  A --> B
```
```

常见例子包括：

- `==高亮==`
- Obsidian 的 `[[双链]]`
- Callout / Admonition 提示框
- Mermaid 图表
- 数学公式
- 上标、下标
- Wiki 链接
- 自定义容器
- MDX 的 `<Component />`

这些语法在 Obsidian、Typora、GitHub、Astro 之间并不一定互相兼容。

## 4. 你现在这个项目属于哪一层？

你现在使用的是：

```md
三项[^定值习惯]

[^定值习惯]:
    1. 每天喝 2L 水
    2. 启动一件有 DDL 的事情
```

这里要拆成两部分：

1. `[^定值习惯]` 本身是常见的扩展脚注语法，不是我们发明的。
2. 把脚注渲染成悬浮框，是 DevNotes 自己定义的渲染行为。

所以更准确地说：

> 这是“标准扩展脚注语法 + DevNotes 自定义悬浮框渲染”。

而：

```md
==高亮==
```

在当前站点里则属于真正的项目自定义语法，由 [rehype-mark.mjs](/Users/mokaiche/Documents/htmls/devnotes/src/plugins/rehype-mark.mjs) 处理。

脚注悬浮框则由 [rehype-popover.mjs](/Users/mokaiche/Documents/htmls/devnotes/src/plugins/rehype-popover.mjs) 处理。

可以简单记成：

> Markdown 核心语法 → GFM 常见扩展 → 工具扩展 → 项目自定义语法/渲染。



# 主题
markdown 中有丰富的[^主题样式]，可以支持我们去优化表格、图表、整体配色等

[^主题样式]:
    1. 软件应用的开源主题库:obsidian、typora、notion等
