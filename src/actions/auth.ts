'use server';

import { loginSchema, registerSchema } from '@/schemas/auth';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { WhitelistUser } from '@/types/dao';

export async function ensureUserInDatabase(userData: {
  id: string;
  email: string;
  name: string;
  approved?: boolean;
}) {
  const supabase = await createSupabaseServerClient();

  // Check if user already exists in registered_users
  const { data: existingUser, error: fetchError } = await supabase
    .from('registered_users')
    .select('id')
    .eq('id', userData.id)
    .single();

  // If user doesn't exist, insert them
  if (!existingUser && fetchError?.code === 'PGRST116') {
    const userToInsert: WhitelistUser & { id: string } = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      approved: userData.approved ?? true,
    };

    const { error: insertError } = await supabase
      .from('registered_users')
      .insert([userToInsert]);

    if (insertError) {
      console.error(
        'Failed to insert user into registered_users:',
        insertError,
      );
      throw new Error('Failed to add user to database');
    }

    return { inserted: true, user: userToInsert };
  }

  return { inserted: false, user: existingUser };
}

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

  try {
    await ensureUserInDatabase({
      id: data.user.id,
      email: values.email,
      name: values.name,
      approved: true,
    });

    return { success: true };
  } catch (error) {
    return { error: 'User created but failed to add to whitelist.' };
  }
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

  return { success: true };
}

export async function resetPassword(email: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  return { error };
}
