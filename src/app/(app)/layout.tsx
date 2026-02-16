import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { AccessibilityProvider } from '@/components/providers/AccessibilityProvider'
import '../globals.css'

const eUkraine = localFont({
  src: [
    {
      path: '../../fonts/e-Ukraine-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../fonts/e-Ukraine-UltraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../fonts/e-Ukraine-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../fonts/e-Ukraine-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../fonts/e-Ukraine-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../fonts/e-Ukraine-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-e-ukraine',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Payload Platform',
    template: '%s | Payload Platform',
  },
  description: 'Modern platform built with Next.js and Payload CMS',
  keywords: ['Next.js', 'Payload CMS', 'React', 'TypeScript'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Organization',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: process.env.NEXT_PUBLIC_SERVER_URL,
    siteName: 'Payload Platform',
    title: 'Payload Platform',
    description: 'Modern platform built with Next.js and Payload CMS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload Platform',
    description: 'Modern platform built with Next.js and Payload CMS',
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * App Layout
 * Wraps the main application with providers and shared layouts
 * This is a server component that wraps client components
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${eUkraine.variable} font-sans antialiased`}>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  )
}
