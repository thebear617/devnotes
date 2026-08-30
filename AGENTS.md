# AGENTS.md

## 项目定位

`devnotes` 是基于 Astro 7 的独立开发知识库与静态网站。内容集合和站点代码全部保存在本仓库，包含知识库、时间线、笔记中心和价格矩阵四个板块。

- 正式内容源：`src/content/`（knowledge / timeline）；集合配置：`src/content.config.ts`
- 补充数据源：`src/data/`（notes.js / pricing.js）
- 构建命令：`npm run build`
- 本地开发：`npm run dev`
- Agent 浏览器验收：`npm run dev:verify -- --port <空闲端口>`
- 本地预览构建结果：`npm run preview`

## 本地 CMS 与浏览器验收

- 日常编辑使用唯一的 `npm run dev` 实例（端口 4323）；本地 CMS 访问 <http://localhost:4323/admin/>，保存会写入真实的 `src/content/`。
- Agent 需要独立打开浏览器验收时，必须使用 `npm run dev:verify -- --port <空闲端口>`，不能再启动第二个普通 `npm run dev`。
- `dev:verify` 会在系统临时目录复制 `src/`，并使用独立的 Astro 根目录、缓存和 `CMS_CONTENT_ROOT`；验收中 CMS 的保存与自动保存只会修改临时副本，不会改动仓库源内容。

## 文件边界

- `src/content/knowledge/`：知识库 Markdown；按 `programming`、`research`、`reflections`、`vibe-coding`、`vibe-working` 子目录归档，以 `kind` 保留旧链接兼容，以 `category` 区分五个一级分类
- `src/content/timeline/`：开发时间线条目
- `src/pages/`：板块路由与详情页
- `src/styles/global.css`：全站样式
- 每次 Git 操作都在 `devnotes/` 内执行；提交使用中文 `type: 描述`

## 长期记忆与约定

进入 devnotes 工作前，先读取跨项目长期记忆入口，了解全局约定与规则：

`/Users/mokaiche/Documents/htmls/.workbuddy/memory/MEMORY.md`

该文件是索引路由，指向 `conventions/` 下所有项目约定文件。devnotes 专属约定位于：

`/Users/mokaiche/Documents/htmls/.workbuddy/memory/conventions/devnotes.md`

包含小红书链接规则、提示词库结构规范、标签体系、提交信息格式等约定。

## 关键约束

- 内容和数据优先修改 `src/` 中的源文件，不直接编辑 `dist/`
- 图片使用站点相对路径，不依赖 jsDelivr CDN
- 修改后至少运行一次 `npm run build`
