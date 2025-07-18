// /app/auth/callback/page.tsx
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        router.replace(`/auth/login?error=${error}`);
        return;
      }

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          router.replace(`/auth/login?error=invalid_code`);
          return;
        }

        // Parse hash for type
        const hash = window.location.hash;
        const type = new URLSearchParams(hash.replace('#', '')).get('type');

        if (type === 'recovery') {
          router.replace('/auth/reset-password');
        } else if (type === 'signup') {
          router.replace('/auth/login?success=confirmed');
        } else {
          router.replace('/dashboard');
        }
        return;
      }

      router.replace('/');
    };

    handleAuthRedirect();
  }, [router, searchParams]);

  return <p>Processing authentication...</p>;
}

// Wrap in Suspense
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthCallbackHandler />
    </Suspense>
  );
}
