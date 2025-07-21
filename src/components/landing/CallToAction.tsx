'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { paths } from '@/constants/paths';
export function CallToAction() {
  const router = useRouter();

  return (
    <section className='relative isolate overflow-hidden px-6 py-24 text-center sm:py-32 lg:px-8'>
      {/* Glow behind text */}
      <div className='absolute inset-0 -z-10 flex items-center justify-center'>
        <div className='h-[400px] w-[400px] rounded-full bg-primary/20 opacity-30 blur-3xl' />
      </div>

      <div className='mx-auto max-w-3xl'>
        <h2 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>
          Ready to <span className='text-primary'>build faster</span>?
        </h2>
        <p className='mt-4 text-lg text-muted-foreground'>
          Organize your snippets, share securely, and code without friction all
          in one place.
        </p>
        <div className='mt-8'>
          <Button
            onClick={() => router.push(paths.auth.register)}
            size='lg'
            className='px-10 py-6 text-base font-semibold'
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
