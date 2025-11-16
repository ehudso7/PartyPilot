import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PartyPilot - AI-Powered Event Planning',
  description: 'Plan your perfect social outing with natural language',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
