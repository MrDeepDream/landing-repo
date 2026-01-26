'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { Media } from '@/payload-types'

/**
 * Video source type options
 */
type VideoSource = 'youtube' | 'vimeo' | 'custom' | 'upload'

/**
 * Aspect ratio options for video display
 */
type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16'

/**
 * Props interface for the VideoBlock component
 */
export interface VideoBlockProps {
  source?: VideoSource | null
  url?: string | null
  file?: string | Media | null
  title?: string | null
  description?: string | null
  thumbnail?: string | Media | null
  autoplay?: boolean | null
  loop?: boolean | null
  controls?: boolean | null
  aspectRatio?: AspectRatio | null
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
 * Extract video URL from Media object or string
 */
function getVideoUrl(file: string | Media | null | undefined): string | null {
  if (!file) return null
  if (typeof file === 'string') return file
  return file.url || null
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/v\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }
  return null
}

/**
 * Extract Vimeo video ID from URL
 * Supports: vimeo.com/ID, player.vimeo.com/video/ID
 */
function extractVimeoId(url: string): string | null {
  const patterns = [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }
  return null
}

/**
 * Get aspect ratio CSS class based on ratio setting
 */
function getAspectRatioClass(ratio: AspectRatio): string {
  switch (ratio) {
    case '16:9':
      return 'aspect-video'
    case '4:3':
      return 'aspect-[4/3]'
    case '1:1':
      return 'aspect-square'
    case '9:16':
      return 'aspect-[9/16]'
    default:
      return 'aspect-video'
  }
}

/**
 * Build YouTube embed URL with privacy-enhanced mode
 */
function buildYouTubeEmbedUrl(
  videoId: string,
  autoplay: boolean,
  loop: boolean,
  controls: boolean
): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    loop: loop ? '1' : '0',
    controls: controls ? '1' : '0',
    rel: '0',
    modestbranding: '1',
  })

  // For loop to work, playlist must be set to the video ID
  if (loop) {
    params.set('playlist', videoId)
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}

/**
 * Build Vimeo embed URL
 */
function buildVimeoEmbedUrl(
  videoId: string,
  autoplay: boolean,
  loop: boolean,
  controls: boolean
): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    loop: loop ? '1' : '0',
    controls: controls ? '1' : '0',
    byline: '0',
    portrait: '0',
    title: '0',
  })

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`
}

/**
 * YouTube Embed Component
 */
function YouTubeEmbed({
  videoId,
  autoplay,
  loop,
  controls,
  aspectRatioClass,
  thumbnail,
  onPlay,
  isPlaying,
}: {
  videoId: string
  autoplay: boolean
  loop: boolean
  controls: boolean
  aspectRatioClass: string
  thumbnail: string | null
  onPlay: () => void
  isPlaying: boolean
}) {
  const embedUrl = buildYouTubeEmbedUrl(videoId, autoplay || isPlaying, loop, controls)
  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const displayThumbnail = thumbnail || defaultThumbnail

  // Show thumbnail with play button overlay if not auto-playing
  if (!autoplay && !isPlaying) {
    return (
      <button
        onClick={onPlay}
        className={`relative w-full overflow-hidden rounded-xl bg-gray-900 ${aspectRatioClass}`}
        aria-label="Play video"
      >
        <Image
          src={displayThumbnail}
          alt="Video thumbnail"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110 sm:h-20 sm:w-20">
            <Play className="h-6 w-6 fill-indigo-600 text-indigo-600 sm:h-8 sm:w-8" />
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${aspectRatioClass}`}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}

/**
 * Vimeo Embed Component
 */
function VimeoEmbed({
  videoId,
  autoplay,
  loop,
  controls,
  aspectRatioClass,
  thumbnail,
  onPlay,
  isPlaying,
}: {
  videoId: string
  autoplay: boolean
  loop: boolean
  controls: boolean
  aspectRatioClass: string
  thumbnail: string | null
  onPlay: () => void
  isPlaying: boolean
}) {
  const embedUrl = buildVimeoEmbedUrl(videoId, autoplay || isPlaying, loop, controls)

  // Show thumbnail with play button overlay if not auto-playing and has custom thumbnail
  if (!autoplay && !isPlaying && thumbnail) {
    return (
      <button
        onClick={onPlay}
        className={`relative w-full overflow-hidden rounded-xl bg-gray-900 ${aspectRatioClass}`}
        aria-label="Play video"
      >
        <Image
          src={thumbnail}
          alt="Video thumbnail"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110 sm:h-20 sm:w-20">
            <Play className="h-6 w-6 fill-indigo-600 text-indigo-600 sm:h-8 sm:w-8" />
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${aspectRatioClass}`}>
      <iframe
        src={embedUrl}
        title="Vimeo video player"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}

/**
 * Custom/Upload Video Component (HTML5 video)
 */
function NativeVideo({
  videoUrl,
  autoplay,
  loop,
  controls,
  aspectRatioClass,
  thumbnail,
  onPlay,
  isPlaying,
}: {
  videoUrl: string
  autoplay: boolean
  loop: boolean
  controls: boolean
  aspectRatioClass: string
  thumbnail: string | null
  onPlay: () => void
  isPlaying: boolean
}) {
  // Show thumbnail with play button overlay if not auto-playing and has thumbnail
  if (!autoplay && !isPlaying && thumbnail) {
    return (
      <button
        onClick={onPlay}
        className={`relative w-full overflow-hidden rounded-xl bg-gray-900 ${aspectRatioClass}`}
        aria-label="Play video"
      >
        <Image
          src={thumbnail}
          alt="Video thumbnail"
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110 sm:h-20 sm:w-20">
            <Play className="h-6 w-6 fill-indigo-600 text-indigo-600 sm:h-8 sm:w-8" />
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-black ${aspectRatioClass}`}>
      <video
        src={videoUrl}
        autoPlay={autoplay || isPlaying}
        loop={loop}
        controls={controls}
        muted={autoplay}
        playsInline
        className="absolute inset-0 h-full w-full object-contain"
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

/**
 * VideoBlock Component
 *
 * A flexible video embed component supporting YouTube, Vimeo,
 * custom URLs, and uploaded video files with custom thumbnails.
 *
 * @example
 * ```tsx
 * <VideoBlock
 *   source="youtube"
 *   url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 *   title="Product Demo"
 *   description="Watch our product in action"
 *   autoplay={false}
 *   loop={false}
 *   controls={true}
 *   aspectRatio="16:9"
 * />
 * ```
 */
export function VideoBlock({
  source = 'youtube',
  url,
  file,
  title,
  description,
  thumbnail,
  autoplay = false,
  loop = false,
  controls = true,
  aspectRatio = '16:9',
  enableAnimation = true,
}: VideoBlockProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const safeSource = source || 'youtube'
  const safeAspectRatio = aspectRatio || '16:9'
  const safeAutoplay = autoplay ?? false
  const safeLoop = loop ?? false
  const safeControls = controls ?? true

  const aspectRatioClass = getAspectRatioClass(safeAspectRatio)
  const thumbnailUrl = getImageUrl(thumbnail)

  // Animation variants
  const containerVariants = enableAnimation
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }
    : {}

  // Determine which video player to render
  const renderVideo = () => {
    switch (safeSource) {
      case 'youtube': {
        if (!url) return null
        const videoId = extractYouTubeId(url)
        if (!videoId) {
          return (
            <div
              className={`flex items-center justify-center rounded-xl bg-gray-100 ${aspectRatioClass}`}
            >
              <p className="text-sm text-gray-500">Invalid YouTube URL</p>
            </div>
          )
        }
        return (
          <YouTubeEmbed
            videoId={videoId}
            autoplay={safeAutoplay}
            loop={safeLoop}
            controls={safeControls}
            aspectRatioClass={aspectRatioClass}
            thumbnail={thumbnailUrl}
            onPlay={handlePlay}
            isPlaying={isPlaying}
          />
        )
      }

      case 'vimeo': {
        if (!url) return null
        const videoId = extractVimeoId(url)
        if (!videoId) {
          return (
            <div
              className={`flex items-center justify-center rounded-xl bg-gray-100 ${aspectRatioClass}`}
            >
              <p className="text-sm text-gray-500">Invalid Vimeo URL</p>
            </div>
          )
        }
        return (
          <VimeoEmbed
            videoId={videoId}
            autoplay={safeAutoplay}
            loop={safeLoop}
            controls={safeControls}
            aspectRatioClass={aspectRatioClass}
            thumbnail={thumbnailUrl}
            onPlay={handlePlay}
            isPlaying={isPlaying}
          />
        )
      }

      case 'custom': {
        if (!url) return null
        return (
          <NativeVideo
            videoUrl={url}
            autoplay={safeAutoplay}
            loop={safeLoop}
            controls={safeControls}
            aspectRatioClass={aspectRatioClass}
            thumbnail={thumbnailUrl}
            onPlay={handlePlay}
            isPlaying={isPlaying}
          />
        )
      }

      case 'upload': {
        const videoUrl = getVideoUrl(file)
        if (!videoUrl) {
          return (
            <div
              className={`flex items-center justify-center rounded-xl bg-gray-100 ${aspectRatioClass}`}
            >
              <p className="text-sm text-gray-500">No video file uploaded</p>
            </div>
          )
        }
        return (
          <NativeVideo
            videoUrl={videoUrl}
            autoplay={safeAutoplay}
            loop={safeLoop}
            controls={safeControls}
            aspectRatioClass={aspectRatioClass}
            thumbnail={thumbnailUrl}
            onPlay={handlePlay}
            isPlaying={isPlaying}
          />
        )
      }

      default:
        return null
    }
  }

  return (
    <motion.section {...containerVariants} className="py-8 md:py-12" aria-label="Video content">
      <div className="container mx-auto px-4">
        {/* Title and Description */}
        {(title || description) && (
          <div className="mb-6 text-center">
            {title && (
              <h2 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
            )}
            {description && (
              <p className="mx-auto max-w-2xl text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {/* Video Container */}
        <div className="mx-auto max-w-4xl">{renderVideo()}</div>
      </div>
    </motion.section>
  )
}
