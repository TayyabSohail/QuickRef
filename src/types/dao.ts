// types/dao.ts

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
