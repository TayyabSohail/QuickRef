'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Hero } from '@/components/landing/Hero';
import { PreviewCard } from '@/components/landing/PreviewCard';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { CallToAction } from '@/components/landing/CallToAction';

export default function Home() {
  return (
    <div>
      <Hero />
      <PreviewCard />
      <FeatureGrid />
      <CallToAction />
    </div>
  );
}
