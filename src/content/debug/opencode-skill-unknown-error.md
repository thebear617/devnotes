---
title: "OpenCode：自定义 Skill - 更新后报错"
date: "2026-07-27"
updated: "2026-07-27"
slug: "opencode-skill-update-error"
category: "开发工具"
subcategory: "Agent"
description: "OpenCode 的新 Skill 未被发现时，通常是长驻服务仍使用启动时的 Skill 注册表，重启服务即可刷新。"
---
今天第 8 次让 AI 帮我 debug 一个 opencode 问题，也是唯一一次真正找到根因、一步到位修好的——记下来备份。

## ① 现象

在 VSCode 里用 opencode 调用自定义 skill `bili-audio-transcribe`（位于 `~/.claude/skills/bili-audio-transcribe/`），无论走 slash command 还是直接调 `skill` 工具加载，都报一个干瘪的：

`UnknownError: UnknownError`

奇怪的是：同目录下其它 skill（`agent-reach`、`amap-lbs-skill`、`meal-scout` …）全部正常，唯独这个新加的一直不认。

## ② 排查路径：文件 → 注册表 → 进程

### 1. 先怀疑 SKILL.md 本身

frontmatter 写错、YAML 解析失败是 skill 无法加载最常见的坑。我用 opencode 自带的 `yaml` 包把 ~/.claude/skills 下 26 个 SKILL.md 跑了一遍解析，`bili-audio-transcribe` 的 frontmatter 完全正常——`name` 类型对、`description` 是 137 字符的普通字符串，文件本身也没 BOM、没 xattr 锁。**第一嫌疑解除。**

### 2. 再看 opencode 的 skill 注册表

opencode 的 skill 发现逻辑写在二进制里（`Skill.discovery` + `Skill.state`）。翻 `~/.local/share/opencode/log/opencode.log`，没看到任何 `duplicate skill name` 或 `failed to parse skill` 警告，但也没有 `bili-audio-transcribe` 被 `touching file` 的记录——也就是说**它根本没被扫到**。

让 AI 直接调 `skill` 工具，opencode 给的回执也很直白：

`Skill "bili-audio-transcribe" not found. Available skills: agent-reach, amap-lbs-skill, ..., voice, web-access`

注册表里压根没它。

### 3. 关键证据：进程启动时间 vs 文件 birth time

opencode server 的 skill 发现在进程启动时只跑一次，之后不会重扫磁盘。`ps` 一下正在跑的 server：

    PID  STARTED                  ELAPSED
    2468 Sat Jul 25 01:11:12 2026 02-12:25:39

而 `bili-audio-transcribe` 目录的 birth time：

    Jul 27 02:53:28 2026

中间相差 **2 天 12 小时**：server 启动时这个 skill 目录还不存在，等它后来被创建，server 早就不重扫了，registry 里永远没这一项。顺带发现 disk 上的二进制是 `1.18.5`，但日志里新会话标的却是 `version=1.18.3`——内存里跑的还是 7 月 25 日的旧版本。

## ③ 根因

一句话：**opencode 的 skill 注册表是启动时快照，磁盘上有新 skill 不会自动被发现，必须重启 server。**

日志里那条 `UnknownError: UnknownError`（堆栈指向 `SessionPrompt.command`）就是 slash-command 分发时在注册表里查不到名字、又没做清晰的 "not found" 提示，抛了一个没填 cause 的 `UnknownError`，所以报错信息看起来很神秘、和真实原因中间隔了一层。

## ④ 解决方案

最干净、一步到位：在 VSCode 里按 `Cmd + Shift + P → Developer: Reload Window`。

reload 窗口会让扩展把旧 server 进程 kill 掉、起一个新的，新 server 在启动时重扫 `~/.claude/skills/`，把新加的 `bili-audio-transcribe` 装进注册表。顺带把内存里那版 1.18.x 也换成 disk 上已经升级的 1.18.5。

实测：reload 完再 `/bili-audio-transcribe` 立刻可用，`UnknownError` 消失。不想 reload 整个窗口的话也可以在终端 `kill 2468` 让扩展自动拉起新 server。

## ⑤ 两条小经验

1.  **opencode skill 报 UnknownError 几乎一定是注册表问题。**先调一次 `skill` 工具看 available 列表里有没有目标名字；如果没有，直接重启 server，不要去改 SKILL.md。
2.  **磁盘上换了二进制 ≠ 进程用了新二进制。**看到 `opencode --version` 和日志里的 `version=` 对不上，先怀疑长驻 server 跑着老版本，重启比排查代码改动更高性价比。

排查 skill 加载问题记住口诀：**报错不可信 → 注册表可疑 → 进程年龄可疑 → 重启解决一切**。

## 参考资料

- [OpenCode 官网](https://opencode.ai)
