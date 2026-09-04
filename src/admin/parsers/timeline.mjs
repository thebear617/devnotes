import { isDate, isDateOrDateTime, parseFrontmatter, serializeMarkdown } from './frontmatter.mjs';

const categories = ['开发笔记', '常识笔记', '游戏笔记', '熊窝', '猪窝', '猫猫', '科研笔记', '聊天站', '工具', 'skill'];
const subcategories = ['功能', '内容', '视觉', '架构', '修复'];
const fieldOrder = ['title', 'date', 'updated', 'category', 'subcategory', 'description'];

export const timelineParser = {
  id: 'timeline',
  label: '开发时间线',
  description: '跨站点的版本、功能、内容与视觉演进记录。',
  root: 'timeline',
  defaultPath: 'devnotes-v0121.md',
  sectionDescriptions: {
    '内容核心': '标题使用「对象 [版本]：模块 - 变更主题」格式；摘要会展示在时间线卡片与详情页。',
    '内容归类': '用一级分类和二级分类信息整理版本记录。',
    '文件与发布': '文件路径决定保存位置，日期用于发布信息。',
  },
  defaultFrontmatter: {
    title: '', date: '', updated: '', category: '开发笔记', subcategory: [], description: '',
  },
  fields: [
    { id: 'title', label: '标题', type: 'text', required: true, section: '内容核心' },
    { id: 'description', label: '摘要', type: 'textarea', section: '内容核心' },
    { id: 'category', label: '一级分类', type: 'select', options: categories, required: true, filterable: true, section: '内容归类' },
    { id: 'subcategory', label: '二级分类', type: 'multiselect', options: subcategories, required: true, filterable: true, section: '内容归类' },
    { id: 'date', label: '发布日期', type: 'date', required: true, section: '文件与发布' },
    { id: 'updated', label: '更新时间（保存时自动更新）', type: 'text', readonly: true, section: '文件与发布' },
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
    if (!Array.isArray(frontmatter.subcategory) || frontmatter.subcategory.length === 0 || frontmatter.subcategory.some((value) => !subcategories.includes(value))) {
      errors.push('时间线分类必须是功能、内容、视觉、架构或修复');
    }
    if (!relativePath || !relativePath.endsWith('.md')) errors.push('路径必须是 Markdown 文件');
    return errors;
  },
};
