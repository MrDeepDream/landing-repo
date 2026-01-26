'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Quote, ArrowRight, TrendingUp, Building2 } from 'lucide-react'
import type { Media } from '@/payload-types'

/**
 * Accent color type for case study styling
 */
type AccentColor = 'amber' | 'indigo' | 'purple' | 'green' | 'blue'

/**
 * Display mode options for case study presentation
 */
type DisplayMode = 'cards' | 'detailed' | 'carousel'

/**
 * Result metric interface
 */
interface ResultMetric {
  metric?: string | null
  value?: string | null
  description?: string | null
  id?: string | null
}

/**
 * Testimonial within a case study
 */
interface CaseTestimonial {
  quote?: string | null
  author?: string | null
}

/**
 * Link configuration
 */
interface CaseLink {
  label?: string | null
  url?: string | null
  openInNewTab?: boolean | null
}

/**
 * Case study item interface
 */
interface CaseStudyItem {
  title: string
  clientName?: string | null
  industry?: string | null
  challenge?: string | null
  solution?: string | null
  results?: ResultMetric[] | null
  testimonial?: CaseTestimonial | null
  image?: string | Media | null
  logo?: string | Media | null
  link?: CaseLink | null
  id?: string | null
}

/**
 * Props interface for the CaseStudyBlock component
 */
export interface CaseStudyBlockProps {
  title?: string | null
  subtitle?: string | null
  displayMode?: DisplayMode | null
  cases?: CaseStudyItem[] | null
  accentColor?: AccentColor | null
  enableAnimation?: boolean | null
}

/**
 * Extract image URL from Media object or string
 */
function getImageUrl(image: string | Media | null | undefined): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.url || null
}

/**
 * Accent color class configurations
 */
const accentBgClasses: Record<AccentColor, string> = {
  amber: 'bg-amber-50',
  indigo: 'bg-indigo-50',
  purple: 'bg-purple-50',
  green: 'bg-green-50',
  blue: 'bg-blue-50',
}

const accentTextClasses: Record<AccentColor, string> = {
  amber: 'text-amber-600',
  indigo: 'text-indigo-600',
  purple: 'text-purple-600',
  green: 'text-green-600',
  blue: 'text-blue-600',
}

const accentBorderClasses: Record<AccentColor, string> = {
  amber: 'border-amber-200',
  indigo: 'border-indigo-200',
  purple: 'border-purple-200',
  green: 'border-green-200',
  blue: 'border-blue-200',
}

const accentButtonClasses: Record<AccentColor, string> = {
  amber: 'bg-amber-600 hover:bg-amber-700',
  indigo: 'bg-indigo-600 hover:bg-indigo-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  green: 'bg-green-600 hover:bg-green-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
}

const accentDotClasses: Record<AccentColor, string> = {
  amber: 'bg-amber-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
}

const accentNavButtonClasses: Record<AccentColor, string> = {
  amber: 'hover:bg-amber-100 focus:ring-amber-500',
  indigo: 'hover:bg-indigo-100 focus:ring-indigo-500',
  purple: 'hover:bg-purple-100 focus:ring-purple-500',
  green: 'hover:bg-green-100 focus:ring-green-500',
  blue: 'hover:bg-blue-100 focus:ring-blue-500',
}

/**
 * Result Metrics Display Component
 */
function ResultMetrics({
  results,
  accentColor,
}: {
  results: ResultMetric[]
  accentColor: AccentColor
}) {
  if (!results || results.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {results.map((result, index) => (
        <div
          key={result.id || index}
          className={`rounded-lg border p-4 ${accentBorderClasses[accentColor]} ${accentBgClasses[accentColor]}`}
        >
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp className={`h-4 w-4 ${accentTextClasses[accentColor]}`} />
            <span className={`text-2xl font-bold ${accentTextClasses[accentColor]}`}>
              {result.value}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900">{result.metric}</p>
          {result.description && <p className="mt-1 text-xs text-gray-500">{result.description}</p>}
        </div>
      ))}
    </div>
  )
}

/**
 * Case Study Card Component - Used in cards and carousel modes
 */
function CaseStudyCard({
  caseStudy,
  accentColor,
  variant = 'default',
}: {
  caseStudy: CaseStudyItem
  accentColor: AccentColor
  variant?: 'default' | 'carousel'
}) {
  const imageUrl = getImageUrl(caseStudy.image)
  const logoUrl = getImageUrl(caseStudy.logo)
  // variant can be used for future styling differences between card modes
  void variant

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${accentBorderClasses[accentColor]}`}
    >
      {/* Image Section */}
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={caseStudy.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Industry Badge */}
          {caseStudy.industry && (
            <div
              className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${accentBgClasses[accentColor]} ${accentTextClasses[accentColor]}`}
            >
              {caseStudy.industry}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Client Logo & Name */}
        <div className="mb-3 flex items-center gap-3">
          {logoUrl ? (
            <div className="relative h-8 w-16 flex-shrink-0">
              <Image
                src={logoUrl}
                alt={caseStudy.clientName || 'Client logo'}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            caseStudy.clientName && (
              <div className={`flex items-center gap-1 ${accentTextClasses[accentColor]}`}>
                <Building2 className="h-4 w-4" />
              </div>
            )
          )}
          {caseStudy.clientName && (
            <span className="text-sm font-medium text-gray-500">{caseStudy.clientName}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold text-gray-900">{caseStudy.title}</h3>

        {/* Challenge Summary */}
        {caseStudy.challenge && (
          <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600">{caseStudy.challenge}</p>
        )}

        {/* Results Preview (max 2 in card mode) */}
        {caseStudy.results && caseStudy.results.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {caseStudy.results.slice(0, 2).map((result, index) => (
              <div
                key={result.id || index}
                className={`rounded-full px-3 py-1 text-sm font-semibold ${accentBgClasses[accentColor]} ${accentTextClasses[accentColor]}`}
              >
                {result.value} {result.metric}
              </div>
            ))}
          </div>
        )}

        {/* Link */}
        {caseStudy.link?.url && caseStudy.link?.label && (
          <a
            href={caseStudy.link.url}
            target={caseStudy.link.openInNewTab ? '_blank' : undefined}
            rel={caseStudy.link.openInNewTab ? 'noopener noreferrer' : undefined}
            className={`mt-auto inline-flex items-center gap-1 text-sm font-semibold transition-colors ${accentTextClasses[accentColor]} hover:underline`}
          >
            {caseStudy.link.label}
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}

/**
 * Detailed Case Study View Component
 */
function DetailedCaseStudy({
  caseStudy,
  accentColor,
  enableAnimation,
  index,
}: {
  caseStudy: CaseStudyItem
  accentColor: AccentColor
  enableAnimation: boolean
  index: number
}) {
  const imageUrl = getImageUrl(caseStudy.image)
  const logoUrl = getImageUrl(caseStudy.logo)

  const itemVariants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.15, duration: 0.5 },
      }
    : {}

  return (
    <motion.article
      {...itemVariants}
      className={`overflow-hidden rounded-2xl border bg-white shadow-md ${accentBorderClasses[accentColor]}`}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Image & Client Info */}
        <div className="relative">
          {imageUrl ? (
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[400px]">
              <Image
                src={imageUrl}
                alt={caseStudy.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay with client info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-4">
                  {logoUrl && (
                    <div className="relative h-12 w-24 rounded bg-white/90 p-2">
                      <Image
                        src={logoUrl}
                        alt={caseStudy.clientName || 'Client logo'}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    {caseStudy.clientName && (
                      <p className="font-semibold text-white">{caseStudy.clientName}</p>
                    )}
                    {caseStudy.industry && (
                      <p className="text-sm text-white/80">{caseStudy.industry}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`flex h-full min-h-[200px] flex-col items-center justify-center ${accentBgClasses[accentColor]} p-8 lg:min-h-[400px]`}
            >
              {logoUrl ? (
                <div className="relative mb-4 h-16 w-32">
                  <Image
                    src={logoUrl}
                    alt={caseStudy.clientName || 'Client logo'}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <Building2 className={`mb-4 h-16 w-16 ${accentTextClasses[accentColor]}`} />
              )}
              {caseStudy.clientName && (
                <p className="text-lg font-semibold text-gray-900">{caseStudy.clientName}</p>
              )}
              {caseStudy.industry && <p className="text-gray-500">{caseStudy.industry}</p>}
            </div>
          )}
        </div>

        {/* Right Column - Content */}
        <div className="p-6 lg:p-8">
          <h3 className="mb-6 text-2xl font-bold text-gray-900 lg:text-3xl">{caseStudy.title}</h3>

          {/* Challenge Section */}
          {caseStudy.challenge && (
            <div className="mb-6">
              <h4
                className={`mb-2 text-sm font-semibold uppercase tracking-wide ${accentTextClasses[accentColor]}`}
              >
                The Challenge
              </h4>
              <p className="text-gray-600">{caseStudy.challenge}</p>
            </div>
          )}

          {/* Solution Section */}
          {caseStudy.solution && (
            <div className="mb-6">
              <h4
                className={`mb-2 text-sm font-semibold uppercase tracking-wide ${accentTextClasses[accentColor]}`}
              >
                Our Solution
              </h4>
              <p className="text-gray-600">{caseStudy.solution}</p>
            </div>
          )}

          {/* Results Section */}
          {caseStudy.results && caseStudy.results.length > 0 && (
            <div className="mb-6">
              <h4
                className={`mb-3 text-sm font-semibold uppercase tracking-wide ${accentTextClasses[accentColor]}`}
              >
                Results
              </h4>
              <ResultMetrics results={caseStudy.results} accentColor={accentColor} />
            </div>
          )}

          {/* Testimonial */}
          {caseStudy.testimonial?.quote && (
            <div className={`relative rounded-lg p-4 ${accentBgClasses[accentColor]}`}>
              <Quote
                className={`absolute -top-2 left-4 h-8 w-8 ${accentTextClasses[accentColor]} opacity-30`}
              />
              <blockquote className="pl-4 pt-2">
                <p className="mb-2 italic text-gray-700">
                  &ldquo;{caseStudy.testimonial.quote}&rdquo;
                </p>
                {caseStudy.testimonial.author && (
                  <footer className="text-sm font-medium text-gray-500">
                    &mdash; {caseStudy.testimonial.author}
                  </footer>
                )}
              </blockquote>
            </div>
          )}

          {/* CTA Link */}
          {caseStudy.link?.url && caseStudy.link?.label && (
            <a
              href={caseStudy.link.url}
              target={caseStudy.link.openInNewTab ? '_blank' : undefined}
              rel={caseStudy.link.openInNewTab ? 'noopener noreferrer' : undefined}
              className={`mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors ${accentButtonClasses[accentColor]}`}
            >
              {caseStudy.link.label}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/**
 * CaseStudyBlock Component
 *
 * A flexible case study presentation component supporting cards, detailed,
 * and carousel display modes with results metrics and testimonials.
 *
 * @example
 * ```tsx
 * <CaseStudyBlock
 *   title="Success Stories"
 *   subtitle="See how we've helped our clients achieve their goals"
 *   displayMode="cards"
 *   cases={[
 *     {
 *       title: "E-commerce Transformation",
 *       clientName: "TechCorp",
 *       industry: "Technology",
 *       challenge: "Needed to modernize their platform...",
 *       solution: "We implemented a complete redesign...",
 *       results: [
 *         { metric: "Revenue Increase", value: "150%", description: "Year over year" },
 *       ],
 *     },
 *   ]}
 *   accentColor="indigo"
 * />
 * ```
 */
export function CaseStudyBlock({
  title,
  subtitle,
  displayMode = 'cards',
  cases,
  accentColor = 'indigo',
  enableAnimation = true,
}: CaseStudyBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const safeAccentColor = accentColor || 'indigo'
  const safeDisplayMode = displayMode || 'cards'
  const casesLength = cases?.length || 0

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + casesLength) % casesLength)
  }, [casesLength])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % casesLength)
  }, [casesLength])

  // Auto-advance for carousel
  useEffect(() => {
    if (casesLength === 0) return
    if (safeDisplayMode !== 'carousel') return
    if (isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % casesLength)
    }, 6000)

    return () => clearInterval(interval)
  }, [isHovered, casesLength, safeDisplayMode])

  // Return null if no cases provided
  if (!cases || cases.length === 0) {
    return null
  }

  // Animation variants
  const containerVariants = enableAnimation
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  const headerVariants = enableAnimation
    ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  const getItemVariants = (index: number) =>
    enableAnimation
      ? {
          initial: { y: 30, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { delay: 0.1 + index * 0.1, duration: 0.5 },
        }
      : {}

  // Render Cards Mode
  const renderCards = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((caseStudy, index) => (
        <motion.div key={caseStudy.id || index} {...getItemVariants(index)}>
          <CaseStudyCard caseStudy={caseStudy} accentColor={safeAccentColor} />
        </motion.div>
      ))}
    </div>
  )

  // Render Detailed Mode
  const renderDetailed = () => (
    <div className="space-y-8">
      {cases.map((caseStudy, index) => (
        <DetailedCaseStudy
          key={caseStudy.id || index}
          caseStudy={caseStudy}
          accentColor={safeAccentColor}
          enableAnimation={enableAnimation ?? true}
          index={index}
        />
      ))}
    </div>
  )

  // Render Carousel Mode
  const renderCarousel = () => {
    const currentCase = cases[currentIndex]
    if (!currentCase) return null

    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Carousel Container */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-4xl"
            >
              <CaseStudyCard
                caseStudy={currentCase}
                accentColor={safeAccentColor}
                variant="carousel"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {cases.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={`absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all focus:outline-none focus:ring-2 md:-translate-x-12 ${accentNavButtonClasses[safeAccentColor]}`}
              aria-label="Previous case study"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white p-2 shadow-md transition-all focus:outline-none focus:ring-2 md:translate-x-12 ${accentNavButtonClasses[safeAccentColor]}`}
              aria-label="Next case study"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {cases.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {cases.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? `w-6 ${accentDotClasses[safeAccentColor]}`
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to case study ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.section {...containerVariants} className="py-12 md:py-16" aria-label="Case studies">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {(title || subtitle) && (
          <motion.div {...headerVariants} className="mb-10 text-center">
            {title && (
              <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
            )}
            {subtitle && (
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
            )}
          </motion.div>
        )}

        {/* Case Studies Content */}
        {safeDisplayMode === 'cards' && renderCards()}
        {safeDisplayMode === 'detailed' && renderDetailed()}
        {safeDisplayMode === 'carousel' && renderCarousel()}
      </div>
    </motion.section>
  )
}
