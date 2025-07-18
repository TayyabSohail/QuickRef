import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();

  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email'); // ✅ Required
  const type = searchParams.get('type') || 'signup';

  if (!token || !email) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login?error=missing_token_or_email`,
    );
  }

  const { error } = await supabase.auth.verifyOtp({
    type: 'signup',
    token,
    email,
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
