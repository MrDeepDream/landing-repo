import React from 'react'
import { cn } from './ui/utils'

type GlassTagProps = {
  children: React.ReactNode
  className?: string
} & (
  | ({ as?: 'span' | 'div' } & React.HTMLAttributes<HTMLElement>)
  | ({ as: 'a' } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
)

export function GlassTag({ children, className, as: Tag = 'span', ...props }: GlassTagProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag className={cn('glass-tag', className)} {...(props as any)}>
      <span className="glass-tag__content">{children}</span>
      <div className="glass-tag__material" aria-hidden>
        <div className="glass-tag__edge" />
        <div className="glass-tag__emboss" />
        <div className="glass-tag__refraction" />
        <div className="glass-tag__blur" />
        <div className="glass-tag__blend" />
        <div className="glass-tag__blend-edge" />
        <div className="glass-tag__highlight" />
      </div>
    </Tag>
  )
}
