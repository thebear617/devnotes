---
title: "随笔：草稿箱和todolist"
date: "2026-09-04"
updated: "2026-09-10 12:50"
category: "随想"
subcategory: "随笔"
description: "内容中转和草稿，暂存处｜所有 idea、未开始的设计思路的存放、所有要中转的东西"
slug: "Drafts"
---

## 草稿箱


1. [帖子](https://www.xiaohongshu.com/explore/6aa10fd8000000002b000cf3?2. xsec_token=CBdMp5B9EDnFSNlaB1DzGnieWQq-yt39vJm0Ysgk3maVk=&xsec_source=app_share)说如何用GPT[^批量做3D模型]
2. [见面小花束](https://www.xiaohongshu.com/discovery/item/68be48b6000000001d02798e?source=webshare&xhsshare=pc_web&xsec_token=ABWCnDUcXs0AJrE39c5gHQDKN05_ns_ts8l6l8ytUJo7o=&xsec_source=pc_share)
3. [护肤教程](https://www.bilibili.com/video/BV19Dtd6XEY3/)
4. [装修心得-厨房，全屋智能，抽拉鞋柜](https://www.xiaohongshu.com/explore/6a952264000000000502a8cf?xsec_token=CB1tAYP428Zk8aNXtzNPDkx_6lTcbzbtAv34430t9h1nA=&xsec_source=app_share)
5. [德扑 GTO](https://www.xiaohongshu.com/explore/6a8715bf000000002702ea55?xsec_token=CBJAr-v_1iwLeyeBN7C3YTPB9VCNPXu27Vbsove2dHeKY=&xsec_source=app_share)
- 模型一：GTO-169种组合（是一个很好推断别人范围的牌力矩阵）
- 模型二：投注为当前池的 1/n=当前牌型获取概率的 1/n
6. [德扑术语](https://www.xiaohongshu.com/explore/6a526675000000001700ae99?xsec_token=CBQkIpKztvkimZ5XmUX3NXJ8RrWihQSSagyBddUiNcdsY=&xsec_source=app_share)
[^批量做3D模型]:
  不要让 Codex 做模型，让它做“生产模型的机器”。
  ① 先用少量母模型（通过gpt-image生产参考图）固定风格、比例、材质和面数规范。
  ② 再让 Codex 写 Blender Generator，通过 Seed + 尺寸 + 配色 + 部件组合批量生成变体。 ③ 最后把 QA、命名、GLB 导出、Preview 也全部自动化。
  比如一棵树不再做 10 次，而是写一次 Generator，自动生成几十棵不同的树。🌳
  所以现在的思路变成：
  一条 Prompt → 一条 Pipeline → N Models
  感觉这才是 Codex + Blender 更值得玩的方向。


---

设计思路：是否能把前端开发这块组件化，给自己建立一个 codex 库，以后任何形式的站点其他都是我这些前端组件的排列组合了？


---
1. 文章提出的方法：他没有在dino的基础上加分割头，以往的dino v2 V3, 它是不是都要加一个分割头才能完成分割任务的呢？
2. 按理来说，Sam其实不算是一个自监督的大模型，因为它在这个预训练阶段用到了这个掩码及标注，所以说它算是一种视觉基础大模型，但是它不算是这个严格的算是自监督的预训练大模型，是吗？像dino或者ma. E这种才算是是吗？
3. insid3的Q1:能否直接用mask，而不加上参考图？（但这是不是就不算上下文分割了）


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





































