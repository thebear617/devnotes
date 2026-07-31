---
title: '新建 Agent Skill：pdf2blog-zh（PDF 论文中文博客转换）'
date: '2026-08-01'
tags: [skill, 工具]
site: skill
slug: 'skill-pdf2blog-zh'
---

新增全局 Agent Skill `~/.claude/skills/pdf2blog-zh/`，将学术 PDF 转为可发布到 ReaNotes 的中文 Markdown 文章；流程只保留正文和正文实际引用的图片，不生成 Obsidian 入库、原文副本或质量报告等额外产物。

## 流程

- 使用 MinerU 提取论文结构，以标题路径分块调用 DeepSeek V4 Flash 翻译；翻译前移除作者、版权、目录和参考文献，减少无意义 token 消耗。
- 默认关闭表格结构识别，保留原始表格图；将模型实际返回的缓存命中、未命中、输出 token 与人民币费用写入文章 frontmatter。
- 生成后执行流程单测、lint、Astro build，并且只复制最终 Markdown 引用的图片。

## 版面恢复

- 从原 PDF 重建被 MinerU 误判为代码、文本/公式块的图，以及被拆成连续子图的完整图像。
- 对明显断裂的 cases 公式保留原始公式图；将 `\\(...\\)` 内联公式统一为 KaTeX 可渲染的 `$...$`。
- 对同时满足表格元数据、跨页竖长比例和旋转 OCR 特征的候选，重建并转正原始宽表；普通长表不会触发。

## 验证

- 用 Transformer、*A Cookbook of Self-Supervised Learning* 与 *A Survey on Self-Supervised Representation Learning* 验证图片、公式、标题层级和表格处理。
- 后者完整替换实测使用 59,135 tokens，DeepSeek V4 Flash 费用为 ¥0.05714472；图 6 段内公式、表 1、表 4 均通过最终页面检查。
