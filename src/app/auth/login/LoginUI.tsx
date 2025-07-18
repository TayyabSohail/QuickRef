'use client';

import { LoginForm } from '@/components/auth/login-form';
import { GridSmallBackground } from '@/components/ui/GridSmallBackgroundDemo';

export default function LoginUI() {
  return (
    <GridSmallBackground>
      <div>
        <LoginForm />
      </div>
    </GridSmallBackground>
  );
}
