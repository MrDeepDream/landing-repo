'use client'

import { motion, type Variants } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import type { Media } from '@/payload-types'
import { GlassTag } from './GlassTag'

export interface AboutBlockProps {
  title?: string | null
  image?: string | Media | null
  badges?: { emoji?: string | null; text: string; id?: string | null }[] | null
  description?: string | null
  ctaLabel?: string | null
  ctaLinkType?: ('page' | 'external' | 'anchor') | null
  ctaPage?: (string | { slug?: string | null }) | null
  ctaUrl?: string | null
  ctaAnchor?: string | null
  ctaOpenInNewTab?: boolean | null
  enableAnimation?: boolean | null
  locale?: string
}

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

function resolveCtaHref(props: AboutBlockProps): string | undefined {
  const linkType = props.ctaLinkType ?? 'external'
  switch (linkType) {
    case 'page': {
      const page = props.ctaPage
      if (typeof page === 'object' && page?.slug) {
        return `/${props.locale || 'uk'}/${page.slug}`
      }
      return undefined
    }
    case 'external': {
      const url = props.ctaUrl || undefined
      if (url?.startsWith('#')) return url
      return url
    }
    case 'anchor':
      return props.ctaAnchor ? `#${props.ctaAnchor}` : undefined
    default:
      return props.ctaUrl || undefined
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

export function AboutBlock({
  title,
  image,
  badges,
  description,
  ctaLabel,
  ctaLinkType,
  ctaPage,
  ctaUrl,
  ctaAnchor,
  ctaOpenInNewTab,
  enableAnimation = true,
  locale,
}: AboutBlockProps) {
  const imageData = typeof image === 'object' ? (image as Media) : null
  const imageUrl = imageData?.url

  const Wrapper = enableAnimation ? motion.section : 'section'
  const Item = enableAnimation ? motion.div : 'div'

  return (
    <Wrapper
      {...(enableAnimation
        ? {
            variants: sectionVariants,
            initial: 'hidden',
            whileInView: 'visible',
            viewport: { once: true, margin: '-80px' },
          }
        : {})}
      className="relative overflow-hidden"
    >
      {title && (
        <Item {...(enableAnimation ? { variants: fadeUp } : {})} className="mb-8 sm:mb-10 md:mb-14">
          <h2 className="text-[40px] font-bold uppercase leading-[90%] -tracking-[0.04em] text-white">
            {title}
          </h2>
        </Item>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left column — image */}
        <Item {...(enableAnimation ? { variants: fadeUp } : {})}>
          {imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                src={imageUrl}
                alt={imageData?.alt || ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl" />
          )}
        </Item>

        {/* Right column — badges, description, CTA */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Badges */}
          {badges && badges.length > 0 && (
            <Item
              {...(enableAnimation ? { variants: fadeUp } : {})}
              className="mb-8 flex flex-wrap gap-2 sm:gap-3"
            >
              {badges.map((badge, i) => (
                <GlassTag
                  key={badge.id ?? i}
                  className="px-3.5 py-1.5 text-sm text-white sm:px-4 sm:py-2"
                >
                  {badge.emoji && <span>{badge.emoji}</span>}
                  <span>{badge.text}</span>
                </GlassTag>
              ))}
            </Item>
          )}

          {/* Description */}
          {description && (
            <Item {...(enableAnimation ? { variants: fadeUp } : {})}>
              <div className="space-y-4">
                {description.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-base font-light leading-[120%] -tracking-[0.04em] text-white"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Item>
          )}

          {/* CTA */}
          {ctaLabel &&
            (() => {
              const href = resolveCtaHref({ ctaLinkType, ctaPage, ctaUrl, ctaAnchor, locale })
              if (!href) return null
              const anchor = isAnchorHref(href)
              const openInNewTab = !anchor && ctaOpenInNewTab
              const className =
                'inline-flex items-center justify-center rounded-[15px] bg-[#00120F] px-[45px] py-[17px] text-[16px] font-normal leading-none tracking-normal text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141,inset_0_4px_12px_0_rgba(5,176,143,0.3),inset_0_0_25px_0_rgba(5,176,143,0.3)] transition-all duration-300 hover:bg-[#025A4A] hover:shadow-[0_0_35px_0_rgba(56,255,126,0.25),inset_0_0_0_1px_#00785E,inset_0_4px_16px_0_rgba(5,176,143,0.5),inset_0_0_30px_0_rgba(5,176,143,0.4)] active:scale-[0.97]'
              return (
                <Item {...(enableAnimation ? { variants: fadeUp } : {})}>
                  {anchor ? (
                    <a
                      href={href}
                      className={className}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToAnchor(href)
                      }}
                    >
                      {ctaLabel}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      target={openInNewTab ? '_blank' : undefined}
                      rel={openInNewTab ? 'noopener noreferrer' : undefined}
                      className={className}
                    >
                      {ctaLabel}
                    </Link>
                  )}
                </Item>
              )
            })()}
        </div>
      </div>
    </Wrapper>
  )
}
