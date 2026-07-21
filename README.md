# 开发笔记 · DevNotes

个人开发知识库，用于整理跨产品、跨技术栈和跨语言的使用心得、实践经验、学习内容与价格信息。

当前站点包含五个板块：

- **笔记中心**：开发工具使用心得、经验和排雷记录，支持按产品、技术栈、语言和类型筛选；
- **开发时间线**：记录个人项目、站点与开发工具的版本演进；
- **博客**：使用 Markdown 编写的技术文章与随想；
- **价格矩阵**：AI 编程产品及模型服务的订阅价格对比；
- **操作系统**：按章节组织的操作系统入门内容与交互式案例。

## 技术栈

| 层面 | 选型 |
|------|------|
| 框架 | Astro 5 |
| 内容 | Astro Content Collections + Markdown + JavaScript 数据文件 |
| 样式 | 原生 CSS，石板灰与青绿色主题 |
| 交互 | Astro 页面脚本 + 原生 JavaScript |
| 输出 | 静态 HTML、CSS 和 JavaScript |

项目需要 Node.js 和 npm。构建产物输出到 `dist/`，该目录不提交到 Git。

## 目录结构

```text
devnotes/
├── astro.config.mjs          # Astro 配置、基础路径与首页重定向
├── package.json              # 开发、构建和预览命令
├── src/
│   ├── content/
│   │   ├── config.ts         # 内容集合及 frontmatter 约束
│   │   ├── blog/             # Markdown 博客文章
│   │   └── timeline/         # Markdown 开发时间线条目
│   ├── data/
│   │   ├── notes.js          # 笔记中心数据
│   │   ├── pricing.js        # 价格矩阵数据与来源链接
│   │   └── os.js             # 操作系统学习内容
│   ├── layouts/
│   │   └── Layout.astro      # 全站布局、侧栏与移动端导航
│   ├── pages/
│   │   ├── notes.astro       # 笔记中心
│   │   ├── pricing.astro     # 价格矩阵
│   │   ├── os.astro          # 操作系统学习页
│   │   ├── blog/             # 博客列表与文章详情页
│   │   └── timeline/         # 时间线列表与独立详情页
│   └── styles/
│       └── global.css        # 全站样式
├── scripts/
│   ├── sync-timeline.py      # 检测并同步各仓库的大版本里程碑
│   ├── install-hooks.sh      # 为各站点安装时间线缺口提醒 hook
│   └── git-hooks/post-commit # post-commit hook 模板
└── dist/                     # 构建产物，已被 .gitignore 忽略
```

## 本地开发

首次运行先安装依赖：

```bash
cd devnotes
npm install
```

启动开发服务器：

```bash
npm run dev
```

Astro 默认使用 `http://localhost:4321`。访问根路径后会进入笔记中心。

构建并检查生产版本：

```bash
npm run build
npm run preview
```

## 添加博客文章

在 `src/content/blog/` 中新增 `.md` 文件。文件名会成为文章 URL 的 slug，例如：

```text
src/content/blog/开发产品形态与技术栈.md
→ /blog/开发产品形态与技术栈/
```

每篇文章必须包含以下 frontmatter：

```yaml
---
title: 文章标题
date: '2026-07-20'
tags: [开发, Astro]
description: 用于博客列表的简短摘要
---
```

正文使用标准 Markdown，可以直接插入标题、列表、代码块、引用、链接和表格。博客列表按 `date` 从新到旧排列。

## 更新笔记中心

编辑 `src/data/notes.js`，向 `notes` 数组添加对象：

```js
{
  id: 'unique-id',
  product: 'Qoder',
  stacks: ['前端', '全栈'],
  langs: ['TypeScript'],
  type: '心得',
  title: '标题',
  date: '2026-07-20',
  body: '<p>笔记正文支持 HTML</p>',
  links: [
    { title: '官网', url: 'https://example.com' }
  ]
}
```

其中 `product`、`stacks`、`langs` 和 `type` 会自动生成筛选项。`id` 必须唯一。

## 更新开发时间线

时间线的唯一数据源是 `src/content/timeline/*.md`。每条记录一个 Markdown 文件，frontmatter 包含 `title`、`date`、`tags`、`site` 和 `slug`，正文用于详情页。

检测各站点尚未记录的大版本：

```bash
python3 scripts/sync-timeline.py --status
python3 scripts/sync-timeline.py --json
```

预览或写入缺失条目：

```bash
python3 scripts/sync-timeline.py --dry-run
python3 scripts/sync-timeline.py
```

脚本按 `(major, minor)` 识别大版本；同一大版本中的 patch 更新不会重复生成条目。写入后运行 `npm run build` 检查内容集合和详情路由。

为 `home`、`personal`、`devnotes`、`reanotes`、`lifenotes` 和 `cats` 安装提交后的缺口提醒：

```bash
./scripts/install-hooks.sh
```

hook 只提示缺口，不自动修改、提交或推送仓库。

## 更新价格矩阵

编辑 `src/data/pricing.js`：

1. 在 `pricings` 中更新或添加套餐；
2. 在 `pricingLinks` 中维护产品官网或价格页；
3. 同步更新 `pricingMeta.updatedAt` 和核对说明；
4. 运行 `npm run build`，确认数据和页面能够正常生成。

价格采用手动维护并标注核对日期的方式。公开页面只用于辅助比较，最终价格以产品官网为准。

## 更新操作系统学习页

内容位于 `src/data/os.js`。页面由章节、内容组和卡片组成：

- 基础知识卡片主要使用 `markdown` 字段；
- 复杂布局使用 `body` HTML；
- 页面结构和交互逻辑位于 `src/pages/os.astro`。

## 基础路径与部署

`astro.config.mjs` 通过 `SITE_BASE` 控制站点基础路径。部署到域名根路径时直接构建：

```bash
npm run build
```

部署到 GitHub Pages 的仓库子路径时，构建命令示例为：

```bash
SITE_BASE=/devnotes/ npm run build
```

构建完成后，将 `dist/` 发布到静态托管服务。当前仓库没有内置 `.github/workflows` 部署流程；如需在 `main` 分支更新后自动发布，需要另外配置 GitHub Pages Actions 工作流。

## 约定

- 内容和数据优先修改 `src/` 中的源文件，不直接编辑 `dist/`；
- 图片使用站点相对路径，不依赖 jsDelivr CDN；
- 修改后至少运行一次 `npm run build`；
- Git 操作只在 `devnotes/` 内执行；
- 提交信息使用中文 `type: 描述`，例如 `feat`、`fix`、`chore`、`style`。
