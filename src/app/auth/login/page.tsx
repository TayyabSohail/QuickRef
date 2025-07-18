import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LoginUI from './LoginUI';

type Props = {
  searchParams?: {
    token_hash?: string;
    type?: string;
  };
};

export default async function LoginPage({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();

  if (searchParams?.token_hash && searchParams?.type === 'signup') {
    const { error } = await supabase.auth.verifyOtp({
      type: 'signup',
      token_hash: searchParams.token_hash,
    });

    if (error) {
      return redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
    }

    return redirect(`/auth/login?success=confirmed`);
  }

  return <LoginUI />;
}
