import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
// import MapProvider from '@/components/layout/MapProvider';

import Providers from '@/components/layout/Providers';
import Footer from './components/Footer';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Persian Community Hub',
  description:
    'Discover local businesses and upcoming events in the Persian community.',
  keywords: [
    'Persian community',
    'business directory',
    'events',
    'local businesses',
    'community events',
  ],
  authors: [{ name: 'Keivan Kazemi' }],
  openGraph: {
    title: 'Persian Community Hub',
    description:
      'Discover local businesses and upcoming events in the Persian community.',
    url: 'https://persian-community2-vhah.vercel.app/',
    siteName: 'Persian Community Hub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://persian-community2-vhah.vercel.app/meta.png',
        width: 1200,
        height: 630,
        alt: 'Persian Community Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Persian Community Hub',
    description:
      'Discover local businesses and upcoming events in the Persian community.',
    site: '@keivanarts', // if you don't have a Twitter handle, remove this line
    creator: '@keivanarts',
    images: ['https://keivanarts.com/images/og-image.jpg'], // ✅ Same OG image as OpenGraph
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`
    ${geistSans.variable} ${geistMono.variable}
    antialiased bg-no-repeat bg-cover bg-center `}
      >
        <Providers>
          {/* <MapProvider> */}
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position='top-center' />
            <Header />
            <div className='max-w-[1280px] mx-auto px-4'>{children}</div>
            <Footer />
          </ThemeProvider>
          {/* </MapProvider> */}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
