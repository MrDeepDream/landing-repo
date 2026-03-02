'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

interface CTAProps {
  label?: string | null
  linkType?: ('page' | 'external' | 'anchor') | null
  page?: (string | { slug?: string | null }) | null
  url?: string | null
  anchor?: string | null
  style?: 'solid' | 'outline' | null
  openInNewTab?: boolean | null
}

export interface SectionHeaderBlockProps {
  title?: string | null
  subtitle?: string | null
  description?: string | null
  primaryCTA?: CTAProps | null
  secondaryCTA?: CTAProps | null
  enableAnimation?: boolean | null
  layout?: 'centered' | 'left' | 'right' | null
  locale?: string
}

function resolveCtaHref(cta: CTAProps, locale?: string): string | undefined {
  const linkType = cta.linkType ?? 'external'
  switch (linkType) {
    case 'page': {
      const page = cta.page
      if (typeof page === 'object' && page?.slug) {
        return `/${locale || 'uk'}/${page.slug}`
      }
      return undefined
    }
    case 'external': {
      const url = cta.url || undefined
      if (url?.startsWith('#')) return url
      return url
    }
    case 'anchor':
      return cta.anchor ? `#${cta.anchor}` : undefined
    default:
      return cta.url || undefined
  }
}

function isAnchorHref(href: string): boolean {
  return href.startsWith('#')
}

function scrollToAnchor(href: string) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
    window.history.pushState(null, '', href)
  }
}

export function SectionHeaderBlock({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  enableAnimation = true,
  layout = 'centered',
  locale,
}: SectionHeaderBlockProps) {
  // Layout alignment classes
  const getAlignmentClasses = () => {
    const effectiveLayout = layout || 'centered'
    switch (effectiveLayout) {
      case 'left':
        return 'text-left items-start'
      case 'right':
        return 'text-right items-end'
      case 'centered':
      default:
        return 'text-center items-center'
    }
  }

  const alignmentClasses = getAlignmentClasses()

  // If only one field has content, make it white
  const filledCount = [title, subtitle, description].filter(Boolean).length
  const soloWhite = filledCount === 1

  // Animation variants
  const containerVariants = enableAnimation
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  const contentVariants = enableAnimation
    ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.2, duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...containerVariants}>
      <div className="container mx-auto px-4">
        <motion.div {...contentVariants} className={`flex flex-col ${alignmentClasses} mb-12`}>
          {title && (
            <h2 className="mb-4 text-[40px] font-bold uppercase leading-[90%] -tracking-[0.04em] text-white">
              {title}
            </h2>
          )}

          {subtitle && (
            <p
              className={`mb-2 text-xl ${soloWhite ? 'text-white' : 'text-muted-foreground'} ${layout === 'centered' ? 'mx-auto' : ''}`}
            >
              {subtitle}
            </p>
          )}

          {description && (
            <p
              className={`${soloWhite ? 'text-white' : 'text-muted-foreground'} ${layout === 'centered' ? 'mx-auto' : ''}`}
            >
              {description}
            </p>
          )}

          {(primaryCTA?.label || secondaryCTA?.label) && (
            <div
              className={`mt-6 flex flex-col gap-4 sm:flex-row ${layout === 'centered' ? 'sm:justify-center' : layout === 'right' ? 'sm:justify-end' : 'sm:justify-start'}`}
            >
              {primaryCTA?.label &&
                (() => {
                  const href = resolveCtaHref(primaryCTA, locale)
                  if (!href) return null
                  const anchor = isAnchorHref(href)
                  const openInNewTab = !anchor && primaryCTA.openInNewTab
                  const className = `inline-flex items-center justify-center rounded-[15px] px-[45px] py-[17px] text-[16px] font-normal leading-none tracking-normal transition-all duration-300 ${
                    primaryCTA.style === 'outline'
                      ? 'bg-[#00120F] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141,inset_0_4px_12px_0_rgba(5,176,143,0.3),inset_0_0_25px_0_rgba(5,176,143,0.3)] hover:bg-[#025A4A] hover:shadow-[0_0_35px_0_rgba(56,255,126,0.25),inset_0_0_0_1px_#00785E,inset_0_4px_16px_0_rgba(5,176,143,0.5),inset_0_0_30px_0_rgba(5,176,143,0.4)] active:scale-[0.97]'
                      : 'bg-[#025A4A] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141] hover:bg-[#037A63] hover:shadow-[0_0_35px_0_rgba(56,255,126,0.25),inset_0_0_0_1px_#00785E] active:scale-[0.97]'
                  }`
                  if (anchor) {
                    return (
                      <a
                        href={href}
                        className={className}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToAnchor(href)
                        }}
                      >
                        {primaryCTA.label}
                      </a>
                    )
                  }
                  return (
                    <Link
                      href={href}
                      target={openInNewTab ? '_blank' : undefined}
                      rel={openInNewTab ? 'noopener noreferrer' : undefined}
                      className={className}
                    >
                      {primaryCTA.label}
                    </Link>
                  )
                })()}
              {secondaryCTA?.label &&
                (() => {
                  const href = resolveCtaHref(secondaryCTA, locale)
                  if (!href) return null
                  const anchor = isAnchorHref(href)
                  const openInNewTab = !anchor && secondaryCTA.openInNewTab
                  const className = `inline-flex items-center justify-center rounded-[15px] px-[45px] py-[17px] text-[16px] font-normal leading-none tracking-normal transition-all duration-300 ${
                    secondaryCTA.style === 'outline'
                      ? 'bg-[#00120F] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141,inset_0_4px_12px_0_rgba(5,176,143,0.3),inset_0_0_25px_0_rgba(5,176,143,0.3)] hover:bg-[#025A4A] hover:shadow-[0_0_35px_0_rgba(56,255,126,0.25),inset_0_0_0_1px_#00785E,inset_0_4px_16px_0_rgba(5,176,143,0.5),inset_0_0_30px_0_rgba(5,176,143,0.4)] active:scale-[0.97]'
                      : 'bg-[#025A4A] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141] hover:bg-[#037A63] hover:shadow-[0_0_35px_0_rgba(56,255,126,0.25),inset_0_0_0_1px_#00785E] active:scale-[0.97]'
                  }`
                  if (anchor) {
                    return (
                      <a
                        href={href}
                        className={className}
                        onClick={(e) => {
                          e.preventDefault()
                          scrollToAnchor(href)
                        }}
                      >
                        {secondaryCTA.label}
                      </a>
                    )
                  }
                  return (
                    <Link
                      href={href}
                      target={openInNewTab ? '_blank' : undefined}
                      rel={openInNewTab ? 'noopener noreferrer' : undefined}
                      className={className}
                    >
                      {secondaryCTA.label}
                    </Link>
                  )
                })()}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
