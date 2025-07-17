import { Metadata } from 'next';

export const appConfig = {
  title: 'QuickRef',
  description:
    'QuickRef is a lightning-fast snippet manager built for developers. Effortlessly store, organize, and retrieve your code anytime.',
  keywords: 'next.js, supabase, react-query, typescript, code',
  logo: '/logo/main.png',
  defaultLocale: 'en-US',
  defaultCurrency: 'USD',
  defaultCountryCode: 'US',
  appUrl: 'http://example.com',
  emails: {
    support: 'support@example.com',
    sender: 'noreply@example.com',
  },
} as const;

export default function getMetadata(): Metadata {
  return {
    metadataBase: new URL(appConfig.appUrl),
    title: { template: `%s | ${appConfig.title}`, default: appConfig.title },
    description: appConfig.description,
    robots: { index: true, follow: true },
    // icons: {
    //   icon: '/favicon/favicon.ico',
    //   shortcut: '/favicon/favicon-16x16.png',
    //   apple: '/favicon/apple-touch-icon.png',
    // },
    // manifest: `/favicon/site.webmanifest`,

    openGraph: {
      url: appConfig.appUrl,
      title: appConfig.title,
      description: appConfig.description,
      siteName: appConfig.title,
      images: [`/main/logo.png`],
      type: 'website',
      locale: appConfig.defaultLocale.replace('-', '_'),
    },

    twitter: {
      card: 'summary_large_image',
      title: appConfig.title,
      description: appConfig.description,
      images: [`/main/logo.png`],
    },
    keywords: [
      'next.js',
      'supabase',
      'react-query',
      'typescript',
      'boilerplate',
      'web development',
    ],
  };
}
