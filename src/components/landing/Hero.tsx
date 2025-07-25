'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '../ui/ModeToggle';
import { paths } from '@/constants/paths';

export function Hero() {
  const router = useRouter();

  return (
    <section className='px-6 py-28 text-center md:px-12 lg:px-24'>
      <div className='absolute right-20 top-10'>
        <ModeToggle />
      </div>
      {/* Product name */}
      <h2
        className='mb-3 text-3xl font-medium uppercase tracking-wider'
        style={{ color: 'hsl(var(--primary))' }}
      >
        QuickRef
      </h2>

      {/* Headline */}
      <h1 className='text-3xl font-bold leading-snug tracking-tight sm:text-5xl md:text-6xl'>
        Your Code Snippets,
        <br />
        <span style={{ color: 'hsl(var(--primary))' }}>
          Organized & Accessible
        </span>
      </h1>

      {/* Subheading */}
      <p
        className='mx-auto mt-5 max-w-xl text-base sm:text-lg'
        style={{ color: 'hsl(var(--muted-foreground))' }}
      >
        QuickRef is a lightning-fast snippet manager built for developers.
        Effortlessly store, organize, and retrieve your code anytime.
      </p>

      {/* CTA Buttons */}
      <div className='mt-10 flex flex-wrap justify-center gap-4'>
        <Button size='lg' asChild>
          <Link href='/auth/signup'>Get Started</Link>
        </Button>
        <Button
          size='lg'
          variant='default'
          className='border border-border bg-white text-black shadow-sm transition hover:bg-white hover:shadow-md'
          onClick={() => router.push(paths.auth.login)}
        >
          Sign In
        </Button>
      </div>
    </section>
  );
}
