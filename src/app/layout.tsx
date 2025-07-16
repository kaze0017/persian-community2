import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
// import MapProvider from '@/components/layout/MapProvider';

import Providers from '@/components/layout/Providers';
import Footer from './components/Footer';

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
  authors: [{ name: 'Your Name or Team' }],
  openGraph: {
    title: 'Persian Community Hub',
    description:
      'Discover local businesses and upcoming events in the Persian community.',
    url: 'https://yourdomain.com',
    siteName: 'Persian Community Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Persian Community Hub',
    description:
      'Discover local businesses and upcoming events in the Persian community.',
    site: 'https://keivanarts.com',
    creator: 'Keivan Kazemi',
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
    antialiased bg-no-repeat bg-cover bg-center
    bg-[url('/bg-light.png')] dark:bg-[url('/bg-dark.png')]
  `}
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
      </body>
    </html>
  );
}
