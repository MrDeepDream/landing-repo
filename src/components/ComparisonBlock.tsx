'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Check, X, GripVertical } from 'lucide-react'
import type { Media } from '@/payload-types'

/**
 * Accent color type for comparison styling
 */
type AccentColor = 'amber' | 'indigo' | 'purple' | 'green' | 'blue'

/**
 * Comparison type options
 */
type ComparisonType = 'before-after' | 'table' | 'cards'

/**
 * CTA interface for cards
 */
interface CardCTA {
  label?: string | null
  url?: string | null
  openInNewTab?: boolean | null
}

/**
 * Feature item for cards
 */
interface CardFeature {
  text: string
  included?: boolean | null
  id?: string | null
}

/**
 * Card item interface
 */
interface ComparisonCardItem {
  title: string
  description?: string | null
  features?: CardFeature[] | null
  highlighted?: boolean | null
  price?: string | null
  cta?: CardCTA | null
  id?: string | null
}

/**
 * Table header interface
 */
interface TableHeader {
  text: string
  highlighted?: boolean | null
  id?: string | null
}

/**
 * Table cell value interface
 */
interface TableCellValue {
  text?: string | null
  isCheckmark?: boolean | null
  id?: string | null
}

/**
 * Table row interface
 */
interface TableRow {
  label: string
  values?: TableCellValue[] | null
  id?: string | null
}

/**
 * Props interface for the ComparisonBlock component
 */
export interface ComparisonBlockProps {
  title?: string | null
  subtitle?: string | null
  type?: ComparisonType | null
  // Before-after specific
  beforeImage?: string | Media | null
  afterImage?: string | Media | null
  beforeLabel?: string | null
  afterLabel?: string | null
  sliderDefault?: number | null
  // Table specific
  headers?: TableHeader[] | null
  rows?: TableRow[] | null
  highlightColumn?: number | null
  // Cards specific
  items?: ComparisonCardItem[] | null
  // Common
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
 * Get accent color classes for various elements
 */
function getAccentClasses(accentColor: AccentColor) {
  const classes = {
    amber: {
      text: 'text-amber-600',
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-100',
      bgLighter: 'bg-amber-50',
      border: 'border-amber-300',
      borderHighlight: 'border-amber-500',
      gradient: 'from-amber-500 to-orange-500',
      ring: 'ring-amber-400',
      hover: 'hover:bg-amber-600',
      checkBg: 'bg-amber-100',
      checkText: 'text-amber-600',
      badge: 'bg-amber-100 text-amber-700',
      sliderHandle: 'bg-amber-500',
      sliderLine: 'bg-amber-500',
    },
    indigo: {
      text: 'text-indigo-600',
      bg: 'bg-indigo-500',
      bgLight: 'bg-indigo-100',
      bgLighter: 'bg-indigo-50',
      border: 'border-indigo-300',
      borderHighlight: 'border-indigo-500',
      gradient: 'from-indigo-500 to-purple-500',
      ring: 'ring-indigo-400',
      hover: 'hover:bg-indigo-600',
      checkBg: 'bg-indigo-100',
      checkText: 'text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700',
      sliderHandle: 'bg-indigo-500',
      sliderLine: 'bg-indigo-500',
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-100',
      bgLighter: 'bg-purple-50',
      border: 'border-purple-300',
      borderHighlight: 'border-purple-500',
      gradient: 'from-purple-500 to-pink-500',
      ring: 'ring-purple-400',
      hover: 'hover:bg-purple-600',
      checkBg: 'bg-purple-100',
      checkText: 'text-purple-600',
      badge: 'bg-purple-100 text-purple-700',
      sliderHandle: 'bg-purple-500',
      sliderLine: 'bg-purple-500',
    },
    green: {
      text: 'text-green-600',
      bg: 'bg-green-500',
      bgLight: 'bg-green-100',
      bgLighter: 'bg-green-50',
      border: 'border-green-300',
      borderHighlight: 'border-green-500',
      gradient: 'from-green-500 to-emerald-500',
      ring: 'ring-green-400',
      hover: 'hover:bg-green-600',
      checkBg: 'bg-green-100',
      checkText: 'text-green-600',
      badge: 'bg-green-100 text-green-700',
      sliderHandle: 'bg-green-500',
      sliderLine: 'bg-green-500',
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-100',
      bgLighter: 'bg-blue-50',
      border: 'border-blue-300',
      borderHighlight: 'border-blue-500',
      gradient: 'from-blue-500 to-cyan-500',
      ring: 'ring-blue-400',
      hover: 'hover:bg-blue-600',
      checkBg: 'bg-blue-100',
      checkText: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-700',
      sliderHandle: 'bg-blue-500',
      sliderLine: 'bg-blue-500',
    },
  }
  return classes[accentColor]
}

/**
 * Before/After Slider Component
 */
function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  sliderDefault,
  accentColor,
  enableAnimation,
}: {
  beforeImage: string | null
  afterImage: string | null
  beforeLabel: string
  afterLabel: string
  sliderDefault: number
  accentColor: AccentColor
  enableAnimation: boolean
}) {
  const [sliderPosition, setSliderPosition] = useState(sliderDefault)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const colors = getAccentClasses(accentColor)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleTouchStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      handleMove(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, handleMove])

  const containerVariants = enableAnimation
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }
    : {}

  if (!beforeImage || !afterImage) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-gray-100">
        <p className="text-gray-500">Please provide both before and after images</p>
      </div>
    )
  }

  return (
    <motion.div
      {...containerVariants}
      ref={containerRef}
      className="relative aspect-video w-full cursor-ew-resize select-none overflow-hidden rounded-xl"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="slider"
      aria-label="Before and after image comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          setSliderPosition((prev) => Math.max(0, prev - 5))
        } else if (e.key === 'ArrowRight') {
          setSliderPosition((prev) => Math.min(100, prev + 5))
        }
      }}
    >
      {/* After Image (background) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority
        />
        {/* After Label */}
        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          {afterLabel}
        </div>
      </div>

      {/* Before Image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeImage}
          alt={beforeLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority
        />
        {/* Before Label */}
        <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line */}
      <div
        className={`absolute bottom-0 top-0 w-1 ${colors.sliderLine} shadow-lg`}
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider Handle */}
        <div
          className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${colors.sliderHandle} shadow-lg transition-transform ${isDragging ? 'scale-110' : ''}`}
        >
          <GripVertical className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Table Comparison Component
 */
function TableComparison({
  headers,
  rows,
  highlightColumn,
  accentColor,
  enableAnimation,
}: {
  headers: TableHeader[]
  rows: TableRow[]
  highlightColumn: number
  accentColor: AccentColor
  enableAnimation: boolean
}) {
  const colors = getAccentClasses(accentColor)

  const tableVariants = enableAnimation
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...tableVariants} className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-200 p-4 text-left text-sm font-semibold text-gray-600">
              Features
            </th>
            {headers.map((header, index) => {
              const isHighlighted = header.highlighted || index === highlightColumn
              return (
                <th
                  key={header.id || index}
                  className={`border-b-2 p-4 text-center ${
                    isHighlighted
                      ? `${colors.borderHighlight} ${colors.bgLighter}`
                      : 'border-gray-200'
                  }`}
                >
                  <span
                    className={`text-lg font-bold ${isHighlighted ? colors.text : 'text-foreground'}`}
                  >
                    {header.text}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border-b border-gray-100 p-4 text-sm font-medium text-gray-700">
                {row.label}
              </td>
              {row.values?.map((value, colIndex) => {
                const header = headers[colIndex]
                const isHighlighted = header?.highlighted || colIndex === highlightColumn
                return (
                  <td
                    key={value?.id || colIndex}
                    className={`border-b border-gray-100 p-4 text-center ${
                      isHighlighted ? colors.bgLighter : ''
                    }`}
                  >
                    {value?.isCheckmark ? (
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${colors.checkBg}`}
                      >
                        <Check className={`h-4 w-4 ${colors.checkText}`} />
                      </span>
                    ) : value?.text === 'false' || value?.text === '-' ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                        <X className="h-4 w-4 text-gray-400" />
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">{value?.text || '-'}</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

/**
 * Cards Comparison Component
 */
function CardsComparison({
  items,
  accentColor,
  enableAnimation,
}: {
  items: ComparisonCardItem[]
  accentColor: AccentColor
  enableAnimation: boolean
}) {
  const colors = getAccentClasses(accentColor)

  // Determine grid columns based on number of items
  const gridCols =
    items.length === 1
      ? 'max-w-md'
      : items.length === 2
        ? 'max-w-2xl grid-cols-1 sm:grid-cols-2'
        : items.length === 3
          ? 'max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`mx-auto grid gap-6 ${gridCols}`}>
      {items.map((item, index) => {
        const isHighlighted = item.highlighted === true

        const cardVariants = enableAnimation
          ? {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1 + index * 0.1, duration: 0.5 },
            }
          : {}

        return (
          <motion.div
            key={item.id || index}
            {...cardVariants}
            className={`relative flex flex-col rounded-2xl border-2 bg-white p-6 shadow-sm transition-all duration-300 ${
              isHighlighted
                ? `${colors.borderHighlight} scale-105 shadow-lg`
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            {/* Highlighted Badge */}
            {isHighlighted && (
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold ${colors.badge}`}
              >
                Recommended
              </div>
            )}

            {/* Title */}
            <h3
              className={`mb-2 text-center text-xl font-bold ${isHighlighted ? colors.text : 'text-foreground'}`}
            >
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p className="mb-4 text-center text-sm text-gray-500">{item.description}</p>
            )}

            {/* Price */}
            {item.price && (
              <div className="mb-6 text-center">
                <span
                  className={`text-4xl font-bold ${isHighlighted ? colors.text : 'text-foreground'}`}
                >
                  {item.price}
                </span>
              </div>
            )}

            {/* Features */}
            {item.features && item.features.length > 0 && (
              <ul className="mb-6 flex-1 space-y-3 text-sm">
                {item.features.map((feature, featureIndex) => {
                  const isIncluded = feature.included !== false
                  return (
                    <li key={feature.id || featureIndex} className="flex items-start gap-3">
                      {isIncluded ? (
                        <span
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${colors.checkBg}`}
                        >
                          <Check className={`h-3 w-3 ${colors.checkText}`} />
                        </span>
                      ) : (
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                          <X className="h-3 w-3 text-gray-400" />
                        </span>
                      )}
                      <span className={isIncluded ? 'text-gray-700' : 'text-gray-400 line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* CTA */}
            {item.cta?.label && item.cta?.url && (
              <a
                href={item.cta.url}
                target={item.cta.openInNewTab ? '_blank' : undefined}
                rel={item.cta.openInNewTab ? 'noopener noreferrer' : undefined}
                className={`mt-auto inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  isHighlighted
                    ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md hover:scale-[1.02] hover:shadow-lg`
                    : `border-2 ${colors.border} ${colors.text} hover:${colors.bgLighter}`
                }`}
              >
                {item.cta.label}
              </a>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

/**
 * ComparisonBlock Component
 *
 * A versatile comparison component supporting before/after sliders,
 * feature comparison tables, and pricing-style card comparisons.
 *
 * @example
 * ```tsx
 * // Before/After Slider
 * <ComparisonBlock
 *   title="See the Difference"
 *   type="before-after"
 *   beforeImage="/before.jpg"
 *   afterImage="/after.jpg"
 *   beforeLabel="Before"
 *   afterLabel="After"
 *   sliderDefault={50}
 *   accentColor="indigo"
 * />
 *
 * // Table Comparison
 * <ComparisonBlock
 *   title="Feature Comparison"
 *   type="table"
 *   headers={[
 *     { text: 'Basic' },
 *     { text: 'Pro', highlighted: true },
 *     { text: 'Enterprise' },
 *   ]}
 *   rows={[
 *     { label: 'Storage', values: [{ text: '10GB' }, { text: '100GB' }, { text: 'Unlimited' }] },
 *     { label: 'Support', values: [{ isCheckmark: true }, { isCheckmark: true }, { isCheckmark: true }] },
 *   ]}
 * />
 *
 * // Cards Comparison
 * <ComparisonBlock
 *   title="Choose Your Plan"
 *   type="cards"
 *   items={[
 *     {
 *       title: 'Starter',
 *       price: '$9/mo',
 *       features: [{ text: '5 Projects', included: true }],
 *       cta: { label: 'Get Started', url: '/signup' },
 *     },
 *   ]}
 * />
 * ```
 */
export function ComparisonBlock({
  title,
  subtitle,
  type = 'before-after',
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  sliderDefault = 50,
  headers,
  rows,
  highlightColumn = 1,
  items,
  accentColor = 'indigo',
  enableAnimation = true,
}: ComparisonBlockProps) {
  const safeAccentColor = accentColor || 'indigo'
  const safeType = type || 'before-after'
  const safeEnableAnimation = enableAnimation !== false

  // Animation variants
  const containerVariants = safeEnableAnimation
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  const headerVariants = safeEnableAnimation
    ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  // Render appropriate comparison type
  const renderComparison = () => {
    switch (safeType) {
      case 'before-after':
        return (
          <BeforeAfterSlider
            beforeImage={getImageUrl(beforeImage)}
            afterImage={getImageUrl(afterImage)}
            beforeLabel={beforeLabel || 'Before'}
            afterLabel={afterLabel || 'After'}
            sliderDefault={sliderDefault || 50}
            accentColor={safeAccentColor}
            enableAnimation={safeEnableAnimation}
          />
        )

      case 'table':
        if (!headers || headers.length === 0 || !rows || rows.length === 0) {
          return (
            <div className="flex items-center justify-center rounded-xl bg-gray-100 p-8">
              <p className="text-gray-500">Please provide table headers and rows</p>
            </div>
          )
        }
        return (
          <TableComparison
            headers={headers}
            rows={rows}
            highlightColumn={highlightColumn ?? 1}
            accentColor={safeAccentColor}
            enableAnimation={safeEnableAnimation}
          />
        )

      case 'cards':
        if (!items || items.length === 0) {
          return (
            <div className="flex items-center justify-center rounded-xl bg-gray-100 p-8">
              <p className="text-gray-500">Please add comparison items</p>
            </div>
          )
        }
        return (
          <CardsComparison
            items={items}
            accentColor={safeAccentColor}
            enableAnimation={safeEnableAnimation}
          />
        )

      default:
        return null
    }
  }

  return (
    <motion.section {...containerVariants} className="py-12 md:py-16" aria-label="Comparison">
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

        {/* Comparison Content */}
        <div className="mx-auto max-w-6xl">{renderComparison()}</div>
      </div>
    </motion.section>
  )
}
