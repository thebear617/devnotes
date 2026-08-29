---
title: "Chrome：localhost - 端口与缓存导致的错误跳转"
date: "2026-08-02"
updated: "2026-08-02"
slug: "chrome-localhost-port-cache-redirect"
category: "系统与平台"
subcategory: "计算机网络"
description: "多个项目复用同一 localhost 端口时，Chrome 可能复用旧站点缓存并错误跳转，清缓存或固定端口即可避免。"
---
## ① 现象

GameNotes 在 `localhost:4321` 启动后，Chrome 访问首页会先收到 `200`，随后自动请求 `/notes/` 并显示 404；同一 URL 在 VSCode 内置浏览器中正常。把首页从 `/` 改成 `/index.html` 也无效。

## ② 排查：先分清服务端与浏览器

1.  用 `curl` 分别请求 `/` 与 `/index.html`：两者均返回 `200`，没有 `Location` 响应头。
2.  检索项目源码：没有 `/notes/`、`window.location` 或 meta refresh。
3.  Chrome DevTools 的 Application 面板没有该来源的 Service Worker；Network 面板显示首页之后才出现 `/notes/`。
4.  勾选 Network 的 **Disable cache** 后，重定向立刻消失。

## ③ 根因

不同项目轮流使用同一个来源 `http://localhost:4321`。Chrome 会按“协议 + 主机 + 端口”识别来源，因此缓存了此前在该端口运行的旧站点页面；旧页面的导航逻辑仍会进入 `/notes/`。这不是 Astro 路由、页面源码或浏览器扩展的问题。

## ④ 两种确定的解决方案

1.  **彻底清掉旧状态：**打开 DevTools，在 Network 勾选 **Disable cache**，然后执行“清空缓存并硬性重新加载”；或者在 Chrome 的“清除浏览数据”中删除缓存的图片和文件。清理后首页继续使用标准路径 `/`。
2.  **每个站点固定不同端口：**避免多个本地项目复用 `localhost:4321`。端口不同即来源不同，浏览器不会复用旧页面缓存。

## ⑤ 2026-08-02 的最终选择与端口表

先清空 Chrome 旧缓存以修复当前问题；长期固定每个站点的开发端口，并在端口被占用时直接报错，避免服务悄悄漂移到其他端口。

| 端口 | 站点                  | 本地入口                               |
|------|-----------------------|----------------------------------------|
| 4321 | 熊窝（Personal）      | `http://localhost:4321/`               |
| 4322 | 猪窝（Home）          | `http://localhost:4322/`               |
| 4323 | 开发笔记（DevNotes）  | `http://localhost:4323/notes/`         |
| 4324 | 研究笔记（ReaNotes）  | `http://localhost:4324/`               |
| 4325 | 游戏笔记（GameNotes） | `http://localhost:4325/`               |
| 4326 | 生活笔记（LifeNotes） | `http://localhost:4326/`               |
| 4327 | 猫猫手册（Cats）      | `http://localhost:4327/cat-knowledge/` |

**排查口诀：**先用 `curl` 判断服务端有没有重定向，再用不同浏览器对比；只有 Chrome 异常时，优先检查缓存和端口是否被其他项目复用。
