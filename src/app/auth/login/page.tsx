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
    const success = searchParams.get('success');
    if (success === 'confirmed') {
      toast.success('✅ Email confirmed! You can now log in.');
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
