import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EyebrowProps {
  children: ReactNode
  as?: 'p' | 'h2' // h2 quando o rótulo é o próprio título da seção
  id?: string
  className?: string
}

// Rótulo vermelho em caixa alta que fica acima do título de cada seção.
export function Eyebrow({ children, as: Tag = 'p', id, className }: EyebrowProps) {
  return (
    <Tag id={id} className={cn('mb-5 text-[12px] font-medium tracking-[.24em] text-brand uppercase', className)}>
      {children}
    </Tag>
  )
}
