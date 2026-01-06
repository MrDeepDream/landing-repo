'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Printer,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from './ui/button'

// Types for CMS data
interface SocialLink {
  platform:
    | 'facebook'
    | 'twitter'
    | 'instagram'
    | 'linkedin'
    | 'youtube'
    | 'tiktok'
    | 'github'
    | 'discord'
  url: string
  openInNewTab?: boolean
}

interface SiteSettings {
  siteTitle: string
  siteLogo?: {
    url: string
    alt?: string
  }
  tagline?: string
  socialLinks?: SocialLink[]
}

// Helper function to get icon component based on platform
const getSocialIcon = (platform: string) => {
  const icons: Record<string, typeof Facebook | null> = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    github: Github,
    tiktok: null,
    discord: null,
  }
  return icons[platform] || null
}

// Helper function to get contact icon based on type
const getContactIcon = (iconType: string) => {
  const icons: Record<string, typeof MapPin> = {
    location: MapPin,
    phone: Phone,
    email: Mail,
    fax: Printer,
    time: Clock,
    link: ExternalLink,
  }
  return icons[iconType] || ExternalLink
}

interface ContactItem {
  icon: 'location' | 'phone' | 'email' | 'fax' | 'time' | 'link'
  label: string
  href?: string
  openInNewTab?: boolean
}

interface ContactColumn {
  title: string
  items?: ContactItem[]
}

interface FooterData {
  copyrightText?: string
  description?: string
  links?: Array<{
    label: string
    href: string
    openInNewTab?: boolean
  }>
  contactColumns?: ContactColumn[]
}

interface FooterProps {
  siteSettings?: SiteSettings
  footerData?: FooterData
}

export function Footer({ siteSettings, footerData }: FooterProps = {}) {
  // Use CMS data if available, otherwise fall back to defaults
  const siteTitle = siteSettings?.siteTitle || 'TechCorp'
  const siteTagline = siteSettings?.tagline || 'Innovation Studio'
  const siteLogo = siteSettings?.siteLogo
  const socialLinks = siteSettings?.socialLinks || []
  const description =
    footerData?.description ||
    'Leading the future of technology with innovative solutions and exceptional service. Transforming businesses through cutting-edge digital experiences.'
  const copyrightText = footerData?.copyrightText || `© ${new Date().getFullYear()} ${siteTitle}`
  const contactColumns = footerData?.contactColumns || []
  const footerLinks = footerData?.links || []

  // Default contact columns if no CMS data
  const defaultContactColumns: ContactColumn[] = [
    {
      title: 'Main Office',
      items: [
        { icon: 'location', label: '123 Tech Street, Silicon Valley, CA 94025', href: '#' },
        { icon: 'phone', label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
        { icon: 'email', label: 'hello@techcorp.com', href: 'mailto:hello@techcorp.com' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'email', label: 'support@techcorp.com', href: 'mailto:support@techcorp.com' },
        { icon: 'phone', label: '+1 (555) 987-6543', href: 'tel:+15559876543' },
        { icon: 'time', label: 'Mon-Fri: 9AM-5PM PST' },
      ],
    },
    {
      title: 'Sales',
      items: [
        { icon: 'email', label: 'sales@techcorp.com', href: 'mailto:sales@techcorp.com' },
        { icon: 'phone', label: '+1 (555) 456-7890', href: 'tel:+15554567890' },
        { icon: 'time', label: 'Available 24/7' },
      ],
    },
  ]

  const displayContactColumns = contactColumns.length > 0 ? contactColumns : defaultContactColumns

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
      {/* Decorative elements */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:32px_32px]" />
      <div className="absolute right-0 top-0 h-1/2 w-1/2 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl" />

      <div className="container relative mx-auto px-4 py-16">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo and Company Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative">
                {siteLogo?.url ? (
                  <Image
                    src={siteLogo.url}
                    alt={siteLogo.alt || siteTitle}
                    width={40}
                    height={40}
                    className="invert"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl tracking-tight text-transparent">
                  {siteTitle}
                </span>
                <p className="text-xs text-gray-400">{siteTagline}</p>
              </div>
            </div>
            <p className="max-w-sm text-sm text-gray-400">{description}</p>
            <div className="flex items-center gap-2">
              {socialLinks.map((link, index) => {
                const IconComponent = getSocialIcon(link.platform)
                if (!IconComponent) return null

                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white"
                    asChild
                  >
                    <a
                      href={link.url}
                      target={link.openInNewTab ? '_blank' : undefined}
                      rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Contact Columns from CMS */}
          {displayContactColumns.map((column, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-semibold text-white">{column.title}</h4>
              {column.items && column.items.length > 0 && (
                <ul className="space-y-3 text-sm">
                  {column.items.map((item, itemIndex) => {
                    const IconComponent = getContactIcon(item.icon)
                    const content = (
                      <div className="flex items-start gap-3 text-gray-400 transition-colors hover:text-indigo-400">
                        <IconComponent className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    )

                    return (
                      <li key={itemIndex}>
                        {item.href ? (
                          <Link
                            href={item.href}
                            {...(item.openInNewTab
                              ? { target: '_blank', rel: 'noopener noreferrer' }
                              : {})}
                          >
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-gray-400 md:flex-row">
          <p>{copyrightText}</p>
          {footerLinks.length > 0 && (
            <div className="flex gap-6">
              {footerLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="transition-colors hover:text-indigo-400"
                  {...(link.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
