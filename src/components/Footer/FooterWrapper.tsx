import { getSiteData, type SupportedLocale } from '@/lib/payload-data'
import { Footer } from './Footer'
import type { FooterData } from '@/lib/types'

interface FooterWrapperProps {
  locale: string
}

export async function FooterWrapper({ locale }: FooterWrapperProps) {
  const { footer } = await getSiteData(locale as SupportedLocale)

  if (!footer) return null

  return <Footer footerData={footer as FooterData} locale={locale} />
}
