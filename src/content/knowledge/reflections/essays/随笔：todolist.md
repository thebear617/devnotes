---
title: "随笔：todolist"
date: "2026-08-28"
updated: "2026-08-28"
category: "随想"
subcategory: "随笔"
description: "所有 idea、未开始的设计思路的存放、所有要中转的东西"
slug: "todo-list"
---

## todo

1. [^名词解释]

[^名词解释]:
  1. BYOK（Bring Your Own Key）:把「自己的模型 API Key」带到不同产品里使用，避免被单一厂商锁定。需要研究：典型支持 BYOK 的产品、计费 / 隐私边界、与 ==SaaS-only== 模式的取舍

2. [^思路实现]


[^思路实现]:
  1. 研究Agent 路由：把任务拆给多个专门 Agent，每个 Agent 只负责一件事（如一个 Agent 专门搜豆瓣评分/评论）。需要研究：
      - 路由形式：任务路由（dispatcher 拆任务给 worker）vs 能力路由（按 tool calling 把请求路由到对应工具）
      - 状态/记忆共享机制（参考 LangGraph / CrewAI / AutoGen）
      - 是否要封装为本地 skill
  2. 吵架 / 演讲录音 → AI 分析:平时吵架或演讲前录音，丢给 AI 分析语气、用词、情绪，做成网页接口。需要研究：
      - 端到端链路：录音 → 转写 → LLM 分析
      - 可视化输出形式（雷达图 / 时间轴）
      - 是否值得做成产品（隐私、用户场景）
  3. 家用台式机改作个人服务器:把家里的台式机作为自己的服务器，跑 Agent / 家庭服务 / 个人项目。需要研究：
      - 硬件选型：功耗、噪音、稳定性
      - 系统选择：Linux 发行版
      - 网络方案：内网穿透 / 公网 IP
      - 服务编排：Docker / 进程管理
  4. 增强 Codex 的生图能力: 可参考的接入实现为[88API-image-gen](https://github.com/blackdm666/88API-image-gen)。
3. 








