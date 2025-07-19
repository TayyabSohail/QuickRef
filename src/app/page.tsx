'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Hero } from '@/components/landing/Hero';
import { PreviewCard } from '@/components/landing/PreviewCard';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { CallToAction } from '@/components/landing/CallToAction';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const type = searchParams.get('type');

    if (code && type === 'signup') {
      router.replace(`/auth/login?code=${code}&type=signup`);
    }
  }, [searchParams, router]);

  return (
    <div>
      <Hero />
      <PreviewCard />
      <FeatureGrid />
      <CallToAction />
    </div>
  );
}
