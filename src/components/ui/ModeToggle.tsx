'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant='outline'
      size='icon'
      className='rounded-full'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className='h-4 w-4' />
      ) : (
        <Moon className='h-4 w-4' />
      )}
    </Button>
  );
}
