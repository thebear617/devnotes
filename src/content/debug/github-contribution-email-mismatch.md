---
title: "GitHub：贡献图 - 邮箱不匹配的排查与修复"
date: "2026-07-17"
updated: "2026-07-17"
slug: "github-contribution-email-mismatch"
category: "系统与平台"
subcategory: "计算机网络"
description: "GitHub 贡献图不统计提交时，应检查本地 author email 是否属于账号的 verified emails。"
---
我做了很多 commit，但贡献图始终只显示可怜的 66 contributions。排查了一个下午才挖到根因——记录下来避免再踩。

## ① 现象

GitHub 个人主页的贡献图（Contribution Graph）只显示 66 个绿格子，但本地明明有几百个 commit 推送到了 GitHub。

以为是「最近几天的推送没记上」，但实际上是**所有 commit 从来就没被记过**。

## ② 根因

GitHub 计算贡献图的规则：commit 的 `author email` 必须出现在你 GitHub 账号的 **verified emails 列表**里，否则这次提交会被 GitHub 当成「无主」，完全不计入贡献图。

我的情况：

- **本地 commit**：所有 6 个仓库的 author email 都是 `1357953389@icloud.com`（git config user.email 设置的）
- **GitHub 账号** `thebear617` 绑定的 verified email 是 `1357953389@qq.com` 和 `3474153902@qq.com`
- **icloud 那个邮箱从未添加过**，所以 GitHub 认为「这些 commit 不属于 thebear617」

所以不是 GitHub 抽风，是**邮箱不匹配**。

## ③ 排查步骤（推荐路径）

1.  打开 <https://github.com/settings/emails>，看你 GitHub 账号所有 verified email
2.  在每个仓库跑 `git log -5 --pretty=format:"%ae"`，看你 commit 实际用的 author email
3.  对比两份列表，找出**差异**——差的就是「失踪」的 commit 来源

另两个常见坑（这次都不是，但顺带记下）：

- **"Include private contributions" 没勾选**：私有仓库 commit 默认不显示，需要去 [profile settings](https://github.com/settings/profile) 勾选
- **committer 和 author 是不同邮箱**：merge commit / 协作 commit 容易出现，看 `git log --pretty=fuller` 区分

## ④ 修复方案

两种思路任选：

### 方案 A：添加 icloud 邮箱到 GitHub（最简单）

在 [Email settings](https://github.com/settings/emails) 点 "Add email address" → 填 icloud 邮箱 → 去邮箱点确认链接。

**GitHub 会自动追溯**所有用这个邮箱的 commit，5–10 分钟贡献图就会填满。无需 force-push。

### 方案 B：改写历史把所有 commit 改成已验证邮箱（彻底但重）

如果你不再想用 icloud 邮箱（像我一样），那就反过来改 commit：

1.  备份每个仓库：`git bundle create backup.bundle --all`

2.  改 `git config user.email "1357953389@qq.com"`（每个仓库 + 全局都改）

3.  改写历史：

        git filter-branch -f --env-filter '
        if [ "$GIT_AUTHOR_EMAIL" = "1357953389@icloud.com" ]; then
            export GIT_AUTHOR_EMAIL="1357953389@qq.com"
        fi
        if [ "$GIT_COMMITTER_EMAIL" = "1357953389@icloud.com" ]; then
            export GIT_COMMITTER_EMAIL="1357953389@qq.com"
        fi
        ' --tag-name-filter cat -- --branches --tags

4.  清理 + gc：`git for-each-ref --format='%(refname)' refs/original/ | xargs -n 1 git update-ref -d && git reflog expire --expire=now --all && git gc --prune=now --aggressive`

5.  force-push：`git push --force-with-lease origin main`

**注意：**

- 所有 commit hash 会**全部变化**，任何引用旧 hash 的 PR / issue / 文档会失效
- filter-branch 在脏仓库（未提交改动）上会拒绝——必须先 commit 或 stash
- 推荐 `--force-with-lease` 而非 `--force`：若远程被别人推过会自动拒绝，避免覆盖
- 有 `git-filter-repo` 装的话优先用它（比 filter-branch 快 10x+ 且无 gotchas），没装的话 filter-branch 也够用

## ⑤ 经验教训

- 设 git config 时**用一个你长期持有 + 愿意绑 GitHub 的邮箱**，别用临时邮箱或将来可能弃用的
- 多仓库项目（我 6 个）一定要用**同一个 email**，否则贡献图会分裂
- 如果用 GitHub Private Email（`userid+xxx@users.noreply.github.com`），要把那个 noreply 地址也加到 verified emails
- 贡献图看着少时，**先去 GitHub 账号 settings 核对 verified email**，这是 90% 案例的根因

## 参考资料

- [GitHub · 为什么我的贡献没有显示？](https://docs.github.com/zh/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile)
- [GitHub · 管理邮箱设置](https://github.com/settings/emails)
