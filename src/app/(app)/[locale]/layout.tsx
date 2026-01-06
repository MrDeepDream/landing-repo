import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getSiteData, type SupportedLocale } from '@/lib/payload-data'

// Force dynamic rendering - this layout uses searchParams for preview mode
export const dynamic = 'force-dynamic'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ preview?: string }>
}

const availableLocales = [
  { code: 'uk', label: 'Ukrainian' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
]

/**
 * Localized Layout
 * Fetches data from Payload CMS and passes to Header and Footer components
 * Falls back to hardcoded defaults if CMS data is unavailable
 * AccessibilityProvider is in parent layout
 */
export default async function LocaleLayout(props: LocaleLayoutProps) {
  const { children, searchParams } = props
  const params = await props.params
  const { locale } = params

  // Ensure locale is always a string
  const localeString: string = typeof locale === 'string' ? locale : 'uk'

  // Check if preview mode is enabled
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const isPreview = resolvedSearchParams.preview === 'true'

  // Try to fetch CMS data, fall back to undefined if not available
  let siteSettings, navigationItems, footer
  try {
    const data = await getSiteData(localeString as SupportedLocale, isPreview)
    siteSettings = data.siteSettings
    navigationItems = data.navigationItems
    footer = data.footer
  } catch {
    // CMS data not available yet - components will use hardcoded defaults
  }

  return (
    <>
      {isPreview && (
        <div className="sticky top-0 z-[100] bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-black">
          Preview Mode - Locale: {localeString} (type: {typeof locale})
        </div>
      )}
      <Header
        siteSettings={siteSettings}
        // Type assertion needed: payload-data.NavigationItem has optional fields
        // that get populated before passing to Header (which expects required fields)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigationItems={navigationItems as any}
        currentLocale={localeString}
        availableLocales={availableLocales}
      />
      <main className="flex-1">{children}</main>
      <Footer siteSettings={siteSettings} footerData={footer} />
    </>
  )
}
