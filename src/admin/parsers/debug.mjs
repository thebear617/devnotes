import { isDate, parseFrontmatter, serializeMarkdown } from './frontmatter.mjs';

const subcategoriesByCategory = {
  '站点与应用': ['UI/UX', '内容数据', '构建部署', '架构渲染'],
  '开发工具': ['Agent', '环境依赖', '架构框架'],
  '系统与平台': ['操作系统', '计算机网络'],
};
const categories = Object.keys(subcategoriesByCategory);
const subcategories = Object.values(subcategoriesByCategory).flat();
const fieldOrder = ['title', 'date', 'updated', 'slug', 'category', 'subcategory', 'description'];

export const debugParser = {
  id: 'debug',
  label: 'Debug 库',
  description: '按领域和主题整理开发调试记录。',
  root: 'debug',
  defaultPath: 'new-debug-note.md',
  sectionDescriptions: {
    '内容核心': '标题和摘要会展示在 Debug 列表与详情页。',
    '内容归类': '用领域和主题信息整理调试记录。',
    '文件与发布': '文件路径、slug 和日期用于发布信息。',
  },
  defaultFrontmatter: {
    title: '', date: '', updated: '', slug: '', category: '站点与应用', subcategory: 'UI/UX', description: '',
  },
  fields: [
    { id: 'title', label: '标题', type: 'text', required: true, section: '内容核心' },
    { id: 'description', label: '摘要', type: 'textarea', section: '内容核心' },
    { id: 'category', label: '一级分类', type: 'select', options: categories, required: true, filterable: true, section: '内容归类' },
    { id: 'subcategory', label: '二级分类', type: 'select', options: subcategories, optionsBy: subcategoriesByCategory, dependsOn: 'category', required: true, filterable: true, section: '内容归类' },
    { id: 'date', label: '发布日期', type: 'date', required: true, section: '文件与发布' },
    { id: 'updated', label: '更新日期（保存时自动更新）', type: 'date', readonly: true, section: '文件与发布' },
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
    if (frontmatter.updated && !isDate(frontmatter.updated)) errors.push('更新日期必须使用 YYYY-MM-DD');
    if (!frontmatter.slug?.trim()) errors.push('slug 不能为空');
    if (!categories.includes(frontmatter.category)) errors.push('一级分类不在当前 schema 允许范围内');
    if (!subcategoriesByCategory[frontmatter.category]?.includes(frontmatter.subcategory)) errors.push('二级分类不属于当前一级分类');
    if (!relativePath || !relativePath.endsWith('.md')) errors.push('路径必须是 Markdown 文件');
    return errors;
  },
};
