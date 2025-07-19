import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const redirect_to = searchParams.get('redirect_to') || '/auth/login';

  if (!token || !type) {
    return NextResponse.redirect(
      new URL('/auth/error?message=Invalid confirmation link', request.url),
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    // Verify the email confirmation token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any,
    });

    if (error) {
      console.error('Email confirmation error:', error);
      return NextResponse.redirect(
        new URL(
          `/auth/login?error=${encodeURIComponent(error.message)}`,
          request.url,
        ),
      );
    }

    // Email confirmed successfully
    return NextResponse.redirect(
      new URL(
        `/auth/login?message=Email confirmed successfully! Please log in.`,
        request.url,
      ),
    );
  } catch (error) {
    console.error('Confirmation process error:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=Confirmation failed', request.url),
    );
  }
}
