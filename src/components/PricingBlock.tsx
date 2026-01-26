'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, X } from 'lucide-react'

/**
 * Accent color type for pricing styling
 */
type AccentColor = 'amber' | 'indigo' | 'purple' | 'green' | 'blue'

/**
 * CTA button style type
 */
type CTAStyle = 'solid' | 'outline'

/**
 * Layout type for pricing display
 */
type PricingLayout = 'cards' | 'table' | 'comparison'

/**
 * Feature item interface
 */
interface PlanFeature {
  text: string
  included?: boolean | null
  id?: string | null
}

/**
 * CTA interface
 */
interface PlanCTA {
  label?: string | null
  url?: string | null
  style?: CTAStyle | null
  openInNewTab?: boolean | null
}

/**
 * Plan item interface
 */
interface PricingPlan {
  name: string
  description?: string | null
  monthlyPrice?: number | null
  yearlyPrice?: number | null
  currency?: string | null
  billingPeriod?: string | null
  features?: PlanFeature[] | null
  cta?: PlanCTA | null
  highlighted?: boolean | null
  badge?: string | null
  id?: string | null
}

/**
 * Props interface for the PricingBlock component
 */
export interface PricingBlockProps {
  title?: string | null
  subtitle?: string | null
  layout?: PricingLayout | null
  billingToggle?: boolean | null
  plans?: PricingPlan[] | null
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
      bgLighter: 'bg-amber-50',
      border: 'border-amber-300',
      borderHighlight: 'border-amber-500',
      gradient: 'from-amber-500 to-orange-500',
      ring: 'ring-amber-400',
      hover: 'hover:bg-amber-600',
      toggle: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-700',
      checkBg: 'bg-amber-100',
      checkText: 'text-amber-600',
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
      toggle: 'bg-indigo-500',
      badge: 'bg-indigo-100 text-indigo-700',
      checkBg: 'bg-indigo-100',
      checkText: 'text-indigo-600',
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
      toggle: 'bg-purple-500',
      badge: 'bg-purple-100 text-purple-700',
      checkBg: 'bg-purple-100',
      checkText: 'text-purple-600',
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
      toggle: 'bg-green-500',
      badge: 'bg-green-100 text-green-700',
      checkBg: 'bg-green-100',
      checkText: 'text-green-600',
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
      toggle: 'bg-blue-500',
      badge: 'bg-blue-100 text-blue-700',
      checkBg: 'bg-blue-100',
      checkText: 'text-blue-600',
    },
  }
  return classes[accentColor]
}

/**
 * Billing toggle component
 */
function BillingToggle({
  isYearly,
  onToggle,
  accentColor,
}: {
  isYearly: boolean
  onToggle: () => void
  accentColor: AccentColor
}) {
  const colors = getAccentClasses(accentColor)

  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`text-sm font-medium transition-colors ${!isYearly ? colors.text : 'text-gray-500'}`}
      >
        Monthly
      </span>
      <button
        type="button"
        onClick={onToggle}
        className={`relative h-7 w-14 rounded-full transition-colors ${colors.toggle}`}
        aria-label={isYearly ? 'Switch to monthly billing' : 'Switch to yearly billing'}
      >
        <motion.div
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-md"
          animate={{ left: isYearly ? '32px' : '4px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${isYearly ? colors.text : 'text-gray-500'}`}
      >
        Yearly
        <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${colors.badge}`}>Save 20%</span>
      </span>
    </div>
  )
}

/**
 * Price display component with animation
 */
function PriceDisplay({
  monthlyPrice,
  yearlyPrice,
  currency,
  billingPeriod,
  isYearly,
  accentColor,
  highlighted,
}: {
  monthlyPrice?: number | null
  yearlyPrice?: number | null
  currency?: string | null
  billingPeriod?: string | null
  isYearly: boolean
  accentColor: AccentColor
  highlighted?: boolean | null
}) {
  const colors = getAccentClasses(accentColor)
  const price = isYearly && yearlyPrice != null ? yearlyPrice : monthlyPrice
  const safeCurrency = currency || '$'
  const safeBillingPeriod = billingPeriod || '/month'

  if (price == null) {
    return (
      <div className="mb-6">
        <span className={`text-3xl font-bold ${highlighted ? colors.text : 'text-foreground'}`}>
          Contact Us
        </span>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-center gap-1">
        <span className={`text-lg ${highlighted ? colors.text : 'text-gray-500'}`}>
          {safeCurrency}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={`${price}-${isYearly}`}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`text-5xl font-bold ${highlighted ? colors.text : 'text-foreground'}`}
          >
            {price}
          </motion.span>
        </AnimatePresence>
        <span className="text-sm text-gray-500">{safeBillingPeriod}</span>
      </div>
    </div>
  )
}

/**
 * Feature list item component
 */
function FeatureItem({ feature, accentColor }: { feature: PlanFeature; accentColor: AccentColor }) {
  const colors = getAccentClasses(accentColor)
  const isIncluded = feature.included !== false

  return (
    <li className="flex items-start gap-3">
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
}

/**
 * CTA Button component
 */
function CTAButton({
  cta,
  accentColor,
  highlighted,
}: {
  cta: PlanCTA
  accentColor: AccentColor
  highlighted?: boolean | null
}) {
  const colors = getAccentClasses(accentColor)
  const style = cta.style || 'solid'

  const baseClasses =
    'inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200'

  const styleClasses =
    style === 'solid' || highlighted
      ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md hover:shadow-lg hover:scale-[1.02]`
      : `border-2 ${colors.border} ${colors.text} hover:${colors.bgLighter}`

  return (
    <a
      href={cta.url || '#'}
      target={cta.openInNewTab ? '_blank' : undefined}
      rel={cta.openInNewTab ? 'noopener noreferrer' : undefined}
      className={`${baseClasses} ${styleClasses}`}
    >
      {cta.label || 'Get Started'}
    </a>
  )
}

/**
 * Single pricing card component
 */
function PricingCard({
  plan,
  isYearly,
  accentColor,
  index,
  enableAnimation,
}: {
  plan: PricingPlan
  isYearly: boolean
  accentColor: AccentColor
  index: number
  enableAnimation: boolean
}) {
  const colors = getAccentClasses(accentColor)
  const isHighlighted = plan.highlighted === true

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
      className={`relative flex flex-col rounded-2xl border-2 bg-white p-8 shadow-sm transition-all duration-300 ${
        isHighlighted
          ? `${colors.borderHighlight} scale-105 shadow-lg`
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold ${colors.badge}`}
        >
          {plan.badge}
        </div>
      )}

      {/* Plan name */}
      <h3 className="mb-2 text-center text-xl font-bold text-foreground">{plan.name}</h3>

      {/* Description */}
      {plan.description && (
        <p className="mb-6 text-center text-sm text-gray-500">{plan.description}</p>
      )}

      {/* Price */}
      <PriceDisplay
        monthlyPrice={plan.monthlyPrice}
        yearlyPrice={plan.yearlyPrice}
        currency={plan.currency}
        billingPeriod={plan.billingPeriod}
        isYearly={isYearly}
        accentColor={accentColor}
        highlighted={isHighlighted}
      />

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <ul className="mb-8 flex-1 space-y-3 text-sm">
          {plan.features.map((feature, featureIndex) => (
            <FeatureItem
              key={feature.id || featureIndex}
              feature={feature}
              accentColor={accentColor}
            />
          ))}
        </ul>
      )}

      {/* CTA */}
      {plan.cta && plan.cta.label && (
        <CTAButton cta={plan.cta} accentColor={accentColor} highlighted={isHighlighted} />
      )}
    </motion.div>
  )
}

/**
 * Cards layout component
 */
function CardsLayout({
  plans,
  isYearly,
  accentColor,
  enableAnimation,
}: {
  plans: PricingPlan[]
  isYearly: boolean
  accentColor: AccentColor
  enableAnimation: boolean
}) {
  // Determine grid columns based on number of plans
  const gridCols =
    plans.length === 1
      ? 'max-w-md'
      : plans.length === 2
        ? 'max-w-2xl grid-cols-1 sm:grid-cols-2'
        : plans.length === 3
          ? 'max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`mx-auto grid gap-8 ${gridCols}`}>
      {plans.map((plan, index) => (
        <PricingCard
          key={plan.id || index}
          plan={plan}
          isYearly={isYearly}
          accentColor={accentColor}
          index={index}
          enableAnimation={enableAnimation}
        />
      ))}
    </div>
  )
}

/**
 * Table layout component
 */
function TableLayout({
  plans,
  isYearly,
  accentColor,
  enableAnimation,
}: {
  plans: PricingPlan[]
  isYearly: boolean
  accentColor: AccentColor
  enableAnimation: boolean
}) {
  const colors = getAccentClasses(accentColor)

  // Collect all unique features from all plans
  const allFeatures = new Map<string, boolean[]>()
  plans.forEach((plan, planIndex) => {
    plan.features?.forEach((feature) => {
      if (!allFeatures.has(feature.text)) {
        allFeatures.set(feature.text, new Array(plans.length).fill(false))
      }
      const featureRow = allFeatures.get(feature.text)
      if (featureRow) {
        featureRow[planIndex] = feature.included !== false
      }
    })
  })

  const tableVariants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...tableVariants} className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-200 p-4 text-left text-sm font-semibold text-gray-600">
              Features
            </th>
            {plans.map((plan, index) => (
              <th
                key={plan.id || index}
                className={`border-b-2 p-4 text-center ${
                  plan.highlighted
                    ? `${colors.borderHighlight} ${colors.bgLighter}`
                    : 'border-gray-200'
                }`}
              >
                <div className="mb-2">
                  {plan.badge && (
                    <span
                      className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${colors.badge}`}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                </div>
                <PriceDisplay
                  monthlyPrice={plan.monthlyPrice}
                  yearlyPrice={plan.yearlyPrice}
                  currency={plan.currency}
                  billingPeriod={plan.billingPeriod}
                  isYearly={isYearly}
                  accentColor={accentColor}
                  highlighted={plan.highlighted}
                />
                {plan.cta && plan.cta.label && (
                  <div className="mt-4">
                    <CTAButton
                      cta={plan.cta}
                      accentColor={accentColor}
                      highlighted={plan.highlighted}
                    />
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(allFeatures.entries()).map(([featureText, includedArray], rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="border-b border-gray-100 p-4 text-sm text-gray-700">{featureText}</td>
              {includedArray.map((included, colIndex) => {
                const plan = plans[colIndex]
                return (
                  <td
                    key={colIndex}
                    className={`border-b border-gray-100 p-4 text-center ${
                      plan?.highlighted ? colors.bgLighter : ''
                    }`}
                  >
                    {included ? (
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${colors.checkBg}`}
                      >
                        <Check className={`h-4 w-4 ${colors.checkText}`} />
                      </span>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                        <X className="h-4 w-4 text-gray-400" />
                      </span>
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
 * Comparison layout component - feature comparison grid
 */
function ComparisonLayout({
  plans,
  isYearly,
  accentColor,
  enableAnimation,
}: {
  plans: PricingPlan[]
  isYearly: boolean
  accentColor: AccentColor
  enableAnimation: boolean
}) {
  const colors = getAccentClasses(accentColor)

  // Collect all unique features from all plans
  const allFeatures = new Map<string, boolean[]>()
  plans.forEach((plan, planIndex) => {
    plan.features?.forEach((feature) => {
      if (!allFeatures.has(feature.text)) {
        allFeatures.set(feature.text, new Array(plans.length).fill(false))
      }
      const featureRow = allFeatures.get(feature.text)
      if (featureRow) {
        featureRow[planIndex] = feature.included !== false
      }
    })
  })

  const comparisonVariants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...comparisonVariants} className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Plan headers */}
        <div
          className="mb-6 grid"
          style={{ gridTemplateColumns: `200px repeat(${plans.length}, 1fr)` }}
        >
          <div /> {/* Empty corner cell */}
          {plans.map((plan, index) => (
            <div
              key={plan.id || index}
              className={`rounded-t-xl p-6 text-center ${
                plan.highlighted ? `bg-gradient-to-br ${colors.gradient} text-white` : 'bg-gray-100'
              }`}
            >
              {plan.badge && (
                <span
                  className={`mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    plan.highlighted ? 'bg-white/20 text-white' : colors.badge
                  }`}
                >
                  {plan.badge}
                </span>
              )}
              <h3
                className={`text-xl font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}
              >
                {plan.name}
              </h3>
              {plan.description && (
                <p
                  className={`mt-1 text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-500'}`}
                >
                  {plan.description}
                </p>
              )}
              <div className="mt-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={plan.highlighted ? 'text-white/80' : 'text-gray-500'}>
                    {plan.currency || '$'}
                  </span>
                  <span
                    className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : colors.text}`}
                  >
                    {isYearly && plan.yearlyPrice != null
                      ? plan.yearlyPrice
                      : plan.monthlyPrice != null
                        ? plan.monthlyPrice
                        : '--'}
                  </span>
                  <span className={plan.highlighted ? 'text-white/80' : 'text-gray-500'}>
                    {plan.billingPeriod || '/mo'}
                  </span>
                </div>
              </div>
              {plan.cta && plan.cta.label && (
                <div className="mt-4">
                  <a
                    href={plan.cta.url || '#'}
                    target={plan.cta.openInNewTab ? '_blank' : undefined}
                    rel={plan.cta.openInNewTab ? 'noopener noreferrer' : undefined}
                    className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : `${colors.bg} text-white ${colors.hover}`
                    }`}
                  >
                    {plan.cta.label}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feature rows */}
        <div className="rounded-xl border border-gray-200 bg-white">
          {Array.from(allFeatures.entries()).map(([featureText, includedArray], rowIndex) => (
            <div
              key={rowIndex}
              className={`grid items-center border-b border-gray-100 last:border-b-0 ${
                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
              style={{ gridTemplateColumns: `200px repeat(${plans.length}, 1fr)` }}
            >
              <div className="p-4 text-sm font-medium text-gray-700">{featureText}</div>
              {includedArray.map((included, colIndex) => {
                const plan = plans[colIndex]
                return (
                  <div
                    key={colIndex}
                    className={`flex items-center justify-center p-4 ${
                      plan?.highlighted ? colors.bgLighter : ''
                    }`}
                  >
                    {included ? (
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${colors.checkBg}`}
                      >
                        <Check className={`h-5 w-5 ${colors.checkText}`} />
                      </span>
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                        <X className="h-5 w-5 text-gray-400" />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/**
 * PricingBlock Component
 *
 * A flexible pricing display component for SaaS pricing, service tiers,
 * membership levels, and product comparison.
 *
 * @example
 * ```tsx
 * <PricingBlock
 *   title="Choose Your Plan"
 *   subtitle="Start free, upgrade anytime"
 *   layout="cards"
 *   billingToggle={true}
 *   plans={[
 *     {
 *       name: 'Basic',
 *       description: 'For individuals',
 *       monthlyPrice: 9,
 *       yearlyPrice: 7,
 *       currency: '$',
 *       billingPeriod: '/month',
 *       features: [
 *         { text: '5 Projects', included: true },
 *         { text: '10GB Storage', included: true },
 *         { text: 'Priority Support', included: false },
 *       ],
 *       cta: { label: 'Get Started', url: '/signup', style: 'outline' },
 *     },
 *     {
 *       name: 'Pro',
 *       description: 'For teams',
 *       monthlyPrice: 29,
 *       yearlyPrice: 23,
 *       currency: '$',
 *       billingPeriod: '/month',
 *       highlighted: true,
 *       badge: 'Most Popular',
 *       features: [
 *         { text: 'Unlimited Projects', included: true },
 *         { text: '100GB Storage', included: true },
 *         { text: 'Priority Support', included: true },
 *       ],
 *       cta: { label: 'Start Free Trial', url: '/signup/pro', style: 'solid' },
 *     },
 *   ]}
 *   accentColor="indigo"
 * />
 * ```
 */
export function PricingBlock({
  title,
  subtitle,
  layout = 'cards',
  billingToggle = false,
  plans,
  accentColor = 'indigo',
  enableAnimation = true,
}: PricingBlockProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [isVisible, setIsVisible] = useState(!enableAnimation)
  const sectionRef = useRef<HTMLElement>(null)

  const safeAccentColor = accentColor || 'indigo'
  const safeLayout = layout || 'cards'
  const safeBillingToggle = billingToggle === true
  const safeEnableAnimation = enableAnimation !== false

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    if (!safeEnableAnimation) {
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
  }, [safeEnableAnimation])

  // Return null if no plans provided
  if (!plans || plans.length === 0) {
    return null
  }

  // Check if any plan has yearly pricing
  const hasYearlyPricing = plans.some((plan) => plan.yearlyPrice != null)
  const showToggle = safeBillingToggle && hasYearlyPricing

  // Animation variants for container
  const containerVariants = safeEnableAnimation
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  // Animation variants for header
  const headerVariants = safeEnableAnimation
    ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5 },
      }
    : {}

  return (
    <motion.section
      ref={sectionRef}
      {...(isVisible ? containerVariants : { initial: containerVariants.initial })}
      animate={isVisible ? 'animate' : 'initial'}
      className="py-12 md:py-16"
      aria-label="Pricing"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        {(title || subtitle) && (
          <motion.div
            {...(isVisible ? headerVariants : { initial: headerVariants.initial })}
            animate={isVisible ? 'animate' : 'initial'}
            className="mb-10 text-center"
          >
            {title && (
              <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
            )}
            {subtitle && (
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
            )}
          </motion.div>
        )}

        {/* Billing Toggle */}
        {showToggle && (
          <div className="mb-10">
            <BillingToggle
              isYearly={isYearly}
              onToggle={() => setIsYearly(!isYearly)}
              accentColor={safeAccentColor}
            />
          </div>
        )}

        {/* Pricing Content */}
        {safeLayout === 'cards' && (
          <CardsLayout
            plans={plans}
            isYearly={isYearly}
            accentColor={safeAccentColor}
            enableAnimation={isVisible && safeEnableAnimation}
          />
        )}
        {safeLayout === 'table' && (
          <TableLayout
            plans={plans}
            isYearly={isYearly}
            accentColor={safeAccentColor}
            enableAnimation={isVisible && safeEnableAnimation}
          />
        )}
        {safeLayout === 'comparison' && (
          <ComparisonLayout
            plans={plans}
            isYearly={isYearly}
            accentColor={safeAccentColor}
            enableAnimation={isVisible && safeEnableAnimation}
          />
        )}
      </div>
    </motion.section>
  )
}
