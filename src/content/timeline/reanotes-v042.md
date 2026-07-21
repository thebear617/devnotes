---
title: '科研笔记 v0.4.2：发布 v0.4.2 论文翻译与发布工作流'
date: '2026-07-19'
tags: [科研笔记, 功能]
site: 科研笔记
slug: 'reanotes-v042'
---

将 paper-translate 从工作区工具迁入 ReaNotes 仓库，形成可版本管理、可质量阻断并能直接进入文献库的端到端论文处理能力。

主要变动：
- 串联 MinerU 解析、DeepSeek 分块翻译、Markdown 后处理和 ReaNotes 发布
- 保护公式、图片与 HTML 表格占位符，校验 API 截断和占位符完整性并自动重试
- 将可转换的 HTML 表格展开为 Markdown，处理 rowspan、colspan 与多级表头
- 规范图片替代文本、共享图注和 ./images 本地路径，检查缺图与表格列漂移
- 自动修复高置信度 OCR 公式异常，并保留不确定问题供质量门禁审查
- 建立 publishable、needs_review、blocked 三态质量闸门
- 自动复制中文正文与图片、更新文献索引，并验证 Prettier、lint、VuePress 构建与生成页面
- 提供已有译文的独立发布入口，重试时默认复用 MinerU 结果，避免重复 API 成本
- 补充 README、Skill 说明、迁移文档及 27 项单元与回归测试

真实论文验收：
- 使用 arXiv 2304.12210《A Cookbook of Self-Supervised Learning》完整执行 MinerU 与 DeepSeek
- 修复无 Abstract 时正文从中段开始、多面板图注、公式字体动态加载和 VuePress 图片解析问题
- 将站点公式输出切换为可稳定静态构建的 KaTeX
- 收录中文全文、16 张引用图片、3 个表格和质量报告，并将文献索引改为本地入口
- 最终生成页包含 102 个公式，未发现渲染错误或占位符泄漏

版本迭代：
- 将 ReaNotes 版本提升至 0.4.2
- 补充 v0.4.2 CHANGELOG 和版本入口
- 将私有 output、真实 .env 与 Python 缓存保持忽略
