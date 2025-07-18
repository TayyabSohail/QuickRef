'use server';

import { loginSchema, registerSchema } from '@/schemas/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { WhitelistUser } from '@/types/dao';


export async function register(values: z.infer<typeof registerSchema>) {
  const supabase = await createSupabaseServerClient();

  const { data, error: authError } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: { name: values.name },
    },
  });

  if (authError || !data.user) {
    return { error: authError?.message || 'Signup failed' };
  }

  const user = data.user;

  const userToInsert: WhitelistUser & { id: string } = {
    id: user.id,
    email: values.email,
    name: values.name,
    approved: true,
  };

  const { error: dbError } = await supabase
    .from('registered_users')
    .insert([userToInsert]);

  if (dbError) {
    console.error('DB Insert Error:', dbError);
    return { error: 'User created but failed to add to whitelist.' };
  }

  return { success: true };
}

export async function login(formData: z.infer<typeof loginSchema>) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) return { error: error.message };

  const { data: match } = await supabase
    .from('registered_users')
    .select('id')
    .eq('email', formData.email)
    .maybeSingle();

  if (!match) {
    return { error: 'You are not authorized to log in' };
  }

  redirect('/dashboard');
}
