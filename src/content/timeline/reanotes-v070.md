---
title: "科研笔记 v0.7.0：论文处理 - PDF 中文博客转换"
date: '2026-08-01'
updated: '2026-08-01'
description: 'ReaNotes v0.7.0 将论文 PDF 到中文博客的链路收束为 $pdf2blog-zh 全局 Skill 和仓库内可测试脚本；最终产物仅包含可发布的中文 Markdown 与实际引用图片。'
subcategory: [功能]
category: 科研笔记
---

ReaNotes v0.7.0 将论文 PDF 到中文博客的链路收束为 `$pdf2blog-zh` 全局 Skill 和仓库内可测试脚本；最终产物仅包含可发布的中文 Markdown 与实际引用图片。

## 可控的翻译与成本记录

- 临时调用 MinerU 后按标题路径分块交给 DeepSeek V4 Flash 翻译，移除作者、版权、目录和参考文献以减少无意义调用。
- 页面 frontmatter 记录缓存命中、未命中、输出 token 及人民币费用；默认关闭表格结构识别，避免复杂表格的 OCR 重建风险。
- README 补充 Skill 的入口、替换约束和产物边界，版本提升至 0.7.0。

## 图、公式与表格恢复

- 从原 PDF 重建被误判为代码或文本/公式块的图、被拆开的连续子图，以及明显断裂的 cases 公式。
- 将 `\\(...\\)` 内联公式在翻译前和译文后统一为 KaTeX 可渲染的 `$...$`。
- 只对具有表格元数据、跨页竖长比例和旋转 OCR 特征的候选表，从源 PDF 重建并转正；普通长表保持原样。

## 真实文章验收

- 更新 Transformer 与 *A Cookbook of Self-Supervised Learning* 的中文译文，并新增 *A Survey on Self-Supervised Representation Learning*。
- 后者端到端替换使用 59,135 tokens，费用 ¥0.05714472；图 6 段内公式、表 1 和表 4 均通过最终页面检查。
- 补充 24 项脚本回归测试，并通过 ReaNotes lint 与 Astro build。

## UI 设计图留档

以下截图按提交 `b248924` 复原，展示论文正文的博客式阅读页、右侧目录与公式排版。

![科研笔记 v0.7.0 文章阅读 UI 重建截图](/images/timeline/reanotes-v070/ui-01.jpg)
