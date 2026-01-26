'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { getIcon } from '@/lib/icons'
import { getGradientClasses } from '@/lib/gradients'
import type { IconName } from '@/lib/icons'
import type { GradientPreset } from '@/lib/gradients'
import type { Media } from '@/payload-types'

export interface CallToActionBlockProps {
  heading: string
  description?: string | null
  // Primary button (original link field)
  link?: {
    label?: string | null
    url?: string | null
    openInNewTab?: boolean | null
  } | null
  // Secondary button (new)
  secondaryButton?: {
    label?: string | null
    url?: string | null
    style?: 'solid' | 'outline' | null
    openInNewTab?: boolean | null
  } | null
  // Background configuration
  backgroundStyle?: 'gradient' | 'solid' | 'transparent' | 'image' | null
  backgroundGradient?: GradientPreset | string | null
  backgroundColor?: string | null
  backgroundImage?: string | Media | null
  backgroundOverlay?: boolean | null
  backgroundOverlayOpacity?: number | null
  // Layout options
  alignment?: 'centered' | 'left' | null
  size?: 'compact' | 'standard' | 'large' | null
  // Icon (optional, displayed before heading)
  icon?: IconName | string | null
  // Animation
  enableAnimation?: boolean | null
  id?: string | null
}

export function CallToActionBlock({
  heading,
  description,
  link,
  secondaryButton,
  backgroundStyle = 'gradient',
  backgroundGradient,
  backgroundColor,
  backgroundImage,
  backgroundOverlay = true,
  backgroundOverlayOpacity = 50,
  alignment = 'centered',
  size = 'standard',
  icon,
  enableAnimation = true,
}: CallToActionBlockProps) {
  // Get icon component
  const IconComponent = icon ? getIcon(icon) : null

  // Get gradient classes
  const gradientClasses = backgroundGradient
    ? getGradientClasses(backgroundGradient)
    : 'from-indigo-500 to-purple-500'

  // Extract image URL helper
  const getImageUrl = (image: string | Media | null | undefined): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    return image.url || null
  }

  const backgroundImageUrl = getImageUrl(backgroundImage)

  // Size configuration
  const sizeConfig = {
    compact: {
      padding: 'py-8 px-6 md:py-10 md:px-8',
      headingSize: 'text-2xl md:text-3xl',
      descriptionSize: 'text-base',
      spacing: 'mb-3',
      buttonPadding: 'px-5 py-2.5',
    },
    standard: {
      padding: 'py-12 px-8 md:py-16 md:px-12',
      headingSize: 'text-3xl md:text-4xl',
      descriptionSize: 'text-lg',
      spacing: 'mb-4',
      buttonPadding: 'px-6 py-3',
    },
    large: {
      padding: 'py-16 px-10 md:py-24 md:px-16',
      headingSize: 'text-4xl md:text-5xl lg:text-6xl',
      descriptionSize: 'text-xl md:text-2xl',
      spacing: 'mb-6',
      buttonPadding: 'px-8 py-4',
    },
  }

  const currentSize = sizeConfig[size || 'standard']

  // Alignment classes
  const alignmentClasses =
    alignment === 'left' ? 'text-left items-start' : 'text-center items-center'

  // Determine text colors based on background
  const hasImageBackground = backgroundStyle === 'image' && backgroundImageUrl
  const hasGradientBackground = backgroundStyle === 'gradient'

  // For gradient and image with overlay, use white text
  const useWhiteText = hasGradientBackground || (hasImageBackground && backgroundOverlay)
  const textColorClass = useWhiteText ? 'text-white' : 'text-foreground'
  const mutedTextColorClass = useWhiteText ? 'text-white/80' : 'text-muted-foreground'

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
    if (backgroundStyle === 'image' && backgroundImageUrl) {
      return (
        <>
          <Image src={backgroundImageUrl} alt="" fill className="object-cover" />
          {backgroundOverlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: (backgroundOverlayOpacity || 50) / 100 }}
            />
          )}
        </>
      )
    }

    if (backgroundStyle === 'gradient') {
      return <div className={`absolute inset-0 bg-gradient-to-r ${gradientClasses}`} />
    }

    if (backgroundStyle === 'solid' && backgroundColor) {
      return <div className="absolute inset-0" style={{ backgroundColor }} />
    }

    if (backgroundStyle === 'transparent') {
      return null
    }

    // Default: gradient background (for backward compatibility)
    return <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50" />
  }

  // Render CTA button
  const renderPrimaryButton = () => {
    if (!link?.label || !link?.url) return null

    const baseClasses = `inline-flex items-center justify-center rounded-lg ${currentSize.buttonPadding} text-base font-semibold transition-all duration-200`

    // For gradient/image backgrounds, use white button with dark text
    // For light backgrounds, use indigo button with white text
    const styleClasses = useWhiteText
      ? 'bg-white text-indigo-600 hover:bg-white/90 shadow-lg hover:shadow-xl'
      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'

    return (
      <Link
        href={link.url}
        target={link.openInNewTab ? '_blank' : '_self'}
        rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
        className={`${baseClasses} ${styleClasses}`}
      >
        {link.label}
      </Link>
    )
  }

  const renderSecondaryButton = () => {
    if (!secondaryButton?.label || !secondaryButton?.url) return null

    const baseClasses = `inline-flex items-center justify-center rounded-lg ${currentSize.buttonPadding} text-base font-semibold transition-all duration-200`

    const isSolid = secondaryButton.style === 'solid'

    // For gradient/image backgrounds
    if (useWhiteText) {
      const styleClasses = isSolid
        ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
        : 'border-2 border-white/50 text-white hover:bg-white/10'
      return (
        <Link
          href={secondaryButton.url}
          target={secondaryButton.openInNewTab ? '_blank' : '_self'}
          rel={secondaryButton.openInNewTab ? 'noopener noreferrer' : undefined}
          className={`${baseClasses} ${styleClasses}`}
        >
          {secondaryButton.label}
        </Link>
      )
    }

    // For light backgrounds
    const styleClasses = isSolid
      ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
      : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'

    return (
      <Link
        href={secondaryButton.url}
        target={secondaryButton.openInNewTab ? '_blank' : '_self'}
        rel={secondaryButton.openInNewTab ? 'noopener noreferrer' : undefined}
        className={`${baseClasses} ${styleClasses}`}
      >
        {secondaryButton.label}
      </Link>
    )
  }

  // Wrapper classes
  const wrapperClasses = `my-12 relative overflow-hidden rounded-2xl ${currentSize.padding}`

  return (
    <motion.section {...containerVariants} className={wrapperClasses}>
      {renderBackground()}

      <div className="container relative z-10 mx-auto px-4">
        <motion.div {...contentVariants} className={`flex flex-col ${alignmentClasses}`}>
          {/* Icon */}
          {IconComponent && (
            <div
              className={`${currentSize.spacing} inline-flex items-center justify-center rounded-full p-3 ${
                useWhiteText ? 'bg-white/20' : 'bg-indigo-100'
              }`}
            >
              <IconComponent
                className={`h-8 w-8 ${useWhiteText ? 'text-white' : 'text-indigo-600'}`}
              />
            </div>
          )}

          {/* Heading */}
          <h2
            className={`${currentSize.spacing} ${currentSize.headingSize} font-bold leading-tight ${textColorClass}`}
          >
            {heading}
          </h2>

          {/* Description */}
          {description && (
            <p
              className={`${currentSize.spacing} max-w-2xl ${currentSize.descriptionSize} ${mutedTextColorClass} ${
                alignment === 'centered' ? 'mx-auto' : ''
              }`}
            >
              {description}
            </p>
          )}

          {/* Buttons */}
          {(link?.label || secondaryButton?.label) && (
            <div
              className={`mt-6 flex flex-col gap-4 sm:flex-row ${
                alignment === 'centered' ? 'sm:justify-center' : ''
              }`}
            >
              {renderPrimaryButton()}
              {renderSecondaryButton()}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}
