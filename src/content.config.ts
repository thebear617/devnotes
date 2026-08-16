import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const knowledgeCategories = ['开发与实践', '科研', '随想'] as const;
const knowledgeSubcategories = ['基础知识', '典型案例', '学习资源', '配置记录', '综述', '随笔', '时刻'] as const;
const knowledgeCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/knowledge' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    category: z.enum(knowledgeCategories),
    subcategory: z.enum(knowledgeSubcategories),
    description: z.string().default(''),
    slug: z.string(),
  }),
});

const timelineCategories = [
  '开发笔记',
  '常识笔记',
  '游戏笔记',
  '熊窝',
  '猪窝',
  '猫猫',
  '科研笔记',
  '聊天站',
  '工具',
  'skill',
] as const;

const timelineSubcategories = [
  '功能',
  '内容',
  '视觉',
  '架构',
  '修复',
] as const;

const timelineCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    category: z.enum(timelineCategories),
    subcategory: z.array(z.enum(timelineSubcategories)).min(1),
    description: z.string().default(''),
  }).transform(data => ({
    ...data,
    updated: data.updated || data.date,
  })),
});

const debugSubcategories = {
  '站点与应用': ['UI/UX', '内容数据', '构建部署', '架构渲染'],
  '开发工具': ['Agent', '环境依赖', '架构框架'],
  '系统与平台': ['操作系统', '计算机网络'],
} as const;

const debugCategories = Object.keys(debugSubcategories) as [keyof typeof debugSubcategories, ...(keyof typeof debugSubcategories)[]];
const debugSubcategoryValues = Object.values(debugSubcategories).flat() as [string, ...string[]];
const debugCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/debug' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    slug: z.string(),
    category: z.enum(debugCategories),
    subcategory: z.enum(debugSubcategoryValues),
    description: z.string().default(''),
  }).superRefine((data, ctx) => {
    const allowed = debugSubcategories[data.category] as readonly string[];
    if (!allowed.includes(data.subcategory)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['subcategory'],
        message: `二级分类“${data.subcategory}”不属于一级分类“${data.category}”`,
      });
    }
  }).transform(data => ({
    ...data,
    updated: data.updated || data.date,
  })),
});

export const collections = {
  knowledge: knowledgeCollection,
  timeline: timelineCollection,
  debug: debugCollection,
};
