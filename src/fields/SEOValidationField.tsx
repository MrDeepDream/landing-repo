'use client'

import React, { useMemo } from 'react'
import { useField } from '@payloadcms/ui'
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, Sparkles } from 'lucide-react'

import type { Media } from '@/payload-types'

import './seo-validation.css'

interface SEOCheck {
  label: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  points: number
}

export const SEOValidationField: React.FC = () => {
  // Get page title
  const { value: title } = useField<string>({ path: 'title' })

  // Get SEO fields using useField with proper paths
  const { value: metaTitle } = useField<string>({ path: 'seo.metaTitle' })
  const { value: metaDescription } = useField<string>({ path: 'seo.metaDescription' })
  const { value: focusKeyword } = useField<string>({ path: 'seo.focusKeyword' })
  const { value: keywords } = useField<string>({ path: 'seo.keywords' })
  const { value: metaImage } = useField<string | Media | null>({ path: 'seo.metaImage' })
  const { value: ogTitle } = useField<string>({ path: 'seo.ogTitle' })
  const { value: ogDescription } = useField<string>({ path: 'seo.ogDescription' })
  const { value: ogImage } = useField<string | Media | null>({ path: 'seo.ogImage' })
  const { value: twitterTitle } = useField<string>({ path: 'seo.twitterTitle' })
  const { value: twitterDescription } = useField<string>({ path: 'seo.twitterDescription' })
  const { value: twitterImage } = useField<string | Media | null>({ path: 'seo.twitterImage' })
  const { value: canonicalUrl } = useField<string>({ path: 'seo.canonicalUrl' })

  const checks = useMemo((): SEOCheck[] => {
    const results: SEOCheck[] = []

    // Use metaTitle if provided, otherwise fall back to page title
    const effectiveTitle = metaTitle || title || ''
    const titleLength = effectiveTitle.length

    // Check 1: Meta Title Length
    if (titleLength === 0) {
      results.push({
        label: 'Meta Title',
        status: 'fail',
        message: 'No title set. Add a compelling page title.',
        points: 0,
      })
    } else if (titleLength < 30) {
      results.push({
        label: 'Meta Title',
        status: 'warning',
        message: `Title is too short (${titleLength} chars). Aim for 50-60 characters.`,
        points: 5,
      })
    } else if (titleLength > 70) {
      results.push({
        label: 'Meta Title',
        status: 'warning',
        message: `Title is too long (${titleLength} chars). It may be truncated in search results.`,
        points: 8,
      })
    } else if (titleLength >= 50 && titleLength <= 60) {
      results.push({
        label: 'Meta Title',
        status: 'pass',
        message: `Perfect title length (${titleLength} chars).`,
        points: 15,
      })
    } else {
      results.push({
        label: 'Meta Title',
        status: 'pass',
        message: `Good title length (${titleLength} chars).`,
        points: 12,
      })
    }

    // Check 2: Meta Description
    const descLength = metaDescription?.length || 0
    if (descLength === 0) {
      results.push({
        label: 'Meta Description',
        status: 'fail',
        message: 'No meta description. This is crucial for click-through rates.',
        points: 0,
      })
    } else if (descLength < 120) {
      results.push({
        label: 'Meta Description',
        status: 'warning',
        message: `Description is short (${descLength} chars). Aim for 150-160 characters.`,
        points: 8,
      })
    } else if (descLength > 200) {
      results.push({
        label: 'Meta Description',
        status: 'warning',
        message: `Description is too long (${descLength} chars). It may be cut off.`,
        points: 10,
      })
    } else if (descLength >= 150 && descLength <= 160) {
      results.push({
        label: 'Meta Description',
        status: 'pass',
        message: `Perfect description length (${descLength} chars).`,
        points: 20,
      })
    } else {
      results.push({
        label: 'Meta Description',
        status: 'pass',
        message: `Good description length (${descLength} chars).`,
        points: 15,
      })
    }

    // Check 3: Focus Keyword
    if (!focusKeyword) {
      results.push({
        label: 'Focus Keyword',
        status: 'warning',
        message: 'No focus keyword set. Add your main target keyword.',
        points: 0,
      })
    } else {
      const keywordInTitle = effectiveTitle.toLowerCase().includes(focusKeyword.toLowerCase())
      const keywordInDesc = metaDescription?.toLowerCase().includes(focusKeyword.toLowerCase())

      if (keywordInTitle && keywordInDesc) {
        results.push({
          label: 'Focus Keyword',
          status: 'pass',
          message: `"${focusKeyword}" found in both title and description. Excellent!`,
          points: 15,
        })
      } else if (keywordInTitle || keywordInDesc) {
        results.push({
          label: 'Focus Keyword',
          status: 'warning',
          message: `"${focusKeyword}" found in ${keywordInTitle ? 'title' : 'description'}. Consider adding to ${keywordInTitle ? 'description' : 'title'} too.`,
          points: 10,
        })
      } else {
        results.push({
          label: 'Focus Keyword',
          status: 'warning',
          message: `"${focusKeyword}" not found in title or description. Consider adding it.`,
          points: 5,
        })
      }
    }

    // Check 4: Keywords
    if (!keywords || keywords.trim().length === 0) {
      results.push({
        label: 'Keywords',
        status: 'warning',
        message: 'No keywords added. Add relevant keywords for better indexing.',
        points: 0,
      })
    } else {
      const keywordCount = keywords.split(',').filter((k) => k.trim().length > 0).length
      if (keywordCount < 3) {
        results.push({
          label: 'Keywords',
          status: 'warning',
          message: `Only ${keywordCount} keyword(s). Add 5-10 relevant keywords.`,
          points: 5,
        })
      } else if (keywordCount > 15) {
        results.push({
          label: 'Keywords',
          status: 'warning',
          message: `${keywordCount} keywords is too many. Focus on 5-10 most relevant.`,
          points: 5,
        })
      } else {
        results.push({
          label: 'Keywords',
          status: 'pass',
          message: `${keywordCount} keywords added. Good coverage!`,
          points: 10,
        })
      }
    }

    // Check 5: Meta Image
    if (!metaImage && !ogImage && !twitterImage) {
      results.push({
        label: 'Social Media Image',
        status: 'fail',
        message: 'No images set. Add at least a meta image for social shares.',
        points: 0,
      })
    } else if (metaImage || (ogImage && twitterImage)) {
      results.push({
        label: 'Social Media Image',
        status: 'pass',
        message: 'Social media images configured.',
        points: 10,
      })
    } else {
      results.push({
        label: 'Social Media Image',
        status: 'warning',
        message: 'Partially configured. Add images for better social sharing.',
        points: 5,
      })
    }

    // Check 6: Open Graph
    const hasOgTitle = ogTitle || metaTitle || title
    const hasOgDesc = ogDescription || metaDescription
    const hasOgImage = ogImage || metaImage

    if (hasOgTitle && hasOgDesc && hasOgImage) {
      results.push({
        label: 'Open Graph (Facebook)',
        status: 'pass',
        message: 'Fully optimized for Facebook/LinkedIn sharing.',
        points: 10,
      })
    } else {
      const missing = []
      if (!hasOgTitle) missing.push('title')
      if (!hasOgDesc) missing.push('description')
      if (!hasOgImage) missing.push('image')

      results.push({
        label: 'Open Graph (Facebook)',
        status: 'warning',
        message: `Missing: ${missing.join(', ')}. Improve Facebook shares.`,
        points: 5,
      })
    }

    // Check 7: Twitter Card
    const hasTwitterTitle = twitterTitle || ogTitle || metaTitle || title
    const hasTwitterDesc = twitterDescription || ogDescription || metaDescription
    const hasTwitterImage = twitterImage || ogImage || metaImage

    if (hasTwitterTitle && hasTwitterDesc && hasTwitterImage) {
      results.push({
        label: 'Twitter Card',
        status: 'pass',
        message: 'Fully optimized for Twitter/X sharing.',
        points: 10,
      })
    } else {
      const missing = []
      if (!hasTwitterTitle) missing.push('title')
      if (!hasTwitterDesc) missing.push('description')
      if (!hasTwitterImage) missing.push('image')

      results.push({
        label: 'Twitter Card',
        status: 'warning',
        message: `Missing: ${missing.join(', ')}. Improve Twitter shares.`,
        points: 5,
      })
    }

    // Check 8: Canonical URL (bonus)
    if (canonicalUrl) {
      results.push({
        label: 'Canonical URL',
        status: 'pass',
        message: 'Canonical URL set. Helps prevent duplicate content issues.',
        points: 10,
      })
    }

    return results
  }, [
    title,
    metaTitle,
    metaDescription,
    focusKeyword,
    keywords,
    metaImage,
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle,
    twitterDescription,
    twitterImage,
    canonicalUrl,
  ])

  const totalPoints = checks.reduce((sum, check) => sum + check.points, 0)
  const maxPoints = 100
  const score = Math.round((totalPoints / maxPoints) * 100)

  // Determine overall status
  let overallStatus: 'excellent' | 'good' | 'needs-improvement' | 'poor'
  let statusIcon: React.ReactNode

  if (score >= 80) {
    overallStatus = 'excellent'
    statusIcon = <CheckCircle2 size={28} />
  } else if (score >= 60) {
    overallStatus = 'good'
    statusIcon = <TrendingUp size={28} />
  } else if (score >= 40) {
    overallStatus = 'needs-improvement'
    statusIcon = <AlertTriangle size={28} />
  } else {
    overallStatus = 'poor'
    statusIcon = <XCircle size={28} />
  }

  const passCount = checks.filter((c) => c.status === 'pass').length
  const warningCount = checks.filter((c) => c.status === 'warning').length
  const failCount = checks.filter((c) => c.status === 'fail').length

  return (
    <div className="seo-validation">
      {/* Score Card */}
      <div className={`seo-validation__score seo-validation__score--${overallStatus}`}>
        <div className="seo-validation__score-icon">
          <Sparkles size={18} />
        </div>

        <div className="seo-validation__score-header">
          <div className={`seo-validation__badge seo-validation__badge--${overallStatus}`}>
            {statusIcon}
            <span className="seo-validation__badge-value">
              {score}
              <span className="seo-validation__badge-percent">%</span>
            </span>
          </div>

          <div className="seo-validation__score-info">
            <h3 className="seo-validation__title">SEO Health Score</h3>
            <p className="seo-validation__subtitle">
              {overallStatus === 'excellent' && 'Excellent! Your page is well optimized.'}
              {overallStatus === 'good' && 'Good job! A few improvements will make it great.'}
              {overallStatus === 'needs-improvement' && 'Needs work. Follow the suggestions below.'}
              {overallStatus === 'poor' && 'Poor SEO. Please address the issues below.'}
            </p>
          </div>
        </div>

        <div className="seo-validation__progress">
          <div className="seo-validation__progress-bar">
            <div
              className="seo-validation__progress-fill"
              style={{ width: `${score}%` }}
              role="progressbar"
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        <div className="seo-validation__stats">
          <div className="seo-validation__stat seo-validation__stat--pass">
            <CheckCircle2 size={16} />
            <span>{passCount} Passed</span>
          </div>
          <div className="seo-validation__stat seo-validation__stat--warning">
            <AlertTriangle size={16} />
            <span>{warningCount} Warnings</span>
          </div>
          <div className="seo-validation__stat seo-validation__stat--fail">
            <XCircle size={16} />
            <span>{failCount} Failed</span>
          </div>
        </div>
      </div>

      {/* Checks List */}
      <div className="seo-validation__checks">
        {checks.map((check, index) => (
          <div
            key={index}
            className={`seo-validation__check seo-validation__check--${check.status}`}
          >
            <div className="seo-validation__check-icon">
              {check.status === 'pass' && <CheckCircle2 size={18} />}
              {check.status === 'warning' && <AlertTriangle size={18} />}
              {check.status === 'fail' && <XCircle size={18} />}
            </div>
            <div className="seo-validation__check-content">
              <div className="seo-validation__check-header">
                <span className="seo-validation__check-label">{check.label}</span>
                <span className="seo-validation__check-points">{check.points} pts</span>
              </div>
              <p className="seo-validation__check-message">{check.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
