'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { LoginForm } from '@/components/auth/login-form';
import { GridSmallBackground } from '@/components/ui/GridSmallBackgroundDemo';
import { Suspense } from 'react';

function LoginWrapper() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type');
    const token_hash = searchParams.get('token_hash');
    const error =
      searchParams.get('error_description') || searchParams.get('error');

    if (type === 'signup' && token_hash) {
      toast.success('✅ Email confirmed! You can now log in.');
    }

    if (error) {
      toast.error(`❌ ${error}`);
    }
  }, [searchParams]);

  return <LoginForm />;
}

export default function Login() {
  return (
    <GridSmallBackground>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginWrapper />
      </Suspense>
    </GridSmallBackground>
  );
}
