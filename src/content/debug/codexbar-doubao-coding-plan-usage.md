---
title: "CodexBar：供应商 - 如何查看火山方舟 Coding Plan 用量"
date: "2026-08-29"
updated: "2026-08-31 18:21"
slug: "codexbar-doubao-coding-plan-usage"
category: "开发工具"
subcategory: "Agent"
description: "安装并登录火山方舟 Ark CLI，升级 CodexBar 到 0.45.0 以上，再启用豆包供应商即可查看 Coding Plan 用量。"
---

## 适用场景

想在 macOS 菜单栏的 CodexBar 中查看火山方舟 Coding Plan 的会话、周度和月度用量，而不是每次都手动打开终端查询。

## 前置要求

CodexBar 需要更新到 **0.45.0 或更高版本**。0.45.0 开始支持通过 Ark CLI 读取火山方舟 Coding Plan 用量。

## 操作流程

### 第一步：安装 Ark CLI、完成登录并查询套餐

在终端依次运行下面三条命令：

```bash
npm i -g @volcengine/ark-cli@latest
arkcli auth login volc-sso
arkcli usage plan --product coding-plan
```

第二条命令会打开火山方舟的 SSO 登录流程。登录后选择项目时，选择 `default — 默认项目` 即可。第三条命令能够正常返回 `subscribed: true` 以及 `session`、`weekly`、`monthly` 三个周期，说明 Ark CLI 已经可以读取 Coding Plan。

注意：终端中输入第一条命令时，`@latest` 前不要加反斜杠；这里的命令可以直接复制执行。

### 第二步：更新 CodexBar

将 CodexBar 更新到 `0.45.0` 以上版本。更新完成后重新打开 CodexBar，确保运行的是新版本。

### 第三步：添加豆包供应商

在 CodexBar 的设置中打开供应商管理，添加或启用 **Doubao（豆包）** 供应商。CodexBar 会通过已经登录的 Ark CLI 自动读取火山方舟 Coding Plan，用量信息随后会显示在豆包供应商卡片中。

## 验证结果

- Ark CLI 查询结果中的 `product` 为 `coding-plan`
- 套餐状态为 `subscribed: true`
- CodexBar 的豆包供应商能够显示会话、周度和月度用量

## 结论

火山方舟 Coding Plan 不需要在 CodexBar 中单独添加一个名为“火山方舟”的供应商。完成 Ark CLI 登录，并把 CodexBar 更新到 `0.45.0+` 后，添加豆包供应商即可自然显示 Coding Plan 用量。

## 后续补充

1. 若 codexbar 失效，可以用以下命令行重新登录即可恢复

```bash
arkcli auth login --no-browser # 法一：从浏览器复制授权码登录
arkcli auth login volc-sso # 法二：带浏览器的直接点击登录

```

## 参考资料

- [CodexBar：自定义供应商文档](https://github.com/steipete/CodexBar/blob/main/docs/provider.md)
- [CodexBar：Doubao 供应商文档](https://github.com/steipete/CodexBar/blob/main/docs/doubao.md)
- [火山方舟 Coding Plan 官方文档](https://console.volcengine.com/ark/region:cn-beijing/docs/82379/1928261?lang=zh)
- [火山方舟 Ark CLI](https://github.com/volcengine/ark-cli)

