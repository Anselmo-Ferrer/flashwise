'use client'

import React from 'react'
import clsx from 'clsx'

type ScrollViewProps = {
  children: React.ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
}

export default function ScrollView({ children, className = '', direction = 'vertical' }: ScrollViewProps) {
  return (
    <div
      className={clsx(
        'overflow-auto rounded-xl',
        direction === 'vertical' && 'max-h-[2000px]',
        direction === 'horizontal' && 'whitespace-nowrap overflow-x-auto',
        className
      )}
    >
      {children}
    </div>
  )
}