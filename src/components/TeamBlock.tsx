'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Linkedin, Twitter, Github, Mail, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Media } from '@/payload-types'

/**
 * Accent color type for team block styling
 */
type AccentColor = 'amber' | 'indigo' | 'purple' | 'green' | 'blue'

/**
 * Social platform types
 */
type SocialPlatform = 'linkedin' | 'twitter' | 'github' | 'email' | 'website'

/**
 * Social link interface
 */
interface SocialLink {
  platform: SocialPlatform
  url: string
  id?: string | null
}

/**
 * Team member interface
 */
interface TeamMember {
  photo: string | Media
  name: string
  role?: string | null
  bio?: string | null
  socialLinks?: SocialLink[] | null
  id?: string | null
}

/**
 * Props interface for the TeamBlock component
 */
export interface TeamBlockProps {
  title?: string | null
  subtitle?: string | null
  layout?: 'grid' | 'carousel' | 'list' | null
  columns?: '2' | '3' | '4' | null
  members?: TeamMember[] | null
  showSocialLinks?: boolean | null
  cardStyle?: 'minimal' | 'card' | 'overlay' | null
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
 * Get alt text from Media object
 */
function getImageAlt(image: string | Media | null | undefined, fallback: string): string {
  if (!image) return fallback
  if (typeof image === 'string') return fallback
  return image.alt || fallback
}

/**
 * Social Icon Component
 * Returns the appropriate Lucide icon based on platform
 */
function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const iconClasses = 'h-5 w-5'

  switch (platform) {
    case 'linkedin':
      return <Linkedin className={iconClasses} />
    case 'twitter':
      return <Twitter className={iconClasses} />
    case 'github':
      return <Github className={iconClasses} />
    case 'email':
      return <Mail className={iconClasses} />
    case 'website':
      return <Globe className={iconClasses} />
    default:
      return <Globe className={iconClasses} />
  }
}

/**
 * Social Links Component
 * Renders a row of social media links with icons
 */
function SocialLinks({ links, accentColor }: { links: SocialLink[]; accentColor: AccentColor }) {
  const hoverColorClasses: Record<AccentColor, string> = {
    amber: 'hover:text-amber-500 hover:bg-amber-50',
    indigo: 'hover:text-indigo-500 hover:bg-indigo-50',
    purple: 'hover:text-purple-500 hover:bg-purple-50',
    green: 'hover:text-green-500 hover:bg-green-50',
    blue: 'hover:text-blue-500 hover:bg-blue-50',
  }

  return (
    <div className="flex items-center gap-2">
      {links.map((link, index) => {
        const href = link.platform === 'email' ? `mailto:${link.url}` : link.url
        return (
          <a
            key={link.id || index}
            href={href}
            target={link.platform !== 'email' ? '_blank' : undefined}
            rel={link.platform !== 'email' ? 'noopener noreferrer' : undefined}
            className={`rounded-full p-2 text-gray-500 transition-all duration-200 ${hoverColorClasses[accentColor]}`}
            aria-label={`${link.platform} link`}
          >
            <SocialIcon platform={link.platform} />
          </a>
        )
      })}
    </div>
  )
}

/**
 * Minimal Card Style
 * Simple layout with photo and text, no background
 */
function MinimalCard({
  member,
  showSocialLinks,
  accentColor,
  enableAnimation,
  index,
}: {
  member: TeamMember
  showSocialLinks: boolean
  accentColor: AccentColor
  enableAnimation: boolean
  index: number
}) {
  const photoUrl = getImageUrl(member.photo)
  const photoAlt = getImageAlt(member.photo, member.name)

  const accentTextClasses: Record<AccentColor, string> = {
    amber: 'text-amber-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
  }

  const variants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.1, duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...variants} className="text-center">
      {/* Photo */}
      {photoUrl && (
        <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
          <Image src={photoUrl} alt={photoAlt} fill className="object-cover" />
        </div>
      )}

      {/* Name */}
      <h3 className="mb-1 text-lg font-semibold text-foreground">{member.name}</h3>

      {/* Role */}
      {member.role && (
        <p className={`mb-2 text-sm font-medium ${accentTextClasses[accentColor]}`}>
          {member.role}
        </p>
      )}

      {/* Bio */}
      {member.bio && (
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{member.bio}</p>
      )}

      {/* Social Links */}
      {showSocialLinks && member.socialLinks && member.socialLinks.length > 0 && (
        <div className="flex justify-center">
          <SocialLinks links={member.socialLinks} accentColor={accentColor} />
        </div>
      )}
    </motion.div>
  )
}

/**
 * Card Style
 * Elevated card with shadow and padding
 */
function CardStyleMember({
  member,
  showSocialLinks,
  accentColor,
  enableAnimation,
  index,
}: {
  member: TeamMember
  showSocialLinks: boolean
  accentColor: AccentColor
  enableAnimation: boolean
  index: number
}) {
  const photoUrl = getImageUrl(member.photo)
  const photoAlt = getImageAlt(member.photo, member.name)

  const accentTextClasses: Record<AccentColor, string> = {
    amber: 'text-amber-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
  }

  const accentBorderClasses: Record<AccentColor, string> = {
    amber: 'hover:border-amber-200',
    indigo: 'hover:border-indigo-200',
    purple: 'hover:border-purple-200',
    green: 'hover:border-green-200',
    blue: 'hover:border-blue-200',
  }

  const variants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.1, duration: 0.5 },
      }
    : {}

  return (
    <motion.div
      {...variants}
      className={`rounded-xl border border-gray-100 bg-white p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentBorderClasses[accentColor]}`}
    >
      {/* Photo */}
      {photoUrl && (
        <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-4 ring-gray-50">
          <Image src={photoUrl} alt={photoAlt} fill className="object-cover" />
        </div>
      )}

      {/* Name */}
      <h3 className="mb-1 text-lg font-semibold text-foreground">{member.name}</h3>

      {/* Role */}
      {member.role && (
        <p className={`mb-3 text-sm font-medium ${accentTextClasses[accentColor]}`}>
          {member.role}
        </p>
      )}

      {/* Bio */}
      {member.bio && (
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{member.bio}</p>
      )}

      {/* Social Links */}
      {showSocialLinks && member.socialLinks && member.socialLinks.length > 0 && (
        <div className="flex justify-center border-t border-gray-100 pt-4">
          <SocialLinks links={member.socialLinks} accentColor={accentColor} />
        </div>
      )}
    </motion.div>
  )
}

/**
 * Overlay Card Style
 * Photo with gradient overlay, text on image
 */
function OverlayCard({
  member,
  showSocialLinks,
  accentColor,
  enableAnimation,
  index,
}: {
  member: TeamMember
  showSocialLinks: boolean
  accentColor: AccentColor
  enableAnimation: boolean
  index: number
}) {
  const photoUrl = getImageUrl(member.photo)
  const photoAlt = getImageAlt(member.photo, member.name)

  const accentGradientClasses: Record<AccentColor, string> = {
    amber: 'from-amber-900/80 via-amber-900/60 to-transparent',
    indigo: 'from-indigo-900/80 via-indigo-900/60 to-transparent',
    purple: 'from-purple-900/80 via-purple-900/60 to-transparent',
    green: 'from-green-900/80 via-green-900/60 to-transparent',
    blue: 'from-blue-900/80 via-blue-900/60 to-transparent',
  }

  const variants = enableAnimation
    ? {
        initial: { y: 30, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.1, duration: 0.5 },
      }
    : {}

  return (
    <motion.div {...variants} className="group relative aspect-[3/4] overflow-hidden rounded-xl">
      {/* Photo */}
      {photoUrl && (
        <Image
          src={photoUrl}
          alt={photoAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${accentGradientClasses[accentColor]}`} />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        {/* Name */}
        <h3 className="mb-1 text-xl font-bold">{member.name}</h3>

        {/* Role */}
        {member.role && <p className="mb-2 text-sm font-medium text-white/80">{member.role}</p>}

        {/* Bio - shown on hover */}
        {member.bio && (
          <p className="mb-3 line-clamp-2 max-h-0 overflow-hidden text-sm text-white/70 opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
            {member.bio}
          </p>
        )}

        {/* Social Links */}
        {showSocialLinks && member.socialLinks && member.socialLinks.length > 0 && (
          <div className="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {member.socialLinks.map((link, linkIndex) => {
              const href = link.platform === 'email' ? `mailto:${link.url}` : link.url
              return (
                <a
                  key={link.id || linkIndex}
                  href={href}
                  target={link.platform !== 'email' ? '_blank' : undefined}
                  rel={link.platform !== 'email' ? 'noopener noreferrer' : undefined}
                  className="rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                  aria-label={`${link.platform} link`}
                >
                  <SocialIcon platform={link.platform} />
                </a>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/**
 * List Item Component
 * Horizontal layout with larger photo for list view
 */
function ListItem({
  member,
  showSocialLinks,
  accentColor,
  enableAnimation,
  index,
}: {
  member: TeamMember
  showSocialLinks: boolean
  accentColor: AccentColor
  enableAnimation: boolean
  index: number
}) {
  const photoUrl = getImageUrl(member.photo)
  const photoAlt = getImageAlt(member.photo, member.name)

  const accentTextClasses: Record<AccentColor, string> = {
    amber: 'text-amber-600',
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
  }

  const accentBorderClasses: Record<AccentColor, string> = {
    amber: 'hover:border-amber-200',
    indigo: 'hover:border-indigo-200',
    purple: 'hover:border-purple-200',
    green: 'hover:border-green-200',
    blue: 'hover:border-blue-200',
  }

  const variants = enableAnimation
    ? {
        initial: { x: -30, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { delay: 0.1 + index * 0.15, duration: 0.5 },
      }
    : {}

  return (
    <motion.div
      {...variants}
      className={`flex flex-col gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:flex-row sm:items-start ${accentBorderClasses[accentColor]}`}
    >
      {/* Photo */}
      {photoUrl && (
        <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-xl sm:h-48 sm:w-48">
          <Image src={photoUrl} alt={photoAlt} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {/* Name */}
        <h3 className="mb-1 text-xl font-semibold text-foreground">{member.name}</h3>

        {/* Role */}
        {member.role && (
          <p className={`mb-3 font-medium ${accentTextClasses[accentColor]}`}>{member.role}</p>
        )}

        {/* Bio */}
        {member.bio && <p className="mb-4 text-muted-foreground">{member.bio}</p>}

        {/* Social Links */}
        {showSocialLinks && member.socialLinks && member.socialLinks.length > 0 && (
          <SocialLinks links={member.socialLinks} accentColor={accentColor} />
        )}
      </div>
    </motion.div>
  )
}

/**
 * TeamBlock Component
 *
 * A flexible team member showcase component supporting grid, carousel,
 * and list layouts with multiple card styles and accent colors.
 *
 * @example
 * ```tsx
 * <TeamBlock
 *   title="Meet Our Team"
 *   subtitle="The people behind our success"
 *   layout="grid"
 *   columns="3"
 *   cardStyle="card"
 *   members={[
 *     {
 *       photo: { url: '/team/john.jpg', alt: 'John Doe' },
 *       name: 'John Doe',
 *       role: 'CEO',
 *       bio: 'Visionary leader with 20 years of experience',
 *       socialLinks: [
 *         { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
 *       ],
 *     },
 *   ]}
 *   showSocialLinks={true}
 *   accentColor="indigo"
 * />
 * ```
 */
export function TeamBlock({
  title,
  subtitle,
  layout = 'grid',
  columns = '3',
  members,
  showSocialLinks = true,
  cardStyle = 'card',
  accentColor = 'indigo',
  enableAnimation = true,
}: TeamBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const safeLayout = layout || 'grid'
  const safeColumns = columns || '3'
  const safeCardStyle = cardStyle || 'card'
  const safeAccentColor = accentColor || 'indigo'
  const safeShowSocialLinks = showSocialLinks ?? true
  const safeEnableAnimation = enableAnimation ?? true
  const membersLength = members?.length || 0

  // Navigation handlers for carousel
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + membersLength) % membersLength)
  }, [membersLength])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % membersLength)
  }, [membersLength])

  // Calculate visible items for carousel (show 3 at a time on desktop)
  const getVisibleMembers = useCallback(() => {
    if (!members || members.length === 0) return []
    const itemsToShow = Math.min(3, members.length)
    const visible: TeamMember[] = []
    for (let i = 0; i < itemsToShow; i++) {
      const idx = (currentIndex + i) % members.length
      const member = members[idx]
      if (member) {
        visible.push(member)
      }
    }
    return visible
  }, [members, currentIndex])

  // Auto-advance carousel
  useEffect(() => {
    if (safeLayout !== 'carousel' || membersLength === 0 || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % membersLength)
    }, 4000)

    return () => clearInterval(interval)
  }, [safeLayout, membersLength, isHovered])

  // Return null if no members provided
  if (!members || members.length === 0) {
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

  // Grid layout classes based on columns
  const getGridClasses = (): string => {
    switch (safeColumns) {
      case '2':
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2'
      case '3':
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
      case '4':
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  // Accent color classes for navigation buttons
  const accentButtonClasses: Record<AccentColor, string> = {
    amber: 'hover:bg-amber-100 focus:ring-amber-500',
    indigo: 'hover:bg-indigo-100 focus:ring-indigo-500',
    purple: 'hover:bg-purple-100 focus:ring-purple-500',
    green: 'hover:bg-green-100 focus:ring-green-500',
    blue: 'hover:bg-blue-100 focus:ring-blue-500',
  }

  const accentDotClasses: Record<AccentColor, string> = {
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  }

  // Render member card based on card style
  const renderMemberCard = (member: TeamMember, index: number) => {
    switch (safeCardStyle) {
      case 'minimal':
        return (
          <MinimalCard
            key={member.id || index}
            member={member}
            showSocialLinks={safeShowSocialLinks}
            accentColor={safeAccentColor}
            enableAnimation={safeEnableAnimation}
            index={index}
          />
        )
      case 'overlay':
        return (
          <OverlayCard
            key={member.id || index}
            member={member}
            showSocialLinks={safeShowSocialLinks}
            accentColor={safeAccentColor}
            enableAnimation={safeEnableAnimation}
            index={index}
          />
        )
      case 'card':
      default:
        return (
          <CardStyleMember
            key={member.id || index}
            member={member}
            showSocialLinks={safeShowSocialLinks}
            accentColor={safeAccentColor}
            enableAnimation={safeEnableAnimation}
            index={index}
          />
        )
    }
  }

  // Render grid layout
  const renderGrid = () => (
    <div className={getGridClasses()}>
      {members.map((member, index) => renderMemberCard(member, index))}
    </div>
  )

  // Render carousel layout
  const renderCarousel = () => {
    const visibleMembers = getVisibleMembers()

    return (
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Carousel container */}
        <div className="overflow-hidden px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visibleMembers.map((member, index) => (
                <div key={member.id || `${currentIndex}-${index}`}>
                  {safeCardStyle === 'minimal' && (
                    <MinimalCard
                      member={member}
                      showSocialLinks={safeShowSocialLinks}
                      accentColor={safeAccentColor}
                      enableAnimation={false}
                      index={0}
                    />
                  )}
                  {safeCardStyle === 'card' && (
                    <CardStyleMember
                      member={member}
                      showSocialLinks={safeShowSocialLinks}
                      accentColor={safeAccentColor}
                      enableAnimation={false}
                      index={0}
                    />
                  )}
                  {safeCardStyle === 'overlay' && (
                    <OverlayCard
                      member={member}
                      showSocialLinks={safeShowSocialLinks}
                      accentColor={safeAccentColor}
                      enableAnimation={false}
                      index={0}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        {members.length > 3 && (
          <>
            <button
              onClick={goToPrevious}
              className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all focus:outline-none focus:ring-2 ${accentButtonClasses[safeAccentColor]}`}
              aria-label="Previous team members"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={goToNext}
              className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-all focus:outline-none focus:ring-2 ${accentButtonClasses[safeAccentColor]}`}
              aria-label="Next team members"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {members.length > 3 && (
          <div className="mt-6 flex justify-center gap-2">
            {members.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? `w-6 ${accentDotClasses[safeAccentColor]}`
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to team member ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render list layout
  const renderList = () => (
    <div className="flex flex-col gap-6">
      {members.map((member, index) => (
        <ListItem
          key={member.id || index}
          member={member}
          showSocialLinks={safeShowSocialLinks}
          accentColor={safeAccentColor}
          enableAnimation={safeEnableAnimation}
          index={index}
        />
      ))}
    </div>
  )

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

        {/* Team Members Content */}
        {safeLayout === 'grid' && renderGrid()}
        {safeLayout === 'carousel' && renderCarousel()}
        {safeLayout === 'list' && renderList()}
      </div>
    </motion.section>
  )
}
