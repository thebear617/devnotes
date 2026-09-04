---
title: "图表：SOP-出图出表"
date: "2026-07-27"
updated: "2026-09-04 21:26"
category: "实践"
subcategory: "图表"
description: "如何用 Agent 一键生成 draw.io 专业图表——从代码架构、基础设施到旧图翻新"
slug: "professional-chart-creation-practice"
---

## 思路


- **从代码出发比从文字出发更准**：与其用自然语言描述架构，不如直接指向代码仓库，Agent 自己分析更不容易遗漏。
- **复杂项目先拆模块**：如果项目很大，先让 Agent 画某个子模块的依赖图，确认效果后再扩大范围。
- **定期跑一次漂移检测**：把架构对比做成定期任务，及时发现线上配置与文档的不一致。
- **大图先压缩再展示**：如果节点超过一百个，可以先用自动聚类功能生成一页摘要，再按需展开细节。
- **白板照片先裁剪**：拍照时尽量正对、光线均匀，裁剪掉无关背景，识别准确率会明显提高。
- **旧 Visio 图优先用这个方案**：Visio 转 draw.io 的手工迁移很痛苦，让 AI 看图还原效率高得多。
- **导出格式灵活选择**：图表完成后可导出为 PNG、SVG、PDF、PPT、Mermaid 代码、Markdown 或交互式 HTML。



| Skill | 产出模态 | 评测评价 | 当前 Star |
|-------|---------|----------|----------|
| [drawio-skill](https://github.com/Agents365-ai/drawio-skill) | 可编辑 draw.io 图表 | 来自[探索未至之境](https://space.bilibili.com/441831884)的[深度评测](https://www.bilibili.com/video/BV1bcNZ6xEK3/)：从 1.4 到 1.34 版脱胎换骨。三个亮点：① 自动读取代码/配置/运行中基础设施画图；② 图片转可编辑图表 + 一万图形库 + 300+ AI 品牌 logo；③ 导出 PPT/Mermaid/交互式 HTML，还能做决策树排查应用、架构演进时间轴、PR 差异图机器人。安装简单，Claude Code 插件市场直接装 | 6.6k |

## 用draw.io 出图

### 一、画架构图


参考[这个视频](https://www.bilibili.com/video/BV1bcNZ6xEK3/)的思路：用 [drawio-skill](https://github.com/Agents365-ai/drawio-skill) 让 Agent 自动读取你已有的代码仓库或配置文件，直接生成可编辑的 draw.io 架构图。核心优势是不需要你手动描述——Agent 自己读代码、解析依赖，自动出图。



**代码仓库 → 模块依赖图**

```text
请使用 drawio-skill 分析当前项目的代码结构，生成模块依赖图。
要求：展示各模块之间的调用关系和数据流向，标注关键接口。
```

**配置文件 → 架构图**

```text
请使用 drawio-skill 读取这个 Kubernetes 集群的配置文件，画出完整的服务部署架构图。
要求：包含所有 Deployment、Service、Ingress，用 AWS GCP 官方图标标注云资源。
```

**CI 流水线 → 流程图**

```text
请使用 drawio-skill 分析这个仓库的 GitHub Actions 流水线配置，生成 CI/CD 流程图。
要求：展示每个 stage 的触发条件、执行步骤和产物流向。
```



### 二、画运行时基础设施拓扑图


把 `docker inspect` 或 `kubectl get` 的输出直接喂给 Agent，画出当前真实运行状态的拓扑图。再配合图表对比功能，把设计文档里的理想架构和线上实际跑的样子并排摆在一起，架构漂移一眼可见。具体用法参考[这个视频](https://www.bilibili.com/video/BV1bcNZ6xEK3/)。


```text
请使用 drawio-skill，分析以下 kubectl 输出的 Pod 和 Service 信息，
画出当前集群的真实运行时架构图。kubectl 输出如下：

{kubectl 输出内容}

要求：按 namespace 分组，标注每个服务的副本数和状态。
```

**架构对比**

```text
请使用 drawio-skill，将以下两份信息生成两张架构图并并排对比：
左图：设计文档中描述的架构（附设计文档内容）
右图：当前线上实际运行状况（附 kubectl 输出）
要求：用绿色标注一致的部分，红色标注存在偏差的地方。
```


### 三、将旧图片转化为可编辑图表

把会议室白板拍的照片、十年前的旧 PNG 架构图、Visio 截图直接发给 Agent，AI 先用视觉能力识别节点和连线，再还原成可编辑的 draw.io 文件，不用对着旧图重画一遍。具体用法参考[这个视频](https://www.bilibili.com/video/BV1bcNZ6xEK3/)。

### 2. 提示词

```text
请使用 drawio-skill，读取这张图片并将其还原为可编辑的 draw.io 图表。
图片内容是一张系统架构图（白板照片），请识别其中的节点、连线和文字标注。

要求：
- 使用 draw.io 图形库中的标准形状替换手绘元素；
- 保持原始布局结构不变；
- 有模糊不清的文字请标注为待确认。
```



