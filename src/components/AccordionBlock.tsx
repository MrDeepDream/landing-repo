'use client'

import * as React from 'react'
import Image from 'next/image'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown, Plus, Minus, ArrowDown, ArrowUp, Lightbulb } from 'lucide-react'
import { cn } from '@/components/ui/utils'
import { SlateRichText } from './SlateRichText'

// Types for accordion variants and icon styles
type AccordionVariant = 'faq' | 'steps' | 'features'
type IconStyle = 'chevron' | 'plus' | 'arrow'

interface LinkItem {
  linkText: string
  linkUrl: string
  openInNewTab?: boolean | null
  id?: string | null
}

interface ContentItem {
  contentType: 'text' | 'richText' | 'image' | 'linkList'
  text?: string | null
  richText?: Record<string, unknown> | null
  image?:
    | string
    | { url?: string | null; alt?: string; width?: number | null; height?: number | null }
    | null
  imageCaption?: string | null
  links?: LinkItem[] | null
  id?: string | null
}

interface AccordionItemData {
  itemTitle: string
  contentItems?: ContentItem[] | null
  id?: string | null
}

export interface AccordionBlockProps {
  title?: string | null
  description?: string | null
  variant?: AccordionVariant | null
  showNumbers?: boolean | null
  iconStyle?: IconStyle | null
  allowMultiple?: boolean | null
  accordionItems: AccordionItemData[]
}

// Icon components for different styles
interface ExpandIconProps {
  iconStyle: IconStyle
  isOpen: boolean
  className?: string
}

function ExpandIcon({ iconStyle, isOpen, className }: ExpandIconProps) {
  const baseClass = cn(
    'size-5 shrink-0 text-muted-foreground transition-transform duration-200',
    className
  )

  switch (iconStyle) {
    case 'plus':
      return isOpen ? <Minus className={baseClass} /> : <Plus className={baseClass} />
    case 'arrow':
      return isOpen ? <ArrowUp className={baseClass} /> : <ArrowDown className={baseClass} />
    case 'chevron':
    default:
      return <ChevronDown className={cn(baseClass, isOpen && 'rotate-180')} />
  }
}

// Custom accordion trigger that supports different icon styles
interface CustomAccordionTriggerProps extends React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> {
  iconStyle: IconStyle
  isOpen: boolean
}

function CustomAccordionTrigger({
  className,
  children,
  iconStyle,
  isOpen,
  ...props
}: CustomAccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between gap-4 py-5 text-left font-medium outline-none transition-all hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
        <ExpandIcon iconStyle={iconStyle} isOpen={isOpen} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function renderContentItem(item: ContentItem, index: number) {
  const key = item.id || `content-${index}`

  switch (item.contentType) {
    case 'text':
      if (!item.text) return null
      return (
        <p key={key} className="whitespace-pre-line text-muted-foreground">
          {item.text}
        </p>
      )

    case 'richText':
      if (!item.richText) return null
      return <SlateRichText key={key} content={item.richText} className="text-muted-foreground" />

    case 'image': {
      if (!item.image) return null
      const imageUrl = typeof item.image === 'string' ? item.image : item.image?.url
      const imageAlt = typeof item.image === 'object' ? item.image?.alt : undefined
      const imageWidth = typeof item.image === 'object' ? item.image?.width : undefined
      const imageHeight = typeof item.image === 'object' ? item.image?.height : undefined

      if (!imageUrl) return null

      return (
        <figure key={key} className="my-4">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={imageAlt || item.imageCaption || ''}
              width={imageWidth || 800}
              height={imageHeight || 450}
              className="h-auto w-full object-cover"
            />
          </div>
          {item.imageCaption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {item.imageCaption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'linkList': {
      if (!item.links || item.links.length === 0) return null
      return (
        <ul key={key} className="space-y-2">
          {item.links.map((link, linkIndex) => (
            <li key={link.id || `link-${linkIndex}`}>
              <a
                href={link.linkUrl}
                target={link.openInNewTab ? '_blank' : '_self'}
                rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                className="text-indigo-600 underline-offset-2 hover:underline"
              >
                {link.linkText}
              </a>
            </li>
          ))}
        </ul>
      )
    }

    default:
      return null
  }
}

// Variant-specific styling configurations
function getVariantStyles(variant: AccordionVariant) {
  switch (variant) {
    case 'steps':
      return {
        container: 'space-y-3',
        item: 'rounded-lg border border-border bg-white px-6 shadow-sm transition-all duration-300 hover:shadow-md data-[state=open]:border-indigo-300 data-[state=open]:shadow-md',
        trigger: 'text-base',
        content: 'pb-5',
        headerClass: 'flex items-center gap-3',
      }
    case 'features':
      return {
        container: 'space-y-4',
        item: 'rounded-xl border border-border bg-gradient-to-br from-white to-slate-50 px-6 shadow-sm transition-all duration-300 hover:shadow-lg data-[state=open]:border-indigo-200 data-[state=open]:shadow-lg data-[state=open]:from-indigo-50/50 data-[state=open]:to-white',
        trigger: 'text-base',
        content: 'pb-5',
        headerClass: 'flex items-center gap-3',
      }
    case 'faq':
    default:
      return {
        container: 'space-y-4',
        item: 'rounded-xl border border-border bg-white px-6 shadow-sm transition-all duration-300 hover:shadow-lg data-[state=open]:border-indigo-200 data-[state=open]:shadow-lg',
        trigger: '',
        content: 'pb-5',
        headerClass: '',
      }
  }
}

// Step number badge component
interface StepNumberProps {
  number: number
  isOpen: boolean
}

function StepNumber({ number, isOpen }: StepNumberProps) {
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200',
        isOpen ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
      )}
    >
      {number}
    </span>
  )
}

// Feature icon component
interface FeatureIconProps {
  isOpen: boolean
}

function FeatureIcon({ isOpen }: FeatureIconProps) {
  return (
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
        isOpen ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
      )}
    >
      <Lightbulb className="size-5" />
    </span>
  )
}

export function AccordionBlock({
  title,
  description,
  variant = 'faq',
  showNumbers = true,
  iconStyle = 'chevron',
  allowMultiple = false,
  accordionItems,
}: AccordionBlockProps) {
  // Track open items for icon state - must be called before any early returns
  const [openItems, setOpenItems] = React.useState<string[]>([])

  if (!accordionItems || accordionItems.length === 0) {
    return null
  }

  // Normalize values with defaults for null/undefined
  const normalizedVariant: AccordionVariant = variant ?? 'faq'
  const normalizedIconStyle: IconStyle = iconStyle ?? 'chevron'
  const normalizedShowNumbers = showNumbers ?? true
  const styles = getVariantStyles(normalizedVariant)

  const handleValueChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setOpenItems(value)
    } else {
      setOpenItems(value ? [value] : [])
    }
  }

  const renderAccordionItem = (item: AccordionItemData, index: number) => {
    const itemValue = item.id || `accordion-${index}`
    const isOpen = openItems.includes(itemValue)

    return (
      <AccordionPrimitive.Item key={itemValue} value={itemValue} className={styles.item}>
        <CustomAccordionTrigger
          iconStyle={normalizedIconStyle}
          isOpen={isOpen}
          className={styles.trigger}
        >
          <div className={styles.headerClass}>
            {normalizedVariant === 'steps' && normalizedShowNumbers && (
              <StepNumber number={index + 1} isOpen={isOpen} />
            )}
            {normalizedVariant === 'features' && <FeatureIcon isOpen={isOpen} />}
            <span className="font-medium">{item.itemTitle}</span>
          </div>
        </CustomAccordionTrigger>
        <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className={cn('pt-0', styles.content)}>
            <div
              className={cn(
                'space-y-4',
                normalizedVariant === 'steps' && normalizedShowNumbers && 'ml-11',
                normalizedVariant === 'features' && 'ml-[52px]'
              )}
            >
              {Array.isArray(item.contentItems) &&
                item.contentItems.map((contentItem, contentIndex) =>
                  renderContentItem(contentItem, contentIndex)
                )}
            </div>
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    )
  }

  return (
    <section className="py-12">
      {(title || description) && (
        <div className="mb-8">
          {title && <h2 className="mb-4 text-3xl font-bold">{title}</h2>}
          {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
        </div>
      )}

      {allowMultiple ? (
        <AccordionPrimitive.Root
          type="multiple"
          className={styles.container}
          onValueChange={handleValueChange}
        >
          {accordionItems.map((item, index) => renderAccordionItem(item, index))}
        </AccordionPrimitive.Root>
      ) : (
        <AccordionPrimitive.Root
          type="single"
          collapsible
          className={styles.container}
          onValueChange={handleValueChange}
        >
          {accordionItems.map((item, index) => renderAccordionItem(item, index))}
        </AccordionPrimitive.Root>
      )}
    </section>
  )
}
