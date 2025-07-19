import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ensureUserInDatabase } from '@/actions/auth';
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

    // Use the reusable function from auth.ts
    try {
      await ensureUserInDatabase({
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || '',
        approved: true,
      });
    } catch (dbError) {
      console.error('Database insertion failed:', dbError);
    }
    await supabase.auth.signOut();

    return NextResponse.redirect(
      `${origin}/auth/login?message=Email confirmed successfully! Please log in.`,
    );
  } catch (error) {
    console.error('Confirmation process error:', error);
    return NextResponse.redirect(
      `${origin}/auth/login?error=Confirmation failed`,
    );
  }
}
