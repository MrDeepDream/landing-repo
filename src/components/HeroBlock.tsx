'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { getIcon, type IconName } from '@/lib/icons'
import { getGradientClasses, type GradientPreset } from '@/lib/gradients'
import type { Media } from '@/payload-types'

export interface HeroBlockProps {
  layout: 'centered' | 'split-left' | 'split-right'
  background?: {
    type?: 'color' | 'gradient' | 'image' | null
    color?: string | null
    gradient?: GradientPreset | string | null
    image?: string | Media | null
    overlay?: boolean | null
    overlayOpacity?: number | null
  } | null
  badge?: {
    text?: string | null
    icon?: IconName | string | null
    gradient?: GradientPreset | string | null
  } | null
  headline: string
  subheadline?: string | null
  bulletPoints?: Array<{
    icon?: IconName | string | null
    text: string
    id?: string | null
  }> | null
  primaryCTA?: {
    label?: string | null
    url?: string | null
    style?: 'solid' | 'outline' | null
    openInNewTab?: boolean | null
  } | null
  secondaryCTA?: {
    label?: string | null
    url?: string | null
    style?: 'solid' | 'outline' | null
    openInNewTab?: boolean | null
  } | null
  trustBadges?: Array<{
    image: string | Media
    alt?: string | null
    id?: string | null
  }> | null
  heroImage?: string | Media | null
  enableAnimation?: boolean | null
}

export function HeroBlock({
  layout = 'centered',
  background,
  badge,
  headline,
  subheadline,
  bulletPoints,
  primaryCTA,
  secondaryCTA,
  trustBadges,
  heroImage,
  enableAnimation = true,
}: HeroBlockProps) {
  // Get badge styles
  const BadgeIcon = badge?.icon ? getIcon(badge.icon) : null
  const badgeGradientClasses = badge?.gradient
    ? getGradientClasses(badge.gradient)
    : 'from-indigo-500 to-purple-500'

  // Get background gradient classes
  const bgGradientClasses = background?.gradient
    ? getGradientClasses(background.gradient)
    : 'from-slate-50 to-slate-100'

  // Extract image URL helper
  const getImageUrl = (image: string | Media | null | undefined): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url || null
  }

  const backgroundImageUrl = getImageUrl(background?.image)
  const heroImageUrl = getImageUrl(heroImage)

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

  const imageVariants = enableAnimation
    ? {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { delay: 0.4, duration: 0.6 },
      }
    : {}

  // Render CTA button
  const renderCTA = (cta: NonNullable<HeroBlockProps['primaryCTA']>) => {
    if (!cta.label || !cta.url) return null

    const baseClasses =
      'inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200'

    const styleClasses =
      cta.style === 'outline'
        ? 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'

    return (
      <Link
        href={cta.url}
        target={cta.openInNewTab ? '_blank' : '_self'}
        rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
        className={`${baseClasses} ${styleClasses}`}
      >
        {cta.label}
      </Link>
    )
  }

  // Render background
  const renderBackground = () => {
    if (background?.type === 'image' && backgroundImageUrl) {
      return (
        <>
          <Image src={backgroundImageUrl} alt="" fill className="object-cover" priority />
          {background.overlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: (background.overlayOpacity || 50) / 100 }}
            />
          )}
        </>
      )
    }

    if (background?.type === 'gradient') {
      return <div className={`absolute inset-0 bg-gradient-to-br ${bgGradientClasses}`} />
    }

    if (background?.type === 'color' && background.color) {
      return <div className="absolute inset-0" style={{ backgroundColor: background.color }} />
    }

    // Default gradient background
    return <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50" />
  }

  // Determine text color based on background
  const hasImageBackground = background?.type === 'image' && backgroundImageUrl
  const textColorClass =
    hasImageBackground && background?.overlay ? 'text-white' : 'text-foreground'
  const mutedTextColorClass =
    hasImageBackground && background?.overlay ? 'text-white/80' : 'text-muted-foreground'

  // Centered layout
  if (layout === 'centered') {
    return (
      <motion.section
        {...containerVariants}
        className="relative min-h-[70vh] overflow-hidden py-20 md:py-28"
      >
        {renderBackground()}

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            {...contentVariants}
            className="mx-auto flex max-w-4xl flex-col items-center text-center"
          >
            {/* Badge */}
            {badge?.text && (
              <div
                className={`mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${badgeGradientClasses} px-5 py-2 shadow-lg`}
              >
                {BadgeIcon && <BadgeIcon className="h-4 w-4 text-white" />}
                <span className="text-sm font-medium text-white">{badge.text}</span>
              </div>
            )}

            {/* Headline */}
            <h1
              className={`mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl ${textColorClass}`}
            >
              {headline}
            </h1>

            {/* Subheadline */}
            {subheadline && (
              <p className={`mb-8 max-w-2xl text-lg md:text-xl ${mutedTextColorClass}`}>
                {subheadline}
              </p>
            )}

            {/* Bullet Points */}
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="mb-8 flex flex-col gap-3 text-left sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
                {bulletPoints.map((point, index) => {
                  const PointIcon = point.icon ? getIcon(point.icon) : null
                  return (
                    <li
                      key={point.id || index}
                      className={`flex items-center gap-2 ${mutedTextColorClass}`}
                    >
                      {PointIcon ? (
                        <PointIcon className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                      <span>{point.text}</span>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* CTAs */}
            {(primaryCTA?.label || secondaryCTA?.label) && (
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:gap-4">
                {primaryCTA && renderCTA(primaryCTA)}
                {secondaryCTA && renderCTA(secondaryCTA)}
              </div>
            )}

            {/* Trust Badges */}
            {trustBadges && trustBadges.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-70">
                {trustBadges.map((badge, index) => {
                  const badgeUrl = getImageUrl(badge.image)
                  if (!badgeUrl) return null
                  return (
                    <div key={badge.id || index} className="relative h-10 w-auto">
                      <Image
                        src={badgeUrl}
                        alt={badge.alt || 'Trust badge'}
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain grayscale transition-all hover:grayscale-0"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>
    )
  }

  // Split layout (left or right)
  const isImageRight = layout === 'split-left'

  return (
    <motion.section
      {...containerVariants}
      className="relative min-h-[70vh] overflow-hidden py-16 md:py-24"
    >
      {renderBackground()}

      <div className="container relative z-10 mx-auto px-4">
        <div
          className={`flex flex-col items-center gap-12 lg:flex-row lg:gap-16 ${
            isImageRight ? '' : 'lg:flex-row-reverse'
          }`}
        >
          {/* Content Side */}
          <motion.div {...contentVariants} className="flex-1 text-center lg:text-left">
            {/* Badge */}
            {badge?.text && (
              <div
                className={`mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${badgeGradientClasses} px-5 py-2 shadow-lg`}
              >
                {BadgeIcon && <BadgeIcon className="h-4 w-4 text-white" />}
                <span className="text-sm font-medium text-white">{badge.text}</span>
              </div>
            )}

            {/* Headline */}
            <h1
              className={`mb-6 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl ${textColorClass}`}
            >
              {headline}
            </h1>

            {/* Subheadline */}
            {subheadline && (
              <p className={`mb-8 text-lg md:text-xl ${mutedTextColorClass}`}>{subheadline}</p>
            )}

            {/* Bullet Points */}
            {bulletPoints && bulletPoints.length > 0 && (
              <ul className="mb-8 flex flex-col gap-3">
                {bulletPoints.map((point, index) => {
                  const PointIcon = point.icon ? getIcon(point.icon) : null
                  return (
                    <li
                      key={point.id || index}
                      className={`flex items-center gap-3 ${mutedTextColorClass}`}
                    >
                      {PointIcon ? (
                        <PointIcon className="h-5 w-5 flex-shrink-0 text-indigo-600" />
                      ) : (
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-600" />
                      )}
                      <span>{point.text}</span>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* CTAs */}
            {(primaryCTA?.label || secondaryCTA?.label) && (
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                {primaryCTA && renderCTA(primaryCTA)}
                {secondaryCTA && renderCTA(secondaryCTA)}
              </div>
            )}

            {/* Trust Badges */}
            {trustBadges && trustBadges.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-6 opacity-70 lg:justify-start">
                {trustBadges.map((badge, index) => {
                  const badgeUrl = getImageUrl(badge.image)
                  if (!badgeUrl) return null
                  return (
                    <div key={badge.id || index} className="relative h-8 w-auto">
                      <Image
                        src={badgeUrl}
                        alt={badge.alt || 'Trust badge'}
                        width={100}
                        height={32}
                        className="h-8 w-auto object-contain grayscale transition-all hover:grayscale-0"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Image Side */}
          {heroImageUrl && (
            <motion.div {...imageVariants} className="flex-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl lg:aspect-square">
                <Image src={heroImageUrl} alt={headline} fill className="object-cover" priority />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
