import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (!token_hash || !type) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login?error=missing_token_or_type`,
    );
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login?success=confirmed`,
  );
}
