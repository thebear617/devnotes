import { isDate, parseFrontmatter, serializeMarkdown } from './frontmatter.mjs';

const categories = ['开发与实践', '科研', '随想'];
const subcategories = ['基础知识', '典型案例', '学习资源', '配置记录', '综述', '随笔', '时刻'];
const fieldOrder = ['title', 'date', 'updated', 'category', 'subcategory', 'description', 'slug'];

export const knowledgeParser = {
  id: 'knowledge',
  label: '知识库',
  description: '开发实践、科研与个人随想。',
  root: 'knowledge',
  defaultPath: 'development/overviews/new-knowledge.md',
  sectionDescriptions: {
    '内容核心': '标题使用「内容类型：主题对象 - 具体内容」格式；摘要会展示在知识列表与详情页。',
    '内容归类': '用领域和主题信息整理知识内容。',
    '文件与发布': '文件路径决定保存位置，日期用于发布信息。',
  },
  defaultFrontmatter: {
    title: '', date: '', updated: '', category: '开发与实践', subcategory: '基础知识', description: '', slug: '',
  },
  fields: [
    { id: 'title', label: '标题', type: 'text', required: true, section: '内容核心' },
    { id: 'description', label: '摘要', type: 'textarea', section: '内容核心' },
    { id: 'category', label: '一级分类', type: 'select', options: categories, required: true, filterable: true, section: '内容归类' },
    { id: 'subcategory', label: '二级分类', type: 'select', options: subcategories, required: true, filterable: true, section: '内容归类' },
    { id: 'date', label: '发布日期', type: 'date', required: true, section: '文件与发布' },
    { id: 'updated', label: '更新日期', type: 'date', section: '文件与发布' },
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
    if (!categories.includes(frontmatter.category)) errors.push('一级分类不在当前 schema 允许范围内');
    if (!subcategories.includes(frontmatter.subcategory)) errors.push('二级分类不能为空且必须在当前 schema 允许范围内');
    if (!frontmatter.slug?.trim()) errors.push('slug 不能为空');
    if (!relativePath || !relativePath.endsWith('.md')) errors.push('路径必须是 Markdown 文件');
    return errors;
  },
};
