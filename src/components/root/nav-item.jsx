'use client'

import { Tooltip } from 'antd'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavItem({ href, children }) {
  const pathname = usePathname()

  return (
    <Tooltip title="Sample video" placement="right">
      <Link href={href} className={pathname === href ? 'active' : ''}>
        {children}
      </Link>
    </Tooltip>
  )
}
