import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(10).max(90),
    description: z.string().min(50).max(170),
    keyword: z.string().min(3),
    author: z.string().default('Banksman'),
    category: z.string().default('Site management'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    faq: z
      .array(z.object({ question: z.string().min(5), answer: z.string().min(5) }))
      .default([]),
  }),
});

export const collections = { blog };
