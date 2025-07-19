import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { token_hash, password, type } = body;

  if (!token_hash || type !== 'recovery' || !password) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();

    // Step 1: Verify token
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: 'recovery',
      token_hash,
    });

    if (verifyError) {
      return NextResponse.json({ error: Error }, { status: 400 });
    }

    // Step 2: Update password (after session is active)
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      return NextResponse.json({ error: Error}, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    );
  }
}
