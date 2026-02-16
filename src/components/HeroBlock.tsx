'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Beams from './Beams'

export interface HeroBlockProps {
  headline: string
  subheadline?: string | null
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
  enableAnimation?: boolean | null
  isFirstBlock?: boolean
}

export function HeroBlock({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  enableAnimation = true,
  isFirstBlock = false,
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
  const renderCTA = (cta: NonNullable<HeroBlockProps['primaryCTA']>) => {
    if (!cta.label || !cta.url) return null

    const baseClasses =
      'inline-flex items-center justify-center rounded-[15px] px-[45px] py-[17px] text-[16px] font-normal leading-none tracking-normal transition-all duration-200'

    const styleClasses =
      cta.style === 'outline'
        ? 'bg-[#00120F] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141,inset_0_4px_12px_0_rgba(5,176,143,0.3),inset_0_0_25px_0_rgba(5,176,143,0.3)]'
        : 'bg-[#025A4A] text-white shadow-[0_0_25px_0_rgba(56,255,126,0.12),inset_0_0_0_1px_#005141]'

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
