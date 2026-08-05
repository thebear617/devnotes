import { defineCollection, z } from 'astro:content';

const knowledgeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    category: z.enum(['开发与实践', '科研', '随想']),
    subcategory: z.enum(['基础知识', '典型案例', '学习资源', '配置记录', '综述', '随笔']).optional(),
    description: z.string().default(''),
    slug: z.string().optional(),
  }),
});

const timelineCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    site: z.string().default(''),
  }),
});

export const collections = {
  knowledge: knowledgeCollection,
  timeline: timelineCollection,
};
