'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { Media } from '@/payload-types'

interface TabImage {
  image: string | Media
  caption?: string | null
  id?: string | null
}

interface TabRecord {
  recordType: 'richText' | 'image' | 'video' | 'imageCard'
  recordRichText?: Record<string, unknown> | null
  recordImage?: string | Media | null
  videoUrl?: string | null
  cardImage?: string | Media | null
  cardTitle?: string | null
  cardDescription?: string | null
  cardLink?: string | null
  id?: string | null
}

interface Tab {
  tabName: string
  contentType: 'richText' | 'news' | 'images' | 'records'
  richTextContent?: Record<string, unknown> | null
  newsSource?: 'latest' | 'byTag' | 'manual' | null
  newsTag?: string | { id: string; name: string } | null
  selectedNews?: (string | { id: string; title: string })[] | null
  newsLimit?: number | null
  images?: TabImage[] | null
  records?: TabRecord[] | null
  id?: string | null
}

export interface TabBlockProps {
  tabs: Tab[]
}

function getMediaUrl(media: string | Media | null | undefined): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media.url || null
}

function getMediaAlt(media: string | Media | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'string') return ''
  return media.alt || ''
}

function VideoEmbed({ url }: { url: string }) {
  const getEmbedUrl = (videoUrl: string): string | null => {
    // YouTube
    const youtubeMatch = videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Vimeo
    const vimeoMatch = videoUrl.match(/(?:vimeo\.com\/)(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return null
  }

  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">Unsupported video URL</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function ImageCard({
  image,
  title,
  description,
  link,
}: {
  image?: string | Media | null
  title?: string | null
  description?: string | null
  link?: string | null
}) {
  const imageUrl = getMediaUrl(image)
  const imageAlt = getMediaAlt(image)

  const content = (
    <div className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt || title || ''}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        {title && <h4 className="mb-2 font-semibold text-foreground">{title}</h4>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )

  if (link) {
    const isExternal = link.startsWith('http')
    return (
      <a
        href={link}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }

  return content
}

function RichTextPlaceholder() {
  return (
    <div className="rounded-lg bg-muted/50 p-6">
      <p className="text-muted-foreground">Rich text content</p>
    </div>
  )
}

function NewsPlaceholder({ source, limit }: { source?: string | null; limit?: number | null }) {
  return (
    <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-8">
      <p className="text-center text-muted-foreground">
        News content will be loaded
        {source && ` (${source})`}
        {limit && source !== 'manual' && `, limit: ${limit}`}
      </p>
    </div>
  )
}

function ImagesContent({ images }: { images?: TabImage[] | null }) {
  if (!images || images.length === 0) {
    return (
      <div className="rounded-lg bg-muted/50 p-6">
        <p className="text-center text-muted-foreground">No images</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((item, index) => {
        const imageUrl = getMediaUrl(item.image)
        const imageAlt = getMediaAlt(item.image)

        if (!imageUrl) return null

        return (
          <div key={index} className="group">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={imageAlt || item.caption || ''}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            {item.caption && (
              <p className="mt-2 text-center text-sm text-muted-foreground">{item.caption}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

function RecordsContent({ records }: { records?: TabRecord[] | null }) {
  if (!records || records.length === 0) {
    return (
      <div className="rounded-lg bg-muted/50 p-6">
        <p className="text-center text-muted-foreground">No records</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {records.map((record, index) => {
        switch (record.recordType) {
          case 'richText':
            return (
              <div key={index}>
                <RichTextPlaceholder />
              </div>
            )

          case 'image': {
            const imageUrl = getMediaUrl(record.recordImage)
            const imageAlt = getMediaAlt(record.recordImage)

            if (!imageUrl) return null

            return (
              <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
              </div>
            )
          }

          case 'video':
            if (!record.videoUrl) return null
            return (
              <div key={index}>
                <VideoEmbed url={record.videoUrl} />
              </div>
            )

          case 'imageCard':
            return (
              <div key={index}>
                <ImageCard
                  image={record.cardImage}
                  title={record.cardTitle}
                  description={record.cardDescription}
                  link={record.cardLink}
                />
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

function TabContent({ tab }: { tab: Tab }) {
  switch (tab.contentType) {
    case 'richText':
      return <RichTextPlaceholder />

    case 'news':
      return <NewsPlaceholder source={tab.newsSource} limit={tab.newsLimit} />

    case 'images':
      return <ImagesContent images={tab.images} />

    case 'records':
      return <RecordsContent records={tab.records} />

    default:
      return null
  }
}

export function TabBlock({ tabs }: TabBlockProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.tabName || '')

  if (!tabs || tabs.length === 0) {
    return null
  }

  return (
    <div className="my-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap">
          {tabs.map((tab, index) => (
            <TabsTrigger key={index} value={tab.tabName}>
              {tab.tabName}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab, index) => (
          <TabsContent key={index} value={tab.tabName}>
            <TabContent tab={tab} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
