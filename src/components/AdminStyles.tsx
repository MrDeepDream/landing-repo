'use client'

import { useEffect } from 'react'

export const AdminStyles: React.FC = () => {
  useEffect(() => {
    // Inject CSS to remove dropdown transparency
    const style = document.createElement('style')
    style.id = 'admin-dropdown-fix'
    style.textContent = `
      /* Remove backdrop filters from dropdowns */
      [data-radix-select-viewport],
      [data-radix-select-content],
      [data-radix-popper-content-wrapper],
      [data-radix-dropdown-menu-content],
      [data-radix-popover-content] {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        background-color: rgb(30, 30, 30) !important;
        opacity: 1 !important;
      }

      /* Dropdown menu items */
      [data-radix-select-viewport] > div,
      div[role='option'],
      div[role='menuitem'],
      [data-radix-collection-item] {
        background-color: rgb(30, 30, 30) !important;
        opacity: 1 !important;
      }

      /* Hover states */
      div[role='option']:hover,
      div[role='option'][data-highlighted],
      div[role='menuitem']:hover,
      div[role='menuitem'][data-highlighted] {
        background-color: rgb(50, 50, 50) !important;
      }

      /* Selected states */
      div[role='option'][data-state='checked'],
      div[role='option'][aria-selected='true'] {
        background-color: rgb(60, 60, 60) !important;
      }
    `

    document.head.appendChild(style)

    return () => {
      const existingStyle = document.getElementById('admin-dropdown-fix')
      if (existingStyle) {
        existingStyle.remove()
      }
    }
  }, [])

  return null
}
