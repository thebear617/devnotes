---
title: "ChatNotes：工作区 - 双栏独立滚动"
date: "2026-08-12"
updated: "2026-08-12"
slug: "chatnotes-workspace-two-column-scroll"
category: "站点与应用"
subcategory: "UI/UX"
description: "ChatNotes 双栏工作区通过固定外层高度并收拢右侧滚动责任，解决左栏跟随滚动和输入框下方空白问题。"
---
## ① 目标交互

ChatNotes 的工作区是左右双栏：左侧是项目导航，右侧是节点卡片和聊天输入框。目标是让左侧在滚动过程中完全保持在视口内，只有右侧内容区域上下滚动；当滚动到聊天输入框时，输入框就是右侧内容的末端，不再继续滚出一段空白，也不遮挡笔记卡片。

## ② 只写 `position: sticky` 为什么不够

最初只给侧边栏添加 `position: sticky; top: 0`，但实际仍然会轻微移动。原因不是 sticky 失效，而是滚动责任没有被正确分配：

- 外层工作区只有 `min-height: 100svh`，没有固定视口高度；内容变长时，外层页面也会参与滚动。
- 右侧虽然声明了 `overflow: auto`，但没有被固定高度约束，因此不一定成为唯一的滚动容器。
- 左侧自身使用 `overflow: auto`，滚轮悬停在侧栏上时，侧栏内部也会滚动；滚动到边界后还可能发生滚动链传递。

`sticky` 只能在明确的滚动容器中工作。先确定“谁负责滚动”，比单独添加 sticky 更重要。

## ③ 最终布局契约

    .workspace-shell {
      height: 100svh;
      min-height: 0;
      overflow: hidden;
      display: grid;
      grid-template-columns: 18rem minmax(0, 1fr);
    }

    .project-sidebar {
      position: sticky;
      top: 0;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      overscroll-behavior: contain;
    }

    .workspace-reading {
      height: 100%;
      min-height: 0;
      overflow: auto;
      overscroll-behavior: contain;
    }

这里有三个关键点：

1.  **锁定外层高度：**`height: 100svh` 让工作区只占一屏，`min-height: 0` 防止 Grid 子项按内容把父容器撑高。
2.  **收拢滚动责任：**外层 `overflow: hidden`，右侧 `overflow: auto`，因此桌面端只有右侧阅读区产生滚动。
3.  **让左栏真正静止：**左栏不再使用 `overflow: auto`，滚轮不会改变侧栏内部位置；sticky 作为视口定位约束保留。

## ④ 聊天输入框不能遮挡卡片

聊天输入框被移出卡片后，使用独立容器放在右侧内容流的最后：

    .workspace-chat-dock {
      width: min(84rem, calc(100% - 3rem));
      margin: 0 auto;
    }

它不使用 `position: fixed` 或 `position: absolute`，所以不会覆盖卡片。聊天容器之后不再添加多余的底部外边距，右侧滚动到它的底部时，内容就自然结束在这里。

## ⑤ 移动端例外

窄屏下不再强制双栏视口布局，而是恢复普通页面流：

    @media (max-width: 720px) {
      .workspace-shell {
        height: auto;
        min-height: 100svh;
        overflow: visible;
        grid-template-columns: 1fr;
      }

      .project-sidebar,
      .workspace-reading {
        position: static;
        height: auto;
        overflow: visible;
      }
    }

这样移动端可以由页面整体自然滚动，避免固定侧栏和小屏输入框互相挤压。

## ⑥ 验收清单

1.  鼠标在右侧滚动：右侧卡片移动，左侧导航保持不动。
2.  鼠标在左侧滚轮：左侧不会自行滚走，也不会把外层页面带动。
3.  滚动到聊天输入框：输入框是右侧内容流的最后一个元素，不再有额外空白滚动区。
4.  卡片内容不会被聊天输入框覆盖。
5.  切换到移动端：恢复单列布局和页面自然滚动。

**维护原则：**以后调整双栏布局时，优先检查高度约束和滚动容器归属；不要只给某个元素追加 sticky，也不要把底部输入框重新改成 fixed，除非同时为内容区预留等高的安全空间。
