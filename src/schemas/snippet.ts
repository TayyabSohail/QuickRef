import { z } from 'zod';

export const snippetSchema = z.object({
  content: z.string().min(1, 'Code content is required'),
  language: z.string().min(1, 'Language is required'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private']),
});
