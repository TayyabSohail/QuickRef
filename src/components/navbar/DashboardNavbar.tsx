'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from './ModeToggle';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { LogOut, Search } from 'lucide-react';

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
    <nav className='fixed inset-x-0 top-0 z-50 mx-auto flex h-16 w-full items-center justify-between border-b-4 border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6'>
      <div className='mx-auto flex w-full max-w-screen-xl items-center justify-between'>
        {/* Logo */}
        <div className='bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent'>
          QuickRef
        </div>

        <div className='relative mx-2 flex max-w-md flex-1 items-center'>
          <Search className='absolute left-3 h-4 w-4 text-muted-foreground' />

          <Input
            placeholder='Search snippets...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full rounded-full border border-muted bg-muted/10 pl-9 pr-9 text-foreground shadow-sm focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-600 dark:bg-muted/20 dark:text-white'
          />

          {search && (
            <button
              type='button'
              onClick={() => setSearch('')}
              className='absolute right-3 text-muted-foreground hover:text-foreground focus:outline-none'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}
        </div>

        {/* Right side controls */}
        <div className='flex items-center gap-2'>
          <ModeToggle />
          <Button
            onClick={handleLogout}
            variant='outline'
            className='rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive-foreground'
          >
            <LogOut className='h-4 w-4 sm:mr-2' />
            <span className='hidden sm:inline'>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
