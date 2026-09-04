---
title: "配置记录：Mac的信息及使用"
date: "2026-08-31"
updated: "2026-09-04 17:43"
category: "开发"
subcategory: "配置记录"
description: "Mac 设备购置与保修信息，macOS 定时提醒配置，Mac 使用建议"
slug: "mac-purchase-and-config"
---

## ① Mac Air M5 设备档案

| 机主 | 配置 | 购入日期 | 价格 | 购机渠道 | 整机保修 | 主要部件保修 |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 我 | MacBook Air（M5）16+512 蓝色 | 2026-04-09 | ¥6299 | 西电苹果体验中心 | 1 年（至 2027-04-09） | 2 年（至 2028-04-09） |
| 过马路 | MacBook Air（M5）16+512 银色 | 2026-08-31 | ¥7599 | 西电苹果体验中心 | 1 年（至 2027-08-31） | 2 年（至 2028-08-31） |




## ② Mac 使用建议
| 场景 | 建议做法 | 说明 |
|---|---|---|
| 白天工位、短暂离开（1-3 小时） | 开盖放在桌上即可，不必特意合盖 | 随时回来就能用，省去唤醒等待 |
| 午休下班、晚上过夜、长时间搁置 | 合上盖子进入睡眠 | 最优解；不要开盖放一夜，睡眠更省电、更安全 |
| 每 7-14 天一次 | 苹果菜单 → 重启 | 清空内存泄漏、杀掉僵尸后台进程，性能回血 |



# 已归档 

## ⓵ macOS 定时提醒——26.08停用

### 关联文件与触发频率

定时提醒的内容来自一个 Markdown 文件，手动编辑它就是编辑提醒清单：

- **关联文件**：`/Users/mokaiche/.hermes/reminder-today.md`（即 `~/.hermes/reminder-today.md`）
- **触发频率**：每 **20 分钟**一次（launchd `StartInterval` = 1200 秒）

### 触发逻辑

由 launchd LaunchAgent `com.user.reminder-today` 驱动：

1. launchd 每 20 分钟执行脚本 `/Users/mokaiche/scripts/reminder-today.sh`；
2. 脚本 `cat` 读取上面的 md 文件内容；
3. 先调 `terminal-notifier` 响铃 + 右上角横幅（吸引注意）；
4. 再用 `osascript display dialog` 弹出对话框，**完整显示** Markdown 内容（长清单不被横幅截断）。

改提醒内容只需编辑 md 文件，下一次 20 分钟触发会自动读最新版，无需重载任务。

### 速查指令

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

