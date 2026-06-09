import type { Metadata } from 'next';
import './globals.css';
import { Geist, Geist_Mono } from 'next/font/google';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Chauffers - Premium Chauffeur Service',
  description: 'Luxury chauffeur service with premium vehicles and professional drivers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-brand-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
