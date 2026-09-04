# 开发笔记 · DevNotes

个人开发知识库，用于整理跨产品、跨技术栈和跨语言的使用心得、实践经验、学习内容与价格信息。

当前站点包含五个板块：

- **开发时间线**：记录个人项目、站点与开发工具的版本演进；
- **Debug 库**：开发调试、问题排查与工具经验，支持按一级、二级分类筛选和关键词搜索；
- **知识库**：统一收录开发与实践、科研和个人随笔；按一级领域与二级内容角色筛选，并支持关键词搜索；
- **价格矩阵**：AI 编程产品及模型服务的订阅价格对比。

## 技术栈

| 层面 | 选型 |
|------|------|
| 框架 | Astro 7 |
| 内容 | Astro Content Layer + Markdown + JavaScript 数据文件 |
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
│   ├── content.config.ts      # Content Layer 内容集合及 frontmatter 约束
│   ├── content/
│   │   ├── knowledge/        # Markdown 知识库，按一级领域与二级内容角色组织
│   │   ├── timeline/         # Markdown 开发时间线条目
│   │   └── debug/            # Markdown Debug 库条目
│   ├── data/
│   │   └── pricing.js        # 价格矩阵数据与来源链接
│   ├── layouts/
│   │   └── Layout.astro      # 全站布局、侧栏与移动端导航
│   ├── pages/
│   │   ├── notes.astro       # Debug 库
│   │   ├── pricing.astro     # 价格矩阵
│   │   ├── knowledge/        # 知识库列表与详情页
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

日常开发服务器固定为 `http://localhost:4323`；CMS 位于 <http://localhost:4323/admin/>，访问根路径后会进入 Debug 库。同一仓库只保留一个普通 `npm run dev` 实例。

Agent 需要浏览器验收时，另开空闲端口运行：

```bash
npm run dev:verify -- --port 4401
```

该命令会把 `src/` 复制到系统临时目录，并使用独立的 Astro 缓存；验收中 CMS 的保存和自动保存只写入该副本，不会改动真实 `src/content/`。不要为了验收启动第二个普通 `npm run dev`。

构建并检查生产版本：

```bash
npm run build
npm run preview
```

## 添加知识条目

在 `src/content/knowledge/` 对应的一级、二级目录中新增 `.md` 文件。一级领域与二级分类如下，二级会随一级联动（如选「实践」时才可匹配到具体模态）：

```text
# 开发：知识、理论、工具与环境
development/fundamentals/    # 基础知识
development/overviews/       # 综述
development/resources/       # 学习资源
development/configurations/  # 配置记录
development/tools/           # 工具使用心得
# 实践：按产出模态归类
practice/ppt/                # PPT
practice/web/                # 网页
practice/chart/              # 图表
practice/video/              # 视频
practice/report/             # 报告
# 科研
research/overviews/          # 综述
# 随想
reflections/essays/          # 随笔
reflections/moments/         # 时刻
```

文件名使用便于本地阅读的中文名称（`标题：主题`），slug 统一使用英文 kebab-case，例如：

```text
src/content/knowledge/development/overviews/综述：传统全栈开发.md
→ /knowledge/traditional-full-stack-development-overview/
```

每篇文章必须包含以下 frontmatter：

```yaml
---
title: 文章标题
date: '2026-07-20'
category: 开发 # 开发 | 实践 | 科研 | 随想
subcategory: 基础知识 # 视 category 联动：开发(基础知识/综述/学习资源/配置记录/工具使用心得)；实践(PPT/网页/图表/视频/报告)；科研(综述)；随想(随笔/时刻)
description: 用于知识库列表的简短摘要
slug: traditional-full-stack-development # 必填；用于生成知识库详情页 URL
---
```

正文使用标准 Markdown，可以直接插入标题、列表、代码块、引用、链接和表格。知识库列表按 `updated`（若有）或 `date` 从新到旧排列，`updated` 支持 `YYYY-MM-DD HH:mm` 分钟级格式，本地 CMS 保存时自动写入。

知识库标题统一使用 `内容类型：主题对象 - 具体内容` 格式，内容类型前缀应与 `subcategory` 对应：开发下的基础/综述/资源等直接写“类型：主题”，实践按模态写，例如 `基础知识：计算机网络`、`综述：世界模型`、`配置记录：OpenCode 模型路由`、`工具使用心得：Agentic IDE`、`PPT：传统方法制作`、`网页：纯前端开发`、`图表：专业制作`、`视频：调研转`、`报告：文献调研数据分类`；需要区分对象与主题时在主题后用短破折号。

`category` 表示一级领域（`开发`、`实践`、`科研`、`随想`），`subcategory` 表示二级分类（开发=角色，实践=产出模态）；两者都是必填枚举，并与文件所在目录保持一致，二级必须属于对应的一级。

旧的 `/blog/` 与 `/prompts/` 列表入口会跳转到 `/knowledge/`。既有详情地址通过 frontmatter 中的显式 `slug` 和 `src/data/legacy-knowledge-routes.js` 中的兼容映射继续访问，不依赖知识条目的额外类型字段。

实践类（典型案例）建议正文按 `# 案例集合`、案例步骤与 `# 参考资料` 结构组织，来源链接放在参考资料一节。

## 更新 Debug 库

在 `src/content/debug/` 下新增一个 Markdown 文件，每条 Debug 记录对应一个文件：

```text
src/content/debug/unique-id.md
```

文件 frontmatter 使用以下字段：

```yaml
---
title: 对象：模块 - 问题
date: '2026-07-20'
updated: '2026-07-20 09:30'
category: 开发工具
subcategory: Agent
description: 用于 Debug 库列表的简短摘要
slug: qoder-agent-debug
---

正文使用标准 Markdown；参考资料直接写在正文末尾，不再单独维护 `links` 字段。
```

Debug 标题统一使用 `对象：模块 - 问题` 格式：对象填写站点或应用名称，模块填写具体功能或子系统，最后用短破折号补充问题或记录主题。例如：`猪窝：美食地图 - 区域列表分页显示异常`、`MiniMax：MCP - SDK 版本不兼容`。文件名保持便于本地阅读，`slug` 使用英文 kebab-case，并作为详情页 URL 标识。

Debug 库只使用两级分类：`category` 是一级领域，`subcategory` 是对应的二级主题。标题负责表达对象、模块和问题，正文负责记录具体技术细节；不再额外维护对象、记录类型和技术栈字段。`slug` 用于详情页路由，`updated` 省略时会自动与 `date` 保持一致。`date` 使用 `YYYY-MM-DD`，`updated` 支持 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm`（本地时间，分钟级）；本地 CMS 保存时自动写入分钟级 `updated`，Debug 库、知识库与时间线列表均按 `updated` 从新到旧精确到分钟排列。

当前一级分类包括 `站点与应用`、`开发工具` 和 `系统与平台`。二级分类分别为：`站点与应用` 下的 `UI/UX`、`内容数据`、`构建部署`、`架构渲染`；`开发工具` 下的 `Agent`、`环境依赖`、`架构框架`；`系统与平台` 下的 `操作系统`、`计算机网络`。二级分类必须属于对应的一级分类，具体受 `src/content.config.ts` 中的 schema 校验。

## 更新开发时间线

时间线的唯一数据源是 `src/content/timeline/*.md`。每条记录一个 Markdown 文件，frontmatter 使用 `title`、`date`、`updated`、`category`、`subcategory` 和 `description` 字段，正文用于详情页。其中 `updated` 和 `description` 可以按需省略；`updated` 省略时，初始值会自动与 `date` 保持一致。时间线详情地址直接由 Markdown 文件名生成。

时间线标题统一使用 `对象 [版本]：模块 - 变更主题` 格式。版本型站点示例为 `猪窝 v1.10.0：美食地图 - 区域视图收尾`；工具或 Skill 没有版本时省略版本，例如 `Breaks：菜单栏番茄钟 - 热力图与离开检测`。版本号只出现一次，标题不再用“安装”“新建”“了解”等动作词作为统一前缀；已有文件名、slug 和详情地址保持不变。

时间线筛选使用两级分类：`category` 对应原来的一级“站点”枚举，`subcategory` 对应原来的二级分类枚举，两个字段都必填；`subcategory` 至少选择一项，受控值包括功能、内容、视觉、架构和修复。当前 `category` 只允许开发笔记、常识笔记、游戏笔记、熊窝、猪窝、猫猫、科研笔记、聊天站、工具和 skill。

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

## 同步 AI 模型数据

模型排行榜数据位于 `src/data/models.js`，同步脚本位于 `scripts/sync-models.mjs`。参数量优先读取 DataLearner API，价格、上下文和能力字段由 OpenRouter 补充；默认不请求 Hugging Face，避免单个模型修正被网络超时拖慢。

只修正指定模型：

```bash
node scripts/sync-models.mjs --only=moonshotai/kimi-k3
```

需要补充 Hugging Face 参数量时显式开启：

```bash
node scripts/sync-models.mjs --huggingface
```

`--include-provider=minimax` 可将 OpenRouter 中本地尚未收录的 MiniMax 模型加入排行榜；`--openrouter-file=/path/to/models.json` 可使用已下载的 API 快照；`--datalearner-file=/path/to/models.json` 可使用 DataLearner API 快照；`--skip-datalearner` 可临时关闭 DataLearner 数据源。

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
- 提交信息使用中文 `type: 描述`，例如 `feat`、`fix`、`chore`、`style`；
- 小红书链接始终保留完整长链（含所有 query 参数），禁止截短为 `/explore/:id` 短链。
