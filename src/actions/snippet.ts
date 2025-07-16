'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { snippetSchema } from '@/schemas/snippet';

export async function createSnippet(data: z.infer<typeof snippetSchema>) {
  const supabase = await createSupabaseServerClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) return { error: 'Not authenticated' };

  const { error } = await supabase.from('snippets').insert([
    {
      ...data,
      user_id: user.data.user.id,
      username: user.data.user.user_metadata?.name || user.data.user.email,
    },
  ]);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getSnippets() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('snippets')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSnippet(
  id: string,
  updates: Partial<z.infer<typeof snippetSchema>>,
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('snippets')
    .update(updates)
    .eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteSnippet(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('snippets').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}
