import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  locale?: string
}

/**
 * Breadcrumbs component for navigation hierarchy
 * Supports semantic tokens and reduced motion preferences
 */
export function Breadcrumbs({ items, locale = 'uk' }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
    >
      {/* Home link */}
      <Link
        href={`/${locale}`}
        className="flex items-center gap-1 transition-colors hover:text-foreground"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
            {isLast || !item.href ? (
              <span
                className={isLast ? 'font-medium text-foreground' : ''}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
