import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    group: 'Forms',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    useAsTitle: 'name',
  },
  access: {
    // Anyone can submit the form
    create: () => true,
    // Only admins can read/update/delete
    read: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'organization',
      type: 'text',
      required: false,
    },
    {
      name: 'message',
      type: 'textarea',
      required: false,
    },
    {
      name: 'consentGiven',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'locale',
      type: 'text',
      required: false,
      admin: {
        description: 'Locale from which the form was submitted',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
