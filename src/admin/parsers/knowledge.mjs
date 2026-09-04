import { isDate, isDateOrDateTime, parseFrontmatter, serializeMarkdown } from './frontmatter.mjs';

const subcategoriesByCategory = {
  '开发': ['基础知识', '综述', '学习资源', '配置记录', '工具使用心得'],
  '实践': ['PPT', '网页', '图表', '视频', '报告'],
  '科研': ['综述'],
  '随想': ['随笔', '时刻'],
};
const categories = Object.keys(subcategoriesByCategory);
const subcategories = Object.values(subcategoriesByCategory).flat();
const fieldOrder = ['title', 'date', 'updated', 'category', 'subcategory', 'description', 'slug'];
const categoryDirectories = {
  '开发': 'development',
  '实践': 'practice',
  '科研': 'research',
  '随想': 'reflections',
};
const subcategoryDirectories = {
  '基础知识': 'fundamentals',
  '学习资源': 'resources',
  '配置记录': 'configurations',
  '工具使用心得': 'tools',
  '综述': 'overviews',
  'PPT': 'ppt',
  '网页': 'web',
  '图表': 'chart',
  '视频': 'video',
  '报告': 'report',
  '随笔': 'essays',
  '时刻': 'moments',
};

function filenameFromTitle(title) {
  const normalized = String(title || '')
    .trim()
    .replaceAll('\0', '')
    .replaceAll('/', '／')
    .replaceAll('\\', '＼')
    .replace(/\.md$/i, '')
    .trim();
  return normalized && normalized !== '.' && normalized !== '..' ? `${normalized}.md` : null;
}

function expectedPath(frontmatter, relativePath) {
  const categoryDirectory = categoryDirectories[frontmatter.category];
  const subcategoryDirectory = subcategoryDirectories[frontmatter.subcategory];
  const filename = filenameFromTitle(frontmatter.title);
  if (!categoryDirectory || !subcategoryDirectory || !filename || typeof relativePath !== 'string') return null;
  return `${categoryDirectory}/${subcategoryDirectory}/${filename}`;
}

export const knowledgeParser = {
  id: 'knowledge',
  label: '知识库',
  description: '开发、实践、科研与个人随想。',
  root: 'knowledge',
  defaultPath: 'development/fundamentals/new-knowledge.md',
  pathStrategy: {
    categoryField: 'category',
    subcategoryField: 'subcategory',
    categoryDirectories,
    subcategoryDirectories,
  },
  sectionDescriptions: {
    '内容核心': '标题使用「内容类型：主题对象 - 具体内容」格式；摘要会展示在知识列表与详情页。',
    '内容归类': '用领域和主题信息整理知识内容。',
    '文件与发布': '文件路径决定保存位置，日期用于发布信息。',
  },
  defaultFrontmatter: {
    title: '', date: '', updated: '', category: '开发', subcategory: '基础知识', description: '', slug: '',
  },
  fields: [
    { id: 'title', label: '标题', type: 'text', required: true, section: '内容核心' },
    { id: 'description', label: '摘要', type: 'textarea', section: '内容核心' },
    { id: 'category', label: '一级分类', type: 'select', options: categories, required: true, filterable: true, section: '内容归类' },
    { id: 'subcategory', label: '二级分类', type: 'select', options: subcategories, optionsBy: subcategoriesByCategory, dependsOn: 'category', required: true, filterable: true, section: '内容归类' },
    { id: 'date', label: '发布日期', type: 'date', required: true, section: '文件与发布' },
    { id: 'updated', label: '更新时间（保存时自动更新）', type: 'text', readonly: true, section: '文件与发布' },
    { id: 'slug', label: 'slug', type: 'text', required: true, section: '文件与发布' },
  ],
  parse: parseFrontmatter,
  serialize(frontmatter, body) {
    return serializeMarkdown(frontmatter, body, fieldOrder, { omitEmpty: ['updated'] });
  },
  validate(frontmatter, relativePath) {
    const errors = [];
    if (!frontmatter.title?.trim()) errors.push('标题不能为空');
    if (!isDate(frontmatter.date)) errors.push('发布日期必须使用 YYYY-MM-DD');
    if (frontmatter.updated && !isDateOrDateTime(frontmatter.updated)) errors.push('更新日期必须使用 YYYY-MM-DD 或 YYYY-MM-DD HH:mm');
    if (!categories.includes(frontmatter.category)) errors.push('一级分类不在当前 schema 允许范围内');
    if (!subcategoriesByCategory[frontmatter.category]?.includes(frontmatter.subcategory)) errors.push('二级分类不属于当前一级分类');
    if (!frontmatter.slug?.trim()) errors.push('slug 不能为空');
    if (!relativePath || !relativePath.endsWith('.md')) errors.push('路径必须是 Markdown 文件');
    const expected = expectedPath(frontmatter, relativePath);
    if (expected && expected !== relativePath) errors.push('文件路径必须与一级分类、二级分类和标题对应');
    if (!expected && relativePath) errors.push('文件路径无法从当前一级分类、二级分类和标题生成');
    return errors;
  },
};
