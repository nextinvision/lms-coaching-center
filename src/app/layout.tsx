import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '@/shared/components/student/Navbar';
import { Providers } from '@/shared/components/Providers';

export const metadata: Metadata = {
  title: 'LMS Coaching Center',
  description: 'Comprehensive learning management system for coaching centers',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
