---
title: "Astro：迁移 - 静态资源路径错误"
date: "2026-07-29"
updated: "2026-07-29"
slug: "astro-migration-static-asset-path"
category: "开发工具"
subcategory: "架构框架"
description: "Astro 部署到 GitHub Pages 子路径时，静态资源需要规范化 BASE_URL 并逐段编码，否则图片会因路径错误加载失败。"
---
**症状：**旧的静态站迁到 Astro 后，猫咪卡片仍正常渲染，但所有 `<img>` 都显示破图。图片已经放在 `public/images/`，构建产物中也存在对应文件。

**第一层原因：**站点部署在 GitHub Pages 子路径 `/cat-knowledge/` 下；请求 `/images/...` 会绕过子路径。Astro 开发服务器会明确提示：public 资源 URL 必须包含 base。

**第二层原因：**不能假设 `import.meta.env.BASE_URL` 一定以 `/` 结尾。开发环境中它是 `/cat-knowledge`；直接拼接 `BASE_URL + 'images/…'` 会悄悄变成 `/cat-knowledgeimages/…`，不再触发 base 警告，但仍然加载失败。

**修复：**统一规范化 base，再对中文路径逐段编码：

    const BASE_URL = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}`;

    function imageUrl(path) {
      const encoded = path.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/');
      return `${BASE_URL}${encoded}`;
    }

例如最终请求应为 `/cat-knowledge/images/邪恶奶牛/邪恶奶牛1.jpg`，而不是 `/images/…` 或 `/cat-knowledgeimages/…`。

**排查顺序：**

1.  确认运行的确实是目标项目的端口；`4321` 很可能已被别的 Astro 项目占用。
2.  直接请求一张图片，分别验证 `/images/…` 与 `/cat-knowledge/images/…` 的 HTTP 状态。
3.  检查浏览器实际生成的 `img.src`，不要只看数据里的相对路径。
4.  检查 `dist/images/` 是否包含图片，再运行 `npm run build`。

## 参考资料

- [Astro 文档：base 配置](https://docs.astro.build/en/reference/configuration-reference/#base)
- [Astro 文档：public 目录](https://docs.astro.build/en/basics/project-structure/#public)
