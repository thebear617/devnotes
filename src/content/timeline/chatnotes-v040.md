---
title: "聊天站 v0.4.0：阅读画布 - 卡片视觉与思考过程重构"
date: '2026-08-16'
updated: '2026-08-16'
description: 'ChatNotes v0.4.0 聚焦阅读画布与回答卡片视觉：收束卡片宽度和层级，重构思考过程展示、Markdown 内容和工作区弹窗，使连续阅读更稳定。'
subcategory: [视觉]
category: 聊天站
---

ChatNotes v0.4.0 聚焦阅读画布与回答卡片视觉：收束卡片宽度和层级，重构思考过程展示、Markdown 内容和工作区弹窗，使连续阅读更稳定。

## 阅读画布与回答卡片

- 将阅读区域收束为稳定的宽幅卡片画布，调整整体宽度、留白、背景卡片错位和滚动条位置，避免输入停靠层遮挡正文。
- 重新设计思考过程组件：思考中显示流动的边框光带和实时耗时，完成后以可折叠的“思考完成”状态呈现，并保留逐步展开的过渡体验。
- 增加回答复制、联网来源和引用标记的渲染支持，补齐 Markdown 表格、脚注引用及来源列表的阅读样式。
- 收束删除、创建文件夹、创建项目和重命名弹窗，减少冗余文案、分割线和过重按钮，让危险操作更清晰。

## 发布验证

- ChatNotes 发布提交：`ca7e03c feat(v0.4.0): 重构阅读区与卡片视觉`。
- ChatNotes 已创建标签 `v0.4.0`。
- `npm run lint`、`npm run test:unit`（148 个测试）和 `npm run build` 均通过，`git diff --check` 通过。

## UI 设计图留档

以下 6 张图片按文件名中的时间戳从早到晚排列，记录 v0.4.0 前后阅读卡片、回答卡片和暖米色画布的 UI 演进。

<div class="timeline-ui-archive">
  <img src="/images/timeline/chatnotes-v040/design-01.png" alt="ChatNotes v0.4.0 UI 设计稿 1" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/design-02.png" alt="ChatNotes v0.4.0 UI 设计稿 2" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/design-03.png" alt="ChatNotes v0.4.0 UI 设计稿 3" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/design-04.png" alt="ChatNotes v0.4.0 UI 设计稿 4" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/design-05.png" alt="ChatNotes v0.4.0 UI 设计稿 5" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/design-06.jpg" alt="ChatNotes v0.4.0 UI 设计稿 6" loading="lazy" />
</div>

## 交互态 UI 留档

补充 v0.4.0 阅读画布落地后的工作区空态、从根节点创建关系节点的对话框、项目菜单、新建文件夹对话框和侧栏收起状态。

<div class="timeline-ui-archive">
  <img src="/images/timeline/chatnotes-v040/ui-02.png" alt="ChatNotes v0.4.0 工作区空态" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/ui-03.png" alt="ChatNotes v0.4.0 创建关系节点对话框" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/ui-04.png" alt="ChatNotes v0.4.0 项目操作菜单展开状态" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/ui-05.png" alt="ChatNotes v0.4.0 新建文件夹对话框" loading="lazy" />
  <img src="/images/timeline/chatnotes-v040/ui-06.png" alt="ChatNotes v0.4.0 侧栏收起状态" loading="lazy" />
</div>
