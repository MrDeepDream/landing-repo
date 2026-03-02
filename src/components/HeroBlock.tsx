'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Beams from './Beams'

interface CTAData {
  label?: string | null
  linkType?: ('page' | 'external' | 'anchor') | null
  page?: (string | { slug?: string | null }) | null
  url?: string | null
  anchor?: string | null
  style?: 'solid' | 'outline' | null
  openInNewTab?: boolean | null
}

export interface HeroBlockProps {
  headline: string
  subheadline?: string | null
  primaryCTA?: CTAData | null
  secondaryCTA?: CTAData | null
  enableAnimation?: boolean | null
  isFirstBlock?: boolean
  locale?: string
}

function resolveCtaHref(cta: CTAData, locale?: string): string | undefined {
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
      // Treat URLs starting with # as anchors
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
    // Update URL hash without triggering navigation
    window.history.pushState(null, '', href)
  }
}

export function HeroBlock({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  enableAnimation = true,
  isFirstBlock = false,
  locale,
}: HeroBlockProps) {
  // Animation variants
  const containerVariants = enableAnimation
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 },
      }
    : {}

  const contentVariants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.2, duration: 0.6 },
      }
    : {}

  // Render CTA button
  const renderCTA = (cta: CTAData) => {
    if (!cta.label) return null
    const href = resolveCtaHref(cta, locale)
    if (!href) return null

    const anchor = isAnchorHref(href)
    const openInNewTab = !anchor && cta.openInNewTab

    const baseClasses =
      'inline-flex items-center justify-center rounded-[15px] px-[45px] py-[17px] text-[16px] font-normal leading-none tracking-normal transition-all duration-200'

    const styleClasses =
      cta.style === 'outline'
        ? 'bg-[#00120F] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141,inset_0_4px_12px_0_rgba(5,176,143,0.3),inset_0_0_25px_0_rgba(5,176,143,0.3)] hover:bg-[#025A4A] hover:shadow-[0_0_35px_0_rgba(56,255,126,0.25),inset_0_0_0_1px_#00785E,inset_0_4px_16px_0_rgba(5,176,143,0.5),inset_0_0_30px_0_rgba(5,176,143,0.4)] active:scale-[0.97]'
        : 'bg-[#025A4A] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141] hover:bg-[#037A63] hover:shadow-[0_0_35px_0_rgba(56,255,126,0.25),inset_0_0_0_1px_#00785E] active:scale-[0.97]'

    if (anchor) {
      return (
        <a
          href={href}
          className={`${baseClasses} ${styleClasses}`}
          onClick={(e) => {
            e.preventDefault()
            scrollToAnchor(href)
          }}
        >
          {cta.label}
        </a>
      )
    }

    return (
      <Link
        href={href}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={`${baseClasses} ${styleClasses}`}
      >
        {cta.label}
      </Link>
    )
  }

  return (
    <motion.section
      {...containerVariants}
      className={`relative w-full ${isFirstBlock ? '-mt-[100px] pb-20 pt-[120px] md:pb-28' : 'py-20 md:py-28'}`}
    >
      {/* Beams Background - breaks out of container to full viewport width */}
      <div
        className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2"
        style={{ height: '100%' }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Beams
            beamWidth={3}
            beamHeight={30}
            beamNumber={30}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>
      </div>

      <div className="relative z-10 w-full">
        <motion.div
          {...contentVariants}
          className={`w-full max-w-3xl items-start text-left ${isFirstBlock ? 'mt-16 md:mt-24' : ''}`}
        >
          {/* Headline */}
          <h1 className="mb-6 text-[32px] font-medium uppercase leading-[1.1] tracking-[-0.02em] text-white md:text-[42px] lg:text-[52px]">
            {headline}
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p className="mb-10 max-w-2xl text-[16px] font-normal leading-[1.2] tracking-[-0.04em] text-white/70">
              {subheadline}
            </p>
          )}

          {/* CTAs */}
          {(primaryCTA?.label || secondaryCTA?.label) && (
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-start">
              {primaryCTA && renderCTA(primaryCTA)}
              {secondaryCTA && renderCTA(secondaryCTA)}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}
