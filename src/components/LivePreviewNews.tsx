'use client'

import Image from 'next/image'
import { useLivePreview } from '@payloadcms/live-preview-react'
import type { News, NewsContentBlock, NewsTag, User as PayloadUser } from '@/payload-types'
import { Calendar, User, Tag } from 'lucide-react'
import { SectionHeaderBlock } from '@/components/SectionHeaderBlock'
import { MarkdownRichTextBlock } from '@/components/MarkdownRichTextBlock'

interface LivePreviewNewsProps {
  initialData: News
}

export function LivePreviewNews({ initialData }: LivePreviewNewsProps) {
  const { data } = useLivePreview<News>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    depth: 2,
  })

  return <NewsArticleContent key={`${data.id}-${data.updatedAt}`} article={data} />
}

function NewsArticleContent({ article }: { article: News }) {
  const { title, excerpt, publishedDate, featuredImage, tags, author, blocks } = article

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Article Header */}
      <header className="mx-auto mb-12 max-w-4xl">
        {/* Tags */}
        {tags && Array.isArray(tags) && tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const tagData = typeof tag === 'object' ? (tag as NewsTag) : null
              if (!tagData) return null

              const color = tagData.color || 'indigo'
              const colorClasses = {
                indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
                blue: 'bg-blue-100 text-blue-700 border-blue-200',
                purple: 'bg-purple-100 text-purple-700 border-purple-200',
                green: 'bg-green-100 text-green-700 border-green-200',
                amber: 'bg-amber-100 text-amber-700 border-amber-200',
                red: 'bg-red-100 text-red-700 border-red-200',
                pink: 'bg-pink-100 text-pink-700 border-pink-200',
                teal: 'bg-teal-100 text-teal-700 border-teal-200',
              }

              return (
                <span
                  key={tagData.id}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo}`}
                >
                  <Tag className="h-3 w-3" />
                  {tagData.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
          {title || 'Untitled'}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="mb-6 text-xl leading-relaxed text-gray-600 dark:text-gray-400">{excerpt}</p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 border-b border-t border-gray-200 py-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {/* Published Date */}
          {publishedDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={publishedDate}>
                {new Date(publishedDate).toLocaleDateString('uk-UA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          )}

          {/* Author */}
          {author && typeof author === 'object' && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>
                {(author as PayloadUser).name ||
                  (author as PayloadUser).email?.split('@')[0] ||
                  'Anonymous'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {featuredImage && typeof featuredImage === 'object' && 'url' in featuredImage && (
        <div className="mx-auto mb-12 max-w-5xl">
          <figure className="overflow-hidden rounded-xl shadow-lg">
            {featuredImage.caption && (
              <figcaption className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {featuredImage.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}

      {/* Article Content Blocks */}
      <main className="mx-auto max-w-4xl">
        {blocks && blocks.length > 0 && (
          <div className="space-y-8">
            {blocks.map((block, index) => (
              <BlockRenderer key={block.id || index} block={block} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {(!blocks || blocks.length === 0) && (
          <div className="py-12 text-center text-muted-foreground">
            <p>This article has no content blocks yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}

/**
 * Block Renderer
 * Renders different block types for news articles
 */
function BlockRenderer({ block }: { block: NewsContentBlock }) {
  switch (block.blockType) {
    case 'sectionHeader':
      return (
        <SectionHeaderBlock
          title={block.title}
          subtitle={block.subtitle ?? undefined}
          description={block.description ?? undefined}
          primaryCTA={block.primaryCTA ?? undefined}
          secondaryCTA={block.secondaryCTA ?? undefined}
          enableAnimation={block.enableAnimation !== false}
        />
      )

    case 'richText':
      return (
        <div className="prose prose-lg max-w-none">
          <RichTextRenderer content={block.content} />
        </div>
      )

    case 'markdownText':
      return (
        <MarkdownRichTextBlock
          markdown={block.markdown || ''}
          accentColor={block.accentColor ?? undefined}
        />
      )

    case 'imageBlock':
      return (
        <div className="my-8">
          {block.image &&
            typeof block.image === 'object' &&
            'url' in block.image &&
            block.image.url && (
              <figure>
                <Image
                  src={block.image.url}
                  alt={block.image.alt || block.caption || 'Image'}
                  width={800}
                  height={600}
                  className="w-full rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 800px"
                />
                {block.caption && (
                  <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )}
        </div>
      )

    case 'callToAction':
      return (
        <div className="rounded-lg bg-primary p-8 text-center text-primary-foreground">
          {block.heading && <h2 className="mb-4 text-3xl font-bold">{block.heading}</h2>}
          {block.description && <p className="mb-6 text-lg">{block.description}</p>}
          {block.link && (
            <a
              href={block.link.url}
              target={block.link.openInNewTab ? '_blank' : undefined}
              rel={block.link.openInNewTab ? 'noopener noreferrer' : undefined}
              className="inline-block rounded-md bg-background px-6 py-3 font-semibold text-foreground transition-opacity hover:opacity-90"
            >
              {block.link.label}
            </a>
          )}
        </div>
      )

    default: {
      const _exhaustiveCheck: never = block
      return (
        <div className="rounded border border-dashed border-muted p-4">
          <p className="text-sm text-muted-foreground">
            Unknown block type: {(_exhaustiveCheck as NewsContentBlock).blockType}
          </p>
        </div>
      )
    }
  }
}

interface RichTextNode {
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  type?: string
  url?: string
  newTab?: boolean
  children?: RichTextNode[]
}

/**
 * Rich Text Renderer
 * Renders Slate rich text content
 */
function RichTextRenderer({ content }: { content: Record<string, unknown> | null }) {
  if (!content) return null

  return (
    <div className="rich-text">
      {Array.isArray(content) ? (
        content.map((node: RichTextNode, index: number) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: renderNode(node) }} />
        ))
      ) : (
        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }} />
      )}
    </div>
  )
}

/**
 * Render a single rich text node
 */
function renderNode(node: RichTextNode): string {
  if (!node) return ''

  if (node.text !== undefined) {
    let text = node.text
    if (node.bold) text = `<strong>${text}</strong>`
    if (node.italic) text = `<em>${text}</em>`
    if (node.underline) text = `<u>${text}</u>`
    return text
  }

  const children = node.children?.map(renderNode).join('') || ''

  switch (node.type) {
    case 'h1':
      return `<h1>${children}</h1>`
    case 'h2':
      return `<h2>${children}</h2>`
    case 'h3':
      return `<h3>${children}</h3>`
    case 'h4':
      return `<h4>${children}</h4>`
    case 'h5':
      return `<h5>${children}</h5>`
    case 'h6':
      return `<h6>${children}</h6>`
    case 'quote':
      return `<blockquote>${children}</blockquote>`
    case 'ul':
      return `<ul>${children}</ul>`
    case 'ol':
      return `<ol>${children}</ol>`
    case 'li':
      return `<li>${children}</li>`
    case 'link':
      return `<a href="${node.url || '#'}" ${node.newTab ? 'target="_blank" rel="noopener noreferrer"' : ''}>${children}</a>`
    default:
      return `<p>${children}</p>`
  }
}
