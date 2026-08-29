---
title: "Astro：内容模块 - 加载超时"
date: "2026-08-09"
updated: "2026-08-09"
slug: "astro-content-module-load-timeout"
category: "开发工具"
subcategory: "环境依赖"
description: "Astro 在内容集合初始化阶段持续超时，通常需要按 lockfile 重装依赖并清理 .astro 缓存来恢复。"
---
## ① 现象

DevNotes 执行 `npm run dev` 后只显示 `[types] Generated 0ms`，等待 60 秒后报：

    transport invoke timed out after 60000ms
    [content] Content config not loaded

随后 Astro 仍然打印 `ready`，但访问页面继续卡住。`npm run build` 和 `astro sync` 也会停在内容集合初始化阶段。

## ② 排查结论

1.  不是 `global.css`：超时发生在 Astro 评估 `src/content/config.ts`、加载 `astro:content` 的阶段，页面 CSS 还没有参与渲染。
2.  不是当前文章的 Markdown 内容：153 个 Markdown 的 frontmatter 都能正常解析，当前 Markdown 插件也能正常渲染。
3.  不是 4323 端口冲突：停止旧进程后仍能在无监听进程的情况下复现。
4.  只删除 `.astro` 和 `node_modules/.vite` 不足以恢复，说明问题不只在 Astro/Vite 的生成缓存。

## ③ 恢复方式

    rm -rf node_modules
    npm ci
    rm -rf .astro
    npm run dev

重装依赖后开发服务器恢复正常。

## ④ 根因理解

本次更接近 **node_modules 依赖安装状态或 Vite/Astro 模块缓存不一致**：Astro 5.18.2 在加载内容集合配置时，Vite SSR module runner 卡在 `fetchModule`，最终触发 60 秒 transport 超时。重装依赖重新建立了与 `package-lock.json` 一致的依赖树，清理 `.astro` 后又让内容集合重新生成，因此恢复。

顶部提示的 Astro 新版本与这次卡住无关；不要把这个问题直接升级成 Astro 大版本迁移。

## ⑤ 以后遇到相同现象

1.  先看是否出现 `transport invoke timed out` 和 `Content config not loaded`。
2.  先清理 `.astro` 与 `node_modules/.vite`。
3.  如果 `build`、`sync` 仍同时卡住，再按 lockfile 执行 `npm ci` 重装依赖。
4.  不要因为启动卡住就回滚与页面显示有关的 CSS；CSS 修改和这次内容模块初始化超时是两条独立链路。
