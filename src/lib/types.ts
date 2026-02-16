export interface SiteSettings {
  siteTitle: string
  siteLogo?: {
    url: string
    alt?: string
  }
  logoAltText?: string
  tagline?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  hideHeaderControls?: boolean
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  openInNewTab?: boolean
  children?: Array<{
    id: string
    label: string
    href: string
    openInNewTab?: boolean
  }>
}

export interface FooterMessengerLink {
  id?: string | null
  platform: 'telegram' | 'viber' | 'whatsapp' | 'signal'
  label: string
  url: string
}

export interface FooterData {
  title?: string
  // Contact Info
  sectionTitle?: string
  sectionSubtitle?: string
  messengerLinks?: FooterMessengerLink[]
  phoneLabel?: string
  phoneNumber?: string
  phoneHref?: string
  emailLabel?: string
  emailAddress?: string
  emailHref?: string
  disclaimer?: string
  // Contact Form
  formHeading?: string
  formNamePlaceholder?: string
  formPhonePlaceholder?: string
  formEmailPlaceholder?: string
  formOrganizationPlaceholder?: string
  formMessagePlaceholder?: string
  consentText?: string
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
  sendAnotherButtonText?: string
  loadingText?: string
  nameRequiredError?: string
  emailRequiredError?: string
  consentRequiredError?: string
  // Bottom Bar
  copyrightText?: string
}
