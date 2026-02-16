'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface ContactFormProps {
  locale: string
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
}

interface FormValues {
  name: string
  phone: string
  email: string
  organization: string
  message: string
  consentGiven: boolean
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm({
  locale,
  formHeading,
  formNamePlaceholder,
  formPhonePlaceholder,
  formEmailPlaceholder,
  formOrganizationPlaceholder,
  formMessagePlaceholder,
  consentText,
  submitButtonText,
  successMessage,
  errorMessage,
  sendAnotherButtonText,
  loadingText,
  nameRequiredError,
  emailRequiredError,
  consentRequiredError,
}: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>('idle')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      organization: '',
      message: '',
      consentGiven: false,
    },
  })

  const consentGiven = watch('consentGiven')

  const onSubmit = async (data: FormValues) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      })

      if (res.ok) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-teal-400" />
          {successMessage && <p className="text-lg text-white">{successMessage}</p>}
          {sendAnotherButtonText && (
            <Button
              variant="outline"
              onClick={() => setStatus('idle')}
              className="mt-4 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              {sendAnotherButtonText}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
      {formHeading && (
        <h3 className="mb-6 text-xl font-semibold text-white md:text-2xl">{formHeading}</h3>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 3-column row: name, phone, email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Input
              placeholder={formNamePlaceholder}
              className="border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 focus-visible:border-teal-400/50 focus-visible:ring-teal-400/20"
              aria-invalid={!!errors.name}
              {...register('name', { required: true })}
            />
            {errors.name && nameRequiredError && (
              <p className="mt-1 text-xs text-red-400">{nameRequiredError}</p>
            )}
          </div>
          <div>
            <Input
              placeholder={formPhonePlaceholder}
              className="border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 focus-visible:border-teal-400/50 focus-visible:ring-teal-400/20"
              {...register('phone')}
            />
          </div>
          <div>
            <Input
              placeholder={formEmailPlaceholder}
              type="email"
              className="border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 focus-visible:border-teal-400/50 focus-visible:ring-teal-400/20"
              aria-invalid={!!errors.email}
              {...register('email', {
                required: true,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email',
                },
              })}
            />
            {errors.email && emailRequiredError && (
              <p className="mt-1 text-xs text-red-400">{emailRequiredError}</p>
            )}
          </div>
        </div>

        {/* Organization */}
        <Input
          placeholder={formOrganizationPlaceholder}
          className="border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 focus-visible:border-teal-400/50 focus-visible:ring-teal-400/20"
          {...register('organization')}
        />

        {/* Message */}
        <Textarea
          placeholder={formMessagePlaceholder}
          rows={4}
          className="border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 focus-visible:border-teal-400/50 focus-visible:ring-teal-400/20"
          {...register('message')}
        />

        {/* Consent + Submit */}
        {consentText && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={consentGiven}
                onCheckedChange={(checked) => setValue('consentGiven', checked === true)}
                className="mt-0.5 border-white/20 data-[state=checked]:border-teal-400 data-[state=checked]:bg-teal-400"
              />
              <span className="text-sm leading-snug text-white/60">{consentText}</span>
            </label>
          </div>
        )}
        {errors.consentGiven && consentRequiredError && (
          <p className="text-xs text-red-400">{consentRequiredError}</p>
        )}

        {status === 'error' && errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loadingText}
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    </div>
  )
}
