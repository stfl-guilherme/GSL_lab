import type { ReactNode } from 'react'

// Rótulo vermelho em caixa alta que fica acima do título de cada seção.
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-5 text-[12px] font-medium tracking-[.24em] text-brand uppercase">{children}</p>
  )
}
