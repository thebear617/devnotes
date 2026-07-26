# AGENTS.md

## 项目定位

`devnotes` 是基于 Astro 5 的独立开发知识库与静态网站。内容集合和站点代码全部保存在本仓库，包含博客、提示词库、时间线、笔记中心和价格矩阵五个板块。

- 正式内容源：`src/content/`（blog / prompts / timeline）
- 补充数据源：`src/data/`（notes.js / pricing.js）
- 构建命令：`npm run build`
- 本地开发：`npm run dev`
- 本地预览构建结果：`npm run preview`

## 文件边界

- `src/content/prompts/`：提示词库 Markdown，按统一框架组织
- `src/content/blog/`：博客文章
- `src/content/timeline/`：开发时间线条目
- `src/pages/`：板块路由与详情页
- `src/styles/global.css`：全站样式
- 每次 Git 操作都在 `devnotes/` 内执行；提交使用中文 `type: 描述`

## 约定规则

修改 devnotes 内容前，先读取 devnotes 专属约定：

`/Users/mokaiche/Documents/htmls/.workbuddy/memory/conventions/devnotes.md`

该文件包含小红书链接规则、提示词库结构规范、标签体系等约定。

## 关键约束

- 内容和数据优先修改 `src/` 中的源文件，不直接编辑 `dist/`
- 图片使用站点相对路径，不依赖 jsDelivr CDN
- 修改后至少运行一次 `npm run build`
