---
title: "随笔：草稿箱和todolist"
date: "2026-09-04"
updated: "2026-09-04 23:05"
category: "随想"
subcategory: "随笔"
description: "内容中转和草稿，暂存处｜所有 idea、未开始的设计思路的存放、所有要中转的东西"
slug: "Drafts"
---

## 草稿箱

## 前端开发串讲（以 Astro 框架为例）
[^文件树]如下

[^文件树]:
  devnotes/ 的目录按"七层"重新归类，同一层的内容放一起看：
  ```
  devnotes/                                  ← 项目根目录（独立 git 仓库）
  │
  ├─ 【第一层 · 内容】你写的东西
  │   ├─ src/content/config.ts               # 内容集合"体检表"：规定每篇必须有 title/date/category
  │   ├─ src/content/knowledge/              # 知识库文章（Markdown 源）
  │   ├─ src/content/timeline/               # 开发时间线条目（Markdown 源）
  │   └─ src/data/                           # 结构化 JS 数据（表格/清单类内容，不走 Markdown 管线）
  │
  ├─ 【第二层 · 翻译管线】Markdown → HTML 的定制翻译官
  │   └─ src/plugins/                        # 自写插件 + npm 包，都在 astro.config.mjs 里注册
  │       ├─ remark-footnote-indent.mjs      # 脚注缩进
  │       ├─ rehype-mark.mjs                 # 高亮标记
  │       ├─ rehype-popover.mjs              # 悬浮框（把标准脚注改造成悬浮框零件）
  │       ├─ rehype-table-wrap.mjs           # 表格包裹（移动端滚动）
  │       └─ + npm 包：remark-math、rehype-katex
  │
  ├─ 【第三层 · 组件与模板】Astro 定下的规矩
  │   ├─ src/layouts/Layout.astro            # 全站唯一骨架：<html>、侧边栏、导航、顶部按钮
  │   ├─ src/components/KnowledgeDetail.astro# 文章详情组件：正文 + 侧边 TOC + 滚动高亮
  │   └─ src/pages/                          # 路由：一个文件 = 一类 URL
  │       ├─ index.astro                     # / 首页
  │       ├─ notes.astro / pricing.astro     # /notes/ 笔记中心、/pricing/ AI 排行榜
  │       ├─ knowledge/index.astro           # /knowledge/ 列表页
  │       ├─ knowledge/[slug].astro          # /knowledge/xxx/ 单篇（[slug] = 通配符，一文件生成所有文章页）
  │       └─ timeline/index.astro + [slug].astro
  │
  ├─ 【第四层 · 框架】Astro 本身
  │   ├─ package.json                        # 声明依赖 astro@^5，npm run build 通过它调起框架
  │   ├─ astro.config.mjs                    # 总开关：base 路径、Markdown 插件注册
  │   ├─ tsconfig.json                       # TypeScript 语法检查规则
  │   └─ node_modules/                       # Astro 本体代码，npm install 装进来
  │
  ├─ 【第五层 · 产物】构建结果，纯 HTML/CSS/JS
  │   ├─ src/styles/global.css               # CSS 源头（构建时打进 dist/_astro/*.css）
  │   ├─ public/images/                      # 静态资源，原样拷进 dist/，不经过构建
  │   └─ dist/                               # npm run build 生成的"真正的网站"
  │       ├─ index.html                      # 首页
  │       ├─ knowledge/xxx/index.html        # 每篇文章一个文件夹（目录 = URL）
  │       └─ _astro/                         # 打包压缩后的 *.css 和 *.js（带哈希）
  │
  ├─ 【第六层 · 服务器】部署
  │   └─ .github/workflows/deploy.yml        # push 到 main 后自动构建并发布到 GitHub Pages
  │
  └─ 【杂项】不参与渲染链
      ├─ README.md / AGENTS.md / .gitignore  # 说明文档 + git 忽略规则
      ├─ scripts/                            # 本地辅助脚本（同步时间线、git 钩子等）
      └─ .vscode/  .claude/  .astro/         # 编辑器配置 + 构建缓存（自动生成）
  ```


第一层是内容[^Markdown、MDX和数据]；第二层是[^remark/rehype插件]，负责把底层内容翻译成浏览器可渲染的 HTML——举个很经典的例子：remark 把 Markdown 里的 `[^]` 脚注语法翻译成标准脚注 HTML，rehype-popover 再把标准脚注改造成"悬浮框的零件"（触发器按钮 + 内容模板）⚠️——也就是你正在看的这个悬浮框本身⚠️。再往上一层是第三层的[^组件与模板]，翻译好的 HTML 在这里套进页面骨架——这些写法并非自创，而是 Astro 定下的规矩，长成最终的样子。而这套规矩本身，就是第四层的[^Astro框架]——它定义并执行了从第一层到第三层的全部规范。而这些规范执行完毕后，`npm run build` 的终点是第五层的[^dist产物]——整个流水线最终沉淀为纯 HTML、CSS、JS，也就是浏览器唯一能消化的形态。第六层是服务器——`dist/` 产物被[^GitHub-Pages部署]推到线上，其他人才能访问。最后一层是[^浏览器]——用户访问站点时，它向服务器请求页面，解析 HTML、加载 CSS、执行 JS，把内容最终画出来。




[^Markdown、MDX和数据]:
  1. **Markdown（.md）**：写文章的标准格式，对应路径 `src/content/knowledge/`（知识库文章）、`src/content/timeline/`（时间线条目）和 `src/content/debug/`（Debug 条目）。头部写 frontmatter（标题/日期/分类），字段由 `src/content.config.ts` 统一校验
  2. **MDX（.mdx）**：Markdown + JSX 的合体，允许在文章里直接嵌入组件（图表、Demo 等）。本仓库暂未启用，需要引入 `@astrojs/mdx` 才支持
  3. **数据（.js）**：仍有少量结构化内容源，位于 `src/data/`（例如 `pricing.js`）。不走 Markdown 管线，由页面直接 import 渲染，适合"表格/清单"这类内容

[^remark/rehype插件]:
  1. **remark 侧**（Markdown → 中间结构）：把 `[^]` 脚注语法翻译成标准脚注 HTML——正文里是 `<sup>` 引用点，文末是 `<section>` 定义区。对应自写插件 `src/plugins/remark-footnote-indent.mjs`，加上 npm 包 `remark-math`
  2. **rehype 侧**（中间结构 → HTML）：`rehype-popover` 把标准脚注改造成悬浮框零件（触发器 `<button>` + 内容 `<template>`），由页面 JS 通电后悬浮弹出。对应自写插件 `src/plugins/rehype-popover.mjs`、`rehype-mark.mjs`、`rehype-table-wrap.mjs`，加上 npm 包 `rehype-katex`
  3. **排班表**：以上插件都要在 `astro.config.mjs` 的 `markdown.remarkPlugins / rehypePlugins` 里注册，构建时按顺序执行——写进配置文件，才真正生效

[^组件与模板]:
  Astro 定下的规矩-整体布局、组件及路由，包括：
  1. **布局**：`src/layouts/Layout.astro`——全站唯一的骨架（`<html>`、侧边栏、导航、顶部按钮），所有页面共用这一个壳
  2. **组件**：`src/components/KnowledgeDetail.astro`——文章详情组件：渲染正文、生成侧边 TOC、提供滚动高亮的 JS
  3. **路由**：`src/pages/`——一个文件对应一类 URL。`knowledge/[slug].astro` 里 `[slug]` 是通配符，一个文件就能生成所有文章的页面

[^Astro框架]:
  打个比方：第三层的组件是"剧本"（个人开发者写的），这一层的 Astro 是"导演"（开源的工具，别人写的）——剧本要按导演的规矩写，改剧本不用动导演，但换导演往往意味着剧本要大改。它在本仓库中的实体：
  1. `package.json`：声明依赖 `astro@^5`，`npm run build` 通过它调起框架
  2. `astro.config.mjs`：总开关——插件注册、base 路径、旧链接重定向
  3. `node_modules/`：Astro 本体代码，`npm install` 装进来，构建时真正跑的就是它


[^dist产物]:
  `npm run build` 构建出的产物目录 `dist/` 里只有三类文件：
  1. **HTML**：页面结构与内容，对应 `dist/**/index.html`——首页是 `dist/index.html`，每篇文章一个文件夹（如 `dist/knowledge/xxx/index.html`），目录长什么样、线上 URL 就长什么样
  2. **CSS**：页面样式，对应 `dist/_astro/*.css`——由 `src/styles/global.css` 压缩打包而来，文件名带哈希用于缓存更新
  3. **JS**：页面交互，对应 `dist/_astro/*.js`——由组件里的 `<script>` 代码（如 KnowledgeDetail 的滚动高亮）提取打包而来

[^GitHub-Pages部署]:
  对应文件 `.github/workflows/deploy.yml`——GitHub Actions 的自动化流程，push 到 main 分支时自动执行：
  1. **构建**：`npm ci` 安装依赖 → `npm run build` 生成 `dist/`（注意这里带上了 `SITE_BASE=/devnotes/` 环境变量，也就是线上挂载的子路径）
  2. **上传**：把 `dist/` 作为构建产物上传（`actions/upload-pages-artifact`）
  3. **发布**：部署到 GitHub Pages（`actions/deploy-pages`），发布完成后站点通过 `https://<用户名>.github.io/devnotes/` 访问

[^浏览器]:
  浏览器是唯一不在仓库里的"层"——它没有对应文件，是每个用户电脑上自带的程序。它分三步工作：
  1. **请求**：向服务器发起请求，拿到 `index.html`
  2. **解析**：按 HTML 里的引用去加载 CSS（`dist/_astro/*.css`）、执行 JS（`dist/_astro/*.js`）——这里执行的 JS，正是第三层组件里写的那段 `<script>`（比如 KnowledgeDetail 的滚动高亮）
  3. **呈现**：把结构 + 样式 + 交互合成最终画面，显示在屏幕上





# 相关知识


整体上，这些概念可以这样串起来理解：**你写 Markdown/MDX 内容 → 框架按"内容集合"的规则组织 → 构建时输出成静态 HTML（或视需要走 SSR）→ 部署到线上 → 页面用组件化方式搭建、加一些动画 → 最后靠良好的 SEO 让人搜得到**。



## 一、语言层

- JavaScript / TypeScript:绝大多数现代博客框架的底层语言(Hexo、Next.js、Astro、VitePress 都是)
- Go:Hugo,编译型语言,构建速度是它的核心卖点
- Ruby:Jekyll,历史悠久,GitHub Pages 原生支持
- HTML/CSS:无论选什么框架,最终产出的都是这三样,自己纯手撸本质就是直接写这三样 + 用 JS 加交互

## 二、框架层（个人博客）

**静态站点生成器（SSG）—— 主流选择**
- **Hugo** — Go 语言写的，编译速度极快，适合内容多的博客，主题生态成熟
- **Hexo** — Node.js，中文社区用得很多，插件和主题丰富，配置简单
- **VitePress** — Vue 官方出品，基于 Vite，速度快，也常用来做文档站
- **VuePress** — VitePress 的前身，同样是 Vue 生态，功能更成熟但速度不如 VitePress
- **Jekyll** — Ruby 写的，GitHub Pages 原生支持，历史最悠久之一
- **Astro** — 近两年很火，"零 JS 默认"理念，性能极佳，支持多框架混用
- **Docusaurus** — Meta 出的，React 生态，偏文档站但也能做博客

**全栈框架（更灵活，也更重）**
- **Next.js** — React 生态，SSG/SSR 都支持，适合想要更多自定义交互的博客
- **Nuxt.js** — Vue 版的 Next.js

**自己纯手撸**
- 直接用 React/Vue + 打包工具（Vite/Webpack）从零搭，完全自己控制路由、内容渲染逻辑（比如自己写 Markdown 解析、自己设计数据结构）。灵活度最高，但要自己造很多轮子（RSS、SEO、图片优化等）。

## 三、内容层

**Markdown**

一种轻量级标记语法，用 `# 标题`、`**加粗**`、`- 列表` 这类简单符号写文本，框架会自动把它转成 HTML。写博客文章的标准格式，几乎所有博客框架都支持。

**MDX**

"Markdown + JSX" 的缩写。让你在 Markdown 文件里直接嵌入 React 组件，比如：
```markdown
# 我的文章

这是普通文字，下面插入一个交互图表：

<InteractiveChart data={...} />

继续写文字...
```
适合需要在文章里插入自定义组件（图表、代码演示、Demo）的场景。Next.js、Astro、Docusaurus 都原生支持。

**内容集合（Content Collections）**

Astro 提出并流行开的概念：把同类内容（比如所有博客文章）归到一个"集合"里，用 schema（比如 Zod）定义每篇文章必须有哪些字段（标题、日期、标签等），框架在构建时自动做类型校验。好处是内容格式统一、写错字段会报错，而不是上线后才发现。


**组件化（Componentization）**

把 UI 拆成一个个可复用的小模块（组件），比如"导航栏组件"、"文章卡片组件"、"评论区组件"。React/Vue 的核心思想。好处是改一处、处处生效，代码不重复。

**动画（Animation）**

页面交互效果，比如页面切换过渡、鼠标悬停效果、滚动触发的渐入效果。常用库：Framer Motion（React）、GSAP、CSS transition/animation。博客里适度加一点能提升体验，但不是必需。

**Frontmatter**

每篇文章头部的元信息(标题、日期、标签、摘要),这是内容集合能自动校验的基础


## 四、 渲染方式

**SSG（Static Output /静态输出 ）**

构建时（build time）就把所有页面提前生成成纯 HTML 文件，用户访问时直接返回现成文件，不需要服务器实时计算。速度快、可以放在任何静态托管上（GitHub Pages、Vercel、Netlify）。博客类内容基本都适合这种方式，因为内容不常变。

**SSR（Server-Side Rendering，服务端渲染）**

与静态输出相对：每次用户请求页面时，服务器实时生成 HTML 再返回。适合内容频繁变化、需要根据用户身份显示不同内容的场景（比如登录后的个性化页面）。Next.js 支持 SSG 和 SSR 混用。个人博客一般用不到 SSR，除非有评论系统实时更新之类需求。

## 五、部署方式


**部署（Deployment）**

把构建好的网站发布到公网让别人能访问的过程。常见方式：
- GitHub Pages:免费、和 GitHub 仓库联动,纯静态站首选
- ercel / Netlify:push 代码自动构建部署,对 Next.js/Astro 支持最好,也有免费额度
- 自建服务器+ Nginx:除非有特殊需求(自定义域名逻辑、想练手运维),否则没必要

---
| 对比维度 | 🎯 **选调生** | **国考** | **省考** |
|---|---|---|---|
| **本质定位** | 省委组织部选的**后备干部苗子**，重点培养 | 中央垂直系统招人（国税、海关、部委） | 本省各层级机关招普通公务员 |
| **报考门槛** ⭐ | **最高**：仅应届、限双一流/本省高校，需**党员/学生干部/校级荣誉** | 应届+往届，大专起，不限党员干部 | 应届+往届，部分限户籍 |
| **应届限制** ⭐ | **绝大多数只招当年应届，毕业即失去资格** | 往届可报 | 往届可报 |
| **工资来源** | 当地财政 | **中央财政**（工资相对更高更稳） | 地方财政 |
| **下基层** ⭐ | **强制2年**（乡镇/街道），档案在组织部 | **无强制**，报哪去哪 | 无强制 |
| **晋升空间** ⭐ | **最大**：组织部跟踪培养，转正定级更高，提拔有政策倾斜 | 中：靠单位内部晋升 | 中：靠单位内部晋升 |
| **竞争难度** ⭐ | **最小**（门槛筛掉大部分人） | **最卷**（热门岗几千比1） | 中等，三不限岗很卷 |
| **报考时间** | 各省不同，与国省考**错开**，可多线兼报 | 10月报名，11-12月笔试 | 次年2-3月笔试 |
| **适合人群** | 应届+条件达标+愿下基层+走党政晋升 | 想进垂直系统、愿全国流动 | 已毕业、想留本市稳定上班 |

---

前端经验：sol 前端能力一般，可以先让 codex 生成视觉效果图再移植开发，或者先写 prompt 去 AIStudio 的 build 生成 apps，然后下载源码丢给 codex，其次是让 grok4.6 先生成前端 ui mvp 再丢给 codex 后续开发也行，以及还能选 Sonnet5 性价比高 效果比 GPT 强很多很多




## todo

1. [^名词解释]

[^名词解释]:
  1. BYOK（Bring Your Own Key）:把「自己的模型 API Key」带到不同产品里使用，避免被单一厂商锁定。需要研究：典型支持 BYOK 的产品、计费 / 隐私边界、与 ==SaaS-only== 模式的取舍

2. [^思路实现]


[^思路实现]:
  1. 研究Agent 路由：把任务拆给多个专门 Agent，每个 Agent 只负责一件事（如一个 Agent 专门搜豆瓣评分/评论）。需要研究：
      - 路由形式：任务路由（dispatcher 拆任务给 worker）vs 能力路由（按 tool calling 把请求路由到对应工具）
      - 状态/记忆共享机制（参考 LangGraph / CrewAI / AutoGen）
      - 是否要封装为本地 skill
  2. 吵架 / 演讲录音 → AI 分析:平时吵架或演讲前录音，丢给 AI 分析语气、用词、情绪，做成网页接口。需要研究：
      - 端到端链路：录音 → 转写 → LLM 分析
      - 可视化输出形式（雷达图 / 时间轴）
      - 是否值得做成产品（隐私、用户场景）
  3. 家用台式机改作个人服务器:把家里的台式机作为自己的服务器，跑 Agent / 家庭服务 / 个人项目。需要研究：
      - 硬件选型：功耗、噪音、稳定性
      - 系统选择：Linux 发行版
      - 网络方案：内网穿透 / 公网 IP
      - 服务编排：Docker / 进程管理
  4. 增强 Codex 的生图能力: 可参考的接入实现为[88API-image-gen](https://github.com/blackdm666/88API-image-gen)。
3. 
















