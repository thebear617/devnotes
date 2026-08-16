---
title: "Astro：内容模块 - 加载超时"
date: "2026-08-09"
updated: "2026-08-09"
slug: "astro-content-module-load-timeout"
category: "开发工具"
subcategory: "环境依赖"
description: "Astro 在内容集合初始化阶段持续超时，通常需要按 lockfile 重装依赖并清理 .astro 缓存来恢复。"
---
<h2>① 现象</h2>
<p>DevNotes 执行 <code>npm run dev</code> 后只显示 <code>[types] Generated 0ms</code>，等待 60 秒后报：</p>
<pre><code>transport invoke timed out after 60000ms
[content] Content config not loaded</code></pre>
<p>随后 Astro 仍然打印 <code>ready</code>，但访问页面继续卡住。<code>npm run build</code> 和 <code>astro sync</code> 也会停在内容集合初始化阶段。</p>

<h2>② 排查结论</h2>
<ol>
  <li>不是 <code>global.css</code>：超时发生在 Astro 评估 <code>src/content/config.ts</code>、加载 <code>astro:content</code> 的阶段，页面 CSS 还没有参与渲染。</li>
  <li>不是当前文章的 Markdown 内容：153 个 Markdown 的 frontmatter 都能正常解析，当前 Markdown 插件也能正常渲染。</li>
  <li>不是 4323 端口冲突：停止旧进程后仍能在无监听进程的情况下复现。</li>
  <li>只删除 <code>.astro</code> 和 <code>node_modules/.vite</code> 不足以恢复，说明问题不只在 Astro/Vite 的生成缓存。</li>
</ol>

<h2>③ 恢复方式</h2>
<pre><code>rm -rf node_modules
npm ci
rm -rf .astro
npm run dev</code></pre>
<p>重装依赖后开发服务器恢复正常。</p>

<h2>④ 根因理解</h2>
<p>本次更接近 <strong>node_modules 依赖安装状态或 Vite/Astro 模块缓存不一致</strong>：Astro 5.18.2 在加载内容集合配置时，Vite SSR module runner 卡在 <code>fetchModule</code>，最终触发 60 秒 transport 超时。重装依赖重新建立了与 <code>package-lock.json</code> 一致的依赖树，清理 <code>.astro</code> 后又让内容集合重新生成，因此恢复。</p>
<p>顶部提示的 Astro 新版本与这次卡住无关；不要把这个问题直接升级成 Astro 大版本迁移。</p>

<h2>⑤ 以后遇到相同现象</h2>
<ol>
  <li>先看是否出现 <code>transport invoke timed out</code> 和 <code>Content config not loaded</code>。</li>
  <li>先清理 <code>.astro</code> 与 <code>node_modules/.vite</code>。</li>
  <li>如果 <code>build</code>、<code>sync</code> 仍同时卡住，再按 lockfile 执行 <code>npm ci</code> 重装依赖。</li>
  <li>不要因为启动卡住就回滚与页面显示有关的 CSS；CSS 修改和这次内容模块初始化超时是两条独立链路。</li>
</ol>
