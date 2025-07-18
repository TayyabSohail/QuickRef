import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';
import { Database } from '@/types/supabase';

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl.clone();
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Prevent caching
  supabaseResponse.headers.set('Cache-Control', 'no-store');

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

  const pathname = url.pathname;

  if (pathname === '/auth/logout') {
    await supabase.auth.signOut();

    supabaseResponse.cookies.set('sb-access-token', '', {
      maxAge: 0,
      path: '/',
    });
    supabaseResponse.cookies.set('sb-refresh-token', '', {
      maxAge: 0,
      path: '/',
    });

    supabaseResponse.headers.set('Cache-Control', 'no-store');

    return NextResponse.redirect(new URL('/', request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtectedPath = pathname.startsWith('/dashboard');
  const isAuthPath = pathname.startsWith('/auth');
  const isPublicOnlyPath = pathname === '/' || pathname === '/landing';

  if (isProtectedPath && !user) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  const isCallbackPath = pathname.startsWith('/auth/callback');

  if ((isAuthPath || isPublicOnlyPath) && user && !isCallbackPath) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
