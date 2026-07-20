import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string().default(''),
    slug: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
