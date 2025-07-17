import { LoginForm } from '@/components/auth/login-form';
import { GridSmallBackground } from '@/components/ui/GridSmallBackgroundDemo';

export default function Login() {
  return (
    <GridSmallBackground>
      <div>
        <LoginForm />
      </div>
    </GridSmallBackground>
  );
}
