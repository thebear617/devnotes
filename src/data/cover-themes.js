// 开发笔记瀑布流封面主题：不依赖图片，用内容分类稳定映射配色。
const THEMES = {
  teal: { bg: '#DDF1EE', ink: '#193B3A', accent: '#0F9488', quote: 'rgba(15, 148, 136, .18)' },
  blue: { bg: '#E4ECF7', ink: '#26384D', accent: '#4A78B8', quote: 'rgba(74, 120, 184, .18)' },
  amber: { bg: '#F8EED8', ink: '#4A3922', accent: '#C77B19', quote: 'rgba(199, 123, 25, .2)' },
  purple: { bg: '#ECE7F5', ink: '#3D354C', accent: '#8064B5', quote: 'rgba(128, 100, 181, .18)' },
  rose: { bg: '#F7E6E4', ink: '#4B302E', accent: '#C85C51', quote: 'rgba(200, 92, 81, .18)' },
  gray: { bg: '#ECEFED', ink: '#34403E', accent: '#5D7773', quote: 'rgba(93, 119, 115, .18)' },
};

const CATEGORY_THEMES = {
  开发: 'teal',
  实践: 'amber',
  科研: 'purple',
  随想: 'rose',
  '站点与应用': 'blue',
  开发工具: 'teal',
  '系统与平台': 'gray',
};

const THEME_KEYS = Object.keys(THEMES);
const COVER_RATIOS = ['3 / 4', '3 / 4', '1 / 1', '4 / 5', '3 / 4', '5 / 6'];

function stableHash(value) {
  let hash = 2166136261;
  for (const char of String(value ?? '')) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function coverTheme(category) {
  const key = CATEGORY_THEMES[category] || THEME_KEYS[stableHash(category) % THEME_KEYS.length];
  return THEMES[key];
}

export function coverRatio(seed) {
  return COVER_RATIOS[stableHash(seed) % COVER_RATIOS.length];
}

export function coverTitleParts(title, subcategory) {
  const raw = String(title || '').trim();
  const separators = ['：', ':'];
  const separator = separators
    .map((mark) => raw.indexOf(mark))
    .filter((index) => index > 0 && index < raw.length - 1)
    .sort((a, b) => a - b)[0];
  if (separator !== undefined) {
    return { lead: raw.slice(0, separator), main: raw.slice(separator + 1).trim() };
  }
  return { lead: String(subcategory || '').trim(), main: raw };
}
