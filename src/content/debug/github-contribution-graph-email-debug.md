---
title: "GitHub：贡献图 - 邮箱改写记录"
date: "2026-07-17"
updated: "2026-07-17"
slug: "github-contribution-email-rewrite"
category: "系统与平台"
subcategory: "计算机网络"
description: "GitHub 贡献图因提交邮箱不匹配而漏记时，通过改写历史提交邮箱并同步 Git 配置恢复贡献统计。"
---
<p>GitHub 贡献图一直只显示 66 contributions。诊断发现：6 个仓库的 author email 一直是 <code>1357953389@icloud.com</code>，但 GitHub 账号 <code>thebear617</code> 绑定的 verified email 是 <code>@qq.com</code>——所有 commit 都因为 email 不匹配被「无主」处理，从未算进贡献图。</p>

<h2>决策</h2>
<ul>
  <li>不再绑 icloud 邮箱（已不常用），而是把所有历史 commit 的 author email 改成 <code>@qq.com</code></li>
  <li>同时改 <code>git config user.email</code>，让未来 commit 也用 <code>@qq.com</code></li>
  <li>一并改写历史需要 force-push，因为 6 个仓库都是个人维护的站，可控</li>
</ul>

<h2>执行步骤</h2>
<ol>
  <li>三个仓库（home / devnotes / lifenotes）有未提交改动，先 <code>chore: 备份前提交未完成改动</code> commit</li>
  <li>6 个仓库全部 <code>git bundle create</code> 备份到 <code>$TMPDIR</code>（41M）</li>
  <li>每个仓库的 <code>.git/config</code> 追加 <code>[user] email = 1357953389@qq.com</code></li>
  <li>每个仓库跑 <code>git filter-branch --env-filter</code> 改写 author/committer email
    <ul>
      <li>共改写 351 个 commit：cats 72、home 122、personal 81、devnotes 8、lifenotes 15、reanotes 53</li>
      <li><code>home</code> 还连带改写了 3 个 tag（v1.0-pre-markdown / v1.1.0 / v1.2.0）</li>
    </ul>
  </li>
  <li>删除 <code>refs/original/</code> 备份 refs，<code>git reflog expire --expire=now --all &amp;&amp; git gc --prune=now --aggressive</code></li>
  <li>6 个仓库 <code>git push --force-with-lease origin main</code> 全部成功</li>
</ol>

<h2>关键技术点</h2>
<ul>
  <li><code>filter-branch</code> 在脏仓库上会拒绝，必须先 commit 或 stash；选 commit 因为 stash pop 有冲突风险</li>
  <li><code>--force-with-lease</code> 比 <code>--force</code> 安全：远程若被别人推过会被拒绝</li>
  <li>email 改写会让<strong>所有 commit hash 全部变化</strong>，旧 hash 引用的 PR / issue / 外部文档会失效</li>
  <li>系统已装了 <code>git-filter-repo</code> 的替代品缺失，但 <code>filter-branch</code> 对 351 个 commit 总量只要约 20 秒，可用</li>
</ul>

<h2>修复后预期</h2>
<ul>
  <li>GitHub 会在 5–10 分钟内重新计算贡献图</li>
  <li>过去所有 commit 都会被算进 <code>thebear617</code> 的 <code>@qq.com</code> 身份下</li>
</ul>
