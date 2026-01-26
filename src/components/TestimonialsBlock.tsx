'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import type { Media } from '@/payload-types'

/**
 * Accent color type for testimonials styling
 */
type AccentColor = 'amber' | 'indigo' | 'purple' | 'green' | 'blue'

/**
 * Testimonial item interface
 */
interface TestimonialItem {
  quote: string
  authorName: string
  authorRole?: string | null
  authorCompany?: string | null
  authorPhoto?: string | Media | null
  rating?: number | null
  logo?: string | Media | null
  id?: string | null
}

/**
 * Props interface for the TestimonialsBlock component
 */
export interface TestimonialsBlockProps {
  title?: string | null
  subtitle?: string | null
  displayMode?: 'carousel' | 'grid' | 'single-featured' | null
  testimonials?: TestimonialItem[] | null
  showRatings?: boolean | null
  autoplay?: boolean | null
  autoplayInterval?: number | null
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
 * Star Rating Component
 * Renders filled, half-filled, and empty stars based on rating value
 */
function StarRating({
  rating,
  accentColor = 'amber',
}: {
  rating: number
  accentColor?: AccentColor
}) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const starColorClasses: Record<AccentColor, string> = {
    amber: 'text-amber-400',
    indigo: 'text-indigo-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
  }

  const starColor = starColorClasses[accentColor]

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Rating: ${rating} out of 5 stars`}
    >
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`h-4 w-4 fill-current ${starColor}`} />
      ))}
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative h-4 w-4">
          <Star className="absolute h-4 w-4 text-gray-200" />
          <div className="absolute overflow-hidden" style={{ width: '50%' }}>
            <Star className={`h-4 w-4 fill-current ${starColor}`} />
          </div>
        </div>
      )}
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-200" />
      ))}
    </div>
  )
}

/**
 * Single Testimonial Card Component
 */
function TestimonialCard({
  testimonial,
  showRatings,
  accentColor,
  variant = 'default',
}: {
  testimonial: TestimonialItem
  showRatings: boolean
  accentColor: AccentColor
  variant?: 'default' | 'featured'
}) {
  const authorPhotoUrl = getImageUrl(testimonial.authorPhoto)
  const logoUrl = getImageUrl(testimonial.logo)

  const accentBgClasses: Record<AccentColor, string> = {
    amber: 'bg-amber-50',
    indigo: 'bg-indigo-50',
    purple: 'bg-purple-50',
    green: 'bg-green-50',
    blue: 'bg-blue-50',
  }

  const accentTextClasses: Record<AccentColor, string> = {
    amber: 'text-amber-500',
    indigo: 'text-indigo-500',
    purple: 'text-purple-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
  }

  const accentBorderClasses: Record<AccentColor, string> = {
    amber: 'border-amber-200',
    indigo: 'border-indigo-200',
    purple: 'border-purple-200',
    green: 'border-green-200',
    blue: 'border-blue-200',
  }

  const isFeatured = variant === 'featured'

  return (
    <div
      className={`relative rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${accentBorderClasses[accentColor]} ${isFeatured ? 'md:p-8' : ''}`}
    >
      {/* Quote icon */}
      <div className={`absolute -top-3 left-6 rounded-full p-2 ${accentBgClasses[accentColor]}`}>
        <Quote className={`h-4 w-4 ${accentTextClasses[accentColor]}`} />
      </div>

      {/* Rating */}
      {showRatings && testimonial.rating && (
        <div className="mb-4 pt-2">
          <StarRating rating={testimonial.rating} accentColor={accentColor} />
        </div>
      )}

      {/* Quote */}
      <blockquote
        className={`mb-6 leading-relaxed text-gray-700 ${isFeatured ? 'text-lg md:text-xl' : 'text-base'} ${!showRatings || !testimonial.rating ? 'pt-2' : ''}`}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author info */}
      <div className="flex items-center gap-4">
        {authorPhotoUrl && (
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={authorPhotoUrl}
              alt={testimonial.authorName}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900">{testimonial.authorName}</p>
          {(testimonial.authorRole || testimonial.authorCompany) && (
            <p className="truncate text-sm text-gray-500">
              {testimonial.authorRole}
              {testimonial.authorRole && testimonial.authorCompany && ' at '}
              {testimonial.authorCompany}
            </p>
          )}
        </div>
        {logoUrl && (
          <div className="relative h-8 w-20 flex-shrink-0">
            <Image
              src={logoUrl}
              alt={testimonial.authorCompany || 'Company logo'}
              fill
              className="object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * TestimonialsBlock Component
 *
 * A flexible testimonials display component supporting carousel, grid,
 * and single-featured display modes with star ratings and accent colors.
 *
 * @example
 * ```tsx
 * <TestimonialsBlock
 *   title="What Our Customers Say"
 *   subtitle="Trusted by thousands of businesses"
 *   displayMode="carousel"
 *   testimonials={[
 *     {
 *       quote: "Amazing service!",
 *       authorName: "John Doe",
 *       authorRole: "CEO",
 *       authorCompany: "Tech Corp",
 *       rating: 5,
 *     },
 *   ]}
 *   showRatings={true}
 *   autoplay={true}
 *   accentColor="indigo"
 * />
 * ```
 */
export function TestimonialsBlock({
  title,
  subtitle,
  displayMode = 'carousel',
  testimonials,
  showRatings = true,
  autoplay = true,
  autoplayInterval = 5000,
  accentColor = 'amber',
  enableAnimation = true,
}: TestimonialsBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const safeAccentColor = accentColor || 'amber'
  const safeDisplayMode = displayMode || 'carousel'
  const safeAutoplayInterval = autoplayInterval || 5000
  const testimonialsLength = testimonials?.length || 0

  // Navigation handlers - must be declared before useEffect
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength)
  }, [testimonialsLength])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsLength)
  }, [testimonialsLength])

  // Autoplay for carousel
  useEffect(() => {
    if (testimonialsLength === 0) return
    if (safeDisplayMode !== 'carousel' && safeDisplayMode !== 'single-featured') return
    if (!autoplay || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsLength)
    }, safeAutoplayInterval)

    return () => clearInterval(interval)
  }, [autoplay, isHovered, testimonialsLength, safeDisplayMode, safeAutoplayInterval])

  // Return null if no testimonials provided
  if (!testimonials || testimonials.length === 0) {
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

  // Accent color classes for navigation
  const accentButtonClasses: Record<AccentColor, string> = {
    amber: 'hover:bg-amber-100 focus:ring-amber-500',
    indigo: 'hover:bg-indigo-100 focus:ring-indigo-500',
    purple: 'hover:bg-purple-100 focus:ring-purple-500',
    green: 'hover:bg-green-100 focus:ring-green-500',
    blue: 'hover:bg-blue-100 focus:ring-blue-500',
  }

  const accentDotClasses: Record<AccentColor, string> = {
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  }

  // Render carousel mode
  const renderCarousel = () => {
    const currentTestimonial = testimonials[currentIndex]
    if (!currentTestimonial) return null

    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Carousel container */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-3xl"
            >
              <TestimonialCard
                testimonial={currentTestimonial}
                showRatings={showRatings ?? true}
                accentColor={safeAccentColor}
                variant="featured"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className={`absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all focus:outline-none focus:ring-2 md:-translate-x-12 ${accentButtonClasses[safeAccentColor]}`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white p-2 shadow-md transition-all focus:outline-none focus:ring-2 md:translate-x-12 ${accentButtonClasses[safeAccentColor]}`}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {testimonials.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? `w-6 ${accentDotClasses[safeAccentColor]}`
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render grid mode
  const renderGrid = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <motion.div key={testimonial.id || index} {...getItemVariants(index)}>
          <TestimonialCard
            testimonial={testimonial}
            showRatings={showRatings ?? true}
            accentColor={safeAccentColor}
          />
        </motion.div>
      ))}
    </div>
  )

  // Render single-featured mode
  const renderSingleFeatured = () => {
    const currentTestimonial = testimonials[currentIndex]
    if (!currentTestimonial) return null

    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-4xl"
          >
            <TestimonialCard
              testimonial={currentTestimonial}
              showRatings={showRatings ?? true}
              accentColor={safeAccentColor}
              variant="featured"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation for single-featured */}
        {testimonials.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={goToPrevious}
              className={`rounded-full bg-white p-2 shadow-md transition-all focus:outline-none focus:ring-2 ${accentButtonClasses[safeAccentColor]}`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {testimonials.length}
            </span>
            <button
              onClick={goToNext}
              className={`rounded-full bg-white p-2 shadow-md transition-all focus:outline-none focus:ring-2 ${accentButtonClasses[safeAccentColor]}`}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.section {...containerVariants} className="py-12 md:py-16">
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

        {/* Testimonials Content */}
        {safeDisplayMode === 'carousel' && renderCarousel()}
        {safeDisplayMode === 'grid' && renderGrid()}
        {safeDisplayMode === 'single-featured' && renderSingleFeatured()}
      </div>
    </motion.section>
  )
}
