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

// export async function login(values: z.infer<typeof loginSchema>) {
//   const supabase = await createSupabaseServerClient();

//   const { data, error: authError } = await supabase.auth.signInWithPassword({
//     email: values.email,
//     password: values.password,
//   });

//   if (authError || !data.session?.user) {
//     return { error: authError?.message ?? 'Login failed' };
//   }

//   const user = data.session.user;

//   // 👇 Check if user already exists in registered_users
//   const { data: existing, error: fetchError } = await supabase
//     .from('registered_users')
//     .select('id')
//     .eq('id', user.id)
//     .single();

//   if (!existing && !fetchError) {
//     // 👇 Insert user into registered_users AFTER login
//     await supabase.from('registered_users').insert({
//       id: user.id,
//       email: user.email,
//       name: user.user_metadata.name ?? '', // adjust if needed
//     });
//   }

//   return { success: true };
// }
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
export async function resetPassword(email: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  return { error };
}
