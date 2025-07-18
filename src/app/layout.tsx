import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { GridSmallBackground } from '@/components/ui/GridSmallBackgroundDemo';

import './globals.css';

import getMetadata from '@/config/app';

import AppProviders from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-geist`}
      >
        <AppProviders>
          <Toaster richColors />
          <GridSmallBackground>{children}</GridSmallBackground>
        </AppProviders>
      </body>
    </html>
  );
}
