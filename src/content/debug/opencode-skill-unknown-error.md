---
title: "OpenCode：自定义 Skill - 更新后报错"
date: "2026-07-27"
updated: "2026-07-27"
slug: "opencode-skill-update-error"
category: "开发工具"
subcategory: "Agent"
description: "OpenCode 的新 Skill 未被发现时，通常是长驻服务仍使用启动时的 Skill 注册表，重启服务即可刷新。"
---
<p>今天第 8 次让 AI 帮我 debug 一个 opencode 问题，也是唯一一次真正找到根因、一步到位修好的——记下来备份。</p>

<h2>① 现象</h2>
<p>在 VSCode 里用 opencode 调用自定义 skill <code>bili-audio-transcribe</code>（位于 <code>~/.claude/skills/bili-audio-transcribe/</code>），无论走 slash command 还是直接调 <code>skill</code> 工具加载，都报一个干瘪的：</p>
<p><code>UnknownError: UnknownError</code></p>
<p>奇怪的是：同目录下其它 skill（<code>agent-reach</code>、<code>amap-lbs-skill</code>、<code>meal-scout</code> …）全部正常，唯独这个新加的一直不认。</p>

<h2>② 排查路径：文件 → 注册表 → 进程</h2>
<h3>1. 先怀疑 SKILL.md 本身</h3>
<p>frontmatter 写错、YAML 解析失败是 skill 无法加载最常见的坑。我用 opencode 自带的 <code>yaml</code> 包把 ~/.claude/skills 下 26 个 SKILL.md 跑了一遍解析，<code>bili-audio-transcribe</code> 的 frontmatter 完全正常——<code>name</code> 类型对、<code>description</code> 是 137 字符的普通字符串，文件本身也没 BOM、没 xattr 锁。<strong>第一嫌疑解除。</strong></p>

<h3>2. 再看 opencode 的 skill 注册表</h3>
<p>opencode 的 skill 发现逻辑写在二进制里（<code>Skill.discovery</code> + <code>Skill.state</code>）。翻 <code>~/.local/share/opencode/log/opencode.log</code>，没看到任何 <code>duplicate skill name</code> 或 <code>failed to parse skill</code> 警告，但也没有 <code>bili-audio-transcribe</code> 被 <code>touching file</code> 的记录——也就是说<strong>它根本没被扫到</strong>。</p>
<p>让 AI 直接调 <code>skill</code> 工具，opencode 给的回执也很直白：</p>
<p><code>Skill "bili-audio-transcribe" not found. Available skills: agent-reach, amap-lbs-skill, ..., voice, web-access</code></p>
<p>注册表里压根没它。</p>

<h3>3. 关键证据：进程启动时间 vs 文件 birth time</h3>
<p>opencode server 的 skill 发现在进程启动时只跑一次，之后不会重扫磁盘。<code>ps</code> 一下正在跑的 server：</p>
<pre><code>PID  STARTED                  ELAPSED
2468 Sat Jul 25 01:11:12 2026 02-12:25:39</code></pre>
<p>而 <code>bili-audio-transcribe</code> 目录的 birth time：</p>
<pre><code>Jul 27 02:53:28 2026</code></pre>
<p>中间相差 <strong>2 天 12 小时</strong>：server 启动时这个 skill 目录还不存在，等它后来被创建，server 早就不重扫了，registry 里永远没这一项。顺带发现 disk 上的二进制是 <code>1.18.5</code>，但日志里新会话标的却是 <code>version=1.18.3</code>——内存里跑的还是 7 月 25 日的旧版本。</p>

<h2>③ 根因</h2>
<p>一句话：<strong>opencode 的 skill 注册表是启动时快照，磁盘上有新 skill 不会自动被发现，必须重启 server。</strong></p>
<p>日志里那条 <code>UnknownError: UnknownError</code>（堆栈指向 <code>SessionPrompt.command</code>）就是 slash-command 分发时在注册表里查不到名字、又没做清晰的 "not found" 提示，抛了一个没填 cause 的 <code>UnknownError</code>，所以报错信息看起来很神秘、和真实原因中间隔了一层。</p>

<h2>④ 解决方案</h2>
<p>最干净、一步到位：在 VSCode 里按 <code>Cmd + Shift + P → Developer: Reload Window</code>。</p>
<p>reload 窗口会让扩展把旧 server 进程 kill 掉、起一个新的，新 server 在启动时重扫 <code>~/.claude/skills/</code>，把新加的 <code>bili-audio-transcribe</code> 装进注册表。顺带把内存里那版 1.18.x 也换成 disk 上已经升级的 1.18.5。</p>
<p>实测：reload 完再 <code>/bili-audio-transcribe</code> 立刻可用，<code>UnknownError</code> 消失。不想 reload 整个窗口的话也可以在终端 <code>kill 2468</code> 让扩展自动拉起新 server。</p>

<h2>⑤ 两条小经验</h2>
<ol>
  <li><strong>opencode skill 报 UnknownError 几乎一定是注册表问题。</strong>先调一次 <code>skill</code> 工具看 available 列表里有没有目标名字；如果没有，直接重启 server，不要去改 SKILL.md。</li>
  <li><strong>磁盘上换了二进制 ≠ 进程用了新二进制。</strong>看到 <code>opencode --version</code> 和日志里的 <code>version=</code> 对不上，先怀疑长驻 server 跑着老版本，重启比排查代码改动更高性价比。</li>
</ol>
<p>排查 skill 加载问题记住口诀：<strong>报错不可信 → 注册表可疑 → 进程年龄可疑 → 重启解决一切</strong>。</p>

## 参考资料

- [OpenCode 官网](https://opencode.ai)
