---
title: "Chrome：localhost - 端口与缓存导致的错误跳转"
date: "2026-08-02"
updated: "2026-08-02"
slug: "chrome-localhost-port-cache-redirect"
category: "系统与平台"
subcategory: "计算机网络"
description: "多个项目复用同一 localhost 端口时，Chrome 可能复用旧站点缓存并错误跳转，清缓存或固定端口即可避免。"
---
<h2>① 现象</h2>
<p>GameNotes 在 <code>localhost:4321</code> 启动后，Chrome 访问首页会先收到 <code>200</code>，随后自动请求 <code>/notes/</code> 并显示 404；同一 URL 在 VSCode 内置浏览器中正常。把首页从 <code>/</code> 改成 <code>/index.html</code> 也无效。</p>

<h2>② 排查：先分清服务端与浏览器</h2>
<ol>
  <li>用 <code>curl</code> 分别请求 <code>/</code> 与 <code>/index.html</code>：两者均返回 <code>200</code>，没有 <code>Location</code> 响应头。</li>
  <li>检索项目源码：没有 <code>/notes/</code>、<code>window.location</code> 或 meta refresh。</li>
  <li>Chrome DevTools 的 Application 面板没有该来源的 Service Worker；Network 面板显示首页之后才出现 <code>/notes/</code>。</li>
  <li>勾选 Network 的 <strong>Disable cache</strong> 后，重定向立刻消失。</li>
</ol>

<h2>③ 根因</h2>
<p>不同项目轮流使用同一个来源 <code>http://localhost:4321</code>。Chrome 会按“协议 + 主机 + 端口”识别来源，因此缓存了此前在该端口运行的旧站点页面；旧页面的导航逻辑仍会进入 <code>/notes/</code>。这不是 Astro 路由、页面源码或浏览器扩展的问题。</p>

<h2>④ 两种确定的解决方案</h2>
<ol>
  <li><strong>彻底清掉旧状态：</strong>打开 DevTools，在 Network 勾选 <strong>Disable cache</strong>，然后执行“清空缓存并硬性重新加载”；或者在 Chrome 的“清除浏览数据”中删除缓存的图片和文件。清理后首页继续使用标准路径 <code>/</code>。</li>
  <li><strong>每个站点固定不同端口：</strong>避免多个本地项目复用 <code>localhost:4321</code>。端口不同即来源不同，浏览器不会复用旧页面缓存。</li>
</ol>

<h2>⑤ 2026-08-02 的最终选择与端口表</h2>
<p>先清空 Chrome 旧缓存以修复当前问题；长期固定每个站点的开发端口，并在端口被占用时直接报错，避免服务悄悄漂移到其他端口。</p>
<table>
  <thead><tr><th>端口</th><th>站点</th><th>本地入口</th></tr></thead>
  <tbody>
    <tr><td>4321</td><td>熊窝（Personal）</td><td><code>http://localhost:4321/</code></td></tr>
    <tr><td>4322</td><td>猪窝（Home）</td><td><code>http://localhost:4322/</code></td></tr>
    <tr><td>4323</td><td>开发笔记（DevNotes）</td><td><code>http://localhost:4323/notes/</code></td></tr>
    <tr><td>4324</td><td>研究笔记（ReaNotes）</td><td><code>http://localhost:4324/</code></td></tr>
    <tr><td>4325</td><td>游戏笔记（GameNotes）</td><td><code>http://localhost:4325/</code></td></tr>
    <tr><td>4326</td><td>生活笔记（LifeNotes）</td><td><code>http://localhost:4326/</code></td></tr>
    <tr><td>4327</td><td>猫猫手册（Cats）</td><td><code>http://localhost:4327/cat-knowledge/</code></td></tr>
  </tbody>
</table>

<p><strong>排查口诀：</strong>先用 <code>curl</code> 判断服务端有没有重定向，再用不同浏览器对比；只有 Chrome 异常时，优先检查缓存和端口是否被其他项目复用。</p>
