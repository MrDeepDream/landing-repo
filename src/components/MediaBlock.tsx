'use client'

import { useState } from 'react'
import Image from 'next/image'

interface MediaImage {
  url?: string | null
  alt?: string | null
}

interface MediaItem {
  image: string | MediaImage
  caption?: string | null
}

interface ValidMediaItem {
  image: { url: string; alt?: string | null }
  caption?: string | null
}

interface MediaBlockProps {
  title?: string | null
  displayMode: 'grid' | 'masonry' | 'carousel'
  columns?: '2' | '3' | '4'
  media: MediaItem[]
  enableLightbox?: boolean
}

function isValidMediaItem(item: MediaItem): item is ValidMediaItem {
  return typeof item.image === 'object' && typeof item.image?.url === 'string'
}

export function MediaBlock({
  title,
  displayMode,
  columns = '3',
  media,
  enableLightbox = true,
}: MediaBlockProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)

  if (!media || media.length === 0) {
    return null
  }

  const validMedia = media.filter(isValidMediaItem)

  if (validMedia.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setSelectedIndex(index)
      setLightboxOpen(true)
    }
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? validMedia.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === validMedia.length - 1 ? 0 : prev + 1))
  }

  const goToCarouselPrevious = () => {
    setCarouselIndex((prev) => (prev === 0 ? validMedia.length - 1 : prev - 1))
  }

  const goToCarouselNext = () => {
    setCarouselIndex((prev) => (prev === validMedia.length - 1 ? 0 : prev + 1))
  }

  const columnClasses = {
    '2': 'grid-cols-2',
    '3': 'grid-cols-2 md:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  const masonryColumnClasses = {
    '2': 'columns-2',
    '3': 'columns-2 md:columns-3',
    '4': 'columns-2 md:columns-3 lg:columns-4',
  }

  const renderGridItem = (item: ValidMediaItem, index: number) => {
    return (
      <div
        key={index}
        className={`group relative aspect-square overflow-hidden rounded-lg bg-muted shadow-sm transition-shadow hover:shadow-md ${
          enableLightbox ? 'cursor-pointer' : ''
        }`}
        onClick={() => openLightbox(index)}
      >
        <Image
          src={item.image.url}
          alt={item.image.alt || item.caption || ''}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {item.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="text-sm text-white">{item.caption}</p>
          </div>
        )}
      </div>
    )
  }

  const renderMasonryItem = (item: ValidMediaItem, index: number) => {
    return (
      <div
        key={index}
        className={`group mb-4 break-inside-avoid overflow-hidden rounded-lg bg-muted shadow-sm transition-shadow hover:shadow-md ${
          enableLightbox ? 'cursor-pointer' : ''
        }`}
        onClick={() => openLightbox(index)}
      >
        <div className="relative">
          <Image
            src={item.image.url}
            alt={item.image.alt || item.caption || ''}
            width={400}
            height={300}
            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {item.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="text-sm text-white">{item.caption}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCarousel = () => {
    const currentItem = validMedia[carouselIndex]
    if (!currentItem) return null

    return (
      <div className="relative">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <Image
            src={currentItem.image.url}
            alt={currentItem.image.alt || currentItem.caption || ''}
            fill
            className={`object-cover ${enableLightbox ? 'cursor-pointer' : ''}`}
            sizes="100vw"
            onClick={() => openLightbox(carouselIndex)}
          />
        </div>

        {currentItem.caption && (
          <p className="mt-2 text-center text-sm text-muted-foreground">{currentItem.caption}</p>
        )}

        {validMedia.length > 1 && (
          <>
            <button
              onClick={goToCarouselPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={goToCarouselNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div className="mt-4 flex justify-center gap-2">
              {validMedia.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === carouselIndex ? 'bg-foreground' : 'bg-muted-foreground/30'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  const renderLightbox = () => {
    if (!lightboxOpen) return null

    const currentItem = validMedia[selectedIndex]
    if (!currentItem) return null

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        onClick={closeLightbox}
      >
        <button
          onClick={closeLightbox}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          aria-label="Close lightbox"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
          <Image
            src={currentItem.image.url}
            alt={currentItem.image.alt || currentItem.caption || ''}
            width={1200}
            height={800}
            className="max-h-[85vh] w-auto object-contain"
          />

          {currentItem.caption && (
            <p className="mt-2 text-center text-sm text-white">{currentItem.caption}</p>
          )}
        </div>

        {validMedia.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white">
              {selectedIndex + 1} / {validMedia.length}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="my-8">
      {title && <h3 className="mb-6 text-2xl font-semibold">{title}</h3>}

      {displayMode === 'grid' && (
        <div className={`grid gap-4 ${columnClasses[columns]}`}>
          {validMedia.map((item, index) => renderGridItem(item, index))}
        </div>
      )}

      {displayMode === 'masonry' && (
        <div className={`gap-4 ${masonryColumnClasses[columns]}`}>
          {validMedia.map((item, index) => renderMasonryItem(item, index))}
        </div>
      )}

      {displayMode === 'carousel' && renderCarousel()}

      {renderLightbox()}
    </div>
  )
}
