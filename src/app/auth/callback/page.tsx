'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('Supabase auth error:', error);
        router.replace(`/auth/login?error=${error}`);
        return;
      }

      if (code) {
        try {
          // Exchange the code for a session
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error('Session exchange failed:', exchangeError.message);
            router.replace(`/auth/login?error=invalid_code`);
            return;
          }

          const hash = window.location.hash;
          const params = new URLSearchParams(hash.replace('#', ''));
          const type = params.get('type');

          if (type === 'recovery') {
            router.replace('/auth/reset-password');
          } else if (type === 'signup') {
            router.replace('/auth/login?success=confirmed');
          } else {
            router.replace('/dashboard'); // Or wherever you want to land after login
          }
        } catch (err) {
          console.error('Auth callback error:', err);
          router.replace('/auth/login?error=callback_error');
        }
        return;
      }

      // No code or hash, fallback to home
      router.replace('/');
    };

    handleAuthRedirect();
  }, [router, searchParams]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <p>Processing authentication...</p>
    </div>
  );
}
