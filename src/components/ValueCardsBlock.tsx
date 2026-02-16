'use client'

import React from 'react'
import { motion, type Variants } from 'motion/react'
import { GlassTag } from './GlassTag'

interface ValueCard {
  text: string
  id?: string | null
}

interface Tag {
  text: string
  id?: string | null
}

export interface ValueCardsBlockProps {
  title?: string | null
  description?: string | null
  tags?: Tag[] | null
  cards?: ValueCard[] | null
  enableAnimation?: boolean | null
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

export function ValueCardsBlock({
  title,
  description,
  tags,
  cards,
  enableAnimation = true,
}: ValueCardsBlockProps) {
  const hasCards = cards && cards.length > 0
  const hasTags = tags && tags.length > 0
  if (!title && !description && !hasCards && !hasTags) return null

  const Wrapper = enableAnimation ? motion.div : 'div'
  const Card = enableAnimation ? motion.div : 'div'
  const Header = enableAnimation ? motion.div : 'div'

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto mb-8 sm:mb-10 md:mb-14">
        {(title || description || hasTags) && (
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
            {title && (
              <h2 className="text-2xl font-bold uppercase tracking-[0.1em] text-white sm:text-3xl sm:tracking-[0.2em] md:text-4xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-base text-gray-400 sm:text-lg">
                {description.split('\n').map((line, i, arr) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            )}
            {tags && tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <GlassTag
                    key={tag.id ?? i}
                    className="px-3 py-1 text-xs text-gray-300 sm:text-sm"
                  >
                    {tag.text}
                  </GlassTag>
                ))}
              </div>
            )}
          </Header>
        )}

        {hasCards && (
          <Wrapper
            {...(enableAnimation
              ? {
                  variants: containerVariants,
                  initial: 'hidden',
                  whileInView: 'visible',
                  viewport: { once: true, margin: '-80px' },
                }
              : {})}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-5"
          >
            {cards!.map((card, index) => (
              <Card
                key={card.id ?? index}
                {...(enableAnimation ? { variants: cardVariants } : {})}
                className="group relative flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#0f1f1a] p-5 text-center transition-colors duration-300 hover:border-teal-500/25 sm:p-6 md:p-8"
              >
                {/* Subtle radial glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,_rgba(20,184,166,0.06)_0%,_transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <p className="relative text-sm font-bold leading-snug text-white sm:text-base">
                  {card.text}
                </p>
              </Card>
            ))}
          </Wrapper>
        )}
      </div>
    </section>
  )
}
