'use client'

import { Tooltip } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavItem({ href, title, children }) {
  const pathname = usePathname()

  return (
    <Tooltip title={title} placement="right" arrow>
      <Link href={href} className={pathname === href ? 'active' : ''}>
        {children}
      </Link>
    </Tooltip>
  )
}
