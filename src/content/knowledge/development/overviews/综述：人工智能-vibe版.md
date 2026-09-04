---
title: "综述：人工智能-vibe版"
date: "2026-08-26"
updated: "2026-08-28"
category: "开发"
subcategory: "综述"
description: "Agentic Work 指南及观点收集"
slug: "ai-overview-vibe"
---

# 观点收录

1. AI的作用：
    1. 让知识廉价、让技术平权，进而拓展个人能力边界
    2. 提高重复内容的处理效率





# Agentic Work

## 综述

Agentic Work分为Agentic Coding（[^Vibe-Coding]）和 Agentic Work（[^Vibe-Working]）



[^Vibe-Coding]:
  ## 定义
  1. 来源：为2025 年 2 月 2 日，Andrej Karpathy 在 [X](https://x.com/karpathy/status/1886192184805015498) 上发的一条推文——“一种新的编程方式，我称之为 **vibe coding**：完全沉浸在 *vibes* 里，拥抱指数级进步，忘记代码本身的存在”。
  2. 严格定义：借助自然语言触发人工智能，以辅助编写计算机代码的行为
  3. 通俗定义：给计算机输入自然语言，计算机会输出代码、测试、软件产品｜借助大模型及衍生工具来进行
产品开发，数据工程，科研编程
  

  ### 和之前的“补全式 AI 助手”的区别？
  
  旧式的 GitHub Copilot 补全，本质还是人工逐行写、AI 提示下一行。**Vibe Coding 的关键，是把节奏交给了 Agent**：
  
  1. **Agent 主动规划**：拆解任务、决定改哪些文件
  2. **Agent 自我验证**：能跑测试、跑构建、根据报错回头修
  3. **人重点在于判断与方向**：描述意图、看反馈、给回路
  
  ## 形态
  | 形态 | 代表 | 工作姿势 |
  |---|---|---|
  | IDE 内集成 Agent | Cursor、Windsurf | 在编辑器里 ⌘K/Composer 对话，看 diff、接受/拒绝 |
  | 终端 Agent | Claude Code、OpenAI Codex CLI | CLI 自然语言下指令，由 Agent 规划、改文件、跑测试 |
  | 异步远程 Agent | OpenAI Codex(cloud)、Devin | 把任务丢给云端 Agent，等其多步执行完回来交付 |
  
  不管哪种形态，本质都是 **自然语言描述目标，Agent 规划+生成+迭代**。
 
  ### 案例一：多 Agent 协同工作流
  
  这张图展示了一个从需求识别、任务拆解，到前后端实现、测试验证、发布上线和持续监控的多 Agent 协同开发流程。它可以作为 Agentic Coding 的完整工作流参考：
  
  ![多 Agent 协同处理：实战自动化驱动流程](/images/agent-work/multi-agent-collaboration-workflow.jpg)
  
  ## 评价体系
  1. Benchmark: SWE-bench、等等











[^Vibe-Working]:
  
  
  ## 定义
  
  1. 来源：微软在 2025 年正式提出了 **Vibe Working**，同期推出了 Office Agent，以及 Word、Excel、PowerPoint 专用 Agent([Microsoft](https://www.microsoft.com/en-us/microsoft-365/blog/2025/09/29/vibe-working-introducing-agent-mode-and-office-agent-in-microsoft-365-copilot/))
  2. 严格定义：通过自然语言表达目标，由 Agent 规划、生成和反复修改 Word、Excel、PowerPoint 等工作成果
  3. 通俗定义：Vibe Working   自然语言 → Agent → 文档、表格、PPT、报告
  
  
  微软。
  
  ## 形态
  
  1. 微软的 Researcher Agent 被定位为处理复杂、多步骤研究并输出结构化报告；
  2. OpenAI 则把制作文档、表格、演示文稿、报告等能力统一归入 **Work**，与专门负责编程的 Codex 区分开
  3. Computer-Use Agent（计算机操作智能体）：Agent 是通过鼠标、键盘或浏览器界面操作 Excel、PowerPoint、Google Sheets 等软件。
  
  
  
  ## 应用场景
  
  1. 搜资料 / Agentic Research：调研和资料搜集
  2. 数据分析处理：读 PDF和整理表格，阅读邮件和会议记录
  3. 文档输出：写报告、方案、论文，制作 PPT，做图表
  4. 信息聚合整理：阅读邮件和会议记录
  5. 运营管理：跨应用完成业务流程、维护
  
  

## 现有技术

### computer-use
 1. 共享屏幕：授权后能直接看到WPS打开的文件
 2. 实时字幕翻译


### 多模态输出
 1. 会议纪要：飞书妙记转写（可以听懂方言）->其他 AI整理
 2. 网页插件：网页内容及视频总结




