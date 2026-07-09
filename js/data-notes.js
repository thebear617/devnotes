// 开发笔记 · 笔记数据
// 字段说明：
//   id        唯一标识
//   product   产品名（与 data-pricing.js 的 product 对应）
//   stacks    技术栈数组，如 ['前端','全栈']
//   langs     编程语言数组，如 ['TypeScript','Python']
//   type      笔记类型：心得 / 经验 / 文档 / 社区
//   title     标题
//   date      记录日期 YYYY-MM-DD
//   body      HTML 字符串，支持 <p> <ul> <ol> <li> <code> <strong> <a> 等
//   links     相关链接 [{ title, url }]
//
// 新增笔记：直接在此数组追加一个对象即可。

const notes = [
  {
    id: 'qoder-agent-first',
    product: 'Qoder',
    stacks: ['全栈', '前端'],
    langs: ['TypeScript', 'Python'],
    type: '心得',
    title: 'Qoder 的 Agent-First 不是噱头',
    date: '2026-07-08',
    body: `<p>用了两周，最大的体感是：它不是"帮你补全"，而是"你描述需求、它自己把活干完"。</p>
<p>几个让我留下的点：</p>
<ul>
  <li>工程感知强，会先读整个仓库结构再动手，不容易改到一半才发现命名冲突。</li>
  <li>多文件编辑是真并行的，一次需求可以顺手把接口、类型、测试一起改了。</li>
  <li>中文语境下对业务代码的理解比 Copilot 那一代明显好。</li>
</ul>
<p>代价是：复杂任务它偶尔会"跑偏"，需要你在关键节点 review——别真当甩手掌柜。</p>`,
    links: [
      { title: 'Qoder 官网', url: 'https://qoder.com' }
    ]
  },
  {
    id: 'workbuddy-office-agent',
    product: 'WorkBuddy',
    stacks: ['办公自动化', '全栈'],
    langs: ['Shell', 'Python'],
    type: '心得',
    title: 'WorkBuddy 是"办公 Agent"，别拿它和 Cursor 比',
    date: '2026-07-09',
    body: `<p>一开始我把它当编程工具，越用越觉得定位错了：它最爽的场景是<strong>跨应用办公流</strong>——操作微信、浏览器、本地文件、定时任务，而不是在编辑器里写代码。</p>
<p>适合干的活：</p>
<ul>
  <li>批量整理文件、按规则重命名、生成清理清单（只看不动）。</li>
  <li>跨应用抓取数据、填表、定时跑脚本。</li>
  <li>把"说一句话"变成"多 Agent 并行执行一串操作"。</li>
</ul>
<p>所以它是和 CodeBuddy（腾讯的编码助手）互补的生态位，不是 Cursor / Qoder 的竞品。归类时别混。</p>`,
    links: [
      { title: 'WorkBuddy 文档', url: 'https://www.codebuddy.cn/docs/workbuddy/Overview' }
    ]
  },
  {
    id: 'cursor-pro-tips',
    product: 'Cursor',
    stacks: ['前端', '全栈'],
    langs: ['TypeScript', 'Go'],
    type: '经验',
    title: 'Cursor Pro 的几个提效习惯',
    date: '2026-06-20',
    body: `<p>用 Cursor 一年，几条真正省时间的：</p>
<ol>
  <li><code>Cmd+K</code> 改局部，<code>Cmd+L</code> 开对话；别在对话框里描述"整个文件要干嘛"，给它具体函数和上下文更快。</li>
  <li>在 <code>.cursorrules</code> 里写死项目约定（命名、目录结构、技术栈），比每次口头提醒稳。</li>
  <li>大重构用 Agent 模式让它先列计划，你确认再执行，比直接生成更可控。</li>
</ol>
<p>网络是硬伤：国内直连不稳，需要特殊方式，这是它相对国产工具的最大短板。</p>`
  },
  {
    id: 'qwen-lingma-free',
    product: '通义灵码',
    stacks: ['后端', '前端'],
    langs: ['Java', 'Python'],
    type: '社区',
    title: '通义灵码个人免费，中文场景很香',
    date: '2026-05-12',
    body: `<p>社区里讨论很多的一点是：个人版免费 + 中文代码注释 / 业务逻辑理解强。插件形态，渐进式接入，不破坏现有 IDE 习惯。</p>
<p>适合：想在保留 VS Code / JetBrains 习惯的前提下"无痛"引入 AI 辅助的开发者。Agent 能力 2025 年 4 月才上，能自主检索工程结构、编辑文件、执行命令，对标 Copilot + Claude Code 的合体。</p>`,
    links: [
      { title: '通义灵码', url: 'https://lingma.aliyun.com' }
    ]
  }
];
