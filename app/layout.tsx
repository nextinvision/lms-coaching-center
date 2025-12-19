import type { Metadata } from 'next'
import './globals.css'
import Navbar from "@/components/student/Navbar";

export const metadata: Metadata = {
  title: 'LMS Coaching Center',
  description: 'Comprehensive learning management system for coaching centers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
