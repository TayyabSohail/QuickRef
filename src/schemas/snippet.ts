import { z } from 'zod';

export const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Code content is required'),
  language: z.string().min(1, 'Language is required'),
  description: z.string().optional(),
});
