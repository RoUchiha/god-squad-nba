import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NBA God Squad | Draft the Perfect Team',
  description: 'Draft players from historic NBA eras and simulate a perfect season.',
  keywords: ['NBA', 'basketball', 'fantasy', 'team builder', 'season simulation'],
  openGraph: {
    title: 'NBA God Squad',
    description: 'Build the ultimate historical NBA roster and chase 82-0.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen text-gray-100 antialiased">{children}</body>
    </html>
  );
}
