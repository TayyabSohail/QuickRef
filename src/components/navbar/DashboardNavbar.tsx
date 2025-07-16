'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from './modeToggle';
import { useRouter } from 'next/navigation';
import { useUser } from '@supabase/auth-helpers-react';

const DashboardNavbar = () => {
  const user = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/auth/logout');
    router.push('/auth/login');
  };

  return (
    <nav className='fixed inset-x-4 top-6 z-50 mx-auto flex h-16 max-w-screen-xl items-center justify-between rounded-full border bg-background px-4 dark:border-slate-700/70'>
      <div className='text-xl font-bold'>QuickRef</div>

      <div className='flex items-center gap-4'>
        <ModeToggle />

        <Button
          onClick={handleLogout}
          variant='outline'
          className='rounded-full'
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
