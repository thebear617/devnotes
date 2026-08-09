import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const knowledgeCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/knowledge' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    category: z.enum(['开发与实践', '科研', '随想']),
    subcategory: z.enum(['基础知识', '典型案例', '学习资源', '配置记录', '综述', '随笔', '时刻']).optional(),
    description: z.string().default(''),
    slug: z.string().optional(),
  }),
});

const timelineCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/timeline' }),
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
