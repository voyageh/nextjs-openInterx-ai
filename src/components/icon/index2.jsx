import React, { lazy, Suspense, useMemo, forwardRef } from 'react'
import clsx from 'clsx'
import { Spin } from 'antd'

// 使用forwardRef转发ref
const IconSvg = forwardRef(({ name, className, ...props }, ref) => {
  const IconComponent = useMemo(() => lazy(() => import(`@/assets/images/${name}.svg`)), [name])

  return (
    <span ref={ref} className={clsx('icon-wrapper', className)} {...props}>
      <Suspense fallback={<Spin />}>
        <IconComponent />
      </Suspense>
    </span>
  )
})

export default IconSvg
