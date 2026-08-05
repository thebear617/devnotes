---
title: 典型案例：Agent 制作 PPT
date: '2026-07-26'
updated: '2026-08-02'
slug: agent-ppt-creation-practice
category: 开发与实践
subcategory: 典型案例
description: 如何用 Agent 快速制作高质量的 PPT
---

# 案例集合

## 一、论文 → PPT（GPT-5.6 + Image2）

### 1. 核心思路

参考[这个视频](https://www.bilibili.com/video/BV1mgNj6MEuX/)和[飞书文档](https://wievf29s6ca.feishu.cn/wiki/L8mOwmm0KiApwZkfy8JcN7tonHg)的思路：先让 Image2 产出高视觉完成度的图像版 PPT（不可编辑），再用 GPT-5.5/5.6 逐页逆向还原为可编辑的 .pptx 文件。整个流水线：

```text
论文 + 参考风格图
  → Step 1: 生成四套风格预览缩略图（Image2）
  → Step 2: 选定风格，生成完整图像版 PPT（Image2）
  → Step 3: 逐页还原为可编辑 .pptx（GPT-5.5/5.6）
```

### 2. 提示词

**Step 1：生成风格预览**

```text
请基于我上传的文献资料和参考风格图片，制作一份 12 页、16:9 宽屏比例、可用于课题组组会汇报的中英文混排学术 PPT。 要求如下：深入提炼文献核心内容，形成完整汇报逻辑，包括研究背景、科学问题、研究设计、方法、关键结果、数据图表、机制模型、创新点、讨论与总结展望等部分。PPT 需专业学术、美观清新，整体风格模仿我提供的参考图片，保持配色、字体、版式和视觉元素。 请避免大段文字堆砌，重点突出关键结论、核心数据和亮点发现。 需要加入图表、数据可视化、流程图、机制示意图、重点总结页等，使其适合正式组会展示。 在生成最终 PPT 文件前，请先用最新的image 2 图像生成模型生成类似学术风格的四套ppt缩略预览图，像幻灯片浏览视图一样布局，每套风格主题视觉颜色不同，但一定要符合学术美观清洁专业风格，最后我才来选定哪套输出详细的最终ppt文件。

```

参考图风格示例如下：

![参考图 1](/images/prompts/lit-to-ppt/ref-01.png)
![参考图 2](/images/prompts/lit-to-ppt/ref-02.png)

**Step 2：选定风格，生成完整 PPT**

```text
请使用最新的 image2 模型，基于我选择的第 {N} 套风格，为这篇论文生成一份完整的学术汇报 PPT。

每页具体要求：
- 封面页：论文标题、作者、单位、日期；
- 研究背景页：领域背景与核心问题；
- 方法页：研究方法的逻辑框架；
- 实验结果页：关键数据图表与结论；
- 总结与展望页：核心发现与后续方向。

注意事项：
- 所有内容必须严格基于原文，不得编造数据；
- 图表需配合数据说明，标注来源；
- 保持与选定风格预览一致的配色和排版；
- 调用 image2 模型生成每一页的图像，而非输出纯文本大纲。
```

**Step 3：逐页还原为可编辑 .pptx**

```text
请将下面这张 PPT 页面逐页还原为可编辑的 .pptx 文件。

工作方式：
- 每次只还原一页；
- 分析该页的布局结构、文本框位置、字体大小、配色和图片位置；
- 用 python-pptx 逐元素重建，生成可下载的 .pptx 文件；
- 还原完当前页之后，等我确认再继续下一页。

第一页（封面页），请开始还原。
```

> **后续页面**：上一页确认无误后，发送 `继续下一页` 并附上图片即可。

### 3. 注意事项

<ol>
<li>
<span class="tip-label">必须显式指定 image2 模型</span>
<div class="tip-detail">

在连续对话中，GPT 容易"忘记"用 image2 生图。每次要求生成 PPT 页面时，必须在提示词中重新声明"使用 image2 模型"，否则会退化为纯文本大纲或朴素表格。

错误示例：
> 生成第三套风格

正确示例：
> 请使用最新的 image2 模型，生成第三套风格的完整 PPT

</div>
</li>
<li>
<span class="tip-label">逐页还原比一次还原更可靠</span>
<div class="tip-detail">

还原为可编辑格式时，让 GPT 一页一页处理，每页输出一个小 .pptx 文件，最后手动合并。一次还原整个 PPT 容易因上下文过长导致后半部分质量下降。

</div>
</li>
<li>
<span class="tip-label">两种可编辑转换方案对比</span>
<div class="tip-detail">

| 方案 | 工具 | 速度 | 质量 | 适用场景 |
|------|------|------|------|----------|
| PDF 转 PPT | WPS | 快（秒级） | 一般，元素可能错位 | 排版不复杂、需要快速出稿 |
| GPT 逐页还原 | GPT-5.5/5.6 + python-pptx | 慢（约 5–10 分钟/页） | 高，99% 还原度 | 学术汇报、正式场合、对版式要求高 |

也可以使用 Codex CLI 执行相同逻辑（优势是直接写本地文件，不需要下载），但经实测，Codex 生成速度比 GPT Web 端慢得多（一页约 17–20 分钟 vs Web 端约 5 分钟）。

</div>
</li>
</ol>

### 4. 使用建议

- **图像先行，文本后还原**：先用生图模型锁定视觉完成度，再用语言模型逆向工程为可编辑格式——比直接让语言模型生成 PPT 效果好一个数量级。
- **四套预览是决策缓冲**：不要只生成一套，让 GPT 同时出四套预览再选，避免"生成完才发现风格不对"的返工。
- **"使用 image2"是魔术字**：单靠这句话就能让输出从朴素文本表格切换到海报级视觉，但必须在每次对话中重复声明。
- **逐页还原比一次还原可靠得多**：把一个大任务拆成一页一个小任务，每页确认后再继续，上下文不混乱，质量可控。
- **转换方案有 trade-off**：WPS 方案牺牲质量换速度，GPT 还原方案牺牲时间换精度——按场景选方案，不是一刀切。
- **可迁移骨架**：这套"生图模型出视觉 → 语言模型还原为可编辑格式"的思路，可以迁移到任何"需要高质量版式输出但最终要可编辑"的场景。把源资料换成报告、提案、简历，把目标换成海报、信息图、数据看板，逻辑完全一样。提示词骨架如下：

```text
请使用最新的 image2 模型，基于以下资料【论文 / 报告 / 提案】，为我生成一份【学术汇报 / 商业提案 / 项目汇报】PPT。

流程：
1. 先生成 {N} 套不同风格的预览缩略图，供我选择；
2. 选定风格后，生成包含以下页面的完整图像版：
   - 封面页
   - 【背景 / 问题 / 现状】
   - 【方法 / 方案 / 思路】
   - 【数据 / 结果 / 对比】
   - 【总结 / 后续步骤】
3. 最终将图像版逐页还原为可编辑的 .pptx 文件。

约束：
- 所有内容必须基于原始资料，不得编造数据；
- 图表需标注来源或注明"根据原文数据生成"；
- 每页生成前，再次声明"使用 image2 模型"。
```

## 二、调研 → PPT（桌面 Agent + Skills）

### 1. 核心思路

参考[这个视频](https://www.bilibili.com/video/BV15f336QETT/)的思路：用桌面 Agent 自主完成"调研 → 整理 → PPT 输出"的全流程。Agent 先搜索和阅读相关资料，提取关键对比维度（厂商、产品、特点、差异、价格），再调用 [ppt-master](https://github.com/hugohe3/ppt-master) 这个 skill 直接产出最终 .pptx 文件。人和 Agent 的分工是：人只给出调研主题和交付要求，Agent 负责找资料、整理、排版和输出。

### 2. 提示词

```text
调用 ppt-master skill 做一个 PPT，PPT 主题介绍各大 AI 模型厂商的 Agent 桌面端应用以及特点和差异，以及价格：Codex、Claude Code、Kimi Work、Trae Work、WorkBuddy、豆包、QoderWork。在 5–8 页内讲明白，我要第二天跟全公司的领导汇报。风格酷的你自己定，出完整整地第一版给我。
```

# 优质资源合集

## 一、生成 PPT

以下资源来自[彼得潘AI](https://space.bilibili.com/1315561/)对 7 个中文 AI 博主 PPT skill 的实测评测：

| Skill | 产出模态 | 评测评价 | 当前 Star |
|-------|---------|----------|----------|
| [何与果 PPT Master](https://github.com/hugohe3/ppt-master) | 可编辑 PPTX | **夯（最高）**。唯一正经做 PPT 的，所见即所得，内置克隆音色 + 旁白。扣分项：工程重、上手门槛高 | 41.2k |
| [归藏 PPT Skill](https://github.com/op7418/guizang-ppt-skill) | HTML 幻灯片 | **人上人**。瑞士风顶级审美，快捷键控制动画适配线下分享，但切换有闪烁、bug 较多 | 22.4k |
| [张咋啦 Front-end Slides](https://github.com/zarazhangrui/frontend-slides) | HTML | **顶级**。完成度高、风格与动效一致性最好，扣分项：HTML 而非真 PPT | 26.4k |
| [花叔 Design](https://github.com/alchaincyf/huashu-design) | 可编辑 PPTX | **顶级**。审美强，能做到可编辑 PPTX，短板是排版偶有重叠 | 22.1k |
| [宝玉 Slide Deck](https://github.com/JimLiu/baoyu-skills) | 图片（一页一图） | **NPC**。不可编辑、不可控、约等于抽奖，风格偏可爱风，初衷是给自媒体配图 | 24.2k |
| [乔木 Anything to NotebookLM](https://github.com/joeseesun/qiaomu-anything-to-notebooklm) | NotebookLM 幻灯片（纯图片） | **NPC**。不是真 PPT，只是 NotebookLM 幻灯片，设计无规范 | 5.6k |
| [Louis HTML PPT Skill](https://github.com/lewislulu/html-ppt-skill) | HTML | **NPC**。素材库丰富，演讲者模式 + 逐字稿 + 计时器实用，但排版与字体糟糕 | 7.4k |

排名体系：**夯 > 人上人 > 顶级 > NPC**。评测视频见 [从夯到拉锐评一下中文 AI 博主的 PPT skill](https://www.bilibili.com/video/BV1yXE96gEjE/)。

## 二、修改 PPT

以下资源来自同作者对「已有 PPT 让 AI 帮忙美化」场景的实测，拿一份大学期末作业 PPT 逐个测试各 skill 的美化能力：

| Skill | 产出模态 | 评测评价 | 当前 Star |
|-------|---------|----------|----------|
| Claude OPUS 徒手版（彩蛋） | 可编辑 PPTX | **巅峰夯**。不调用任何 skill，徒手用 Python-pptx 生成，完美复用原配图，能把文本截图重新做成有样式的真文本，主题色/背景/排版不输任何 skill | - |
| [Louis HTML PPT Skill](https://github.com/lewislulu/html-ppt-skill) | HTML | **夯（最高）**（上期 NPC）。功能最全（演讲者模式 + 逐字稿 + 计时器），模板审美、动效和配色本轮最强。上期排版差是因为 4K 屏缩放问题，调好比例后效果非常满意。演讲场合允许 HTML 则必选 | 7.4k |
| [何与果 PPT Master](https://github.com/hugohe3/ppt-master) | 可编辑 PPTX | **人上人**（上期夯）。可编辑 PPTX + SVG 优秀。但出了图片全漏的 bug（Python 工具中文编码兼容问题，提醒 AI 统一 UTF-8） | 41.2k |
| [宝玉 Slide Deck](https://github.com/JimLiu/baoyu-skills) | 图片（纯出图） | **顶级**。纯出图路线在改 PPT 场景刚好是舒适区，不改演讲内容，只在视觉锦上添花并补高质量人物图/背景。缺点：30 页 PPT 跑了近一小时，微调成本高 | 24.2k |
| [归藏 PPT Skill](https://github.com/op7418/guizang-ppt-skill) | HTML | **顶级**。电子杂志风审美顶级，原图重新裁切且位置正确，对截图会先 OCR 再重新生成。缺点：只能 HTML，现场需确认能否直接使用 | 22.4k |
| [花叔 Design](https://github.com/alchaincyf/huashu-design) | 可编辑 PPTX | **顶级**。审美稳定质量高，能读取原配图放对位置。偶有图片拉伸/排版 bug，但可编辑 PPTX，花 3 分钟微调就很好用 | 22.1k |
| [张咋啦 Front-end Slides](https://github.com/zarazhangrui/frontend-slides) | HTML | **NPC**（上期顶级）。风格中等、排版逊色、完成度不够，稳定性不强。动效太快反而干扰讲解 | 26.4k |
| [乔木 Anything to NotebookLM](https://github.com/joeseesun/qiaomu-anything-to-notebooklm) | NotebookLM 幻灯片（纯图片） | **NPC**。几乎没有 PPT 设计规则和视觉规范，成品不如豆包。纯图片，无二次操作空间 | 5.6k |

排名体系：**巅峰夯 > 夯 > 人上人 > 顶级 > NPC**。评测视频见 [改 PPT 作业版](https://www.bilibili.com/video/BV1zgKZ6VE7x/)。
