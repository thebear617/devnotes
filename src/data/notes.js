export const notes = [
  {
    id: 'clash-verge-subscription-tun-timeout',
    product: 'Clash Verge',
    stacks: ['网络', '运维'],
    langs: [],
    type: '调试',
    title: 'Clash Verge 节点全部超时？重新导入订阅并关闭 TUN',
    date: '2026-07-25',
    body: `<p>电脑端使用 B 站点订阅时，Clash Verge 中所有节点都显示连接超时，但同一订阅在手机 Shadowrocket 上可以正常连接；换用 A 订阅后电脑端也能使用。排查发现电脑可以直接连通 B 节点端口，问题出在 Clash Verge 的 TUN 路由模式。</p>
<p>解决方法：</p>
<ol>
  <li>到服务商网站重新导入一次需要使用的订阅，确保配置是最新的。</li>
  <li>导入完成后关闭 Clash Verge 的 TUN 模式，使用普通系统代理。</li>
</ol>
<p>以后遇到“手机能用、电脑 Clash Verge 全部超时”的类似问题，可以先重新导入订阅，再关闭 TUN 模式测试。</p>`
  },
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
  },
  {
    id: 'static-five-layers',
    product: '个人站点',
    stacks: ['前端', '全栈'],
    langs: ['JavaScript'],
    type: '心得',
    title: '纯静态站点的五层渲染模型',
    date: '2026-07-07',
    body: `<h2>层级</h2>
<p><code>Page → Tab → Section（X 样式）→ Item（Y 样式）→ 点击行为</code></p>
<p>三层数据和两层样式完全解耦：</p>
<table>
  <thead><tr><th>层</th><th>角色</th><th>谁决定</th></tr></thead>
  <tbody>
    <tr><td>Page</td><td>整个页面</td><td>唯一</td></tr>
    <tr><td>Tab</td><td>功能视图切换</td><td>数据文件</td></tr>
    <tr><td>Section</td><td>数据分组容器</td><td>数据 + 渲染样式</td></tr>
    <tr><td>Item</td><td>单条数据记录</td><td>数据 + 渲染样式</td></tr>
    <tr><td>点击</td><td>Item 被点击后做什么</td><td>交互逻辑</td></tr>
  </tbody>
</table>
<h2>Section 渲染形式</h2>
<ul>
  <li><strong>Accordion</strong> — 手风琴折叠面板，点标题展开/收起</li>
  <li><strong>Summary Grid</strong> — 横排大数字统计卡片</li>
  <li><strong>Plain Container</strong> — 无额外壳，直接装 Item</li>
</ul>
<h2>Item 渲染形式</h2>
<ul>
  <li><strong>Card Grid</strong> — 卡片网格，名称 + 描述，2~3 列</li>
  <li><strong>Pill Bar</strong> — 横向圆角胶囊标签，可换行</li>
  <li><strong>Photo Card</strong> — 图片 + 名称，网格排列</li>
  <li><strong>Table Row</strong> — 紧凑多列表格行</li>
</ul>
<h2>点击行为</h2>
<ul>
  <li><strong>外链跳转</strong> — <code>&lt;a target="_blank"&gt;</code></li>
  <li><strong>打开抽屉</strong> — 同页侧滑面板显示详情</li>
  <li><strong>筛选</strong> — 点击后过滤其它区域数据</li>
</ul>
<h2>使用心得</h2>
<ol>
  <li>原本是表格的数据，倾向于直接用表格渲染。参考猫猫网站的物资管理页面。</li>
  <li>站点跳转的统筹，如果不想暴露裸链接、也不想排版全堆在左侧，可以试网格卡片。参考个人网站路由表。</li>
</ol>`
  },
  {
    id: 'deploy-tencent-vercel',
    product: 'Vercel',
    stacks: ['部署', '运维'],
    langs: [],
    type: '经验',
    title: '从域名到上线：腾讯云 + GitHub + Vercel 部署全流程',
    date: '2026-07-05',
    body: `<h2>步骤</h2>
<ol>
  <li>在腾讯云购买域名 thebear617.cn，记得勾选禁止转移锁，完成实名认证</li>
  <li>在 GitHub 创建想要部署的仓库，push 代码</li>
  <li>在 Vercel 上 Import 对应代码仓库，然后创建 Project，直接部署</li>
  <li>在 Vercel 项目 Settings → Domains 添加 www.thebear617.cn 和 thebear617.cn</li>
  <li>在腾讯云 DNS 添加 A 记录和 CNAME 记录，按 Vercel 给的配即可，等待 Vercel 验证通过，自动签发 SSL，域名上线</li>
</ol>
<h2>参考</h2>
<ul>
  <li><a href="https://blog.csdn.net/qq_57376018/article/details/160097635" target="_blank" rel="noopener">CSDN · 2026 最新 Vercel 自动化部署与自定义域名配置教程</a></li>
</ul>`
  },
  {
    id: 'macos-spotlight-mds',
    product: 'macOS',
    stacks: ['运维', '调试'],
    langs: [],
    type: '经验',
    title: '聚焦搜索失效？一行 killall mds 让它起死回生',
    date: '2026-07-11',
    body: `<p>macOS 聚焦搜索（Spotlight）偶尔会"罢工"——搜不到刚拉取/安装的应用，或结果陈旧。一条 <code>sudo killall mds</code> 就能让它在几秒内恢复。下面拆开看"问题 / 解法 / 原理"。</p>

<h2>① 我出现的问题</h2>
<p>在 macOS 上用聚焦搜索（右上角放大镜或 <code>⌘Space</code>）时：</p>
<ul>
  <li>搜不到我<strong>刚拉取或安装</strong>的应用程序和文件；</li>
  <li>搜出来的结果是<strong>陈旧缓存</strong>——文件明明已经在磁盘上，聚焦却像"眼盲"了一样捞不到。</li>
</ul>

<h2>② 解决方法</h2>
<p>一行命令，重启底层索引引擎：</p>
<p><code>sudo killall mds</code></p>
<p>进阶：如果 kill 之后仍不正常，说明<strong>索引数据库本身损坏</strong>，需要重建索引（慢、吃 CPU）：</p>
<p><code>sudo mdutil -E /</code></p>
<p>一句话区分两者：</p>
<ul>
  <li><code>killall mds</code> = 换了个<strong>清醒的图书管理员</strong>来查目录。速度快，专治进程卡死。</li>
  <li><code>mdutil -E</code> = 把整座图书馆的<strong>目录卡片烧掉重写</strong>。速度慢，专治索引库损坏。</li>
</ul>

<h2>③ 解决的原因</h2>
<p><code>mds</code> 全称 <strong>Metadata Server（元数据服务器）</strong>，是负责 Spotlight 搜索的核心守护进程。你每次搜索，都是向后台这个默默运行的 <code>mds</code> 进程发请求，由它去庞大的索引数据库里捞结果。</p>
<p>作为开发者，电脑里经常瞬时产生大量文件 I/O（克隆大型 GitHub 仓库、编译生成缓存、更新依赖库），<code>mds</code> 偶尔会"消化不良"：</p>
<ul>
  <li>陷入<strong>死锁</strong>：读某个权限异常或格式损坏的文件时卡住；</li>
  <li><strong>内存泄漏 / 过载</strong>：海量小文件把内存吃爆，进程假死（Hang）；</li>
  <li><strong>缓存错乱</strong>：索引库已更新，但进程内存里的搜索树跑偏，导致它"眼盲"。</li>
</ul>
<p>当你执行 <code>sudo killall mds</code>：</p>
<ol>
  <li><strong>强制斩杀</strong>——系统无视它卡在什么状态，直接把它从内存清掉；</li>
  <li><strong>系统级复活</strong>——macOS 的服务管理器 <code>launchd</code> 一直在监控核心进程，一旦发现 <code>mds</code> 意外死亡，会<strong>立刻自动拉起一个新的 <code>mds</code> 进程</strong>。</li>
</ol>
<p>新启动的 <code>mds</code> 头脑清醒，重新连接到硬盘上的索引数据库，顺利读到你那个应用程序的真实元数据，搜索功能自然就恢复了。</p>`
  },
  {
    id: 'mfa-2fa-keys',
    product: '账户安全',
    stacks: ['安全', '运维'],
    langs: [],
    type: '心得',
    title: '2FA 与 MFA：双因素 / 多因素认证，以及三种验证密钥的区别',
    date: '2026-07-13',
    body: `<h2>① 2FA 与 MFA 是什么关系</h2>
<p><strong>2FA（双因素认证）</strong>：登录时使用<strong>两种不同类型</strong>的验证因素。例如：</p>
<ul>
  <li>密码 + 手机验证码</li>
  <li>密码 + 验证器动态码</li>
  <li>密码 + 指纹</li>
  <li>密码 + 实体安全密钥</li>
</ul>
<p><strong>MFA（多因素认证）</strong>：使用<strong>两种或两种以上</strong>不同类型的验证因素。因此，<strong>2FA 其实属于 MFA 的一种</strong>。</p>

<h2>② 关键：是"不同因素"，不是"验证两次"</h2>
<p>判断是否为真正的多因素，看的是因素类型是否不同，而不是验证步骤走了几遍。</p>
<p>比如"密码 + 安全问题"通常都属于"你知道的信息"这一同一类，<strong>未必算真正的双因素认证</strong>。</p>
<p>常见因素分三类：</p>
<ul>
  <li><strong>你知道的</strong>：密码、PIN</li>
  <li><strong>你拥有的</strong>：手机、验证器、安全密钥</li>
  <li><strong>你本人的特征</strong>：指纹、面容、虹膜</li>
</ul>

<h2>③ MFA 密钥的三种常见类型</h2>
<p>"MFA 密钥"通常指<strong>多重身份验证密钥</strong>，用于在密码之外再验证一次身份。常见有三种：</p>
<ul>
  <li><strong>验证器密钥 / Secret Key</strong>：一串字母和数字，用来把账号添加到 Google Authenticator、Microsoft Authenticator 等应用。<strong>不要分享给任何人</strong>。</li>
  <li><strong>安全密钥</strong>：像 YubiKey 这样的实体 USB / NFC 设备。</li>
  <li><strong>恢复密钥 / 备用代码</strong>：手机丢失或无法验证时，用来恢复登录。</li>
</ul>

<h2>④ 安全提醒</h2>
<p>如果你在绑定验证器时看到<strong>二维码旁边的一串字符</strong>，那通常是<strong>验证器的 Secret Key</strong>。它一旦泄露，别人就能生成你的动态验证码——所以务必妥善保管，别截图外传。</p>`,
    links: []
  },
  {
    id: 'macos-timed-reminder-cheatsheet',
    product: 'macOS',
    stacks: ['运维', '调试'],
    langs: ['Shell'],
    type: '经验',
    title: '定时提醒速查指南',
    date: '2026-07-14',
    body: `<h2>① 关联文件与触发频率</h2>
<p>定时提醒的内容来自一个 Markdown 文件，手动编辑它就是编辑提醒清单：</p>
<ul>
  <li><strong>关联文件</strong>：<code>/Users/mokaiche/.hermes/reminder-today.md</code>（即 <code>~/.hermes/reminder-today.md</code>）</li>
  <li><strong>触发频率</strong>：每 <strong>20 分钟</strong>一次（launchd <code>StartInterval</code> = 1200 秒）</li>
</ul>

<h2>② 触发逻辑</h2>
<p>由 launchd LaunchAgent <code>com.user.reminder-today</code> 驱动：</p>
<ol>
  <li>launchd 每 20 分钟执行脚本 <code>/Users/mokaiche/scripts/reminder-today.sh</code>；</li>
  <li>脚本 <code>cat</code> 读取上面的 md 文件内容；</li>
  <li>先调 <code>terminal-notifier</code> 响铃 + 右上角横幅（吸引注意）；</li>
  <li>再用 <code>osascript display dialog</code> 弹出对话框，<strong>完整显示</strong> Markdown 内容（长清单不被横幅截断）。</li>
</ol>
<p>改提醒内容只需编辑 md 文件，下一次 20 分钟触发会自动读最新版，无需重载任务。</p>

<h2>③ 速查指令</h2>
<p><strong>立刻触发一次（已验证可用）</strong>——直接跑脚本本身：</p>
<p><code>bash /Users/mokaiche/scripts/reminder-today.sh</code></p>
<p><strong>禁用定时任务</strong>——卸载 launchd 任务，不再自动触发：</p>
<p><code>launchctl unload ~/Library/LaunchAgents/com.user.reminder-today.plist</code></p>
<p><strong>启用定时任务</strong>——重新加载，恢复每 20 分钟触发：</p>
<p><code>launchctl load ~/Library/LaunchAgents/com.user.reminder-today.plist</code></p>
<p>说明：修改频率（plist 的 StartInterval）后需先 unload 再 load 才能生效，直接编辑 plist 不会被 launchd 自动感知。</p>`,
    links: []
  },
  {
    id: 'github-contribution-email-mismatch',
    product: 'GitHub',
    stacks: ['运维', 'Git', '调试'],
    langs: ['Shell'],
    type: '经验',
    title: 'GitHub 贡献图只统计 verified email 的 commit——一次邮箱错配的诊断与全仓库修复',
    date: '2026-07-17',
    body: `<p>我做了很多 commit，但贡献图始终只显示可怜的 66 contributions。排查了一个下午才挖到根因——记录下来避免再踩。</p>

<h2>① 现象</h2>
<p>GitHub 个人主页的贡献图（Contribution Graph）只显示 66 个绿格子，但本地明明有几百个 commit 推送到了 GitHub。</p>
<p>以为是「最近几天的推送没记上」，但实际上是<strong>所有 commit 从来就没被记过</strong>。</p>

<h2>② 根因</h2>
<p>GitHub 计算贡献图的规则：commit 的 <code>author email</code> 必须出现在你 GitHub 账号的 <strong>verified emails 列表</strong>里，否则这次提交会被 GitHub 当成「无主」，完全不计入贡献图。</p>
<p>我的情况：</p>
<ul>
  <li><strong>本地 commit</strong>：所有 6 个仓库的 author email 都是 <code>1357953389@icloud.com</code>（git config user.email 设置的）</li>
  <li><strong>GitHub 账号</strong> <code>thebear617</code> 绑定的 verified email 是 <code>1357953389@qq.com</code> 和 <code>3474153902@qq.com</code></li>
  <li><strong>icloud 那个邮箱从未添加过</strong>，所以 GitHub 认为「这些 commit 不属于 thebear617」</li>
</ul>
<p>所以不是 GitHub 抽风，是<strong>邮箱不匹配</strong>。</p>

<h2>③ 排查步骤（推荐路径）</h2>
<ol>
  <li>打开 <a href="https://github.com/settings/emails" target="_blank" rel="noopener">https://github.com/settings/emails</a>，看你 GitHub 账号所有 verified email</li>
  <li>在每个仓库跑 <code>git log -5 --pretty=format:"%ae"</code>，看你 commit 实际用的 author email</li>
  <li>对比两份列表，找出<strong>差异</strong>——差的就是「失踪」的 commit 来源</li>
</ol>
<p>另两个常见坑（这次都不是，但顺带记下）：</p>
<ul>
  <li><strong>"Include private contributions" 没勾选</strong>：私有仓库 commit 默认不显示，需要去 <a href="https://github.com/settings/profile" target="_blank" rel="noopener">profile settings</a> 勾选</li>
  <li><strong>committer 和 author 是不同邮箱</strong>：merge commit / 协作 commit 容易出现，看 <code>git log --pretty=fuller</code> 区分</li>
</ul>

<h2>④ 修复方案</h2>
<p>两种思路任选：</p>

<h3>方案 A：添加 icloud 邮箱到 GitHub（最简单）</h3>
<p>在 <a href="https://github.com/settings/emails" target="_blank" rel="noopener">Email settings</a> 点 "Add email address" → 填 icloud 邮箱 → 去邮箱点确认链接。</p>
<p><strong>GitHub 会自动追溯</strong>所有用这个邮箱的 commit，5–10 分钟贡献图就会填满。无需 force-push。</p>

<h3>方案 B：改写历史把所有 commit 改成已验证邮箱（彻底但重）</h3>
<p>如果你不再想用 icloud 邮箱（像我一样），那就反过来改 commit：</p>
<ol>
  <li>备份每个仓库：<code>git bundle create backup.bundle --all</code></li>
  <li>改 <code>git config user.email "1357953389@qq.com"</code>（每个仓库 + 全局都改）</li>
  <li>改写历史：
    <pre><code>git filter-branch -f --env-filter '
if [ "$GIT_AUTHOR_EMAIL" = "1357953389@icloud.com" ]; then
    export GIT_AUTHOR_EMAIL="1357953389@qq.com"
fi
if [ "$GIT_COMMITTER_EMAIL" = "1357953389@icloud.com" ]; then
    export GIT_COMMITTER_EMAIL="1357953389@qq.com"
fi
' --tag-name-filter cat -- --branches --tags</code></pre>
  </li>
  <li>清理 + gc：<code>git for-each-ref --format='%(refname)' refs/original/ | xargs -n 1 git update-ref -d && git reflog expire --expire=now --all && git gc --prune=now --aggressive</code></li>
  <li>force-push：<code>git push --force-with-lease origin main</code></li>
</ol>
<p><strong>注意：</strong></p>
<ul>
  <li>所有 commit hash 会<strong>全部变化</strong>，任何引用旧 hash 的 PR / issue / 文档会失效</li>
  <li>filter-branch 在脏仓库（未提交改动）上会拒绝——必须先 commit 或 stash</li>
  <li>推荐 <code>--force-with-lease</code> 而非 <code>--force</code>：若远程被别人推过会自动拒绝，避免覆盖</li>
  <li>有 <code>git-filter-repo</code> 装的话优先用它（比 filter-branch 快 10x+ 且无 gotchas），没装的话 filter-branch 也够用</li>
</ul>

<h2>⑤ 经验教训</h2>
<ul>
  <li>设 git config 时<strong>用一个你长期持有 + 愿意绑 GitHub 的邮箱</strong>，别用临时邮箱或将来可能弃用的</li>
  <li>多仓库项目（我 6 个）一定要用<strong>同一个 email</strong>，否则贡献图会分裂</li>
  <li>如果用 GitHub Private Email（<code>userid+xxx@users.noreply.github.com</code>），要把那个 noreply 地址也加到 verified emails</li>
  <li>贡献图看着少时，<strong>先去 GitHub 账号 settings 核对 verified email</strong>，这是 90% 案例的根因</li>
</ul>`,
    links: [
      { title: 'GitHub · 为什么我的贡献没有显示？', url: 'https://docs.github.com/zh/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile' },
      { title: 'GitHub · 管理邮箱设置', url: 'https://github.com/settings/emails' }
    ]
  }
];
