import { defineCollection, z } from 'astro:content';

const knowledgeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    kind: z.enum(['article', 'workflow']),
    category: z.enum(['编程', 'Vibe Coding', '科研', '随想']),
    tags: z.array(z.string()).default([]),
    secondaryTag: z.string().optional(),
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
