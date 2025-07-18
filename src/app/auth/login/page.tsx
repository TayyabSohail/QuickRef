'use client';

import { LoginForm } from '@/components/auth/login-form';
import { GridSmallBackground } from '@/components/ui/GridSmallBackgroundDemo';
import { Suspense } from 'react';

export default function Login() {
  return (
    <GridSmallBackground>
      <Suspense fallback={<div>Loading...</div>}>
        <div>
          <LoginForm />
        </div>
      </Suspense>
    </GridSmallBackground>
  );
}
