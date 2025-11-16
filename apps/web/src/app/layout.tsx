import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PartyPilot - AI Event Planning',
  description: 'Natural language event planning and booking system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
