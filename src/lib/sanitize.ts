import sanitizeHtml from 'sanitize-html'

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses sanitize-html with a restrictive allowlist
 */
export function sanitizeHtmlContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'br',
      'hr',
      'ul',
      'ol',
      'li',
      'blockquote',
      'a',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'code',
      'pre',
      'span',
      'div',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class', 'id'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
        },
      }),
    },
  })
}

// Re-export with original name for backward compatibility
export { sanitizeHtmlContent as sanitizeHtml }
