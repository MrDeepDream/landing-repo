'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { getIcon, type IconName } from '@/lib/icons'

/**
 * Feature item interface for the FeaturesBlock
 */
interface FeatureItem {
  icon?: IconName | string | null
  title: string
  description?: string | null
  link?: {
    label?: string | null
    url?: string | null
    openInNewTab?: boolean | null
  } | null
  id?: string | null
}

/**
 * Props interface for the FeaturesBlock component
 */
export interface FeaturesBlockProps {
  title?: string | null
  subtitle?: string | null
  layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'list' | null
  cardStyle?: 'minimal' | 'bordered' | 'elevated' | 'gradient' | null
  items?: FeatureItem[] | null
  showCTAs?: boolean | null
  enableAnimation?: boolean | null
}

/**
 * FeaturesBlock Component
 *
 * A flexible grid/list component for displaying features, services,
 * benefits, or advantages with icons.
 *
 * @example
 * ```tsx
 * <FeaturesBlock
 *   title="Our Services"
 *   subtitle="What we offer"
 *   layout="grid-3"
 *   cardStyle="elevated"
 *   items={[
 *     { icon: 'Shield', title: 'Security', description: 'Enterprise-grade security' },
 *     { icon: 'Zap', title: 'Speed', description: 'Lightning fast performance' },
 *   ]}
 *   showCTAs={true}
 * />
 * ```
 */
export function FeaturesBlock({
  title,
  subtitle,
  layout = 'grid-3',
  cardStyle = 'elevated',
  items,
  showCTAs = true,
  enableAnimation = true,
}: FeaturesBlockProps) {
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

  // Stagger animation for items
  const getItemVariants = (index: number) =>
    enableAnimation
      ? {
          initial: { y: 30, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { delay: 0.1 + index * 0.1, duration: 0.5 },
        }
      : {}

  // Grid layout classes based on layout prop
  const getGridClasses = (): string => {
    switch (layout) {
      case 'grid-2':
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2'
      case 'grid-3':
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
      case 'grid-4':
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
      case 'list':
        return 'flex flex-col gap-4'
      default:
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  // Card style classes based on cardStyle prop
  const getCardClasses = (): string => {
    const baseClasses = 'rounded-xl p-6 transition-all duration-300'

    switch (cardStyle) {
      case 'minimal':
        return `${baseClasses} bg-transparent hover:bg-slate-50`
      case 'bordered':
        return `${baseClasses} border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md`
      case 'elevated':
        return `${baseClasses} bg-white shadow-md hover:shadow-xl hover:-translate-y-1`
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-indigo-50 via-white to-purple-50 hover:from-indigo-100 hover:to-purple-100`
      default:
        return `${baseClasses} bg-white shadow-md hover:shadow-xl hover:-translate-y-1`
    }
  }

  // List item style classes
  const getListItemClasses = (): string => {
    const baseClasses = 'flex items-start gap-4 rounded-lg p-4 transition-all duration-300'

    switch (cardStyle) {
      case 'minimal':
        return `${baseClasses} bg-transparent hover:bg-slate-50`
      case 'bordered':
        return `${baseClasses} border border-slate-200 bg-white hover:border-indigo-300`
      case 'elevated':
        return `${baseClasses} bg-white shadow-sm hover:shadow-md`
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100`
      default:
        return `${baseClasses} bg-white shadow-sm hover:shadow-md`
    }
  }

  // Render a single feature card (grid layout)
  const renderCard = (item: FeatureItem, index: number) => {
    const IconComponent = item.icon ? getIcon(item.icon) : null

    return (
      <motion.div key={item.id || index} {...getItemVariants(index)} className={getCardClasses()}>
        {/* Icon */}
        {IconComponent && (
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
            <IconComponent className="h-6 w-6" />
          </div>
        )}

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>

        {/* Description */}
        {item.description && (
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        )}

        {/* CTA Link */}
        {showCTAs && item.link?.url && item.link?.label && (
          <Link
            href={item.link.url}
            target={item.link.openInNewTab ? '_blank' : '_self'}
            rel={item.link.openInNewTab ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
          >
            {item.link.label}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </motion.div>
    )
  }

  // Render a single feature item (list layout)
  const renderListItem = (item: FeatureItem, index: number) => {
    const IconComponent = item.icon ? getIcon(item.icon) : null

    return (
      <motion.div
        key={item.id || index}
        {...getItemVariants(index)}
        className={getListItemClasses()}
      >
        {/* Icon */}
        {IconComponent && (
          <div className="flex-shrink-0">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
              <IconComponent className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <h3 className="mb-1 text-base font-semibold text-foreground">{item.title}</h3>
          {item.description && (
            <p className="mb-2 text-sm text-muted-foreground">{item.description}</p>
          )}
          {showCTAs && item.link?.url && item.link?.label && (
            <Link
              href={item.link.url}
              target={item.link.openInNewTab ? '_blank' : '_self'}
              rel={item.link.openInNewTab ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
            >
              {item.link.label}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </motion.div>
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

        {/* Features Grid/List */}
        <div className={getGridClasses()}>
          {items.map((item, index) =>
            layout === 'list' ? renderListItem(item, index) : renderCard(item, index)
          )}
        </div>
      </div>
    </motion.section>
  )
}
