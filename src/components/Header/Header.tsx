'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown, Globe } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { NavigationItem, SiteSettings } from './types'

interface HeaderProps {
  locale: string
  siteSettings: SiteSettings
  navigationItems: NavigationItem[]
}

// Language options with full names for mobile
const languages = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'uk', label: 'UK', fullName: 'Українська' },
  { code: 'es', label: 'ES', fullName: 'Español' },
]

export function Header({ locale, siteSettings, navigationItems }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  // Ensure locale is always a string
  const localeString = typeof locale === 'string' ? locale : String(locale || 'uk')

  // Extract path without locale prefix for language switching
  const pathWithoutLocale = pathname.replace(/^\/(uk|en|es)/, '') || '/'

  const homeUrl = `/${localeString}`

  // Toggle expanded state for mobile menu items with children
  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  // Close mobile menu and navigate
  const handleMobileNavClick = () => {
    setIsOpen(false)
    setExpandedItems([])
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo and Title */}
        <Link
          href={homeUrl}
          className="mr-6 flex min-h-[44px] items-center space-x-2"
          aria-label={`${siteSettings.siteTitle} - Home`}
        >
          {siteSettings.siteLogo?.url && (
            <Image
              src={siteSettings.siteLogo.url}
              alt={siteSettings.siteLogo.alt || siteSettings.siteTitle}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          )}
          <span className="hidden font-bold sm:inline-block">{siteSettings.siteTitle}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center space-x-6 text-sm font-medium md:flex">
          {navigationItems.map((item) => (
            <div key={item.id} className="group relative">
              <Link
                href={item.href}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
                {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.label}
              </Link>

              {/* Dropdown for children */}
              {item.children && item.children.length > 0 && (
                <div className="absolute left-0 mt-2 hidden w-48 rounded-md border bg-background shadow-lg group-hover:block">
                  <div className="py-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-foreground/60 hover:bg-accent hover:text-foreground/80"
                        {...(child.openInNewTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Language Switcher */}
        <div className="ml-auto hidden items-center space-x-1 md:flex">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={`/${lang.code}${pathWithoutLocale}`}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent',
                localeString === lang.code && 'bg-accent'
              )}
            >
              {lang.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu - Sheet */}
        <div className="ml-auto md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm overflow-y-auto p-0 sm:max-w-md">
              <SheetHeader className="border-b px-6 py-4">
                <SheetTitle className="flex items-center gap-2 text-left">
                  {siteSettings.siteLogo?.url && (
                    <Image
                      src={siteSettings.siteLogo.url}
                      alt={siteSettings.siteLogo.alt || siteSettings.siteTitle}
                      width={24}
                      height={24}
                      className="h-6 w-6 object-contain"
                    />
                  )}
                  {siteSettings.siteTitle}
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation Items */}
              <nav className="flex flex-col py-4">
                {navigationItems.map((item) => (
                  <div key={item.id} className="border-b border-border/50 last:border-b-0">
                    {item.children && item.children.length > 0 ? (
                      <>
                        {/* Parent item with children - expandable */}
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className="flex min-h-[52px] w-full items-center justify-between px-6 py-3 text-left text-base font-medium transition-colors hover:bg-accent active:bg-accent/80"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 text-muted-foreground transition-transform duration-200',
                              expandedItems.includes(item.id) && 'rotate-180'
                            )}
                          />
                        </button>

                        {/* Children items - collapsible */}
                        <div
                          className={cn(
                            'overflow-hidden bg-muted/50 transition-all duration-200',
                            expandedItems.includes(item.id)
                              ? 'max-h-[500px] opacity-100'
                              : 'max-h-0 opacity-0'
                          )}
                        >
                          {/* Link to parent page */}
                          <Link
                            href={item.href}
                            onClick={handleMobileNavClick}
                            className="flex min-h-[48px] items-center px-8 py-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:bg-accent/80"
                            {...(item.openInNewTab
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                          >
                            View all {item.label}
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              onClick={handleMobileNavClick}
                              className="flex min-h-[48px] items-center px-8 py-3 text-sm transition-colors hover:bg-accent active:bg-accent/80"
                              {...(child.openInNewTab
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* Single item without children */
                      <Link
                        href={item.href}
                        onClick={handleMobileNavClick}
                        className="flex min-h-[52px] items-center px-6 py-3 text-base font-medium transition-colors hover:bg-accent active:bg-accent/80"
                        {...(item.openInNewTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Language Switcher */}
              <div className="border-t px-6 py-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>Language</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={`/${lang.code}${pathWithoutLocale}`}
                      onClick={handleMobileNavClick}
                      className={cn(
                        'flex min-h-[48px] flex-col items-center justify-center rounded-lg border-2 px-3 py-2 text-center transition-all active:scale-95',
                        localeString === lang.code
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                      )}
                    >
                      <span className="text-lg font-bold">{lang.label}</span>
                      <span className="text-xs text-muted-foreground">{lang.fullName}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
