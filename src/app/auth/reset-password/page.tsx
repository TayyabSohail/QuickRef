import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/reset-password';

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
