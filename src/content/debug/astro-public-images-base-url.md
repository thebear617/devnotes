---
title: "Astro：迁移 - 静态资源路径错误"
date: "2026-07-29"
updated: "2026-07-29"
slug: "astro-migration-static-asset-path"
category: "开发工具"
subcategory: "架构框架"
description: "Astro 部署到 GitHub Pages 子路径时，静态资源需要规范化 BASE_URL 并逐段编码，否则图片会因路径错误加载失败。"
---
<p><strong>症状：</strong>旧的静态站迁到 Astro 后，猫咪卡片仍正常渲染，但所有 <code>&lt;img&gt;</code> 都显示破图。图片已经放在 <code>public/images/</code>，构建产物中也存在对应文件。</p>
<p><strong>第一层原因：</strong>站点部署在 GitHub Pages 子路径 <code>/cat-knowledge/</code> 下；请求 <code>/images/...</code> 会绕过子路径。Astro 开发服务器会明确提示：public 资源 URL 必须包含 base。</p>
<p><strong>第二层原因：</strong>不能假设 <code>import.meta.env.BASE_URL</code> 一定以 <code>/</code> 结尾。开发环境中它是 <code>/cat-knowledge</code>；直接拼接 <code>BASE_URL + 'images/…'</code> 会悄悄变成 <code>/cat-knowledgeimages/…</code>，不再触发 base 警告，但仍然加载失败。</p>
<p><strong>修复：</strong>统一规范化 base，再对中文路径逐段编码：</p>
<pre><code>const BASE_URL = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}`;

function imageUrl(path) {
  const encoded = path.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
  return `${BASE_URL}${encoded}`;
}</code></pre>
<p>例如最终请求应为 <code>/cat-knowledge/images/邪恶奶牛/邪恶奶牛1.jpg</code>，而不是 <code>/images/…</code> 或 <code>/cat-knowledgeimages/…</code>。</p>
<p><strong>排查顺序：</strong></p>
<ol>
  <li>确认运行的确实是目标项目的端口；<code>4321</code> 很可能已被别的 Astro 项目占用。</li>
  <li>直接请求一张图片，分别验证 <code>/images/…</code> 与 <code>/cat-knowledge/images/…</code> 的 HTTP 状态。</li>
  <li>检查浏览器实际生成的 <code>img.src</code>，不要只看数据里的相对路径。</li>
  <li>检查 <code>dist/images/</code> 是否包含图片，再运行 <code>npm run build</code>。</li>
</ol>

## 参考资料

- [Astro 文档：base 配置](https://docs.astro.build/en/reference/configuration-reference/#base)
- [Astro 文档：public 目录](https://docs.astro.build/en/basics/project-structure/#public)
