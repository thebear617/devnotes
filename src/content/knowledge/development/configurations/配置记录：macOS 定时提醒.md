---
title: "配置记录：macOS - 定时提醒"
date: "2026-07-14"
updated: "2026-08-15"
slug: "macos-timed-reminder-config"
category: "开发与实践"
subcategory: "配置记录"
description: ""
---

## ① 关联文件与触发频率

定时提醒的内容来自一个 Markdown 文件，手动编辑它就是编辑提醒清单：

- **关联文件**：`/Users/mokaiche/.hermes/reminder-today.md`（即 `~/.hermes/reminder-today.md`）
- **触发频率**：每 **20 分钟**一次（launchd `StartInterval` = 1200 秒）

## ② 触发逻辑

由 launchd LaunchAgent `com.user.reminder-today` 驱动：

1. launchd 每 20 分钟执行脚本 `/Users/mokaiche/scripts/reminder-today.sh`；
2. 脚本 `cat` 读取上面的 md 文件内容；
3. 先调 `terminal-notifier` 响铃 + 右上角横幅（吸引注意）；
4. 再用 `osascript display dialog` 弹出对话框，**完整显示** Markdown 内容（长清单不被横幅截断）。

改提醒内容只需编辑 md 文件，下一次 20 分钟触发会自动读最新版，无需重载任务。

## ③ 速查指令

**立刻触发一次（已验证可用）**——直接跑脚本本身：

```bash
bash /Users/mokaiche/scripts/reminder-today.sh
```

**禁用定时任务**——卸载 launchd 任务，不再自动触发：

```bash
launchctl unload ~/Library/LaunchAgents/com.user.reminder-today.plist
```

**启用定时任务**——重新加载，恢复每 20 分钟触发：

```bash
launchctl load ~/Library/LaunchAgents/com.user.reminder-today.plist
```

说明：修改频率（plist 的 StartInterval）后需先 unload 再 load 才能生效，直接编辑 plist 不会被 launchd 自动感知。
