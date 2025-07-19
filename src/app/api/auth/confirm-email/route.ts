import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  if (!token || !type) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=Invalid confirmation link`,
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    // Verify the email confirmation token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as 'signup' | 'email_change' | 'recovery',
    });

    if (error || !data.user) {
      console.error('Email confirmation error:', error);
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(error?.message || 'Confirmation failed')}`,
      );
    }

    // Check if user exists in registered_users table
    const { data: existingUser, error: fetchError } = await supabase
      .from('registered_users')
      .select('id')
      .eq('id', data.user.id)
      .single();

    // If user doesn't exist in registered_users, insert them
    if (!existingUser && fetchError?.code === 'PGRST116') {
      const userToInsert = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || '',
        approved: true,
      };

      const { error: insertError } = await supabase
        .from('registered_users')
        .insert([userToInsert]);

      if (insertError) {
        console.error(
          'Failed to insert user into registered_users:',
          insertError,
        );
      }
    }

    // Sign out the user so they have to log in manually
    await supabase.auth.signOut();

    // Redirect to login with success message
    const response = NextResponse.redirect(
      `${origin}/auth/login?message=Email confirmed successfully! Please log in.`,
    );

    return response;
  } catch (error) {
    console.error('Confirmation process error:', error);
    return NextResponse.redirect(
      `${origin}/auth/login?error=Confirmation failed`,
    );
  }
}
