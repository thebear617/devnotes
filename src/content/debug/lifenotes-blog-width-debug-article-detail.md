---
title: "LifeNotes：博客详情页 - 宽度收缩"
date: "2026-08-14"
updated: "2026-08-14"
slug: "lifenotes-article-detail-width"
category: "站点与应用"
subcategory: "UI/UX"
description: "LifeNotes 短文章详情页因 Grid 子项按内容收缩而变窄，需要为正文容器补充 width: 100%。"
---
<h2>① 现象</h2>
<p>内容很少的博客详情页（例如《旅游：全国美食资源合集》）出现整体正文和标题区域按内容收缩的现象：横线与链接区域只有约 <code>476px</code>，博客宽度看起来像是由内容决定的。第一次只把 <code>article-page-shell</code> 从 <code>1080px</code> 调到 <code>1120px</code>，问题仍未解决。</p>

<h2>② 排查</h2>
<p>详情页结构为：</p>
<pre><code>app-shell → article-page-shell → article-detail-layout → article-detail</code></pre>
<ul>
  <li>无目录文章没有 <code>has-toc</code>。</li>
  <li>相关布局使用 Grid。</li>
  <li><code>article-detail</code> 有 <code>max-width: 820px</code> 和 <code>margin: 0 auto</code>，但没有明确指定 <code>width</code>。</li>
</ul>

<h2>③ 根因</h2>
<p><code>article-detail</code> 是 Grid item。在同时设置 <code>max-width</code> 与自动外边距、但没有指定 <code>width</code> 的情况下，它会发生自动尺寸计算，按内容收缩。外层 shell 宽度不是根因；调到 <code>1120px</code> 只解决了大屏下的容纳空间问题，不能阻止 Grid item 按内容变窄。</p>

<h2>④ 解决方案</h2>
<p>为无目录的 <code>.article-detail</code> 增加 <code>width: 100%</code>，同时保留 <code>max-width: 820px</code> 和 <code>margin: 0 auto</code>。<code>article-page-shell</code> 保持 <code>1120px</code>，TOC 规则和移动端规则保持不变。</p>
<pre><code>.article-detail {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
}</code></pre>
<p>修改后执行 <code>npm run build</code>，成功构建 53 个页面。</p>

<h2>⑤ 验收清单</h2>
<ul>
  <li>打开《旅游：全国美食资源合集》等短内容详情页，正文和标题区域不再按内容收缩。</li>
  <li>横线、链接区域随详情内容区正常铺开，宽度不再只有约 <code>476px</code>。</li>
  <li>含 TOC 的文章目录布局不受影响。</li>
  <li>移动端规则仍按原有断点生效。</li>
  <li><code>npm run build</code> 成功，输出 53 个页面。</li>
</ul>
