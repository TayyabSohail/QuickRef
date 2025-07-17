'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from './modeToggle';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

interface DashboardNavbarProps {
  search: string;
  setSearch: (val: string) => void;
}

export function DashboardNavbar({ search, setSearch }: DashboardNavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/auth/logout', {
      method: 'GET',
      credentials: 'include',
    });

    router.push('/auth/login');
  };

  return (
    <nav className='fixed inset-x-4 top-6 z-50 mx-auto flex h-16 max-w-screen-xl items-center justify-between rounded-full border bg-background px-6 dark:border-slate-700/70'>
      <div className='text-xl font-bold'>QuickRef</div>

      {/* Center search input */}
      <div className='mx-6 flex-1'>
        <Input
          placeholder='Search snippets...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='mx-auto w-full max-w-md'
        />
      </div>

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
}
