---
title: "GitHub：贡献图 - 邮箱改写记录"
date: "2026-07-17"
updated: "2026-07-17"
slug: "github-contribution-email-rewrite"
category: "系统与平台"
subcategory: "计算机网络"
description: "GitHub 贡献图因提交邮箱不匹配而漏记时，通过改写历史提交邮箱并同步 Git 配置恢复贡献统计。"
---
GitHub 贡献图一直只显示 66 contributions。诊断发现：6 个仓库的 author email 一直是 `1357953389@icloud.com`，但 GitHub 账号 `thebear617` 绑定的 verified email 是 `@qq.com`——所有 commit 都因为 email 不匹配被「无主」处理，从未算进贡献图。

## 决策

- 不再绑 icloud 邮箱（已不常用），而是把所有历史 commit 的 author email 改成 `@qq.com`
- 同时改 `git config user.email`，让未来 commit 也用 `@qq.com`
- 一并改写历史需要 force-push，因为 6 个仓库都是个人维护的站，可控

## 执行步骤

1.  三个仓库（home / devnotes / lifenotes）有未提交改动，先 `chore: 备份前提交未完成改动` commit
2.  6 个仓库全部 `git bundle create` 备份到 `$TMPDIR`（41M）
3.  每个仓库的 `.git/config` 追加 `[user] email = 1357953389@qq.com`
4.  每个仓库跑 `git filter-branch --env-filter` 改写 author/committer email
    - 共改写 351 个 commit：cats 72、home 122、personal 81、devnotes 8、lifenotes 15、reanotes 53
    - `home` 还连带改写了 3 个 tag（v1.0-pre-markdown / v1.1.0 / v1.2.0）
5.  删除 `refs/original/` 备份 refs，`git reflog expire --expire=now --all && git gc --prune=now --aggressive`
6.  6 个仓库 `git push --force-with-lease origin main` 全部成功

## 关键技术点

- `filter-branch` 在脏仓库上会拒绝，必须先 commit 或 stash；选 commit 因为 stash pop 有冲突风险
- `--force-with-lease` 比 `--force` 安全：远程若被别人推过会被拒绝
- email 改写会让**所有 commit hash 全部变化**，旧 hash 引用的 PR / issue / 外部文档会失效
- 系统已装了 `git-filter-repo` 的替代品缺失，但 `filter-branch` 对 351 个 commit 总量只要约 20 秒，可用

## 修复后预期

- GitHub 会在 5–10 分钟内重新计算贡献图
- 过去所有 commit 都会被算进 `thebear617` 的 `@qq.com` 身份下
