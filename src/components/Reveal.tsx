import type { ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: 0 | 1 | 2 // 0 = sem atraso, 1 = 0,12 s, 2 = 0,24 s
}

// Envolve qualquer bloco e faz ele surgir suavemente quando entra na tela.
// O efeito em si está no CSS (.reveal / .is-visible); aqui só ligamos a classe.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn('reveal', delay > 0 && `reveal-d${delay}`, inView && 'is-visible', className)}
    >
      {children}
    </div>
  )
}
