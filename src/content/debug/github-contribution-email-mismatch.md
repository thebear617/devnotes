---
title: "GitHub：贡献图 - 邮箱不匹配的排查与修复"
date: "2026-07-17"
updated: "2026-07-17"
slug: "github-contribution-email-mismatch"
category: "系统与平台"
subcategory: "计算机网络"
description: "GitHub 贡献图不统计提交时，应检查本地 author email 是否属于账号的 verified emails。"
---
<p>我做了很多 commit，但贡献图始终只显示可怜的 66 contributions。排查了一个下午才挖到根因——记录下来避免再踩。</p>

<h2>① 现象</h2>
<p>GitHub 个人主页的贡献图（Contribution Graph）只显示 66 个绿格子，但本地明明有几百个 commit 推送到了 GitHub。</p>
<p>以为是「最近几天的推送没记上」，但实际上是<strong>所有 commit 从来就没被记过</strong>。</p>

<h2>② 根因</h2>
<p>GitHub 计算贡献图的规则：commit 的 <code>author email</code> 必须出现在你 GitHub 账号的 <strong>verified emails 列表</strong>里，否则这次提交会被 GitHub 当成「无主」，完全不计入贡献图。</p>
<p>我的情况：</p>
<ul>
  <li><strong>本地 commit</strong>：所有 6 个仓库的 author email 都是 <code>1357953389@icloud.com</code>（git config user.email 设置的）</li>
  <li><strong>GitHub 账号</strong> <code>thebear617</code> 绑定的 verified email 是 <code>1357953389@qq.com</code> 和 <code>3474153902@qq.com</code></li>
  <li><strong>icloud 那个邮箱从未添加过</strong>，所以 GitHub 认为「这些 commit 不属于 thebear617」</li>
</ul>

<p>所以不是 GitHub 抽风，是<strong>邮箱不匹配</strong>。</p>

<h2>③ 排查步骤（推荐路径）</h2>
<ol>
  <li>打开 <a href="https://github.com/settings/emails" target="_blank" rel="noopener">https://github.com/settings/emails</a>，看你 GitHub 账号所有 verified email</li>
  <li>在每个仓库跑 <code>git log -5 --pretty=format:"%ae"</code>，看你 commit 实际用的 author email</li>
  <li>对比两份列表，找出<strong>差异</strong>——差的就是「失踪」的 commit 来源</li>
</ol>
<p>另两个常见坑（这次都不是，但顺带记下）：</p>
<ul>
  <li><strong>"Include private contributions" 没勾选</strong>：私有仓库 commit 默认不显示，需要去 <a href="https://github.com/settings/profile" target="_blank" rel="noopener">profile settings</a> 勾选</li>
  <li><strong>committer 和 author 是不同邮箱</strong>：merge commit / 协作 commit 容易出现，看 <code>git log --pretty=fuller</code> 区分</li>
</ul>

<h2>④ 修复方案</h2>
<p>两种思路任选：</p>

<h3>方案 A：添加 icloud 邮箱到 GitHub（最简单）</h3>
<p>在 <a href="https://github.com/settings/emails" target="_blank" rel="noopener">Email settings</a> 点 "Add email address" → 填 icloud 邮箱 → 去邮箱点确认链接。</p>
<p><strong>GitHub 会自动追溯</strong>所有用这个邮箱的 commit，5–10 分钟贡献图就会填满。无需 force-push。</p>

<h3>方案 B：改写历史把所有 commit 改成已验证邮箱（彻底但重）</h3>
<p>如果你不再想用 icloud 邮箱（像我一样），那就反过来改 commit：</p>
<ol>
  <li>备份每个仓库：<code>git bundle create backup.bundle --all</code></li>
  <li>改 <code>git config user.email "1357953389@qq.com"</code>（每个仓库 + 全局都改）</li>
  <li>改写历史：
    <pre><code>git filter-branch -f --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "1357953389@icloud.com" ]; then
    export GIT_AUTHOR_EMAIL="1357953389@qq.com"
fi
if [ "$GIT_COMMITTER_EMAIL" = "1357953389@icloud.com" ]; then
    export GIT_COMMITTER_EMAIL="1357953389@qq.com"
fi
' --tag-name-filter cat -- --branches --tags</code></pre>
  </li>
  <li>清理 + gc：<code>git for-each-ref --format='%(refname)' refs/original/ | xargs -n 1 git update-ref -d && git reflog expire --expire=now --all && git gc --prune=now --aggressive</code></li>
  <li>force-push：<code>git push --force-with-lease origin main</code></li>
</ol>
<p><strong>注意：</strong></p>
<ul>
  <li>所有 commit hash 会<strong>全部变化</strong>，任何引用旧 hash 的 PR / issue / 文档会失效</li>
  <li>filter-branch 在脏仓库（未提交改动）上会拒绝——必须先 commit 或 stash</li>
  <li>推荐 <code>--force-with-lease</code> 而非 <code>--force</code>：若远程被别人推过会自动拒绝，避免覆盖</li>
  <li>有 <code>git-filter-repo</code> 装的话优先用它（比 filter-branch 快 10x+ 且无 gotchas），没装的话 filter-branch 也够用</li>
</ul>

<h2>⑤ 经验教训</h2>
<ul>
  <li>设 git config 时<strong>用一个你长期持有 + 愿意绑 GitHub 的邮箱</strong>，别用临时邮箱或将来可能弃用的</li>
  <li>多仓库项目（我 6 个）一定要用<strong>同一个 email</strong>，否则贡献图会分裂</li>
  <li>如果用 GitHub Private Email（<code>userid+xxx@users.noreply.github.com</code>），要把那个 noreply 地址也加到 verified emails</li>
  <li>贡献图看着少时，<strong>先去 GitHub 账号 settings 核对 verified email</strong>，这是 90% 案例的根因</li>
</ul>

## 参考资料

- [GitHub · 为什么我的贡献没有显示？](https://docs.github.com/zh/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile)
- [GitHub · 管理邮箱设置](https://github.com/settings/emails)
