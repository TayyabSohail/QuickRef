import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') || 'signup';

  if (!token_hash) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login?error=missing_token`,
    );
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as 'signup',
  });

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login?success=confirmed`,
  );
}
