'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

interface CTAProps {
  label?: string | null
  url?: string | null
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
}

export function SectionHeaderBlock({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  enableAnimation = true,
  layout = 'centered',
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
            <h2
              className={`mb-4 text-4xl font-bold ${soloWhite ? 'text-white' : 'text-foreground'}`}
            >
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
              {primaryCTA?.label && primaryCTA?.url && (
                <Link
                  href={primaryCTA.url}
                  target={primaryCTA.openInNewTab ? '_blank' : '_self'}
                  rel={primaryCTA.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center justify-center rounded-[15px] px-[45px] py-[17px] text-[16px] font-normal leading-none tracking-normal transition-all duration-200 ${
                    primaryCTA.style === 'outline'
                      ? 'bg-[#00120F] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141,inset_0_4px_12px_0_rgba(5,176,143,0.3),inset_0_0_25px_0_rgba(5,176,143,0.3)]'
                      : 'bg-[#025A4A] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141]'
                  }`}
                >
                  {primaryCTA.label}
                </Link>
              )}
              {secondaryCTA?.label && secondaryCTA?.url && (
                <Link
                  href={secondaryCTA.url}
                  target={secondaryCTA.openInNewTab ? '_blank' : '_self'}
                  rel={secondaryCTA.openInNewTab ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center justify-center rounded-[15px] px-[45px] py-[17px] text-[16px] font-normal leading-none tracking-normal transition-all duration-200 ${
                    secondaryCTA.style === 'outline'
                      ? 'bg-[#00120F] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141,inset_0_4px_12px_0_rgba(5,176,143,0.3),inset_0_0_25px_0_rgba(5,176,143,0.3)]'
                      : 'bg-[#025A4A] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141]'
                  }`}
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
