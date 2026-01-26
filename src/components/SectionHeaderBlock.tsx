'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { getIcon } from '@/lib/icons'
import { getGradientClasses } from '@/lib/gradients'
import type { IconName } from '@/lib/icons'
import type { GradientPreset } from '@/lib/gradients'
import type { Media } from '@/payload-types'

export interface SectionHeaderBlockProps {
  type: 'small' | 'big'
  title: string
  subtitle?: string | null
  description?: string | null
  badge?: {
    text: string
    icon?: IconName | null
    gradient?: GradientPreset | null
  } | null
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | null
  enableAnimation?: boolean | null
  // New fields
  layout?: 'centered' | 'left' | 'right' | null
  background?: {
    type?: 'none' | 'color' | 'gradient' | 'image' | null
    color?: string | null
    gradient?: GradientPreset | string | null
    image?: string | Media | null
    overlay?: boolean | null
    overlayOpacity?: number | null
  } | null
  secondaryCTA?: {
    label?: string | null
    url?: string | null
    style?: 'solid' | 'outline' | null
    openInNewTab?: boolean | null
  } | null
  bulletPoints?: Array<{
    icon?: IconName | string | null
    text: string
    id?: string | null
  }> | null
}

export function SectionHeaderBlock({
  type = 'small',
  title,
  subtitle,
  description,
  badge,
  headingLevel = 'h2',
  enableAnimation = true,
  layout = 'centered',
  background,
  secondaryCTA,
  bulletPoints,
}: SectionHeaderBlockProps) {
  const HeadingTag = headingLevel || 'h2'
  const IconComponent = badge?.icon ? getIcon(badge.icon) : null
  const badgeGradientClasses = badge?.gradient
    ? getGradientClasses(badge.gradient)
    : 'from-indigo-500 to-purple-500'

  // Background gradient classes
  const bgGradientClasses = background?.gradient
    ? getGradientClasses(background.gradient)
    : 'from-slate-50 to-indigo-50'

  // Extract image URL helper
  const getImageUrl = (image: string | Media | null | undefined): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url || null
  }

  const backgroundImageUrl = getImageUrl(background?.image)

  // Determine if we have a visible background
  const hasBackground = background?.type && background.type !== 'none'
  const hasImageBackground = background?.type === 'image' && backgroundImageUrl

  // Text colors based on background
  const textColorClass =
    hasImageBackground && background?.overlay ? 'text-white' : 'text-foreground'
  const mutedTextColorClass =
    hasImageBackground && background?.overlay ? 'text-white/80' : 'text-muted-foreground'

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

  // Render background
  const renderBackground = () => {
    if (!hasBackground) return null

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

    return null
  }

  // Render CTA button
  const renderCTA = (
    cta: NonNullable<SectionHeaderBlockProps['secondaryCTA']>,
    variant: 'primary' | 'secondary' = 'secondary'
  ) => {
    if (!cta.label || !cta.url) return null

    const baseClasses =
      'inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200'

    const styleClasses =
      cta.style === 'outline' || variant === 'secondary'
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

  // Render bullet points
  const renderBulletPoints = () => {
    if (!bulletPoints || bulletPoints.length === 0) return null

    const effectiveLayout = layout || 'centered'
    const listClasses =
      effectiveLayout === 'centered'
        ? 'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6'
        : 'flex flex-col gap-3'

    return (
      <ul className={`mb-6 ${listClasses}`}>
        {bulletPoints.map((point, index) => {
          const PointIcon = point.icon ? getIcon(point.icon) : null
          return (
            <li
              key={point.id || index}
              className={`flex items-center gap-2 ${mutedTextColorClass}`}
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
    )
  }

  // Wrapper classes for background support
  const wrapperClasses = hasBackground ? 'relative overflow-hidden py-12 md:py-16' : ''

  if (type === 'big') {
    const content = (
      <motion.div
        {...contentVariants}
        className={`flex flex-col ${alignmentClasses} ${hasBackground ? '' : 'mb-8'}`}
      >
        {badge?.text && (
          <div
            className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${badgeGradientClasses} mx-auto mb-6 rounded-full px-6 py-2 shadow-lg ${layout === 'left' ? 'mx-0' : layout === 'right' ? 'ml-auto mr-0' : 'mx-auto'}`}
          >
            {IconComponent && <IconComponent className="h-4 w-4 text-white" />}
            <span className="text-white">{badge.text}</span>
          </div>
        )}

        <HeadingTag
          className={`mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-5xl text-transparent md:text-6xl lg:text-7xl ${hasImageBackground && background?.overlay ? 'from-white via-white to-white' : ''}`}
        >
          {title}
        </HeadingTag>

        {subtitle && (
          <p
            className={`mb-4 max-w-3xl text-xl leading-relaxed md:text-2xl ${mutedTextColorClass} ${layout === 'centered' ? 'mx-auto' : ''}`}
          >
            {subtitle}
          </p>
        )}

        {description && (
          <p
            className={`max-w-2xl text-lg leading-relaxed ${mutedTextColorClass} ${layout === 'centered' ? 'mx-auto' : ''}`}
          >
            {description}
          </p>
        )}

        {renderBulletPoints()}

        {secondaryCTA?.label && secondaryCTA?.url && (
          <div className="mt-6">{renderCTA(secondaryCTA)}</div>
        )}
      </motion.div>
    )

    if (hasBackground) {
      return (
        <motion.section {...containerVariants} className={wrapperClasses}>
          {renderBackground()}
          <div className="container relative z-10 mx-auto px-4">{content}</div>
        </motion.section>
      )
    }

    return (
      <motion.div {...containerVariants}>
        <div className="container mx-auto px-4">{content}</div>
      </motion.div>
    )
  }

  // Small type
  const content = (
    <motion.div
      {...contentVariants}
      className={`flex flex-col ${alignmentClasses} ${hasBackground ? '' : 'mb-12'}`}
    >
      {badge?.text && (
        <div
          className={`mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 ${layout === 'left' ? '' : layout === 'right' ? 'ml-auto' : ''}`}
        >
          {IconComponent && badge.gradient ? (
            <div
              className={`h-4 w-4 bg-gradient-to-r ${badgeGradientClasses} flex items-center justify-center rounded-full`}
            >
              <IconComponent className="h-3 w-3 text-white" />
            </div>
          ) : IconComponent ? (
            <IconComponent className="h-4 w-4 text-indigo-700" />
          ) : (
            <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
          )}
          <span className="text-sm text-indigo-700">{badge.text}</span>
        </div>
      )}

      <HeadingTag className={`mb-4 text-4xl font-bold ${textColorClass}`}>{title}</HeadingTag>

      {subtitle && (
        <p
          className={`mb-2 max-w-2xl text-xl ${mutedTextColorClass} ${layout === 'centered' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}

      {description && (
        <p className={`max-w-2xl ${mutedTextColorClass} ${layout === 'centered' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}

      {renderBulletPoints()}

      {secondaryCTA?.label && secondaryCTA?.url && (
        <div className="mt-4">{renderCTA(secondaryCTA)}</div>
      )}
    </motion.div>
  )

  if (hasBackground) {
    return (
      <motion.section {...containerVariants} className={wrapperClasses}>
        {renderBackground()}
        <div className="container relative z-10 mx-auto px-4">{content}</div>
      </motion.section>
    )
  }

  return (
    <motion.div {...containerVariants}>
      <div className="container mx-auto px-4">{content}</div>
    </motion.div>
  )
}
