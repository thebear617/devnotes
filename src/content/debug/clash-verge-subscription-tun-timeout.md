---
title: "Clash Verge：节点连接 - TUN 模式导致超时"
date: "2026-07-25"
updated: "2026-07-25"
slug: "clash-verge-tun-mode-timeout"
category: "系统与平台"
subcategory: "计算机网络"
description: "Clash Verge 节点全部超时时，先重新导入订阅并关闭 TUN 模式可恢复桌面端连接。"
---
电脑端使用 B 站点订阅时，Clash Verge 中所有节点都显示连接超时，但同一订阅在手机 Shadowrocket 上可以正常连接；换用 A 订阅后电脑端也能使用。排查发现电脑可以直接连通 B 节点端口，问题出在 Clash Verge 的 TUN 路由模式。

解决方法：

1.  到服务商网站重新导入一次需要使用的订阅，确保配置是最新的。
2.  导入完成后关闭 Clash Verge 的 TUN 模式，使用普通系统代理。

以后遇到“手机能用、电脑 Clash Verge 全部超时”的类似问题，可以先重新导入订阅，再关闭 TUN 模式测试。
