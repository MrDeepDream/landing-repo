'use client'

import { motion, type Variants } from 'motion/react'
import Link from 'next/link'
import { GlassTag } from './GlassTag'

interface ServiceCard {
  title: string
  bulletPoints?: { text: string; id?: string | null }[] | null
  ctaLabel?: string | null
  ctaLinkType?: ('page' | 'external' | 'anchor') | null
  ctaPage?: (string | { slug?: string | null }) | null
  ctaUrl?: string | null
  ctaAnchor?: string | null
  ctaOpenInNewTab?: boolean | null
  id?: string | null
}

interface Tag {
  text: string
  id?: string | null
}

export interface ServiceCardsBlockProps {
  title?: string | null
  cards?: ServiceCard[] | null
  tags?: Tag[] | null
  enableAnimation?: boolean | null
  locale?: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

function resolveCardHref(card: ServiceCard, locale?: string): string | undefined {
  const linkType = card.ctaLinkType ?? 'external'
  switch (linkType) {
    case 'page': {
      const page = card.ctaPage
      if (typeof page === 'object' && page?.slug) {
        return `/${locale || 'uk'}/${page.slug}`
      }
      return undefined
    }
    case 'external': {
      const url = card.ctaUrl || undefined
      if (url?.startsWith('#')) return url
      return url
    }
    case 'anchor':
      return card.ctaAnchor ? `#${card.ctaAnchor}` : undefined
    default:
      return card.ctaUrl || undefined
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

export function ServiceCardsBlock({
  title,
  cards,
  tags,
  enableAnimation = true,
  locale,
}: ServiceCardsBlockProps) {
  if (!cards || cards.length === 0) return null

  const count = cards.length
  const lastRowStart = count - (count % 3 || 3)
  const lastRowSize = count - lastRowStart

  const getCardWidth = (index: number) => {
    if (count === 1) return 'w-full'
    if (count === 2) return 'w-full sm:w-[calc(50%-10px)] lg:w-[calc(50%-12px)]'
    // 3+ cards: check if this card is in an incomplete last row
    if (lastRowSize < 3 && index >= lastRowStart) {
      if (lastRowSize === 1) return 'w-full sm:w-[calc(50%-10px)]'
      // lastRowSize === 2
      return 'w-full sm:w-[calc(50%-10px)] lg:w-[calc(50%-12px)]'
    }
    return 'w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-16px)]'
  }

  const Wrapper = enableAnimation ? motion.div : 'div'
  const Card = enableAnimation ? motion.div : 'div'
  const Header = enableAnimation ? motion.div : 'div'

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto mb-8 sm:mb-10 md:mb-14">
        {title && (
          <Header
            {...(enableAnimation
              ? {
                  variants: headerVariants,
                  initial: 'hidden',
                  whileInView: 'visible',
                  viewport: { once: true, margin: '-60px' },
                }
              : {})}
            className="mb-8 sm:mb-10 md:mb-14"
          >
            <h2 className="text-[40px] font-bold uppercase leading-[90%] -tracking-[0.04em] text-white">
              {title}
            </h2>
          </Header>
        )}

        {tags && tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 sm:mb-8">
            {tags.map((tag, i) => (
              <GlassTag key={tag.id ?? i} className="px-3 py-1 text-xs text-gray-300 sm:text-sm">
                {tag.text}
              </GlassTag>
            ))}
          </div>
        )}

        <Wrapper
          {...(enableAnimation
            ? {
                variants: containerVariants,
                initial: 'hidden',
                whileInView: 'visible',
                viewport: { once: true, margin: '-80px' },
              }
            : {})}
          className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6"
        >
          {cards.map((card, index) => {
            const number = String(index + 1).padStart(2, '0')

            return (
              <Card
                key={card.id ?? index}
                {...(enableAnimation ? { variants: cardVariants } : {})}
                className={`${getCardWidth(index)} group relative flex flex-col rounded-[10px] border border-[#1C3023] p-5 transition-colors duration-300 hover:border-teal-500/25 sm:p-6 md:p-7 lg:p-8`}
                style={{
                  background:
                    'linear-gradient(180deg, #0D1A12 0%, #08110C 22%, #030B06 60%, #030B06 81%)',
                }}
              >
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-b from-teal-500/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                {/* Number */}
                <span className="relative mb-3 inline-block text-xl font-medium leading-[120%] -tracking-[0.04em] text-[#025A4A] sm:mb-5">
                  {number}
                </span>

                {/* Title */}
                <h3 className="relative mb-[54px] mt-8 text-xl font-medium uppercase leading-[110%] -tracking-[0.04em] text-white">
                  {card.title}
                </h3>

                {/* Bullet points */}
                {card.bulletPoints && card.bulletPoints.length > 0 && (
                  <ul className="relative mb-[54px] flex-1 space-y-2 sm:space-y-3">
                    {card.bulletPoints.map((point, i) => (
                      <li
                        key={point.id ?? i}
                        className="flex items-start gap-2.5 text-base font-light leading-[120%] -tracking-[0.04em] text-white sm:gap-3"
                      >
                        <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-white" />
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA */}
                {card.ctaLabel &&
                  (() => {
                    const href = resolveCardHref(card, locale)
                    if (!href) return null
                    const anchor = isAnchorHref(href)
                    const openInNewTab = !anchor && card.ctaOpenInNewTab
                    const className =
                      'inline-flex w-full items-center justify-center rounded-[15px] bg-[#00120F] py-[17px] text-[16px] font-normal leading-none tracking-normal text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141,inset_0_4px_12px_0_rgba(5,176,143,0.3),inset_0_0_25px_0_rgba(5,176,143,0.3)] transition-all duration-300 hover:bg-[#025A4A] hover:shadow-[0_0_35px_0_rgba(56,255,126,0.25),inset_0_0_0_1px_#00785E,inset_0_4px_16px_0_rgba(5,176,143,0.5),inset_0_0_30px_0_rgba(5,176,143,0.4)] active:scale-[0.97]'
                    return (
                      <div className="relative mt-auto pt-1 sm:pt-2">
                        {anchor ? (
                          <a
                            href={href}
                            className={className}
                            onClick={(e) => {
                              e.preventDefault()
                              scrollToAnchor(href)
                            }}
                          >
                            {card.ctaLabel}
                          </a>
                        ) : (
                          <Link
                            href={href}
                            target={openInNewTab ? '_blank' : undefined}
                            rel={openInNewTab ? 'noopener noreferrer' : undefined}
                            className={className}
                          >
                            {card.ctaLabel}
                          </Link>
                        )}
                      </div>
                    )
                  })()}
              </Card>
            )
          })}
        </Wrapper>
      </div>
    </section>
  )
}
