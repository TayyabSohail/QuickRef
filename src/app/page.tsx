'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Hero } from '@/components/landing/Hero';
import { PreviewCard } from '@/components/landing/PreviewCard';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { CallToAction } from '@/components/landing/CallToAction';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const type = url.searchParams.get('type') || 'signup';

    if (code) {
      router.replace(`/auth/login?code=${code}&type=${type}`);
    }
  }, [router]);

  return (
    <div>
      <Hero />
      <PreviewCard />
      <FeatureGrid />
      <CallToAction />
    </div>
  );
}
