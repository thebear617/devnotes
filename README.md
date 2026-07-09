# 开发笔记 · DevNotes

个人开发知识库：跨产品、跨技术栈、跨语言的**使用心得 / 经验 / 官方与社区链接 / 价格矩阵**。

> 初版范围：笔记中心 + 价格矩阵（链接聚合模块留待后续扩展）。

## 技术栈

| 层面 | 选型 |
|------|------|
| 框架 | **Vue 3**（全局构建，自托管 `js/vendor/vue.global.prod.js`，不依赖 CDN） |
| 样式 | 独立配色（石板灰 + 青绿 `#0d9488`），纯 CSS，单一样式表 |
| 构建 | **无**。纯静态 HTML + CSS + JS，零依赖 |

## 架构

```
devnotes/
├── index.html              # 入口，Vue 挂载点
├── css/style.css           # 单一样式表
├── js/
│   ├── vendor/vue.global.prod.js   # Vue 3 自托管（164KB）
│   ├── data-notes.js        # 笔记数据：const notes
│   ├── data-pricing.js      # 价格数据：const pricings + pricingMeta
│   └── app.js               # Vue 应用：NoteCenter + PricingMatrix 组件
└── README.md
```

数据驱动：先加载 `data-*.js`（定义全局 `notes` / `pricings`），再加载 Vue，最后 `app.js` 挂载。
组件用全局 `app.component(...)` 注册，`template` 为字符串模板。

## 本地运行

```bash
cd devnotes
python3 -m http.server 8000
# 打开 http://localhost:8000
```

## 添加内容

### 新增一篇笔记
编辑 `js/data-notes.js`，在 `notes` 数组追加一个对象：

```js
{
  id: 'unique-id',
  product: 'Qoder',                 // 与价格表 product 对应
  stacks: ['前端', '全栈'],
  langs: ['TypeScript'],
  type: '心得',                     // 心得 / 经验 / 文档 / 社区
  title: '标题',
  date: '2026-07-09',
  body: '<p>支持 <strong>HTML</strong> 与 <code>code</code></p>',
  links: [{ title: '官网', url: 'https://...' }]
}
```

### 更新价格
编辑 `js/data-pricing.js`：
- 改对应行的 `price` / `billing` / `note` / `updatedAt`
- 同步修改底部 `pricingMeta.updatedAt`
- 同一 `product` 可有多条 `plan`

## 价格更新策略

采用**手动维护 + 标注核对日期**（初版不做自动抓取）：
- 大厂 coding plan 调价低频，改一行 `data-pricing.js` 成本极低；
- 矩阵顶部始终显示"核对于 YYYY-MM-DD"，读者自判时效；
- 自动抓取需写解析脚本 + 应对各官网 DOM / 反爬，对个人站是过度工程，预留为后续扩展。

## 部署

独立 git 仓库 + GitHub Pages（与 `home/`、`personal/` 同套流程）：

```bash
cd devnotes
git init
git add .
git commit -m "init: 开发笔记站点骨架"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

推送后 GitHub Pages 几秒生效。commit 风格沿用中文 `type: 描述`（feat / fix / chore / style / diary）。

## 约定

- 图片若使用，统一走 GitHub Pages 相对路径，不使用 jsDelivr CDN；
- Git 操作仅在 `devnotes/` 子目录内进行，根目录不是仓库。
