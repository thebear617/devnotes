---
title: "bili-audio-transcribe：B 站转录 - 下载故障排查"
date: "2026-08-05"
updated: "2026-08-05"
slug: "bili-audio-transcribe-download-troubleshooting"
category: "开发工具"
subcategory: "Agent"
description: "B 站转录下载问题最终通过规范化 BV URL、升级 yt-dlp、修正输出目录和保留回退错误链得到解决。"
---
<h2>① 现象</h2>
<p>B 站视频转录（BV1sHGu6AEGw）卡在下载阶段：<code>bili</code> CLI 报 <code>ok: false, error: internal_error: 'NoneType' object has no attribute 'value'</code>（B 站音频流接口被风控/结构变化），脚本声称回退 yt-dlp 却报 <code>'BV1sHGu6AEGw' is not a valid URL</code>。手工用完整 URL + 旧版 yt-dlp 再报 <code>HTTP Error 412: Precondition Failed</code>。最终靠「完整 URL + pipx 升级 yt-dlp 到 2026.07.04」才成功。</p>

<h2>② 根因拆解（6 步卡顿，4 步是 skill 自身 bug）</h2>
<ol>
  <li><code>bili</code> CLI 崩溃（external，非 skill 可控）</li>
  <li><strong>H1（skill 确定性 bug）</strong>：yt-dlp fallback 把裸 BV 号原样传给 yt-dlp，不补完整 URL（<code>transcribe_bili.py</code> 原 <code>run_bili_download</code> 把 source 直接给 fallback_command 末参）→ fallback 100% 必死</li>
  <li><strong>M2（skill 缺陷）</strong>：Dependencies 完全不声明 yt-dlp，不查版本不提示升级；而 yt-dlp 对 B 站 extractor 有时效性（2026.03.17 报 412，2026.07.04 才行）</li>
  <li><strong>H3（skill 确定性 bug）</strong>：默认输出根靠沿脚本路径向上找 <code>.workbuddy</code> 探测，脚本装在 <code>~/.agents/</code> 导致命中 <code>~/.workbuddy</code> → 输出落到 <code>~/lifenotes/...</code> 而非 <code>~/Documents/htmls/lifenotes/...</code>；且 <code>DEFAULT_OUTPUT_ROOT</code> 在 import 时冻结求值</li>
  <li><strong>H2（skill 确定性 bug）</strong>：yt-dlp fallback 文件名模板带 <code>%(id)s</code>（即 BV 号），主流程 folder_name 又拼一次 → 目录名重复 <code>[BV号]</code> 后缀</li>
  <li>文档（SKILL.md）写「bili 失败即停」，实现却静默回退 yt-dlp，误导排障（M1）</li>
</ol>

<h2>③ 修复内容（落到 transcribe_bili.py + SKILL.md）</h2>
<ul>
  <li><strong>H1</strong>：新增 <code>normalize_bilibili_source()</code>，yt-dlp fallback 前把裸 BV 规范化为 <code>https://www.bilibili.com/video/${BV}</code></li>
  <li><strong>H2</strong>：fallback 模板去掉 <code>%(id)s</code> + 新增 <code>strip_trailing_bvid()</code> 双层防御</li>
  <li><strong>H3</strong>：<code>find_workspace_root()</code> 探测顺序改为 <code>HTMLS_ROOT</code> 环境变量 → CWD 向上找 <code>.workbuddy</code> → 脚本路径兜底；删除 import 时冻结求值，改运行时求值；探测失败/命中主目录时打印警告</li>
  <li><strong>L1</strong>：bili 失败先 log 原始错误，fallback 再失败时用 <code>raise ... from</code> 保留异常链</li>
  <li><strong>M2</strong>：fallback 前探测并打印 yt-dlp 版本；412/Precondition Failed 时提示 <code>pipx install --upgrade yt-dlp</code>；<code>not a valid URL</code>/generic 时提示用完整 URL</li>
  <li><strong>L2</strong>：候选音频文件数量异常时列出目录实际文件名</li>
  <li><strong>L4</strong>：argparse help 同步 b23.tv / v.douyin.com 短链说明</li>
  <li><strong>L6</strong>：补 6 个回归单测（CWD 优先、HTMLS_ROOT、URL 规范化、BV 去重、412 失败链、候选文件列目录），共 31 passed</li>
  <li><strong>M4 重要发现</strong>：<code>~/.agents/skills</code> 本身就是指向 <code>~/.claude/skills</code> 的符号链接——所谓「两份副本」实为同一物理目录（inode 相同），不存在副本漂移；试图在 .claude 下追加子链接会形成循环引用（Too many levels of symbolic links），已撤销恢复</li>
</ul>

<h2>④ 端到端验证</h2>
<p>修复后用 BV1Dw3d6BEpW 实测：<code>bili</code> CLI 又真实失败，脚本清晰打印失败原因 + yt-dlp 版本 → 自动回退成功；输出根正确命中 <code>~/Documents/htmls</code>；目录名无重复 BV 后缀。总耗时 41.4s（12:33 视频，513 片段）。</p>

<h2>⑤ 经验总结</h2>
<ol>
  <li>B 站对音频流接口的风控/变更可能是常态，<code>bili</code> CLI 不可依赖，yt-dlp fallback 是刚需，必须保持 yt-dlp 较新版本</li>
  <li>默认输出根这种路径逻辑不要用 import 时冻结值 + 脚本路径向上探测，CWD/环境变量是更稳的来源</li>
  <li>排障先分清「skill 自身 bug / 外部风控 / 环境噪声」三类原因，再看文档是否与实现一致</li>
</ol>

## 参考资料

- [yt-dlp 官方仓库](https://github.com/yt-dlp/yt-dlp)
