// 开发笔记 · 价格数据
// 价格按"手动维护 + 标注核对日期"策略更新（见 README）。
// 字段说明：
//   product    产品名（与 data-notes.js 的 product 对应）
//   vendor     厂商
//   track      赛道：AI 原生 IDE / IDE 插件 / 终端 Agent / 云端 Agent / 桌面·办公 Agent
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
  note: '价格核对于各产品官网公开定价，仅供参考，以官网实时为准。'
};

const pricings = [
  { product: 'Qoder',          vendor: '阿里',       track: 'AI 原生 IDE',     plan: '免费额度', price: '¥0',    billing: '—',  note: '预览期免费额度，付费档待官方公布', updatedAt: '2026-07-09' },
  { product: 'Cursor',         vendor: 'Anysphere',  track: 'AI 原生 IDE',     plan: 'Pro',      price: '$20',   billing: '月', note: '个人主力',                    updatedAt: '2026-07-09' },
  { product: 'Cursor',         vendor: 'Anysphere',  track: 'AI 原生 IDE',     plan: 'Business', price: '$40',   billing: '月', note: '团队协作',                    updatedAt: '2026-07-09' },
  { product: 'Trae',           vendor: '字节',        track: 'AI 原生 IDE',     plan: '免费',     price: '¥0',    billing: '—',  note: '全流程自动，目前免费',          updatedAt: '2026-07-09' },
  { product: 'GitHub Copilot', vendor: 'GitHub',      track: 'IDE 插件',        plan: '个人',     price: '$10',   billing: '月', note: '最稳补全，生态王',              updatedAt: '2026-07-09' },
  { product: '通义灵码',        vendor: '阿里云',      track: 'IDE 插件',        plan: '个人版',   price: '¥0',    billing: '—',  note: '个人免费，中文最强',            updatedAt: '2026-07-09' },
  { product: 'Claude Code',    vendor: 'Anthropic',   track: '终端 Agent',      plan: 'API 自付', price: '按量',   billing: '—',  note: '大型重构强，成本看用量',          updatedAt: '2026-07-09' },
  { product: 'WorkBuddy',      vendor: '腾讯',        track: '桌面·办公 Agent', plan: '—',        price: '待确认', billing: '—',  note: '办公工作台，定价未公开',          updatedAt: '2026-07-09' }
];
