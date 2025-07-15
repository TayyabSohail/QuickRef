import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';
import { Database } from '@/types/supabase';

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone();
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedPath = url.pathname.startsWith('/dashboard');

  if (isProtectedPath && !user) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
