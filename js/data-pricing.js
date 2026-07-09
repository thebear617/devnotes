// 开发笔记 · 价格数据
// 价格按"手动维护 + 标注核对日期"策略更新（见 README）。
// 字段说明：
//   product    产品名（与 data-notes.js 的 product 对应）
//   vendor     厂商
//   track      赛道：AI 原生 IDE / IDE 插件 / 终端 Agent / 桌面·办公 Agent / 模型 API 平台（集成）/ 模型 API（单家）
//   plan       方案名
//   price      价格文本，如 '¥0' / '$20' / '按量' / '待确认'
//   billing    计费周期：月 / 年 / —
//   note       备注
//   updatedAt  本条核对日期 YYYY-MM-DD
//
// 更新价格：直接改对应行的 price / billing / note / updatedAt，并同步修改下方 meta.updatedAt。
// 新增产品：在 pricings 数组追加对象即可（同一 product 可有多条 plan）。

const pricingMeta = {
  updatedAt: '2026-07-09',
  note: '价格核对于各产品中文官网/公开公告（2026-07-09），仅供参考，以官网实时为准。规则：① 只收录「订阅套餐价」（coding plan / token plan / 会员 / 席位），不收录 API 裸按量 token 价；② 国产产品一律取中文站人民币价，不爬海外站、不填美元；③ 海外产品（Cursor/Claude Code/Codex/GitHub Copilot/OpenCode）无中文站，保留美元官方价并标注「无国区定价」。'
};

// 各产品官方订阅/价格页（点击表格「产品」列即跳转）。
// 国产优先中文站；海外产品无中文站则用官方英文站。
const pricingLinks = {
  'Qoder': 'https://qoder.com/',
  'Cursor': 'https://cursor.com/pricing',
  'Trae': 'https://www.trae.cn/pricing',
  'GitHub Copilot': 'https://github.com/features/copilot/plans',
  'Claude Code': 'https://claude.com/plans',
  'WorkBuddy': 'https://copilot.tencent.com/',
  'Comate': 'https://comate.baidu.com/',
  'CodeArts': 'https://www.huaweicloud.com/devcloud/pricing.html',
  'CodeGeeX': 'https://www.codegeex.cn/',
  'iFlyCode': 'https://iflycode.xfyun.cn/',
  'Codex': 'https://openai.com/codex/',
  'OpenCode': 'https://opencode.ai/zen',
  '火山方舟': 'https://www.volcengine.com/product/ark',
  '百炼': 'https://bailian.console.aliyun.com/',
  '讯飞 MaaS': 'https://maas.xfyun.cn/packageSubscription?tab=month',
  '百度千帆': 'https://qianfan.cloud.baidu.com/',
  '腾讯云 Token Plan': 'https://cloud.tencent.com/act/pro/tokenplan',
  'MiniMax': 'https://platform.minimaxi.com/subscribe/token-plan',
  'GLM': 'https://docs.bigmodel.cn/cn/coding-plan/overview',
  'Kimi': 'https://platform.moonshot.cn/'
};

const pricings = [
  // ===== Qoder（阿里，原通义灵码，2026-05-20 更名 Qoder CN）· AI 原生 IDE =====
  { product: 'Qoder',          vendor: '阿里',        track: 'AI 原生 IDE', plan: '个人基础版',   price: '¥0',      billing: '—',  note: '更名后基础版仍免费',                       updatedAt: '2026-07-09' },
  { product: 'Qoder',          vendor: '阿里',        track: 'AI 原生 IDE', plan: '个人专业版',   price: '¥59',     billing: '月', note: '每月 2000 credits，原限时免费已结束',     updatedAt: '2026-07-09' },
  { product: 'Qoder',          vendor: '阿里',        track: 'AI 原生 IDE', plan: '企业标准版',   price: '¥99',     billing: '人·月', note: '每月每席 3000 credits，主账号购买',    updatedAt: '2026-07-09' },
  { product: 'Qoder',          vendor: '阿里',        track: 'AI 原生 IDE', plan: '企业 VPC 版',  price: '¥199',    billing: '人·月', note: '专有网络部署，100 人起购',             updatedAt: '2026-07-09' },

  // ===== Cursor（Anysphere）· AI 原生 IDE =====
  { product: 'Cursor',         vendor: 'Anysphere',   track: 'AI 原生 IDE', plan: '免费版 Hobby', price: '$0',      billing: '—',  note: '免费试用编辑器',                         updatedAt: '2026-07-09' },
  { product: 'Cursor',         vendor: 'Anysphere',   track: 'AI 原生 IDE', plan: 'Pro',          price: '$20',     billing: '月', note: '年付 $192（约 $16/月）',                updatedAt: '2026-07-09' },
  { product: 'Cursor',         vendor: 'Anysphere',   track: 'AI 原生 IDE', plan: 'Pro+',         price: '$60',     billing: '月', note: '年付约 $48/月',                        updatedAt: '2026-07-09' },
  { product: 'Cursor',         vendor: 'Anysphere',   track: 'AI 原生 IDE', plan: 'Ultra',        price: '$200',    billing: '月', note: '年付约 $160/月',                       updatedAt: '2026-07-09' },
  { product: 'Cursor',         vendor: 'Anysphere',   track: 'AI 原生 IDE', plan: 'Business',     price: '$40',     billing: '人·月', note: '团队协作席位',                         updatedAt: '2026-07-09' },

  // ===== Trae（字节）· AI 原生 IDE（2026-02 起改按 Token/速通计费）=====
  { product: 'Trae',           vendor: '字节',         track: 'AI 原生 IDE', plan: '免费',        price: '¥0',      billing: '—',  note: '全部功能免费，2 个并发云端任务',         updatedAt: '2026-07-09' },
  { product: 'Trae',           vendor: '字节',         track: 'AI 原生 IDE', plan: '速通 Pro',    price: '¥59',     billing: '月', note: '限时价（原 ¥99），100 次/月免排队',       updatedAt: '2026-07-09' },
  { product: 'Trae',           vendor: '字节',         track: 'AI 原生 IDE', plan: '速通 Pro+',   price: '¥239',    billing: '月', note: '300 次/月免排队',                      updatedAt: '2026-07-09' },
  { product: 'Trae',           vendor: '字节',         track: 'AI 原生 IDE', plan: '速通 Ultra',  price: '¥699',    billing: '月', note: '1000 次/月免排队，优先 SOTA 模型',      updatedAt: '2026-07-09' },

  // ===== GitHub Copilot（GitHub）· IDE 插件 =====
  { product: 'GitHub Copilot', vendor: 'GitHub',       track: 'IDE 插件',     plan: '免费 Free',   price: '$0',      billing: '—',  note: '学生/开源维护者免费，限 2K 补全/月',    updatedAt: '2026-07-09' },
  { product: 'GitHub Copilot', vendor: 'GitHub',       track: 'IDE 插件',     plan: 'Pro',         price: '$10',     billing: '月', note: '个人，年付约 $8.33/月',               updatedAt: '2026-07-09' },
  { product: 'GitHub Copilot', vendor: 'GitHub',       track: 'IDE 插件',     plan: 'Pro+',        price: '$39',     billing: '月', note: '含更多高级模型额度',                   updatedAt: '2026-07-09' },
  { product: 'GitHub Copilot', vendor: 'GitHub',       track: 'IDE 插件',     plan: 'Business',    price: '$19',     billing: '人·月', note: '团队版',                               updatedAt: '2026-07-09' },
  { product: 'GitHub Copilot', vendor: 'GitHub',       track: 'IDE 插件',     plan: 'Enterprise',  price: '$39',     billing: '人·月', note: '企业版',                               updatedAt: '2026-07-09' },

  // ===== Claude Code（Anthropic）· 终端 Agent =====
  { product: 'Claude Code',    vendor: 'Anthropic',    track: '终端 Agent',   plan: 'Pro',         price: '$20',     billing: '月', note: '随 Claude 订阅包含',                   updatedAt: '2026-07-09' },
  { product: 'Claude Code',    vendor: 'Anthropic',    track: '终端 Agent',   plan: 'Max 5x',      price: '$100',    billing: '月', note: '5 倍用量',                            updatedAt: '2026-07-09' },
  { product: 'Claude Code',    vendor: 'Anthropic',    track: '终端 Agent',   plan: 'Max 20x',     price: '$200',    billing: '月', note: '20 倍用量',                           updatedAt: '2026-07-09' },
  { product: 'Claude Code',    vendor: 'Anthropic',    track: '终端 Agent',   plan: 'API 自付',    price: '按量',     billing: '—',  note: 'Claude API $3–25/M tokens',            updatedAt: '2026-07-09' },

  // ===== WorkBuddy（腾讯，Buddy AI 含 CodeBuddy）· 桌面·办公 Agent =====
  { product: 'WorkBuddy',      vendor: '腾讯',         track: '桌面·办公 Agent', plan: '体验版',  price: '¥0',      billing: '—',  note: '500 credits/月，限频',                  updatedAt: '2026-07-09' },
  { product: 'WorkBuddy',      vendor: '腾讯',         track: '桌面·办公 Agent', plan: '标准版',  price: '¥99',     billing: '月', note: '连续包月 ¥70；与 CodeBuddy 积分互通',   updatedAt: '2026-07-09' },
  { product: 'WorkBuddy',      vendor: '腾讯',         track: '桌面·办公 Agent', plan: '高级版',  price: '¥199',    billing: '月', note: '连续包月 ¥140',                        updatedAt: '2026-07-09' },
  { product: 'WorkBuddy',      vendor: '腾讯',         track: '桌面·办公 Agent', plan: '旗舰版',  price: '¥999',    billing: '月', note: '连续包月 ¥700',                        updatedAt: '2026-07-09' },

  // ===== 文心快码 Comate（百度）· IDE 插件 =====
  { product: 'Comate',         vendor: '百度',         track: 'IDE 插件',        plan: '个人标准版', price: '¥0',      billing: '—',  note: '智能补全永久免费',                     updatedAt: '2026-07-09' },
  { product: 'Comate',         vendor: '百度',         track: 'IDE 插件',        plan: '个人专业版', price: '¥100',    billing: '人·月', note: '含 ¥55/月 智能体请求券；季¥270/年¥1000', updatedAt: '2026-07-09' },
  { product: 'Comate',         vendor: '百度',         track: 'IDE 插件',        plan: '企业专业版', price: '¥150',    billing: '人·月', note: '含 ¥72/人·月 请求券；季¥450/年¥1500', updatedAt: '2026-07-09' },
  { product: 'Comate',         vendor: '百度',         track: 'IDE 插件',        plan: '企业旗舰版', price: '¥358',    billing: '人·月', note: '含 ¥283/人·月 请求券；季¥1074/年¥3998', updatedAt: '2026-07-09' },
  { product: 'Comate',         vendor: '百度',         track: 'IDE 插件',        plan: '企业专属版', price: '¥2500',   billing: '人·年', note: '100 个起购，私有化/VPC',             updatedAt: '2026-07-09' },

  // ===== CodeArts（华为，含智能编程 Snap）· 研发平台（席位计费）=====
  { product: 'CodeArts',       vendor: '华为',         track: 'IDE 插件',        plan: '基础版',    price: '¥0',      billing: '—',  note: '5 人及以下免费，超出 ¥50/月·人',        updatedAt: '2026-07-09' },
  { product: 'CodeArts',       vendor: '华为',         track: 'IDE 插件',        plan: '专业版',    price: '¥200',    billing: '人·月', note: '基础 5 人 ¥1/月，超出 ¥200/月·人',   updatedAt: '2026-07-09' },
  { product: 'CodeArts',       vendor: '华为',         track: 'IDE 插件',        plan: '铂金版',    price: '¥600',    billing: '人·月', note: '100 人起售，大企业',                 updatedAt: '2026-07-09' },

  // ===== CodeGeeX（智谱 AI，清华 THUDM 联合研发）· IDE 插件 =====
  { product: 'CodeGeeX',       vendor: '智谱 AI',      track: 'IDE 插件',        plan: '个人版',    price: '¥0',      billing: '—',  note: '开源免费，可本地私有化部署',           updatedAt: '2026-07-09' },
  { product: 'CodeGeeX',       vendor: '智谱 AI',      track: 'IDE 插件',        plan: '企业/商业版', price: '待确认', billing: '—',  note: '私有化/商业授权定制；API 走智谱开放平台按量', updatedAt: '2026-07-09' },

  // ===== iFlyCode（科大讯飞，星火大模型）· IDE 插件 =====
  { product: 'iFlyCode',       vendor: '科大讯飞',     track: 'IDE 插件',        plan: '个人版',    price: '¥0',      billing: '—',  note: '免费使用',                             updatedAt: '2026-07-09' },
  { product: 'iFlyCode',       vendor: '科大讯飞',     track: 'IDE 插件',        plan: '企业版',    price: '待确认',   billing: '—',  note: '企业定制，价格未公开',                 updatedAt: '2026-07-09' },

  // ===== Codex（OpenAI，捆绑 ChatGPT 订阅）· 终端 Agent =====
  { product: 'Codex',          vendor: 'OpenAI',       track: '终端 Agent',      plan: 'Free',      price: '$0',      billing: '—',  note: '有限 Codex Mini 访问',                 updatedAt: '2026-07-09' },
  { product: 'Codex',          vendor: 'OpenAI',       track: '终端 Agent',      plan: 'Plus',      price: '$20',     billing: '月', note: '含 Codex CLI+IDE+Cloud，软上限',       updatedAt: '2026-07-09' },
  { product: 'Codex',          vendor: 'OpenAI',       track: '终端 Agent',      plan: 'Pro',       price: '$200',    billing: '月', note: '高 Codex 限额，全职用户推荐',          updatedAt: '2026-07-09' },
  { product: 'Codex',          vendor: 'OpenAI',       track: '终端 Agent',      plan: 'Business',  price: '$25',     billing: '人·月', note: '工作区 Codex，约数（以席位计）',      updatedAt: '2026-07-09' },
  { product: 'Codex',          vendor: 'OpenAI',       track: '终端 Agent',      plan: 'Enterprise', price: '待确认', billing: '—',  note: '定制（SSO/合规/SLA）',                 updatedAt: '2026-07-09' },
  { product: 'Codex',          vendor: 'OpenAI',       track: '终端 Agent',      plan: 'API 按量',  price: '按量',     billing: '—',  note: 'Codex 变种 $5 输入 / $15 输出 每 M tokens', updatedAt: '2026-07-09' },

  // ===== OpenCode（Anomaly，开源 AI 编码 Agent）· 终端 Agent =====
  // 官方定价见 https://opencode.ai/zen （Go 为月订阅；Zen 为按量充值，无 "Zen Black/Black 200" 档）
  { product: 'OpenCode',       vendor: 'Anomaly',     track: '终端 Agent',      plan: '开源免费（BYOK）', price: '$0',   billing: '—',  note: 'MIT 开源；自带任意厂商 API Key 按量付费',     updatedAt: '2026-07-09' },
  { product: 'OpenCode',       vendor: 'Anomaly',     track: '终端 Agent',      plan: 'Go',               price: '$10',  billing: '月', note: '月订阅（首月 $5）；开源模型为主，每 5h 请求限额；无国区定价', updatedAt: '2026-07-09' },
  { product: 'OpenCode',       vendor: 'Anomaly',     track: '终端 Agent',      plan: 'Zen',              price: '$20',  billing: '起充', note: '按量充值（$20 起 +$1.23 手续费），按请求付费零加价，余额<$5 自动续充 $20；无国区定价', updatedAt: '2026-07-09' },

  // ===== 火山方舟（字节·火山引擎，集成多模型 + Coding Plan）· 模型 API 平台（集成）=====
  { product: '火山方舟',        vendor: '字节',         track: '模型 API 平台（集成）', plan: 'Coding Plan Lite', price: '¥9.9',  billing: '月', note: '~1200次/5h，支持 Doubao-Seed-Code/DeepSeek/GLM/Kimi', updatedAt: '2026-07-09' },
  { product: '火山方舟',        vendor: '字节',         track: '模型 API 平台（集成）', plan: 'Coding Plan Pro',  price: '¥49.9', billing: '月', note: '~6000次/5h',                                   updatedAt: '2026-07-09' },

  // ===== 百炼（阿里云大模型服务平台，集成通义千问等）· 模型 API 平台（集成）=====
  { product: '百炼',            vendor: '阿里',         track: '模型 API 平台（集成）', plan: 'Token Plan 标准版', price: '¥198',  billing: '席·月', note: '25,000 Credits/月，支持 Qwen/DeepSeek/Kimi/GLM/MiniMax 多厂商', updatedAt: '2026-07-09' },
  { product: '百炼',            vendor: '阿里',         track: '模型 API 平台（集成）', plan: 'Token Plan 高级版', price: '¥698',  billing: '席·月', note: '100,000 Credits/月（标准版4倍），无时段限额',          updatedAt: '2026-07-09' },
  { product: '百炼',            vendor: '阿里',         track: '模型 API 平台（集成）', plan: 'Token Plan 尊享版', price: '¥1,398', billing: '席·月', note: '250,000 Credits/月（标准版10倍），多用户隔离高峰不降速', updatedAt: '2026-07-09' },

  // ===== 讯飞 MaaS（科大讯飞，maas.xfyun.cn，集成星火X2/GLM/Kimi/MiniMax/DeepSeek/Qwen）· 模型 API 平台（集成）=====
  { product: '讯飞 MaaS',      vendor: '科大讯飞',     track: '模型 API 平台（集成）', plan: 'Coding 无忧版',    price: '¥3.9',  billing: '月', note: '首购特惠（续费¥19/月）；不限请求(动态流控)；含星火X2/GLM/Kimi/MiniMax/DeepSeek/Qwen', updatedAt: '2026-07-09' },
  { product: '讯飞 MaaS',      vendor: '科大讯飞',     track: '模型 API 平台（集成）', plan: 'Coding 专业版',    price: '¥39',   billing: '月', note: '每5h≈1200次/周≈9000/月≈18000；可控制台切底层模型',        updatedAt: '2026-07-09' },
  { product: '讯飞 MaaS',      vendor: '科大讯飞',     track: '模型 API 平台（集成）', plan: 'Coding 高效版',    price: '¥199',  billing: '月', note: '每5h≈6000次/周≈45000/月≈90000；覆盖复杂工程/长上下文',  updatedAt: '2026-07-09' },
  { product: '讯飞 MaaS',      vendor: '科大讯飞',     track: '模型 API 平台（集成）', plan: 'Token Plan（团队）', price: '待确认', billing: '月', note: '面向企业/团队统一分配额度，档位以官网为准',        updatedAt: '2026-07-09' },

  // ===== 百度千帆（百度，集成文心/GLM/Kimi/DeepSeek/Qwen 多模型）· 模型 API 平台（集成）=====
  { product: '百度千帆',        vendor: '百度',         track: '模型 API 平台（集成）', plan: 'Token Plan 起步版', price: '¥298',  billing: '月', note: '50万Token/月；Coding Plan 已于2026-06-25停售，现仅 Token Plan 企业版', updatedAt: '2026-07-09' },
  { product: '百度千帆',        vendor: '百度',         track: '模型 API 平台（集成）', plan: 'Token Plan 企业版', price: '¥2,580', billing: '月', note: '500万Token/月；含 GLM-5.2/文心4.0/Kimi K2.7/DeepSeek V4/Qwen3.7-Plus', updatedAt: '2026-07-09' },
  { product: '百度千帆',        vendor: '百度',         track: '模型 API 平台（集成）', plan: 'Token Plan 旗舰版', price: '¥1.5万起', billing: '月', note: '自定义Token池，1.5万元起；可选私有化部署(数据不出内网)', updatedAt: '2026-07-09' },

  // ===== 腾讯云 Token Plan（集成混元自研 + DeepSeek/Kimi/GLM/MiniMax 等第三方）· 模型 API 平台（集成）=====
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: 'Hy Lite',        price: '¥28',  billing: '月', note: '3500万T；混元Hy3，适配 Coding Agent/多步工具调用', updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: 'Hy Standard',    price: '¥78',  billing: '月', note: '1亿T；混元Hy3',                                  updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: 'Hy Pro',         price: '¥238', billing: '月', note: '3.2亿T；混元Hy3',                                 updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: 'Hy Max',         price: '¥468', billing: '月', note: '6.5亿T；混元Hy3，重度用户',                        updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: '通用 Lite',      price: '¥39',  billing: '月', note: '3500万T；集成 GLM/Kimi/MiniMax 等主流国产模型',    updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: '通用 Standard',  price: '¥99',  billing: '月', note: '1亿T；通用模型',                                  updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: '通用 Pro',       price: '¥299', billing: '月', note: '3.2亿T；通用模型',                                updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: '通用 Max',       price: '¥599', billing: '月', note: '6.5亿T；通用模型，重度用户',                        updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: '企业版·轻享',    price: '¥100',  billing: '月', note: '~5000万T；含 Auto 智能路由，多 API Key 管控',      updatedAt: '2026-07-09' },
  { product: '腾讯云 Token Plan', vendor: '腾讯',       track: '模型 API 平台（集成）', plan: '企业版·专业',    price: '¥1,000', billing: '月', note: '~10万积分；覆盖 GLM/Kimi/MiniMax，积分池管理',     updatedAt: '2026-07-09' },

  // ===== MiniMax（稀宇科技，单家模型 API）· 模型 API（单家）=====
  { product: 'MiniMax',        vendor: '稀宇科技',     track: '模型 API（单家）',   plan: 'Token Plan Plus',  price: '¥49',  billing: '月', note: '全模态统一订阅（文本/语音/图像/视频/音乐）；按年¥490/年更省', updatedAt: '2026-07-09' },
  { product: 'MiniMax',        vendor: '稀宇科技',     track: '模型 API（单家）',   plan: 'Token Plan Max',   price: '¥119', billing: '月', note: '最受欢迎档；按年¥1,190/年更省',                  updatedAt: '2026-07-09' },
  { product: 'MiniMax',        vendor: '稀宇科技',     track: '模型 API（单家）',   plan: 'Token Plan Ultra', price: '¥469', billing: '月', note: '按年¥4,690/年更省；支持视频生成5条/日',          updatedAt: '2026-07-09' },

  // ===== GLM（智谱 AI，单家模型 API + Coding Plan）· 模型 API（单家）=====
  { product: 'GLM',            vendor: '智谱 AI',      track: '模型 API（单家）',   plan: 'Coding Plan Lite', price: '¥49',   billing: '月', note: '国内版；每5h≈80 prompts/周≈400；含 GLM-5.2/5-Turbo/4.7', updatedAt: '2026-07-09' },
  { product: 'GLM',            vendor: '智谱 AI',      track: '模型 API（单家）',   plan: 'Coding Plan Pro',  price: '¥149',  billing: '月', note: '国内版；每5h≈400 prompts/周≈2000；含图像视频理解+联网搜索MCP', updatedAt: '2026-07-09' },
  { product: 'GLM',            vendor: '智谱 AI',      track: '模型 API（单家）',   plan: 'Coding Plan Max',  price: '¥469',  billing: '月', note: '国内版；每5h≈1600 prompts/周≈8000；MCP 调用上限最高',   updatedAt: '2026-07-09' },

  // ===== Kimi（月之暗面，单家模型 API）· 模型 API（单家）=====
  { product: 'Kimi',           vendor: '月之暗面',     track: '模型 API（单家）',   plan: 'Code Plan Andante',    price: '¥49',  billing: '月', note: '1倍额度·K2.6旗舰；年付¥39/月更省',            updatedAt: '2026-07-09' },
  { product: 'Kimi',           vendor: '月之暗面',     track: '模型 API（单家）',   plan: 'Code Plan Moderato',   price: '¥99',  billing: '月', note: '4倍额度·多设备共享；年付¥79/月',           updatedAt: '2026-07-09' },
  { product: 'Kimi',           vendor: '月之暗面',     track: '模型 API（单家）',   plan: 'Code Plan Allegretto', price: '¥199', billing: '月', note: '20倍额度·并发30·专属Kimi Claw；年付¥159/月', updatedAt: '2026-07-09' },
  { product: 'Kimi',           vendor: '月之暗面',     track: '模型 API（单家）',   plan: 'Code Plan Allegro',    price: '¥699', billing: '月', note: '60倍额度·Agent集群；年付¥559/月更省',        updatedAt: '2026-07-09' },
];
