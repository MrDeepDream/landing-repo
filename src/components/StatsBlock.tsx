'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { getIcon, type IconName } from '@/lib/icons'

/**
 * Accent color type for stats styling
 */
type AccentColor = 'amber' | 'indigo' | 'purple' | 'green' | 'blue'

/**
 * Stat item interface
 */
interface StatItem {
  value: number
  suffix?: string | null
  prefix?: string | null
  label: string
  icon?: IconName | string | null
  id?: string | null
}

/**
 * Props interface for the StatsBlock component
 */
export interface StatsBlockProps {
  title?: string | null
  layout?: 'row' | 'grid-2' | 'grid-4' | null
  stats?: StatItem[] | null
  animateOnScroll?: boolean | null
  accentColor?: AccentColor | null
  enableAnimation?: boolean | null
}

/**
 * Custom hook for counting animation
 * Animates a number from 0 to target value
 */
function useCountUp(
  targetValue: number,
  duration: number = 2000,
  shouldStart: boolean = true
): number {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!shouldStart) {
      setCount(0)
      return
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setCount(Math.floor(easedProgress * targetValue))

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setCount(targetValue)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      startTimeRef.current = null
    }
  }, [targetValue, duration, shouldStart])

  return count
}

/**
 * Single Stat Card Component with animated counter
 */
function StatCard({
  stat,
  accentColor,
  isVisible,
  index,
  enableAnimation,
}: {
  stat: StatItem
  accentColor: AccentColor
  isVisible: boolean
  index: number
  enableAnimation: boolean
}) {
  const count = useCountUp(stat.value, 2000, isVisible)
  const IconComponent = stat.icon ? getIcon(stat.icon) : null

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

  const accentGradientClasses: Record<AccentColor, string> = {
    amber: 'from-amber-500 to-orange-500',
    indigo: 'from-indigo-500 to-purple-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
  }

  const cardVariants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.1, duration: 0.5 },
      }
    : {}

  return (
    <motion.div
      {...cardVariants}
      className={`relative rounded-xl border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md ${accentBorderClasses[accentColor]}`}
    >
      {/* Icon */}
      {IconComponent && (
        <div
          className={`mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${accentGradientClasses[accentColor]} text-white shadow-md`}
        >
          <IconComponent className="h-6 w-6" />
        </div>
      )}

      {/* Value with prefix/suffix */}
      <div className={`mb-2 text-4xl font-bold ${accentTextClasses[accentColor]} md:text-5xl`}>
        {stat.prefix && <span>{stat.prefix}</span>}
        <span>{isVisible ? count : 0}</span>
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>

      {/* Label */}
      <div className="text-sm font-medium text-gray-600 md:text-base">{stat.label}</div>

      {/* Decorative accent line */}
      <div
        className={`mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${accentGradientClasses[accentColor]}`}
      />
    </motion.div>
  )
}

/**
 * StatsBlock Component
 *
 * A flexible statistics display component with animated number counters.
 * Supports multiple layouts and accent colors with scroll-triggered animations.
 *
 * @example
 * ```tsx
 * <StatsBlock
 *   title="Our Impact"
 *   layout="grid-4"
 *   stats={[
 *     { value: 500, suffix: '+', label: 'Happy Clients', icon: 'Users' },
 *     { value: 10, suffix: 'K', label: 'Projects Completed', icon: 'Briefcase' },
 *     { value: 99, suffix: '%', label: 'Satisfaction Rate', icon: 'Star' },
 *     { value: 24, suffix: '/7', label: 'Support', icon: 'Clock' },
 *   ]}
 *   animateOnScroll={true}
 *   accentColor="indigo"
 * />
 * ```
 */
export function StatsBlock({
  title,
  layout = 'grid-4',
  stats,
  animateOnScroll = true,
  accentColor = 'indigo',
  enableAnimation = true,
}: StatsBlockProps) {
  const [isVisible, setIsVisible] = useState(!animateOnScroll)
  const sectionRef = useRef<HTMLElement>(null)

  const safeAccentColor = accentColor || 'indigo'
  const safeLayout = layout || 'grid-4'

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    if (!animateOnScroll) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Once visible, stop observing
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -50px 0px', // Slight offset from bottom
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [animateOnScroll])

  // Return null if no stats provided
  if (!stats || stats.length === 0) {
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

  // Grid layout classes based on layout prop
  const getGridClasses = (): string => {
    switch (safeLayout) {
      case 'row':
        return 'flex flex-wrap justify-center gap-6'
      case 'grid-2':
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2'
      case 'grid-4':
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
    }
  }

  // For row layout, we need to constrain item widths
  const getItemClasses = (): string => {
    if (safeLayout === 'row') {
      return 'flex-1 min-w-[200px] max-w-[280px]'
    }
    return ''
  }

  return (
    <motion.section
      ref={sectionRef}
      {...containerVariants}
      className="py-12 md:py-16"
      aria-label="Statistics"
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        {title && (
          <motion.div {...headerVariants} className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className={getGridClasses()}>
          {stats.map((stat, index) => (
            <div key={stat.id || index} className={getItemClasses()}>
              <StatCard
                stat={stat}
                accentColor={safeAccentColor}
                isVisible={isVisible}
                index={index}
                enableAnimation={enableAnimation ?? true}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
