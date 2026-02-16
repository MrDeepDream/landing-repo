'use client'

import { motion, type Variants } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Media } from '@/payload-types'
import { GlassTag } from './GlassTag'

export interface AboutBlockProps {
  title?: string | null
  image?: string | Media | null
  badges?: { emoji?: string | null; text: string; id?: string | null }[] | null
  description?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  ctaOpenInNewTab?: boolean | null
  enableAnimation?: boolean | null
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

export function AboutBlock({
  title,
  image,
  badges,
  description,
  ctaLabel,
  ctaUrl,
  ctaOpenInNewTab,
  enableAnimation = true,
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
          <h2 className="text-2xl font-bold uppercase tracking-[0.1em] text-white sm:text-3xl sm:tracking-[0.2em] md:text-4xl">
            {title}
          </h2>
        </Item>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left column — image */}
        <Item {...(enableAnimation ? { variants: fadeUp } : {})}>
          {imageUrl ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.06] sm:rounded-2xl">
              <Image
                src={imageUrl}
                alt={imageData?.alt || ''}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-xl border border-white/[0.06] bg-[#0f1613] sm:rounded-2xl" />
          )}
        </Item>

        {/* Right column — badges, description, CTA */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Badges */}
          {badges && badges.length > 0 && (
            <Item
              {...(enableAnimation ? { variants: fadeUp } : {})}
              className="flex flex-wrap gap-2 sm:gap-3"
            >
              {badges.map((badge, i) => (
                <GlassTag
                  key={badge.id ?? i}
                  className="px-3.5 py-1.5 text-sm text-white/80 sm:px-4 sm:py-2"
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
                  <p key={i} className="text-sm leading-relaxed text-gray-400 sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Item>
          )}

          {/* CTA */}
          {ctaLabel && ctaUrl && (
            <Item {...(enableAnimation ? { variants: fadeUp } : {})}>
              <Link
                href={ctaUrl}
                target={ctaOpenInNewTab ? '_blank' : undefined}
                rel={ctaOpenInNewTab ? 'noopener noreferrer' : undefined}
                className="group/btn inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/[0.06] px-4 py-1.5 text-sm font-medium text-teal-300 transition-all duration-300 hover:border-teal-400/50 hover:bg-teal-500/[0.12] hover:shadow-[0_0_24px_-4px_rgba(20,184,166,0.25)] active:scale-[0.97] sm:px-5 sm:py-2"
              >
                {ctaLabel}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Link>
            </Item>
          )}
        </div>
      </div>
    </Wrapper>
  )
}
