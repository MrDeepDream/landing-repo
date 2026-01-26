'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { getIcon, type IconName } from '@/lib/icons'
import { Check, Circle } from 'lucide-react'

/**
 * Accent color type for timeline styling
 */
type AccentColor = 'amber' | 'indigo' | 'purple' | 'green' | 'blue'

/**
 * Timeline item status
 */
type TimelineStatus = 'completed' | 'current' | 'upcoming'

/**
 * Timeline item interface
 */
interface TimelineItem {
  label: string
  title: string
  description?: string | null
  icon?: IconName | string | null
  status?: TimelineStatus | null
  id?: string | null
}

/**
 * Props interface for the TimelineBlock component
 */
export interface TimelineBlockProps {
  title?: string | null
  subtitle?: string | null
  layout?: 'vertical' | 'horizontal' | 'alternating' | null
  items?: TimelineItem[] | null
  showConnectors?: boolean | null
  accentColor?: AccentColor | null
  enableAnimation?: boolean | null
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
      border: 'border-amber-300',
      gradient: 'from-amber-500 to-orange-500',
      ring: 'ring-amber-400',
      connector: 'bg-amber-300',
    },
    indigo: {
      text: 'text-indigo-600',
      bg: 'bg-indigo-500',
      bgLight: 'bg-indigo-100',
      border: 'border-indigo-300',
      gradient: 'from-indigo-500 to-purple-500',
      ring: 'ring-indigo-400',
      connector: 'bg-indigo-300',
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-100',
      border: 'border-purple-300',
      gradient: 'from-purple-500 to-pink-500',
      ring: 'ring-purple-400',
      connector: 'bg-purple-300',
    },
    green: {
      text: 'text-green-600',
      bg: 'bg-green-500',
      bgLight: 'bg-green-100',
      border: 'border-green-300',
      gradient: 'from-green-500 to-emerald-500',
      ring: 'ring-green-400',
      connector: 'bg-green-300',
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-100',
      border: 'border-blue-300',
      gradient: 'from-blue-500 to-cyan-500',
      ring: 'ring-blue-400',
      connector: 'bg-blue-300',
    },
  }
  return classes[accentColor]
}

/**
 * Timeline indicator component for each item
 */
function TimelineIndicator({
  status,
  icon,
  accentColor,
  isAnimating,
}: {
  status: TimelineStatus
  icon?: IconName | string | null
  accentColor: AccentColor
  isAnimating: boolean
}) {
  const colors = getAccentClasses(accentColor)
  const IconComponent = icon ? getIcon(icon) : null

  // Completed status - filled circle with checkmark
  if (status === 'completed') {
    return (
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${colors.gradient} text-white shadow-lg`}
      >
        {IconComponent ? <IconComponent className="h-5 w-5" /> : <Check className="h-5 w-5" />}
      </div>
    )
  }

  // Current status - pulsing indicator with accent border
  if (status === 'current') {
    return (
      <div className="relative">
        {/* Pulse ring animation */}
        {isAnimating && (
          <motion.div
            className={`absolute inset-0 rounded-full ${colors.bg} opacity-30`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 ${colors.border} ${colors.bgLight}`}
        >
          {IconComponent ? (
            <IconComponent className={`h-5 w-5 ${colors.text}`} />
          ) : (
            <div className={`h-3 w-3 rounded-full ${colors.bg}`} />
          )}
        </div>
      </div>
    )
  }

  // Upcoming status - outlined circle, muted
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50">
      {IconComponent ? (
        <IconComponent className="h-5 w-5 text-gray-400" />
      ) : (
        <Circle className="h-5 w-5 text-gray-400" />
      )}
    </div>
  )
}

/**
 * Vertical layout timeline item
 */
function VerticalTimelineItem({
  item,
  index,
  accentColor,
  showConnector,
  isLast,
  enableAnimation,
}: {
  item: TimelineItem
  index: number
  accentColor: AccentColor
  showConnector: boolean
  isLast: boolean
  enableAnimation: boolean
}) {
  const colors = getAccentClasses(accentColor)
  const status = item.status || 'upcoming'

  const itemVariants = enableAnimation
    ? {
        initial: { x: -30, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.15, duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...itemVariants} className="relative flex gap-6">
      {/* Connector line */}
      {showConnector && !isLast && (
        <div
          className={`absolute left-5 top-12 h-[calc(100%-2rem)] w-0.5 ${
            status === 'completed' ? colors.connector : 'bg-gray-200'
          }`}
        />
      )}

      {/* Indicator */}
      <div className="relative z-10 flex-shrink-0">
        <TimelineIndicator
          status={status}
          icon={item.icon}
          accentColor={accentColor}
          isAnimating={enableAnimation}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        {/* Label/Date badge */}
        <span
          className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            status === 'completed'
              ? `${colors.bgLight} ${colors.text}`
              : status === 'current'
                ? `${colors.bgLight} ${colors.text}`
                : 'bg-gray-100 text-gray-600'
          }`}
        >
          {item.label}
        </span>

        {/* Title */}
        <h3
          className={`mb-2 text-lg font-semibold ${
            status === 'upcoming' ? 'text-gray-500' : 'text-foreground'
          }`}
        >
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p
            className={`text-sm leading-relaxed ${
              status === 'upcoming' ? 'text-gray-400' : 'text-muted-foreground'
            }`}
          >
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Horizontal layout timeline item
 */
function HorizontalTimelineItem({
  item,
  index,
  accentColor,
  showConnector,
  isLast,
  enableAnimation,
}: {
  item: TimelineItem
  index: number
  accentColor: AccentColor
  showConnector: boolean
  isLast: boolean
  enableAnimation: boolean
}) {
  const colors = getAccentClasses(accentColor)
  const status = item.status || 'upcoming'

  const itemVariants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.15, duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...itemVariants} className="relative flex min-w-[200px] flex-col items-center">
      {/* Connector line */}
      {showConnector && !isLast && (
        <div
          className={`absolute left-[calc(50%+1.25rem)] top-5 h-0.5 w-[calc(100%-1.25rem)] ${
            status === 'completed' ? colors.connector : 'bg-gray-200'
          }`}
        />
      )}

      {/* Indicator */}
      <div className="relative z-10 mb-4">
        <TimelineIndicator
          status={status}
          icon={item.icon}
          accentColor={accentColor}
          isAnimating={enableAnimation}
        />
      </div>

      {/* Content */}
      <div className="text-center">
        {/* Label/Date badge */}
        <span
          className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            status === 'completed'
              ? `${colors.bgLight} ${colors.text}`
              : status === 'current'
                ? `${colors.bgLight} ${colors.text}`
                : 'bg-gray-100 text-gray-600'
          }`}
        >
          {item.label}
        </span>

        {/* Title */}
        <h3
          className={`mb-2 text-base font-semibold ${
            status === 'upcoming' ? 'text-gray-500' : 'text-foreground'
          }`}
        >
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p
            className={`text-sm leading-relaxed ${
              status === 'upcoming' ? 'text-gray-400' : 'text-muted-foreground'
            }`}
          >
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Alternating layout timeline item
 */
function AlternatingTimelineItem({
  item,
  index,
  accentColor,
  showConnector,
  isLast,
  enableAnimation,
}: {
  item: TimelineItem
  index: number
  accentColor: AccentColor
  showConnector: boolean
  isLast: boolean
  enableAnimation: boolean
}) {
  const colors = getAccentClasses(accentColor)
  const status = item.status || 'upcoming'
  const isLeft = index % 2 === 0

  const itemVariants = enableAnimation
    ? {
        initial: { x: isLeft ? -30 : 30, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.15, duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...itemVariants} className="relative flex items-start">
      {/* Left side content or spacer */}
      <div className={`w-[calc(50%-1.25rem)] ${isLeft ? 'pr-8 text-right' : ''}`}>
        {isLeft && (
          <>
            {/* Label/Date badge */}
            <span
              className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                status === 'completed'
                  ? `${colors.bgLight} ${colors.text}`
                  : status === 'current'
                    ? `${colors.bgLight} ${colors.text}`
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.label}
            </span>

            {/* Title */}
            <h3
              className={`mb-2 text-lg font-semibold ${
                status === 'upcoming' ? 'text-gray-500' : 'text-foreground'
              }`}
            >
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p
                className={`text-sm leading-relaxed ${
                  status === 'upcoming' ? 'text-gray-400' : 'text-muted-foreground'
                }`}
              >
                {item.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Center indicator and connector */}
      <div className="relative flex flex-shrink-0 justify-center">
        {/* Connector line */}
        {showConnector && !isLast && (
          <div
            className={`absolute left-1/2 top-12 h-[calc(100%+2rem)] w-0.5 -translate-x-1/2 ${
              status === 'completed' ? colors.connector : 'bg-gray-200'
            }`}
          />
        )}

        {/* Indicator */}
        <div className="relative z-10">
          <TimelineIndicator
            status={status}
            icon={item.icon}
            accentColor={accentColor}
            isAnimating={enableAnimation}
          />
        </div>
      </div>

      {/* Right side content or spacer */}
      <div className={`w-[calc(50%-1.25rem)] ${!isLeft ? 'pl-8' : ''}`}>
        {!isLeft && (
          <>
            {/* Label/Date badge */}
            <span
              className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                status === 'completed'
                  ? `${colors.bgLight} ${colors.text}`
                  : status === 'current'
                    ? `${colors.bgLight} ${colors.text}`
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {item.label}
            </span>

            {/* Title */}
            <h3
              className={`mb-2 text-lg font-semibold ${
                status === 'upcoming' ? 'text-gray-500' : 'text-foreground'
              }`}
            >
              {item.title}
            </h3>

            {/* Description */}
            {item.description && (
              <p
                className={`text-sm leading-relaxed ${
                  status === 'upcoming' ? 'text-gray-400' : 'text-muted-foreground'
                }`}
              >
                {item.description}
              </p>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

/**
 * TimelineBlock Component
 *
 * A flexible timeline component for visualizing processes, history, roadmaps, and milestones.
 * Supports vertical, horizontal, and alternating layouts with customizable styling.
 *
 * @example
 * ```tsx
 * <TimelineBlock
 *   title="Our Journey"
 *   subtitle="Key milestones in our company history"
 *   layout="vertical"
 *   items={[
 *     { label: '2020', title: 'Founded', description: 'Company started', status: 'completed' },
 *     { label: '2022', title: 'Growth', description: 'Expanded team', status: 'completed' },
 *     { label: '2024', title: 'Today', description: 'Current phase', status: 'current' },
 *     { label: '2025', title: 'Future', description: 'Planned expansion', status: 'upcoming' },
 *   ]}
 *   showConnectors={true}
 *   accentColor="indigo"
 * />
 * ```
 */
export function TimelineBlock({
  title,
  subtitle,
  layout = 'vertical',
  items,
  showConnectors = true,
  accentColor = 'indigo',
  enableAnimation = true,
}: TimelineBlockProps) {
  const [isVisible, setIsVisible] = useState(!enableAnimation)
  const sectionRef = useRef<HTMLElement>(null)

  const safeAccentColor = accentColor || 'indigo'
  const safeLayout = layout || 'vertical'
  const safeShowConnectors = showConnectors !== false

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    if (!enableAnimation) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [enableAnimation])

  // Return null if no items provided
  if (!items || items.length === 0) {
    return null
  }

  // Animation variants for container
  const containerVariants = enableAnimation
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  // Animation variants for header
  const headerVariants = enableAnimation
    ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  // Render vertical layout
  const renderVerticalLayout = () => (
    <div className="mx-auto max-w-2xl">
      {items.map((item, index) => (
        <VerticalTimelineItem
          key={item.id || index}
          item={item}
          index={index}
          accentColor={safeAccentColor}
          showConnector={safeShowConnectors}
          isLast={index === items.length - 1}
          enableAnimation={isVisible && (enableAnimation ?? true)}
        />
      ))}
    </div>
  )

  // Render horizontal layout
  const renderHorizontalLayout = () => (
    <div className="relative overflow-x-auto pb-4">
      <div className="flex min-w-max gap-8 px-4">
        {items.map((item, index) => (
          <HorizontalTimelineItem
            key={item.id || index}
            item={item}
            index={index}
            accentColor={safeAccentColor}
            showConnector={safeShowConnectors}
            isLast={index === items.length - 1}
            enableAnimation={isVisible && (enableAnimation ?? true)}
          />
        ))}
      </div>
    </div>
  )

  // Render alternating layout
  const renderAlternatingLayout = () => (
    <div className="mx-auto max-w-4xl space-y-8">
      {items.map((item, index) => (
        <AlternatingTimelineItem
          key={item.id || index}
          item={item}
          index={index}
          accentColor={safeAccentColor}
          showConnector={safeShowConnectors}
          isLast={index === items.length - 1}
          enableAnimation={isVisible && (enableAnimation ?? true)}
        />
      ))}
    </div>
  )

  return (
    <motion.section
      ref={sectionRef}
      {...containerVariants}
      className="py-12 md:py-16"
      aria-label="Timeline"
    >
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

        {/* Timeline Content */}
        {safeLayout === 'vertical' && renderVerticalLayout()}
        {safeLayout === 'horizontal' && renderHorizontalLayout()}
        {safeLayout === 'alternating' && renderAlternatingLayout()}
      </div>
    </motion.section>
  )
}
