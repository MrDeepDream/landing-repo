import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayload } from '@/lib/payload'

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().max(50).optional().default(''),
  email: z.string().email().max(200),
  organization: z.string().max(300).optional().default(''),
  message: z.string().max(5000).optional().default(''),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'Consent is required' }),
  }),
  locale: z.string().max(10).optional().default(''),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    const payload = await getPayload()

    await payload.create({
      collection: 'contact-submissions',
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        organization: data.organization,
        message: data.message,
        consentGiven: data.consentGiven,
        locale: data.locale,
        status: 'new',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    console.error('Contact form submission error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
