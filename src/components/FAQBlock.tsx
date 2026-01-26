'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, ChevronDown, HelpCircle, X } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

/**
 * Accent color type for FAQ block styling
 */
type AccentColor = 'amber' | 'indigo' | 'purple' | 'green' | 'blue'

/**
 * Layout type for FAQ display
 */
type FAQLayout = 'accordion' | 'two-column' | 'cards'

/**
 * FAQ item interface
 */
interface FAQItem {
  question: string
  answer: string
  category?: string | null
  id?: string | null
}

/**
 * Props interface for the FAQBlock component
 */
export interface FAQBlockProps {
  title?: string | null
  subtitle?: string | null
  layout?: FAQLayout | null
  questions?: FAQItem[] | null
  showSearch?: boolean | null
  showCategories?: boolean | null
  allowMultiple?: boolean | null
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
      border: 'border-amber-200',
      borderActive: 'border-amber-400',
      ring: 'ring-amber-400',
      hover: 'hover:bg-amber-600',
      gradient: 'from-amber-500 to-orange-500',
      focusRing: 'focus:ring-amber-400',
      categoryActive: 'bg-amber-100 text-amber-800 border-amber-300',
      categoryInactive: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-amber-50',
      searchBorder: 'focus-within:border-amber-400 focus-within:ring-amber-400/20',
      cardHover: 'hover:border-amber-200 hover:shadow-amber-100',
      iconBg: 'bg-amber-100',
    },
    indigo: {
      text: 'text-indigo-600',
      bg: 'bg-indigo-500',
      bgLight: 'bg-indigo-100',
      bgLighter: 'bg-indigo-50',
      border: 'border-indigo-200',
      borderActive: 'border-indigo-400',
      ring: 'ring-indigo-400',
      hover: 'hover:bg-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
      focusRing: 'focus:ring-indigo-400',
      categoryActive: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      categoryInactive: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-indigo-50',
      searchBorder: 'focus-within:border-indigo-400 focus-within:ring-indigo-400/20',
      cardHover: 'hover:border-indigo-200 hover:shadow-indigo-100',
      iconBg: 'bg-indigo-100',
    },
    purple: {
      text: 'text-purple-600',
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-100',
      bgLighter: 'bg-purple-50',
      border: 'border-purple-200',
      borderActive: 'border-purple-400',
      ring: 'ring-purple-400',
      hover: 'hover:bg-purple-600',
      gradient: 'from-purple-500 to-pink-500',
      focusRing: 'focus:ring-purple-400',
      categoryActive: 'bg-purple-100 text-purple-800 border-purple-300',
      categoryInactive: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-purple-50',
      searchBorder: 'focus-within:border-purple-400 focus-within:ring-purple-400/20',
      cardHover: 'hover:border-purple-200 hover:shadow-purple-100',
      iconBg: 'bg-purple-100',
    },
    green: {
      text: 'text-green-600',
      bg: 'bg-green-500',
      bgLight: 'bg-green-100',
      bgLighter: 'bg-green-50',
      border: 'border-green-200',
      borderActive: 'border-green-400',
      ring: 'ring-green-400',
      hover: 'hover:bg-green-600',
      gradient: 'from-green-500 to-emerald-500',
      focusRing: 'focus:ring-green-400',
      categoryActive: 'bg-green-100 text-green-800 border-green-300',
      categoryInactive: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-green-50',
      searchBorder: 'focus-within:border-green-400 focus-within:ring-green-400/20',
      cardHover: 'hover:border-green-200 hover:shadow-green-100',
      iconBg: 'bg-green-100',
    },
    blue: {
      text: 'text-blue-600',
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-100',
      bgLighter: 'bg-blue-50',
      border: 'border-blue-200',
      borderActive: 'border-blue-400',
      ring: 'ring-blue-400',
      hover: 'hover:bg-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      focusRing: 'focus:ring-blue-400',
      categoryActive: 'bg-blue-100 text-blue-800 border-blue-300',
      categoryInactive: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50',
      searchBorder: 'focus-within:border-blue-400 focus-within:ring-blue-400/20',
      cardHover: 'hover:border-blue-200 hover:shadow-blue-100',
      iconBg: 'bg-blue-100',
    },
  }
  return classes[accentColor]
}

/**
 * Search Input Component
 */
function SearchInput({
  value,
  onChange,
  onClear,
  accentColor,
}: {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  accentColor: AccentColor
}) {
  const colors = getAccentClasses(accentColor)

  return (
    <div
      className={`relative flex items-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 ${colors.searchBorder} focus-within:ring-4`}
    >
      <Search className="ml-4 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search questions..."
        className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
        aria-label="Search frequently asked questions"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="mr-3 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

/**
 * Category Filter Component
 */
function CategoryFilter({
  categories,
  selectedCategory,
  onSelect,
  accentColor,
}: {
  categories: string[]
  selectedCategory: string | null
  onSelect: (category: string | null) => void
  accentColor: AccentColor
}) {
  const colors = getAccentClasses(accentColor)

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
      <button
        type="button"
        role="tab"
        aria-selected={selectedCategory === null}
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
          selectedCategory === null ? colors.categoryActive : colors.categoryInactive
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={selectedCategory === category}
          onClick={() => onSelect(category)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selectedCategory === category ? colors.categoryActive : colors.categoryInactive
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

/**
 * FAQ Card Component for cards layout
 */
function FAQCard({
  item,
  isOpen,
  onToggle,
  accentColor,
  enableAnimation,
  index,
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  accentColor: AccentColor
  enableAnimation: boolean
  index: number
}) {
  const colors = getAccentClasses(accentColor)

  const cardVariants = enableAnimation
    ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.05 + index * 0.05, duration: 0.4 },
      }
    : {}

  return (
    <motion.div
      {...cardVariants}
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 ${colors.cardHover} ${
        isOpen ? `${colors.border} shadow-md` : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${colors.iconBg}`}
          >
            <HelpCircle className={`h-4 w-4 ${colors.text}`} />
          </span>
          <h3 className="font-semibold text-foreground">{item.question}</h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 pl-11 text-muted-foreground">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Generate FAQ Schema.org structured data for SEO
 */
function generateFAQSchema(questions: FAQItem[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
  return JSON.stringify(schema)
}

/**
 * FAQBlock Component
 *
 * A specialized FAQ component with search functionality, category filtering,
 * and multiple layout options. Includes Schema.org structured data for SEO.
 *
 * @example
 * ```tsx
 * <FAQBlock
 *   title="Frequently Asked Questions"
 *   subtitle="Find answers to common questions"
 *   layout="accordion"
 *   showSearch={true}
 *   showCategories={true}
 *   allowMultiple={false}
 *   questions={[
 *     {
 *       question: "What is your return policy?",
 *       answer: "We offer a 30-day return policy for all items.",
 *       category: "Orders"
 *     },
 *     {
 *       question: "How do I track my order?",
 *       answer: "You can track your order using the link in your confirmation email.",
 *       category: "Shipping"
 *     }
 *   ]}
 *   accentColor="indigo"
 * />
 * ```
 */
export function FAQBlock({
  title,
  subtitle,
  layout = 'accordion',
  questions,
  showSearch = true,
  showCategories = true,
  allowMultiple = false,
  accentColor = 'indigo',
  enableAnimation = true,
}: FAQBlockProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openCards, setOpenCards] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(!enableAnimation)
  const sectionRef = useRef<HTMLElement>(null)

  // Normalize props with safe defaults
  const safeLayout = layout || 'accordion'
  const safeAccentColor = accentColor || 'indigo'
  const safeShowSearch = showSearch !== false
  const safeShowCategories = showCategories !== false
  const safeAllowMultiple = allowMultiple === true
  const safeEnableAnimation = enableAnimation !== false

  const colors = getAccentClasses(safeAccentColor)

  // Extract unique categories from questions
  const categories = useMemo(() => {
    if (!questions) return []
    const cats = new Set<string>()
    questions.forEach((q) => {
      if (q.category) {
        cats.add(q.category)
      }
    })
    return Array.from(cats).sort()
  }, [questions])

  // Filter questions based on search and category
  const filteredQuestions = useMemo(() => {
    if (!questions) return []

    return questions.filter((q) => {
      // Category filter
      if (selectedCategory && q.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesQuestion = q.question.toLowerCase().includes(query)
        const matchesAnswer = q.answer.toLowerCase().includes(query)
        return matchesQuestion || matchesAnswer
      }

      return true
    })
  }, [questions, searchQuery, selectedCategory])

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

  // Handle card toggle for cards layout
  const handleCardToggle = (id: string) => {
    setOpenCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        if (!safeAllowMultiple) {
          newSet.clear()
        }
        newSet.add(id)
      }
      return newSet
    })
  }

  // Return null if no questions provided
  if (!questions || questions.length === 0) {
    return null
  }

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

  const controlsVariants = safeEnableAnimation
    ? {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.1, duration: 0.5 },
      }
    : {}

  // Render accordion layout
  const renderAccordion = () => (
    <div className="mx-auto max-w-3xl">
      {safeAllowMultiple ? (
        <Accordion type="multiple" className="space-y-3">
          {filteredQuestions.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={safeEnableAnimation ? { y: 20, opacity: 0 } : undefined}
              animate={isVisible ? { y: 0, opacity: 1 } : undefined}
              transition={{ delay: 0.05 + index * 0.05, duration: 0.4 }}
            >
              <AccordionItem
                value={item.id || `faq-${index}`}
                className={`rounded-xl border ${colors.border} bg-white px-6 shadow-sm transition-all duration-300 hover:shadow-md data-[state=open]:${colors.borderActive} data-[state=open]:shadow-md`}
              >
                <AccordionTrigger className="py-5 text-left hover:no-underline">
                  <span className="font-medium text-foreground">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      ) : (
        <Accordion type="single" collapsible className="space-y-3">
          {filteredQuestions.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={safeEnableAnimation ? { y: 20, opacity: 0 } : undefined}
              animate={isVisible ? { y: 0, opacity: 1 } : undefined}
              transition={{ delay: 0.05 + index * 0.05, duration: 0.4 }}
            >
              <AccordionItem
                value={item.id || `faq-${index}`}
                className={`rounded-xl border ${colors.border} bg-white px-6 shadow-sm transition-all duration-300 hover:shadow-md data-[state=open]:${colors.borderActive} data-[state=open]:shadow-md`}
              >
                <AccordionTrigger className="py-5 text-left hover:no-underline">
                  <span className="font-medium text-foreground">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      )}
    </div>
  )

  // Render two-column layout
  const renderTwoColumn = () => {
    const midPoint = Math.ceil(filteredQuestions.length / 2)
    const leftColumn = filteredQuestions.slice(0, midPoint)
    const rightColumn = filteredQuestions.slice(midPoint)

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          {safeAllowMultiple ? (
            <Accordion type="multiple" className="space-y-3">
              {leftColumn.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={safeEnableAnimation ? { y: 20, opacity: 0 } : undefined}
                  animate={isVisible ? { y: 0, opacity: 1 } : undefined}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.4 }}
                >
                  <AccordionItem
                    value={item.id || `faq-left-${index}`}
                    className={`rounded-xl border ${colors.border} bg-white px-6 shadow-sm transition-all duration-300 hover:shadow-md data-[state=open]:${colors.borderActive} data-[state=open]:shadow-md`}
                  >
                    <AccordionTrigger className="py-5 text-left hover:no-underline">
                      <span className="font-medium text-foreground">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {leftColumn.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={safeEnableAnimation ? { y: 20, opacity: 0 } : undefined}
                  animate={isVisible ? { y: 0, opacity: 1 } : undefined}
                  transition={{ delay: 0.05 + index * 0.05, duration: 0.4 }}
                >
                  <AccordionItem
                    value={item.id || `faq-left-${index}`}
                    className={`rounded-xl border ${colors.border} bg-white px-6 shadow-sm transition-all duration-300 hover:shadow-md data-[state=open]:${colors.borderActive} data-[state=open]:shadow-md`}
                  >
                    <AccordionTrigger className="py-5 text-left hover:no-underline">
                      <span className="font-medium text-foreground">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          )}
        </div>
        <div className="space-y-3">
          {safeAllowMultiple ? (
            <Accordion type="multiple" className="space-y-3">
              {rightColumn.map((item, index) => (
                <motion.div
                  key={item.id || midPoint + index}
                  initial={safeEnableAnimation ? { y: 20, opacity: 0 } : undefined}
                  animate={isVisible ? { y: 0, opacity: 1 } : undefined}
                  transition={{ delay: 0.05 + (midPoint + index) * 0.05, duration: 0.4 }}
                >
                  <AccordionItem
                    value={item.id || `faq-right-${index}`}
                    className={`rounded-xl border ${colors.border} bg-white px-6 shadow-sm transition-all duration-300 hover:shadow-md data-[state=open]:${colors.borderActive} data-[state=open]:shadow-md`}
                  >
                    <AccordionTrigger className="py-5 text-left hover:no-underline">
                      <span className="font-medium text-foreground">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {rightColumn.map((item, index) => (
                <motion.div
                  key={item.id || midPoint + index}
                  initial={safeEnableAnimation ? { y: 20, opacity: 0 } : undefined}
                  animate={isVisible ? { y: 0, opacity: 1 } : undefined}
                  transition={{ delay: 0.05 + (midPoint + index) * 0.05, duration: 0.4 }}
                >
                  <AccordionItem
                    value={item.id || `faq-right-${index}`}
                    className={`rounded-xl border ${colors.border} bg-white px-6 shadow-sm transition-all duration-300 hover:shadow-md data-[state=open]:${colors.borderActive} data-[state=open]:shadow-md`}
                  >
                    <AccordionTrigger className="py-5 text-left hover:no-underline">
                      <span className="font-medium text-foreground">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    )
  }

  // Render cards layout
  const renderCards = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredQuestions.map((item, index) => {
        const cardId = item.id || `faq-card-${index}`
        return (
          <FAQCard
            key={cardId}
            item={item}
            isOpen={openCards.has(cardId)}
            onToggle={() => handleCardToggle(cardId)}
            accentColor={safeAccentColor}
            enableAnimation={isVisible && safeEnableAnimation}
            index={index}
          />
        )
      })}
    </div>
  )

  // No results message
  const noResultsMessage = (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
      <div
        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colors.bgLight}`}
      >
        <Search className={`h-8 w-8 ${colors.text}`} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">No results found</h3>
      <p className="text-muted-foreground">
        Try adjusting your search or filter to find what you&apos;re looking for.
      </p>
      <button
        type="button"
        onClick={() => {
          setSearchQuery('')
          setSelectedCategory(null)
        }}
        className={`mt-4 rounded-lg px-4 py-2 text-sm font-medium ${colors.bgLight} ${colors.text} transition-colors hover:opacity-80`}
      >
        Clear filters
      </button>
    </motion.div>
  )

  return (
    <>
      {/* Schema.org FAQ structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateFAQSchema(questions) }}
      />

      <motion.section
        ref={sectionRef}
        {...(isVisible ? containerVariants : { initial: containerVariants.initial })}
        animate={isVisible ? 'animate' : 'initial'}
        className="py-12 md:py-16"
        aria-label="Frequently Asked Questions"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          {(title || subtitle) && (
            <motion.div
              {...(isVisible ? headerVariants : { initial: headerVariants.initial })}
              animate={isVisible ? 'animate' : 'initial'}
              className="mb-8 text-center"
            >
              {title && (
                <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
              )}
              {subtitle && (
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
              )}
            </motion.div>
          )}

          {/* Search and Category Controls */}
          {(safeShowSearch || (safeShowCategories && categories.length > 0)) && (
            <motion.div
              {...(isVisible ? controlsVariants : { initial: controlsVariants.initial })}
              animate={isVisible ? 'animate' : 'initial'}
              className="mb-8 space-y-4"
            >
              {safeShowSearch && (
                <div className="mx-auto max-w-md">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    accentColor={safeAccentColor}
                  />
                </div>
              )}

              {safeShowCategories && categories.length > 0 && (
                <div className="flex justify-center">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                    accentColor={safeAccentColor}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* FAQ Content */}
          {filteredQuestions.length > 0 ? (
            <>
              {safeLayout === 'accordion' && renderAccordion()}
              {safeLayout === 'two-column' && renderTwoColumn()}
              {safeLayout === 'cards' && renderCards()}
            </>
          ) : (
            noResultsMessage
          )}
        </div>
      </motion.section>
    </>
  )
}
