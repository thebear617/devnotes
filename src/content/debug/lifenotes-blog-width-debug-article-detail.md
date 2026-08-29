---
title: "LifeNotes：博客详情页 - 宽度收缩"
date: "2026-08-14"
updated: "2026-08-14"
slug: "lifenotes-article-detail-width"
category: "站点与应用"
subcategory: "UI/UX"
description: "LifeNotes 短文章详情页因 Grid 子项按内容收缩而变窄，需要为正文容器补充 width: 100%。"
---
## ① 现象

内容很少的博客详情页（例如《旅游：全国美食资源合集》）出现整体正文和标题区域按内容收缩的现象：横线与链接区域只有约 `476px`，博客宽度看起来像是由内容决定的。第一次只把 `article-page-shell` 从 `1080px` 调到 `1120px`，问题仍未解决。

## ② 排查

详情页结构为：

    app-shell → article-page-shell → article-detail-layout → article-detail

- 无目录文章没有 `has-toc`。
- 相关布局使用 Grid。
- `article-detail` 有 `max-width: 820px` 和 `margin: 0 auto`，但没有明确指定 `width`。

## ③ 根因

`article-detail` 是 Grid item。在同时设置 `max-width` 与自动外边距、但没有指定 `width` 的情况下，它会发生自动尺寸计算，按内容收缩。外层 shell 宽度不是根因；调到 `1120px` 只解决了大屏下的容纳空间问题，不能阻止 Grid item 按内容变窄。

## ④ 解决方案

为无目录的 `.article-detail` 增加 `width: 100%`，同时保留 `max-width: 820px` 和 `margin: 0 auto`。`article-page-shell` 保持 `1120px`，TOC 规则和移动端规则保持不变。

    .article-detail {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
    }

修改后执行 `npm run build`，成功构建 53 个页面。

## ⑤ 验收清单

- 打开《旅游：全国美食资源合集》等短内容详情页，正文和标题区域不再按内容收缩。
- 横线、链接区域随详情内容区正常铺开，宽度不再只有约 `476px`。
- 含 TOC 的文章目录布局不受影响。
- 移动端规则仍按原有断点生效。
- `npm run build` 成功，输出 53 个页面。
