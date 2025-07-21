// types/dao.ts

import { registerSchema } from '@/schemas/auth';
import { z } from 'zod';

export interface Snippet {
  id: string;
  content: string;
  language: string;
  visibility: 'public' | 'private';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'owner' | 'viewer';
  username?: string;
}

export type SnippetModalMode = 'view' | 'edit' | 'add';

export type WhitelistUser = Pick<
  z.infer<typeof registerSchema>,
  'email' | 'name'
> & {
  approved: boolean;
};

export type ExtendedSnippet = Snippet & {
  username: string;
  description?: string;
};

export interface SnippetTableProps {
  showCreate?: boolean;
}

export type SnippetQueryParams = {
  filterMine: boolean;
  searchQuery: string;
};