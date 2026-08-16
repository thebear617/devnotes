---
title: "ChatNotes：工作区 - 双栏独立滚动"
date: "2026-08-12"
updated: "2026-08-12"
slug: "chatnotes-workspace-two-column-scroll"
category: "站点与应用"
subcategory: "UI/UX"
description: "ChatNotes 双栏工作区通过固定外层高度并收拢右侧滚动责任，解决左栏跟随滚动和输入框下方空白问题。"
---
<h2>① 目标交互</h2>
<p>ChatNotes 的工作区是左右双栏：左侧是项目导航，右侧是节点卡片和聊天输入框。目标是让左侧在滚动过程中完全保持在视口内，只有右侧内容区域上下滚动；当滚动到聊天输入框时，输入框就是右侧内容的末端，不再继续滚出一段空白，也不遮挡笔记卡片。</p>

<h2>② 只写 <code>position: sticky</code> 为什么不够</h2>
<p>最初只给侧边栏添加 <code>position: sticky; top: 0</code>，但实际仍然会轻微移动。原因不是 sticky 失效，而是滚动责任没有被正确分配：</p>
<ul>
  <li>外层工作区只有 <code>min-height: 100svh</code>，没有固定视口高度；内容变长时，外层页面也会参与滚动。</li>
  <li>右侧虽然声明了 <code>overflow: auto</code>，但没有被固定高度约束，因此不一定成为唯一的滚动容器。</li>
  <li>左侧自身使用 <code>overflow: auto</code>，滚轮悬停在侧栏上时，侧栏内部也会滚动；滚动到边界后还可能发生滚动链传递。</li>
</ul>
<p><code>sticky</code> 只能在明确的滚动容器中工作。先确定“谁负责滚动”，比单独添加 sticky 更重要。</p>

<h2>③ 最终布局契约</h2>
<pre><code>.workspace-shell {
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
}</code></pre>
<p>这里有三个关键点：</p>
<ol>
  <li><strong>锁定外层高度：</strong><code>height: 100svh</code> 让工作区只占一屏，<code>min-height: 0</code> 防止 Grid 子项按内容把父容器撑高。</li>
  <li><strong>收拢滚动责任：</strong>外层 <code>overflow: hidden</code>，右侧 <code>overflow: auto</code>，因此桌面端只有右侧阅读区产生滚动。</li>
  <li><strong>让左栏真正静止：</strong>左栏不再使用 <code>overflow: auto</code>，滚轮不会改变侧栏内部位置；sticky 作为视口定位约束保留。</li>
</ol>

<h2>④ 聊天输入框不能遮挡卡片</h2>
<p>聊天输入框被移出卡片后，使用独立容器放在右侧内容流的最后：</p>
<pre><code>.workspace-chat-dock {
  width: min(84rem, calc(100% - 3rem));
  margin: 0 auto;
}
</code></pre>
<p>它不使用 <code>position: fixed</code> 或 <code>position: absolute</code>，所以不会覆盖卡片。聊天容器之后不再添加多余的底部外边距，右侧滚动到它的底部时，内容就自然结束在这里。</p>

<h2>⑤ 移动端例外</h2>
<p>窄屏下不再强制双栏视口布局，而是恢复普通页面流：</p>
<pre><code>@media (max-width: 720px) {
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
}</code></pre>
<p>这样移动端可以由页面整体自然滚动，避免固定侧栏和小屏输入框互相挤压。</p>

<h2>⑥ 验收清单</h2>
<ol>
  <li>鼠标在右侧滚动：右侧卡片移动，左侧导航保持不动。</li>
  <li>鼠标在左侧滚轮：左侧不会自行滚走，也不会把外层页面带动。</li>
  <li>滚动到聊天输入框：输入框是右侧内容流的最后一个元素，不再有额外空白滚动区。</li>
  <li>卡片内容不会被聊天输入框覆盖。</li>
  <li>切换到移动端：恢复单列布局和页面自然滚动。</li>
</ol>

<p><strong>维护原则：</strong>以后调整双栏布局时，优先检查高度约束和滚动容器归属；不要只给某个元素追加 sticky，也不要把底部输入框重新改成 fixed，除非同时为内容区预留等高的安全空间。</p>
