'use client'

import Image from 'next/image'
import type { News } from '@/payload-types'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Calendar, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'

interface NewsCarouselModeProps {
  newsItems: News[]
  locale?: string
}

export function NewsCarouselMode({ newsItems, locale = 'uk' }: NewsCarouselModeProps) {
  const getTagColor = (color?: string) => {
    const colorClasses: Record<string, string> = {
      indigo: 'bg-white/90 text-indigo-700 hover:bg-white',
      blue: 'bg-white/90 text-blue-700 hover:bg-white',
      purple: 'bg-white/90 text-purple-700 hover:bg-white',
      green: 'bg-white/90 text-green-700 hover:bg-white',
      amber: 'bg-white/90 text-amber-700 hover:bg-white',
      red: 'bg-white/90 text-red-700 hover:bg-white',
      pink: 'bg-white/90 text-pink-700 hover:bg-white',
      teal: 'bg-white/90 text-teal-700 hover:bg-white',
    }
    return colorClasses[color || 'indigo'] || colorClasses.indigo
  }

  return (
    <section className="container mx-auto px-4 py-20">
      {/* Carousel */}
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {newsItems.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="group overflow-hidden border-border transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-0">
                  {/* Featured Image */}
                  {item.featuredImage && typeof item.featuredImage === 'object' && (
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image
                        src={item.featuredImage.url || ''}
                        alt={item.featuredImage.alt || item.title || ''}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                      {/* Tag Badge */}
                      {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="absolute left-4 top-4">
                          {item.tags.slice(0, 1).map((tag) => {
                            if (typeof tag !== 'object' || !tag) return null
                            return (
                              <Badge key={tag.id} className={getTagColor(tag.color ?? undefined)}>
                                {tag.name}
                              </Badge>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Date */}
                    {item.publishedDate && (
                      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(item.publishedDate).toLocaleDateString('uk-UA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="mb-3 transition-colors group-hover:text-indigo-600">
                      {item.title}
                    </h3>

                    {/* Read More Link */}
                    <Link href={`/${locale}/news/${item.slug}`}>
                      <Button
                        variant="ghost"
                        className="-ml-4 gap-2 text-indigo-600 transition-all group-hover:gap-3"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 -translate-x-12" />
        <CarouselNext className="right-0 translate-x-12" />
      </Carousel>
    </section>
  )
}
