'use client';

import { LoginForm } from '@/components/auth/login-form';
import { GridSmallBackground } from '@/components/ui/GridSmallBackgroundDemo';

export default function LoginPage() {
  return (
    <GridSmallBackground>
      <div>
        <LoginForm />
      </div>
    </GridSmallBackground>
  );
}
