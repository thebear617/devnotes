---
title: '新建 Agent Skill：wx-article-note（微信文章解析）'
date: '2026-08-02'
tags: [skill, 工具]
site: skill
slug: 'skill-wx-article-note'
---

新增全局 Agent Skill `~/.claude/skills/wx-article-note/`，把微信公众号文章（`mp.weixin.qq.com/s/...` 链接）解析成结构化笔记：抓 HTML → 判断文章类型 → 提取正文或下载全部图片 → 交给 MiniMax 视觉工具读取，无需登录。

## 背景

此前没有微信文章的统一解析链路。第一次遇到时按 `og:image` / 封面 `cdn_url` 判断，误以为文章"只有一张图"，实际漏掉了 7 张正文图——微信的「图片分享页」（`item_show_type=8`）正文是一组轮播图，内嵌在 JS 数组 `window.picture_page_info_list` 里，不在 HTML 正文，`og:image` 只是封面。这个教训被固化进 skill，避免以后再犯。

## 适用的模态类型

- **文本模态**（普通图文 `item_show_type=0`）：正文是 `js_content` 里的 HTML 文本，直接提取 `body_text`
- **图片模态**（图片分享页 `item_show_type=8`）：正文是图片轮播，逐张下载后用视觉工具 OCR

## 内容类型

- 普通图文：正文文字 + 正文内插图 URL 列表（`body_images`）
- 图片分享页：全部正文图（`images[]`，含宽高与本地文件路径）
- 元数据：标题、公众号、作者、发布时间、来源链接

## 实现

- 脚本 `scripts/wx_article_note.py`：一条命令完成抓取、类型判断、元数据提取、图片下载
  - 类型判断靠 `window.real_item_show_type`（`'8'` = 图片分享页）
  - 图片分享页解析 `window.picture_page_info_list` 数组的**所有** `cdn_url`，而非只取封面
  - 普通图文提取 `js_content` 正文文本与 `<img data-src>` 插图
  - 带 iPhone UA + Referer 抗反爬；输出 `meta.json` / `content.html` / `img-NN.png`
- `SKILL.md`：触发条件、两种形态的判断方法、OCR 步骤、常见坑

## 关键坑（已写入 SKILL.md）

- **只信 og:image 会漏图**：图片分享页必须解析 `picture_page_info_list` 数组并下载所有图
- 中文乱码：只解 HTML 实体（`\x26amp;` 等），**不要**对全文跑 `unicode_escape`
- publish_time 正则需用负向断言 `(?<!ori_)` 排除 `ori_create_time` 的 epoch 值

## 验证

两个实测案例：哲就是AI《AI Agent运行全流程，一张图搞明白！》（7 张 1080x1440 图片分享页，全部正确下载）、IT服务圈儿《Windows被晾了十年，现在重新上位！》（普通图文，正文 2618 字符 + 10 张正文插图）。与 `xhs-image-note`、`bili-audio-transcribe` 同一命名与思路体系。
